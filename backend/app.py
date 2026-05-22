from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
import os
import logging
from datetime import datetime, timedelta
from sqlalchemy import func, text, inspect
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
from functools import wraps
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, messaging

load_dotenv()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading', ping_timeout=60, ping_interval=25)

logging.basicConfig(level=logging.INFO)

# ============================
# CONFIG BD y JWT
# ============================

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, '..', 'database', 'marqrun.db')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DATABASE_PATH
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_EXPIRATION_HOURS'] = 24

# Crear carpeta uploads si no existe
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# ============================
# INICIALIZAR FIREBASE (OPCIONAL)
# ============================
firebase_key_path = os.path.join(BASE_DIR, 'marqrun-df27a-firebase-adminsdk-fbsvc-b47f8cbaf7.json')
fcm_available = False

if os.path.exists(firebase_key_path):
    try:
        cred = credentials.Certificate(firebase_key_path)
        firebase_admin.initialize_app(cred)
        fcm_available = True
        logging.info("✅ Firebase inicializado correctamente")
    except Exception as e:
        fcm_available = False
        logging.warning(f"⚠️ Firebase no disponible: {e}")
else:
    logging.warning("⚠️ Archivo Firebase no encontrado - notificaciones push deshabilitadas")

db = SQLAlchemy(app)


# ============================
# MODELOS
# ============================

class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=True)
    avatar = db.Column(db.String(500), nullable=True)
    bio = db.Column(db.String(300), nullable=True)
    location = db.Column(db.String(100), nullable=True)

    membresias = db.relationship("GrupoMiembro", backref="usuario", cascade="all, delete")

    rol = db.Column(db.String(20), nullable=False, default="miembro")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password) if self.password_hash else False

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "avatar": self.avatar,
            "bio": self.bio,
            "location": self.location,
            "grupos": [m.grupo_id for m in self.membresias],
            "rol": self.rol,
            "active": self.active
        }

    active = db.Column(db.Boolean, nullable=False, default=True)


class Grupo(db.Model):
    __tablename__ = "grupos"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)

    # 🔥 NUEVO: creador
    creador_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)

    entrenamientos = db.relationship("Entrenamiento", backref="grupo", cascade="all, delete")
    miembros = db.relationship("GrupoMiembro", backref="grupo", cascade="all, delete")
    tipo = db.Column(db.String(20), nullable=False, default="publico")
    password_hash = db.Column(db.String(128), nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password) if self.password_hash else False

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "creador_id": self.creador_id,
            "tipo": self.tipo,
            "miembros_count": len(self.miembros)
        }


