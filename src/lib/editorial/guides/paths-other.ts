import type { Guide } from "./types";

/** Learning paths for design, marketing, languages, productivity, business, engineering and music (September 2026). */
export const OTHER_PATHS: Guide[] = [
  {
    slug: "ruta-diseno-ux-ui",
    kind: "ruta",
    shortTitle: "Diseño UX/UI",
    title: "Ruta de diseño UX/UI gratis: de los principios a un caso de estudio",
    description:
      "Cómo aprender diseño de interfaces y experiencia de usuario con cursos gratuitos: principios, Figma, investigación, prototipos y portfolio.",
    categorySlug: "design",
    courseMatch: {
      categories: ["design"],
      keywords: ["figma", "ux", "ui", "interfaz", "interfaces", "prototipo", "usabilidad", "diseño web", "experiencia de usuario", "wireframe"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["aprender-diseno-con-cursos-gratis", "ruta-desarrollo-frontend", "demostrar-lo-aprendido-sin-certificado", "proyectos-para-consolidar-lo-aprendido"],
    intro:
      "El diseño UX/UI une dos disciplinas: la experiencia de usuario (UX), que se ocupa de que un producto sea útil y fácil de usar, y el diseño de interfaz (UI), que se ocupa de cómo se ve y se comporta cada pantalla. Es un campo con mucha demanda y muchos cursos gratuitos, pero también con mucha confusión sobre qué hay que aprender. Esta ruta separa lo esencial de lo accesorio y termina donde termina cualquier proceso de selección en diseño: en un caso de estudio bien explicado.",
    sections: [
      {
        heading: "Qué se espera de un diseñador UX/UI",
        paragraphs: [
          "Más que dominar una herramienta, se espera que sepas resolver problemas: entender qué necesita una persona, proponer una solución, probarla y mejorarla. La herramienta (hoy, muy a menudo, Figma) es solo el medio. Por eso esta ruta empieza por principios y termina por procesos, y deja la herramienta en medio, cuando ya sabes qué quieres hacer con ella.",
        ],
      },
      {
        heading: "Etapa 1 — Principios visuales (3-4 semanas)",
        paragraphs: [
          "Jerarquía, contraste, alineación, proximidad, espaciado, color y tipografía. Estos principios explican por qué una pantalla se entiende de un vistazo y otra no. Aprende también la idea de sistema de espaciado y de retícula: la mayoría de interfaces bien resueltas usan unas pocas medidas repetidas con disciplina.",
          "Ejercicio clave de esta etapa: toma capturas de aplicaciones que uses a diario y analiza por escrito qué principios aplican y dónde fallan. Entrenar el ojo es la base de todo lo demás.",
        ],
        links: [{ href: "/guias/aprender-diseno-con-cursos-gratis", label: "Aprender diseño con cursos gratis: por dónde empezar" }],
      },
      {
        heading: "Etapa 2 — Figma a fondo (3-4 semanas)",
        paragraphs: [
          "Figma tiene un plan gratuito suficiente para aprender y construir un portfolio. Aprende marcos, auto layout, componentes y variantes, estilos y variables, y prototipado con transiciones. Un buen curso te hará construir una pequeña aplicación de varias pantallas con componentes reutilizables.",
          "Comprueba la fecha de los cursos: Figma añade y cambia funciones con frecuencia, y un curso de hace años puede mostrar menús que ya no existen.",
        ],
      },
      {
        heading: "Etapa 3 — Investigación y arquitectura de la información (4 semanas)",
        paragraphs: [
          "Aquí empieza la parte UX. Aprende a hacer entrevistas con usuarios sin sesgar las respuestas, a sintetizar lo aprendido en necesidades y problemas concretos, y a organizar el contenido de un producto: qué va en cada pantalla, cómo se navega, cómo se llaman las cosas. Técnicas como la ordenación de tarjetas o los mapas de recorrido del usuario se pueden practicar con amigos o familiares.",
        ],
      },
      {
        heading: "Etapa 4 — Prototipos y pruebas de usabilidad (3-4 semanas)",
        paragraphs: [
          "Diseña primero en baja fidelidad (bocetos, esquemas en gris) para probar ideas rápido, y solo después en alta fidelidad. Aprende a preparar una prueba de usabilidad: tareas concretas, observar sin ayudar, anotar dónde se atasca la gente. Cinco personas bastan para descubrir la mayoría de problemas graves de una interfaz.",
        ],
        steps: [
          "Elige una aplicación real con un problema evidente (reservas, trámites, compras).",
          "Entrevista a tres personas que la usen y resume sus problemas.",
          "Rediseña el flujo, pruébalo con cinco personas y documenta qué cambiaste tras la prueba.",
        ],
      },
      {
        heading: "Etapa 5 — Sistemas de diseño y accesibilidad",
        paragraphs: [
          "Los productos reales se diseñan con sistemas: bibliotecas de componentes, tokens de color y tipografía, y reglas de uso. Estudia sistemas de diseño públicos de grandes empresas; muchos están documentados en abierto y son una formación gratuita de primer nivel.",
          "La accesibilidad no es un extra: contraste suficiente, tamaños de toque adecuados, textos claros y compatibilidad con lectores de pantalla. Conocer las pautas de accesibilidad web te diferencia y mejora el diseño para todo el mundo.",
        ],
      },
      {
        heading: "El caso de estudio: tu mejor carta de presentación",
        paragraphs: [
          "Un portfolio de UX no es una galería de pantallas bonitas, sino dos o tres casos de estudio que cuentan un proceso: el problema, lo que investigaste, las alternativas que descartaste, lo que probaste y lo que aprendiste. Sé honesto con las limitaciones de un proyecto personal; demostrar criterio vale más que aparentar un encargo real.",
          "Si además aprendes algo de HTML y CSS, entenderás mejor las restricciones de quien construye tus diseños, algo que los equipos valoran mucho.",
        ],
        links: [
          { href: "/guias/demostrar-lo-aprendido-sin-certificado", label: "Cómo demostrar lo aprendido sin certificado" },
          { href: "/design", label: "Cursos de diseño del catálogo" },
        ],
      },
    ],
    faq: [
      {
        question: "¿UX y UI son lo mismo?",
        answer:
          "No, aunque suelen ir juntas. La experiencia de usuario (UX) se ocupa de que el producto resuelva bien un problema: investigación, estructura, flujos y pruebas con personas. El diseño de interfaz (UI) se ocupa de cómo se ve y se comporta cada pantalla: tipografía, color, componentes y estados. En empresas pequeñas es habitual que una misma persona haga ambas cosas; en las grandes, a menudo se separan en roles distintos.",
      },
      {
        question: "¿Necesito saber dibujar?",
        answer:
          "No. El diseño de interfaces se basa en componer elementos con criterio, no en ilustrar. Los bocetos a mano sirven para pensar rápido y pueden ser muy toscos. Lo que sí necesitas es entrenar el ojo para detectar problemas de jerarquía, alineación o legibilidad, y eso se consigue analizando y rehaciendo interfaces reales.",
      },
      {
        question: "¿Puedo aprender UX sin usuarios reales?",
        answer:
          "Puedes practicar las técnicas con personas de tu entorno: familiares, amigos o compañeros que usen el tipo de producto que estás rediseñando. No es lo mismo que investigar con usuarios de un producto real, y conviene decirlo con honestidad en tu caso de estudio, pero es suficiente para aprender a entrevistar, observar y sintetizar, que son las habilidades que importan.",
      },
      {
        question: "¿Qué pesa más en un proceso de selección, el portfolio o los cursos?",
        answer:
          "El portfolio, de forma muy clara. Quien revisa candidaturas de diseño quiere ver cómo piensas: cómo entiendes un problema, qué alternativas consideras y cómo justificas tus decisiones. Los cursos pueden aparecer en el currículum como complemento, pero dos o tres casos de estudio bien explicados suelen pesar mucho más que una lista de certificados.",
      },
    ],
  },
  {
    slug: "ruta-diseno-grafico",
    kind: "ruta",
    shortTitle: "Diseño gráfico",
    title: "Ruta de diseño gráfico con cursos gratis: fundamentos, herramientas y encargos",
    description:
      "Composición, color, tipografía, identidad visual y herramientas gratuitas o de pago: cómo avanzar en diseño gráfico sin pagar un curso.",
    categorySlug: "design",
    courseMatch: {
      categories: ["design"],
      keywords: ["photoshop", "illustrator", "canva", "gráfico", "logo", "tipografía", "inkscape", "gimp", "affinity", "branding", "identidad", "ilustración", "color"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["aprender-diseno-con-cursos-gratis", "ruta-diseno-ux-ui", "ruta-marketing-digital", "demostrar-lo-aprendido-sin-certificado"],
    intro:
      "El diseño gráfico comunica con imágenes y texto: carteles, logotipos, identidades de marca, publicaciones, envases o piezas para redes sociales. Es un oficio que combina teoría, herramienta y muchísima práctica. Los cursos gratuitos cubren muy bien las dos primeras; la tercera depende de ti. Esta ruta propone cómo repartir el esfuerzo para progresar de forma visible en unos meses.",
    sections: [
      {
        heading: "Etapa 1 — Fundamentos de composición (4 semanas)",
        paragraphs: [
          "Empieza por lo que no depende de ningún programa: jerarquía visual, equilibrio, contraste, ritmo, uso del espacio en blanco y retículas. Un buen curso de fundamentos te enseñará a mirar un cartel y explicar por qué funciona. Acompáñalo de análisis: elige cada semana tres diseños que te gusten y descompónlos en sus decisiones.",
        ],
      },
      {
        heading: "Etapa 2 — Tipografía y color (4 semanas)",
        paragraphs: [
          "La tipografía es, probablemente, la habilidad que más separa un diseño amateur de uno profesional. Aprende anatomía de las letras, clasificación, combinación de familias, interlineado, espaciado y jerarquía tipográfica. En color, aprende los modelos (RGB para pantalla, CMYK para impresión), la armonía, el contraste y cómo el color cambia según el contexto.",
          "Ejercicio: diseña la misma pieza, por ejemplo un cartel de un evento, solo con tipografía y en blanco y negro. Luego añade un único color. Verás cuánto se puede comunicar con muy poco.",
        ],
      },
      {
        heading: "Etapa 3 — Herramientas (6-8 semanas)",
        paragraphs: [
          "El diseño gráfico se apoya en tres tipos de herramienta: edición de imagen (fotografías y montajes), gráficos vectoriales (logotipos e ilustraciones que se escalan sin perder calidad) y maquetación (documentos de varias páginas). Existen programas profesionales de pago y alternativas gratuitas o de código abierto para cada tipo; con estas últimas se puede aprender perfectamente.",
          "Elige una herramienta de cada tipo y aprende sus funciones esenciales antes de las avanzadas. Las herramientas en línea basadas en plantillas son útiles para trabajos rápidos, pero no sustituyen a aprender a componer desde cero.",
        ],
      },
      {
        heading: "Etapa 4 — Identidad visual (4-6 semanas)",
        paragraphs: [
          "Una identidad visual es un sistema: logotipo, paleta, tipografías, estilo de imagen y reglas de uso aplicadas de forma coherente. Aprende el proceso completo: entender a quién se dirige la marca, investigar la competencia, bocetar a mano muchas ideas, refinar pocas y presentar la propuesta con aplicaciones reales (tarjetas, web, redes, señalética).",
        ],
        steps: [
          "Inventa un negocio pequeño con un público concreto (una panadería de barrio, un club de lectura).",
          "Diseña su identidad completa y un manual de uso de dos o tres páginas.",
          "Aplícala a cinco piezas distintas y explica cada decisión.",
        ],
      },
      {
        heading: "Etapa 5 — Producción e impresión",
        paragraphs: [
          "Un diseño que se ve bien en pantalla puede salir mal impreso. Aprende a preparar archivos: resolución, sangrado, márgenes de seguridad, perfiles de color y formatos de exportación. Para pantalla, aprende formatos y tamaños de las principales plataformas y cómo optimizar el peso de las imágenes.",
        ],
      },
      {
        heading: "Práctica y portfolio",
        paragraphs: [
          "Los diseñadores progresan con volumen de práctica y con crítica. Proponte retos semanales, participa en comunidades donde se comenta el trabajo y rehaz tus piezas antiguas cada cierto tiempo para ver tu evolución. Cuando tengas seis u ocho piezas sólidas y variadas, con al menos una identidad completa, tendrás un portfolio con el que buscar primeros encargos.",
        ],
        links: [
          { href: "/guias/demostrar-lo-aprendido-sin-certificado", label: "Cómo montar un portfolio que convenza" },
          { href: "/design", label: "Cursos de diseño del catálogo" },
        ],
      },
      {
        heading: "Errores habituales",
        steps: [
          "Aprender todas las funciones del programa antes de saber qué quieres diseñar.",
          "Usar muchas tipografías y colores en una misma pieza.",
          "Copiar tendencias sin entender por qué funcionan.",
          "No pedir opinión por miedo a la crítica: es la forma más rápida de mejorar.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Necesito programas de pago para aprender diseño gráfico?",
        answer:
          "No. Existen alternativas gratuitas o de código abierto para edición de imagen, gráficos vectoriales y maquetación con las que se puede aprender todo lo esencial y construir un portfolio. Si más adelante trabajas con agencias o imprentas que exigen un formato concreto, aprender el programa de pago correspondiente te resultará sencillo porque los conceptos son los mismos.",
      },
      {
        question: "¿Es mejor empezar por las herramientas o por la teoría?",
        answer:
          "Por la teoría, aplicada desde el primer día. Aprender composición, tipografía y color sin una herramienta es abstracto, pero aprender la herramienta sin estos fundamentos lleva a diseños técnicamente correctos y visualmente pobres. Lo ideal es combinar: estudia un principio y aplícalo enseguida en el programa que estés aprendiendo, aunque sea con ejercicios muy sencillos.",
      },
      {
        question: "¿Las plantillas son una trampa?",
        answer:
          "No son una trampa, pero tampoco una formación. Las plantillas son útiles para trabajos rápidos y para estudiar cómo están resueltas: qué tipografías combinan, cómo organizan el espacio. El problema aparece cuando solo sabes modificarlas. Para aprender, rehaz desde cero piezas que te gusten y diseña después las tuyas propias.",
      },
      {
        question: "¿Cómo consigo mis primeros encargos?",
        answer:
          "Con un portfolio pequeño pero sólido, y empezando por tu entorno: asociaciones, comercios de tu barrio, proyectos de amigos. Acuerda por escrito qué vas a entregar, cuántas revisiones incluye y en qué plazo, aunque sea un trabajo gratuito o muy barato. Esos primeros encargos te enseñan la parte del oficio que ningún curso cubre: entender a un cliente y gestionar sus cambios.",
      },
      {
        question: "¿Cuánto tiempo lleva tener un nivel aceptable?",
        answer:
          "Depende de la práctica más que de los cursos. Con varias horas de práctica semanal y crítica honesta de tu trabajo, en unos meses deberías notar un salto claro en tus piezas. Rehacer trabajos antiguos cada cierto tiempo es la mejor forma de medirlo: si ves los fallos de lo que hiciste hace tres meses, estás progresando.",
      },
    ],
  },
  {
    slug: "ruta-marketing-digital",
    kind: "ruta",
    shortTitle: "Marketing digital",
    title: "Ruta de marketing digital gratis: estrategia, SEO, redes, anuncios y analítica",
    description:
      "Cómo aprender marketing digital con cursos gratuitos siguiendo un orden lógico: primero estrategia y medición, después cada canal.",
    categorySlug: "marketing",
    courseMatch: {
      categories: ["marketing", "business"],
      keywords: ["seo", "marketing", "ads", "google ads", "redes sociales", "analytics", "email", "contenido", "copywriting", "publicidad", "ecommerce"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["ruta-emprender-y-negocios", "ruta-diseno-grafico", "proyectos-para-consolidar-lo-aprendido", "como-elegir-un-curso-gratis-bueno"],
    intro:
      "El marketing digital abarca muchos canales —buscadores, redes sociales, correo electrónico, publicidad de pago— y cada uno tiene sus propios cursos, herramientas y gurús. El error más común es empezar por la táctica de moda sin entender la estrategia que debería sostenerla. Esta ruta hace lo contrario: primero los fundamentos que no cambian, después la medición y, por último, los canales, uno a uno y con un proyecto real donde aplicarlos.",
    sections: [
      {
        heading: "Etapa 1 — Fundamentos de marketing (3 semanas)",
        paragraphs: [
          "Antes de lo digital, lo básico: a quién te diriges (segmentación y público objetivo), qué problema resuelves (propuesta de valor), cómo te diferencias de la competencia y cómo decide la gente comprar (el recorrido del cliente). Estos conceptos llevan décadas vigentes y dan sentido a todo lo demás.",
          "Ejercicio: escribe en una página la estrategia de un negocio que conozcas bien. Público, propuesta de valor, competidores y canales donde está su público.",
        ],
      },
      {
        heading: "Etapa 2 — Analítica y medición (3-4 semanas)",
        paragraphs: [
          "Sin medición, el marketing es opinión. Aprende qué son las métricas de adquisición, activación, conversión y retención, cómo se define un objetivo medible y cómo se configura una herramienta de analítica web. Aprende también a desconfiar de las métricas de vanidad: seguidores o visitas que no se traducen en resultados.",
          "Las grandes plataformas de analítica y publicidad ofrecen formación gratuita oficial, a menudo con certificados propios. Son un buen complemento, siempre que recuerdes que enseñan su herramienta, no necesariamente la mejor estrategia.",
        ],
      },
      {
        heading: "Etapa 3 — Contenidos y SEO (6 semanas)",
        paragraphs: [
          "El posicionamiento en buscadores (SEO) consiste en crear páginas útiles que respondan a lo que la gente busca y en facilitar que los buscadores las entiendan. Aprende investigación de palabras clave e intención de búsqueda, estructura de contenidos, SEO técnico básico (velocidad, indexación, enlaces internos) y cómo se obtienen enlaces de forma legítima.",
          "Es un canal lento: los resultados tardan meses. Por eso conviene aprenderlo con un proyecto propio, como un blog sobre un tema que domines, y medir su evolución desde el principio.",
        ],
      },
      {
        heading: "Etapa 4 — Redes sociales y email (4-6 semanas)",
        paragraphs: [
          "En redes sociales, aprende a elegir pocas plataformas según tu público, a planificar un calendario editorial y a analizar qué funciona. En email marketing, a construir una lista con permiso, segmentarla y escribir correos que la gente quiera abrir. El email es uno de los canales con mejor retorno y uno de los más infravalorados por quien empieza.",
        ],
      },
      {
        heading: "Etapa 5 — Publicidad de pago (4 semanas)",
        paragraphs: [
          "Aprende cómo funcionan las subastas publicitarias, la segmentación, las pujas y, sobre todo, cómo calcular si una campaña es rentable: coste por adquisición frente al valor de un cliente. Puedes aprender la teoría y la interfaz sin gastar, y si haces pruebas reales, empieza con presupuestos muy pequeños y objetivos claros.",
        ],
        steps: [
          "Define un objetivo medible antes de lanzar cualquier campaña.",
          "Prueba una sola variable cada vez: público, mensaje o creatividad.",
          "Detén lo que no funciona pronto y documenta por qué.",
        ],
      },
      {
        heading: "Etapa 6 — Un proyecto real",
        paragraphs: [
          "Nada sustituye a aplicar lo aprendido. Ofrécete a llevar el marketing de un pequeño negocio, una asociación o un proyecto personal durante tres meses. Define objetivos, elige dos canales, mide cada semana y escribe al final un informe con resultados y aprendizajes. Ese informe es tu mejor carta de presentación.",
        ],
        links: [
          { href: "/guias/proyectos-para-consolidar-lo-aprendido", label: "Más ideas de proyectos por materia" },
          { href: "/marketing", label: "Cursos de marketing del catálogo" },
        ],
      },
      {
        heading: "Cómo filtrar los cursos de marketing",
        steps: [
          "Desconfía de promesas de ingresos o de resultados garantizados.",
          "Prioriza cursos que expliquen el porqué y enseñen a medir.",
          "Comprueba la fecha: plataformas y algoritmos cambian constantemente.",
          "Separa la formación de una herramienta concreta de la formación en estrategia.",
        ],
      },
      {
        heading: "Un plan de seis meses orientativo",
        paragraphs: [
          "Con unas cinco horas semanales, una distribución razonable sería: el primer mes para fundamentos y el segundo para analítica, de forma que desde el principio sepas medir. El tercer y cuarto mes, contenidos y SEO, arrancando ya el blog o proyecto propio donde aplicarlo. El quinto, redes sociales y correo electrónico, y el sexto, publicidad de pago y el informe final del proyecto real. Si un canal no encaja con tu objetivo, sustitúyelo por más práctica en el que sí lo hace: profundidad en uno vale más que superficialidad en todos.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Sirven de algo las certificaciones gratuitas de las plataformas?",
        answer:
          "Pueden ayudar a estructurar el aprendizaje de una herramienta concreta y a demostrar que conoces su funcionamiento, y en algunas agencias se valoran. Pero enseñan a usar su plataforma, no necesariamente a decidir si es el canal adecuado para un negocio. Complementa siempre con formación en estrategia y, sobre todo, con resultados medidos en proyectos reales.",
      },
      {
        question: "¿Qué canal aprendo primero?",
        answer:
          "El que tenga más sentido para el tipo de proyecto que quieres llevar. Para negocios locales o de servicios, suele ser útil empezar por la presencia en buscadores y en mapas. Para productos visuales o de consumo, las redes sociales. Para cualquier negocio que quiera fidelizar, el correo electrónico. Domina un canal antes de abrir el siguiente.",
      },
      {
        question: "¿Necesito invertir dinero en anuncios para aprender?",
        answer:
          "No para aprender los conceptos ni la interfaz de las plataformas: puedes preparar campañas y estudiar su configuración sin lanzarlas. Para ver resultados reales sí hace falta un presupuesto, aunque sea pequeño. Si decides probar, fija un límite de gasto claro y un objetivo medible, y trátalo como un experimento, no como una inversión.",
      },
      {
        question: "¿Cómo sé si un curso de marketing está desactualizado?",
        answer:
          "Mira la fecha y fíjate en si muestra las interfaces actuales de las plataformas. Las tácticas concretas (formatos, funciones, reglas de los algoritmos) caducan rápido; los fundamentos (propuesta de valor, segmentación, medición) no. Un curso antiguo de fundamentos puede seguir siendo útil; uno antiguo de tácticas, probablemente no.",
      },
    ],
  },
  {
    slug: "ruta-ingles-desde-cero",
    kind: "ruta",
    shortTitle: "Inglés desde cero",
    title: "Ruta para aprender inglés gratis: de cero a un nivel intermedio",
    description:
      "Un plan por niveles, del A1 al B2, que combina cursos gratuitos con escucha diaria, vocabulario con repetición espaciada y conversación.",
    categorySlug: "languages",
    courseMatch: {
      categories: ["languages"],
      keywords: ["inglés", "english", "gramática", "pronunciación", "vocabulario", "listening", "speaking", "a1", "b1", "b2"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["aprender-idiomas-con-cursos-gratis", "tomar-apuntes-y-repasar", "aprender-con-poco-tiempo", "plan-de-estudio-semanal"],
    intro:
      "El inglés es el idioma que más gente quiere aprender, y también el que más recursos gratuitos tiene: cursos completos por niveles, canales de pronunciación, pódcasts para estudiantes, series y lecturas graduadas. Tanta oferta tiene un riesgo: picar de todo sin avanzar. Esta ruta organiza el aprendizaje por niveles del Marco Común Europeo de Referencia y propone una rutina diaria realista para cada etapa.",
    sections: [
      {
        heading: "Cuánto tiempo lleva",
        paragraphs: [
          "Las estimaciones más citadas hablan de varios cientos de horas de estudio guiado para pasar de cero a un nivel intermedio alto (B2), y el tiempo real depende mucho de la exposición al idioma fuera del estudio. Con una hora diaria entre curso, escucha y práctica, es razonable esperar avances claros en pocos meses y un nivel intermedio sólido en uno o dos años. Lo decisivo es la regularidad.",
        ],
      },
      {
        heading: "Nivel A1-A2: los cimientos",
        paragraphs: [
          "Busca un curso completo para principiantes que avance de forma ordenada: presentarte, hablar de tu rutina, del pasado y del futuro, pedir cosas y entender instrucciones sencillas. Presta mucha atención a la pronunciación desde el principio; corregir malos hábitos después cuesta mucho más.",
          "En esta etapa, el vocabulario es el cuello de botella. Aprende las palabras más frecuentes con tarjetas de memoria y repetición espaciada, siempre dentro de frases y no como listas sueltas.",
        ],
        steps: [
          "20-30 minutos de curso estructurado al día.",
          "10 minutos de vocabulario con repetición espaciada.",
          "10 minutos de escucha con materiales para estudiantes, con transcripción.",
        ],
        links: [{ href: "/guias/tomar-apuntes-y-repasar", label: "Cómo funciona la repetición espaciada" }],
      },
      {
        heading: "Nivel B1: independencia",
        paragraphs: [
          "En B1 ya puedes desenvolverte en situaciones cotidianas y el objetivo cambia: pasar de estudiar el idioma a usarlo. Mantén un curso de nivel intermedio para la gramática, pero aumenta mucho la exposición real: series con subtítulos en inglés, pódcasts sobre temas que te interesen y lecturas graduadas o artículos sencillos.",
          "Empieza a hablar con otras personas. Los intercambios de idiomas gratuitos, en persona o en línea, permiten practicar con nativos que a su vez aprenden español. Al principio da vértigo; a las pocas sesiones se convierte en la parte más útil de la rutina.",
        ],
      },
      {
        heading: "Nivel B2: fluidez y precisión",
        paragraphs: [
          "En B2 entiendes la idea principal de textos complejos y puedes mantener conversaciones con cierta fluidez. Aquí el progreso es más lento y menos visible, y hay que buscarlo activamente: consume contenido sin adaptar (noticias, charlas, series sin subtítulos), escribe con regularidad y pide correcciones, y trabaja expresiones y colocaciones, las combinaciones de palabras que suenan naturales.",
          "Si necesitas acreditar el nivel, prepara un examen oficial con sus modelos de prueba, que suelen estar disponibles gratis. Preparar un examen es una habilidad en sí misma; no la confundas con aprender el idioma.",
        ],
      },
      {
        heading: "Las cuatro destrezas, equilibradas",
        paragraphs: [
          "Comprensión oral, comprensión escrita, expresión oral y expresión escrita avanzan a ritmos distintos. Es habitual entender mucho más de lo que puedes decir. Reserva cada semana tiempo para las cuatro, con especial cuidado en hablar y escribir, que son las que más se evitan.",
        ],
        steps: [
          "Escuchar: algo cada día, aunque sea de fondo, y algo con atención plena varias veces por semana.",
          "Leer: textos por placer sobre temas que te gusten, sin traducir cada palabra.",
          "Hablar: en voz alta a diario, aunque sea solo; con personas, al menos una vez por semana.",
          "Escribir: un texto corto a la semana, corregido por alguien o comparado con modelos.",
        ],
      },
      {
        heading: "Cómo elegir cursos de inglés gratis",
        paragraphs: [
          "Elige por nivel y por objetivo. Un buen curso deja claro para qué nivel es, avanza de forma progresiva y combina explicación con práctica. Desconfía de las promesas de fluidez en semanas. En nuestras fichas verás el nivel estimado, la duración y un plan de estudio sugerido para encajar cada curso en tu rutina.",
        ],
        links: [
          { href: "/languages", label: "Cursos de idiomas del catálogo" },
          { href: "/guias/aprender-con-poco-tiempo", label: "Cómo aprender con 30 minutos al día" },
        ],
      },
      {
        heading: "Cómo medir tu progreso",
        paragraphs: [
          "El progreso en un idioma es lento y difícil de percibir semana a semana. Para verlo, grábate hablando dos minutos sobre un tema cotidiano al empezar y repite la grabación cada tres meses con el mismo tema. Guarda también un texto escrito de cada trimestre. Las pruebas de nivel gratuitas en línea dan una referencia orientativa, aunque no sustituyen a un examen oficial. Comparar tus propias grabaciones y textos suele ser la prueba más motivadora de que avanzas.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Puedo llegar a un buen nivel solo con cursos gratis?",
        answer:
          "Los cursos gratuitos cubren muy bien la gramática, el vocabulario y la pronunciación. Lo que no dan por sí solos es la práctica de conversación con otras personas ni la exposición masiva al idioma real, que son las que llevan a la fluidez. Combinados con escucha diaria y conversación, por ejemplo en intercambios de idiomas gratuitos, permiten alcanzar un nivel intermedio sólido sin pagar.",
      },
      {
        question: "¿Subtítulos en español o en inglés?",
        answer:
          "Depende del nivel. Al principio, los subtítulos en español te permiten seguir la historia, pero aprendes poco del idioma. En cuanto puedas, pasa a subtítulos en inglés: te ayudan a relacionar sonido y escritura. En niveles altos, prueba sin subtítulos con contenidos que ya conozcas. Lo importante es que el contenido te resulte comprensible en su mayor parte.",
      },
      {
        question: "¿Cuánto vocabulario necesito?",
        answer:
          "Unas pocas miles de palabras frecuentes bastan para entender la mayor parte de las conversaciones cotidianas. Por eso conviene priorizar el vocabulario de uso frecuente y aprenderlo en contexto, dentro de frases, con repetición espaciada. Memorizar listas largas de palabras poco usadas rinde muy poco en los primeros niveles.",
      },
      {
        question: "¿Qué hago si me da vergüenza hablar?",
        answer:
          "Es muy común. Empieza hablando solo: lee en voz alta, repite frases de audios y grábate. Después, prueba intercambios de idiomas en línea, donde la otra persona también está aprendiendo y entiende perfectamente la situación. Cometer errores es la forma normal de aprender a hablar; nadie espera perfección de alguien que está aprendiendo.",
      },
    ],
  },
  {
    slug: "ruta-productividad-y-ofimatica",
    kind: "ruta",
    shortTitle: "Productividad y ofimática",
    title: "Ruta de productividad y ofimática: Excel, documentos y organización personal",
    description:
      "Las herramientas que más horas ahorran en cualquier trabajo, en orden de impacto, y cómo aprenderlas con tus propios archivos.",
    categorySlug: "productivity",
    courseMatch: {
      categories: ["productivity", "business"],
      keywords: ["excel", "word", "powerpoint", "google sheets", "notion", "ofimática", "office", "hojas de cálculo", "tablas dinámicas", "macros", "productividad"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["ruta-analisis-de-datos", "plan-de-estudio-semanal", "aprender-con-poco-tiempo", "ruta-emprender-y-negocios"],
    intro:
      "Pocas inversiones de tiempo rinden tanto como dominar las herramientas con las que trabajas cada día. Una fórmula bien hecha puede ahorrar horas cada semana; una buena plantilla evita errores durante años. Esta ruta ordena las habilidades de productividad y ofimática según su impacto, y propone aprenderlas con tus propios archivos y tareas, que es la forma más rápida de que se queden.",
    sections: [
      {
        heading: "Empieza por un diagnóstico",
        paragraphs: [
          "Antes de elegir cursos, apunta durante una semana en qué tareas de ordenador pierdes más tiempo: copiar y pegar datos, rehacer informes, buscar archivos, dar formato a documentos. Esa lista es tu temario. Aprender en abstracto funciones que no vas a usar se olvida rápido; aprender la que resuelve tu problema de mañana se queda.",
        ],
      },
      {
        heading: "Etapa 1 — Hojas de cálculo esenciales (3-4 semanas)",
        paragraphs: [
          "Excel y Google Sheets comparten casi todo lo importante. Aprende referencias relativas y absolutas, funciones lógicas y condicionales, funciones de búsqueda, formato condicional, validación de datos y filtros. Con esto se resuelve la mayoría del trabajo diario.",
          "Comprueba qué versión usa cada curso: algunas funciones modernas solo existen en versiones recientes, y conviene saber si tendrás acceso a ellas en tu trabajo.",
        ],
      },
      {
        heading: "Etapa 2 — Hojas de cálculo avanzadas (4 semanas)",
        paragraphs: [
          "Tablas dinámicas para resumir miles de filas en segundos, gráficos claros, herramientas de importación y transformación de datos para automatizar la limpieza, y funciones de matriz dinámica. Las macros y la programación de scripts son el último paso: útiles, pero solo cuando lo anterior está dominado.",
        ],
        steps: [
          "Convierte un informe que haces a mano cada mes en una plantilla que se actualice sola.",
          "Construye un panel de una sola hoja con los cinco números que más te importan.",
        ],
        links: [{ href: "/guias/ruta-analisis-de-datos", label: "Si te engancha: ruta de análisis de datos" }],
      },
      {
        heading: "Etapa 3 — Documentos y presentaciones (2-3 semanas)",
        paragraphs: [
          "En documentos, aprende a usar estilos en lugar de formatear a mano: índices automáticos, numeración coherente y cambios de diseño en segundos. En presentaciones, aprende a construir diapositivas con una idea cada una, a usar patrones de diseño y a preparar el discurso, que importa más que las diapositivas.",
        ],
      },
      {
        heading: "Etapa 4 — Organización personal (2 semanas y práctica continua)",
        paragraphs: [
          "Las técnicas de gestión del tiempo y las herramientas de tareas y notas solo funcionan si las usas. Elige un método sencillo: una lista única de tareas, una revisión semanal y bloques de tiempo en el calendario para el trabajo que requiere concentración. Prueba durante un mes antes de cambiar de sistema o de aplicación.",
        ],
      },
      {
        heading: "Etapa 5 — Automatización sin programar",
        paragraphs: [
          "Muchas herramientas actuales permiten automatizar tareas repetitivas sin escribir código: reglas de correo, flujos entre aplicaciones, formularios que alimentan hojas de cálculo. Identifica una tarea que repitas cada semana y automatízala. Si te gusta la experiencia, un curso de introducción a la programación con Python abre muchas más posibilidades.",
        ],
        links: [{ href: "/guias/aprender-programacion-gratis-ruta-completa", label: "Ruta para aprender programación sin pagar" }],
      },
      {
        heading: "Consejos para aprender ofimática de verdad",
        steps: [
          "Sigue los cursos con el programa abierto y tus propios datos al lado.",
          "Crea un archivo de chuleta con las fórmulas y atajos que vas aprendiendo.",
          "Aprende los atajos de teclado de las cinco acciones que más repites.",
          "Enseña a un compañero lo que acabas de aprender: fija el conocimiento y te hace referente.",
        ],
      },
      {
        heading: "Cómo medir el tiempo que ahorras",
        paragraphs: [
          "La productividad se nota mejor cuando se mide. Antes de automatizar o mejorar una tarea, cronometra cuánto tardas en hacerla a mano y cuántas veces la repites al mes. Después de aplicar lo aprendido, vuelve a medir. Llevar esa cuenta en una hoja sencilla tiene dos ventajas: te motiva a seguir aprendiendo y te da argumentos concretos para proponer mejoras en tu equipo o para incluirlas en tu currículum.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Excel o Google Sheets?",
        answer:
          "Aprende el que uses o vayas a usar en tu trabajo. Comparten casi todas las funciones esenciales, y lo que aprendas en uno se traslada al otro con pocas diferencias. Excel tiene más peso en muchos entornos corporativos y algunas funciones avanzadas propias; Google Sheets destaca en colaboración en tiempo real y es gratuito con una cuenta. Si no tienes preferencia, cualquiera sirve para empezar.",
      },
      {
        question: "¿Merece la pena aprender macros?",
        answer:
          "Sí, pero en su momento. Las macros y los scripts automatizan tareas que repites mucho, y pueden ahorrar horas cada semana. Antes, domina funciones, tablas dinámicas y herramientas de transformación de datos: muchas automatizaciones que parecen requerir macros se resuelven con una buena fórmula o una consulta bien diseñada, de forma más sencilla y fácil de mantener.",
      },
      {
        question: "¿Qué método de organización personal recomiendas?",
        answer:
          "El más sencillo que vayas a mantener. Una lista única de tareas, una revisión semanal y bloques en el calendario para el trabajo que exige concentración resuelven la mayoría de necesidades. Los métodos más elaborados pueden funcionar bien, pero suelen abandonarse cuando el sistema da más trabajo que el que ahorra. Prueba un mes antes de cambiar.",
      },
      {
        question: "¿Cómo convenzo a mi empresa de usar lo que he aprendido?",
        answer:
          "Con resultados pequeños y visibles. Automatiza primero un informe o una tarea que te afecte solo a ti, mide el tiempo que ahorras y enséñalo. Documenta cómo funciona para que otros puedan usarlo. Las mejoras que se demuestran con un ejemplo concreto se adoptan mucho más fácilmente que las propuestas en abstracto.",
      },
      {
        question: "¿Sirven los cursos si uso una versión antigua del programa?",
        answer:
          "En general, sí: las funciones básicas llevan muchos años sin cambiar. Algunas funciones recientes, como las de matriz dinámica o las más modernas de búsqueda, solo existen en versiones actuales. Si tu versión no las tiene, busca en el curso o en la documentación las alternativas clásicas, que suelen existir aunque sean algo menos cómodas.",
      },
    ],
  },
  {
    slug: "ruta-emprender-y-negocios",
    kind: "ruta",
    shortTitle: "Emprender y negocios",
    title: "Ruta para emprender con cursos gratis: de la idea a los primeros clientes",
    description:
      "Validación, números básicos, ventas, marketing y gestión: qué aprender, en qué orden y cómo aplicarlo a un proyecto real sin arriesgar dinero.",
    categorySlug: "business",
    courseMatch: {
      categories: ["business", "marketing"],
      keywords: ["emprender", "emprendimiento", "negocio", "finanzas", "contabilidad", "ventas", "gestión", "proyectos", "startup", "liderazgo", "plan de negocio"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["ruta-marketing-digital", "ruta-productividad-y-ofimatica", "errores-comunes-al-aprender-solo", "proyectos-para-consolidar-lo-aprendido"],
    intro:
      "Emprender se aprende, en buena parte, emprendiendo. Pero hay conocimientos que ahorran errores caros: cómo comprobar que una idea interesa antes de invertir en ella, cómo leer los números de un negocio o cómo conseguir los primeros clientes. Los cursos gratuitos cubren bien esta base. Esta ruta la ordena alrededor de un proyecto propio, pequeño y de bajo riesgo, porque es la única forma de que lo aprendido se convierta en criterio.",
    sections: [
      {
        heading: "Un aviso importante",
        paragraphs: [
          "Los aspectos legales y fiscales de un negocio (formas jurídicas, impuestos, obligaciones laborales) dependen del país y cambian con frecuencia. Los cursos sirven para entender los conceptos, pero antes de tomar decisiones conviene contrastar con fuentes oficiales y, cuando haga falta, con un profesional. Esta guía se centra en lo que es común a cualquier lugar.",
        ],
      },
      {
        heading: "Etapa 1 — Validar antes de construir (3-4 semanas)",
        paragraphs: [
          "La causa más común del fracaso de un proyecto es construir algo que nadie necesita lo suficiente como para pagar por ello. Aprende a formular hipótesis sobre tu cliente y su problema, a entrevistar a clientes potenciales sin preguntar lo que quieres oír y a probar el interés con experimentos baratos: una página de presentación, una preventa o un servicio hecho a mano antes de automatizarlo.",
        ],
        steps: [
          "Escribe en una frase el problema que resuelves y para quién.",
          "Habla con diez personas que tengan ese problema, sin venderles nada.",
          "Diseña un experimento que te diga si pagarían, con un criterio de éxito fijado de antemano.",
        ],
      },
      {
        heading: "Etapa 2 — Los números del negocio (4 semanas)",
        paragraphs: [
          "No hace falta ser contable, pero sí entender ingresos, costes fijos y variables, margen, punto de equilibrio y flujo de caja. Muchos negocios rentables sobre el papel cierran por quedarse sin liquidez. Aprende a construir una previsión sencilla en una hoja de cálculo y a actualizarla con datos reales cada mes.",
        ],
        links: [{ href: "/guias/ruta-productividad-y-ofimatica", label: "Ruta de hojas de cálculo y productividad" }],
      },
      {
        heading: "Etapa 3 — Ventas (3-4 semanas)",
        paragraphs: [
          "Vender es ayudar a alguien a decidir si tu solución le conviene. Aprende a preparar una conversación de venta, a escuchar más que hablar, a responder objeciones y a fijar precios en función del valor que aportas y no solo de tus costes. Para muchos negocios pequeños, las primeras ventas llegan de la red de contactos y del trato directo, no de la publicidad.",
        ],
      },
      {
        heading: "Etapa 4 — Marketing para emprender (4 semanas)",
        paragraphs: [
          "Con clientes validados, el marketing consiste en encontrar a más personas como ellos. Elige uno o dos canales donde esté tu público y mide todo desde el principio. Nuestra ruta de marketing digital detalla cada canal; para empezar, basta con dominar uno.",
        ],
        links: [{ href: "/guias/ruta-marketing-digital", label: "Ruta de marketing digital" }],
      },
      {
        heading: "Etapa 5 — Gestión y organización",
        paragraphs: [
          "A medida que el proyecto crece, aparecen la gestión de proyectos, la delegación, la contratación y el liderazgo. Los cursos de gestión de proyectos y de habilidades directivas dan marcos útiles, como la priorización o la planificación por objetivos. Apréndelos cuando los necesites; estudiados demasiado pronto se olvidan.",
        ],
      },
      {
        heading: "Qué evitar",
        steps: [
          "Cursos que prometen ingresos pasivos o riqueza rápida: el negocio real es trabajo y paciencia.",
          "Invertir en producto, local o marca antes de validar que hay clientes.",
          "Mezclar las finanzas personales y las del proyecto.",
          "Tomar decisiones legales o fiscales solo con lo visto en un vídeo.",
        ],
      },
      {
        heading: "Aprender mientras construyes",
        paragraphs: [
          "La mejor forma de seguir esta ruta es con un proyecto real y pequeño en marcha desde la primera semana: un servicio que puedas ofrecer con lo que ya sabes, un producto sencillo o una idea que quieras validar. Cada etapa se aplica directamente sobre él. Dedica aproximadamente la mitad del tiempo a formarte y la otra mitad a hablar con clientes y probar cosas. Lleva un diario con las decisiones que tomas y sus resultados: en pocos meses será tu mejor material de aprendizaje.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Necesito un plan de negocio completo antes de empezar?",
        answer:
          "No al principio. Un plan de negocio extenso tiene sentido cuando necesitas financiación o socios, pero en la fase inicial es más útil un documento de una página con el problema, el cliente, la propuesta de valor, los canales y los números básicos, que vayas actualizando con lo que aprendes. Lo importante es validar las hipótesis, no escribirlas bonitas.",
      },
      {
        question: "¿Cuánto dinero necesito para empezar?",
        answer:
          "Depende por completo del tipo de negocio. Muchos servicios y productos digitales se pueden validar con muy poca inversión, y precisamente la etapa de validación busca comprobar si hay clientes antes de gastar. Desconfía de cualquier curso que te empuje a invertir mucho desde el principio o que prometa que no hace falta ninguna inversión para cualquier negocio.",
      },
      {
        question: "¿Los cursos de finanzas sirven para mi país?",
        answer:
          "Los conceptos financieros (margen, punto de equilibrio, flujo de caja, rentabilidad) son universales. Los aspectos legales y fiscales, en cambio, varían mucho entre países y cambian con frecuencia. Usa los cursos para entender el vocabulario y los conceptos, y contrasta cualquier decisión fiscal o legal con fuentes oficiales o con un profesional de tu país.",
      },
      {
        question: "¿Cómo sé si mi idea es buena?",
        answer:
          "No lo sabrás hasta que alguien pague por ella. Las opiniones de amigos y familiares, aunque bienintencionadas, no validan nada. Busca señales de compromiso real: personas que te dan su tiempo, se apuntan a una lista de espera o pagan por adelantado. Cuanto más cuesta la señal, más fiable es. Si no aparecen, ajusta la idea antes de invertir más.",
      },
      {
        question: "¿Qué habilidad es la más importante al empezar?",
        answer:
          "Vender, en un sentido amplio: entender a tus clientes, comunicar con claridad lo que ofreces y pedir la compra. Muchas personas que emprenden dedican meses al producto y muy poco a hablar con clientes. Aprender a tener esas conversaciones pronto ahorra mucho tiempo y dinero, y da la información que necesitas para mejorar el producto.",
      },
    ],
  },
  {
    slug: "ruta-cad-e-ingenieria",
    kind: "ruta",
    shortTitle: "CAD e ingeniería",
    title: "Ruta de CAD e ingeniería con cursos gratis: dibujo técnico, modelado 3D y fabricación",
    description:
      "Cómo aprender diseño asistido por ordenador desde cero: planos 2D, modelado paramétrico, ensamblajes, impresión 3D y electrónica básica.",
    categorySlug: "engineering",
    courseMatch: {
      categories: ["engineering"],
      keywords: ["autocad", "solidworks", "fusion", "cad", "3d", "revit", "freecad", "electrónica", "arduino", "impresión 3d", "planos", "modelado", "blender"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["proyectos-para-consolidar-lo-aprendido", "seguir-un-curso-de-youtube-hasta-el-final", "demostrar-lo-aprendido-sin-certificado"],
    intro:
      "El diseño asistido por ordenador (CAD) es la herramienta de trabajo de ingenieros, arquitectos, diseñadores de producto y aficionados a la fabricación digital. Es un campo muy práctico, que se aprende bien con cursos en vídeo siguiéndolos con el programa abierto. Esta ruta propone un camino desde el dibujo técnico básico hasta fabricar tus propias piezas, con especial atención a las licencias, porque muchos programas profesionales son de pago.",
    sections: [
      {
        heading: "Antes de empezar: el software y sus licencias",
        paragraphs: [
          "Muchos programas de CAD profesionales tienen licencias caras, pero varios ofrecen versiones gratuitas para uso personal, educativo o para estudiantes, y existen alternativas de código abierto completamente gratuitas. Antes de empezar un curso, comprueba que puedes usar legalmente el programa que enseña y en qué condiciones. Las condiciones cambian con el tiempo, así que consulta siempre la web oficial.",
          "Si no tienes claro cuál elegir, empieza por una herramienta gratuita: los conceptos de modelado paramétrico se transfieren entre programas.",
        ],
      },
      {
        heading: "Etapa 1 — Dibujo técnico y 2D (3-4 semanas)",
        paragraphs: [
          "El dibujo técnico es el idioma común de la ingeniería: vistas, cortes, escalas, acotación y tolerancias. Aprende a leer e interpretar planos antes de producirlos. Después, sigue un curso de CAD 2D que cubra las órdenes de dibujo y edición, capas, bloques, acotación y preparación de planos para imprimir.",
        ],
      },
      {
        heading: "Etapa 2 — Modelado 3D paramétrico (6-8 semanas)",
        paragraphs: [
          "El modelado paramétrico construye piezas a partir de bocetos con restricciones y operaciones (extrusión, revolución, vaciado, redondeos) que puedes modificar en cualquier momento. Es el corazón del diseño mecánico. Aprende a pensar en la intención de diseño: qué medidas deben mantenerse cuando cambie otra.",
          "Practica con objetos reales que tengas cerca: mide una pieza con un calibre o una regla y modélala. Es el ejercicio más útil de toda la ruta.",
        ],
        steps: [
          "Modela cinco objetos cotidianos de complejidad creciente.",
          "Genera el plano 2D de cada uno con vistas y cotas.",
          "Cambia una medida clave y comprueba que el modelo se actualiza sin romperse.",
        ],
      },
      {
        heading: "Etapa 3 — Ensamblajes y mecanismos (4 semanas)",
        paragraphs: [
          "Un ensamblaje une varias piezas con relaciones de posición y movimiento. Aprende a diseñar piezas que encajan, a comprobar interferencias y a simular mecanismos sencillos. Aquí aparecen las tolerancias de verdad: dos piezas con la misma medida nominal no siempre encajan una vez fabricadas.",
        ],
      },
      {
        heading: "Etapa 4 — Fabricación digital (4 semanas)",
        paragraphs: [
          "La impresión 3D permite comprobar tus diseños físicamente a bajo coste. Aprende a preparar modelos para imprimir: orientación, soportes, grosores mínimos y holguras. Si tienes acceso a un espacio de fabricación o un taller comunitario, prueba también el corte láser o el mecanizado. Muchos municipios y universidades tienen espacios así abiertos al público.",
        ],
      },
      {
        heading: "Etapa 5 — Electrónica básica (opcional)",
        paragraphs: [
          "Si te interesan los productos con componentes electrónicos, las placas de desarrollo de bajo coste y la programación de microcontroladores son una puerta de entrada excelente. Aprende electricidad básica, lectura de esquemas y seguridad antes de montar circuitos, y diseña carcasas para tus propios montajes con lo aprendido en las etapas anteriores.",
        ],
      },
      {
        heading: "Cómo demostrar lo aprendido",
        paragraphs: [
          "Un portfolio de CAD muestra piezas y ensamblajes con sus planos, renders y, si es posible, fotos del objeto fabricado. Explica el problema que resolvía cada diseño y las decisiones que tomaste. Algunos fabricantes de software ofrecen certificaciones oficiales de pago; pueden tener valor en ciertos sectores, pero un buen portfolio suele pesar tanto o más en una primera entrevista.",
        ],
        links: [
          { href: "/guias/demostrar-lo-aprendido-sin-certificado", label: "Cómo demostrar lo aprendido sin certificado" },
          { href: "/engineering", label: "Cursos de ingeniería y CAD del catálogo" },
        ],
      },
      {
        heading: "Cuánto tiempo lleva la ruta",
        paragraphs: [
          "Con unas cinco horas semanales, las etapas de dibujo 2D y modelado 3D ocupan los primeros tres o cuatro meses, y ensamblajes y fabricación digital otros dos o tres. La electrónica es un camino paralelo que puedes empezar cuando te apetezca. El ritmo real depende sobre todo de la práctica: modelar objetos reales de tu entorno cada semana acelera mucho más el aprendizaje que ver cursos seguidos. Guarda todos tus modelos, incluso los primeros, para ver tu evolución.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Qué programa de CAD aprendo primero?",
        answer:
          "Si tienes un objetivo concreto (una carrera, un sector, una empresa), aprende el programa que se use allí. Si no, empieza con una herramienta gratuita que te permita practicar sin limitaciones legales. Los conceptos de dibujo 2D, modelado paramétrico y ensamblajes se trasladan entre programas; cambiar de uno a otro cuesta semanas, no meses.",
      },
      {
        question: "¿Necesito un ordenador potente?",
        answer:
          "Para dibujo 2D y modelado de piezas sencillas basta un ordenador normal. Los ensamblajes grandes, las simulaciones y los renders sí piden más memoria y una tarjeta gráfica decente. Consulta los requisitos mínimos del programa antes de empezar; algunos funcionan en el navegador y trasladan parte del trabajo a la nube, lo que alivia al equipo local.",
      },
      {
        question: "¿Es imprescindible saber dibujo técnico?",
        answer:
          "Para trabajar profesionalmente, sí: los planos siguen siendo el documento que se entrega a fabricación y obra, y hay que saber leerlos y producirlos según normas. Para proyectos personales de impresión 3D puedes empezar directamente por el modelado 3D, pero aprender las bases de vistas, cortes y acotación te hará mejor diseñador en cualquier caso.",
      },
      {
        question: "¿Merece la pena comprar una impresora 3D para aprender?",
        answer:
          "No es imprescindible. Puedes aprender a modelar y preparar archivos para impresión sin tener una, y muchos espacios de fabricación comunitarios, bibliotecas o centros educativos ofrecen acceso a impresoras. Si decides comprar una, un modelo sencillo y bien documentado es suficiente para aprender; lo importante es entender el proceso, no la máquina.",
      },
      {
        question: "¿Cómo consigo experiencia práctica sin trabajo?",
        answer:
          "Diseña y fabrica soluciones para problemas reales de tu entorno: un soporte, una pieza de repuesto, una carcasa. Participa en proyectos colaborativos o comunidades de fabricación digital, y documenta cada proyecto con planos, modelos, fotos y explicación de las decisiones. Ese material es tu portfolio y la mejor prueba de tu capacidad.",
      },
    ],
  },
  {
    slug: "ruta-aprender-musica",
    kind: "ruta",
    shortTitle: "Música",
    title: "Ruta para aprender música con cursos gratis: instrumento, teoría y producción",
    description:
      "Cómo organizar el aprendizaje musical por tu cuenta: elegir instrumento, practicar con método, aprender teoría útil y dar el salto a la producción.",
    categorySlug: "music",
    courseMatch: {
      categories: ["music"],
      keywords: ["guitarra", "piano", "teoría", "producción", "ableton", "fl studio", "canto", "ritmo", "acordes", "solfeo", "ukelele", "batería"],
    },
    published: "2026-09-30",
    updated: "2026-09-30",
    related: ["aprender-con-poco-tiempo", "plan-de-estudio-semanal", "seguir-un-curso-de-youtube-hasta-el-final"],
    intro:
      "La música es de las disciplinas que mejor se aprenden con vídeo: puedes ver las manos del profesor, repetir un pasaje las veces que haga falta y ralentizarlo. Lo que el vídeo no hace por ti es la práctica diaria, que es donde de verdad se aprende. Esta ruta te ayuda a organizarla: cómo elegir instrumento y cursos, cómo practicar para progresar y cuándo añadir teoría y producción.",
    sections: [
      {
        heading: "Elegir instrumento",
        paragraphs: [
          "Elige el instrumento que te apetezca tocar, no el que parezca más fácil: la motivación es lo que te hará practicar. Guitarra y teclado son opciones habituales porque permiten acompañar canciones pronto y tienen muchísimo material gratuito. Un teclado sencillo o una guitarra de iniciación bastan para empezar; mejorar el instrumento tiene sentido cuando ya practicas con regularidad.",
        ],
      },
      {
        heading: "Etapa 1 — Los primeros tres meses",
        paragraphs: [
          "Sigue un curso completo para principiantes que avance de forma ordenada: postura, primeros acordes o escalas, ritmo básico y primeras canciones. Cuida la técnica desde el principio; los malos hábitos de postura se corrigen con mucho esfuerzo después y pueden causar molestias.",
          "El ritmo es la habilidad más infravalorada. Practica con metrónomo desde el primer día, empezando lento. Tocar despacio y a tiempo es mejor que rápido y desigual.",
        ],
        steps: [
          "15-30 minutos al día, mejor que dos horas el fin de semana.",
          "Calentamiento de 5 minutos, técnica 10 minutos, repertorio el resto.",
          "Una canción completa al mes, aunque sea sencilla.",
        ],
      },
      {
        heading: "Etapa 2 — Práctica deliberada",
        paragraphs: [
          "Tocar lo que ya sabes es agradable pero no te hace mejorar. La práctica deliberada consiste en aislar lo que te sale mal, practicarlo despacio hasta que salga bien y subir la velocidad poco a poco. Grábate de vez en cuando: escucharte desde fuera revela errores de ritmo y afinación que mientras tocas no percibes.",
        ],
      },
      {
        heading: "Etapa 3 — Teoría que sirve",
        paragraphs: [
          "La teoría musical explica por qué suena bien lo que suena bien. Aprende notas y escalas, intervalos, cómo se forman los acordes, las progresiones más comunes y lectura básica de partitura o tablatura según tu instrumento. Apréndela aplicada: cada concepto nuevo, tócalo en tu instrumento ese mismo día.",
          "Entrenar el oído (reconocer intervalos, acordes y progresiones) acelera muchísimo el aprendizaje de canciones y la improvisación. Hay aplicaciones y ejercicios gratuitos para practicar unos minutos al día.",
        ],
      },
      {
        heading: "Etapa 4 — Producción musical",
        paragraphs: [
          "Si te interesa grabar o componer, la producción musical es un mundo en sí mismo. Elige un programa de producción (existen opciones gratuitas y versiones de prueba o reducidas de los de pago) y quédate con él. Aprende grabación, edición, instrumentos virtuales, mezcla básica y exportación. Comprueba que el curso usa el mismo programa que tú: la forma de trabajar cambia mucho entre ellos.",
        ],
        steps: [
          "Recrea una canción que te guste para entender su estructura y arreglos.",
          "Compón una pieza corta completa, de principio a fin, antes de perfeccionar ninguna.",
          "Escucha tu mezcla en varios altavoces y auriculares antes de darla por buena.",
        ],
      },
      {
        heading: "Mantener la motivación",
        paragraphs: [
          "Tocar con otras personas es el mejor motor: una banda de amigos, un coro, una comunidad en línea donde compartir grabaciones. Fija metas concretas y cercanas (tocar una canción para alguien, grabar una versión) y celebra cuando las cumplas. Y acepta las mesetas: todo músico pasa por semanas en las que parece no avanzar, justo antes de dar un salto.",
        ],
        links: [
          { href: "/guias/aprender-con-poco-tiempo", label: "Cómo aprender con poco tiempo al día" },
          { href: "/music", label: "Cursos de música del catálogo" },
        ],
      },
      {
        heading: "Cómo usar los cursos del catálogo",
        paragraphs: [
          "Combina un curso principal de instrumento, que seguirás durante meses, con recursos cortos para necesidades concretas: una técnica, una canción, un concepto de teoría. En las fichas del catálogo verás el nivel estimado, la estructura del curso y un plan de estudio sugerido, que te ayudan a elegir un curso principal adecuado a tu punto de partida. Cuando termines uno, no busques inmediatamente otro: dedica unas semanas a consolidar repertorio y a tocar lo aprendido.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Se puede aprender un instrumento solo con vídeos?",
        answer:
          "Se puede llegar muy lejos, sobre todo en los primeros años. El vídeo permite ver la técnica de cerca, repetir y ralentizar. Su principal limitación es que nadie corrige tu postura ni tus vicios. Grabarte para compararte con el profesor y pedir opinión en comunidades ayuda mucho; si puedes, alguna clase presencial puntual para revisar la técnica es una buena inversión.",
      },
      {
        question: "¿Cuánto tengo que practicar al día?",
        answer:
          "Más importante que la cantidad es la regularidad. Quince o veinte minutos diarios de práctica concentrada dan mejores resultados que dos horas un día a la semana, porque la memoria muscular se consolida con la repetición frecuente. Si tienes más tiempo, divídelo en varias sesiones cortas y dedica parte a lo que te sale mal, no solo a lo que ya sabes tocar.",
      },
      {
        question: "¿Necesito aprender a leer partituras?",
        answer:
          "Depende del instrumento y del estilo. En guitarra popular es habitual usar tablaturas y cifrado de acordes; en piano clásico o para tocar en agrupaciones, leer partitura es casi imprescindible. En cualquier caso, conocer las bases de la lectura musical facilita entender la teoría y comunicarte con otros músicos.",
      },
      {
        question: "¿Qué programa de producción musical elijo?",
        answer:
          "Si ya conoces a alguien que produce música, usar su mismo programa te facilitará aprender y pedir ayuda. Si no, empieza con una opción gratuita o una versión reducida de uno comercial. Todos comparten los conceptos principales (pistas, instrumentos virtuales, efectos, mezcla), y lo que aprendas se traslada. Elige uno y quédate con él al menos un año.",
      },
      {
        question: "¿Qué hago cuando siento que no avanzo?",
        answer:
          "Las mesetas son normales en música. Cambia algo en tu práctica: prueba un estilo distinto, aprende una canción ligeramente por encima de tu nivel, practica con metrónomo más lento o toca con otras personas. Revisar grabaciones antiguas también ayuda: suele demostrar que has avanzado más de lo que crees.",
      },
    ],
  },
];
