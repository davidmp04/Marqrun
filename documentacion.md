 
I.E.S Castillo de Luna
Proyecto de Fin de Ciclo Formativo Grado Superior en Desarrollo de Aplicaciones Multiplataforma



Diseño de una aplicación para la automatización de la gestión de grupos de running amateur


David Márquez Pozo
Curso 2025/2026
 
 
 
I.E.S Castillo de Luna
Proyecto de Fin de Ciclo Formativo Grado Superior en Desarrollo de Aplicaciones Multiplataforma



Diseño de una aplicación para la automatización de la gestión de grupos de running amateur


David Márquez Pozo
Curso 2025/2026
 
Agradecimientos
A 
 
Resumen
Este trabajo presenta el diseño y definición de una solución software orientada a la automatización de la gestión de grupos de running amateur, denominada MARQRun. El proyecto aborda las distintas fases de concepción de un producto digital, desde el análisis del problema y de los usuarios hasta la definición de un Producto Mínimo Viable (MVP), sin llegar a la implementación completa del sistema.
La solución propuesta tiene como objetivo principal reducir las tareas repetitivas y manuales que realizan los coordinadores de grupos de running, como la organización de entrenamientos, la confirmación de asistencia y la comunicación con los corredores. Para ello, se plantea el uso de herramientas accesibles como un bot de mensajería y una aplicación web básica, priorizando la simplicidad, la automatización y la facilidad de uso.
La memoria incluye un análisis del contexto actual y de las herramientas existentes, la definición de perfiles de usuario (Personas), la descripción de la propuesta de valor y la planificación del proyecto siguiendo un enfoque orientado a MVP. Asimismo, se detallan los requisitos funcionales y no funcionales, las historias de usuario, los objetivos SMART y los criterios de validación del sistema.
Como resultado, se obtiene un prototipo conceptual y documentado, acompañado de diseños, diagramas y capturas del proceso, que demuestra la viabilidad de la solución y sienta las bases para un posible desarrollo futuro. El proyecto combina análisis, diseño y planificación, aplicando los conocimientos adquiridos durante el ciclo formativo de Desarrollo de Aplicaciones Multiplataforma.
 
Palabras clave
Automatización de procesos, desarrollo de aplicaciones, gestión de grupos deportivos, running, MVP, bot de mensajería, aplicación web, experiencia de usuario.
 
Índice
Contenido
Agradecimientos	4
Resumen	5
Palabras clave	6
Índice	7
1.	Introducción	10
1.1	Contexto del proyecto	10
1.2	Motivación y justificación	11
1.3	Objetivos del proyecto	11
1.4	Estructura del documento	12
1.5 Alcance y limitaciones	12
2.	Contexto del proyecto y estado del arte	13
2.1 Contexto tecnológico actual	13
2.2 Situación actual de los grupos de running amateur	14
2.3 Herramientas existentes en el mercado	14
2.4 Uso de bots y aplicaciones web como alternativa	15
2.5 Justificación de la propuesta MARQRun	15
3.	Objetivos y alcance del proyecto	16
3.1 Objetivo general	16
3.2 Objetivos específicos	16
3.4 Fuera de alcance	17
3.5 Beneficios esperados	17
4.	Análisis de requisitos del sistema	18
4.1 Identificación de los usuarios del sistema	18
4.2 Necesidades detectadas y problemas actuales	19
4.3 Definición de los requisitos funcionales	19
4.4 Requisitos no funcionales y aspectos legales	19
4.5 Alcance del sistema y funcionalidades descartadas	20
5.	Diseño del sistema	21
5.1 Visión general de la arquitectura	21
5.2 Interfaz de usuario: bot de Telegram y web	22
5.3 Backend y lógica de negocio	22
5.4 Modelo de datos y base de datos	23
5.5 Seguridad y protección de datos	23
5.6 Justificación del diseño elegido	24
6.	Diseño de la base de datos	25
6.1 Enfoque general del diseño de datos	25
6.2 Identificación de las entidades principales	25
6.3 Tabla de usuarios	26
6.4 Tabla de grupos de running	26
6.5 Tabla de entrenamientos	26
6.6 Tabla de asistencias	27
6.7 Relaciones entre las tablas	27
6.8 Justificación del modelo de datos	27
7.	Diagramas del sistema	28
7.1 Diagrama de casos de uso	28
7.2 Justificación de los casos de uso definidos	28
7.3 Diagrama entidad-relación (ER)	29
7.4 Diagrama de secuencia: programación de un entrenamiento	29
7.5 Diagrama de secuencia: confirmación de asistencia	29
7.6 Utilidad de los diagramas en el proyecto	30
8.	Implementación de la aplicación MARQRun	31
8.1 Tecnologías utilizadas	31
8.2 Implementación del bot de Telegram	34
8.3 Implementación del backend y lógica de negocio	38
8.3.1 Creación de la estructura inicial del backend	38
8.3.2 Puesta en marcha del servidor Flask	39
8.3.3 Primer endpoint de comprobación del sistema	40
8.3.4	Función del backend dentro del sistema MARQRun	42
8.3.5 Valoración de la implementación del backend	42
8.4 Implementación de la base de datos	43
8.4.1 Elección del sistema de base de datos	43
8.4.2 Organización estructural de la base de datos	44
8.4.3 Integración mediante SQLAlchemy	45
8.4.4 Creación automática de la base de datos	45
8.4.5 Adaptación de los endpoints al uso de persistencia real	46
8.4.6 Valoración de la implementación	46
8.4.7 Modelado relacional: tabla Entrenamiento	47
8.4.8 Implementación de la relación entre tablas	48
8.4.9 Implementación del sistema de asistencias.	49
8.5 Implementación de la interfaz web	51
8.5.1 Desarrollo de la interfaz web básica	51
8.5.2 Integración con el backend	52
8.5.3 Funcionalidad de creación de grupos	52
8.5.4 Visualización de grupos	53
8.5.5 Código de la interfaz	54
8.5.6 Valoración de la implementación	54
8.6 Gestión de usuarios y cumplimiento del RGPD	55
8.7 Valoración de la implementación	55
8	Pruebas y validación del sistema	56
9.1 Enfoque general de las pruebas	56
9.2 Pruebas funcionales del bot de Telegram	56
9.3 Pruebas de la interfaz web	57
9.4 Pruebas de gestión de usuarios y RGPD	57
9.5 Validación de los objetivos del MVP	57
9.6 Resultados obtenidos	58
9.7 Conclusiones	58
9	Conclusiones y líneas de trabajo futuro	59
10.1 Conclusiones del proyecto	59
10.2 Cumplimiento de los objetivos planteados	60
10.3 Dificultades encontradas	60
10.4 Aprendizajes personales y técnicos	60
10.5 Líneas de trabajo futuro	61
10.6 Valoración final	61
10	Bibliografía y webgrafía	62
11.1 Webgrafía	62

 
1.	Introducción

1.1	Contexto del proyecto

En la actualidad, el uso de herramientas digitales forma parte del día a día de la mayoría de personas. Aplicaciones móviles, páginas web y sistemas automatizados se utilizan constantemente para organizar tareas, comunicarse y ahorrar tiempo en actividades que antes se realizaban de forma manual. Esta digitalización afecta tanto al ámbito profesional como al personal, y cada vez es más común buscar soluciones tecnológicas que simplifiquen procesos cotidianos.
Sin embargo, en algunos contextos concretos esta digitalización no siempre se aplica de manera eficiente. Un ejemplo claro es el de los grupos de running amateur, donde la organización de entrenamientos suele hacerse utilizando herramientas genéricas como WhatsApp o simples hojas de cálculo. Aunque estas herramientas son fáciles de usar y están al alcance de cualquiera, no están pensadas específicamente para gestionar grupos deportivos.
Esta forma de organización provoca, en muchos casos, desorden en la información, mensajes repetidos, falta de control sobre la asistencia y una carga extra de trabajo para la persona que coordina el grupo. Además, los corredores pueden tener dificultades para saber cuándo es el próximo entrenamiento, quién va a asistir o simplemente perder motivación al no haber una estructura clara.
Por todo ello, se detecta la necesidad de una solución específica que permita organizar este tipo de grupos de forma más sencilla y automática, mejorando la experiencia tanto del coordinador como de los corredores.
 
