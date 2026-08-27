export const FAQ_SECTIONS = [
  {
    title: "Qué es",
    items: [
      {
        q: "¿Qué es Servicios Don Mateo?",
        a: "Es la agenda del barrio: una lista de prestadores recomendados por vecinos de Don Mateo. Sirve para encontrar gasistas, plomeros, electricistas y otros oficios de confianza, sin depender de un grupo de WhatsApp infinito.",
      },
      {
        q: "¿Cuál es el objetivo?",
        a: "Que el barrio se ayude. La idea es que un vecino pueda recomendar a alguien que ya le hizo un buen trabajo, y que otro vecino lo encuentre cuando lo necesita. No somos un marketplace ni cobramos comisión: solo acercamos contactos.",
      },
    ],
  },
  {
    title: "Cómo funciona",
    items: [
      {
        q: "¿Cómo encuentro un prestador?",
        a: "En Inicio o en Buscar podés escribir lo que necesitás o elegir una categoría. Cada ficha muestra recomendaciones de vecinos, comentarios y cómo contactar. Si hace falta algo urgente, también está la sección Urgencias.",
      },
      {
        q: "¿Cómo contacto a alguien?",
        a: "Desde la ficha, con WhatsApp o llamada. El mensaje sale de tu teléfono al del prestador: la app no intermedia la conversación ni el trabajo.",
      },
      {
        q: "¿La app cobra o gestiona el trabajo?",
        a: "No. No hay pagos, presupuestos ni contratos acá adentro. El acuerdo lo hacen el vecino y el prestador, como siempre.",
      },
      {
        q: "¿Qué son las urgencias?",
        a: "Un atajo a oficios que suelen hacer falta rápido (gas, plomería, electricidad, cerrajería) y a contactos fijos del barrio, como administración o emergencias.",
      },
    ],
  },
  {
    title: "Cuenta y comunidad",
    items: [
      {
        q: "¿Hace falta una cuenta para mirar?",
        a: "No. Podés buscar y ver fichas sin entrar. La cuenta hace falta para recomendar, comentar, guardar favoritos o publicar un servicio.",
      },
      {
        q: "¿Quién puede registrarse?",
        a: "Solo vecinos con el código o el link de invitación del grupo. El registro está cerrado para que la agenda sea del barrio y no una cartelería abierta a cualquiera.",
      },
      {
        q: "¿Por qué piden celular y no email?",
        a: "En el barrio el contacto real es el teléfono. Entras con un celular argentino y una contraseña. Ese número identifica tu cuenta; no es el teléfono que se publica en las fichas de prestadores.",
      },
    ],
  },
  {
    title: "Publicar y recomendar",
    items: [
      {
        q: "¿Puedo cargar a alguien que conozco?",
        a: "Sí. Si un vecino te hizo un buen trabajo, podés cargar su ficha (nombre, teléfono y rubro). Si ese teléfono ya está, te llevamos a la ficha existente para que sumes tu recomendación.",
      },
      {
        q: "¿Puedo publicar mi propio servicio?",
        a: "Sí. Tu ficha queda pendiente hasta que un moderador la revise. Así evitamos que cualquiera se autopublique sin filtro.",
      },
      {
        q: "¿Cómo dejo una recomendación?",
        a: "Entrá a la ficha, recomendá con una calificación y, si querés, un comentario y etiquetas (puntual, buen precio, trabajo prolijo). Eso es lo que ayuda al resto a decidir.",
      },
    ],
  },
  {
    title: "Privacidad y seguridad",
    items: [
      {
        q: "¿Qué datos guardan?",
        a: "De tu cuenta: nombre, celular y contraseña (encriptada). De las fichas: los datos que alguien publica del prestador (nombre, teléfono de contacto, rubro y, si los carga, zona, matrícula, descripción o fotos). También recomendaciones, comentarios, favoritos y reportes.",
      },
      {
        q: "¿Se ve mi nombre completo y mi teléfono?",
        a: "En recomendaciones y comentarios mostramos un nombre público reducido (nombre de pila e inicial del apellido, por ejemplo Ana G.). Tu celular de cuenta no se muestra en las fichas. El teléfono que sí se ve es el del prestador, porque es el contacto para llamarlo o escribirle.",
      },
      {
        q: "¿Es una comunidad cerrada?",
        a: "Sí. Hace falta invitación para crear cuenta. Publicar el propio servicio pasa por moderación. Cualquier vecino puede reportar un dato incorrecto, un duplicado o un contenido fuera de lugar.",
      },
      {
        q: "¿Cómo protegen la cuenta?",
        a: "La contraseña se guarda hasheada, no en texto plano. Las acciones de escribir (publicar, recomendar, favoritos) piden sesión. El panel de confianza solo lo ven los moderadores.",
      },
      {
        q: "¿Qué hago si un dato está mal o alguien se porta mal?",
        a: "En la ficha podés reportar el motivo (datos incorrectos, desactualizado, duplicado, categoría errónea u otro). Un moderador revisa reportes, publicaciones pendientes y posibles duplicados.",
      },
    ],
  },
] as const;
