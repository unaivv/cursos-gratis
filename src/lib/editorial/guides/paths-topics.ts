import type { Guide } from "./types";

/**
 * Learning paths for topics readers search for inside the site and the
 * catalog used to cover poorly (October 2026): programming with AI
 * assistants, cybersecurity, SEO and Unity. Courses are matched at render
 * time by `courseMatch` keywords, like every other guide.
 */

export const AI_PROGRAMMING_PATH: Guide = {
  slug: "aprender-a-programar-con-ia",
  kind: "ruta",
  shortTitle: "Programar con IA",
  title: "Aprender a programar con IA (Claude, Claude Code, Cursor) gratis",
  description:
    "Qué son Claude Code, Cursor y GitHub Copilot, qué puedes hacer con ellos sin saber programar y qué no, en qué orden aprender y qué cursos gratuitos seguir.",
  categorySlug: "programming",
  courseMatch: {
    categories: ["programming", "data-ai"],
    keywords: ["claude", "claude code", "cursor", "copilot", "github copilot", "opencode", "codex", "agentes de ia", "programar con ia", "vibe coding"],
  },
  published: "2026-10-09",
  updated: "2026-10-09",
  related: ["aprender-programacion-gratis-ruta-completa", "usar-la-ia-para-estudiar", "proyectos-para-consolidar-lo-aprendido", "ruta-desarrollo-frontend"],
  intro:
    "La respuesta corta: sí, puedes aprender a programar con ayuda de asistentes de IA como Claude, Claude Code, Cursor o GitHub Copilot, y hay cursos gratuitos en español que enseñan a usarlos bien. Pero la IA no sustituye a los fundamentos: escribe código muy rápido, también código con errores, y solo quien entiende lo que está leyendo puede detectarlos. Esta ruta explica qué hace cada herramienta, qué parte puedes delegar y cuál no, y cómo combinar los cursos de IA con una base de programación sólida.",
  sections: [
    {
      heading: "Qué es cada herramienta, en una frase",
      paragraphs: [
        "Conviene distinguirlas porque resuelven cosas distintas, aunque todas usen modelos de lenguaje por debajo.",
      ],
      steps: [
        "Claude (el chat): un asistente conversacional. Le pegas un error o le describes un problema y te explica, propone código o revisa el tuyo. Útil para aprender porque puedes pedirle que razone paso a paso.",
        "Claude Code: un agente que trabaja en la terminal, dentro de tu proyecto. Lee tus archivos, ejecuta comandos y hace cambios en varios ficheros a la vez, pidiéndote permiso. Es la opción más potente y la que más criterio exige a quien la usa.",
        "Cursor: un editor de código (basado en Visual Studio Code) con IA integrada: autocompletado, chat sobre tu código y un modo agente que edita por ti.",
        "GitHub Copilot: un asistente que se instala en editores como Visual Studio Code. Empezó como autocompletado y hoy incluye chat y modo agente.",
      ],
    },
    {
      heading: "Lo que la IA hace bien y lo que no",
      paragraphs: [
        "Los asistentes son excelentes generando código repetitivo, explicando código ajeno, proponiendo una primera versión de una función, escribiendo pruebas y encontrando la causa de un mensaje de error. Para alguien que aprende, son un profesor paciente disponible a cualquier hora.",
        "Donde fallan es en lo que no se ve a simple vista: inventan funciones que no existen, mezclan versiones de una librería, introducen fallos de seguridad (por ejemplo, claves escritas en el código) y, en proyectos grandes, pierden el contexto y rompen algo que ya funcionaba. Si no sabes leer el código que generan, no sabrás cuándo ocurre. Por eso esta ruta no empieza por la IA, sino por los fundamentos.",
      ],
    },
    {
      heading: "Etapa 1 — Fundamentos de programación (2-3 meses)",
      paragraphs: [
        "Antes de delegar en un agente necesitas poder leer y entender un programa: variables, condicionales, bucles, funciones, estructuras de datos y manejo de errores, en un lenguaje como Python o JavaScript. Usa la IA desde el primer día, pero como tutor: pídele que te explique un concepto o por qué falla tu código, no que haga el ejercicio por ti.",
        "Sabes que puedes avanzar cuando eres capaz de escribir un programa pequeño sin ayuda y de explicar línea a línea uno que no has escrito tú.",
      ],
      links: [
        { href: "/guias/aprender-programacion-gratis-ruta-completa", label: "Ruta completa para aprender programación gratis" },
        { href: "/guias/usar-la-ia-para-estudiar", label: "Cómo usar la IA para estudiar sin que piense por ti" },
      ],
    },
    {
      heading: "Etapa 2 — Herramientas: terminal, Git y un editor (2-4 semanas)",
      paragraphs: [
        "Los agentes de IA trabajan sobre tu proyecto, así que necesitas manejarte con lo básico del oficio: la terminal, Git para guardar versiones y Visual Studio Code u otro editor. Git es especialmente importante: si guardas un commit antes de cada cambio grande que haga la IA, siempre podrás volver atrás cuando algo salga mal.",
      ],
    },
    {
      heading: "Etapa 3 — Asistentes en el editor: Copilot y Cursor (3-4 semanas)",
      paragraphs: [
        "Empieza por el autocompletado y el chat dentro del editor, que te mantienen al mando: tú escribes y la IA sugiere. Un curso corto sobre Cursor o Copilot te enseña los atajos, cómo darle contexto (qué archivos mirar) y cómo pedir cambios concretos.",
        "Practica con proyectos que ya sabrías hacer a mano, comparando su propuesta con la tuya. Así aprendes a detectar cuándo una sugerencia es buena y cuándo solo lo parece.",
      ],
    },
    {
      heading: "Etapa 4 — Agentes: Claude Code y similares (4-6 semanas)",
      paragraphs: [
        "Con los fundamentos claros, un agente como Claude Code multiplica lo que puedes construir. Los buenos cursos sobre agentes enseñan a planificar antes de escribir código, a dividir el trabajo en tareas pequeñas, a darle instrucciones del proyecto en un archivo de contexto, a revisar cada cambio antes de aceptarlo y a pedirle pruebas que demuestren que funciona.",
        "Una regla práctica: no aceptes un cambio que no podrías explicar. Si el agente ha tocado diez archivos y no entiendes por qué, pídele que lo explique o deshazlo y divide la tarea.",
      ],
      steps: [
        "Guarda un commit antes de cada tarea que encargues al agente.",
        "Pide un plan primero y apruébalo antes de que escriba código.",
        "Haz que ejecute las pruebas y revisa tú el resultado, no solo su resumen.",
        "Nunca le des claves, contraseñas ni datos personales reales en el código.",
      ],
    },
    {
      heading: "¿Es gratis? Cursos sí, herramientas a medias",
      paragraphs: [
        "Los cursos de esta ruta son gratuitos. Las herramientas son otra cosa: algunas tienen un plan gratuito con límites de uso y otras, como Claude Code, requieren una suscripción de pago o pagar por uso. Las condiciones cambian a menudo, así que compruébalas en la web oficial de cada herramienta antes de decidir. Para la etapa de fundamentos, el chat gratuito de cualquier asistente es más que suficiente.",
      ],
    },
    {
      heading: "Cómo elegir los cursos",
      paragraphs: [
        "En este tema la fecha importa más que en casi ningún otro: las herramientas cambian cada pocos meses y un curso de hace dos años puede enseñar menús y comandos que ya no existen. Prioriza cursos recientes y desconfía de los que prometen ganar dinero rápido o crear una aplicación completa sin saber nada: suelen enseñar a generar código, no a entenderlo.",
        "En cada ficha del catálogo indicamos la fecha de publicación, el nivel, los requisitos previos y nuestro veredicto. Si un curso da por sabido algo que aún no dominas, vuelve a la etapa 1.",
      ],
      links: [{ href: "/programming", label: "Cursos de programación del catálogo" }],
    },
  ],
  faq: [
    {
      question: "¿Puedo aprender a programar solo con IA, sin estudiar fundamentos?",
      answer:
        "Puedes generar programas, pero no aprender a programar. La IA escribe código rápido, también código con errores, funciones inventadas o fallos de seguridad, y solo quien entiende lo que lee puede detectarlos. Lo recomendable es aprender primero los fundamentos de un lenguaje como Python o JavaScript, usando la IA como tutor, y pasar a los agentes después.",
    },
    {
      question: "¿Qué diferencia hay entre Claude, Claude Code y Cursor?",
      answer:
        "Claude es un asistente conversacional: le preguntas y te responde. Claude Code es un agente que trabaja en la terminal dentro de tu proyecto, lee archivos, ejecuta comandos y edita varios ficheros pidiendo permiso. Cursor es un editor de código basado en Visual Studio Code con IA integrada: autocompletado, chat y un modo agente.",
    },
    {
      question: "¿Claude Code es gratis?",
      answer:
        "Los cursos para aprender a usarlo sí lo son, pero la herramienta requiere una suscripción de pago o pagar por uso. Otras herramientas tienen planes gratuitos con límites. Las condiciones cambian a menudo, así que compruébalas en la web oficial antes de decidir; para aprender fundamentos basta el chat gratuito de cualquier asistente.",
    },
    {
      question: "¿Por qué herramienta empiezo?",
      answer:
        "Por el chat de un asistente como Claude mientras aprendes fundamentos, para que te explique conceptos y errores. Después, un asistente dentro del editor como Copilot o Cursor, que te mantiene al mando. Los agentes como Claude Code, al final, cuando ya puedas revisar y explicar cada cambio que proponen.",
    },
  ],
};