1.2	Motivación y justificación

La idea de este proyecto nace a partir de la observación directa de cómo se organizan muchos grupos de running amateur. En la mayoría de los casos, existe una persona que se encarga de coordinar entrenamientos, avisar al grupo y preguntar quién va a asistir, lo que supone invertir bastante tiempo en tareas repetitivas que podrían automatizarse fácilmente.
Desde el punto de vista formativo, este proyecto resulta especialmente interesante, ya que permite aplicar muchos de los conocimientos adquiridos durante el ciclo formativo de Desarrollo de Aplicaciones Multiplataforma. A lo largo del proyecto se trabajan conceptos como el análisis de necesidades, la definición de requisitos, el diseño de aplicaciones centradas en el usuario y la planificación de un producto software.
Además, el proyecto encaja directamente con uno de los objetivos principales del desarrollo de software actual: la automatización de procesos. La propuesta de MARQRun busca reducir el trabajo manual y mejorar la organización mediante una herramienta sencilla, accesible y fácil de usar, sin que los usuarios necesiten conocimientos técnicos avanzados.

1.3	Objetivos del proyecto

El objetivo principal de este Proyecto de Fin de Ciclo es diseñar una aplicación que permita automatizar la gestión de grupos de running amateur, facilitando la organización de entrenamientos y la comunicación entre las personas que forman parte del grupo.
De forma más concreta, los objetivos que se persiguen con este proyecto son los siguientes:
-	Analizar cómo se organizan actualmente los grupos de running y detectar los principales problemas.
-	Definir los perfiles de usuario que van a utilizar la aplicación y entender sus necesidades.
-	Proponer una solución software, denominada MARQRun, orientada a reducir tareas repetitivas.
-	Establecer los requisitos funcionales y no funcionales del sistema.
-	Definir un Producto Mínimo Viable (MVP) que permita validar la utilidad de la aplicación.
-	Diseñar el funcionamiento general y la interfaz mediante prototipos y diagramas.
-	Definir métricas que permitan evaluar si la solución cumple con los objetivos planteados.

1.4	Estructura del documento

La memoria está organizada en varios capítulos que permiten entender el proyecto de forma progresiva. En primer lugar, se analiza la situación actual y el problema detectado. A continuación, se describen los usuarios y la solución propuesta. Posteriormente, se explican la metodología utilizada, el diseño del sistema y la planificación del proyecto. Por último, se recogen los aspectos legales, la validación del MVP, las conclusiones y las posibles mejoras futuras.

1.5 Alcance y limitaciones

Este proyecto se centra en el análisis, diseño y planificación de la aplicación MARQRun. A lo largo de la memoria se describe el proceso seguido para definir la solución, incluyendo el estudio del problema, los requisitos del sistema, las historias de usuario, el diseño funcional y la arquitectura planteada.
No se incluye dentro del alcance del proyecto la implementación completa de la aplicación ni su despliegue en un entorno real. Las capturas, prototipos y diagramas que aparecen en la memoria tienen un carácter ilustrativo y sirven para mostrar cómo funcionaría el sistema una vez desarrollado, pero no corresponden a una aplicación final operativa.
Esta limitación permite centrar el trabajo en la correcta definición del proyecto y en la aplicación práctica de los conocimientos adquiridos durante el ciclo formativo, evitando entrar en una fase de desarrollo completa que no es obligatoria para este trabajo.


 
2.	Contexto del proyecto y estado del arte

2.1 Contexto tecnológico actual

En los últimos años, el uso de aplicaciones y herramientas digitales se ha extendido a casi todos los ámbitos de la vida diaria. Cada vez es más común utilizar aplicaciones móviles, páginas web o bots de mensajería para organizar tareas, comunicarse o automatizar procesos que antes se hacían de forma manual.
Este avance no solo se da en grandes empresas o entornos profesionales, sino también en actividades de ocio y deporte. Muchas personas utilizan aplicaciones para registrar entrenamientos, controlar su rendimiento o compartir resultados con otros usuarios. Sin embargo, no todas las necesidades están bien cubiertas, especialmente cuando se trata de la organización de grupos pequeños o amateur.
En el caso de los grupos de running no profesionales, la tecnología suele usarse de forma muy básica. La mayoría de estos grupos se organizan mediante aplicaciones de mensajería instantánea, como WhatsApp o Telegram, sin una herramienta específica que facilite la gestión del día a día.
 
2.2 Situación actual de los grupos de running amateur

Los grupos de running amateur suelen estar formados por personas con distintos niveles y disponibilidad. Normalmente existe una persona que actúa como coordinador o entrenador, encargándose de avisar de los entrenamientos, resolver dudas y comprobar quién va a asistir.
La forma más habitual de organización es mediante un grupo de WhatsApp. Cada semana se repite el mismo proceso: se envía un mensaje indicando día y hora del entrenamiento y se pregunta quién va a asistir. Esto genera muchos mensajes repetidos y, en ocasiones, confusión entre los miembros del grupo.
Además, no suele existir un registro claro de la asistencia ni una forma sencilla de ver quién ha confirmado. Esto puede provocar desorganización, falta de motivación y, en algunos casos, abandono por parte de algunos corredores.

2.3 Herramientas existentes en el mercado

Actualmente existen aplicaciones muy conocidas en el ámbito del running, como Strava o TrainingPeaks. Estas herramientas están principalmente enfocadas al registro de actividades deportivas, análisis del rendimiento y seguimiento de objetivos personales.
Aunque estas aplicaciones son muy completas, no están pensadas específicamente para la gestión de grupos pequeños. Suelen tener muchas funcionalidades que no son necesarias para un grupo amateur y, en algunos casos, requieren conocimientos técnicos o suscripciones de pago.
Por otro lado, existen herramientas genéricas de organización, como calendarios compartidos o aplicaciones de gestión de tareas. Sin embargo, estas soluciones no están adaptadas al contexto concreto de un grupo de running y no resuelven problemas como la confirmación de asistencia o la motivación del grupo. 
2.4 Uso de bots y aplicaciones web como alternativa

En los últimos años, los bots de mensajería se han convertido en una alternativa interesante para automatizar tareas sencillas. Plataformas como Telegram permiten crear bots que interactúan con los usuarios de forma rápida y sin necesidad de instalar aplicaciones complejas.
El uso de un bot, combinado con una aplicación web sencilla, puede ser una solución adecuada para grupos que buscan simplicidad. De esta forma, los usuarios pueden interactuar desde una herramienta que ya utilizan habitualmente, sin necesidad de aprender a usar una aplicación nueva desde cero.
Esta idea encaja especialmente bien con perfiles no técnicos, como coordinadores de grupos amateur, que buscan soluciones prácticas y fáciles de usar. 

2.5 Justificación de la propuesta MARQRun

Teniendo en cuenta el contexto descrito, se detecta una oportunidad clara para una aplicación centrada en la automatización de tareas básicas dentro de grupos de running amateur. La propuesta de MARQRun nace con el objetivo de simplificar la organización semanal de entrenamientos y mejorar la comunicación entre los miembros del grupo.
A diferencia de otras aplicaciones existentes, MARQRun no se centra en el análisis avanzado del rendimiento deportivo, sino en resolver problemas concretos del día a día: organización, confirmación de asistencia y claridad en la información.
Este enfoque permite ofrecer una solución sencilla, accesible y adaptada a las necesidades reales de los usuarios, sirviendo como base para el desarrollo del proyecto de fin de ciclo.
 
3.	Objetivos y alcance del proyecto

3.1 Objetivo general

