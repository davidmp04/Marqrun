"""
Punto de entrada WSGI para Gunicorn en producción
Inicializa la BD automáticamente
"""
import os
import sys
import logging

# Agregar el directorio backend al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import app, db, ensure_password_column, ensure_admin_exists

logging.info("🚀 Inicializando aplicación MARQRun en producción...")

# Inicializar BD
with app.app_context():
    try:
        db.create_all()
        logging.info("✅ Tablas de BD creadas/verificadas")
        ensure_password_column()
        logging.info("✅ Columnas de BD verificadas")
        ensure_admin_exists()
        logging.info("✅ Admin verificado")
    except Exception as e:
        logging.error(f"❌ Error inicializando BD: {e}")

if __name__ == "__main__":
    app.run()