export const TOPIC_PATHS: Guide[] = [
  {
    slug: "ruta-ciberseguridad-desde-cero",
    kind: "ruta",
    shortTitle: "Ciberseguridad",
    title: "Ciberseguridad desde cero con cursos gratis: la ruta paso a paso",
    description:
      "En qué orden aprender redes, sistemas, fundamentos de seguridad y hacking ético, cómo practicar de forma legal y qué cursos gratuitos seguir en cada etapa.",
    categorySlug: "programming",
    courseMatch: {
      categories: ["programming"],
      keywords: ["ciberseguridad", "hacking ético", "hacking etico", "pentesting", "kali linux", "seguridad informática", "seguridad web", "osint", "redes", "malware", "seguridad en internet"],
    },
    published: "2026-10-09",
    updated: "2026-10-09",
    related: ["ruta-devops-y-cloud", "ruta-desarrollo-backend", "proyectos-para-consolidar-lo-aprendido", "demostrar-lo-aprendido-sin-certificado"],
    intro:
      "La ciberseguridad se puede empezar a aprender gratis y desde cero, pero no por donde suele prometerse. Antes de usar herramientas de hacking hay que entender cómo funcionan las redes, los sistemas operativos y las aplicaciones web, porque atacar o defender algo que no comprendes se queda en seguir recetas. Esta ruta ordena el camino en cinco etapas, explica dónde practicar de forma legal y cómo elegir entre los muchos cursos gratuitos que hay en español.",
    sections: [
      {
        heading: "Antes de empezar: qué es y qué no es la ciberseguridad",
        paragraphs: [
          "La ciberseguridad es un campo amplio: incluye proteger redes y sistemas, vigilar y responder a incidentes, revisar la seguridad de aplicaciones, gestionar riesgos y cumplir normativas. El hacking ético o pentesting, el que más aparece en los vídeos, es solo una parte y no la más numerosa en ofertas de empleo: muchos puestos de entrada son de defensa, como analista en un centro de operaciones de seguridad.",
          "Una advertencia que no es una formalidad: atacar sistemas sin permiso escrito de su dueño es delito, aunque sea para practicar. Todo lo que aprendas en esta ruta debe ponerse en práctica en tu propio laboratorio o en plataformas creadas para ello.",
        ],
      },
      {
        heading: "Etapa 1 — Redes y sistemas operativos (6-8 semanas)",
        paragraphs: [
          "Es la base de todo lo demás. Aprende cómo viaja la información por una red: direcciones IP, puertos, protocolos como TCP, UDP, DNS y HTTP, y qué hacen un router o un cortafuegos. Un curso completo de redes informáticas desde cero cubre esto en pocas semanas.",
          "En paralelo, familiarízate con Linux y su terminal: moverte por el sistema de archivos, gestionar usuarios y permisos, instalar paquetes y leer registros. La mayoría de herramientas de seguridad viven en Linux y casi todos los cursos posteriores dan este manejo por sabido.",
        ],
        steps: [
          "Instala una máquina virtual con Linux (VirtualBox es gratuito) y úsala a diario.",
          "Captura tu propio tráfico con Wireshark y trata de identificar una consulta DNS y una petición web.",
        ],
      },
      {
        heading: "Etapa 2 — Fundamentos de seguridad (4-6 semanas)",
        paragraphs: [
          "Con la base técnica, un curso de fundamentos de ciberseguridad te da el vocabulario y el mapa del campo: confidencialidad, integridad y disponibilidad, tipos de ataques y de malware, autenticación, cifrado, copias de seguridad y gestión de vulnerabilidades. También conviene un curso de seguridad personal en internet: contraseñas, doble factor y privacidad, porque son la primera línea de defensa y lo que más se aplica en el día a día.",
        ],
      },
      {
        heading: "Etapa 3 — Programación para seguridad (4-8 semanas)",
        paragraphs: [
          "No necesitas ser desarrollador, pero sí leer y escribir scripts sencillos. Python es la elección habitual: sirve para automatizar tareas, procesar registros y entender cómo funcionan las herramientas que usarás. Si además te interesa la seguridad web, aprende lo básico de HTML, JavaScript y SQL: sin ellos, vulnerabilidades como la inyección SQL o el cross-site scripting son solo nombres.",
        ],
        links: [{ href: "/guias/aprender-programacion-gratis-ruta-completa", label: "Ruta para aprender programación gratis" }],
      },
      {
        heading: "Etapa 4 — Hacking ético en un laboratorio (8-12 semanas)",
        paragraphs: [
          "Ahora sí: un curso de hacking ético o pentesting te enseñará la metodología (reconocimiento, escaneo, explotación y elaboración del informe) y herramientas como Nmap, Burp Suite o Metasploit, normalmente sobre Kali Linux. Fíjate en que el curso explique por qué funciona cada ataque y cómo se corrige; el informe con recomendaciones es lo que un cliente paga, no la intrusión.",
          "Practica en máquinas vulnerables diseñadas para ello y en plataformas de retos con niveles gratuitos. Ve documentando cada máquina que resuelvas: tus notas serán tu portfolio.",
        ],
        steps: [
          "Monta tu laboratorio: una máquina atacante y otra deliberadamente vulnerable, aisladas en una red interna.",
          "Resuelve retos de nivel principiante y escribe un informe breve de cada uno.",
          "Estudia las vulnerabilidades web más comunes de la lista OWASP Top 10.",
        ],
      },
      {
        heading: "Etapa 5 — Especialízate y demuéstralo (continuo)",
        paragraphs: [
          "Con todo lo anterior podrás elegir dirección con criterio: defensa y respuesta a incidentes, seguridad ofensiva, seguridad de aplicaciones, seguridad en la nube o investigación con fuentes abiertas (OSINT). Cada una tiene sus propios cursos y certificaciones; muchas certificaciones son de pago, así que llega a ellas con la base gratuita ya hecha y sabiendo cuál pide tu objetivo.",
        ],
        links: [{ href: "/guias/demostrar-lo-aprendido-sin-certificado", label: "Cómo demostrar lo aprendido sin certificado" }],
      },
      {
        heading: "Cómo elegir los cursos",
        paragraphs: [
          "Desconfía de títulos que prometen hackear redes sociales, teléfonos o redes wifi ajenas: además de rozar lo ilegal, suelen enseñar trucos sueltos sin fundamentos. Un buen curso explica conceptos, trabaja en un entorno controlado y dedica tiempo a la defensa.",
          "En cada ficha del catálogo indicamos el nivel, la duración, los requisitos previos y nuestro veredicto. Si un curso de hacking da por sabido el manejo de Linux o de redes, termina antes las etapas 1 y 2.",
        ],
        links: [{ href: "/programming", label: "Cursos de programación y ciberseguridad del catálogo" }],
      },
    ],
    faq: [
      {
        question: "¿Puedo aprender ciberseguridad sin saber programar?",
        answer:
          "Puedes empezar, porque la primera etapa son redes y sistemas operativos, pero pronto necesitarás leer y escribir scripts sencillos, normalmente en Python, y entender lo básico de HTML, JavaScript y SQL si te interesa la seguridad web. No hace falta ser desarrollador: basta con poder automatizar tareas y entender cómo funcionan las herramientas.",
      },
      {
        question: "¿Es legal practicar hacking ético?",
        answer:
          "Sí, siempre que lo hagas sobre sistemas propios o con permiso escrito de su dueño. Atacar sistemas ajenos sin autorización es delito, aunque sea para practicar. Por eso esta ruta propone montar tu propio laboratorio con máquinas virtuales y usar máquinas vulnerables y plataformas de retos creadas para ello.",
      },
      {
        question: "¿Por dónde empiezo: por Kali Linux o por redes?",
        answer:
          "Por redes y sistemas operativos. Kali Linux es una caja de herramientas, y usarla sin entender IP, puertos, protocolos y el manejo de la terminal de Linux se queda en seguir recetas. Con seis a ocho semanas de redes y Linux, los cursos de hacking ético se aprovechan mucho más.",
      },
      {
        question: "¿Cuánto tiempo necesito para conseguir un primer trabajo?",
        answer:
          "Depende de tu punto de partida y del mercado de tu zona, así que desconfía de plazos cerrados. La ruta está pensada para unos seis a nueve meses de estudio constante hasta poder elegir especialidad. Muchos puestos de entrada son de defensa, como analista en un centro de operaciones de seguridad, y lo que más pesa es poder demostrar práctica documentada.",
      },
    ],
  },
  {
    slug: "ruta-seo-desde-cero",
    kind: "ruta",
    shortTitle: "SEO",
    title: "SEO desde cero con cursos gratis: cómo aprender a posicionar una web",
    description:
      "Qué es el SEO, en qué orden aprender búsqueda de palabras clave, SEO on page, técnico y de contenidos, qué herramientas gratuitas usar y qué cursos seguir.",
    categorySlug: "marketing",
    courseMatch: {
      categories: ["marketing", "business"],
      keywords: ["seo", "posicionamiento web", "seo local", "seo técnico", "palabras clave", "search console", "screaming frog", "yoast"],
    },
    published: "2026-10-09",
    updated: "2026-10-09",
    related: ["ruta-marketing-digital", "ruta-desarrollo-frontend", "proyectos-para-consolidar-lo-aprendido", "plan-de-estudio-semanal"],
    intro:
      "El SEO, o posicionamiento en buscadores, es el conjunto de prácticas para que una web aparezca en los resultados de Google y de otros buscadores cuando alguien busca lo que ofrece. Se puede aprender gratis y sin saber programar, y es de las disciplinas del marketing digital donde más se nota la práctica: nada enseña tanto como posicionar una web propia. Esta ruta ordena el aprendizaje en cinco etapas y explica cómo distinguir los cursos serios de los que venden atajos.",
    sections: [
      {
        heading: "Antes de empezar: cómo funciona un buscador",
        paragraphs: [
          "Todo el SEO se entiende mejor sabiendo qué hace un buscador: rastrea las páginas siguiendo enlaces, las indexa (las guarda y analiza) y, cuando alguien busca, ordena las que mejor responden a esa búsqueda. Cada etapa de esta ruta trabaja una de esas fases: que tu web se pueda rastrear e indexar, que responda bien a lo que la gente busca y que otros sitios la consideren una referencia.",
          "Expectativa realista: el SEO es lento. Los cambios tardan semanas o meses en reflejarse, y nadie fuera de Google conoce todos los factores que usa. Desconfía de quien garantice el primer puesto.",
        ],
      },
      {
        heading: "Etapa 1 — Fundamentos y una web propia (3-4 semanas)",
        paragraphs: [
          "Empieza con un curso de SEO para principiantes que explique los conceptos básicos: intención de búsqueda, palabras clave, títulos, enlaces internos y externos. Al mismo tiempo, crea una web pequeña sobre un tema que conozcas, con WordPress o cualquier generador de sitios. Será tu laboratorio durante toda la ruta.",
          "Da de alta la web en Google Search Console, que es gratuita: te dice qué páginas están indexadas, por qué búsquedas apareces y qué errores encuentra Google.",
        ],
      },
      {
        heading: "Etapa 2 — Investigación de palabras clave (2-3 semanas)",
        paragraphs: [
          "Aprende a descubrir qué busca la gente y con qué intención: informarse, comparar, comprar o llegar a un sitio concreto. Las sugerencias del propio buscador, las preguntas relacionadas y los datos de Search Console son gratuitos y suficientes para aprender; las herramientas de pago amplían datos, pero no sustituyen el criterio.",
        ],
        steps: [
          "Elige diez búsquedas reales relacionadas con tu web y anota qué tipo de página ocupa los primeros resultados.",
          "Agrupa las búsquedas por intención y asigna cada grupo a una sola página de tu web.",
        ],
      },
      {
        heading: "Etapa 3 — SEO on page y contenidos (4-6 semanas)",
        paragraphs: [
          "Es la parte que más controlas: escribir contenido que responda mejor que los demás a una búsqueda concreta, con un título y una meta descripción claros, encabezados ordenados, imágenes con texto alternativo y enlaces internos entre páginas relacionadas. Un buen curso de SEO on page lo explica con ejemplos; aplícalo después a cada página de tu web y observa los cambios en Search Console.",
          "Desde la llegada de los resultados generados con IA en buscadores y asistentes, importa todavía más responder de forma directa y verificable: una respuesta clara al principio y los detalles después.",
        ],
      },
      {
        heading: "Etapa 4 — SEO técnico (4-6 semanas)",
        paragraphs: [
          "El SEO técnico se ocupa de que el buscador pueda rastrear e interpretar la web: velocidad de carga, versión móvil, mapa del sitio, archivo robots.txt, redirecciones, enlaces rotos, contenido duplicado y datos estructurados. No hace falta programar, pero sí perderle el miedo al HTML básico. Herramientas con versión gratuita, como Screaming Frog para rastrear tu web, te dejan auditarla como lo haría un profesional.",
        ],
        links: [{ href: "/guias/ruta-desarrollo-frontend", label: "Ruta de desarrollo frontend (para entender el HTML)" }],
      },
      {
        heading: "Etapa 5 — Autoridad, SEO local y medición (continuo)",
        paragraphs: [
          "Los enlaces desde otras webs siguen siendo una señal de confianza. Aprende a conseguirlos de forma legítima, con contenido que merezca ser citado, y evita comprarlos: es una práctica que va contra las directrices de Google. Si trabajas para negocios físicos, añade el SEO local, centrado en la ficha de empresa y las reseñas.",
          "Por último, aprende a medir con Search Console y una herramienta de analítica web: clics, impresiones, posición media y conversiones. Un informe mensual de tu propia web, con qué cambiaste y qué pasó, es el mejor portfolio que puedes enseñar.",
        ],
        links: [{ href: "/guias/ruta-marketing-digital", label: "Ruta de marketing digital" }],
      },
      {
        heading: "Cómo elegir los cursos",
        paragraphs: [
          "En SEO la fecha importa: los fundamentos cambian poco, pero las herramientas, las directrices y el aspecto de los resultados de búsqueda sí. Prioriza cursos recientes para las etapas 3 a 5 y desconfía de los que prometen resultados en días o se basan en trucos para engañar al buscador.",
          "En cada ficha del catálogo indicamos el nivel, la duración, la fecha de publicación y nuestro veredicto, para que encajes cada curso en su etapa.",
        ],
        links: [{ href: "/marketing", label: "Cursos de marketing del catálogo" }],
      },
    ],
    faq: [
      {
        question: "¿Necesito saber programar para aprender SEO?",
        answer:
          "No. La mayor parte del SEO, como la investigación de palabras clave, los contenidos y el SEO on page, no requiere programar. Para el SEO técnico conviene perderle el miedo al HTML básico y entender conceptos como el mapa del sitio, el archivo robots.txt o las redirecciones, pero no hace falta ser desarrollador.",
      },
      {
        question: "¿Cuánto tarda en notarse el SEO?",
        answer:
          "Semanas o meses. Los buscadores tienen que rastrear e indexar de nuevo las páginas y comparar con la competencia, así que los cambios no se reflejan de inmediato. Por eso esta ruta propone una web propia desde el principio: verás el efecto de lo que aprendes con el tiempo en Google Search Console.",
      },
      {
        question: "¿Qué herramientas gratuitas necesito?",
        answer:
          "Para aprender bastan Google Search Console, las sugerencias y preguntas relacionadas del propio buscador, una herramienta de analítica web y la versión gratuita de un rastreador como Screaming Frog. Las herramientas de pago amplían datos, pero no sustituyen el criterio, y no son necesarias para empezar.",
      },
      {
        question: "¿Sigue sirviendo el SEO con los resultados generados por IA?",
        answer:
          "Sí. Los buscadores y asistentes siguen necesitando páginas rastreables y fiables de donde sacar la información. Lo que gana peso es responder de forma directa y verificable, con una respuesta clara al principio y los detalles después, además de los fundamentos técnicos de siempre.",
      },
    ],
  },
  {
    slug: "ruta-videojuegos-con-unity",
    kind: "ruta",
    shortTitle: "Videojuegos con Unity",
    title: "Desarrollo de videojuegos con Unity: ruta con cursos gratis",
    description:
      "Cómo aprender a crear videojuegos con Unity desde cero: C#, el editor, un primer juego 2D, física y animación, y qué cursos gratuitos seguir en cada etapa.",
    categorySlug: "programming",
    courseMatch: {
      categories: ["programming", "design"],
      keywords: ["unity", "videojuego", "videojuegos", "gamedev", "c#", "juego 2d", "juego 3d", "godot"],
    },
    published: "2026-10-09",
    updated: "2026-10-09",
    related: ["aprender-programacion-gratis-ruta-completa", "proyectos-para-consolidar-lo-aprendido", "ruta-diseno-grafico", "plan-de-estudio-semanal"],
    intro:
      "Unity es uno de los motores de videojuegos más usados del mundo, sobre todo en juegos independientes y para móviles, y su versión personal es gratuita mientras tus ingresos estén por debajo del límite que fija Unity en su licencia. Hay muchos cursos gratuitos en español para aprenderlo, pero el error más común es saltar directamente a copiar un juego completo sin entender el código. Esta ruta propone cinco etapas, de los fundamentos de C# a publicar un juego pequeño terminado.",
    sections: [
      {
        heading: "Antes de empezar: qué necesitas",
        paragraphs: [
          "Un ordenador razonablemente moderno (Unity funciona en Windows, macOS y Linux), el Unity Hub para instalar el editor y Visual Studio o Visual Studio Code para programar. Para juegos 2D sencillos no hace falta un equipo potente; los proyectos 3D grandes sí lo agradecen.",
          "No necesitas saber dibujar ni componer música: hay recursos gratuitos con licencias que permiten usarlos en tus juegos. Lo que sí necesitas es aceptar que el primer juego será pequeño. Terminar algo pequeño enseña más que empezar algo enorme.",
        ],
      },
      {
        heading: "Etapa 1 — C# y lógica de programación (4-6 semanas)",
        paragraphs: [
          "Unity se programa en C#. Puedes aprender el lenguaje dentro del propio motor con un curso de C# para Unity, que tiene la ventaja de ver resultados en pantalla desde el principio, o con un curso general de fundamentos. En ambos casos, asegúrate de entender variables, condicionales, bucles, funciones, clases y listas antes de seguir.",
          "Sabes que puedes avanzar cuando eres capaz de leer un script de un tutorial y explicar qué hace cada parte, en lugar de copiarlo línea a línea.",
        ],
        links: [{ href: "/guias/aprender-programacion-gratis-ruta-completa", label: "Ruta para aprender programación gratis" }],
      },
      {
        heading: "Etapa 2 — El editor de Unity (2-3 semanas)",
        paragraphs: [
          "Aprende a moverte por el editor: escenas, objetos (GameObjects), componentes, el inspector, los prefabs y el ciclo de vida de un script (Start y Update). Un curso de introducción a Unity cubre todo esto con un proyecto guiado. Las plantillas oficiales que trae Unity son un buen punto de partida para explorar sin empezar de cero.",
        ],
      },
      {
        heading: "Etapa 3 — Tu primer juego 2D completo (4-6 semanas)",
        paragraphs: [
          "Sigue un curso que construya un juego 2D de principio a fin: un plataformas, un juego de naves o un juego de puzles. Aprenderás movimiento del personaje, colisiones, física, entrada del jugador, puntuación, menús y cambio de escenas. Después, repite el juego por tu cuenta cambiando algo importante (otras mecánicas, otros niveles) sin mirar el vídeo.",
        ],
        steps: [
          "Termina el juego del curso, con menú de inicio y pantalla de fin.",
          "Haz una variante propia con al menos una mecánica nueva.",
          "Compílalo y pásaselo a otra persona para que lo pruebe.",
        ],
      },
      {
        heading: "Etapa 4 — Animación, sonido, interfaz y 3D (6-8 semanas)",
        paragraphs: [
          "Con un juego terminado, amplía: animaciones con el Animator, efectos de sonido y música, interfaces con el sistema de UI de Unity, guardado de partidas y, si te interesa, el salto al 3D con cámaras, iluminación y navegación de enemigos. Elige un curso por tema en lugar de uno enorme que lo toque todo por encima.",
          "Si te atrae otro motor, es buen momento para probar Godot, gratuito y de código abierto; los conceptos que aprendes en Unity se transfieren bien.",
        ],
      },
      {
        heading: "Etapa 5 — Publica un juego pequeño (continuo)",
        paragraphs: [
          "Publicar enseña lo que ningún curso cubre: pulir, corregir errores que solo aparecen en otros equipos y escuchar a quien juega. Plataformas como itch.io permiten subir juegos gratis. Participar en una game jam, en la que se hace un juego en un fin de semana, es una forma excelente de practicar con un límite claro.",
        ],
        links: [
          { href: "/guias/proyectos-para-consolidar-lo-aprendido", label: "Ideas de proyectos para consolidar lo aprendido" },
          { href: "/guias/demostrar-lo-aprendido-sin-certificado", label: "Cómo montar un portfolio sin certificado" },
        ],
      },
      {
        heading: "Cómo elegir los cursos",
        paragraphs: [
          "Unity cambia de versión con frecuencia y algunos menús y sistemas (como el de entrada del jugador) han cambiado en los últimos años. Los conceptos de un curso de hace cuatro o cinco años siguen valiendo, pero para el editor prioriza cursos recientes o ten a mano la documentación oficial.",
          "En cada ficha del catálogo indicamos el nivel, la duración, la fecha y nuestro veredicto. Si un curso empieza ya programando mecánicas complejas, termina antes la etapa de C#.",
        ],
        links: [{ href: "/programming", label: "Cursos de programación del catálogo" }],
      },
    ],
    faq: [
      {
        question: "¿Unity es gratis?",
        answer:
          "Su versión personal es gratuita mientras tus ingresos estén por debajo del límite que fija Unity en su licencia, más que suficiente para aprender y publicar tus primeros juegos. Los cursos de esta ruta también son gratuitos. Las condiciones de licencia han cambiado alguna vez, así que conviene consultarlas en la web oficial de Unity.",
      },
      {
        question: "¿Necesito saber programar antes de empezar con Unity?",
        answer:
          "No, pero la primera etapa de la ruta es aprender C#, el lenguaje con el que se programa Unity, ya sea con un curso de C# para Unity o con uno de fundamentos. Saltar directamente a copiar juegos completos sin entender el código es el error más común y el que más atascos provoca después.",
      },
      {
        question: "¿Empiezo con 2D o con 3D?",
        answer:
          "Con 2D. Los juegos 2D tienen menos piezas (cámara, iluminación y modelos son más sencillos) y te permiten terminar un juego completo antes. Los conceptos de objetos, componentes, física y scripts son los mismos, así que el salto al 3D en la etapa 4 es natural.",
      },
      {
        question: "¿Unity o Godot?",
        answer:
          "Los dos sirven para aprender. Unity tiene más cursos en español y es muy usado en juegos independientes y para móviles; Godot es gratuito y de código abierto. Los conceptos se transfieren bien de uno a otro, así que esta ruta usa Unity y propone probar Godot cuando ya tengas un juego terminado.",
      },
    ],
  },
];