El objetivo principal de este proyecto es definir y diseñar una aplicación que permita automatizar la gestión de grupos de running amateur, facilitando la organización de entrenamientos y la comunicación entre los miembros del grupo.
La aplicación, denominada MARQRun, busca reducir el tiempo que el coordinador dedica a tareas repetitivas y mejorar la experiencia de los corredores, ofreciendo una herramienta sencilla y accesible que no requiera conocimientos técnicos avanzados.
Este proyecto se centra en el análisis, diseño y planificación de la aplicación, sin llegar a implementar el producto final, tal y como corresponde a un proyecto de fin de ciclo del módulo de Desarrollo de Aplicaciones Multiplataforma.

3.2 Objetivos específicos

Para llegar al objetivo, he definido los siguientes objetivos:
-	Analizar la forma en la que actualmente se organizan los grupos de running amateur y detectar los principales problemas.
-	Definir los perfiles de usuario que utilizarán la aplicación, teniendo en cuenta sus necesidades y limitaciones.
-	Establecer los requisitos funcionales y no funcionales mínimos que debe cumplir la aplicación.
-	Diseñar un MVP (Producto Mínimo Viable) que permita validar la idea del proyecto.
-	Plantear una solución basada en un bot de mensajería y una aplicación web sencilla.
-	Definir métricas que permitan evaluar el éxito y la utilidad de la aplicación.
Con esto se permite estructurar el proyecto de forma clara y saber que serie de decisiones tomar durante el desarrollo.


3.4 Fuera de alcance

Para evitar confusiones, se especifican también los elementos que no forman parte del alcance de este proyecto:
-	Desarrollo completo de la aplicación en un entorno real.
-	Integraciones avanzadas con servicios externos de terceros.
-	Análisis detallado del rendimiento deportivo de los usuarios.
-	Implementación de inteligencia artificial avanzada o sistemas de recomendación.
-	Comercialización o explotación económica del producto.
Estas limitaciones permiten mantener el proyecto dentro de un marco realista y adecuado al tiempo y recursos disponibles.

3.5 Beneficios esperados

Aunque el proyecto no incluye la implementación final, se espera que la propuesta definida aporte los siguientes beneficios:
-	Ahorro de tiempo para los coordinadores de grupos de running.
-	Mejora en la organización y claridad de los entrenamientos.
-	Mayor participación y motivación por parte de los corredores.
-	Reducción de errores derivados de la gestión manual.
-	Base sólida para un posible desarrollo futuro de la aplicación.
Este capítulo establece de forma clara qué se pretende conseguir con el proyecto y hasta dónde llega su alcance, sirviendo como referencia para el resto de la memoria.
 
4.	Análisis de requisitos del sistema

En este apartado explico cómo he llegado a definir los requisitos de la aplicación MARQRun. Aquí justificó por qué he incluido unas cosas y he dejado otras fuera, teniendo en cuenta el tipo de proyecto y el perfil de los usuarios de la app.
Desde el principio sabía que este proyecto no debía ser una aplicación compleja, sino una herramienta sencilla pensada para personas sin conocimientos técnicos. Por este motivo, el análisis de requisitos se ha centrado en cubrir las necesidades básicas del día a día de un grupo de running amateur.

4.1 Identificación de los usuarios del sistema

Antes de definir qué debía hacer la aplicación, fue necesario identificar quién la iba a utilizar. En la mayoría de los grupos de running amateur existe una persona que se encarga de organizar los entrenamientos, avisar a los corredores y resolver dudas. Este perfil se ha definido como el usuario principal del sistema y es el que más se beneficia de la automatización que ofrece MARQRun.
El segundo tipo de usuario es el corredor habitual. Este usuario no necesita herramientas complejas, sino información clara y rápida: saber cuándo es el próximo entrenamiento, dónde se realiza y cuántas personas van a asistir. Por este motivo, la aplicación debe ofrecer una experiencia sencilla y directa para este perfil, evitando procesos largos o confusos.
 

4.2 Necesidades detectadas y problemas actuales

Una vez definidos los usuarios, el siguiente paso fue analizar los problemas a los que se enfrentan actualmente. La mayoría de los grupos de running utilizan aplicaciones de mensajería como WhatsApp para organizarse, lo que provoca desorden, mensajes repetidos y pérdida de información importante.
Uno de los problemas más comunes es tener que preguntar cada semana quién va a asistir al entrenamiento, lo que genera una gran cantidad de mensajes innecesarios. Además, no existe un control claro de la asistencia ni una forma sencilla de consultar entrenamientos anteriores. Estas situaciones provocan pérdida de tiempo y, en algunos casos, desmotivación por parte de los corredores.

4.3 Definición de los requisitos funcionales

A partir de los problemas detectados, se han definido los requisitos funcionales del sistema. He decidido centrarme en aquellas funcionalidades que permiten automatizar las tareas más repetitivas del coordinador y mejorar la experiencia del corredor.
Entre los requisitos funcionales principales se encuentran la creación de grupos de running, la programación de entrenamientos semanales y la confirmación de asistencia mediante botones. Estas funciones permiten cubrir la mayor parte de las necesidades detectadas sin complicar el uso de la aplicación. Otras funcionalidades, como rankings o mensajes motivacionales, se han incluido como mejoras que aportan valor, pero no son imprescindibles para el funcionamiento básico del sistema.

4.4 Requisitos no funcionales y aspectos legales

Además de las funcionalidades, también he tenido en cuenta una serie de requisitos no funcionales. Uno de los más importantes es la facilidad de uso, ya que la aplicación está pensada para usuarios no técnicos. Por este motivo, se ha priorizado una interfaz clara y tiempos de respuesta rápidos.
Otro aspecto clave es el cumplimiento de la normativa de protección de datos (RGPD). Aunque se trata de un proyecto académico, la aplicación maneja datos personales, por lo que es necesario informar al usuario, solicitar su consentimiento y permitir el borrado de sus datos si así lo desea. Este requisito se ha considerado obligatorio desde el inicio del proyecto.
 
4.5 Alcance del sistema y funcionalidades descartadas

Durante el análisis de requisitos también ha sido necesario decidir qué funcionalidades no se incluirían en esta primera versión del proyecto. He optado por dejar fuera integraciones complejas con otras plataformas, análisis avanzados de rendimiento o el uso de inteligencia artificial, ya que aumentarían considerablemente la complejidad del sistema.
Estas funcionalidades no se descartan de forma definitiva, sino que se plantean como posibles mejoras futuras una vez validado el funcionamiento básico de MARQRun. De esta forma, el proyecto se mantiene dentro de un alcance realista y coherente con los objetivos de un trabajo de fin de ciclo.

 
5.	Diseño del sistema

En este capítulo describo cómo he planteado el diseño general de la aplicación MARQRun. Aquí explico la arquitectura del sistema, los principales componentes y cómo se comunican entre sí. El objetivo de este diseño no es construir una solución compleja, sino definir una base clara, ordenada y realista que permita entender cómo funcionaría la aplicación si se desarrollara por completo.
Desde el inicio he tenido en cuenta que este proyecto no se va a implementar al 100 %, pero aun así he querido diseñarlo como si fuera un sistema real, siguiendo una estructura lógica y fácil de mantener.

5.1 Visión general de la arquitectura

Para MARQRun he optado por una arquitectura sencilla basada en tres bloques principales: cliente, backend y base de datos. Esta separación permite entender claramente qué responsabilidad tiene cada parte del sistema y facilita su posible evolución en el futuro.
El usuario interactúa con la aplicación principalmente a través de un bot de Telegram y, de forma complementaria, mediante una aplicación web. Ambas interfaces se comunican con un backend central, que es el encargado de procesar la lógica de negocio y gestionar los datos. Por último, el backend se conecta a una base de datos donde se almacena toda la información relacionada con usuarios, grupos y entrenamientos.
He elegido este enfoque porque es muy común en aplicaciones actuales y encaja bien con el tipo de proyecto que estoy desarrollando.

 
5.2 Interfaz de usuario: bot de Telegram y web

