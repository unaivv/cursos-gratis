/**
 * Editorial copy for each category page: what the subject is, what a
 * free course can and can't give you, and how to choose. Written once by
 * hand — it's the part of the category page that isn't a list of links.
 * Keyed by category slug (content/categories.json). A category without an
 * entry simply renders no editorial block.
 */
export type CategoryEditorial = {
  intro: string[];
  tips: string[];
};

export const CATEGORY_EDITORIAL: Record<string, CategoryEditorial> = {
  programming: {
    intro: [
      "Programar es de las habilidades que más cómodamente se aprenden gratis: la documentación es abierta, las herramientas son gratuitas y hay decenas de cursos completos en YouTube y Udemy. La dificultad no es encontrar material, sino elegir un camino y no saltar de uno a otro cada semana.",
      "Aquí reunimos cursos de lenguajes (Python, JavaScript, Java y más), desarrollo web, bases de datos y herramientas como Git. Casi todos son cursos largos en vídeo: sirven para arrancar y entender los fundamentos, y funcionan mejor cuando se acompañan de proyectos propios.",
    ],
    tips: [
      "Elige un solo lenguaje y llega hasta el final antes de probar otro: los conceptos (variables, funciones, bucles, estructuras de datos) se transfieren.",
      "Escribe el código a la vez que ves el vídeo. Copiar el resultado sin teclearlo da una falsa sensación de haber aprendido.",
      "Comprueba la fecha de publicación: en desarrollo web, un curso de hace muchos años puede usar versiones y prácticas ya superadas.",
      "Cuando termines, construye algo pequeño que no salga en el curso. Ahí es donde de verdad aparecen los huecos.",
    ],
  },
  "data-ai": {
    intro: [
      "Datos e inteligencia artificial abarca desde analizar una hoja de cálculo hasta entrenar modelos de aprendizaje automático. Es un campo con mucha base matemática y estadística, pero la entrada práctica —manejar datos con Python o SQL, visualizarlos y sacar conclusiones— es accesible sin coste.",
      "En esta categoría encontrarás cursos de análisis de datos, estadística aplicada, aprendizaje automático e IA generativa. Conviene distinguir los cursos de fundamentos, que envejecen bien, de los de herramientas concretas de IA, que cambian en meses.",
    ],
    tips: [
      "Empieza por manejar datos (Python con pandas, o SQL) antes de saltar a modelos: la mayor parte del trabajo real es limpiar y entender datos.",
      "Refuerza los fundamentos de estadística: saber qué significa una media, una desviación o una correlación evita conclusiones equivocadas.",
      "En cursos de IA, fíjate en si explican cómo funciona el modelo o solo cómo usar una herramienta; ambos son útiles, pero envejecen a ritmos muy distintos.",
      "Practica con conjuntos de datos públicos y documenta lo que haces: un cuaderno bien explicado vale más que un certificado.",
    ],
  },
  design: {
    intro: [
      "El diseño se aprende mirando, imitando y rehaciendo. Los cursos gratuitos cubren bien las herramientas —Figma, Photoshop, Illustrator o Canva— y los principios de composición, color y tipografía que las hacen útiles.",
      "Aquí hay cursos de diseño gráfico, diseño de interfaces (UI/UX), edición de imagen y herramientas de creación. Un curso te enseña dónde está cada botón; el criterio visual se gana practicando y comparando tu trabajo con el de otros.",
    ],
    tips: [
      "Aprende primero los principios (jerarquía, contraste, alineación, espaciado) y después la herramienta; las herramientas cambian, los principios no.",
      "Rehacer una pantalla o un cartel que te guste, paso a paso, enseña más que diseñar desde una página en blanco.",
      "Comprueba que el curso usa una versión reciente del programa: las interfaces de Figma o Adobe cambian con frecuencia.",
      "Guarda cada ejercicio en un portfolio, aunque sea sencillo. Es lo que se enseña a quien contrata.",
    ],
  },
  marketing: {
    intro: [
      "El marketing digital mezcla técnica (analítica, SEO, campañas de pago) y criterio (a quién le hablas y qué le ofreces). Es un terreno donde los cursos gratuitos son especialmente útiles para entender los conceptos, aunque las plataformas cambian sus reglas y su interfaz a menudo.",
      "Reunimos cursos de SEO, redes sociales, publicidad online, email marketing y analítica. Prioriza los que explican el porqué de cada táctica: una táctica aislada caduca, el razonamiento detrás sigue siendo válido.",
    ],
    tips: [
      "Desconfía de los cursos que prometen resultados rápidos o cifras concretas de ingresos: el marketing depende del producto y del mercado.",
      "Aplica lo aprendido a un proyecto real, aunque sea un blog o un perfil propio; medir resultados es lo que consolida el aprendizaje.",
      "Mira la fecha: algoritmos y formatos de publicidad cambian, y los cursos de hace varios años pueden quedarse obsoletos.",
      "Aprende a leer datos básicos (visitas, conversión, coste por resultado) antes de tocar ninguna herramienta avanzada.",
    ],
  },
  languages: {
    intro: [
      "Aprender un idioma es una carrera de fondo, y un curso gratuito es un buen punto de partida, no la meta. Los vídeos y las clases sirven para gramática, vocabulario y pronunciación; la fluencia llega con horas de escucha y de práctica real.",
      "En esta categoría hay cursos de inglés y de otras lenguas, desde nivel principiante. Elige por nivel y por objetivo (viajar, trabajar, examinarte), y combina el curso con exposición diaria al idioma: series, podcasts, lectura o conversación.",
    ],
    tips: [
      "Constancia antes que intensidad: 20-30 minutos al día rinden más que una tarde larga a la semana.",
      "Añade escucha activa: un curso te da estructura, pero el oído se entrena con audios reales y a velocidad natural.",
      "Habla en voz alta desde el primer día, aunque estés solo. Pronunciar es una habilidad motriz que solo mejora practicándola.",
      "Fíjate en el nivel (A1, A2, B1…) y no saltes de nivel sin dominar el anterior.",
    ],
  },
  business: {
    intro: [
      "Negocios agrupa lo necesario para montar, gestionar y hacer crecer un proyecto: finanzas básicas, estrategia, ventas, liderazgo y emprendimiento. Los cursos gratuitos dan el vocabulario y los marcos de trabajo; la experiencia se gana ejecutando.",
      "Encontrarás desde introducciones a contabilidad y finanzas personales hasta cursos de gestión de proyectos o de creación de una empresa. Ten en cuenta que la normativa fiscal y mercantil depende de cada país, así que los cursos son orientativos, no asesoramiento.",
    ],
    tips: [
      "Distingue teoría general (válida en cualquier país) de normativa local (impuestos, autónomos, sociedades): la segunda hay que contrastarla con fuentes oficiales.",
      "Aplica cada concepto a un caso real o a tu propio proyecto: un plan de negocio sobre el papel enseña más que cinco vídeos seguidos.",
      "Busca cursos que expliquen números (márgenes, costes, punto de equilibrio); son la base de cualquier decisión.",
      "Desconfía de las promesas de ingresos rápidos o de fórmulas mágicas de ventas.",
    ],
  },
  productivity: {
    intro: [
      "Productividad es, en la práctica, dominar las herramientas de trabajo diarias —hojas de cálculo, procesadores de texto, gestores de tareas— y tener un método para organizar tu tiempo. Es una de las áreas con mejor retorno por hora de estudio.",
      "Aquí hay cursos de Excel y Google Sheets, herramientas de ofimática, gestión del tiempo y organización personal. Los de herramientas se aprovechan mucho si los sigues con tus propios archivos de trabajo delante.",
    ],
    tips: [
      "Aprende con datos y tareas reales tuyas: adaptar una plantilla a tu caso enseña más que reproducir ejemplos ajenos.",
      "En Excel, prioriza funciones de uso diario (BUSCARV/XLOOKUP, tablas dinámicas, formato condicional) antes de macros.",
      "Un método sencillo que sigas de verdad supera a un sistema complejo que abandones en dos semanas.",
      "Comprueba que el curso usa tu versión del programa; algunas funciones solo existen en las más recientes.",
    ],
  },
  wellness: {
    intro: [
      "Bienestar reúne cursos sobre hábitos, movimiento, relajación, alimentación y salud emocional. Pueden ser una buena forma de introducirte en rutinas como el yoga, la meditación o el ejercicio en casa.",
      "Un curso en vídeo no sustituye a un profesional sanitario. Si tienes una lesión, una condición médica o dudas sobre tu salud, consulta antes con un médico, fisioterapeuta o psicólogo; usa estos cursos como apoyo, no como diagnóstico ni tratamiento.",
    ],
    tips: [
      "Comprueba quién imparte el curso y qué formación tiene, sobre todo en temas de salud y nutrición.",
      "Empieza suave y aumenta progresivamente; en ejercicio y relajación, la regularidad importa más que la intensidad.",
      "Desconfía de las promesas de resultados garantizados o de soluciones milagro.",
      "Ante dolor, mareo o malestar durante una práctica, para y consulta con un profesional.",
    ],
  },
  music: {
    intro: [
      "La música se aprende escuchando y tocando, y los cursos gratuitos en vídeo son un recurso excelente para empezar: guitarra, piano, teoría musical, producción y canto tienen tutoriales completos de calidad.",
      "Nuestra selección va de cursos de instrumento para principiantes a teoría y producción con software. Lo ideal es alternar el vídeo con práctica diaria, aunque sean 15 minutos: el oído y las manos se entrenan con repetición.",
    ],
    tips: [
      "Practica cada día un poco en lugar de mucho un día: la memoria muscular se consolida con repetición.",
      "Aprende teoría a la vez que tocas; entender por qué suenan bien unos acordes hace que se te queden.",
      "Grábate de vez en cuando: escucharte es la forma más rápida de detectar errores de ritmo o afinación.",
      "Para producción musical, comprueba que el curso usa el mismo programa (DAW) que vas a utilizar.",
    ],
  },
  crafts: {
    intro: [
      "Manualidades y hobbies son cursos para aprender con las manos: costura, tejido, cerámica, dibujo, fotografía, cocina creativa o bricolaje. Es un terreno donde el vídeo brilla, porque permite ver la técnica y repetirla a tu ritmo.",
      "La mayoría se pueden seguir con materiales básicos y baratos. Empieza por proyectos pequeños que puedas terminar rápido; ver un resultado acabado motiva mucho más que un proyecto enorme a medias.",
    ],
    tips: [
      "Revisa la lista de materiales antes de empezar para no comprar de más; muchas técnicas se aprenden con material sencillo.",
      "Pausa y repite el vídeo tantas veces como haga falta; es una ventaja frente a una clase presencial.",
      "Empieza por proyectos pequeños y termínalos: la constancia se construye con pequeñas victorias.",
      "Comparte tu trabajo en comunidades del hobby para recibir consejos y mantener la motivación.",
    ],
  },
  engineering: {
    intro: [
      "Ingeniería y CAD cubre diseño técnico y modelado: AutoCAD, SolidWorks, Fusion 360, electrónica, mecánica o impresión 3D. Son áreas muy prácticas, donde seguir un curso con el programa abierto es la forma natural de aprender.",
      "Muchos de estos programas tienen versiones gratuitas o educativas, y los cursos de esta categoría suelen partir de cero. Comprueba qué versión del software usa cada curso, porque la interfaz y las funciones cambian entre ediciones.",
    ],
    tips: [
      "Confirma que puedes usar legalmente el software del curso (versión gratuita, educativa o de prueba) antes de empezar.",
      "Aprende a modelar piezas sencillas y reales, como un soporte o una carcasa; es más motivador que ejercicios abstractos.",
      "Practica la lectura de planos y acotación: es la base común a todos los programas de CAD.",
      "Si el curso usa una versión antigua del programa, busca la equivalencia de los menús en la tuya.",
    ],
  },
  education: {
    intro: [
      "Educación reúne cursos sobre cómo enseñar y cómo aprender: metodologías docentes, recursos para el aula, herramientas digitales y técnicas de estudio. Es útil tanto para profesores como para cualquiera que quiera estudiar de forma más eficaz.",
      "Verás cursos de pedagogía, tecnología educativa y técnicas de aprendizaje. Ten en cuenta que los currículos y normativas educativas varían por país y comunidad, así que conviene contrastar lo aplicable con las fuentes oficiales de tu entorno.",
    ],
    tips: [
      "Distingue los cursos de método general (aplicables en cualquier contexto) de los de normativa local, que hay que verificar con fuentes oficiales.",
      "Prueba una técnica cada vez (repaso espaciado, práctica activa, mapas conceptuales) y evalúa si te funciona antes de añadir otra.",
      "Los cursos sobre herramientas digitales envejecen rápido: comprueba la fecha y la versión.",
      "Aplica lo que aprendes en una clase o sesión de estudio real cuanto antes.",
    ],
  },
};
