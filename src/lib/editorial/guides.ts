/**
 * Long-form guides (/guias). Deliberately generic about *which* courses
 * to take — the live course list for a guide's category is rendered from
 * the database next to the text, so the advice never goes stale when the
 * catalog changes.
 */
export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  steps?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  /** When set, the guide page lists this category's courses under the text. */
  categorySlug?: string;
  /** ISO date of the last substantive edit. */
  updated: string;
  intro: string;
  sections: GuideSection[];
};

export const GUIDES: Guide[] = [
  {
    slug: "aprender-programacion-desde-cero",
    title: "Cómo aprender programación desde cero con cursos gratis",
    description:
      "Un camino en cuatro etapas para pasar de no saber nada a construir tus primeros proyectos usando solo cursos gratuitos de YouTube y Udemy.",
    categorySlug: "programming",
    updated: "2026-09-21",
    intro:
      "Hay tanto material gratuito para aprender a programar que el problema real es otro: elegir un camino y sostenerlo. Esta guía propone un orden razonable, qué esperar de cada etapa y cómo evitar los errores más comunes de quien empieza.",
    sections: [
      {
        heading: "Etapa 1 — Elige un objetivo y un lenguaje",
        paragraphs: [
          "Antes de abrir ningún vídeo, decide qué quieres construir. Si te atrae la web, el camino natural es HTML, CSS y JavaScript. Si te interesan los datos, la automatización o simplemente una primera toma de contacto suave, Python es una opción muy habitual por su sintaxis legible.",
          "No hay un lenguaje perfecto. Lo importante es elegir uno y terminarlo: variables, condicionales, bucles, funciones y estructuras de datos son conceptos que se trasladan a cualquier otro lenguaje que aprendas después.",
        ],
      },
      {
        heading: "Etapa 2 — Un curso completo de fundamentos",
        paragraphs: [
          "Busca un curso largo pensado para principiantes absolutos, que empiece por instalar las herramientas y avance de forma gradual. Los cursos en vídeo de varias horas son una buena opción porque mantienen un hilo continuo, a diferencia de los tutoriales sueltos.",
          "Mientras lo sigues, aplica esta regla: no avances a la siguiente lección sin haber tecleado tú mismo el código de la anterior y haberlo modificado para ver qué pasa.",
        ],
        steps: [
          "Comprueba la fecha de publicación: en desarrollo web, un curso muy antiguo puede enseñar prácticas obsoletas.",
          "Mira si incluye ejercicios o proyectos; un curso solo de teoría se olvida rápido.",
          "Si te pierdes en una lección, repítela una vez y busca una explicación alternativa antes de abandonar.",
        ],
      },
      {
        heading: "Etapa 3 — Herramientas del oficio",
        paragraphs: [
          "Cuando tengas los fundamentos, aprende Git y GitHub para guardar y compartir tu código, y familiarízate con la terminal y con un editor como Visual Studio Code. Son habilidades transversales que aparecen en cualquier trabajo de desarrollo.",
          "En esta etapa también conviene aprender a leer documentación oficial y mensajes de error. Saber buscar la respuesta es tan importante como conocerla.",
        ],
      },
      {
        heading: "Etapa 4 — Proyectos propios",
        paragraphs: [
          "Aquí es donde se aprende de verdad. Construye algo pequeño que no salga en ningún curso: una lista de tareas, un conversor, una web personal, un script que automatice algo de tu día a día. Se te romperá, y arreglarlo te enseñará más que diez vídeos.",
          "Sube tus proyectos a GitHub con una descripción clara. Un puñado de proyectos pequeños y terminados dice más de ti que una lista de cursos vistos.",
        ],
      },
      {
        heading: "Errores comunes al empezar",
        steps: [
          "Saltar de curso en curso sin terminar ninguno (el llamado «infierno de tutoriales»).",
          "Ver los vídeos sin programar a la vez.",
          "Querer aprender tres lenguajes al mismo tiempo.",
          "Comparar tu ritmo con el de otros: cada persona tarda lo que tarda.",
        ],
      },
    ],
  },
  {
    slug: "empezar-en-datos-e-inteligencia-artificial",
    title: "Cómo empezar en datos e inteligencia artificial con cursos gratis",
    description:
      "Qué aprender primero, en qué orden y cómo practicar si quieres entrar en el análisis de datos o el aprendizaje automático sin gastar dinero.",
    categorySlug: "data-ai",
    updated: "2026-09-21",
    intro:
      "El campo de los datos y la IA impone respeto, pero la puerta de entrada es más amable de lo que parece. Esta guía ordena los pasos para avanzar sin perderte entre herramientas y modas.",
    sections: [
      {
        heading: "Empieza por los datos, no por los modelos",
        paragraphs: [
          "La mayor parte del trabajo real con datos consiste en obtenerlos, limpiarlos, entenderlos y contar lo que dicen. Los modelos de aprendizaje automático vienen después. Aprender a manejar datos primero te dará una base sólida y resultados útiles desde el principio.",
          "Dos habilidades concentran la mayor parte del valor inicial: SQL para consultar bases de datos, y Python con librerías de análisis como pandas para trabajar con tablas.",
        ],
      },
      {
        heading: "Estadística básica: el idioma común",
        paragraphs: [
          "Media, mediana, desviación típica, correlación, distribuciones y nociones de probabilidad. No necesitas un máster, pero sí entender qué significa cada número para no sacar conclusiones erróneas. Un buen curso de estadística aplicada, con ejemplos, cuenta como una inversión de tiempo con retorno alto.",
        ],
      },
      {
        heading: "Visualización y comunicación",
        paragraphs: [
          "Un análisis que nadie entiende no sirve. Aprende a hacer gráficos claros y a explicar una conclusión en pocas frases. Herramientas de hoja de cálculo, Python o software de paneles son suficientes para empezar; el criterio importa más que la herramienta.",
        ],
      },
      {
        heading: "Aprendizaje automático e IA generativa",
        paragraphs: [
          "Cuando manejes datos con soltura, tiene sentido pasar a los modelos: regresión, clasificación, evaluación de resultados y los riesgos de sobreajustar. Los cursos de fundamentos envejecen bien porque los conceptos cambian poco.",
          "Los cursos sobre herramientas concretas de IA generativa, en cambio, se quedan obsoletos en pocos meses. Úsalos para tener una visión práctica del momento, pero no dependas de ellos como base de tu formación.",
        ],
      },
      {
        heading: "Cómo practicar",
        steps: [
          "Elige un conjunto de datos público sobre un tema que te interese (deporte, cine, transporte, economía).",
          "Plantéate una pregunta concreta y respóndela con datos.",
          "Documenta el proceso en un cuaderno con texto explicativo, no solo código.",
          "Repite con otro conjunto de datos y otra pregunta. Tres o cuatro análisis bien explicados forman un portfolio decente.",
        ],
      },
    ],
  },
  {
    slug: "aprender-diseno-con-cursos-gratis",
    title: "Aprender diseño con cursos gratis: por dónde empezar",
    description:
      "Principios, herramientas y práctica: una hoja de ruta realista para empezar en diseño gráfico y de interfaces sin pagar un curso.",
    categorySlug: "design",
    updated: "2026-09-21",
    intro:
      "El diseño parece cuestión de talento, pero en gran parte es un oficio con reglas que se aprenden. Esta guía te propone un orden para adquirirlas usando cursos gratuitos y mucha práctica.",
    sections: [
      {
        heading: "Primero los principios, después el programa",
        paragraphs: [
          "Jerarquía visual, contraste, alineación, proximidad, espaciado, color y tipografía. Estos principios son los mismos en Figma, Photoshop o Canva, y son los que separan un diseño que funciona de uno que no. Los programas cambian de interfaz cada pocos años; los principios, no.",
        ],
      },
      {
        heading: "Elige una herramienta principal",
        paragraphs: [
          "Para interfaces web y de apps, Figma es hoy un estándar muy extendido y tiene un plan gratuito. Para composición y edición de imagen, existen alternativas gratuitas o con planes limitados. Elige una y aprende a fondo lo básico: capas, componentes, cuadrículas, exportación.",
          "Antes de empezar un curso, comprueba que la versión del programa que muestra es reciente. Si la interfaz difiere mucho de la que ves, busca uno más actualizado.",
        ],
      },
      {
        heading: "Aprende rehaciendo",
        paragraphs: [
          "El método más eficaz para desarrollar criterio es reproducir diseños que te gusten, con fidelidad al principio y con variaciones después. Fíjate en por qué funciona una portada, una tarjeta o una pantalla de registro: dónde va el ojo, qué destaca, cómo respira el espacio.",
        ],
        steps: [
          "Elige una pantalla o un cartel bien resuelto y reprodúcelo en tu herramienta.",
          "Cambia después un elemento (color, tipografía, tamaño) y observa el efecto.",
          "Diseña algo propio con las mismas reglas, y compáralo con el original.",
        ],
      },
      {
        heading: "Construye un portfolio desde el principio",
        paragraphs: [
          "Guarda cada ejercicio, incluso los sencillos. Un portfolio pequeño pero cuidado, con tres o cuatro proyectos explicados (qué problema resolvía, qué decisiones tomaste), tiene más peso que una colección de imágenes sin contexto.",
        ],
      },
    ],
  },
  {
    slug: "aprender-idiomas-con-cursos-gratis",
    title: "Aprender idiomas con cursos gratis: cómo combinarlos para progresar",
    description:
      "Los cursos en vídeo dan estructura, pero la fluencia depende de la práctica. Cómo montar una rutina que combine ambos.",
    categorySlug: "languages",
    updated: "2026-09-21",
    intro:
      "Un curso gratuito de idiomas es un excelente punto de partida, pero rara vez basta por sí solo. Esta guía explica qué aporta cada tipo de recurso y cómo combinarlos en una rutina que puedas mantener.",
    sections: [
      {
        heading: "Qué te da un curso y qué no",
        paragraphs: [
          "Un curso en vídeo te da estructura: un orden lógico de gramática y vocabulario, y explicaciones claras. Lo que no te da es la exposición masiva al idioma real ni la práctica de hablar con alguien que te responda. Por eso conviene tratarlo como el esqueleto de tu aprendizaje, y rellenar el resto con otros recursos.",
        ],
      },
      {
        heading: "Escoge el nivel correcto",
        paragraphs: [
          "Los niveles del Marco Común Europeo (A1, A2, B1, B2, C1, C2) sirven de referencia. Si empiezas de cero, busca cursos etiquetados como A1 o «para principiantes». Saltarte niveles suele generar lagunas que se notan después. Si ya sabes algo, haz una prueba de nivel gratuita para no repetir lo que dominas.",
        ],
      },
      {
        heading: "Una rutina que funciona",
        steps: [
          "Curso estructurado: una o dos lecciones al día, 20-30 minutos.",
          "Escucha diaria: pódcasts, canciones o series con subtítulos en el idioma que aprendes.",
          "Vocabulario: repaso corto con tarjetas de memoria y repetición espaciada.",
          "Hablar en voz alta: repite frases, describe lo que ves, grábate.",
          "Conversación real: un intercambio de idiomas o una comunidad online, cuanto antes mejor.",
        ],
      },
      {
        heading: "Mantén la constancia",
        paragraphs: [
          "En idiomas, es más eficaz practicar poco cada día que mucho un día a la semana. Marca una hora fija, incluso corta, y protégela. Los progresos son lentos y poco visibles semana a semana, pero se acumulan; anota tus avances para verlos.",
        ],
      },
    ],
  },
  {
    slug: "como-terminar-un-curso-online",
    title: "Cómo terminar un curso online gratis (y no abandonar a la tercera semana)",
    description:
      "Los cursos gratuitos tienen una tasa de abandono alta. Estas son las técnicas que más ayudan a llegar hasta el final.",
    updated: "2026-09-21",
    intro:
      "Empezar un curso gratuito es fácil; terminarlo, no tanto. Al no haber dinero de por medio ni fechas límite, la motivación es lo único que te sostiene. Estas ideas te ayudan a construir estructura donde el curso no la pone.",
    sections: [
      {
        heading: "Decide para qué lo haces",
        paragraphs: [
          "Un curso sin objetivo es fácil de abandonar. Antes de empezar, escribe una frase: «quiero hacer esto para…». Cambiar de trabajo, montar un proyecto, entender un tema. Volver a esa frase cuando flaquees ayuda más de lo que parece.",
        ],
      },
      {
        heading: "Ponle fechas y horas",
        paragraphs: [
          "Calcula cuántas horas dura el curso y divídelo en sesiones. Reserva huecos concretos en tu calendario, con día y hora, y trátalos como una cita. Un curso de veinte horas, a razón de cuatro horas semanales, son cinco semanas: un objetivo tangible.",
        ],
      },
      {
        heading: "Aprende activamente",
        steps: [
          "Toma notas con tus propias palabras, no copies lo que dice el vídeo.",
          "Pausa el vídeo y prueba lo que se explica antes de seguir.",
          "Al acabar cada sesión, resume en tres frases lo aprendido.",
          "Repasa lo de la sesión anterior al empezar la siguiente.",
        ],
      },
      {
        heading: "Aplica lo aprendido pronto",
        paragraphs: [
          "Lo que no usas, se olvida. Crea un pequeño proyecto, un ejercicio o una explicación a otra persona a partir de lo que vas viendo. Enseñar lo aprendido, aunque sea a un amigo o escribiéndolo, es una de las mejores formas de consolidarlo.",
        ],
      },
      {
        heading: "Si te atascas",
        paragraphs: [
          "Es normal que una lección se atragante. Repítela una vez, busca otra explicación del mismo concepto en otro vídeo y, si sigues sin verlo, sigue adelante y vuelve más tarde. Abandonar por un solo tema difícil es el error más frecuente.",
        ],
      },
    ],
  },
  {
    slug: "youtube-o-udemy-cursos-gratis",
    title: "Cursos gratis en YouTube o en Udemy: diferencias y cuál elegir",
    description:
      "Qué ofrece cada plataforma en su versión gratuita, sus límites y cómo decidir según lo que quieras aprender.",
    updated: "2026-09-21",
    intro:
      "En este catálogo verás cursos de las dos plataformas. No son equivalentes: cada una tiene puntos fuertes y limitaciones. Conocerlos te ayuda a elegir el formato que mejor encaja contigo.",
    sections: [
      {
        heading: "YouTube: acceso inmediato, estructura variable",
        paragraphs: [
          "En YouTube no necesitas cuenta para ver un curso. Hay cursos completos de varias horas publicados por canales educativos, y colecciones organizadas en listas de reproducción. La calidad es muy variable, desde producciones muy cuidadas hasta grabaciones de clases en directo.",
          "Como contrapartida, la estructura la pone el autor: no siempre hay ejercicios, materiales descargables ni un lugar donde preguntar. Los capítulos del vídeo ayudan a moverte por el contenido.",
        ],
      },
      {
        heading: "Udemy: más estructura, pero con matices",
        paragraphs: [
          "Los cursos de Udemy suelen estar divididos en secciones y lecciones, a veces con recursos o ejercicios, y requieren crear una cuenta gratuita en la plataforma. Es un formato más parecido a un curso tradicional.",
          "Ten en cuenta que muchos cursos «gratis» de Udemy lo son solo con un cupón temporal, o son una introducción a un curso de pago. Por eso, en este catálogo solo incluimos los que hemos comprobado que son gratuitos sin cupón, y verificamos su estado periódicamente.",
        ],
      },
      {
        heading: "Cuál elegir según tu caso",
        steps: [
          "Quieres probar un tema sin compromiso ni registro: empieza por YouTube.",
          "Prefieres un curso con estructura clara, secciones y seguimiento del progreso: mira las opciones de Udemy.",
          "Buscas profundidad en un tema técnico: revisa los cursos largos de canales especializados en YouTube y compáralos con los de Udemy.",
          "Necesitas un certificado: comprueba las condiciones concretas de cada curso, porque no todos lo ofrecen y su valor depende del contexto.",
        ],
      },
      {
        heading: "Señales de un buen curso, en cualquier plataforma",
        steps: [
          "Fecha de publicación o actualización reciente para temas que cambian rápido.",
          "Un autor identificable, con trayectoria o materiales que puedas revisar.",
          "Objetivos claros: qué vas a saber hacer al terminar.",
          "Ejercicios o proyectos, no solo explicaciones.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function guideForCategory(categorySlug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.categorySlug === categorySlug);
}