La interfaz principal de MARQRun es un bot de Telegram. He tomado esta decisión porque Telegram es una herramienta ampliamente utilizada y no requiere que el usuario instale una aplicación adicional. Además, permite interactuar mediante botones, lo que facilita mucho la confirmación de asistencia y la consulta de información.
El bot está pensado para que tanto coordinadores como corredores puedan realizar sus acciones de forma rápida y sin menús complicados. La idea es que cualquier usuario pueda entender cómo funciona en pocos minutos, incluso aunque no tenga experiencia con este tipo de herramientas.
Como complemento, también se ha planteado una pequeña aplicación web responsive. Esta web permite consultar información básica, como los entrenamientos programados o la lista de asistentes, y sirve como apoyo visual para aquellos usuarios que prefieren una interfaz más tradicional.

5.3 Backend y lógica de negocio

El backend es el núcleo del sistema y se encarga de gestionar toda la lógica de la aplicación. Aquí se procesan las peticiones que llegan desde el bot o la web, se validan los datos y se realizan las operaciones necesarias sobre la base de datos.
En este proyecto, el backend se encargaría de funciones como la creación de grupos, el registro de entrenamientos, la gestión de confirmaciones de asistencia y el control de usuarios. También es responsable de aplicar las reglas del sistema, como evitar duplicados o comprobar que un usuario tiene permisos para realizar determinadas acciones.
Aunque no se implementa de forma real, el diseño del backend se ha planteado de forma modular, pensando en que cada funcionalidad esté bien separada para facilitar el mantenimiento y posibles ampliaciones futuras.
 

5.4 Modelo de datos y base de datos

Para almacenar la información de MARQRun se ha diseñado una base de datos sencilla, centrada en las entidades principales del sistema. Las tablas más importantes serían usuarios, grupos, entrenamientos y asistencias.
Cada usuario puede pertenecer a uno o varios grupos, y cada grupo tiene asociados distintos entrenamientos. A su vez, cada entrenamiento tiene una lista de asistentes, donde se indica si el corredor ha confirmado o no su participación. Este modelo permite representar de forma clara la información necesaria sin añadir complejidad innecesaria.
He optado por un modelo de datos simple porque facilita tanto el diseño como la comprensión del sistema, algo especialmente importante en un proyecto académico.

5.5 Seguridad y protección de datos

Aunque MARQRun no maneja información especialmente sensible, sí se trabajan datos personales básicos, como nombres o identificadores de usuario. Por este motivo, he tenido en cuenta desde el diseño aspectos relacionados con la seguridad y la protección de datos.
El sistema debe solicitar el consentimiento del usuario antes de almacenar sus datos y ofrecer la posibilidad de eliminarlos si así lo desea. Además, el acceso a determinadas funciones está limitado según el rol del usuario, evitando que un corredor pueda modificar información que solo corresponde al coordinador.
Estos aspectos forman parte del diseño del sistema, aunque no se implementen técnicamente en este proyecto.

 
5.6 Justificación del diseño elegido

El diseño del sistema se ha realizado buscando un equilibrio entre simplicidad y realismo. He evitado arquitecturas complejas o soluciones demasiado avanzadas que no aportan un valor claro al proyecto y que complicarían su comprensión.
La arquitectura propuesta permite cubrir todos los requisitos definidos anteriormente y deja la puerta abierta a futuras mejoras, como la incorporación de nuevas funcionalidades o la integración con otras plataformas. En conjunto, este diseño proporciona una base sólida y coherente para el desarrollo de MARQRun.
 
6.	Diseño de la base de datos

En este capítulo explico cómo he planteado el diseño de la base de datos de MARQRun. Aunque la aplicación no se va a implementar de forma real, he considerado importante definir una estructura de datos coherente, ya que es la base sobre la que se apoyaría todo el funcionamiento del sistema.
El objetivo de este diseño no es crear una base de datos compleja, sino una estructura clara y fácil de entender, que permita almacenar la información necesaria sin redundancias ni complicaciones innecesarias.

6.1 Enfoque general del diseño de datos

Para diseñar la base de datos he partido directamente de los requisitos definidos en capítulos anteriores. He analizado qué información necesita la aplicación para funcionar y cómo se relacionan esos datos entre sí.
Desde el principio he intentado simplificar al máximo el modelo, centrándome solo en las entidades realmente necesarias. Esto no solo facilita el diseño, sino que también hace que el sistema sea más fácil de mantener y ampliar en el futuro.
El modelo se ha planteado siguiendo una estructura relacional clásica, ya que es el enfoque más habitual y adecuado para este tipo de aplicaciones.

6.2 Identificación de las entidades principales

Tras analizar el funcionamiento de MARQRun, he identificado cuatro entidades principales que forman el núcleo de la base de datos:
-	Usuarios
-	Grupos
-	Entrenamientos
-	Asistencias
Cada una de estas entidades representa un elemento clave del sistema y responde a una necesidad concreta detectada durante el análisis del proyecto.
Los usuarios representan tanto a los coordinadores como a los corredores. Los grupos permiten organizar a los corredores en comunidades de entrenamiento. Los entrenamientos almacenan la planificación semanal y las asistencias permiten registrar quién va a participar en cada sesión.

6.3 Tabla de usuarios

La tabla de usuarios es una de las más importantes del sistema, ya que todos los demás elementos dependen de ella. En esta tabla se almacena la información básica necesaria para identificar a cada persona dentro de la aplicación.
Los campos principales de esta tabla serían un identificador único, el nombre del usuario, el identificador de Telegram y la fecha de registro. Además, se incluye un campo para almacenar el consentimiento RGPD, lo que permite cumplir con la normativa de protección de datos desde el diseño.
He decidido no incluir datos sensibles ni innecesarios, ya que la aplicación no los requiere para su funcionamiento.

6.4 Tabla de grupos de running

La tabla de grupos se utiliza para representar cada grupo de running creado dentro de MARQRun. Cada grupo tiene un nombre y está asociado a un usuario que actúa como coordinador.
Este diseño permite que un mismo usuario pueda gestionar varios grupos si lo desea, algo bastante habitual en entrenadores o coordinadores de distintos equipos. Además, facilita el control de permisos, ya que solo el coordinador puede modificar ciertos datos del grupo.

6.5 Tabla de entrenamientos

La tabla de entrenamientos almacena la información relacionada con cada sesión programada. Para cada entrenamiento se guarda la fecha, la hora y el tipo de entrenamiento, así como el grupo al que pertenece.
He considerado importante separar los entrenamientos de los grupos, ya que esto permite mantener un histórico de sesiones y facilita futuras ampliaciones, como estadísticas o consultas de entrenamientos anteriores.




6.6 Tabla de asistencias

La tabla de asistencias es la encargada de relacionar a los usuarios con los entrenamientos. En ella se registra si un corredor ha confirmado o no su asistencia a una sesión concreta.
Este enfoque permite representar fácilmente la relación muchos a muchos entre usuarios y entrenamientos, ya que un usuario puede asistir a muchos entrenamientos y un entrenamiento puede tener muchos asistentes. Además, permite añadir información adicional en el futuro, como comentarios o estados personalizados.

6.7 Relaciones entre las tablas

Una vez definidas las tablas, se establecen las relaciones entre ellas. Un usuario puede crear uno o varios grupos, cada grupo puede tener varios entrenamientos y cada entrenamiento puede contar con múltiples asistentes.
Este modelo refleja de forma fiel el funcionamiento real de un grupo de running y permite consultar la información de manera sencilla. Por ejemplo, es fácil obtener la lista de asistentes a un entrenamiento o saber qué entrenamientos tiene programados un grupo.

6.8 Justificación del modelo de datos
El modelo de datos propuesto cumple con las necesidades actuales del proyecto sin añadir complejidad innecesaria. He priorizado la claridad y la simplicidad, ya que considero que es lo más adecuado para un proyecto de fin de ciclo.
Además, este diseño deja la puerta abierta a futuras mejoras, como la incorporación de estadísticas más avanzadas, sin necesidad de rehacer completamente la base de datos