class Entrenamiento(db.Model):
    __tablename__ = "entrenamientos"

    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.String(20), nullable=False)
    hora = db.Column(db.String(10), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    ubicacion = db.Column(db.String(100), nullable=True)
    dificultad = db.Column(db.String(20), nullable=True)
    duracion = db.Column(db.Integer, nullable=False, default=60)

    grupo_id = db.Column(db.Integer, db.ForeignKey("grupos.id"), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    usuario = db.relationship("Usuario", backref="entrenamientos")

    asistencias = db.relationship("Asistencia", backref="entrenamiento", cascade="all, delete")

    def to_dict(self):
        return {
            "id": self.id,
            "fecha": self.fecha,
            "hora": self.hora,
            "tipo": self.tipo,
            "ubicacion": self.ubicacion,
            "dificultad": self.dificultad,
            "duracion": self.duracion,
            "grupo_id": self.grupo_id,
            "usuario_id": self.usuario_id
        }


class Asistencia(db.Model):
    __tablename__ = "asistencias"

    id = db.Column(db.Integer, primary_key=True)
    estado = db.Column(db.String(20), nullable=False)

    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    entrenamiento_id = db.Column(db.Integer, db.ForeignKey("entrenamientos.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "estado": self.estado,
            "usuario_id": self.usuario_id,
            "entrenamiento_id": self.entrenamiento_id
        }


class GrupoMiembro(db.Model):
    __tablename__ = "grupo_miembros"

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    grupo_id = db.Column(db.Integer, db.ForeignKey("grupos.id"), nullable=False)
    rol = db.Column(db.String(20), nullable=False, default="miembro")

    def to_dict(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "grupo_id": self.grupo_id,
            "rol": self.rol
        }


class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    actor_id = db.Column(db.Integer, nullable=True)
    action = db.Column(db.String(150), nullable=False)
    target = db.Column(db.String(100), nullable=True)
    details = db.Column(db.String(300), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat(),
            "actor_id": self.actor_id,
            "action": self.action,
            "target": self.target,
            "details": self.details
        }


class Notificacion(db.Model):
    __tablename__ = "notificaciones"

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    entrenamiento_id = db.Column(db.Integer, db.ForeignKey("entrenamientos.id"), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)  # '24h_antes', '1h_antes'
    enviada = db.Column(db.Boolean, nullable=False, default=False)
    fecha_creacion = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    fecha_envio = db.Column(db.DateTime, nullable=True)
    usuario = db.relationship("Usuario", backref="notificaciones")
    entrenamiento = db.relationship("Entrenamiento", backref="notificaciones")

    def to_dict(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "entrenamiento_id": self.entrenamiento_id,
            "tipo": self.tipo,
            "enviada": self.enviada,
            "fecha_envio": self.fecha_envio.isoformat() if self.fecha_envio else None
        }


class DeviceToken(db.Model):
    __tablename__ = "device_tokens"

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    device_token = db.Column(db.String(500), nullable=False, unique=True)
    platform = db.Column(db.String(20), nullable=False)  # 'ios', 'android', 'web'
    fecha_creacion = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    activo = db.Column(db.Boolean, nullable=False, default=True)
    usuario = db.relationship("Usuario", backref="device_tokens")

    def to_dict(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "device_token": self.device_token[-20:],  # Mostrar solo últimos 20 caracteres
            "platform": self.platform,
            "fecha_creacion": self.fecha_creacion.isoformat(),
            "activo": self.activo
        }


class Mensaje(db.Model):
    __tablename__ = "mensajes"

    id = db.Column(db.Integer, primary_key=True)
    grupo_id = db.Column(db.Integer, db.ForeignKey("grupos.id"), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    fecha_creacion = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    leido = db.Column(db.Boolean, nullable=False, default=False)
    
    grupo = db.relationship("Grupo", backref="mensajes")
    usuario = db.relationship("Usuario", backref="mensajes")

    def to_dict(self):
        return {
            "id": self.id,
            "grupo_id": self.grupo_id,
            "usuario_id": self.usuario_id,
            "usuario_nombre": self.usuario.nombre,
            "contenido": self.contenido,
            "fecha_creacion": self.fecha_creacion.isoformat(),
            "leido": self.leido
        }


def log_action(actor_id, action, target=None, details=None):
    try:
        log = AuditLog(actor_id=actor_id, action=action, target=target, details=details)
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error guardando log de auditoría: {e}")


def ensure_password_column():
    inspector = inspect(db.engine)
    with db.engine.connect() as conn:
        if "usuarios" in inspector.get_table_names():
            columnas = [col["name"] for col in inspector.get_columns("usuarios")]
            if "password_hash" not in columnas:
                conn.execute(text('ALTER TABLE usuarios ADD COLUMN password_hash VARCHAR(128)'))

        if "grupos" in inspector.get_table_names():
            columnas = [col["name"] for col in inspector.get_columns("grupos")]
            if "tipo" not in columnas:
                conn.execute(text('ALTER TABLE grupos ADD COLUMN tipo VARCHAR(20) DEFAULT "publico"'))
            if "password_hash" not in columnas:
                conn.execute(text('ALTER TABLE grupos ADD COLUMN password_hash VARCHAR(128)'))

        if "entrenamientos" in inspector.get_table_names():
            columnas = [col["name"] for col in inspector.get_columns("entrenamientos")]
            if "usuario_id" not in columnas:
                conn.execute(text('ALTER TABLE entrenamientos ADD COLUMN usuario_id INTEGER DEFAULT 0'))
            if "duracion" not in columnas:
                conn.execute(text('ALTER TABLE entrenamientos ADD COLUMN duracion INTEGER DEFAULT 60'))
                conn.execute(text('ALTER TABLE entrenamientos ADD COLUMN duracion INTEGER DEFAULT 60'))

        if "usuarios" in inspector.get_table_names():
            columnas = [col["name"] for col in inspector.get_columns("usuarios")]
            if "avatar" not in columnas:
                conn.execute(text('ALTER TABLE usuarios ADD COLUMN avatar VARCHAR(500)'))
            if "bio" not in columnas:
                conn.execute(text('ALTER TABLE usuarios ADD COLUMN bio VARCHAR(300)'))
            if "location" not in columnas:
                conn.execute(text('ALTER TABLE usuarios ADD COLUMN location VARCHAR(100)'))
            if "rol" not in columnas:
                conn.execute(text('ALTER TABLE usuarios ADD COLUMN rol VARCHAR(20) DEFAULT "miembro"'))
            if "active" not in columnas:
                conn.execute(text('ALTER TABLE usuarios ADD COLUMN active BOOLEAN DEFAULT 1'))

        if "audit_logs" not in inspector.get_table_names():
            conn.execute(text('CREATE TABLE audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME NOT NULL, actor_id INTEGER, action VARCHAR(150) NOT NULL, target VARCHAR(100), details VARCHAR(300))'))

        if "notificaciones" not in inspector.get_table_names():
            conn.execute(text('CREATE TABLE notificaciones (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL, entrenamiento_id INTEGER NOT NULL, tipo VARCHAR(20) NOT NULL, enviada BOOLEAN DEFAULT 0, fecha_creacion DATETIME NOT NULL, fecha_envio DATETIME, FOREIGN KEY (usuario_id) REFERENCES usuarios(id), FOREIGN KEY (entrenamiento_id) REFERENCES entrenamientos(id))'))

        if "device_tokens" not in inspector.get_table_names():
            conn.execute(text('CREATE TABLE device_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL, device_token VARCHAR(500) NOT NULL UNIQUE, platform VARCHAR(20) NOT NULL, fecha_creacion DATETIME NOT NULL, activo BOOLEAN DEFAULT 1, FOREIGN KEY (usuario_id) REFERENCES usuarios(id))'))

        if "mensajes" not in inspector.get_table_names():
            conn.execute(text('CREATE TABLE mensajes (id INTEGER PRIMARY KEY AUTOINCREMENT, grupo_id INTEGER NOT NULL, usuario_id INTEGER NOT NULL, contenido TEXT NOT NULL, fecha_creacion DATETIME NOT NULL, leido BOOLEAN DEFAULT 0, FOREIGN KEY (grupo_id) REFERENCES grupos(id), FOREIGN KEY (usuario_id) REFERENCES usuarios(id))'))

        conn.commit()


def ensure_admin_exists():
    admin_existente = Usuario.query.filter_by(rol="admin").first()
    if admin_existente:
        return

    primer_usuario = Usuario.query.order_by(Usuario.id).first()
    if primer_usuario:
        primer_usuario.rol = "admin"
        try:
            db.session.commit()
            logging.info(f"Usuario {primer_usuario.id} - {primer_usuario.nombre} promovido a admin automáticamente.")
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error asignando admin automático: {e}")

# ============================
# RUTAS
# ============================

# -------- JWT & AUTENTICACIÓN --------

def generar_token(usuario_id):
    """Genera un token JWT válido por 24 horas"""
    try:
        payload = {
            'usuario_id': usuario_id,
            'exp': datetime.utcnow() + timedelta(hours=app.config['JWT_EXPIRATION_HOURS']),
            'iat': datetime.utcnow()
        }
        token = jwt.encode(payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')
        return token
    except Exception as e:
        logging.error(f"Error generando token: {e}")
        return None

def verificar_token(f):
    """Decorador para verificar token JWT en las peticiones"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Buscar token en headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({"error": "Formato de token inválido. Use 'Bearer <token>'"}), 401
        
        if not token:
            return jsonify({"error": "Token requerido. Autorización denegada."}), 401
        
        try:
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            request.usuario_id = data['usuario_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado. Por favor, inicia sesión nuevamente."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token inválido. Autorización denegada."}), 401
        
        return f(*args, **kwargs)
    return decorated

@app.route("/")
def index():
    return jsonify({"estado": "Backend MARQRun PRO funcionando"})

# -------- SERVIR ARCHIVOS FRONTEND --------

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# -------- USUARIOS --------

@app.route("/usuarios", methods=["POST"])
def crear_usuario():
    datos = request.get_json()

    nombre = datos.get("nombre", "").strip()
    password = datos.get("password", "")
    rol = "admin" if Usuario.query.count() == 0 else "miembro"

    if not nombre or not password:
        return jsonify({"error": "Nombre y contraseña son obligatorios."}), 400

    if len(password) < 6:
        return jsonify({"error": "La contraseña debe tener al menos 6 caracteres."}), 400

    existente = Usuario.query.filter(func.lower(Usuario.nombre) == func.lower(nombre)).first()
    if existente:
        return jsonify({"error": f"El usuario '{nombre}' ya existe. Por favor, elija otro nombre."}), 400

    nuevo = Usuario(nombre=nombre, rol=rol)
    nuevo.set_password(password)

    try:
        db.session.add(nuevo)
        db.session.commit()
        logging.info(f"Usuario creado: {nuevo.id} - {nuevo.nombre}")
        log_action(nuevo.id, "Creación de usuario", target=f"usuario:{nuevo.id}", details=f"Nombre={nuevo.nombre}")
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creando usuario: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify(nuevo.to_dict())


@app.route("/login", methods=["POST"])
def login():
    datos = request.get_json()

    nombre = datos.get("nombre", "").strip()
    password = datos.get("password", "")

    if not nombre or not password:
        return jsonify({"error": "Nombre y contraseña son obligatorios."}), 400

    usuario = Usuario.query.filter(func.lower(Usuario.nombre) == func.lower(nombre)).first()
    if not usuario:
        return jsonify({"error": "Usuario indicado no existe."}), 404
    if not usuario.check_password(password):
        return jsonify({"error": "Contraseña incorrecta."}), 401
    if usuario.active is False:
        return jsonify({"error": "Cuenta desactivada. Contacta a un administrador."}), 403

    # Generar token JWT
    token = generar_token(usuario.id)
    if not token:
        return jsonify({"error": "Error generando token de autenticación."}), 500
    
    user_data = usuario.to_dict()
    user_data['token'] = token
    return jsonify(user_data)


@app.route("/usuarios", methods=["GET"])
def obtener_usuarios():
    return jsonify([u.to_dict() for u in Usuario.query.all()])


@app.route("/usuarios/<int:usuario_id>/cambiar-rol", methods=["POST"])
@verificar_token
def cambiar_rol_usuario(usuario_id):
    """Cambiar rol de un usuario (solo admins autenticados)"""
    datos = request.get_json()
    nuevo_rol = datos.get("nuevo_rol")
    solicitante_id = request.usuario_id  # Del token JWT

    if not nuevo_rol:
        return jsonify({"error": "Nuevo rol es obligatorio."}), 400

    if nuevo_rol not in ["admin", "gestor", "miembro"]:
        return jsonify({"error": "Nuevo rol inválido. Use 'admin', 'gestor' o 'miembro'."}), 400

    solicitante = Usuario.query.get(solicitante_id)
    if not solicitante or solicitante.rol != "admin":
        return jsonify({"error": "Solo un administrador puede cambiar roles."}), 403

    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado."}), 404

    if usuario.id == solicitante.id and nuevo_rol != "admin":
        return jsonify({"error": "No puedes quitarte el rol de administrador a ti mismo."}), 403

    if usuario.rol == nuevo_rol:
        return jsonify({"mensaje": f"El usuario ya tiene el rol '{nuevo_rol}'.", "usuario": usuario.to_dict()}), 200

    usuario.rol = nuevo_rol
    try:
        db.session.commit()
        logging.info(f"Usuario {usuario_id} rol cambiado a {nuevo_rol} por {solicitante_id}")
        log_action(solicitante.id, "Cambio de rol", target=f"usuario:{usuario.id}", details=f"{usuario.nombre} -> {nuevo_rol}")
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error cambiando rol: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify({"mensaje": f"Usuario cambiado a {nuevo_rol}.", "usuario": usuario.to_dict()})


@app.route("/usuarios/<int:usuario_id>/toggle-estado", methods=["POST"])
@verificar_token
def toggle_estado_usuario(usuario_id):
    """Cambiar estado de una cuenta (solo admins autenticados)"""
    datos = request.get_json()
    activo = datos.get("activo")
    solicitante_id = request.usuario_id  # Del token JWT

    if activo is None:
        return jsonify({"error": "Parámetro 'activo' es obligatorio."}), 400

    solicitante = Usuario.query.get(solicitante_id)
    if not solicitante or solicitante.rol != "admin":
        return jsonify({"error": "Solo un administrador puede cambiar el estado de la cuenta."}), 403

    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado."}), 404

    if usuario.id == solicitante.id and not activo:
        return jsonify({"error": "No puedes desactivar tu propia cuenta."}), 403

    usuario.active = bool(activo)
    try:
        db.session.commit()
        estado_str = "activado" if usuario.active else "desactivado"
        logging.info(f"Usuario {usuario_id} {estado_str} por {solicitante_id}")
        log_action(solicitante.id, f"Cambio de estado ({estado_str})", target=f"usuario:{usuario.id}", details=usuario.nombre)
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error cambiando estado: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify({"mensaje": f"Usuario {'activado' if usuario.active else 'desactivado'}.", "usuario": usuario.to_dict()})


    datos = request.get_json()
    solicitante_id = datos.get("solicitante_id")
    activo = datos.get("activo")

    if solicitante_id is None or activo is None:
        return jsonify({"error": "Solicitante_id y activo son obligatorios."}), 400

    solicitante = Usuario.query.get(solicitante_id)
    if not solicitante or solicitante.rol != "admin":
        return jsonify({"error": "Solo un administrador puede cambiar el estado de la cuenta."}), 403

    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado."}), 404

    if usuario.id == solicitante.id and not bool(activo):
        return jsonify({"error": "No puedes desactivar tu propia cuenta."}), 403

    usuario.active = bool(activo)
    try:
        db.session.commit()
        log_action(solicitante.id, "Cambio de estado de cuenta", target=f"usuario:{usuario.id}", details=f"activo={usuario.active}")
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error cambiando estado de cuenta: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify({"mensaje": f"Usuario {'activado' if usuario.active else 'desactivado'}.", "usuario": usuario.to_dict()})


@app.route('/admin/logs', methods=['GET'])
@verificar_token
def obtener_logs_admin():
    """Obtener audit logs (solo admins autenticados)"""
    usuario_id = request.usuario_id  # Del token JWT

    solicitante = Usuario.query.get(usuario_id)
    if not solicitante or solicitante.rol != 'admin':
        return jsonify({"error": "Solo un administrador puede ver los logs."}), 403

    logs = AuditLog.query.order_by(AuditLog.timestamp.desc()).limit(100).all()
    return jsonify([log.to_dict() for log in logs])


# -------- GRUPOS --------

@app.route("/grupos", methods=["GET"])
def obtener_grupos():
    return jsonify([g.to_dict() for g in Grupo.query.all()])


@app.route("/grupos", methods=["POST"])
def crear_grupo():
    datos = request.get_json()

    # Verificar si el nombre ya existe (case-insensitive)
    existente = Grupo.query.filter(func.lower(Grupo.nombre) == func.lower(datos["nombre"])).first()
    if existente:
        return jsonify({"error": f"El grupo '{datos['nombre']}' ya existe. Por favor, elija otro nombre."}), 400

    # Verificar que el creador existe
    creador = Usuario.query.get(datos["creador_id"])
    if not creador:
        return jsonify({"error": "Creador no encontrado."}), 400

    if creador.rol not in ["admin", "gestor"]:
        return jsonify({"error": "No tienes permiso para crear grupos."}), 403

    tipo = datos.get("tipo", "publico")
    if tipo not in ["publico", "privado"]:
        return jsonify({"error": "Tipo de grupo inválido. Use 'publico' o 'privado'."}), 400

    password = datos.get("password", "")
    if tipo == "privado" and not password:
        return jsonify({"error": "La contraseña del grupo es obligatoria para grupos privados."}), 400

    nuevo = Grupo(
        nombre=datos["nombre"],
        creador_id=datos["creador_id"],
        tipo=tipo
    )
    if tipo == "privado":
        nuevo.set_password(password)

    try:
        db.session.add(nuevo)
        db.session.commit()
        logging.info(f"Grupo creado: {nuevo.id} - {nuevo.nombre}")

        creador_miembro = GrupoMiembro(
            usuario_id=datos["creador_id"],
            grupo_id=nuevo.id,
            rol="coordinador"
        )
        db.session.add(creador_miembro)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creando grupo: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify(nuevo.to_dict())


@app.route("/grupos/<int:grupo_id>/miembros", methods=["GET"])
def obtener_miembros_grupo(grupo_id):
    miembros = GrupoMiembro.query.filter_by(grupo_id=grupo_id).all()
    return jsonify([{
        "usuario_id": m.usuario_id,
        "rol": m.rol,
        "nombre": m.usuario.nombre,
        "avatar": m.usuario.avatar,
        "bio": m.usuario.bio,
        "location": m.usuario.location
    } for m in miembros])


@app.route("/grupos/<int:grupo_id>", methods=["GET"])
def obtener_grupo(grupo_id):
    grupo = Grupo.query.get(grupo_id)
    if not grupo:
        return jsonify({"error": "Grupo no encontrado."}), 404

    miembros = [{
        "usuario_id": m.usuario_id,
        "rol": m.rol,
        "nombre": m.usuario.nombre,
        "avatar": m.usuario.avatar,
        "bio": m.usuario.bio,
        "location": m.usuario.location
    } for m in grupo.miembros]

    creador = Usuario.query.get(grupo.creador_id)
    return jsonify({
        **grupo.to_dict(),
        "miembros": miembros,
        "creador_nombre": creador.nombre if creador else None
    })


@app.route("/grupos/<int:grupo_id>/miembros", methods=["POST"])
def unirse_grupo(grupo_id):
    datos = request.get_json()
    usuario_id = datos.get("usuario_id")
    password = datos.get("password", "")

    if not usuario_id:
        return jsonify({"error": "Usuario no encontrado."}), 400

    grupo = Grupo.query.get(grupo_id)
    if not grupo:
        return jsonify({"error": "Grupo no encontrado."}), 404

    if grupo.tipo == "privado" and not grupo.check_password(password):
        return jsonify({"error": "Contraseña incorrecta para unirse a este grupo privado."}), 403

    existente = GrupoMiembro.query.filter_by(grupo_id=grupo_id, usuario_id=usuario_id).first()
    if existente:
        return jsonify({"error": "Ya eres miembro de este grupo."}), 400

    nuevo_miembro = GrupoMiembro(
        usuario_id=usuario_id,
        grupo_id=grupo_id,
        rol="miembro"
    )

    try:
        db.session.add(nuevo_miembro)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error uniendo usuario al grupo: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify(nuevo_miembro.to_dict())


@app.route("/grupos/<int:grupo_id>/miembros", methods=["DELETE"])
def salir_grupo(grupo_id):
    datos = request.get_json()
    usuario_id = datos.get("usuario_id")

    if not usuario_id:
        return jsonify({"error": "Usuario no encontrado."}), 400

    grupo = Grupo.query.get(grupo_id)
    if not grupo:
        return jsonify({"error": "Grupo no encontrado."}), 404

    miembro = GrupoMiembro.query.filter_by(grupo_id=grupo_id, usuario_id=usuario_id).first()
    if not miembro:
        return jsonify({"error": "No eres miembro de este grupo."}), 403

    if grupo.creador_id == int(usuario_id):
        return jsonify({"error": "El coordinador principal no puede salir del grupo. Debe borrar el grupo o transferir la propiedad."}), 403

    try:
        db.session.delete(miembro)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error al salir del grupo: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify({"mensaje": "Has salido del grupo."})


@app.route("/grupos/<int:grupo_id>", methods=["DELETE"])
def borrar_grupo(grupo_id):
    datos = request.get_json()
    usuario_id = datos.get("usuario_id")

    if not usuario_id:
        return jsonify({"error": "Usuario no encontrado."}), 400

    grupo = Grupo.query.get(grupo_id)
    if not grupo:
        return jsonify({"error": "Grupo no encontrado."}), 404

    if grupo.creador_id != int(usuario_id):
        return jsonify({"error": "Solo el coordinador principal puede borrar este grupo."}), 403

    try:
        db.session.delete(grupo)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error borrando grupo: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify({"mensaje": "Grupo borrado correctamente."})


@app.route("/usuarios/<int:usuario_id>", methods=["GET"])
def obtener_usuario(usuario_id):
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado."}), 404
    return jsonify(usuario.to_dict())


@app.route("/usuarios/<int:usuario_id>", methods=["PUT"])
@verificar_token
def editar_usuario(usuario_id):
    """Editar perfil del usuario autenticado"""
    if request.usuario_id != usuario_id:
        return jsonify({"error": "No puedes editar el perfil de otro usuario."}), 403
    
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado."}), 404

    # PUT
    nuevo_nombre = request.form.get("nombre", "").strip()
    nuevo_avatar_url = request.form.get("avatar_url", "").strip()
    nuevo_bio = request.form.get("bio")
    nueva_location = request.form.get("location")

    if nuevo_nombre:
        if len(nuevo_nombre) < 3 or len(nuevo_nombre) > 50:
            return jsonify({"error": "El nombre debe tener entre 3 y 50 caracteres."}), 400
        # Check unique
        existente = Usuario.query.filter_by(nombre=nuevo_nombre).first()
        if existente and existente.id != usuario_id:
            return jsonify({"error": "El nombre ya está en uso."}), 400
        usuario.nombre = nuevo_nombre

    avatar_filename = None
    if 'avatar_file' in request.files:
        file = request.files['avatar_file']
        if file and file.filename:
            if not allowed_file(file.filename):
                return jsonify({"error": "Tipo de archivo no permitido. Solo imágenes."}), 400
            filename = secure_filename(f"{usuario_id}_{int(datetime.now().timestamp())}_{file.filename}")
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            avatar_filename = filename

    if avatar_filename:
        usuario.avatar = f"/uploads/{avatar_filename}"
    elif nuevo_avatar_url:
        if len(nuevo_avatar_url) > 500:
            return jsonify({"error": "La URL del avatar no puede exceder 500 caracteres."}), 400
        usuario.avatar = nuevo_avatar_url

    if nuevo_bio is not None:
        nuevo_bio = nuevo_bio.strip()
        if len(nuevo_bio) > 300:
            return jsonify({"error": "La biografía no puede exceder 300 caracteres."}), 400
        usuario.bio = nuevo_bio

    if nueva_location is not None:
        nueva_location = nueva_location.strip()
        if len(nueva_location) > 100:
            return jsonify({"error": "La ubicación no puede exceder 100 caracteres."}), 400
        usuario.location = nueva_location

    try:
        db.session.commit()
        logging.info(f"Perfil de usuario {usuario_id} actualizado")
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error actualizando perfil: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify({"mensaje": "Perfil actualizado exitosamente.", "usuario": usuario.to_dict()})

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# -------- NOTIFICACIONES --------

@app.route("/notificaciones/<int:usuario_id>", methods=["GET"])
@verificar_token
def obtener_notificaciones(usuario_id):
    """Obtener notificaciones pendientes del usuario"""
    if request.usuario_id != usuario_id:
        return jsonify({"error": "No puedes ver notificaciones de otro usuario."}), 403
    
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado."}), 404
    
    # Obtener notificaciones no enviadas
    notificaciones = Notificacion.query.filter_by(usuario_id=usuario_id, enviada=False).all()
    return jsonify([n.to_dict() for n in notificaciones])


@app.route("/notificaciones/<int:notificacion_id>/marcar-enviada", methods=["POST"])
def marcar_notificacion_enviada(notificacion_id):
    """Marcar notificación como enviada (solo backend/bot)"""
    notificacion = Notificacion.query.get(notificacion_id)
    if not notificacion:
        return jsonify({"error": "Notificación no encontrada."}), 404
    
    notificacion.enviada = True
    notificacion.fecha_envio = datetime.utcnow()
    
    try:
        db.session.commit()
        return jsonify({"mensaje": "Notificación marcada como enviada."})
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error marcando notificación: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500


@app.route("/grupos/<int:grupo_id>/promover", methods=["POST"])
def promover_coordinador(grupo_id):
    datos = request.get_json()
    solicitante_id = datos.get("solicitante_id")
    usuario_id = datos.get("usuario_id")
    accion = datos.get("accion", "cambiar_rol")

    if not solicitante_id or not usuario_id:
        return jsonify({"error": "solicitante_id y usuario_id son obligatorios."}), 400

    grupo = Grupo.query.get(grupo_id)
    if not grupo:
        return jsonify({"error": "Grupo no encontrado."}), 404

    if grupo.creador_id != int(solicitante_id):
        return jsonify({"error": "Solo el coordinador principal puede promover o degradar miembros."}), 403

    miembro = GrupoMiembro.query.filter_by(grupo_id=grupo_id, usuario_id=usuario_id).first()
    if not miembro:
        return jsonify({"error": "El usuario debe ser miembro del grupo."}), 400

    if accion == "hacer_principal":
        if miembro.rol != "coordinador":
            return jsonify({"error": "Solo se puede hacer coordinador principal a un coordinador."}), 400
        # Cambiar el creador_id
        grupo.creador_id = int(usuario_id)
        try:
            db.session.commit()
            logging.info(f"Creador del grupo {grupo_id} cambiado a {usuario_id}")
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error cambiando creador: {e}")
            return jsonify({"error": "Error interno del servidor."}), 500
        return jsonify({"mensaje": "Coordinador principal cambiado exitosamente."})
    else:
        # Cambiar rol normal
        nuevo_rol = "miembro" if miembro.rol == "coordinador" else "coordinador"
        miembro.rol = nuevo_rol
        try:
            db.session.commit()
            logging.info(f"Rol de usuario {usuario_id} en grupo {grupo_id} cambiado a {nuevo_rol}")
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error cambiando rol del miembro: {e}")
            return jsonify({"error": "Error interno del servidor."}), 500
        return jsonify({"mensaje": f"Usuario modificado a {nuevo_rol}."})


@app.route("/grupos/<int:grupo_id>/dashboard", methods=["GET"])
def dashboard_grupo(grupo_id):
    grupo = Grupo.query.get(grupo_id)
    if not grupo:
        return jsonify({"error": "Grupo no encontrado."}), 404

    total_miembros = len(grupo.miembros)
    total_entrenamientos = len(grupo.entrenamientos)
    asistencias = Asistencia.query.join(Entrenamiento).filter(Entrenamiento.grupo_id == grupo_id).count()
    usuario_id = request.args.get("usuario_id", type=int)
    if not usuario_id:
        return jsonify({"error": "Debes ser miembro del grupo para ver esta información."}), 403

    miembro = GrupoMiembro.query.filter_by(grupo_id=grupo_id, usuario_id=usuario_id).first()
    if not miembro and grupo.creador_id != usuario_id:
        return jsonify({"error": "Debes pertenecer al grupo para ver esta información."}), 403

    proximos = [e.to_dict() for e in Entrenamiento.query.filter_by(grupo_id=grupo_id).order_by(Entrenamiento.fecha, Entrenamiento.hora).limit(3)]

    ahora = datetime.now()
    activos = []
    for e in grupo.entrenamientos:
        try:
            inicio = datetime.strptime(f"{e.fecha}T{e.hora}", "%Y-%m-%dT%H:%M")
            duracion = e.duracion if e.duracion else 60
            fin = inicio + timedelta(minutes=duracion)
            if inicio <= ahora < fin:
                activos.append(e.to_dict())
        except Exception:
            continue

    return jsonify({
        "grupo_id": grupo_id,
        "nombre": grupo.nombre,
        "grupo": grupo.to_dict(),
        "total_miembros": total_miembros,
        "total_entrenamientos": total_entrenamientos,
        "total_asistencias": asistencias,
        "proximos_entrenamientos": proximos,
        "entrenamientos_activos": activos,
        "total_entrenamientos_activos": len(activos)
    })


# -------- ENTRENAMIENTOS --------

@app.route("/entrenamientos", methods=["POST"])
@verificar_token
def crear_entrenamiento():
    """Crear un nuevo entrenamiento (solo coordinadores del grupo)"""
    datos = request.get_json()
    usuario_id = request.usuario_id  # Del token JWT

    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado."}), 401

    # Validar que el grupo existe
    grupo = Grupo.query.get(datos["grupo_id"])
    if not grupo:
        return jsonify({"error": "El grupo especificado no existe."}), 400

    membresia = GrupoMiembro.query.filter_by(grupo_id=datos["grupo_id"], usuario_id=usuario_id).first()
    if not membresia or membresia.rol != "coordinador":
        return jsonify({"error": "Solo los coordinadores del grupo pueden crear entrenamientos."}), 403

    # Validar formato de fecha
    try:
        datetime.strptime(datos["fecha"], "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Formato de fecha inválido. Use YYYY-MM-DD."}), 400

    # Validar formato de hora
    try:
        datetime.strptime(datos["hora"], "%H:%M")
    except ValueError:
        return jsonify({"error": "Formato de hora inválido. Use HH:MM."}), 400

    tipo = datos.get("tipo", "").strip()
    if not tipo:
        return jsonify({"error": "El tipo de entrenamiento es obligatorio."}), 400

    duracion = datos.get("duracion", 60)
    try:
        duracion = int(duracion)
    except (TypeError, ValueError):
        return jsonify({"error": "La duración debe ser un número entero de minutos."}), 400

    if duracion <= 0 or duracion > 1440:
        return jsonify({"error": "La duración debe ser un número positivo y menor a 1440 minutos."}), 400

    ubicacion = datos.get("ubicacion", "").strip()
    dificultad = datos.get("dificultad", "").strip()

    if ubicacion and len(ubicacion) > 100:
        return jsonify({"error": "La ubicación no puede exceder 100 caracteres."}), 400

    if dificultad and len(dificultad) > 20:
        return jsonify({"error": "La dificultad no puede exceder 20 caracteres."}), 400

    nuevo = Entrenamiento(
        fecha=datos["fecha"],
        hora=datos["hora"],
        tipo=tipo,
        ubicacion=ubicacion,
        dificultad=dificultad,
        duracion=duracion,
        grupo_id=datos["grupo_id"],
        usuario_id=usuario_id
    )

    try:
        db.session.add(nuevo)
        db.session.commit()
        logging.info(f"Entrenamiento creado: {nuevo.id}")
        
        # Crear notificaciones para todos los miembros del grupo
        miembros = GrupoMiembro.query.filter_by(grupo_id=datos["grupo_id"]).all()
        for miembro in miembros:
            # Notificación 24 horas antes
            notif_24h = Notificacion(
                usuario_id=miembro.usuario_id,
                entrenamiento_id=nuevo.id,
                tipo="24h_antes",
                enviada=False
            )
            db.session.add(notif_24h)
            
            # Notificación 1 hora antes
            notif_1h = Notificacion(
                usuario_id=miembro.usuario_id,
                entrenamiento_id=nuevo.id,
                tipo="1h_antes",
                enviada=False
            )
            db.session.add(notif_1h)
        
        db.session.commit()
        logging.info(f"Notificaciones creadas para entrenamiento {nuevo.id}")
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creando entrenamiento o notificaciones: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify(nuevo.to_dict())


@app.route("/entrenamientos/<int:grupo_id>", methods=["GET"])
def obtener_entrenamientos(grupo_id):
    grupo = Grupo.query.get(grupo_id)
    if not grupo:
        return jsonify({"error": "Grupo no encontrado."}), 404

    query = db.session.query(Entrenamiento, Usuario.nombre.label('creador_nombre')).outerjoin(Usuario, Entrenamiento.usuario_id == Usuario.id).filter(Entrenamiento.grupo_id == grupo_id).all()

    entrenamientos_data = [
        {**e.to_dict(), 'creador_nombre': creador_nombre or "Desconocido"} for e, creador_nombre in query
    ]

    if grupo.tipo == "publico":
        return jsonify(entrenamientos_data)

    usuario_id = request.args.get("usuario_id", type=int)
    password = request.args.get("password", "")

    if usuario_id:
        miembro = GrupoMiembro.query.filter_by(grupo_id=grupo_id, usuario_id=usuario_id).first()
        if miembro or usuario_id == grupo.creador_id:
            return jsonify(entrenamientos_data)

    if password and grupo.check_password(password):
        return jsonify(entrenamientos_data)

    return jsonify({"error": "Para ver los entrenamientos debes pertenecer al grupo o proporcionar la contraseña correcta."}), 403


# 🔥 BORRAR CON PERMISOS
@app.route("/entrenamientos/<int:id>", methods=["DELETE"])
@verificar_token
def borrar_entrenamiento(id):
    """Borrar un entrenamiento (solo coordinadores del grupo que lo creó)"""
    usuario_id = request.usuario_id  # Del token JWT

    entrenamiento = Entrenamiento.query.get(id)
    if not entrenamiento:
        return jsonify({"error": "Entrenamiento no encontrado."}), 404

    grupo = Grupo.query.get(entrenamiento.grupo_id)
    miembro = GrupoMiembro.query.filter_by(grupo_id=entrenamiento.grupo_id, usuario_id=usuario_id).first()
    
    if not miembro or miembro.rol != "coordinador":
        return jsonify({"error": "Solo coordinadores pueden eliminar entrenamientos."}), 403

    es_principal = grupo.creador_id == usuario_id
    if not es_principal and entrenamiento.usuario_id != usuario_id:
        return jsonify({"error": "Solo puedes eliminar entrenamientos que hayas creado."}), 403

    try:
        db.session.delete(entrenamiento)
        db.session.commit()
        logging.info(f"Entrenamiento eliminado: {id}")
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error eliminando entrenamiento: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify({"mensaje": "Entrenamiento eliminado exitosamente."})


# -------- ASISTENCIAS --------

@app.route("/asistencias", methods=["POST"])
@verificar_token
def registrar_asistencia():
    """Registrar asistencia a un entrenamiento (usuario autenticado)"""
    datos = request.get_json()
    usuario_id = request.usuario_id  # Del token JWT

    entrenamiento_id = datos.get("entrenamiento_id")
    estado = datos.get("estado")

    if not entrenamiento_id or not estado:
        return jsonify({"error": "ID de entrenamiento y estado son obligatorios."}), 400

    # Validar estado
    if estado not in ["asistire", "no_asistire"]:
        return jsonify({"error": "Estado inválido. Use 'asistire' o 'no_asistire'."}), 400

    # Validar que usuario existe
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado."}), 404

    # Validar que entrenamiento existe
    entrenamiento = Entrenamiento.query.get(entrenamiento_id)
    if not entrenamiento:
        return jsonify({"error": "Entrenamiento no encontrado."}), 404

    existente = Asistencia.query.filter_by(
        usuario_id=usuario_id,
        entrenamiento_id=entrenamiento_id
    ).first()

    if existente:
        existente.estado = estado
        try:
            db.session.commit()
            logging.info(f"Asistencia actualizada: usuario {usuario_id}, entrenamiento {entrenamiento_id}")
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error actualizando asistencia: {e}")
            return jsonify({"error": "Error interno del servidor."}), 500
        return jsonify(existente.to_dict())

    nueva = Asistencia(
        estado=estado,
        usuario_id=usuario_id,
        entrenamiento_id=entrenamiento_id
    )

    try:
        db.session.add(nueva)
        db.session.commit()
        logging.info(f"Asistencia creada: usuario {usuario_id}, entrenamiento {entrenamiento_id}")
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creando asistencia: {e}")
        return jsonify({"error": "Error interno del servidor."}), 500

    return jsonify(nueva.to_dict())


@app.route("/asistencias/<int:entrenamiento_id>", methods=["GET"])
def ver_asistencias(entrenamiento_id):
    asistencias = Asistencia.query.filter_by(entrenamiento_id=entrenamiento_id).all()

    resultado = []

    for a in asistencias:
        usuario = Usuario.query.get(a.usuario_id)

        resultado.append({
            "id": a.id,
            "estado": a.estado,
            "usuario_nombre": usuario.nombre
        })

    return jsonify(resultado)


# ============================
# FIREBASE CLOUD MESSAGING (FCM)
# ============================

@app.route("/usuarios/<int:user_id>/register-device-token", methods=["POST"])
@verificar_token
def registrar_device_token(user_id):
    """Registra un dispositivo para recibir notificaciones push"""
    if not fcm_available:
        return jsonify({"error": "Sistema de notificaciones push no disponible"}), 503

    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    datos = request.get_json()
    device_token = datos.get("device_token", "").strip()
    platform = datos.get("platform", "android").lower()  # android, ios, web

    if not device_token:
        return jsonify({"error": "device_token requerido"}), 400

    if platform not in ["android", "ios", "web"]:
        return jsonify({"error": "platform debe ser: android, ios o web"}), 400

    # Verificar si ya existe
    existente = DeviceToken.query.filter_by(device_token=device_token).first()
    if existente:
        existente.activo = True
        existente.usuario_id = user_id
        existente.platform = platform
    else:
        existente = DeviceToken(
            usuario_id=user_id,
            device_token=device_token,
            platform=platform,
            activo=True
        )
        db.session.add(existente)

    try:
        db.session.commit()
        logging.info(f"✅ Device token registrado: usuario {user_id}, platform {platform}")
        return jsonify({
            "mensaje": "Device token registrado correctamente",
            "device_token": existente.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"❌ Error registrando device token: {e}")
        return jsonify({"error": "Error registrando dispositivo"}), 500


@app.route("/usuarios/<int:user_id>/device-tokens", methods=["GET"])
@verificar_token
def listar_device_tokens(user_id):
    """Lista los dispositivos registrados de un usuario"""
    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    tokens = DeviceToken.query.filter_by(usuario_id=user_id, activo=True).all()
    return jsonify([t.to_dict() for t in tokens])


@app.route("/usuarios/<int:user_id>/enviar-notificacion-prueba", methods=["POST"])
@verificar_token
def enviar_notificacion_prueba(user_id):
    """Envía una notificación de prueba al dispositivo"""
    if not fcm_available:
        return jsonify({"error": "Sistema de notificaciones push no disponible"}), 503

    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    tokens = DeviceToken.query.filter_by(usuario_id=user_id, activo=True).all()
    if not tokens:
        return jsonify({"error": "No hay dispositivos registrados"}), 400

    mensajes_enviados = 0
    errores = []

    for token_obj in tokens:
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title="🧪 Prueba de Notificación",
                    body="Esta es una notificación de prueba desde MARQRun"
                ),
                data={
                    "type": "test",
                    "timestamp": datetime.utcnow().isoformat()
                },
                token=token_obj.device_token
            )
            response = messaging.send(message)
            mensajes_enviados += 1
            logging.info(f"✅ Notificación prueba enviada a {token_obj.platform}: {response}")
        except Exception as e:
            errores.append(f"Error enviando a {token_obj.platform}: {str(e)}")
            logging.error(f"❌ Error enviando notificación: {e}")

    return jsonify({
        "enviados": mensajes_enviados,
        "total": len(tokens),
        "errores": errores if errores else None
    })


@app.route("/entrenamientos/<int:entrenamiento_id>/notificar", methods=["POST"])
@verificar_token
def notificar_entrenamiento(entrenamiento_id):
    """Envía notificación FCM a todos los miembros del grupo sobre un entrenamiento"""
    if not fcm_available:
        return jsonify({"error": "Sistema de notificaciones push no disponible"}), 503

    entrenamiento = Entrenamiento.query.get(entrenamiento_id)
    if not entrenamiento:
        return jsonify({"error": "Entrenamiento no encontrado"}), 404

    # Obtener miembros del grupo
    miembros = GrupoMiembro.query.filter_by(grupo_id=entrenamiento.grupo_id).all()
    grupo = Grupo.query.get(entrenamiento.grupo_id)
    
    mensajes_enviados = 0
    errores = []

    for miembro in miembros:
        tokens = DeviceToken.query.filter_by(usuario_id=miembro.usuario_id, activo=True).all()
        
        for token_obj in tokens:
            try:
                title = f"📌 Entrenamiento: {entrenamiento.tipo}"
                body = f"El {entrenamiento.fecha} a las {entrenamiento.hora} en {grupo.nombre}"
                
                message = messaging.Message(
                    notification=messaging.Notification(
                        title=title,
                        body=body
                    ),
                    data={
                        "type": "training",
                        "training_id": str(entrenamiento.id),
                        "group_id": str(entrenamiento.grupo_id),
                        "fecha": entrenamiento.fecha,
                        "hora": entrenamiento.hora
                    },
                    token=token_obj.device_token
                )
                response = messaging.send(message)
                mensajes_enviados += 1
                logging.info(f"✅ Notificación entrenamiento enviada: {response}")
            except Exception as e:
                errores.append(f"Error enviando a usuario {miembro.usuario_id}: {str(e)}")
                logging.error(f"❌ Error enviando notificación: {e}")

    return jsonify({
        "mensaje": f"Notificaciones enviadas a {mensajes_enviados} dispositivos",
        "entrenamiento_id": entrenamiento_id,
        "grupo": grupo.nombre,
        "errores": errores if errores else None
    })




# ============================
# CHAT GRUPAL - REST ENDPOINTS
# ============================

@app.route("/grupos/<int:grupo_id>/mensajes", methods=["GET"])
@verificar_token
def obtener_mensajes(grupo_id):
    """Obtiene los últimos mensajes de un grupo"""
    grupo = Grupo.query.get(grupo_id)
    if not grupo:
        return jsonify({"error": "Grupo no encontrado"}), 404

    usuario_id = request.usuario_id
    miembro = GrupoMiembro.query.filter_by(usuario_id=usuario_id, grupo_id=grupo_id).first()
    if not miembro:
        return jsonify({"error": "No perteneces a este grupo"}), 403

    # Obtener últimos 50 mensajes
    mensajes = Mensaje.query.filter_by(grupo_id=grupo_id).order_by(Mensaje.fecha_creacion.desc()).limit(50).all()
    mensajes.reverse()  # Mostrar en orden cronológico
    
    return jsonify([m.to_dict() for m in mensajes])


@app.route("/grupos/<int:grupo_id>/mensajes", methods=["POST"])
@verificar_token
def enviar_mensaje(grupo_id):
    """Envía un mensaje a un grupo"""
    grupo = Grupo.query.get(grupo_id)
    if not grupo:
        return jsonify({"error": "Grupo no encontrado"}), 404

    usuario_id = request.usuario_id
    miembro = GrupoMiembro.query.filter_by(usuario_id=usuario_id, grupo_id=grupo_id).first()
    if not miembro:
        return jsonify({"error": "No perteneces a este grupo"}), 403

    datos = request.get_json()
    contenido = datos.get("contenido", "").strip()
    
    if not contenido:
        return jsonify({"error": "El mensaje no puede estar vacío"}), 400

    if len(contenido) > 5000:
        return jsonify({"error": "El mensaje no puede exceder 5000 caracteres"}), 400

    nuevo_mensaje = Mensaje(
        grupo_id=grupo_id,
        usuario_id=usuario_id,
        contenido=contenido
    )

    try:
        db.session.add(nuevo_mensaje)
        db.session.commit()
        
        usuario = Usuario.query.get(usuario_id)
        mensaje_dict = nuevo_mensaje.to_dict()
        
        # Emitir a todos en el grupo vía WebSocket
        socketio.emit('nuevo_mensaje', mensaje_dict, room=f"grupo_{grupo_id}")
        
        # Enviar notificación push a miembros del grupo (excepto al que envía)
        for miembro in grupo.miembros:
            if miembro.usuario_id != usuario_id:
                tokens = DeviceToken.query.filter_by(usuario_id=miembro.usuario_id, activo=True).all()
                for token_obj in tokens:
                    try:
                        if fcm_available:
                            message = messaging.Message(
                                notification=messaging.Notification(
                                    title=f"💬 {usuario.nombre} en {grupo.nombre}",
                                    body=contenido[:100]
                                ),
                                data={
                                    "type": "message",
                                    "group_id": str(grupo_id),
                                    "message_id": str(nuevo_mensaje.id)
                                },
                                token=token_obj.device_token
                            )
                            messaging.send(message)
                    except Exception as e:
                        logging.error(f"❌ Error enviando notificación FCM: {e}")
        
        logging.info(f"✅ Mensaje enviado a grupo {grupo_id} por usuario {usuario_id}")
        return jsonify(mensaje_dict), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error enviando mensaje: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500


@app.route("/mensajes/<int:mensaje_id>/marcar-leido", methods=["POST"])
@verificar_token
def marcar_mensaje_leido(mensaje_id):
    """Marca un mensaje como leído"""
    mensaje = Mensaje.query.get(mensaje_id)
    if not mensaje:
        return jsonify({"error": "Mensaje no encontrado"}), 404

    usuario_id = request.usuario_id
    miembro = GrupoMiembro.query.filter_by(usuario_id=usuario_id, grupo_id=mensaje.grupo_id).first()
    if not miembro:
        return jsonify({"error": "No perteneces a este grupo"}), 403

    mensaje.leido = True
    try:
        db.session.commit()
        return jsonify({"mensaje": "Marcado como leído"})
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error marcando mensaje como leído: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500


# ============================
# WEBSOCKET - CHAT EN TIEMPO REAL
# ============================

usuario_sockets = {}  # user_id -> sid (socket id)


@socketio.on('connect')
def handle_connect(auth):
    """Usuario se conecta por WebSocket"""
    try:
        logging.info(f"📡 [SOCKET] Intento de conexión - auth present: {bool(auth)}, type: {type(auth)}")
        
        if not auth:
            logging.warning("❌ [SOCKET] No auth proporcionado")
            emit('authentication_error', {'message': 'No auth provided'})
            return False
        
        token = None
        if isinstance(auth, dict):
            token = auth.get('token')
        elif isinstance(auth, str):
            token = auth
            
        if not token:
            logging.warning("❌ [SOCKET] No token en auth")
            emit('authentication_error', {'message': 'No token in auth'})
            return False
        
        logging.info(f"📝 [SOCKET] Token recibido - longitud: {len(token)}, primeros 10 chars: {token[:10]}...")
        
        try:
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            usuario_id = data.get('usuario_id')
            
            if not usuario_id:
                logging.error("❌ [SOCKET] usuario_id no en token")
                emit('authentication_error', {'message': 'Invalid token: no usuario_id'})
                return False
            
            usuario_sockets[usuario_id] = request.sid
            logging.info(f"✅ [SOCKET] Usuario {usuario_id} conectado exitosamente (SID: {request.sid})")
            logging.info(f"📊 [SOCKET] usuario_sockets: {usuario_sockets}")
            emit('connected', {'usuario_id': usuario_id, 'mensaje': f'Bienvenido usuario {usuario_id}'})
            return True
            
        except jwt.ExpiredSignatureError:
            logging.error("❌ [SOCKET] Token expirado")
            emit('authentication_error', {'message': 'Token expirado'})
            return False
        except jwt.InvalidTokenError as e:
            logging.error(f"❌ [SOCKET] Token inválido: {str(e)}")
            emit('authentication_error', {'message': f'Token inválido: {str(e)}'})
            return False
            
    except Exception as e:
        logging.error(f"❌ [SOCKET] Error general en conexión: {str(e)}", exc_info=True)
        emit('authentication_error', {'message': f'Error: {str(e)}'})
        return False


@socketio.on('join_group')
def handle_join_group(data):
    """Usuario se une a sala de grupo"""
    try:
        token = data.get('token')
        grupo_id = data.get('grupo_id')
        
        data_token = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        usuario_id = data_token['usuario_id']
        
        # Verificar que el usuario pertenece al grupo
        miembro = GrupoMiembro.query.filter_by(usuario_id=usuario_id, grupo_id=grupo_id).first()
        if not miembro:
            emit('error', {'mensaje': 'No perteneces a este grupo'})
            return
        
        room = f"grupo_{grupo_id}"
        join_room(room)
        logging.info(f"✅ Usuario {usuario_id} se unió a grupo {grupo_id}")
        
        emit('joined_group', {'grupo_id': grupo_id, 'usuario_id': usuario_id}, room=room)
    except Exception as e:
        logging.error(f"❌ Error al unirse a grupo: {e}")
        emit('error', {'mensaje': str(e)})


@socketio.on('leave_group')
def handle_leave_group(data):
    """Usuario abandona sala de grupo"""
    try:
        grupo_id = data.get('grupo_id')
        room = f"grupo_{grupo_id}"
        leave_room(room)
        logging.info(f"✅ Usuario abandonó grupo {grupo_id}")
        emit('left_group', {'grupo_id': grupo_id}, room=room)
    except Exception as e:
        logging.error(f"❌ Error al abandonar grupo: {e}")


@socketio.on('disconnect')
def handle_disconnect():
    """Usuario se desconecta"""
    for user_id, sid in list(usuario_sockets.items()):
        if sid == request.sid:
            del usuario_sockets[user_id]
            logging.info(f"✅ Usuario {user_id} desconectado de WebSocket")
            break


# ============================
# SERVIR FRONTEND
# ============================
FRONTEND_PATH = os.path.join(BASE_DIR, '..', 'frontend')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Servir archivos del frontend"""
    if path and os.path.exists(os.path.join(FRONTEND_PATH, path)):
        return send_from_directory(FRONTEND_PATH, path)
    # Para rutas no encontradas, servir index.html (importante para SPAs)
    return send_from_directory(FRONTEND_PATH, 'index.html')


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        ensure_password_column()
        ensure_admin_exists()

    # Para desarrollo local con socketio
    socketio.run(app, debug=False, host='0.0.0.0', port=5000)

# Para Vercel (serverless)
# El objeto 'app' será utilizado por Vercel como WSGI application