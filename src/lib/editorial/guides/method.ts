import type { Guide } from "./types";

/** How to study and how to choose (September 2026). */
export const METHOD_GUIDES: Guide[] = [
  {
    slug: "seguir-un-curso-de-youtube-hasta-el-final",
    kind: "metodo",
    shortTitle: "Seguir un curso de YouTube",
    title: "Cómo seguir un curso gratis de YouTube hasta el final",
    description:
      "Un método práctico para convertir un vídeo de diez horas en un curso de verdad: preparación, sesiones, apuntes con marcas de tiempo, práctica y repaso.",
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["como-terminar-un-curso-online", "tomar-apuntes-y-repasar", "plan-de-estudio-semanal", "proyectos-para-consolidar-lo-aprendido"],
    intro:
      "YouTube tiene cursos completos de enorme calidad, pero su formato juega en contra de terminarlos: no hay fechas, ni profesor que te pregunte, y la siguiente recomendación está siempre a un clic. Casi todo el mundo ha empezado alguna vez un curso de ocho horas y lo ha dejado en la segunda. Esta guía propone un método concreto, paso a paso, para convertir un vídeo largo o una lista de reproducción en un curso estructurado que llegues a terminar.",
    sections: [
      {
        heading: "Paso 1 — Antes de darle al play: evalúa el curso",
        paragraphs: [
          "Dedica diez minutos a comprobar que el curso merece tus próximas semanas. Mira la fecha de publicación, el índice de capítulos y los primeros minutos para ver si el ritmo y la forma de explicar te encajan. Lee algunos comentarios: suelen avisar de partes desactualizadas o de erratas. Comprueba también qué necesitas instalar y si da por sabido algo que aún no conoces.",
          "En nuestras fichas encontrarás ya hecho buena parte de este trabajo: para quién es, requisitos previos, estructura por bloques, puntos fuertes y débiles y un plan de estudio sugerido.",
        ],
        links: [{ href: "/guias/como-elegir-un-curso-gratis-bueno", label: "Checklist para elegir un curso gratis bueno" }],
      },
      {
        heading: "Paso 2 — Convierte el vídeo en un temario",
        paragraphs: [
          "Un vídeo de diez horas intimida; veinte sesiones de media hora, no. Usa los capítulos del vídeo (las marcas de tiempo de la descripción) o la lista de reproducción para dividir el curso en sesiones de entre 30 y 60 minutos de vídeo, cortando siempre en un final de tema. Apunta el plan en un documento o en tu calendario, con el minuto exacto en el que empieza cada sesión.",
          "Recuerda que el tiempo real de estudio es mayor que la duración del vídeo: entre pausas, práctica y repaso, calcula al menos una vez y media o el doble. Un curso de diez horas son, siendo realistas, entre quince y veinte horas de trabajo.",
        ],
        steps: [
          "Lista los capítulos con su minuto de inicio.",
          "Agrúpalos en sesiones de 30-60 minutos de vídeo.",
          "Asigna cada sesión a un día y una hora concretos de las próximas semanas.",
        ],
        ordered: true,
      },
      {
        heading: "Paso 3 — Prepara el entorno",
        paragraphs: [
          "Antes de la primera sesión, instala todo lo que el curso necesita y comprueba que funciona. Nada mata más la motivación que perder la primera tarde peleando con una instalación. Crea una carpeta para el curso con tus apuntes y ejercicios.",
          "Reduce las distracciones: pantalla completa, notificaciones silenciadas y, si es posible, el curso en una ventana y tu herramienta de práctica en otra. Algunas extensiones del navegador ocultan las recomendaciones y los comentarios de YouTube; son muy útiles para no acabar viendo otra cosa.",
        ],
      },
      {
        heading: "Paso 4 — Cada sesión, con un ritual",
        paragraphs: [
          "Empieza cada sesión repasando en dos minutos tus apuntes de la anterior. Luego ve el bloque del día con el vídeo pausado a menudo: cada vez que el profesor haga algo, hazlo tú. Si solo miras, estás viendo un espectáculo, no estudiando.",
          "Ajusta la velocidad de reproducción con criterio: acelerar las partes que ya conoces ahorra tiempo, pero ralentiza o repite las partes nuevas o densas. Activa los subtítulos si el curso está en otro idioma o si el audio no es bueno.",
          "Termina cada sesión escribiendo en tres frases lo que has aprendido y una duda pendiente. Ese resumen es el mejor indicador de si has entendido algo o solo lo has visto.",
        ],
      },
      {
        heading: "Paso 5 — Apuntes con marcas de tiempo",
        paragraphs: [
          "Toma apuntes breves, con tus palabras y con el minuto del vídeo al lado de cada idea importante. Cuando necesites repasar algo, irás directo al punto exacto en lugar de buscar durante diez minutos. Los apuntes no son una transcripción: una idea por línea, un ejemplo propio y las preguntas que te surjan.",
        ],
        links: [{ href: "/guias/tomar-apuntes-y-repasar", label: "Cómo tomar apuntes y repasar para no olvidar" }],
      },
      {
        heading: "Paso 6 — Practica más allá del vídeo",
        paragraphs: [
          "La mayoría de cursos de YouTube no tienen ejercicios evaluados, así que tienes que ponértelos tú. Al terminar cada bloque, repite el ejemplo del vídeo sin mirarlo y después cámbialo: añade una función, usa otros datos, resuelve un caso parecido. Al final del curso, haz un proyecto pequeño que no salga en él. Es donde descubrirás lo que de verdad has aprendido.",
        ],
      },
      {
        heading: "Paso 7 — Cuando te atasques o te desmotives",
        paragraphs: [
          "Atascarse es parte del proceso. Si una parte no se entiende, vuelve a verla una vez, busca otra explicación del mismo concepto en otro vídeo o en la documentación y, si sigues atascado, apúntalo como duda y sigue adelante. Muchas veces se aclara solo unas lecciones después.",
          "Si pierdes el ritmo, no reinicies el curso desde el principio: repasa tus apuntes y retoma donde lo dejaste. Y si a mitad de curso compruebas que no es lo que buscabas, dejarlo también es una decisión legítima; lo importante es que sea una decisión y no un abandono por inercia.",
        ],
        links: [{ href: "/guias/como-terminar-un-curso-online", label: "Técnicas para no abandonar un curso online" }],
      },
    ],
    faq: [
      {
        question: "¿Es mejor un vídeo largo o una lista de reproducción?",
        answer:
          "Ninguno es mejor por sí mismo. Un vídeo largo con capítulos mantiene un hilo continuo y suele estar pensado como un curso completo; una lista de reproducción facilita dividir el curso en sesiones y marcar lo ya visto. Lo que importa es que tenga estructura clara, un temario que cubra lo que necesitas y un ritmo que te encaje.",
      },
      {
        question: "¿Puedo ver los cursos a doble velocidad?",
        answer:
          "Puedes acelerar las partes que ya conoces o las introducciones, pero no conviene hacerlo en contenido nuevo o denso. Acelerar da sensación de avanzar más rápido, pero reduce el tiempo para procesar y practicar, y al final lo que no entiendes hay que volver a verlo. Una velocidad ligeramente superior a la normal suele ser un buen equilibrio.",
      },
      {
        question: "¿Qué hago si el curso está desactualizado en algún punto?",
        answer:
          "Revisa los comentarios del vídeo: a menudo otros estudiantes explican qué ha cambiado y cómo resolverlo. Consulta la documentación oficial de la herramienta para ver la forma actual de hacerlo. Si las diferencias son pequeñas, adaptarte es incluso buen ejercicio. Si son grandes y afectan a la mayor parte del curso, quizá convenga buscar uno más reciente.",
      },
      {
        question: "¿Tengo que terminar el curso aunque ya no me aporte?",
        answer:
          "No. Terminar es importante cuando el curso sigue siendo útil, porque la parte final suele ser la que consolida todo. Pero si descubres que no cubre lo que necesitas, que es demasiado básico o que hay una opción claramente mejor, dejarlo es una decisión razonable. Lo que conviene evitar es abandonar por inercia o por una dificultad puntual.",
      },
    ],
  },
  {
    slug: "tomar-apuntes-y-repasar",
    kind: "metodo",
    shortTitle: "Apuntes y repaso",
    title: "Cómo tomar apuntes y repasar para no olvidar lo que aprendes",
    description:
      "Recuerdo activo, repetición espaciada, técnica Feynman y apuntes útiles: las técnicas de estudio con más respaldo, aplicadas a cursos en vídeo.",
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["seguir-un-curso-de-youtube-hasta-el-final", "usar-la-ia-para-estudiar", "plan-de-estudio-semanal", "ruta-ingles-desde-cero"],
    intro:
      "Terminar un curso no significa haberlo aprendido. Buena parte de lo que vemos se olvida en pocos días si no hacemos nada para retenerlo, un fenómeno descrito hace más de un siglo como curva del olvido. La buena noticia es que la investigación en psicología del aprendizaje ha identificado técnicas sencillas que mejoran mucho la retención. Esta guía explica las más útiles y cómo aplicarlas a cursos en vídeo.",
    sections: [
      {
        heading: "Por qué releer y subrayar no funciona tan bien",
        paragraphs: [
          "Releer apuntes o volver a ver un vídeo produce una sensación de familiaridad que confundimos con conocimiento: como lo reconocemos, creemos que lo sabemos. Pero reconocer no es recordar. Las técnicas que funcionan tienen algo en común: obligan al cerebro a esforzarse para recuperar la información. Ese esfuerzo, que resulta incómodo, es precisamente lo que fija el aprendizaje.",
        ],
      },
      {
        heading: "Recuerdo activo: pregúntate en lugar de releer",
        paragraphs: [
          "El recuerdo activo consiste en intentar recordar algo sin mirarlo. En la práctica: al terminar una sesión, cierra el vídeo y los apuntes y escribe todo lo que recuerdes. Después compara con el material y corrige. O convierte tus apuntes en preguntas y respóndelas días después sin mirar las respuestas.",
          "Es más costoso que releer y da la sensación de que funciona peor, porque ves lo que no recuerdas. Es exactamente al revés: descubrir lo que has olvidado y recuperarlo es lo que lo consolida.",
        ],
      },
      {
        heading: "Repetición espaciada: repasa justo antes de olvidar",
        paragraphs: [
          "Repasar muchas veces seguidas el mismo día es poco eficiente. Es mucho mejor repasar en intervalos crecientes: al día siguiente, a los tres días, a la semana, al mes. Cada repaso cuesta menos y el recuerdo dura más. Las aplicaciones de tarjetas de memoria con repetición espaciada calculan automáticamente cuándo toca repasar cada tarjeta; varias son gratuitas.",
        ],
        steps: [
          "Crea pocas tarjetas y buenas: una idea por tarjeta, formulada como pregunta.",
          "Incluye ejemplos y contexto, no solo definiciones.",
          "Repasa un poco cada día; saltarse días acumula tarjetas pendientes.",
          "Úsalas para lo que hay que memorizar (vocabulario, comandos, fórmulas), no para todo.",
        ],
      },
      {
        heading: "La técnica Feynman: explícalo con palabras sencillas",
        paragraphs: [
          "Atribuida al físico Richard Feynman, consiste en explicar un concepto como si se lo contaras a alguien que no sabe nada del tema. Cuando te atascas o recurres a jerga sin poder explicarla, has encontrado un hueco en tu comprensión. Vuelve al material, rellénalo y vuelve a explicarlo.",
          "Puedes hacerlo por escrito, en voz alta o, mejor todavía, con una persona real. Enseñar lo aprendido es una de las formas más eficaces de aprenderlo.",
        ],
      },
      {
        heading: "Apuntes que sirvan de verdad",
        paragraphs: [
          "Unos buenos apuntes de un curso en vídeo no son una transcripción. Escribe con tus palabras, una idea por línea, con el minuto del vídeo para volver a él. Añade tus propios ejemplos y las preguntas que te surjan. Deja un margen o una columna para escribir después preguntas de repaso sobre cada bloque, al estilo del método Cornell.",
          "Revisa los apuntes al día siguiente y resume cada sesión en tres o cuatro frases al final. Ese resumen será lo primero que leas cuando quieras repasar el curso meses después.",
        ],
      },
      {
        heading: "Intercalar y practicar variado",
        paragraphs: [
          "Practicar un tipo de ejercicio muchas veces seguidas da buenos resultados en el momento, pero peores a largo plazo que mezclar tipos de problema. Cuando repases, alterna temas: un ejercicio del bloque 1, otro del 3, otro del 2. Te obliga a identificar qué técnica aplicar en cada caso, que es lo que tendrás que hacer en la vida real.",
        ],
      },
      {
        heading: "Un sistema sencillo para cada curso",
        steps: [
          "Durante la sesión: apuntes breves con marcas de tiempo y práctica de cada ejemplo.",
          "Al terminar: resumen en tres frases de memoria, luego comparar.",
          "Al día siguiente: responder de memoria las preguntas de la sesión anterior.",
          "Cada semana: repaso mezclado de todo lo visto y tarjetas de lo que haya que memorizar.",
          "Al acabar el curso: un proyecto propio y una explicación escrita de lo aprendido.",
        ],
        ordered: true,
        links: [{ href: "/guias/seguir-un-curso-de-youtube-hasta-el-final", label: "Método completo para seguir un curso de YouTube" }],
      },
    ],
    faq: [
      {
        question: "¿Mejor apuntes a mano o en el ordenador?",
        answer:
          "Ambos funcionan si escribes con tus propias palabras. A mano tiendes a resumir más porque escribes más despacio, lo que obliga a procesar la información. En el ordenador es más fácil copiar literalmente, y eso rinde menos. Lo importante no es el soporte, sino reformular, relacionar ideas y usar los apuntes después para repasar de forma activa.",
      },
      {
        question: "¿Cuántas tarjetas de repaso debo hacer por sesión?",
        answer:
          "Pocas y buenas. Para un curso técnico, entre cinco y quince tarjetas por sesión suelen bastar, centradas en lo que realmente hay que memorizar y en las ideas clave. Crear demasiadas convierte el repaso diario en una carga que acaba abandonándose. Si una tarjeta te resulta imposible de recordar, probablemente es demasiado compleja y conviene dividirla.",
      },
      {
        question: "¿Cuándo es mejor repasar?",
        answer:
          "Al día siguiente de ver el contenido y después en intervalos cada vez más largos: unos días, una semana, un mes. También funciona muy bien empezar cada sesión con un repaso breve de la anterior. Las aplicaciones de repetición espaciada calculan los intervalos automáticamente para cada tarjeta, lo que ahorra tener que planificarlo a mano.",
      },
      {
        question: "¿Sirven los mapas mentales?",
        answer:
          "Pueden ser útiles para organizar un tema y ver cómo se relacionan las ideas, sobre todo al terminar un bloque. Su valor está en construirlos tú, porque obliga a pensar en la estructura. Mirar un mapa mental hecho por otra persona tiene el mismo problema que releer: da sensación de familiaridad sin esfuerzo de recuerdo.",
      },
    ],
  },
  {
    slug: "plan-de-estudio-semanal",
    kind: "metodo",
    shortTitle: "Plan de estudio semanal",
    title: "Cómo montar tu plan de estudio semanal (y cumplirlo)",
    description:
      "Calcula tu tiempo real, reparte las horas entre curso, práctica y repaso, y ajusta el plan cada semana: un método sencillo con ejemplos.",
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["aprender-con-poco-tiempo", "seguir-un-curso-de-youtube-hasta-el-final", "como-terminar-un-curso-online", "errores-comunes-al-aprender-solo"],
    intro:
      "Estudiar por tu cuenta tiene una gran ventaja, la libertad, y un gran inconveniente, la misma libertad. Sin horarios ni fechas de entrega, el estudio compite con todo lo demás y casi siempre pierde. Un plan semanal sencillo resuelve buena parte del problema: convierte una intención vaga («esta semana estudio») en citas concretas que puedes cumplir. Esta guía explica cómo hacerlo paso a paso, con ejemplos.",
    sections: [
      {
        heading: "Paso 1 — Calcula tu tiempo real",
        paragraphs: [
          "Empieza siendo honesto. Revisa una semana normal y apunta los huecos que de verdad tienes: no los ideales, los reales. Descuenta imprevistos y cansancio. Si tras hacer la cuenta te salen cuatro horas semanales, planifica con cuatro. Un plan de diez horas que incumples cada semana desmotiva mucho más que uno de cuatro que cumples siempre.",
        ],
      },
      {
        heading: "Paso 2 — Define un objetivo por curso y por semana",
        paragraphs: [
          "Un objetivo útil es concreto y verificable: «terminar los capítulos 4 a 6 y hacer el ejercicio de formularios» es mejor que «avanzar en el curso de JavaScript». Para calcularlo, usa la duración del curso y multiplica por 1,5 o 2 para incluir pausas, práctica y repaso. Nuestras fichas incluyen un plan sugerido con semanas y horas por semana que puedes usar como punto de partida.",
        ],
      },
      {
        heading: "Paso 3 — Reparte el tiempo en tres tipos de sesión",
        paragraphs: [
          "No todas las horas de estudio son iguales. Conviene combinar tres tipos: sesiones de contenido nuevo (ver el curso y practicar a la vez), sesiones de práctica (ejercicios o proyecto, sin vídeo nuevo) y un repaso corto. Una proporción razonable es la mitad para contenido nuevo, un tercio para práctica y el resto para repaso.",
        ],
        steps: [
          "Contenido nuevo: en tus mejores horas de concentración, en bloques de 45-90 minutos.",
          "Práctica: puede ser en bloques más largos, por ejemplo el fin de semana.",
          "Repaso: 10-15 minutos, ideal en huecos cortos o al empezar cada sesión.",
        ],
      },
      {
        heading: "Paso 4 — Pon cada sesión en el calendario",
        paragraphs: [
          "Asigna cada sesión a un día y una hora concretos, como si fuera una cita con otra persona. Mejor siempre a la misma hora: la rutina reduce la fuerza de voluntad necesaria para empezar. Si puedes, vincula el estudio a un hábito existente, como después del desayuno o nada más llegar a casa.",
        ],
      },
      {
        heading: "Ejemplos de plan semanal",
        paragraphs: [
          "Con cuatro horas a la semana: tres sesiones de 60 minutos entre semana (dos de contenido nuevo y una de práctica) y dos repasos de 15 minutos. Un curso de 10 horas de vídeo te llevaría unas cinco o seis semanas.",
          "Con ocho horas a la semana: cuatro sesiones de 75 minutos entre semana y un bloque de dos horas y media el fin de semana para el proyecto práctico, más repasos breves. Un curso de 20 horas, unas cinco semanas.",
          "Con treinta minutos al día: alterna días de contenido nuevo y días de práctica, y dedica el domingo a un repaso de la semana. Es menos tiempo, pero la frecuencia diaria compensa mucho.",
        ],
        links: [{ href: "/guias/aprender-con-poco-tiempo", label: "Cómo aprender con 30 minutos al día" }],
      },
      {
        heading: "Paso 5 — Revisión semanal de 15 minutos",
        paragraphs: [
          "Una vez por semana, revisa el plan: qué has cumplido, qué no y por qué. Ajusta la semana siguiente con esa información. Si fallas sistemáticamente la sesión de los viernes, no es falta de voluntad: el plan no encaja con tu vida y hay que cambiarlo. Anota también lo aprendido; ver el progreso acumulado es una fuente de motivación enorme.",
        ],
        steps: [
          "¿Qué he terminado esta semana?",
          "¿Qué sesiones no he hecho y por qué?",
          "¿Qué he aprendido que antes no sabía?",
          "¿Cuál es el objetivo concreto de la próxima semana?",
        ],
      },
      {
        heading: "Qué hacer cuando el plan falla",
        paragraphs: [
          "Fallará, y es normal. Una semana complicada no rompe nada si la siguiente retomas el ritmo. La regla más útil es no fallar dos veces seguidas: si te saltas una sesión, la siguiente es sagrada, aunque sea más corta. Y si varias semanas seguidas no cumples, reduce el plan en lugar de abandonarlo: un plan más pequeño que se cumple vale más que uno ambicioso que no.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Es mejor estudiar por la mañana o por la noche?",
        answer:
          "Depende de cada persona y de su horario. Lo importante es reservar tus mejores horas de concentración para el contenido nuevo, que es lo más exigente, y dejar los repasos y tareas ligeras para los momentos de menos energía. Si no sabes cuáles son tus mejores horas, prueba una semana en cada franja y compara.",
      },
      {
        question: "¿Puedo seguir dos cursos a la vez?",
        answer:
          "Puedes, si son de temas distintos y tienes tiempo suficiente para los dos. Por ejemplo, un curso técnico como objetivo principal y un idioma en sesiones cortas diarias. Seguir dos cursos del mismo tema a la vez suele generar confusión y repeticiones. Con menos de cinco horas semanales, lo más eficaz suele ser centrarse en uno.",
      },
      {
        question: "¿Qué herramienta uso para planificar?",
        answer:
          "La que ya uses a diario. Un calendario digital, una agenda de papel o una hoja de cálculo sirven igual de bien. Lo que importa es que las sesiones estén en un lugar que mires todos los días y que la revisión semanal sea rápida. Cambiar de aplicación cada mes es una forma de posponer el estudio.",
      },
      {
        question: "¿Cómo calculo cuánto me llevará un curso?",
        answer:
          "Multiplica la duración del vídeo por 1,5 o 2 para incluir pausas, práctica y repaso, y divide por las horas semanales que tienes. Un curso de 12 horas con 4 horas semanales son unas cinco o seis semanas. Nuestras fichas incluyen un plan sugerido con semanas y horas por semana calculado a partir de la duración de cada curso.",
      },
    ],
  },
  {
    slug: "proyectos-para-consolidar-lo-aprendido",
    kind: "metodo",
    shortTitle: "Proyectos para practicar",
    title: "Proyectos para consolidar lo aprendido: ideas por materia",
    description:
      "Por qué un proyecto propio enseña más que otro curso, cómo elegirlo a tu medida e ideas concretas para programación, datos, diseño, idiomas, marketing y más.",
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["demostrar-lo-aprendido-sin-certificado", "errores-comunes-al-aprender-solo", "ruta-desarrollo-frontend", "ruta-analisis-de-datos"],
    intro:
      "Hay un momento en todo aprendizaje en el que ver otro curso deja de ser útil. Ya conoces los conceptos, pero al enfrentarte a una página en blanco no sabes por dónde empezar. Ese es el momento de hacer un proyecto propio. Esta guía explica por qué los proyectos son tan formativos, cómo elegir uno a tu medida y propone ideas concretas para distintas materias.",
    sections: [
      {
        heading: "Por qué un proyecto enseña lo que un curso no",
        paragraphs: [
          "En un curso, alguien ya ha tomado todas las decisiones difíciles: qué construir, en qué orden, qué hacer cuando algo falla. En un proyecto propio esas decisiones son tuyas, y tomarlas es precisamente la habilidad que se valora fuera. Además, te enfrentas a problemas que ningún curso cubre y aprendes a buscar soluciones, a leer documentación y a pedir ayuda con preguntas concretas.",
          "Por último, un proyecto terminado es una prueba visible de lo que sabes hacer. Un certificado dice que viste un curso; un proyecto demuestra que puedes aplicarlo.",
        ],
      },
      {
        heading: "Cómo elegir un buen proyecto",
        steps: [
          "Que te interese de verdad: lo vas a sostener durante semanas.",
          "Que sea un poco más difícil de lo que ya sabes hacer, pero no mucho más.",
          "Que se pueda terminar en 2-6 semanas en una primera versión.",
          "Que resuelva un problema real, aunque sea pequeño o solo tuyo.",
          "Que tenga un resultado que se pueda enseñar: una web, un informe, un diseño, una grabación.",
        ],
      },
      {
        heading: "Empieza por una versión mínima",
        paragraphs: [
          "El error más común es plantear un proyecto enorme y abandonarlo a la mitad. Define primero la versión más pequeña que funcione de principio a fin, termínala y después añade mejoras. Una aplicación de tareas que solo añade y borra tareas, pero funciona y está publicada, vale más que una con veinte funciones a medio hacer.",
        ],
      },
      {
        heading: "Ideas para programación y datos",
        steps: [
          "Un gestor de gastos personales con categorías, gráficos y exportación.",
          "Una web que consuma una API pública (el tiempo, transporte, libros) con búsqueda y filtros.",
          "Un script que automatice una tarea tuya: renombrar archivos, descargar datos, enviar un resumen.",
          "Un análisis de datos públicos de tu ciudad o de un tema que te apasione, con conclusiones claras.",
          "Un panel que muestre la evolución de tus hábitos o entrenamientos.",
        ],
        links: [
          { href: "/guias/ruta-desarrollo-frontend", label: "Ruta de frontend" },
          { href: "/guias/ruta-analisis-de-datos", label: "Ruta de análisis de datos" },
        ],
      },
      {
        heading: "Ideas para diseño, marketing y negocio",
        steps: [
          "Rediseñar la web o la aplicación de un comercio o servicio local, explicando cada decisión.",
          "Crear la identidad visual completa de un negocio inventado, con manual de uso.",
          "Llevar durante tres meses las redes o el boletín de una asociación y medir los resultados.",
          "Escribir un blog sobre un tema que domines y documentar su crecimiento con analítica.",
          "Validar una pequeña idea de negocio con entrevistas y un experimento de preventa.",
        ],
      },
      {
        heading: "Ideas para idiomas, música, CAD y otras materias",
        steps: [
          "Idiomas: grabar un pódcast breve semanal o escribir un diario en el idioma durante un mes.",
          "Música: aprender y grabar tres canciones completas, o componer y producir una pieza corta.",
          "CAD: diseñar e imprimir una pieza útil para tu casa, con planos y varias iteraciones.",
          "Productividad: automatizar un informe de tu trabajo y medir el tiempo que ahorra.",
          "Manualidades: un proyecto de principio a fin documentado con fotos de cada paso.",
        ],
      },
      {
        heading: "Documenta y comparte",
        paragraphs: [
          "Al terminar, escribe una explicación breve: qué querías hacer, cómo lo hiciste, qué problemas encontraste y qué harías distinto. Publícala junto al proyecto. Esa reflexión consolida lo aprendido y, si algún día buscas trabajo o clientes, es lo que más interesa a quien lo lee.",
        ],
        links: [{ href: "/guias/demostrar-lo-aprendido-sin-certificado", label: "Cómo convertir tus proyectos en un portfolio" }],
      },
    ],
    faq: [
      {
        question: "¿Cuándo debo empezar mi primer proyecto?",
        answer:
          "Antes de lo que crees. No hace falta terminar todos los cursos: en cuanto domines lo básico de un tema, ya puedes hacer un proyecto pequeño que lo aplique. Hacerlo pronto te enseña qué no sabes y da sentido a lo que aprendes después. Lo ideal es alternar: un bloque de curso, un proyecto pequeño, otro bloque, otro proyecto algo mayor.",
      },
      {
        question: "¿Vale copiar la idea de un proyecto de un tutorial?",
        answer:
          "Como punto de partida, sí, siempre que lo transformes. Si sigues un tutorial para construir una aplicación del tiempo, después añádele funciones que no estaban, cambia el diseño o úsala con otra fuente de datos. La parte en la que ya no hay tutorial es la que te enseña. Y en tu portfolio, sé transparente sobre qué partes vienen de un tutorial.",
      },
      {
        question: "¿Y si mi proyecto no sale bien?",
        answer:
          "Un proyecto que no sale como esperabas también enseña mucho, a veces más que uno que sale perfecto. Documenta qué intentaste, qué falló y por qué, y qué harías distinto. Si el problema es de alcance, reduce el objetivo a una versión más pequeña que puedas terminar. Terminar algo modesto es mejor que dejar a medias algo ambicioso.",
      },
      {
        question: "¿Proyectos solo o en grupo?",
        answer:
          "Los dos aportan. Solo aprendes a tomar todas las decisiones y a resolver problemas por tu cuenta. En grupo aprendes a coordinarte, revisar el trabajo de otros y comunicar decisiones, habilidades muy valoradas en cualquier empleo. Si tienes ocasión, busca comunidades donde se organicen proyectos colaborativos entre personas que están aprendiendo.",
      },
      {
        question: "¿Cuántos proyectos necesito?",
        answer:
          "Para consolidar lo aprendido, uno por cada gran bloque de contenido. Para un portfolio, tres a seis bien elegidos y bien explicados bastan. Importa más la calidad y la variedad que la cantidad: mejor pocos proyectos que muestren habilidades distintas que muchos parecidos entre sí.",
      },
    ],
  },
  {
    slug: "demostrar-lo-aprendido-sin-certificado",
    kind: "metodo",
    shortTitle: "Portfolio sin certificado",
    title: "Cómo demostrar lo aprendido sin certificado: portfolio, proyectos y pruebas",
    description:
      "Qué valor tienen los certificados de cursos gratis, qué pesa más en la práctica y cómo montar un portfolio que convenza, materia por materia.",
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["proyectos-para-consolidar-lo-aprendido", "youtube-o-udemy-cursos-gratis", "ruta-diseno-ux-ui", "aprender-programacion-gratis-ruta-completa"],
    intro:
      "Una de las dudas más frecuentes de quien aprende con cursos gratuitos es cómo demostrarlo después. Muchos cursos de YouTube no dan certificado, y los que sí lo dan no siempre tienen valor para quien contrata. La realidad es que, en muchas profesiones, lo que se valora es la capacidad demostrada. Esta guía explica cómo hacerla visible con un portfolio, proyectos y otras pruebas.",
    sections: [
      {
        heading: "Qué valor tiene un certificado de un curso gratis",
        paragraphs: [
          "Depende del contexto. Los títulos oficiales y algunas certificaciones de fabricantes o de organismos reconocidos pueden ser requisitos formales en determinados empleos o sectores. Los certificados de finalización de cursos en línea, en cambio, suelen tener un valor limitado: dicen que completaste un curso, no que sepas aplicarlo. Pueden servir como complemento en un currículum, pero rara vez deciden una contratación por sí solos.",
          "Si necesitas una acreditación formal, infórmate sobre las opciones oficiales de tu sector y tu país. Para todo lo demás, lo que más pesa es poder enseñar lo que sabes hacer.",
        ],
      },
      {
        heading: "El portfolio: menos piezas, mejor explicadas",
        paragraphs: [
          "Un buen portfolio no acumula todo lo que has hecho, sino que selecciona entre tres y seis trabajos que muestran lo que quieres hacer profesionalmente. Cada trabajo debería explicar el problema, tu proceso, las decisiones que tomaste y el resultado. Quien lo revisa busca criterio, no solo resultado final.",
        ],
        steps: [
          "Título y una frase que resuma el proyecto.",
          "El problema u objetivo, y para quién era.",
          "Tu proceso: qué investigaste, qué alternativas consideraste.",
          "El resultado, con capturas, enlaces o fotos.",
          "Qué aprendiste y qué harías distinto.",
        ],
      },
      {
        heading: "Cómo es un portfolio en cada materia",
        paragraphs: [
          "En programación: repositorios públicos con código ordenado, un README claro y una versión visitable del proyecto. En datos: análisis publicados con la pregunta, el método y las conclusiones, más el código o el archivo. En diseño: casos de estudio con el proceso completo, no solo las pantallas finales. En marketing: informes de proyectos reales con objetivos, acciones y resultados medidos. En idiomas: grabaciones, textos o una prueba de nivel oficial si el trabajo la exige. En CAD: modelos, planos, renders y fotos de lo fabricado.",
        ],
      },
      {
        heading: "Otras formas de demostrar lo que sabes",
        steps: [
          "Contribuir a proyectos de código abierto o a iniciativas colaborativas de tu ámbito.",
          "Escribir sobre lo que aprendes: artículos o hilos que expliquen un tema con claridad.",
          "Ayudar gratis o a bajo coste a una asociación o un pequeño negocio, con su permiso para mostrarlo.",
          "Participar en retos, concursos o maratones de tu disciplina.",
          "Enseñar: un taller, una charla en una comunidad local, un tutorial propio.",
        ],
      },
      {
        heading: "Cómo contar tu formación en el currículum",
        paragraphs: [
          "Menciona los cursos más relevantes de forma breve, con su autor o plataforma, pero da más espacio a lo que construiste con ellos. «Curso de análisis de datos (40 h, YouTube)» dice poco; «Análisis de la movilidad en bicicleta de mi ciudad con SQL y Python, publicado en…» dice mucho. Sé honesto con tu nivel: en una entrevista, la diferencia entre lo que dice el papel y lo que sabes hacer se nota enseguida.",
        ],
      },
      {
        heading: "Mantén el portfolio vivo",
        paragraphs: [
          "Revisa tu portfolio cada pocos meses. Sustituye los trabajos más flojos por otros mejores y actualiza las explicaciones con lo que ahora sabes. Ver cómo mejora con el tiempo es también una forma de medir tu progreso, y una buena razón para seguir aprendiendo.",
        ],
        links: [{ href: "/guias/proyectos-para-consolidar-lo-aprendido", label: "Ideas de proyectos para tu portfolio" }],
      },
    ],
    faq: [
      {
        question: "¿Los cursos gratis de YouTube dan certificado?",
        answer:
          "Por lo general, no: YouTube es una plataforma de vídeo y no emite certificados. Algunas plataformas de cursos ofrecen certificados de finalización, a veces solo en su versión de pago. En todos los casos conviene comprobar las condiciones concretas de cada curso. Como explica esta guía, la ausencia de certificado se compensa con proyectos y un buen portfolio.",
      },
      {
        question: "¿Dónde publico mi portfolio?",
        answer:
          "Depende de la materia. En programación, un repositorio público de código y una web sencilla con enlaces a tus proyectos. En diseño, una web propia o una plataforma especializada para portfolios visuales. En datos, un repositorio con los análisis y una página que los resuma. Lo importante es que sea fácil de encontrar, rápido de revisar y esté actualizado.",
      },
      {
        question: "¿Qué pongo si no tengo experiencia laboral?",
        answer:
          "Tus proyectos son tu experiencia. Descríbelos en el currículum como si fueran trabajos: qué problema resolvían, qué herramientas usaste y qué resultado obtuviste. Si has colaborado con una asociación o un pequeño negocio, aunque sea sin cobrar, inclúyelo. Y prepara una explicación clara de tu trayectoria de aprendizaje: demuestra iniciativa y constancia.",
      },
      {
        question: "¿Merece la pena pagar una certificación oficial?",
        answer:
          "Depende de tu objetivo. En sectores o empresas donde se exige una certificación concreta, puede ser necesaria y rentable. Para demostrar habilidades en general, un buen portfolio suele pesar tanto o más. Antes de pagar, revisa ofertas de empleo que te interesen y comprueba si la piden de forma explícita.",
      },
      {
        question: "¿Cómo hablo de mis proyectos en una entrevista?",
        answer:
          "Prepara para cada proyecto una historia breve: el problema, tus decisiones, lo que salió mal y cómo lo resolviste, y lo que aprendiste. Sé concreto y honesto sobre tu papel y tu nivel. A quien entrevista le interesa ver cómo piensas y cómo aprendes, y eso se nota más al hablar de un obstáculo real que al describir el resultado final.",
      },
    ],
  },
  {
    slug: "errores-comunes-al-aprender-solo",
    kind: "metodo",
    shortTitle: "Errores al aprender solo",
    title: "Errores comunes al aprender solo (y cómo evitarlos)",
    description:
      "El infierno de los tutoriales, estudiar sin practicar, no pedir ayuda, compararse… los tropiezos más habituales del autodidacta y qué hacer con cada uno.",
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["como-terminar-un-curso-online", "plan-de-estudio-semanal", "tomar-apuntes-y-repasar", "usar-la-ia-para-estudiar"],
    intro:
      "Aprender por tu cuenta con cursos gratuitos es una de las formas más accesibles de adquirir nuevas habilidades, pero también tiene trampas propias. Sin un profesor que detecte los errores ni compañeros con los que compararte, es fácil caer en hábitos que dan sensación de avance sin producirlo. Estos son los errores más frecuentes que vemos en quien aprende solo, y lo que puedes hacer para evitarlos.",
    sections: [
      {
        heading: "1. Encadenar cursos sin terminar ninguno",
        paragraphs: [
          "Empezar un curso nuevo es emocionante; la parte central de uno ya empezado, no tanto. El resultado es una colección de cursos al 30 % y la sensación de no dominar nada. La solución es una regla simple: un curso principal cada vez, y no empiezas otro hasta terminarlo o decidir conscientemente dejarlo.",
        ],
      },
      {
        heading: "2. El infierno de los tutoriales",
        paragraphs: [
          "Es la situación en la que puedes seguir cualquier tutorial, pero te bloqueas en cuanto tienes que hacer algo solo. Sucede cuando el aprendizaje se queda en imitar. Para salir, alterna cada curso con un proyecto propio, aunque sea pequeño, y acepta que la primera versión será torpe. Esa incomodidad es aprendizaje.",
        ],
        links: [{ href: "/guias/proyectos-para-consolidar-lo-aprendido", label: "Ideas de proyectos por materia" }],
      },
      {
        heading: "3. Ver sin practicar",
        paragraphs: [
          "Ver a alguien programar, dibujar o tocar un instrumento no te enseña a hacerlo, igual que ver fútbol no te enseña a jugar. Pausa el vídeo y hazlo tú, cada vez. Si el curso no propone ejercicios, invéntalos: repite el ejemplo sin mirar, cámbialo, aplícalo a otro caso.",
        ],
      },
      {
        heading: "4. Confundir familiaridad con conocimiento",
        paragraphs: [
          "Releer apuntes o volver a ver un vídeo produce la sensación de que lo sabes, porque lo reconoces. Pero reconocer no es poder usar. Comprueba lo que sabes intentando recordarlo o aplicarlo sin ayuda. Si no puedes, todavía no lo has aprendido, y es mejor descubrirlo ahora.",
        ],
        links: [{ href: "/guias/tomar-apuntes-y-repasar", label: "Técnicas de repaso que funcionan" }],
      },
      {
        heading: "5. Querer aprenderlo todo a la vez",
        paragraphs: [
          "Tres lenguajes, dos frameworks y un idioma nuevo al mismo tiempo. El entusiasmo es bueno; dispersarlo, no. Elige un objetivo principal por temporada y, como mucho, uno secundario pequeño. Avanzar de verdad en una cosa motiva mucho más que avanzar un poco en cinco.",
        ],
      },
      {
        heading: "6. No pedir ayuda (o pedirla mal)",
        paragraphs: [
          "Quien aprende solo tiende a atascarse durante horas antes de preguntar. Intentarlo primero es bueno, pero hay un límite. Si tras un tiempo razonable sigues bloqueado, pregunta en una comunidad o foro. Y pregunta bien: explica qué intentas hacer, qué has probado, qué esperabas y qué ha pasado. Una buena pregunta a menudo te da la respuesta mientras la escribes.",
        ],
      },
      {
        heading: "7. Compararse con los demás",
        paragraphs: [
          "En internet siempre hay alguien que aprendió más rápido o que ya trabaja de aquello que tú estás empezando. Esas historias suelen omitir el contexto: horas dedicadas, conocimientos previos, suerte. La única comparación útil es contigo mismo hace tres meses.",
        ],
      },
      {
        heading: "8. Elegir cursos por el título y no por el contenido",
        paragraphs: [
          "«Aprende X en una hora» o «de cero a experto» son títulos pensados para atraer clics. Antes de invertir semanas en un curso, revisa su temario, su fecha, su nivel y para quién es. Nuestras fichas resumen estos datos y señalan puntos fuertes y débiles de cada curso para ayudarte a decidir.",
        ],
        links: [{ href: "/guias/como-elegir-un-curso-gratis-bueno", label: "Cómo elegir un curso gratis bueno" }],
      },
      {
        heading: "9. No planificar el tiempo",
        paragraphs: [
          "«Ya estudiaré cuando tenga un rato» casi nunca funciona. Sin un plan, el estudio cede ante cualquier otra cosa. Bloquea sesiones concretas en tu calendario y revísalas cada semana.",
        ],
        links: [{ href: "/guias/plan-de-estudio-semanal", label: "Cómo montar tu plan de estudio semanal" }],
      },
      {
        heading: "10. Descuidar el descanso",
        paragraphs: [
          "Estudiar muchas horas seguidas, restar horas de sueño o no tomar pausas reduce la capacidad de concentrarte y de retener lo aprendido. El sueño cumple un papel importante en la consolidación de la memoria, y las pausas breves ayudan a mantener la atención. Un ritmo sostenible, con descansos y días libres, rinde más a largo plazo que los atracones de estudio seguidos de semanas sin tocar el tema.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Cómo sé si estoy en el infierno de los tutoriales?",
        answer:
          "Una señal clara es poder seguir cualquier tutorial sin problemas, pero no saber por dónde empezar cuando tienes que hacer algo tú solo. Otra es haber completado muchos cursos sin tener ningún proyecto propio terminado. Si te reconoces, detén los cursos nuevos durante unas semanas y dedica ese tiempo a un proyecto pequeño sin tutorial.",
      },
      {
        question: "¿Cuánto tiempo debo intentar resolver algo antes de pedir ayuda?",
        answer:
          "No hay una cifra universal, pero una regla práctica es darte un tiempo acotado, por ejemplo entre media hora y una hora, en el que pruebes soluciones, leas la documentación y busques el error. Si después sigues sin avanzar, pregunta. Pasar tardes enteras bloqueado no enseña más; solo desmotiva.",
      },
      {
        question: "¿Es malo cambiar de curso a mitad?",
        answer:
          "No siempre. Si el curso tiene problemas serios (está desactualizado, explica mal o no cubre lo que necesitas), cambiar es razonable. El problema es cambiar por la emoción de lo nuevo cada vez que un curso se pone difícil. Antes de cambiar, pregúntate si el problema es el curso o la dificultad natural de esa parte del temario.",
      },
      {
        question: "¿Cómo mantengo la motivación sin compañeros?",
        answer:
          "Busca comunidad: foros, grupos de estudio en línea o comunidades del tema que aprendes. Comparte tus avances, aunque sean pequeños. Fija objetivos semanales concretos y lleva un registro de lo que aprendes. Ver el progreso acumulado y tener a alguien con quien compartirlo sustituye buena parte del empuje que da una clase presencial.",
      },
    ],
  },
  {
    slug: "usar-la-ia-para-estudiar",
    kind: "metodo",
    shortTitle: "Estudiar con IA",
    title: "Cómo usar la IA para estudiar mejor sin hacer trampa",
    description:
      "Los asistentes de IA pueden ser un tutor paciente o una forma de no aprender nada. Usos que ayudan, usos que perjudican y cómo verificar lo que te dicen.",
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["tomar-apuntes-y-repasar", "errores-comunes-al-aprender-solo", "ruta-machine-learning-e-ia", "seguir-un-curso-de-youtube-hasta-el-final"],
    intro:
      "Los asistentes de inteligencia artificial han cambiado la forma de estudiar. Bien usados, son un tutor disponible a cualquier hora que explica de otra manera lo que no has entendido, te hace preguntas y revisa tu trabajo. Mal usados, hacen el trabajo por ti y te dejan con la sensación de haber aprendido sin haberlo hecho. Esta guía propone una regla clara para distinguir ambos usos y ejemplos concretos de cada uno.",
    sections: [
      {
        heading: "La regla de oro: que la IA te haga pensar, no que piense por ti",
        paragraphs: [
          "Aprender requiere esfuerzo: recordar, razonar, equivocarse y corregir. Cualquier uso de la IA que elimine ese esfuerzo elimina también el aprendizaje. La pregunta que conviene hacerse es sencilla: después de esta conversación, ¿sabré hacer esto yo solo? Si la respuesta es no, probablemente la estás usando para producir un resultado, no para aprender.",
          "No es una cuestión moral, sino práctica. Cuando estudias por tu cuenta, el único perjudicado de hacer trampa eres tú.",
        ],
      },
      {
        heading: "Usos que ayudan a aprender",
        steps: [
          "Pedir otra explicación de un concepto que no has entendido en el curso, con ejemplos distintos.",
          "Pedir que te haga preguntas sobre un tema para practicar el recuerdo activo, sin darte las respuestas hasta que contestes.",
          "Explicarle un concepto con tus palabras y pedirle que señale errores o lagunas.",
          "Pedir pistas graduales para un ejercicio, no la solución.",
          "Pedir que revise tu código, texto o diseño y te explique qué mejorarías y por qué.",
          "Generar ejercicios de práctica adicionales del nivel del curso que estás siguiendo.",
        ],
      },
      {
        heading: "Usos que perjudican el aprendizaje",
        steps: [
          "Pedir la solución de un ejercicio antes de haberlo intentado en serio.",
          "Copiar código o texto generado que no entiendes línea por línea.",
          "Usar resúmenes de la IA en lugar de ver el curso o leer el material.",
          "Aceptar sus explicaciones sin contrastarlas con otras fuentes.",
        ],
      },
      {
        heading: "La IA se equivoca, y con mucha seguridad",
        paragraphs: [
          "Los modelos de lenguaje generan texto plausible, no necesariamente correcto. Pueden inventar funciones que no existen, citar datos falsos o explicar mal un concepto con total convicción. Cuanto menos sabes de un tema, más difícil es detectarlo, que es justo la situación de quien está aprendiendo.",
          "Por eso conviene verificar: contrasta con la documentación oficial, con el propio curso o con otra fuente fiable, y ejecuta o prueba lo que te propone. Si algo no cuadra con lo que has aprendido, pregunta por qué y comprueba quién tiene razón.",
        ],
      },
      {
        heading: "Cómo pedir ayuda de forma útil",
        paragraphs: [
          "Da contexto: qué estás aprendiendo, en qué curso o nivel estás y qué sabes ya. Pide explícitamente que no te dé la solución sino pistas, o que te explique como a un principiante. Y pide ejemplos distintos de los del curso para comprobar que has entendido la idea y no solo el ejemplo.",
        ],
        steps: [
          "«Estoy aprendiendo X en un curso para principiantes. No entiendo Y. Explícamelo con una analogía y un ejemplo sencillo.»",
          "«Hazme cinco preguntas sobre Z, de una en una, y corrígeme después de cada respuesta.»",
          "«Este es mi intento de solución. No me des la respuesta: dime si voy bien y dame una pista.»",
        ],
      },
      {
        heading: "Honestidad en contextos evaluados",
        paragraphs: [
          "Si estudias en un contexto con evaluación (un curso con certificado, una formación reglada, un proceso de selección), respeta sus normas sobre el uso de IA. Presentar como propio un trabajo generado puede tener consecuencias y, sobre todo, te deja sin la habilidad que se pretendía evaluar. Cuando esté permitido usarla, explica cómo lo has hecho.",
        ],
      },
      {
        heading: "Un flujo de estudio con IA",
        steps: [
          "Ve la lección del curso y practica sin ayuda.",
          "Anota lo que no has entendido y pide explicaciones alternativas.",
          "Intenta los ejercicios; si te atascas, pide pistas graduales.",
          "Al final, pide que te haga preguntas de repaso sobre la lección.",
          "Verifica en la documentación cualquier dato que vayas a usar.",
        ],
        ordered: true,
        links: [{ href: "/guias/tomar-apuntes-y-repasar", label: "Técnicas de repaso: recuerdo activo y repetición espaciada" }],
      },
    ],
    faq: [
      {
        question: "¿Usar IA para estudiar es hacer trampa?",
        answer:
          "No, si la usas para aprender y no para evitar el aprendizaje. Pedir explicaciones alternativas, que te haga preguntas o que revise tu trabajo es como tener un tutor paciente. Pedir que resuelva los ejercicios por ti y entregarlos como propios sí es hacer trampa en un contexto evaluado, y en cualquier contexto te deja sin la habilidad que buscabas.",
      },
      {
        question: "¿Puedo fiarme de lo que me explica la IA?",
        answer:
          "Solo en parte. Los asistentes suelen acertar en conceptos básicos muy documentados, pero pueden equivocarse con seguridad en detalles, datos concretos, versiones de herramientas o temas poco comunes. Verifica lo importante con la documentación oficial o con el propio curso, y ejecuta o prueba cualquier código o procedimiento antes de darlo por bueno.",
      },
      {
        question: "¿Sirve la IA para aprender idiomas?",
        answer:
          "Puede ser un buen compañero de práctica: conversar por escrito, pedir correcciones explicadas, generar ejercicios o explicar diferencias entre expresiones. No sustituye la escucha de hablantes reales ni la conversación con personas, que siguen siendo esenciales para la comprensión oral y la pronunciación. Úsala como complemento de tu rutina, no como su centro.",
      },
      {
        question: "¿Y si el curso que sigo no permite usar IA?",
        answer:
          "Respeta sus normas, sobre todo si hay evaluación o certificado. Las reglas suelen existir para que el resultado refleje lo que tú sabes hacer. Si tienes dudas sobre qué usos están permitidos, pregunta a quien organiza el curso. Fuera de contextos evaluados, la decisión es tuya, y la regla de esta guía te ayudará a usarla sin perjudicar tu aprendizaje.",
      },
    ],
  },
  {
    slug: "aprender-con-poco-tiempo",
    kind: "metodo",
    shortTitle: "Aprender con poco tiempo",
    title: "Cómo aprender con poco tiempo: 30 minutos al día",
    description:
      "Qué se puede aprender realmente con media hora diaria, cómo estructurar esas sesiones cortas y cómo aprovechar los huecos sin quemarte.",
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["plan-de-estudio-semanal", "tomar-apuntes-y-repasar", "ruta-ingles-desde-cero", "ruta-aprender-musica"],
    intro:
      "Trabajo, familia, cansancio: para mucha gente, las dos horas diarias de estudio que proponen algunos cursos son simplemente imposibles. La buena noticia es que media hora al día, mantenida en el tiempo, da para mucho. Son más de 180 horas al año, suficientes para completar varios cursos largos o avanzar un nivel en un idioma. Esta guía explica cómo sacar el máximo partido a sesiones cortas.",
    sections: [
      {
        heading: "Por qué poco y a menudo funciona",
        paragraphs: [
          "El aprendizaje se consolida entre sesiones, no solo durante ellas. Estudiar un poco cada día aprovecha ese efecto: repasas antes de olvidar y cada sesión se apoya en la anterior. Además, una sesión corta cuesta poco empezarla, y empezar es la parte más difícil de cualquier hábito.",
          "No todo se adapta igual. Idiomas, instrumentos musicales, vocabulario técnico o ejercicios de programación encajan de maravilla en sesiones cortas. Los proyectos que requieren concentración profunda necesitan, de vez en cuando, bloques más largos.",
        ],
      },
      {
        heading: "Cómo estructurar 30 minutos",
        paragraphs: [
          "Una estructura que funciona en casi cualquier materia: cinco minutos de repaso de la sesión anterior, veinte minutos de contenido nuevo con práctica y cinco minutos para resumir lo aprendido y dejar preparada la siguiente sesión. Ese último paso es clave: saber exactamente por dónde vas a empezar mañana elimina la fricción de arrancar.",
        ],
        steps: [
          "Minutos 0-5: repaso activo de lo de ayer, sin mirar los apuntes.",
          "Minutos 5-25: un fragmento del curso y su práctica.",
          "Minutos 25-30: resumen en tres frases y apuntar el minuto donde retomar.",
        ],
        ordered: true,
      },
      {
        heading: "Adapta el curso a sesiones cortas",
        paragraphs: [
          "Divide el curso en fragmentos de 10-15 minutos de vídeo, cortando en finales de tema, y numéralos. Así cada sesión tiene un objetivo claro. Un curso de 10 horas de vídeo, a razón de un fragmento diario más práctica, se completa en unos dos o tres meses, un plazo razonable.",
          "En nuestras fichas encontrarás la estructura del curso por bloques y los capítulos con su minuto de inicio, que facilitan mucho este reparto.",
        ],
      },
      {
        heading: "Aprovecha los huecos, pero sin engañarte",
        paragraphs: [
          "Los trayectos, las esperas o los ratos sueltos sirven para ciertas tareas: repasar tarjetas de vocabulario, escuchar un pódcast en el idioma que aprendes o ver la parte teórica de una lección. No sirven para practicar código o tocar un instrumento. Úsalos como complemento, no como sustituto de la sesión principal.",
        ],
      },
      {
        heading: "Protege la sesión",
        paragraphs: [
          "Con poco tiempo, cada minuto cuenta. Fija una hora y un lugar, deja preparado el material la noche anterior y silencia el móvil. Vincular el estudio a un hábito existente, como el café de la mañana, ayuda a que se vuelva automático. Si un día no puedes hacer los 30 minutos, haz cinco: mantener la cadena importa más que la duración de un día concreto.",
        ],
      },
      {
        heading: "Un bloque largo a la semana, si puedes",
        paragraphs: [
          "Si alguna vez a la semana dispones de una o dos horas seguidas, úsalas para lo que no cabe en media hora: un ejercicio largo, el proyecto práctico o un repaso general. Esa combinación de sesiones diarias cortas y un bloque semanal largo es una de las más eficaces para quien tiene poco tiempo.",
        ],
        links: [{ href: "/guias/plan-de-estudio-semanal", label: "Cómo montar tu plan de estudio semanal" }],
      },
      {
        heading: "Sé realista con las expectativas",
        paragraphs: [
          "Con 30 minutos al día avanzarás más despacio que alguien que estudia a tiempo completo, y está bien. Mide el progreso por meses, no por días. Dentro de un trimestre, compara lo que sabes con lo que sabías: la diferencia suele sorprender.",
        ],
      },
      {
        heading: "Un ejemplo de semana con 30 minutos al día",
        paragraphs: [
          "Lunes, miércoles y viernes: contenido nuevo, con un fragmento del curso y su práctica. Martes y jueves: práctica sin vídeo nuevo, rehaciendo ejercicios o avanzando un pequeño proyecto. Sábado: repaso activo de toda la semana, intentando recordar sin mirar y respondiendo tus propias preguntas. Domingo: descanso o una sesión libre de algo que te apetezca del tema. Esta alternancia evita la sensación de ir siempre a remolque del curso y reserva tiempo para consolidar.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Merece la pena estudiar si solo tengo 15 minutos?",
        answer:
          "Sí. Quince minutos diarios son más de noventa horas al año. Son ideales para repasar vocabulario, hacer un ejercicio corto, ver un fragmento de curso o practicar un instrumento. Además, mantienen vivo el hábito, y el hábito es lo que permite aprovechar los días en que tienes más tiempo.",
      },
      {
        question: "¿Qué materias encajan mejor con sesiones cortas?",
        answer:
          "Las que se basan en práctica frecuente y repetición: idiomas, instrumentos musicales, vocabulario técnico, ejercicios de programación o de hoja de cálculo. Las que requieren mantener mucho contexto en la cabeza, como un proyecto complejo o un análisis largo, piden bloques más largos de vez en cuando.",
      },
      {
        question: "¿Cómo retomo tras varios días sin estudiar?",
        answer:
          "Sin culpa y sin intentar recuperar el tiempo perdido. Dedica la primera sesión a repasar tus apuntes y la última parte vista, y continúa desde ahí. Si pasaron varias semanas, repite el último bloque completo antes de avanzar. Lo importante es volver a la rutina cuanto antes.",
      },
      {
        question: "¿Puedo aprender con audio mientras hago otras cosas?",
        answer:
          "Para ciertas cosas, sí: escuchar pódcasts en el idioma que aprendes o repasar conceptos teóricos ya vistos. Para aprender contenido nuevo que requiere atención, o para practicar, no funciona bien. Úsalo como complemento de la sesión principal, no como sustituto.",
      },
      {
        question: "¿Cuánto tardaré en terminar un curso con 30 minutos al día?",
        answer:
          "Calcula la duración del vídeo multiplicada por 1,5 o 2 para incluir la práctica, y divide entre las horas semanales. Con media hora diaria tienes unas tres horas y media a la semana, así que un curso de diez horas te llevará entre cinco y seis semanas. Cada ficha del catálogo incluye un plan sugerido que puedes adaptar a este ritmo.",
      },
    ],
  },
  {
    slug: "como-elegir-un-curso-gratis-bueno",
    kind: "eleccion",
    shortTitle: "Elegir un curso bueno",
    title: "Cómo elegir un curso gratis bueno: checklist en 10 minutos",
    description:
      "Diez comprobaciones rápidas para decidir si un curso gratuito merece tus próximas semanas: temario, fecha, autor, nivel, práctica y señales de alarma.",
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["youtube-o-udemy-cursos-gratis", "seguir-un-curso-de-youtube-hasta-el-final", "errores-comunes-al-aprender-solo", "demostrar-lo-aprendido-sin-certificado"],
    intro:
      "Que un curso sea gratis no significa que no cueste nada: te va a costar tiempo, a menudo decenas de horas. Por eso merece la pena dedicar diez minutos a comprobar que es el adecuado antes de empezar. Esta guía reúne las comprobaciones que aplicamos al preparar las fichas del catálogo, para que puedas usarlas con cualquier curso, esté o no en nuestra web.",
    sections: [
      {
        heading: "1. ¿Es gratis de verdad?",
        paragraphs: [
          "Hay cursos completamente gratuitos, cursos con una parte gratis y otra de pago, pruebas gratuitas con fecha de caducidad y cursos gratis solo con un cupón temporal. Comprueba qué incluye exactamente la versión gratuita antes de empezar, para no descubrir a mitad de camino que el resto es de pago. En nuestro catálogo solo listamos cursos completos y gratuitos, y verificamos periódicamente que lo siguen siendo.",
        ],
        links: [{ href: "/como-verificamos", label: "Cómo verificamos los cursos" }],
      },
      {
        heading: "2. ¿El temario cubre lo que necesitas?",
        paragraphs: [
          "Lee el índice completo, no solo el título. Un curso llamado «completo» puede quedarse en lo básico, y uno modesto puede ser muy profundo. Busca los temas concretos que necesitas y comprueba cuánto tiempo dedica a cada uno. En YouTube, los capítulos de la descripción son el mejor indicador; en otras plataformas, el listado de secciones y lecciones.",
        ],
      },
      {
        heading: "3. ¿Es para tu nivel?",
        paragraphs: [
          "Un curso demasiado básico aburre; uno demasiado avanzado frustra. Busca a quién va dirigido y qué conocimientos da por sabidos. Si los primeros minutos usan términos que no conoces sin explicarlos, probablemente no es tu momento. Si repasan cosas que ya dominas durante horas, busca uno más avanzado o sáltate esa parte.",
        ],
      },
      {
        heading: "4. ¿Está actualizado para su tema?",
        paragraphs: [
          "La fecha importa según la materia. Los fundamentos de matemáticas, gramática o dibujo envejecen muy bien. Las herramientas de software, los frameworks o las plataformas de marketing cambian cada pocos años. Para estos temas, comprueba la versión que usa el curso y si hay cambios importantes desde entonces; los comentarios suelen avisar.",
        ],
      },
      {
        heading: "5. ¿Quién lo imparte?",
        paragraphs: [
          "Busca un autor identificable, con trayectoria en el tema o materiales que puedas revisar. En temas sensibles como salud, finanzas o derecho, esto es especialmente importante. Un canal educativo con muchos cursos coherentes suele ser una buena señal, aunque no una garantía.",
        ],
      },
      {
        heading: "6. ¿Te gusta cómo explica?",
        paragraphs: [
          "Mira diez minutos de un capítulo intermedio, no solo la introducción. ¿El ritmo te encaja? ¿Se oye y se ve bien? ¿Explica el porqué o solo el cómo? Vas a pasar muchas horas con esa voz; merece la pena que te guste.",
        ],
      },
      {
        heading: "7. ¿Hay práctica?",
        paragraphs: [
          "Los cursos que incluyen ejercicios, proyectos o materiales para practicar se aprovechan mucho mejor. Si no los tiene, no lo descartes, pero planifica tú la práctica.",
        ],
        links: [{ href: "/guias/proyectos-para-consolidar-lo-aprendido", label: "Ideas de proyectos para practicar" }],
      },
      {
        heading: "8. Señales de alarma",
        steps: [
          "Promesas de resultados garantizados, ingresos o empleo en poco tiempo.",
          "Un «curso gratis» que en realidad es una presentación para vender otro de pago.",
          "Ausencia total de temario o de información sobre el autor.",
          "Comentarios que avisan de partes rotas, desactualizadas o incompletas.",
          "Peticiones de datos personales o de pago para acceder a algo que se anuncia como gratis.",
        ],
      },
      {
        heading: "9 y 10. Duración realista y un plan",
        paragraphs: [
          "Calcula el tiempo real: la duración del vídeo multiplicada por 1,5 o 2 para incluir práctica y repaso. ¿Te cabe en las próximas semanas? Si no, elige uno más corto o divide el objetivo. Y antes de empezar, decide cuándo vas a estudiar: un curso elegido sin plan tiene muchas papeletas de quedarse a medias.",
          "Para ahorrarte parte de este trabajo, cada ficha de nuestro catálogo resume para quién es el curso, requisitos, estructura, puntos fuertes y débiles, un veredicto y un plan de estudio sugerido.",
        ],
        links: [{ href: "/guias/plan-de-estudio-semanal", label: "Cómo montar tu plan de estudio semanal" }],
      },
      {
        heading: "Cómo hacemos esta revisión en el catálogo",
        paragraphs: [
          "Para cada curso de YouTube, partimos de los datos que publica su autor: título, descripción, capítulos, duración y fecha. Con ellos elaboramos un análisis editorial que resume para quién es, qué requisitos tiene, cómo está estructurado, sus puntos fuertes y débiles y un plan de estudio. Ese análisis se redacta con ayuda de IA, con reglas estrictas para no afirmar nada que los datos no respalden, y se supervisa según el método que explicamos en la página de verificación.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Un curso con muchas visitas es un buen curso?",
        answer:
          "No necesariamente. Las visitas indican popularidad, que puede deberse a un buen título, a la fama del canal o a que el tema está de moda. Son una señal a tener en cuenta, pero no sustituyen a revisar el temario, la fecha, el nivel y la forma de explicar. Un curso con menos visitas puede ser más completo y más actual.",
      },
      {
        question: "¿Cómo sé si un curso de Udemy es realmente gratis?",
        answer:
          "En la propia página del curso debe aparecer como gratuito sin necesidad de introducir un cupón. Los cursos gratis con cupón lo son solo durante un tiempo limitado, y después pasan a ser de pago. En nuestro catálogo solo incluimos los que hemos comprobado como gratuitos sin cupón, y retiramos los que dejan de serlo.",
      },
      {
        question: "¿Qué hago si dudo entre dos cursos?",
        answer:
          "Mira diez minutos de un capítulo intermedio de cada uno y quédate con el que te resulte más claro. Si siguen empatados, elige el más reciente en temas que cambian rápido o el que tenga más práctica en temas estables. Lo peor es no decidir: cualquiera de los dos terminado vale más que los dos empezados.",
      },
      {
        question: "¿Cómo usáis el veredicto de las fichas?",
        answer:
          "El veredicto de cada ficha resume, a partir de la información publicada del curso (capítulos, duración, descripción y fecha), sus puntos fuertes y débiles y para quién encaja mejor. Es una ayuda para decidir, no una garantía de calidad: el mejor curso para ti depende de tu nivel, tu objetivo y tu forma de aprender.",
      },
    ],
  },
];