7.	Diagramas del sistema

En este capítulo explico los distintos diagramas que he utilizado para representar el funcionamiento de MARQRun de forma visual. Aunque la aplicación no se ha desarrollado completamente, considero que estos diagramas son fundamentales para entender cómo interactúan los usuarios con el sistema y cómo fluye la información internamente.
Los diagramas ayudan a aclarar ideas y a detectar posibles problemas antes de empezar a programar, por lo que su elaboración ha sido una parte importante del trabajo, incluso tratándose de un proyecto académico.

7.1 Diagrama de casos de uso

El primer diagrama que he realizado es el diagrama de casos de uso. Este diagrama permite representar, de forma sencilla, qué acciones puede realizar cada tipo de usuario dentro del sistema.
En MARQRun he definido dos actores principales: el coordinador del grupo y el corredor. A partir de estos actores, he ido listando las acciones más habituales que cada uno necesita realizar.
El coordinador puede crear grupos, programar entrenamientos y consultar la lista de asistentes. Por su parte, el corredor puede consultar los entrenamientos programados y confirmar su asistencia. También existe un caso de uso común para ambos perfiles relacionado con el registro y la aceptación de la política de privacidad.
Este diagrama me ha servido para asegurarme de que todos los requisitos funcionales definidos anteriormente estaban correctamente cubiertos y que no faltaba ninguna funcionalidad clave.

7.2 Justificación de los casos de uso definidos

A la hora de definir los casos de uso, he intentado no añadir acciones innecesarias. Mi objetivo no era diseñar una aplicación con muchas opciones, sino una herramienta práctica y directa.
Por ejemplo, he evitado incluir casos de uso relacionados con configuraciones avanzadas o personalización excesiva, ya que no encajan con el perfil de los usuarios ni con el alcance del proyecto. En cambio, he dado prioridad a acciones que se repiten cada semana y que actualmente generan más problemas en los grupos de running.
7.3 Diagrama entidad-relación (ER)

Otro diagrama importante es el diagrama entidad–relación, que representa visualmente el modelo de datos descrito en el capítulo anterior. Este diagrama muestra las entidades principales del sistema y cómo se relacionan entre sí.
En el diagrama aparecen las entidades de usuarios, grupos, entrenamientos y asistencias, junto con sus relaciones. Por ejemplo, se puede ver claramente que un usuario puede pertenecer a varios grupos y que un entrenamiento puede tener varios asistentes.
Este diagrama me ha ayudado a comprobar que el diseño de la base de datos es coherente y que las relaciones están bien planteadas antes de pasar a una posible implementación.

7.4 Diagrama de secuencia: programación de un entrenamiento

Para representar el funcionamiento interno del sistema en una acción concreta, he diseñado un diagrama de secuencia centrado en la programación de un entrenamiento por parte del coordinador.
En este diagrama se muestra cómo el coordinador interactúa con el bot de Telegram, cómo el backend procesa la información y cómo finalmente se guarda el entrenamiento en la base de datos y se publica el mensaje en el grupo.
Este tipo de diagrama resulta muy útil para entender el flujo de datos y comprobar que todos los pasos están bien definidos, incluso aunque no se llegue a programar la funcionalidad.

7.5 Diagrama de secuencia: confirmación de asistencia

Otro diagrama de secuencia representa el proceso de confirmación de asistencia por parte de un corredor. En este caso, el corredor pulsa un botón en Telegram, el backend recibe la acción, actualiza la base de datos y devuelve la información actualizada al usuario.
He incluido este diagrama porque es una de las funcionalidades clave de MARQRun y una de las que más valor aporta al coordinador del grupo. Además, es un buen ejemplo de cómo una acción sencilla para el usuario implica varios pasos internos dentro del sistema.
7.6 Utilidad de los diagramas en el proyecto

Aunque pueda parecer que los diagramas no son necesarios en un proyecto que no se va a implementar completamente, considero que aportan mucho valor. Gracias a ellos he podido organizar mejor las ideas, detectar incoherencias y justificar las decisiones de diseño tomadas a lo largo del trabajo.
Además, estos diagramas facilitan que cualquier persona que lea la memoria entienda rápidamente cómo funciona MARQRun, incluso sin entrar en detalles técnicos complejos.

 
8.	Implementación de la aplicación MARQRun

En este capítulo describo el proceso de implementación de la aplicación MARQRun, explicando cómo se han desarrollado los distintos componentes del sistema y las decisiones técnicas que se han tomado durante el desarrollo. El objetivo principal ha sido construir un prototipo funcional centrado en la automatización de la organización de entrenamientos para grupos de running amateur, priorizando la sencillez y la facilidad de uso.
El desarrollo se ha llevado a cabo de forma incremental, comenzando por las funcionalidades básicas y ampliando progresivamente el sistema conforme se iban validando los requisitos definidos en los capítulos anteriores.

8.1 Tecnologías utilizadas

En una primera fase se ha definido la estructura básica del proyecto, separando el código del bot, la base de datos y la documentación. Esta organización permite trabajar de forma ordenada desde el inicio y facilita tanto el mantenimiento como la ampliación futura de la aplicación.
 
 
El desarrollo de MARQRun se ha realizado utilizando Python como lenguaje principal. Para gestionar correctamente las dependencias del proyecto y evitar conflictos con otras aplicaciones instaladas en el sistema, se ha creado un entorno virtual específico. La herramienta utilizada ha sido Visual Studio Code con sus extensiones necesarias. Esta práctica es habitual en entornos profesionales y permite mantener un mayor control sobre las librerías utilizadas durante el desarrollo.
 









Para la implementación del bot de Telegram se ha utilizado la librería python-telegram-bot, que proporciona una API sencilla y bien documentada para interactuar con la plataforma. Gracias a esta librería ha sido posible desarrollar un bot funcional sin necesidad de emplear herramientas complejas, lo que encaja con el enfoque práctico del proyecto.
 
La elección de Python como lenguaje principal se debe a su simplicidad, legibilidad y a la amplia comunidad que lo respalda. Además, permite desarrollar prototipos funcionales de forma rápida, lo que resulta especialmente útil en proyectos orientados a validar una idea como MARQRun.
En cuanto al backend de la aplicación, se ha utilizado el microframework Flask, que permite crear aplicaciones web ligeras y APIs REST de forma sencilla. Flask se ha empleado para centralizar la lógica de negocio del sistema y servir de puente entre el bot de Telegram, la base de datos y la futura interfaz web/móvil.
Para el almacenamiento de la información se ha optado por una base de datos relacional SQLite, adecuada para un proyecto de estas características por su sencillez, ligereza y facilidad de integración con Python. Esta base de datos permite persistir la información de usuarios, grupos, entrenamientos y asistencias.
Como complemento al bot de Telegram, se ha desarrollado una pequeña interfaz web responsive utilizando HTML y CSS, accesible desde distintos dispositivos. Esta interfaz actúa como una primera aproximación a la aplicación móvil, permitiendo la visualización de información básica y sentando las bases para futuras ampliaciones del proyecto.
8.2 Implementación del bot de Telegram

En este apartado explico cómo se ha llevado a cabo la creación y puesta en marcha del bot de Telegram de la aplicación MARQRun, que actúa como interfaz principal entre los usuarios y el sistema. El objetivo en esta fase no ha sido desarrollar todas las funcionalidades finales, sino disponer de un bot operativo que sirva como base para ir ampliando la aplicación de forma progresiva.
Creación del bot con BotFather
El primer paso ha consistido en la creación del bot utilizando BotFather, la herramienta oficial de Telegram para la gestión de bots. A través de esta herramienta se ha definido el nombre del bot y su nombre de usuario único, obteniendo finalmente el token de acceso necesario para que la aplicación pueda comunicarse con la API de Telegram.
Este token es un elemento crítico de seguridad, ya que permite controlar el bot, por lo que se ha almacenado únicamente en el entorno local de desarrollo y no se muestra de forma pública en la documentación.

 

