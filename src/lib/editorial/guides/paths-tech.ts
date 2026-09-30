import type { Guide } from "./types";

/** Learning paths for programming and data (September 2026). */
export const TECH_PATHS: Guide[] = [
  {
    slug: "ruta-desarrollo-frontend",
    kind: "ruta",
    shortTitle: "Desarrollo frontend",
    title: "Ruta de desarrollo frontend con cursos gratis: de HTML a React",
    description:
      "El orden en el que aprender HTML, CSS, JavaScript y un framework como React, cuánto tiempo dedicar a cada etapa y qué construir para demostrarlo.",
    categorySlug: "programming",
    courseMatch: {
      categories: ["programming", "design"],
      keywords: ["html", "css", "javascript", "react", "frontend", "typescript", "tailwind", "web", "vue", "angular", "next"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["ruta-desarrollo-backend", "ruta-diseno-ux-ui", "proyectos-para-consolidar-lo-aprendido", "demostrar-lo-aprendido-sin-certificado"],
    intro:
      "El desarrollo frontend es la parte de la web que ves y con la que interactúas: la estructura de una página, su aspecto y su comportamiento. Es una de las puertas de entrada más habituales a la programación porque ves el resultado de tu trabajo al instante en el navegador. También es un terreno donde abundan los cursos gratuitos de calidad, lo que paradójicamente hace fácil perderse. Esta ruta ordena el camino en cinco etapas, con criterios para saber cuándo pasar a la siguiente.",
    sections: [
      {
        heading: "Antes de empezar: qué necesitas de verdad",
        paragraphs: [
          "Para seguir esta ruta basta con un ordenador normal, un navegador moderno y un editor de código gratuito como Visual Studio Code. No necesitas saber matemáticas avanzadas ni haber programado antes. Lo que sí necesitas es tiempo regular: con cinco o seis horas a la semana, la ruta completa lleva entre seis y nueve meses, y es perfectamente compatible con un trabajo.",
          "Un consejo que ahorra frustración: crea desde el primer día una carpeta de proyectos y guarda todo lo que hagas, aunque sea un ejercicio de diez líneas. Al final de la ruta esa carpeta será tu mejor prueba de progreso.",
        ],
      },
      {
        heading: "Etapa 1 — HTML y CSS: estructura y presentación (4-6 semanas)",
        paragraphs: [
          "HTML define qué hay en la página (títulos, párrafos, enlaces, formularios) y CSS decide cómo se ve. Un buen curso de iniciación los enseña juntos y termina con una página completa. Presta especial atención a tres temas que se usan a diario: el modelo de caja (márgenes, bordes y rellenos), Flexbox y Grid para colocar elementos, y el diseño adaptable a móviles con media queries.",
          "Sabes que puedes pasar a la siguiente etapa cuando eres capaz de reproducir, sin copiar código, una página sencilla que veas en internet: una tarjeta de perfil, una portada de producto o una página de receta que se vea bien tanto en el móvil como en el ordenador.",
        ],
        steps: [
          "Escribe HTML semántico: usa header, main, nav, article y button en lugar de div para todo.",
          "Aprende a usar las herramientas de desarrollo del navegador para inspeccionar y ajustar estilos.",
          "Cuida la accesibilidad desde el principio: textos alternativos en imágenes, contraste suficiente y formularios con etiquetas.",
        ],
      },
      {
        heading: "Etapa 2 — JavaScript: la lógica (8-10 semanas)",
        paragraphs: [
          "JavaScript es el lenguaje que da comportamiento a la página. Es la etapa más larga y la más importante de la ruta, porque aquí aprendes a programar de verdad: variables, tipos de datos, condicionales, bucles, funciones, arrays y objetos. Elige un curso largo de fundamentos que empiece desde cero y síguelo completo antes de tocar ningún framework.",
          "Cuando domines lo básico, céntrate en lo que hace especial a JavaScript en el navegador: manipular el DOM (los elementos de la página), responder a eventos como clics o envíos de formulario, y trabajar con código asíncrono (promesas, async/await y fetch para pedir datos a una API). Estos tres temas son los que más cuestan y los que más se usan después.",
        ],
        steps: [
          "Haz ejercicios cortos a diario: manipular textos, filtrar listas, calcular totales.",
          "Construye una lista de tareas que guarde los datos en el navegador (localStorage).",
          "Consume una API pública gratuita (el tiempo, películas, países) y muestra los resultados en la página.",
        ],
      },
      {
        heading: "Etapa 3 — Herramientas del oficio (2-3 semanas)",
        paragraphs: [
          "Antes del framework conviene aprender las herramientas que usa cualquier equipo: Git para guardar versiones de tu código, GitHub para publicarlo, la terminal para ejecutar comandos y npm para instalar paquetes. No hace falta dominarlas; basta con el flujo diario: crear un repositorio, hacer commits con mensajes claros, subir cambios y publicar una web estática gratis en servicios como GitHub Pages.",
          "Esta etapa es corta pero cambia tu forma de trabajar: a partir de aquí, cada proyecto que hagas debería vivir en un repositorio público con un README que explique qué es y cómo verlo.",
        ],
      },
      {
        heading: "Etapa 4 — Un framework: React u otro (8-10 semanas)",
        paragraphs: [
          "Los frameworks como React, Vue o Angular resuelven un problema concreto: organizar interfaces grandes en componentes reutilizables que se actualizan solos cuando cambian los datos. React es hoy el más demandado en ofertas de empleo, pero cualquiera de ellos sirve para aprender los conceptos, que se transfieren bien de uno a otro.",
          "Busca un curso que construya una aplicación completa y cubra componentes, props, estado, efectos, formularios y enrutado. Si un curso asume conocimientos de JavaScript que aún no tienes (desestructuración, funciones flecha, métodos de arrays como map y filter), vuelve a la etapa 2 un par de días: es la causa más común de atasco en esta etapa.",
          "Cuando te sientas cómodo, añade TypeScript. Añade tipos a JavaScript, evita muchos errores y aparece en una parte creciente de los proyectos profesionales.",
        ],
      },
      {
        heading: "Etapa 5 — Proyectos propios y portfolio (continuo)",
        paragraphs: [
          "Con los fundamentos claros, la mejor inversión de tiempo son los proyectos que no salen de ningún curso. Tres ideas que obligan a usar todo lo aprendido: un buscador sobre una API pública con filtros y paginación, un panel con gráficos a partir de datos reales, y una web completa para un negocio real o inventado con varias páginas, formulario y buen rendimiento en móviles.",
          "Publica cada proyecto con su código en GitHub y una versión visitable. Explica en el README qué decisiones tomaste y qué harías distinto. Ese texto dice mucho más de ti que el propio código.",
        ],
        links: [
          { href: "/guias/proyectos-para-consolidar-lo-aprendido", label: "Ideas de proyectos para consolidar lo aprendido" },
          { href: "/guias/demostrar-lo-aprendido-sin-certificado", label: "Cómo montar un portfolio sin certificado" },
        ],
      },
      {
        heading: "Cómo elegir los cursos de cada etapa",
        paragraphs: [
          "En frontend la fecha importa: las bases (HTML, CSS, JavaScript) envejecen bien, pero los frameworks cambian de versión y de buenas prácticas cada pocos años. Para las etapas 1 y 2 un curso de hace tres o cuatro años sigue siendo válido; para la etapa 4 prioriza cursos recientes y comprueba qué versión usan.",
          "En cada ficha de nuestro catálogo indicamos el nivel, la duración, los requisitos previos y un plan de estudio sugerido. Úsalos para encajar cada curso en su etapa: si los requisitos de un curso incluyen algo que aún no has visto, todavía no es su momento.",
        ],
        links: [{ href: "/programming", label: "Cursos de programación del catálogo" }],
      },
    ],
    faq: [
      {
        question: "¿Hace falta saber diseño para dedicarse al frontend?",
        answer:
          "No hace falta ser diseñador, pero sí conviene entender los principios básicos: jerarquía, espaciado, contraste y tipografía. En muchos equipos trabajarás a partir de diseños ya hechos, y entender por qué están hechos así te ayuda a construirlos con fidelidad y a proponer mejoras. Un curso corto de fundamentos de diseño de interfaces es una buena inversión cuando termines la etapa de HTML y CSS.",
      },
      {
        question: "¿Empiezo por React o por JavaScript?",
        answer:
          "Por JavaScript, sin duda. React está construido sobre JavaScript y da por sabidos muchos conceptos del lenguaje: funciones flecha, desestructuración, métodos de arrays, módulos o código asíncrono. Quien salta directamente a React suele atascarse en errores que en realidad son de JavaScript y no del framework. Dos o tres meses de JavaScript sólido hacen que aprender React sea mucho más rápido y menos frustrante.",
      },
      {
        question: "¿Cuánto tiempo necesito para conseguir un primer trabajo en frontend?",
        answer:
          "Depende mucho de tu punto de partida, del tiempo que dediques y del mercado laboral de tu zona, así que desconfía de quien prometa plazos cerrados. Esta ruta está pensada para completarse en unos seis a nueve meses con cinco o seis horas semanales, pero lo que decide una contratación suele ser la calidad de tus proyectos y cómo los explicas, no el tiempo que llevas estudiando.",
      },
      {
        question: "¿Necesito aprender TypeScript desde el principio?",
        answer:
          "No. Aprende primero JavaScript y añade TypeScript cuando ya te sientas cómodo con un framework. TypeScript añade tipos que ayudan a evitar errores en proyectos medianos y grandes, y su uso está muy extendido en entornos profesionales, pero aprenderlo antes de dominar JavaScript duplica la dificultad sin aportar mucho. Cuando llegue el momento, un curso corto y un proyecto propio migrado a TypeScript bastan para arrancar.",
      },
    ],
  },
  {
    slug: "ruta-desarrollo-backend",
    kind: "ruta",
    shortTitle: "Desarrollo backend",
    title: "Ruta de desarrollo backend gratis: servidores, APIs y bases de datos",
    description:
      "Qué lenguaje elegir, cómo aprender bases de datos y APIs, y en qué orden avanzar para construir servidores reales solo con cursos gratuitos.",
    categorySlug: "programming",
    courseMatch: {
      categories: ["programming", "data-ai"],
      keywords: ["backend", "node", "express", "api", "python", "django", "flask", "fastapi", "java", "spring", "sql", "postgres", "mysql", "php", "laravel", "go", "c#", ".net", "bases de datos"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["ruta-desarrollo-frontend", "ruta-devops-y-cloud", "aprender-programacion-gratis-ruta-completa", "proyectos-para-consolidar-lo-aprendido"],
    intro:
      "El backend es la parte de una aplicación que no se ve: el servidor que recibe peticiones, aplica la lógica de negocio, guarda los datos y responde. Es un campo amplio, con muchos lenguajes y herramientas, y precisamente por eso conviene recorrerlo con un orden claro. Esta ruta propone cinco etapas, pensadas para que cada una se apoye en la anterior y termines con un servicio completo desplegado en internet.",
    sections: [
      {
        heading: "Elige un lenguaje y quédate con él",
        paragraphs: [
          "Los lenguajes más habituales en backend son JavaScript (con Node.js), Python, Java, C#, PHP y Go. Todos permiten construir servidores profesionales. Si ya sabes algo de JavaScript por el frontend, Node.js te ahorra aprender un segundo lenguaje. Si partes de cero y te interesan también los datos, Python es una elección cómoda. Java y C# son muy frecuentes en empresas grandes y entornos corporativos.",
          "La decisión importa menos de lo que parece. Lo que de verdad cuenta es no cambiar de lenguaje a mitad de camino: los conceptos de esta ruta (peticiones HTTP, bases de datos, autenticación, pruebas) son los mismos en todos.",
        ],
      },
      {
        heading: "Etapa 1 — Fundamentos del lenguaje (6-8 semanas)",
        paragraphs: [
          "Empieza por un curso completo de fundamentos del lenguaje elegido, sin frameworks: tipos de datos, estructuras de control, funciones, colecciones, manejo de errores, módulos y lectura y escritura de archivos. Añade programación orientada a objetos si el lenguaje la usa de forma central, como Java o C#.",
          "Una buena señal para avanzar es poder escribir, sin ayuda, un pequeño programa de consola que lea un archivo de datos, los procese y guarde un resumen. Si eso te cuesta, dedica una semana más a ejercicios antes de continuar.",
        ],
      },
      {
        heading: "Etapa 2 — Cómo funciona la web (1-2 semanas)",
        paragraphs: [
          "Antes de construir un servidor, entiende qué es lo que va a recibir. Aprende qué es una petición HTTP, los métodos (GET, POST, PUT, DELETE), los códigos de estado (200, 404, 500…), las cabeceras y el formato JSON. Prueba a hacer peticiones a APIs públicas desde la terminal o con herramientas gratuitas de pruebas de APIs.",
          "Es una etapa corta que muchos cursos pasan de puntillas, pero entenderla bien hace que todo lo demás tenga sentido: un framework web no es más que una forma organizada de responder a estas peticiones.",
        ],
      },
      {
        heading: "Etapa 3 — Bases de datos y SQL (4-6 semanas)",
        paragraphs: [
          "Casi todo backend guarda datos, y la mayoría lo hace en una base de datos relacional como PostgreSQL o MySQL. Aprende SQL a fondo: crear tablas, relaciones entre ellas, consultas con filtros, uniones (JOIN), agregaciones e índices. SQL es de las habilidades más duraderas del sector: lo que aprendas hoy seguirá sirviendo dentro de muchos años.",
          "Después, aprende a usar la base de datos desde tu lenguaje, primero con consultas directas y luego con un ORM, la capa que traduce tablas a objetos. Entender las dos formas te protege de los errores típicos de quien solo conoce el ORM.",
        ],
        steps: [
          "Diseña en papel el modelo de datos de una aplicación sencilla (una biblioteca, una tienda, un gestor de gastos).",
          "Crea las tablas y escribe diez consultas útiles sobre ellas.",
          "Provoca un problema de rendimiento con muchos datos y resuélvelo con un índice.",
        ],
      },
      {
        heading: "Etapa 4 — Un framework web y tu primera API (6-8 semanas)",
        paragraphs: [
          "Con los fundamentos claros, elige el framework más habitual de tu lenguaje: Express o similares en Node.js, Django, Flask o FastAPI en Python, Spring Boot en Java, ASP.NET en C#, Laravel en PHP. Busca un curso que construya una API completa: rutas, validación de datos, conexión a base de datos, autenticación de usuarios y gestión de errores.",
          "Presta atención a la seguridad desde el principio: nunca guardar contraseñas en claro, validar todo lo que llega del exterior, no exponer mensajes de error internos y guardar las claves en variables de entorno, no en el código.",
        ],
      },
      {
        heading: "Etapa 5 — Pruebas, despliegue y un proyecto completo",
        paragraphs: [
          "Un backend profesional tiene pruebas automáticas. Aprende a escribir pruebas unitarias para la lógica y pruebas de integración para los endpoints. Después, aprende a desplegar: contenedores con Docker, variables de entorno y algún servicio con plan gratuito para publicar tu API.",
          "Cierra la ruta con un proyecto propio de principio a fin: una API para un gestor de reservas, un acortador de enlaces con estadísticas o el servidor de una aplicación de notas con usuarios. Documenta los endpoints y publica el código. Si también sigues la ruta de frontend, conecta ambos y tendrás una aplicación completa.",
        ],
        links: [
          { href: "/guias/ruta-devops-y-cloud", label: "Ruta de DevOps y cloud: Linux, Docker y despliegue" },
          { href: "/guias/ruta-desarrollo-frontend", label: "Ruta de desarrollo frontend" },
        ],
      },
      {
        heading: "Errores frecuentes en esta ruta",
        steps: [
          "Saltar directamente al framework sin dominar el lenguaje: todo parece magia y cualquier error bloquea.",
          "Aprender solo con un ORM y no saber leer ni escribir SQL.",
          "Dejar la seguridad y las pruebas para el final, cuando el proyecto ya está hecho.",
          "Coleccionar cursos de varios frameworks en lugar de construir algo completo con uno.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Qué lenguaje de backend tiene más salidas?",
        answer:
          "Todos los lenguajes habituales (JavaScript con Node.js, Python, Java, C#, PHP, Go) tienen demanda, y el reparto cambia según el país, el sector y el tamaño de las empresas. Una forma práctica de decidir es revisar ofertas de empleo reales de tu zona durante un par de semanas y ver qué se repite. Aun así, cambiar de lenguaje más adelante es mucho más fácil de lo que parece una vez dominas los conceptos de esta ruta.",
      },
      {
        question: "¿Necesito saber frontend para aprender backend?",
        answer:
          "No es imprescindible, pero ayuda saber lo básico de HTML y de cómo un navegador hace peticiones a un servidor. Entender quién consume tu API te lleva a diseñarla mejor. Si tu objetivo es trabajar como desarrollador de aplicaciones completas, lo razonable es profundizar en una de las dos partes y conocer lo suficiente de la otra para colaborar con soltura.",
      },
      {
        question: "¿SQL o bases de datos NoSQL?",
        answer:
          "Empieza por SQL y una base de datos relacional. La mayoría de aplicaciones usan este modelo, y los conceptos que aprendes (modelado de datos, relaciones, índices, transacciones) te ayudan a entender también cuándo tiene sentido una base de datos NoSQL. Las bases de datos documentales o clave-valor resuelven casos concretos muy bien, pero elegirlas sin conocer la alternativa relacional suele traer problemas más adelante.",
      },
      {
        question: "¿Cómo practico si no tengo un servidor?",
        answer:
          "Tu propio ordenador es suficiente para casi toda la ruta: el servidor, la base de datos y las pruebas funcionan en local. Para publicar proyectos, varios servicios ofrecen planes gratuitos o créditos de prueba con limitaciones, suficientes para un portfolio. Revisa siempre las condiciones y configura alertas de gasto si el servicio pide una tarjeta, y no dejes recursos encendidos que no uses.",
      },
    ],
  },
  {
    slug: "ruta-devops-y-cloud",
    kind: "ruta",
    shortTitle: "DevOps y cloud",
    title: "Ruta de DevOps y cloud gratis: Linux, Git, Docker y despliegue",
    description:
      "Las herramientas que sostienen cualquier software en producción, en el orden en que conviene aprenderlas y con prácticas que puedes hacer sin pagar.",
    categorySlug: "programming",
    courseMatch: {
      categories: ["programming"],
      keywords: ["linux", "git", "docker", "kubernetes", "devops", "aws", "azure", "cloud", "terminal", "bash", "ci", "nginx", "servidor", "redes"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["ruta-desarrollo-backend", "proyectos-para-consolidar-lo-aprendido", "plan-de-estudio-semanal"],
    intro:
      "DevOps no es un lenguaje ni una herramienta, sino una forma de trabajar: acercar el desarrollo del software a su puesta en marcha y su mantenimiento. En la práctica, implica dominar un conjunto de herramientas —la terminal de Linux, Git, contenedores, automatización y servicios en la nube— que cualquier desarrollador acaba necesitando. Esta ruta las ordena de forma que cada una tenga sentido cuando llega, y propone prácticas que puedes hacer en tu propio ordenador sin gastar dinero.",
    sections: [
      {
        heading: "Para quién es esta ruta",
        paragraphs: [
          "Encaja si ya sabes programar algo, aunque sea a nivel básico, y quieres entender cómo se publica y se mantiene el software. También es útil para perfiles de sistemas que quieren modernizar sus conocimientos. Si todavía no has escrito tu primer programa, empieza por una ruta de fundamentos y vuelve aquí después: muchos conceptos de DevOps solo cobran sentido cuando has sufrido el problema que resuelven.",
        ],
        links: [{ href: "/guias/aprender-programacion-gratis-ruta-completa", label: "Ruta completa para aprender programación sin pagar" }],
      },
      {
        heading: "Etapa 1 — Linux y la terminal (3-4 semanas)",
        paragraphs: [
          "La gran mayoría de servidores funcionan con Linux, y se manejan desde la terminal. Aprende a moverte por el sistema de archivos, gestionar permisos y usuarios, instalar paquetes, ver procesos y registros, y encadenar comandos. Después, escribe tus primeros scripts en Bash para automatizar tareas repetitivas.",
          "No necesitas un servidor: puedes practicar en una máquina virtual, en el subsistema de Linux de Windows o directamente en tu ordenador si ya usas Linux o macOS. Lo importante es usar la terminal a diario hasta que deje de imponer.",
        ],
      },
      {
        heading: "Etapa 2 — Git a fondo (1-2 semanas)",
        paragraphs: [
          "Git es la base de todo flujo de trabajo moderno. Más allá de hacer commits, aprende ramas, fusiones, resolución de conflictos, rebase y cómo se trabaja en equipo con pull requests. Entender qué hace Git por dentro (instantáneas, referencias, el historial como grafo) convierte los errores de miedo en problemas resolubles.",
        ],
      },
      {
        heading: "Etapa 3 — Redes y servidores web (2-3 semanas)",
        paragraphs: [
          "Para desplegar software necesitas entender cómo llega una petición hasta él: direcciones IP, puertos, DNS, HTTP y HTTPS, certificados, proxies inversos y balanceadores. Instala un servidor web como Nginx en una máquina virtual, sirve una página, configura un dominio de prueba y añade HTTPS. Es un ejercicio pequeño que aclara muchos conceptos a la vez.",
        ],
      },
      {
        heading: "Etapa 4 — Contenedores con Docker (3-4 semanas)",
        paragraphs: [
          "Los contenedores empaquetan una aplicación con todo lo que necesita para funcionar igual en cualquier máquina. Aprende a escribir un Dockerfile, construir imágenes, gestionar volúmenes y redes, y orquestar varios servicios con Docker Compose, por ejemplo una aplicación y su base de datos.",
          "Kubernetes aparece en muchas ofertas, pero es un paso posterior: tiene sentido cuando entiendes bien los contenedores y los problemas de gestionar muchos a la vez. Un curso introductorio te dará una visión general; profundizar requiere práctica en entornos que ya no son triviales de montar.",
        ],
        steps: [
          "Contenedoriza una aplicación que ya tengas y documenta cómo arrancarla con un solo comando.",
          "Añade una base de datos con Docker Compose y un volumen para no perder los datos.",
          "Reduce el tamaño de la imagen y explica en el README qué cambiaste y por qué.",
        ],
      },
      {
        heading: "Etapa 5 — Integración y despliegue continuos (2-3 semanas)",
        paragraphs: [
          "La integración continua ejecuta pruebas automáticamente con cada cambio; el despliegue continuo publica la nueva versión si todo va bien. Los servicios de repositorios de código más populares incluyen sistemas de automatización con cuotas gratuitas suficientes para aprender. Configura un flujo que instale dependencias, ejecute pruebas, construya una imagen y la publique.",
        ],
      },
      {
        heading: "Etapa 6 — Nube y observabilidad",
        paragraphs: [
          "Los grandes proveedores de nube ofrecen niveles gratuitos o créditos de prueba. Úsalos con cuidado: configura alertas de gasto antes de crear nada y apaga lo que no uses. Aprende los servicios básicos equivalentes en cualquier proveedor: máquinas virtuales, almacenamiento de archivos, bases de datos gestionadas y redes.",
          "Por último, aprende a observar lo que despliegas: registros, métricas y alertas. Un sistema que no puedes observar es un sistema que no puedes arreglar. Cierra la ruta desplegando un proyecto propio con todo lo anterior y escribiendo un pequeño documento de cómo se opera.",
        ],
      },
      {
        heading: "Consejos para no perderte",
        steps: [
          "Practica siempre en tu propio entorno: ver a otra persona escribir comandos no crea memoria.",
          "Lleva un cuaderno de comandos y errores resueltos; volverás a él constantemente.",
          "Prioriza conceptos sobre productos: cada proveedor llama distinto a lo mismo.",
          "Vigila los costes de la nube desde el primer minuto y borra los recursos de prueba.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Puedo aprender DevOps sin saber programar?",
        answer:
          "Se pueden aprender muchas herramientas por separado, pero el trabajo de DevOps consiste precisamente en conectar el desarrollo con la operación, y eso requiere entender cómo se construye el software. Como mínimo, conviene saber programar scripts con soltura y haber hecho alguna aplicación sencilla. Si partes de cero, empieza por una ruta de fundamentos de programación y combina después con esta.",
      },
      {
        question: "¿Qué proveedor de nube debería aprender?",
        answer:
          "Los grandes proveedores ofrecen servicios muy parecidos con nombres distintos. Aprende los conceptos (máquinas virtuales, almacenamiento, redes, bases de datos gestionadas, identidades y permisos) con uno cualquiera y te resultará fácil pasar a otro. Si tienes un objetivo laboral concreto, mira qué proveedor se repite en las ofertas que te interesan. Las certificaciones oficiales de cada proveedor tienen peso en algunos procesos de selección.",
      },
      {
        question: "¿Es necesario aprender Kubernetes?",
        answer:
          "Aparece en muchas ofertas de perfiles de plataforma y DevOps, pero no es el primer paso. Tiene sentido cuando dominas los contenedores y entiendes los problemas de gestionar muchos servicios a la vez. Un curso introductorio te dará la visión general y el vocabulario; para ir más allá hace falta practicar en un clúster, que puedes montar en tu propio ordenador con herramientas ligeras pensadas para aprender.",
      },
      {
        question: "¿Cómo evito sustos con la factura de la nube?",
        answer:
          "Antes de crear cualquier recurso, configura alertas de presupuesto y revisa qué incluye exactamente el nivel gratuito del proveedor. Usa regiones y tamaños pequeños, apaga o elimina todo al terminar cada práctica y revisa el panel de facturación con frecuencia. Muchas prácticas de la ruta se pueden hacer íntegramente en local con máquinas virtuales y contenedores, sin tocar la nube.",
      },
    ],
  },
  {
    slug: "aprender-programacion-gratis-ruta-completa",
    kind: "ruta",
    shortTitle: "Programación en 12 meses",
    title: "Cómo aprender programación sin pagar: la ruta completa en 12 meses",
    description:
      "Un plan de un año, mes a mes, para pasar de cero a programar con soltura usando solo cursos gratuitos, documentación abierta y proyectos propios.",
    categorySlug: "programming",
    courseMatch: {
      categories: ["programming"],
      keywords: ["programación", "desde cero", "python", "javascript", "fundamentos", "algoritmos", "cs50", "principiantes", "estructuras de datos"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["aprender-programacion-desde-cero", "ruta-desarrollo-frontend", "ruta-desarrollo-backend", "plan-de-estudio-semanal"],
    intro:
      "Aprender a programar sin pagar es posible: casi todo el conocimiento necesario está en cursos gratuitos, documentación oficial y comunidades abiertas. Lo que no es gratis es el tiempo y la constancia. Esta guía convierte ese objetivo en un plan de doce meses, pensado para unas seis horas semanales, con hitos concretos para saber si vas bien. Si ya has leído nuestra guía de inicio, esta es su versión extendida y más detallada.",
    sections: [
      {
        heading: "Las reglas del plan",
        paragraphs: [
          "Tres reglas sostienen todo lo demás. La primera: un solo lenguaje durante los primeros seis meses. La segunda: por cada hora de vídeo, al menos una hora de práctica escribiendo código tú mismo. La tercera: cada trimestre termina con un proyecto terminado y publicado, por pequeño que sea.",
          "El calendario es orientativo. Si un bloque te lleva el doble, no pasa nada; lo que no conviene es saltarlo. Y si un mes la vida se complica, retoma donde lo dejaste sin intentar recuperar el tiempo perdido de golpe.",
        ],
        links: [{ href: "/guias/plan-de-estudio-semanal", label: "Cómo montar tu plan de estudio semanal" }],
      },
      {
        heading: "Meses 1-3: fundamentos",
        paragraphs: [
          "Elige Python o JavaScript y sigue un curso largo de fundamentos para principiantes, completo, de principio a fin. Cubrirás variables, tipos, condicionales, bucles, funciones, listas, diccionarios u objetos, y manejo de errores. Complementa con ejercicios diarios cortos en plataformas gratuitas de retos de programación.",
          "En el tercer mes, añade una introducción a la informática: cómo funciona un ordenador, qué es un algoritmo, cómo se mide su eficiencia. Algunos cursos universitarios de introducción publicados gratis en abierto son excelentes para esto y te darán una base que muchos autodidactas no tienen.",
        ],
        steps: [
          "Hito del trimestre: un programa de consola útil para ti, como un gestor de gastos o un generador de listas de la compra.",
          "Publícalo en GitHub con un README que explique cómo usarlo.",
        ],
      },
      {
        heading: "Meses 4-6: herramientas y estructuras de datos",
        paragraphs: [
          "Aprende Git y GitHub, la terminal y a leer documentación oficial. Después, dedica tiempo a estructuras de datos y algoritmos básicos: pilas, colas, diccionarios, búsqueda y ordenación, recursividad. No hace falta memorizar; se trata de entender qué herramienta usar para cada problema.",
          "Al final del semestre, introduce las bases de datos con SQL. Es un conocimiento que usarás en casi cualquier camino que elijas después y que se aprende bien con cursos gratuitos.",
        ],
        steps: [
          "Hito del trimestre: un proyecto que guarde datos en una base de datos, por ejemplo un registro de lecturas o de entrenamientos con estadísticas.",
        ],
      },
      {
        heading: "Meses 7-9: especialízate",
        paragraphs: [
          "Con una base sólida, elige una dirección: web frontend, backend, datos, automatización o desarrollo móvil. Cada una tiene su propia ruta en esta web. Dedica este trimestre a la primera mitad de esa ruta, con un curso central y proyectos pequeños que apliquen cada concepto.",
          "Es normal sentir que sabes menos que al principio: cuanto más aprendes, más ves lo que te queda. Es una señal de progreso, no de fracaso.",
        ],
        links: [
          { href: "/guias/ruta-desarrollo-frontend", label: "Ruta de desarrollo frontend" },
          { href: "/guias/ruta-desarrollo-backend", label: "Ruta de desarrollo backend" },
          { href: "/guias/ruta-analisis-de-datos", label: "Ruta de análisis de datos" },
        ],
      },
      {
        heading: "Meses 10-12: un proyecto grande y tu portfolio",
        paragraphs: [
          "El último trimestre es para un proyecto de verdad: algo con varias partes, usuarios reales o datos reales, que te obligue a investigar cosas que ningún curso te ha enseñado. Es la parte más formativa de todo el año, precisamente porque no hay vídeo que seguir.",
          "En paralelo, ordena tu portfolio: tres o cuatro proyectos bien presentados, con capturas, explicación de decisiones y enlace a una versión funcionando. Si tu objetivo es trabajar como programador, este es el material que enseñarás.",
        ],
        links: [{ href: "/guias/demostrar-lo-aprendido-sin-certificado", label: "Cómo demostrar lo aprendido sin certificado" }],
      },
      {
        heading: "Recursos gratuitos que complementan los cursos",
        steps: [
          "Documentación oficial del lenguaje: más árida que un vídeo, pero siempre actualizada.",
          "Plataformas de ejercicios con corrección automática para practicar a diario.",
          "Comunidades y foros donde preguntar, después de haber intentado resolverlo tú.",
          "Proyectos de código abierto: leer código ajeno bien escrito enseña muchísimo.",
        ],
      },
      {
        heading: "Cómo saber si vas bien",
        paragraphs: [
          "Mide el progreso por lo que eres capaz de construir, no por los cursos que has visto. Si a los tres meses puedes escribir un programa pequeño sin seguir un vídeo, vas bien. Si a los seis puedes leer código ajeno y entender qué hace, vas muy bien. Y si al año tienes proyectos propios publicados y sabes buscar la solución cuando te atascas, has conseguido lo más difícil: aprender a aprender programación.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Python o JavaScript para empezar?",
        answer:
          "Los dos son buenas opciones. Python tiene una sintaxis muy legible y es habitual en datos, automatización y enseñanza. JavaScript es imprescindible si te interesa la web y te permite ver resultados en el navegador desde el primer día. Si no tienes una preferencia clara, elige según lo que te gustaría construir dentro de un año. Lo importante es no cambiar durante los primeros meses.",
      },
      {
        question: "¿Necesito un ordenador potente?",
        answer:
          "No. Para aprender a programar basta un ordenador normal, incluso con algunos años, con un navegador moderno y un editor de código gratuito. Solo algunas especialidades concretas, como el entrenamiento de modelos de inteligencia artificial grandes o el desarrollo de videojuegos en 3D, piden más potencia, y aun así existen alternativas en la nube con uso gratuito limitado para aprender.",
      },
      {
        question: "¿Y si no soy bueno en matemáticas?",
        answer:
          "Para la mayoría de trabajos de programación, especialmente en web y aplicaciones, basta con matemáticas básicas y lógica. Programar se parece más a resolver problemas paso a paso que a hacer cálculos complejos. Algunas áreas, como gráficos, datos avanzados o inteligencia artificial, sí requieren más base matemática, pero se puede adquirir más adelante, cuando sepas que te interesa ese camino.",
      },
      {
        question: "¿Qué hago si un mes no puedo seguir el plan?",
        answer:
          "Nada grave: retoma donde lo dejaste, sin intentar recuperar el tiempo perdido de golpe. Antes de continuar, dedica una sesión a repasar tus apuntes y a rehacer un ejercicio del último bloque para reactivar lo aprendido. El calendario del plan es orientativo; importa más la continuidad a lo largo del año que cumplir cada mes exactamente.",
      },
    ],
  },
  {
    slug: "ruta-analisis-de-datos",
    kind: "ruta",
    shortTitle: "Análisis de datos",
    title: "Ruta de análisis de datos gratis: hojas de cálculo, SQL, Python y visualización",
    description:
      "Las cinco habilidades de un analista de datos, en orden, con prácticas sobre datos públicos y consejos para montar un portfolio que se entienda.",
    categorySlug: "data-ai",
    courseMatch: {
      categories: ["data-ai", "productivity"],
      keywords: ["sql", "excel", "pandas", "python", "power bi", "tableau", "análisis", "datos", "estadística", "visualización", "dashboard"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["empezar-en-datos-e-inteligencia-artificial", "ruta-machine-learning-e-ia", "ruta-productividad-y-ofimatica", "demostrar-lo-aprendido-sin-certificado"],
    intro:
      "El análisis de datos consiste en responder preguntas con datos: qué productos se venden más, por qué ha bajado una métrica, qué clientes tienen más probabilidad de volver. Es una de las salidas más accesibles del mundo de los datos, porque se apoya en herramientas que se aprenden bien con cursos gratuitos y porque el trabajo se puede demostrar con proyectos públicos. Esta ruta complementa nuestra guía general de datos con un recorrido más concreto, etapa por etapa.",
    sections: [
      {
        heading: "Qué hace realmente un analista de datos",
        paragraphs: [
          "Antes de elegir cursos, conviene entender el trabajo. Un analista pasa buena parte del tiempo obteniendo y limpiando datos, bastante explorándolos y una parte menor, pero decisiva, comunicando conclusiones a personas que no son técnicas. Por eso esta ruta da tanto peso a la limpieza y a la comunicación como a las herramientas.",
        ],
      },
      {
        heading: "Etapa 1 — Hojas de cálculo con criterio (3-4 semanas)",
        paragraphs: [
          "Excel o Google Sheets siguen siendo la herramienta de análisis más usada del mundo. Aprende fórmulas de búsqueda, funciones condicionales, tablas dinámicas, gráficos y limpieza básica (quitar duplicados, separar columnas, normalizar textos). Muchas preguntas de negocio se responden aquí sin necesidad de programar.",
          "Practica con un conjunto de datos público de tu interés y responde cinco preguntas concretas con tablas dinámicas y gráficos. Si puedes explicar cada respuesta en una frase, has cumplido la etapa.",
        ],
        links: [{ href: "/guias/ruta-productividad-y-ofimatica", label: "Ruta de productividad y hojas de cálculo" }],
      },
      {
        heading: "Etapa 2 — SQL (4-6 semanas)",
        paragraphs: [
          "SQL es el idioma para consultar bases de datos, y aparece en casi todas las ofertas de análisis. Aprende SELECT con filtros, ordenación y agregaciones, uniones entre tablas, subconsultas y funciones de ventana. Las funciones de ventana cuestan al principio, pero resuelven problemas muy habituales como rankings o acumulados.",
          "Instala una base de datos gratuita en tu ordenador o usa un entorno en línea, carga un conjunto de datos real y plantéate preguntas cada vez más difíciles. La práctica diaria de consultas cortas funciona mejor que sesiones largas y esporádicas.",
        ],
      },
      {
        heading: "Etapa 3 — Estadística aplicada (3-4 semanas)",
        paragraphs: [
          "Sin estadística, es fácil sacar conclusiones equivocadas de datos correctos. Repasa medidas de tendencia central y dispersión, distribuciones, correlación (y por qué no implica causalidad), muestreo, intervalos de confianza y contrastes de hipótesis básicos, como los que se usan en pruebas A/B.",
          "Busca cursos con ejemplos aplicados y evita obsesionarte con las demostraciones matemáticas: el objetivo es saber qué prueba usar y cómo interpretar su resultado.",
        ],
      },
      {
        heading: "Etapa 4 — Python para análisis (6-8 semanas)",
        paragraphs: [
          "Python amplía lo que puedes hacer: automatizar la limpieza, trabajar con archivos demasiado grandes para una hoja de cálculo, combinar fuentes distintas y documentar el análisis en cuadernos reproducibles. Aprende los fundamentos del lenguaje y después pandas para tablas y alguna librería de gráficos.",
          "Si ya sabes hojas de cálculo y SQL, verás que pandas hace lo mismo con otra sintaxis. Aprovecha esa ventaja: traduce análisis que ya hiciste en la etapa 1 a Python y compara resultados.",
        ],
      },
      {
        heading: "Etapa 5 — Visualización y comunicación (continuo)",
        paragraphs: [
          "Un buen gráfico responde a una pregunta. Aprende a elegir el tipo adecuado (barras para comparar, líneas para tendencias, dispersión para relaciones), a eliminar lo que sobra y a titular con la conclusión, no con la descripción. Después, aprende una herramienta de paneles; varias tienen versiones gratuitas para uso personal.",
          "Practica escribiendo informes cortos: una pregunta, el método en dos frases, tres gráficos y una recomendación. Es exactamente lo que se espera de un analista.",
        ],
      },
      {
        heading: "Tu portfolio de análisis",
        steps: [
          "Tres o cuatro proyectos sobre datos públicos distintos, cada uno con una pregunta clara.",
          "Cada proyecto con un documento que explique la pregunta, la limpieza, el análisis y la conclusión.",
          "Al menos un proyecto con SQL, otro con Python y otro con un panel interactivo.",
          "Un texto honesto sobre las limitaciones de cada análisis: demuestra criterio.",
        ],
        links: [{ href: "/guias/demostrar-lo-aprendido-sin-certificado", label: "Cómo presentar un portfolio sin certificado" }],
      },
    ],
    faq: [
      {
        question: "¿Necesito saber programar para ser analista de datos?",
        answer:
          "Para empezar, no: muchas tareas de análisis se hacen con hojas de cálculo y herramientas de paneles. Pero SQL aparece en la gran mayoría de ofertas, y Python amplía mucho lo que puedes hacer y automatizar. Por eso esta ruta empieza por hojas de cálculo y añade la programación de forma gradual, cuando ya entiendes qué problemas resuelve.",
      },
      {
        question: "¿Qué diferencia hay entre analista de datos y científico de datos?",
        answer:
          "A grandes rasgos, el analista responde preguntas sobre lo que ha pasado y por qué, con consultas, estadística descriptiva, visualizaciones e informes. El científico de datos suele construir modelos predictivos y trabaja más con aprendizaje automático y estadística avanzada. Las fronteras varían mucho entre empresas. El análisis es una puerta de entrada natural, y si te atrae la parte de modelos puedes continuar con nuestra ruta de machine learning.",
      },
      {
        question: "¿Dónde encuentro datos para practicar?",
        answer:
          "Muchas administraciones publican datos abiertos sobre transporte, población, medio ambiente o presupuestos. También hay repositorios públicos de conjuntos de datos sobre deporte, cine, economía y casi cualquier tema. Elige datos sobre algo que te interese de verdad: te resultará mucho más fácil plantear preguntas relevantes y sostener el proyecto hasta el final.",
      },
      {
        question: "¿Qué herramienta de paneles aprendo?",
        answer:
          "Varias herramientas populares tienen versiones gratuitas para uso personal o de aprendizaje. Los conceptos (modelo de datos, medidas, filtros, diseño de paneles) se trasladan bien entre ellas. Mira qué herramienta aparece más en las ofertas de tu zona o de tu sector y empieza por esa. Si no tienes preferencia, cualquier opción gratuita sirve para construir tu portfolio.",
      },
    ],
  },
  {
    slug: "ruta-machine-learning-e-ia",
    kind: "ruta",
    shortTitle: "Machine learning e IA",
    title: "Ruta de machine learning e inteligencia artificial con cursos gratis",
    description:
      "Matemáticas justas, Python, modelos clásicos, redes neuronales e IA generativa: un orden realista para entender la IA y no solo usarla.",
    categorySlug: "data-ai",
    courseMatch: {
      categories: ["data-ai"],
      keywords: ["machine learning", "aprendizaje automático", "deep learning", "redes neuronales", "inteligencia artificial", "llm", "tensorflow", "pytorch", "scikit", "modelos", "ia"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["ruta-analisis-de-datos", "empezar-en-datos-e-inteligencia-artificial", "usar-la-ia-para-estudiar", "proyectos-para-consolidar-lo-aprendido"],
    intro:
      "La inteligencia artificial está en todas partes, y con ella una avalancha de cursos que prometen convertirte en experto en semanas. La realidad es más exigente y más interesante: entender cómo aprende un modelo requiere algo de matemáticas, bastante programación y mucha práctica con datos. La buena noticia es que existen cursos gratuitos excelentes para cada paso. Esta ruta los ordena para que llegues a los modelos modernos con una base que no se quede obsoleta con la próxima herramienta de moda.",
    sections: [
      {
        heading: "Dos caminos distintos: usar la IA o construirla",
        paragraphs: [
          "Conviene distinguir dos objetivos. Usar herramientas de IA generativa en tu trabajo (escribir, resumir, programar con asistentes) se aprende en poco tiempo y cambia cada pocos meses. Entender y construir modelos de aprendizaje automático es una disciplina técnica que lleva meses o años, pero cuyos fundamentos apenas cambian. Esta ruta se centra en el segundo camino; si solo te interesa el primero, empieza por la etapa 5.",
        ],
      },
      {
        heading: "Etapa 1 — Python y manejo de datos (6-8 semanas)",
        paragraphs: [
          "Todo el ecosistema de machine learning gira en torno a Python. Aprende los fundamentos del lenguaje y después NumPy para cálculo con matrices y pandas para tablas. Si ya has seguido nuestra ruta de análisis de datos, tienes esta etapa cubierta.",
        ],
        links: [{ href: "/guias/ruta-analisis-de-datos", label: "Ruta de análisis de datos" }],
      },
      {
        heading: "Etapa 2 — Las matemáticas imprescindibles (4-6 semanas)",
        paragraphs: [
          "No necesitas una carrera de matemáticas, pero sí intuición en tres áreas: álgebra lineal (vectores, matrices y sus operaciones), cálculo (derivadas y la idea de gradiente, que es cómo aprende un modelo) y probabilidad y estadística. Hay cursos gratuitos muy visuales que priorizan la intuición sobre la demostración; son el punto de partida ideal.",
          "Un truco útil: no estudies toda la matemática por adelantado. Aprende lo básico, avanza, y vuelve a profundizar cuando un concepto concreto te bloquee.",
        ],
      },
      {
        heading: "Etapa 3 — Machine learning clásico (8-10 semanas)",
        paragraphs: [
          "Empieza por los modelos clásicos: regresión lineal y logística, árboles de decisión, bosques aleatorios, k-vecinos y agrupamiento. Más importante que cada modelo es el proceso: separar datos de entrenamiento y prueba, elegir métricas adecuadas, detectar el sobreajuste y validar con rigor.",
          "La librería scikit-learn es el estándar para practicar. Sigue un curso que combine teoría y código, y resuelve después problemas con datos públicos. Muchos problemas reales se resuelven mejor con estos modelos que con redes neuronales.",
        ],
        steps: [
          "Resuelve un problema de clasificación y otro de regresión con datos públicos.",
          "Compara al menos tres modelos y justifica por qué eliges uno.",
          "Explica los errores del modelo: en qué casos falla y por qué.",
        ],
      },
      {
        heading: "Etapa 4 — Redes neuronales y deep learning (8-12 semanas)",
        paragraphs: [
          "Con la base anterior, las redes neuronales dejan de ser una caja negra. Aprende cómo funciona una neurona artificial, la retropropagación, las redes convolucionales para imágenes y los modelos secuenciales y de atención para texto. Elige un framework, PyTorch o TensorFlow, y quédate con él.",
          "Entrenar modelos grandes requiere hardware caro, pero para aprender basta con modelos pequeños y con los entornos de cuadernos en la nube que ofrecen uso gratuito limitado de tarjetas gráficas.",
        ],
      },
      {
        heading: "Etapa 5 — IA generativa y modelos de lenguaje",
        paragraphs: [
          "Los modelos de lenguaje actuales se basan en la arquitectura transformer. Con las etapas anteriores entenderás cómo se entrenan, qué son los embeddings, cómo funciona la recuperación de información para responder con documentos propios y cómo evaluar sus respuestas. Estos cursos son los que más rápido envejecen: fíjate en la fecha y prioriza los que explican conceptos sobre los que solo enseñan a usar una herramienta concreta.",
          "Aprende también sus límites: pueden inventar datos con total seguridad, reproducir sesgos de sus datos de entrenamiento y fallar en razonamientos que parecen sencillos. Saber cuándo no usarlos es tan valioso como saber usarlos.",
        ],
      },
      {
        heading: "Cómo evitar la trampa de las modas",
        steps: [
          "Desconfía de cursos que prometen resultados profesionales en pocas horas.",
          "Por cada curso de herramienta de moda, haz uno de fundamentos.",
          "Lee la documentación y los artículos originales de los modelos que uses, aunque sea por encima.",
          "Mide tu progreso con proyectos propios, no con la cantidad de herramientas probadas.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Cuánta matemática necesito realmente?",
        answer:
          "Para usar modelos con librerías y entender sus resultados, basta con intuición en álgebra lineal, cálculo y probabilidad: saber qué es un vector, qué significa minimizar un error o cómo se interpreta una probabilidad. Para investigar o diseñar modelos nuevos se necesita mucha más profundidad. Lo más eficaz suele ser aprender lo básico y profundizar en cada tema cuando lo necesites para entender algo concreto.",
      },
      {
        question: "¿Puedo aprender machine learning sin una tarjeta gráfica?",
        answer:
          "Sí. Los modelos clásicos se entrenan sin problema en cualquier ordenador, y para redes neuronales pequeñas existen entornos de cuadernos en la nube que ofrecen uso gratuito limitado de tarjetas gráficas. Solo el entrenamiento de modelos grandes requiere hardware caro, y eso queda fuera del alcance de cualquier ruta de aprendizaje individual.",
      },
      {
        question: "¿Sigue teniendo sentido aprender modelos clásicos con la IA generativa?",
        answer:
          "Sí. Muchos problemas reales, como predecir la demanda, detectar fraudes o clasificar datos tabulares, se resuelven mejor, más barato y de forma más explicable con modelos clásicos. Además, los conceptos que aprendes con ellos (validación, sobreajuste, métricas) son los mismos que necesitas para evaluar con criterio cualquier modelo moderno.",
      },
      {
        question: "¿Qué proyecto hago para demostrar lo aprendido?",
        answer:
          "Uno que resuelva un problema concreto con datos reales y que documente todo el proceso: la pregunta, la preparación de los datos, los modelos comparados, las métricas y los errores del modelo final. Un proyecto modesto bien explicado dice mucho más que una demostración espectacular copiada de un tutorial. Si puedes, publica una pequeña demo que otros puedan probar.",
      },
    ],
  },
];