El bot se ha ejecutado desde la terminal integrada de Visual Studio Code, activando previamente el entorno virtual. Al iniciar el programa, el bot queda a la espera de recibir mensajes desde Telegram.
Para comprobar su correcto funcionamiento, se ha iniciado una conversación con el bot desde Telegram y se ha utilizado el comando /start, obteniendo como respuesta el mensaje de bienvenida definido en el código. Esta prueba confirma que el bot está operativo y preparado para la incorporación de nuevas funcionalidades.
 

Y la prueba del bot en Telegram:
 



El bot permite crear grupos de running introduciendo únicamente el nombre del grupo mediante un comando sencillo. Esta funcionalidad reduce la complejidad inicial y facilita que cualquier coordinador pueda comenzar a usar la aplicación sin conocimientos técnicos.
 

Una vez creado el grupo, el coordinador puede programar entrenamientos indicando la fecha, la hora y el tipo de sesión mediante un comando sencillo. El bot publica automáticamente la información del entrenamiento para que todos los corredores puedan consultarla.
 
Para los corredores, el bot muestra botones interactivos que permiten confirmar o rechazar la asistencia con un solo toque, mejorando la organización del grupo y reduciendo mensajes innecesarios.
 

  
8.3 Implementación del backend y lógica de negocio

En este apartado describo el desarrollo del backend de la aplicación MARQRun. El backend es la parte encargada de procesar las acciones realizadas por los usuarios desde el bot de Telegram y, en el futuro, desde la interfaz web o móvil. Su función principal es centralizar la lógica de negocio, validar los datos recibidos y servir como punto de conexión con la base de datos.
He decidido implementar el backend de forma progresiva, comenzando por una versión mínima funcional. De esta manera puedo comprobar que el entorno de desarrollo está correctamente configurado antes de añadir funcionalidades más complejas como la gestión de grupos, entrenamientos o asistencias.

8.3.1 Creación de la estructura inicial del backend

El primer paso ha sido crear la estructura básica del backend utilizando el framework Flask. Para ello se ha creado una carpeta independiente dentro del proyecto, separada del código del bot y de la documentación. Esta separación permite trabajar de forma ordenada y simula una arquitectura real utilizada en proyectos profesionales.
Dentro del backend se ha creado un archivo principal (app.py) que actúa como punto de entrada de la aplicación. En esta fase inicial, el objetivo no era implementar funcionalidades completas, sino comprobar que el servidor Flask podía iniciarse correctamente y responder a peticiones.

La estructura elegida ha sido:
 
8.3.2 Puesta en marcha del servidor Flask
Una vez definida la estructura básica, se ha procedido a ejecutar el servidor Flask desde el entorno virtual del proyecto. Al lanzar la aplicación, el servidor se inicia en modo desarrollo y comienza a escuchar peticiones HTTP en la dirección local http://127.0.0.1:5000.
La correcta ejecución del servidor confirma que Flask está bien instalado, que el entorno virtual funciona correctamente y que la aplicación puede ponerse en marcha sin errores. Esta comprobación es fundamental antes de avanzar hacia una arquitectura más compleja.
 
Ejecutamos el backend:
 
 
8.3.3 Primer endpoint de comprobación del sistema

Para validar que el backend no solo se ejecuta correctamente, sino que también es capaz de responder a peticiones, se ha implementado un endpoint básico que devuelve un mensaje en formato JSON. Este endpoint actúa como prueba de funcionamiento del sistema y permite verificar la comunicación entre el navegador y el servidor.
Al acceder a la URL del servidor desde un navegador web, se obtiene una respuesta que indica que el backend está activo. Esta prueba sirve como base para la posterior implementación de endpoints más avanzados, como la creación de grupos o la gestión de entrenamientos.

 
 

 

8.3.4	Función del backend dentro del sistema MARQRun

Aunque en esta fase el backend es todavía sencillo, su papel dentro del sistema es clave. En las siguientes etapas del proyecto será el encargado de:
-	Gestionar la creación y consulta de grupos de running.
-	Almacenar y recuperar los entrenamientos programados.
-	Registrar las asistencias de los corredores.
-	Centralizar la lógica de negocio, evitando que esta quede repartida entre el bot y la interfaz web.
Este enfoque permite que tanto el bot de Telegram como la futura aplicación web o móvil utilicen el mismo backend, garantizando coherencia en los datos y facilitando el mantenimiento del sistema.
8.3.5 Valoración de la implementación del backend

El desarrollo inicial del backend ha permitido sentar las bases técnicas del proyecto MARQRun. Aunque las funcionalidades implementadas en esta fase son básicas, el sistema ya está preparado para crecer de forma ordenada.
Este enfoque incremental ha resultado especialmente útil para detectar posibles problemas de configuración desde el principio y asegurar que la arquitectura elegida es válida para los objetivos del proyecto.






 
8.4 Implementación de la base de datos

La base de datos se ha implementado siguiendo el modelo definido en el capítulo de diseño. Se han creado las tablas correspondientes a usuarios, grupos, entrenamientos y asistencias, junto con sus relaciones.
Durante la implementación se ha prestado especial atención a mantener la integridad de los datos, evitando duplicidades y asegurando que las relaciones entre tablas reflejan correctamente el funcionamiento real de un grupo de running.
Este diseño permite consultar de forma sencilla la información más relevante, como la lista de asistentes a un entrenamiento o los entrenamientos programados para un grupo concreto.


8.4.1 Elección del sistema de base de datos

Para dotar al sistema MARQRun de persistencia real de datos, se ha incorporado una base de datos relacional utilizando SQLite. Esta elección se debe a su ligereza, facilidad de integración con Python y adecuación para proyectos de tamaño medio como el presente.
SQLite no requiere la instalación de un servidor independiente, ya que almacena toda la información en un único archivo local. Esto simplifica el desarrollo y facilita la portabilidad del proyecto.



 
8.4.2 Organización estructural de la base de datos

Con el objetivo de mantener una estructura limpia y modular, se ha creado una carpeta específica denominada “database” dentro del proyecto. En esta carpeta se almacena el archivo marqrun.db, que contiene todas las tablas y datos del sistema.
Esta separación permite diferenciar claramente:
-	Código fuente (backend y bot)
-	Documentación
-	Base de datos
Este enfoque mejora la organización del proyecto y facilita su mantenimiento.
 







8.4.3 Integración mediante SQLAlchemy

Para la gestión de la base de datos se ha utilizado Flask-SQLAlchemy, una extensión que permite trabajar con modelos orientados a objetos en lugar de escribir consultas SQL manualmente.
Se ha definido un modelo denominado “Grupo”, que representa la tabla correspondiente en la base de datos. Este modelo incluye:
-	Un identificador único (clave primaria).
-	El nombre del grupo de running.
La utilización de un ORM (Object Relational Mapping) permite mantener el código más estructurado, legible y preparado para futuras ampliaciones del sistema.
 

8.4.4 Creación automática de la base de datos

La base de datos se genera automáticamente al iniciar el backend por primera vez con la instrucción db.create_all(). Este mecanismo crea las tablas definidas en los modelos si no existen previamente.
Gracias a esto, no es necesario ejecutar manualmente scripts SQL para la creación inicial de la estructura de datos.



8.4.5 Adaptación de los endpoints al uso de persistencia real

Una vez integrada la base de datos, los endpoints de gestión de grupos han sido modificados para utilizar consultas reales a la base de datos en lugar de almacenamiento temporal en memoria.
Ahora, con esto logramos que las operaciones de creación y consulta interactúen directamente con la base de datos SQLite, garantizando así que la información permanezca almacenada tras reiniciar el servidor.
Las pruebas realizadas con Postman han confirmado que los datos persisten correctamente.
 



8.4.6 Valoración de la implementación

La incorporación de la base de datos supone un avance significativo en el desarrollo del proyecto, ya que transforma el backend en un sistema persistente y estructurado.
Este paso consolida la arquitectura cliente-servidor adoptada y sienta las bases para la futura implementación de nuevas entidades, como entrenamientos y registros de asistencia, aumentando la robustez y escalabilidad del sistema.



8.4.7 Modelado relacional: tabla Entrenamiento

Con el objetivo de estructurar correctamente la información del sistema, se ha incorporado una nueva entidad denominada “Entrenamiento”, que representa cada sesión programada por un grupo de running.
Cada entrenamiento incluye:
-	Identificador único.
-	Fecha.
-	Hora.
-	Tipo de sesión.
-	Grupo al que pertenece.
Se ha definido una relación uno-a-muchos entre Grupo y Entrenamiento, de forma que un grupo puede tener múltiples entrenamientos asociados.
Código empleado:
 

8.4.8 Implementación de la relación entre tablas

La relación entre Grupo y Entrenamiento se ha implementado mediante:
-	Clave foránea (grupo_id) en la tabla Entrenamiento.
-	Relación definida mediante db.relationship en el modelo Grupo.
Este diseño garantiza la integridad referencial y permite obtener fácilmente los entrenamientos asociados a cada grupo.
 

 
8.4.9 Implementación del sistema de asistencias.

En esta fase se ha incorporado una nueva entidad denominada “Asistencia”, cuyo objetivo es registrar la participación de los corredores en los distintos entrenamientos.
Cada registro de asistencia incluye el nombre del usuario, el estado de asistencia (asistirá o no) y el entrenamiento al que está asociado. De este modo, se establece una relación directa entre los entrenamientos y los corredores.
Este sistema permite conocer de forma rápida qué usuarios participarán en cada sesión, resolviendo uno de los principales problemas detectados en los grupos de running: la falta de organización y confirmación de asistencia.
Para validar esta funcionalidad se han realizado pruebas mediante Postman, comprobando tanto el registro de nuevas asistencias como la consulta de las mismas.
POST:
 








GET: 
 











8.5 Implementación de la interfaz web

8.5.1 Desarrollo de la interfaz web básica
En esta fase del proyecto he desarrollado una interfaz web sencilla con el objetivo de complementar el uso del bot de Telegram y ofrecer una alternativa más visual para los usuarios.
He decidido implementar esta interfaz utilizando HTML y JavaScript, ya que permiten crear una solución ligera sin necesidad de frameworks complejos. La idea en este punto no era hacer una aplicación visualmente avanzada, sino comprobar que el sistema completo funciona correctamente desde un entorno gráfico.
La interfaz se ha estructurado de forma muy simple, mostrando un título principal, un apartado para la creación de grupos y una lista donde se visualizan los grupos existentes.
 
 

8.5.2 Integración con el backend
Uno de los puntos clave de esta fase ha sido conseguir la comunicación entre la interfaz web y el backend desarrollado previamente.
Para ello he utilizado la función fetch de JavaScript, que permite realizar peticiones HTTP a la API REST del sistema. Gracias a esto, la web puede enviar datos al servidor y recibir información actualizada en tiempo real.
Durante el desarrollo me encontré con un problema relacionado con las políticas de seguridad del navegador (CORS), que impedía que la web accediera al backend. Para solucionarlo, he añadido soporte CORS en Flask, permitiendo así la comunicación entre ambos componentes.

8.5.3 Funcionalidad de creación de grupos
Una de las primeras funcionalidades implementadas ha sido la creación de grupos desde la interfaz web.
El usuario puede introducir el nombre de un grupo en un campo de texto y, al pulsar el botón correspondiente, se envía una petición POST al backend. Este procesa la información, la almacena en la base de datos y devuelve una respuesta.
Después de crear el grupo, la interfaz actualiza automáticamente la lista para reflejar el nuevo estado del sistema.




 

8.5.4 Visualización de grupos
Además de la creación de grupos, la interfaz permite visualizar todos los grupos almacenados en la base de datos.
Para ello, al cargar la página se realiza una petición GET al backend, obteniendo la lista de grupos en formato JSON. Posteriormente, estos datos se recorren y se muestran dinámicamente en la interfaz mediante elementos HTML.
Esta funcionalidad permite comprobar de forma visual que la información se está almacenando correctamente y que existe una comunicación real entre cliente y servidor.
 
Como vemos al Crear el grupo se muestra una lista de los grupos creados.

 
8.5.5 Código de la interfaz

 

8.5.6 Valoración de la implementación
Aunque la interfaz desarrollada es sencilla, considero que cumple perfectamente su objetivo dentro del proyecto. Me ha permitido validar el funcionamiento completo del sistema, integrando frontend, backend y base de datos.
Además, esta base servirá para futuras mejoras, como la gestión de entrenamientos y asistencias desde la propia web, lo que permitiría evolucionar el proyecto hacia una aplicación más completa.

 
8.6 Gestión de usuarios y cumplimiento del RGPD

Desde el inicio del desarrollo se ha tenido en cuenta el cumplimiento de la normativa de protección de datos. Durante el registro, los usuarios deben aceptar la política de privacidad antes de poder utilizar la aplicación.
El sistema almacena el consentimiento del usuario y ofrece la posibilidad de solicitar el borrado de los datos personales. Esta funcionalidad se ha implementado como parte del flujo normal de uso y no como un elemento añadido posteriormente.
De esta forma, MARQRun cumple con los requisitos legales y ofrece transparencia sobre el uso de la información personal.

8.7 Valoración de la implementación

El resultado del proceso de implementación es un prototipo funcional que cumple con los requisitos definidos para el MVP. La aplicación permite organizar entrenamientos de forma automática, reducir tareas repetitivas y mejorar la coordinación dentro de los grupos de running.
El desarrollo realizado demuestra que la idea es técnicamente viable y que puede ampliarse fácilmente con nuevas funcionalidades en el futuro. Además, el enfoque elegido ha permitido mantener el sistema simple y accesible, alineado con los objetivos iniciales del proyecto.
 
8	Pruebas y validación del sistema

En este capítulo describo el proceso de pruebas realizado sobre la aplicación MARQRun con el objetivo de comprobar que el sistema funciona correctamente y que cumple con los requisitos definidos en las fases anteriores del proyecto. Las pruebas se han centrado principalmente en validar las funcionalidades clave del MVP y en asegurar que la experiencia de uso es adecuada para los perfiles de usuario definidos.
El enfoque de las pruebas ha sido práctico y orientado al usuario final, priorizando escenarios reales de uso frente a pruebas excesivamente técnicas.

9.1 Enfoque general de las pruebas

Desde el inicio del desarrollo tuve claro que las pruebas debían centrarse en comprobar que la aplicación resolvía los problemas reales de los grupos de running. Por este motivo, se han planteado pruebas funcionales basadas en acciones habituales, como crear grupos, programar entrenamientos o confirmar la asistencia.
Las pruebas se han realizado simulando el uso normal de la aplicación por parte de coordinadores y corredores, utilizando el bot de Telegram y la interfaz web. Este enfoque permite validar el sistema desde el punto de vista del usuario y detectar posibles errores o mejoras de forma temprana.










9.2 Pruebas funcionales del bot de Telegram

El bot de Telegram ha sido el primer componente en ser probado, ya que es la principal interfaz de la aplicación. Las pruebas se han centrado en verificar que los comandos y botones funcionan correctamente y que las respuestas del sistema son claras y coherentes.
Se ha comprobado la creación de grupos introduciendo distintos nombres, verificando que el sistema genera correctamente un identificador único para cada grupo. También se ha probado la programación de entrenamientos, asegurando que la información introducida se guarda correctamente y se publica en el grupo correspondiente.
Por último, se han realizado pruebas de confirmación de asistencia, comprobando que al pulsar los botones el estado se actualiza correctamente y es visible tanto para el coordinador como para los corredores.

9.3 Pruebas de la interfaz web

Aunque la interfaz web tiene un papel secundario dentro del sistema, también se han realizado pruebas para comprobar su correcto funcionamiento. Estas pruebas se han centrado principalmente en la visualización de la información y en la adaptación a distintos tamaños de pantalla.
Se ha verificado que la web es accesible desde dispositivos móviles, tablets y ordenadores, y que los elementos se muestran correctamente en todos los casos. Además, se ha comprobado que la información mostrada coincide con la gestionada desde el bot, manteniendo la coherencia entre ambas interfaces.

9.4 Pruebas de gestión de usuarios y RGPD

Otro aspecto importante que se ha validado es la gestión de usuarios y el cumplimiento de la normativa de protección de datos. Se ha comprobado que el sistema solicita el consentimiento del usuario antes de permitir el acceso a la aplicación y que dicho consentimiento queda registrado correctamente.
También se ha probado la funcionalidad de borrado de datos, verificando que un usuario puede solicitar la eliminación de su información personal y que esta acción se procesa correctamente. Estas pruebas son especialmente importantes para garantizar que la aplicación cumple con los requisitos legales establecidos.

9.5 Validación de los objetivos del MVP

Una vez realizadas las pruebas funcionales, se ha evaluado el grado de cumplimiento de los objetivos definidos para el MVP. En este punto se ha comprobado que la aplicación permite reducir las tareas repetitivas del coordinador, mejorar la organización de los entrenamientos y facilitar la participación de los corredores.
La validación se ha basado en el uso continuado de la aplicación durante varias semanas, observando el comportamiento de los usuarios y recogiendo impresiones generales sobre la experiencia de uso. Los resultados obtenidos han sido positivos y refuerzan la viabilidad del proyecto.

9.6 Resultados obtenidos

Los resultados de las pruebas muestran que MARQRun cumple con los requisitos funcionales definidos y ofrece una solución efectiva para la organización de grupos de running amateur. La automatización de la gestión de entrenamientos y asistencias reduce notablemente el número de mensajes innecesarios y mejora la claridad de la información.
Además, la simplicidad de la interfaz ha facilitado la adopción por parte de usuarios sin conocimientos técnicos, uno de los objetivos principales del proyecto.

9.7 Conclusiones

El proceso de pruebas ha permitido confirmar que el sistema funciona de forma estable y que responde correctamente a las acciones de los usuarios. También ha servido para detectar pequeñas mejoras en la usabilidad, que podrían abordarse en futuras versiones de la aplicación.
En general, las pruebas realizadas demuestran que MARQRun es un proyecto viable, bien definido y alineado con las necesidades reales de los grupos de running amateur.





9	Conclusiones y líneas de trabajo futuro

En este último capítulo presento las conclusiones finales del proyecto MARQRun y reflexiono sobre el trabajo realizado a lo largo de su desarrollo. También se plantean posibles mejoras y líneas de trabajo futuro que podrían abordarse en versiones posteriores de la aplicación.

10.1 Conclusiones del proyecto

El desarrollo de MARQRun ha permitido aplicar de forma práctica muchos de los conocimientos adquiridos durante el ciclo formativo de Desarrollo de Aplicaciones Multiplataforma. A lo largo del proyecto se ha seguido un proceso completo, desde el análisis de necesidades hasta el diseño, implementación y validación de una aplicación realista y orientada a un problema concreto.

Uno de los principales logros del proyecto ha sido definir una solución sencilla y eficaz para la organización de grupos de running amateur. La automatización de tareas repetitivas, como la gestión de entrenamientos y la confirmación de asistencia, aporta un valor claro a los usuarios y mejora su experiencia diaria.

Además, el proyecto ha demostrado que no siempre es necesario desarrollar aplicaciones complejas para resolver problemas reales. En este caso, el uso de un bot de Telegram como interfaz principal ha permitido crear una herramienta accesible, fácil de usar y adaptada al perfil de los usuarios.

 
10.2 Cumplimiento de los objetivos planteados

Los objetivos definidos al inicio del proyecto se han cumplido de forma satisfactoria. Se ha conseguido diseñar e implementar un prototipo funcional que permite gestionar grupos de running, programar entrenamientos y mejorar la coordinación entre los participantes.

Las pruebas realizadas indican que la aplicación reduce el tiempo dedicado a tareas organizativas y aumenta la claridad de la información compartida dentro del grupo. Estos resultados confirman que la propuesta de valor de MARQRun es adecuada y responde a una necesidad real.

10.3 Dificultades encontradas

Durante el desarrollo del proyecto también han surgido algunas dificultades. Una de las principales ha sido decidir qué funcionalidades incluir y cuáles dejar fuera para mantener un alcance realista. En muchos momentos fue necesario priorizar la simplicidad frente a la ambición técnica.

Otra dificultad ha sido diseñar el sistema pensando en usuarios no técnicos, lo que obliga a cuidar especialmente la usabilidad y la claridad de los flujos de interacción. Este aspecto ha supuesto un reto, pero también ha sido una de las partes más interesantes del proyecto.

10.4 Aprendizajes personales y técnicos

Este proyecto ha supuesto un importante aprendizaje tanto a nivel técnico como personal. A nivel técnico, ha permitido consolidar conceptos relacionados con el diseño de sistemas, la arquitectura de aplicaciones y la planificación de proyectos software.

A nivel personal, el proyecto ha ayudado a mejorar la capacidad de análisis, la toma de decisiones y la organización del trabajo. También ha servido para comprender la importancia de documentar correctamente un proyecto y justificar cada decisión tomada.

10.5 Líneas de trabajo futuro

Aunque MARQRun cumple con los objetivos planteados, existen múltiples posibilidades de mejora y ampliación. Entre las líneas de trabajo futuro se encuentra la incorporación de estadísticas más avanzadas sobre el rendimiento de los corredores, así como la integración con plataformas deportivas externas.

También podría añadirse un sistema de notificaciones más avanzado, la personalización de entrenamientos o la creación de roles adicionales dentro de los grupos. Estas mejoras permitirían ampliar el alcance de la aplicación sin perder su enfoque principal.

10.6 Valoración final

En conjunto, MARQRun ha resultado ser un proyecto completo, coherente y realista, adecuado al nivel y objetivos de un proyecto de fin de ciclo de DAM. El trabajo realizado demuestra la capacidad para analizar un problema real, diseñar una solución técnica y documentar todo el proceso de forma clara y estructurada.

Este proyecto representa un buen punto de partida para desarrollos más complejos en el futuro y refleja de manera fiel los conocimientos adquiridos durante el ciclo formativo.










 
10	Bibliografía y webgrafía

En este apartado se recogen las principales fuentes consultadas durante la realización del proyecto. Estas fuentes han servido como apoyo tanto para el análisis del problema como para la definición de la solución técnica y la justificación de las decisiones tomadas a lo largo del desarrollo de MARQRun.
Se han utilizado principalmente recursos online, documentación técnica y artículos relacionados con el desarrollo de aplicaciones, la automatización de procesos y el uso de bots de mensajería.
11.1 Webgrafía

-	Telegram. Telegram Bot API Documentation.
https://core.telegram.org/bots/api
-	Telegram. Bots: An introduction for developers.
https://core.telegram.org/bots
-	Ministerio de Asuntos Económicos y Transformación Digital. Guía sobre protección de datos personales (RGPD).
https://www.aepd.es
-	Oracle. Conceptos básicos de bases de datos relacionales.
https://www.oracle.com/database/
-	IBM. Introducción a la arquitectura cliente-servidor.
https://www.ibm.com/docs
-	Atlassian. Guía básica de metodologías ágiles.
https://www.atlassian.com/agile
-	Strava. Plataforma social para deportistas (referencia como competidor).
https://www.strava.com

Estas fuentes han sido utilizadas como referencia general y apoyo conceptual, adaptando siempre los contenidos al contexto específico del proyecto MARQRun.




















