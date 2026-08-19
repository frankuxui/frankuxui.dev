---
title: "Cómo elegir el color de un sitio web (sin que sea un tiro al azar)"
description: "Guía práctica sobre psicología del color, armonía cromática, estructura de paletas, contraste WCAG y tokens CSS para decidir el color de un producto digital con criterio, no por gusto."
pubDate: 2026-08-19
icon: "🌈"
accentColor: "#1e3a5f"
tags: ["diseño", "color", "ux/ui", "accesibilidad", "frontend"]
---

Cada vez que empiezo un proyecto nuevo, el color es de las primeras decisiones que tomo, y también de las que más se subestiman. He visto a clientes elegir el azul "porque les gusta el azul" y a equipos enteros heredar la paleta del logo sin preguntarse si esa paleta funciona en una interfaz con botones, alertas y formularios. El color no es la capa decorativa que se aplica al final. Es información: antes de que alguien lea una palabra de tu copy, ya está reaccionando al color que tiene delante. Un botón rojo grita distinto que uno verde. Un fondo azul marino transmite algo completamente distinto a uno naranja pastel. Esa reacción pasa en milisegundos, y si no la diseñás a propósito, la estás dejando en manos del azar.

## El color como decisión de producto, no de gusto personal

Cuando alguien me pide "algo que se vea bien", lo primero que pregunto no es "¿qué colores te gustan?" sino "¿qué necesita transmitir este producto y a quién?". Un banco necesita transmitir solidez y control. Una app de meditación necesita transmitir calma sin caer en lo aburrido. Un e-commerce necesita generar urgencia suficiente para que compres hoy, no la semana que viene. Ninguna de esas necesidades se resuelve con "el color que le gusta al director de marketing".

Esto se nota especialmente cuando trabajo con clientes que vienen de rebrandings hechos por una agencia de branding sin experiencia en producto digital: la paleta se ve espectacular en un moodboard de Figma con tres colores y tipografía en grande, pero se rompe apenas hay que ponerle un formulario, un estado de error y una tabla de precios encima. Una paleta de marca no es lo mismo que un sistema de color para interfaz, aunque comparta el mismo tono.

## Qué transmite cada color según el tipo de sitio

Esto no es esotérico, es patrón repetido durante décadas de branding y validado una y otra vez en research de UX. No es una regla absoluta —hay excepciones geniales que rompen el molde a propósito—, pero conocer el patrón es lo que te permite decidir si lo seguís o lo rompés con intención.

**SaaS y producto tech.** Azules y violetas dominan porque comunican confianza técnica sin la frialdad corporativa del azul bancario puro. Slack usa violeta, Stripe usa un azul-violeta muy particular, Linear usa un púrpura casi negro. El violeta se volvió casi un cliché del "SaaS moderno" precisamente porque comunica innovación sin perder seriedad.

**E-commerce.** Naranjas y rojos para call-to-action porque generan urgencia y activan la decisión de compra; Amazon construyó su CTA icónico en naranja sobre fondo neutro. Pero el resto de la interfaz suele ser neutra a propósito: el color fuerte se reserva para el 5% de la pantalla que de verdad importa, el botón de comprar.

**Fintech y banca.** Azules profundos y verdes oscuros. El azul reduce ansiedad y comunica estabilidad, por eso lo verás en casi cualquier banco tradicional. Las fintech más jóvenes (Revolut, N26) se permiten acentos más vivos —menta, coral— para diferenciarse del banco de tus padres sin perder la sensación de control.

**Salud y bienestar.** Verdes y azules suaves, casi siempre con mucho blanco de por medio. El verde se asocia a salud y naturaleza; el azul claro, a limpieza y calma. Casi nunca vas a ver rojo saturado como color dominante en salud, salvo para alertas puntuales, porque el rojo dispara alarma, y lo último que querés en un paciente ansioso es más ansiedad.

**ONG e institucional.** Depende mucho de la causa, pero suele apostar por colores cálidos y humanos —naranjas, verdes tierra— en vez de los azules corpóreos, precisamente para diferenciarse de "empresa" y acercarse a "comunidad".

**Gaming y entretenimiento.** Aquí las reglas de "colores seguros" se rompen a propósito: saturación alta, contrastes fuertes, negro como base para que los acentos exploten. El objetivo no es transmitir confianza sino energía y estímulo constante.

**Portfolio creativo.** Es la categoría con más libertad, y el error más común que veo es no aprovecharla: portfolios de diseñadores que terminan usando la misma paleta neutra segura de un SaaS, cuando el portfolio es justamente el lugar para demostrar que sabés jugar con el color.

<div style="background:#ffffff;border:1px solid #ececec;border-radius:14px;padding:20px;margin:2rem auto;width:100%;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
  <div style="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(2,90px);gap:8px;">
    <div style="grid-column:1/3;grid-row:1/3;background:#0f2a4a;border-radius:3px;display:flex;align-items:flex-end;padding:12px;color:#dce8f5;font-family:monospace;font-size:13px;">#0f2a4a<br/>primary</div>
    <div style="grid-column:3/5;grid-row:1/2;background:#1e5f4a;border-radius:3px;display:flex;align-items:flex-end;padding:10px;color:#e6f5ef;font-family:monospace;font-size:12px;">#1e5f4a</div>
    <div style="grid-column:3/4;grid-row:2/3;background:#e9edf2;border-radius:3px;display:flex;align-items:flex-end;padding:8px;color:#0f2a4a;font-family:monospace;font-size:11px;">#e9edf2</div>
    <div style="grid-column:4/5;grid-row:2/3;background:#b8c4d1;border-radius:3px;display:flex;align-items:flex-end;padding:8px;color:#0f2a4a;font-family:monospace;font-size:11px;">#b8c4d1</div>
  </div>
</div>

Esta es la paleta que le propondría a una fintech seria: azul marino casi negro como primary (control, estabilidad, nada juguetón), un verde esmeralda apagado como acento para los estados positivos —saldo, transacción exitosa—, y neutros fríos grisáceos en vez de beige, porque el beige suaviza demasiado y en banca no querés "cálido", querés "sólido". Si esta paleta la usara una app de citas se vería correcta pero muerta; ahí está la clave, la misma paleta técnicamente bien construida puede ser perfecta para un contexto y un error para otro.

## La anatomía de una paleta que funciona en producción

Una paleta bonita en un moodboard y una paleta que sobrevive a un dashboard con veinte estados distintos son cosas diferentes. Para que funcione en una interfaz real necesita, como mínimo, estos roles:

- **Primario (`primary`)**: el color dominante de la marca. Es el que va en botones principales, links activos, elementos de navegación seleccionados. Tiene que ser lo bastante oscuro o saturado para servir de fondo con texto blanco legible encima, porque lo vas a usar constantemente como fondo de CTA.
- **Secundario (`secondary`)**: apoya al primario sin competir con él. Suele aparecer en botones secundarios, badges, elementos de menor jerarquía.
- **Acento (`accent`)**: se usa con moderación, casi como un signo de exclamación visual. Destacados, promociones, elementos que necesitan robar atención puntual. Si el acento aparece en cada esquina de la pantalla, dejó de ser acento.
- **Neutros (`background` / `foreground`)**: la base sobre la que vive todo lo demás. No son "grises cualquiera": suelen llevar una pizca del matiz del primario para que toda la interfaz se sienta cohesionada en vez de genérica. Por eso un gris con un toque azulado se ve distinto —y mejor— que un gris puro en una interfaz azul.
- **Estados (`success`, `warning`, `error`)**: estos casi nunca deberían inventarse desde cero. Verde para éxito, ámbar para advertencia, rojo para error son convenciones tan arraigadas que romperlas solo genera fricción cognitiva sin ningún beneficio real. Acá no hay que ser original.

Un error que veo seguido: equipos que usan el color de marca (por ejemplo, un rojo vivo) también como color de error, porque "es el color de la marca". El problema es que ahora cada botón principal parece una alerta. Si tu primary es rojo, anaranjado o cualquier color que el ojo ya asocia con "algo salió mal", necesitás separar deliberadamente esa asociación en el resto del sistema, o vas a generar ansiedad donde no corresponde.

## El 60-30-10 y por qué el primary casi nunca debería ser el color "más lindo"

La regla de proporción 60-30-10 viene de interiorismo pero se traslada bien a interfaces: 60% del espacio en el color dominante (casi siempre un neutro, no el color de marca puro), 30% en un secundario, y 10% en el acento que llama la atención. Si invertís esa proporción —60% de un color saturado— la interfaz cansa a los cinco segundos de scroll.

Otra cosa que aprendí a los golpes: el color "primary" de tu sistema no tiene que ser el color más bonito de la paleta, tiene que ser el más funcional. Necesita suficiente contraste para llevar texto blanco encima cumpliendo WCAG AA (4.5:1 para texto normal, 3:1 para texto grande de 18pt/24px o 14pt bold en adelante, y 3:1 también para componentes no textuales como bordes de inputs o iconos interactivos). Un violeta pastel puede quedar precioso en un banner, pero si lo usás como `primary` vas a terminar peleando con cada botón para que el texto se lea, y vas a terminar duplicando el token en "primary-banner" y "primary-button" porque no aguanta los dos trabajos.

<div style="background:#ffffff;border:1px solid #ececec;border-radius:14px;padding:20px;margin:2rem auto;width:100%;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
  <div style="display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(3,60px);gap:6px;">
    <div style="grid-column:1/4;grid-row:1/3;background:#3d1454;border-radius:3px;display:flex;align-items:flex-end;padding:10px;color:#f2e6f7;font-family:monospace;font-size:12px;">#3d1454 primary</div>
    <div style="grid-column:4/7;grid-row:1/2;background:#8b4513;border-radius:3px;display:flex;align-items:flex-end;padding:8px;color:#fbe9dd;font-family:monospace;font-size:11px;">#8b4513 accent</div>
    <div style="grid-column:4/5;grid-row:2/3;background:#c9a9d9;border-radius:3px;"></div>
    <div style="grid-column:5/6;grid-row:2/3;background:#e9c9a0;border-radius:3px;"></div>
    <div style="grid-column:6/7;grid-row:2/3;background:#1a1a1a;border-radius:3px;"></div>
    <div style="grid-column:1/3;grid-row:3/4;background:#f4ede8;border-radius:3px;"></div>
    <div style="grid-column:3/5;grid-row:3/4;background:#2f7d5e;border-radius:3px;display:flex;align-items:center;justify-content:center;color:white;font-family:monospace;font-size:10px;">success</div>
    <div style="grid-column:5/7;grid-row:3/4;background:#c94a3b;border-radius:3px;display:flex;align-items:center;justify-content:center;color:white;font-family:monospace;font-size:10px;">error</div>
  </div>
</div>

Esta segunda paleta es la que le propondría a un producto creativo o de portfolio: violeta profundo como primary (personalidad sin perder legibilidad, sigue cumpliendo contraste con texto blanco encima), siena/terracota como acento cálido para contrastar con el frío del violeta, y estados de success/error resueltos con las convenciones de siempre porque ahí no hay margen para experimentar. Fijate que el naranja quemado y el violeta están casi opuestos en el círculo cromático: ese contraste es lo que le da energía a la paleta sin volverla caótica.

## Armonía del color: por qué algunas combinaciones "funcionan solas"

Esto último no es casualidad, es la razón técnica detrás de casi cualquier paleta que se sienta bien: la armonía cromática se basa en la posición relativa de los colores en la rueda cromática, no en el gusto. Herramientas como [Coolors](https://coolors.co) no inventan combinaciones al azar cuando generás una paleta con la barra espaciadora ni cuando bloqueás un color base: aplican estas mismas reglas geométricas por debajo, y encima te dejan explorar entre más de 10 millones de paletas ya generadas, visualizarlas sobre diseños reales antes de decidir, y revisar el contraste sin salir de la herramienta.

Los esquemas de armonía que uso todo el tiempo:

- **Monocromático**: un solo matiz en distintos tintes, tonos y sombras. Es la opción más segura y cohesiva, ideal cuando el contenido ya tiene mucho ruido visual (dashboards con datos, por ejemplo) y no querés que el color compita con la información.
- **Análogo**: colores vecinos en la rueda (azul, azul-verdoso, verde). Se sienten naturales y tranquilos porque no hay tensión entre ellos; es el esquema típico de salud y wellness.
- **Complementario**: colores opuestos en la rueda (azul/naranja, rojo/verde, violeta/amarillo). Es el contraste más fuerte que existe y por eso hay que dosificarlo con el 60-30-10; usado al 50-50 se ve agresivo y cansa la vista.
- **Complementario dividido**: tomás un color base y usás los dos vecinos de su opuesto en vez del opuesto exacto. Da casi el mismo contraste que el complementario puro pero con menos tensión visual, y es más fácil de balancear en interfaces.
- **Triádico**: tres colores equidistantes en la rueda (120° entre cada uno). Aunque uses versiones desaturadas de los tres, el esquema se siente vibrante porque la relación geométrica ya genera contraste por sí sola.
- **Tetrádico o cuadrado**: cuatro colores equidistantes. Es el más difícil de dominar porque cuatro protagonistas compiten por atención; funciona solo si uno domina claramente y los otros tres quedan relegados a acentos puntuales.

La regla no escrita es esta: cuantos más colores metés en el esquema, más disciplinado tenés que ser con las proporciones. Un monocromático perdona casi cualquier proporción. Un tetrádico no perdona nada.

## Paletas atrevidas sin perder la armonía

Acá es donde más veo fallar a gente que recién empieza: confunde "atrevido" con "todos los colores a máxima saturación al mismo tiempo". Eso no es una paleta atrevida, es ruido. Una paleta realmente atrevida sigue exactamente las mismas reglas de armonía que una conservadora —sigue habiendo un esquema geométrico detrás—, lo que cambia es la saturación y el contraste de valor, no la disciplina.

Tres cosas que hacen que una paleta se sienta valiente sin sentirse caótica:

1. **Un neutro extremo como base.** Casi negro o casi blanco, nunca gris medio. El gris medio no deja que los colores saturados respiren; el negro o blanco extremo les da todo el contraste que necesitan para explotar sin ayuda de más saturación.
2. **Un solo color hace de protagonista.** Aunque tu esquema sea triádico o tetrádico, en la interfaz real solo uno de esos colores ocupa el rol de primary. Los demás quedan como acentos puntuales —un ícono, un borde, un estado hover— nunca como superficies grandes compitiendo entre sí.
3. **El 60-30-10 se mantiene, solo que el 10% ahora grita más fuerte.** No estás rompiendo la proporción, estás subiendo el volumen del acento que ya tenía ese rol.

<div style="background:#ffffff;border:1px solid #ececec;border-radius:14px;padding:20px;margin:2rem auto;width:100%;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
  <div style="display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(2,80px);gap:8px;">
    <div style="grid-column:1/4;grid-row:1/3;background:#121016;border-radius:3px;display:flex;align-items:flex-end;padding:12px;color:#f5f0ff;font-family:monospace;font-size:13px;">#121016<br/>primary (base)</div>
    <div style="grid-column:4/6;grid-row:1/2;background:#ff3d81;border-radius:3px;display:flex;align-items:flex-end;padding:8px;color:#fff0f5;font-family:monospace;font-size:11px;">#ff3d81</div>
    <div style="grid-column:4/5;grid-row:2/3;background:#2de8ff;border-radius:3px;"></div>
    <div style="grid-column:5/6;grid-row:2/3;background:#d4ff2d;border-radius:3px;"></div>
  </div>
</div>

Esta es una paleta triádica pensada para gaming o un producto de entretenimiento que quiere energía real: negro casi puro como base (60%, el escenario donde todo lo demás brilla), magenta como acento principal (30%, el color que asociás con la marca apenas la ves), y cian y lima reservados para detalles puntuales —un indicador de estado, un highlight de hover— porque si los tres colores saturados compitieran en la misma proporción, ningún elemento tendría jerarquía clara. Sigue siendo un triádico técnicamente correcto; lo único "atrevido" es la saturación y el contraste de valor contra el negro, no la falta de reglas.

## Tints, shades y los estados que nadie diseña hasta que los necesita

Un solo tono de `primary` no alcanza para una interfaz real. Necesitás como mínimo una escala: el tono base, una versión más oscura para `hover` y `active`, y una versión desaturada o con opacidad reducida para `disabled`. La forma más prolija de resolver esto en CSS moderno es con `color-mix()`, que evita tener que mantener a mano diez hex distintos por color:

```css
:root {
  /* tokens base */
  --primary: #1e3a5f;
  --primary-foreground: #f4f7fa;

  --secondary: #3b5998;
  --accent: #c9622b;

  --background: #f7f5f1;
  --foreground: #1a1f26;
  --foreground-muted: #5c6672;

  --success: #2f7d5e;
  --warning: #b8860b;
  --error: #b8352b;

  /* variaciones derivadas, sin duplicar hex a mano */
  --primary-hover: color-mix(in srgb, var(--primary) 85%, black);
  --primary-active: color-mix(in srgb, var(--primary) 70%, black);
  --primary-disabled: color-mix(in srgb, var(--primary) 40%, white);

  --error-bg: color-mix(in srgb, var(--error) 12%, var(--background));
}

.button-primary {
  background: var(--primary);
  color: var(--primary-foreground);
}

.button-primary:hover {
  background: var(--primary-hover);
}

.button-primary:disabled {
  background: var(--primary-disabled);
  cursor: not-allowed;
}
```

Esta estructura de tokens es básicamente el mismo esqueleto que uso en frankuxui.dev: variables semánticas (`--foreground`, `--background`, `--primary`) en vez de hardcodear hex sueltos por todo el CSS o los componentes. La ventaja no es solo estética, es de mantenimiento: si mañana necesitás ajustar el tono exacto del primary porque falla el contraste en algún componente nuevo, lo cambiás en un solo lugar y toda la interfaz se actualiza en cascada, en vez de perseguir hex codes repetidos por veinte archivos.

## Un caso de dark mode, porque ahí es donde más paletas se rompen

El error más común al pasar a dark mode no es elegir mal los colores, es asumir que basta con invertir el fondo y dejar todo lo demás igual. Un primary que cumplía contraste 4.5:1 sobre fondo claro puede quedar totalmente ilegible sobre fondo oscuro, y los colores saturados que se veían bien de día "vibran" de forma incómoda sobre negro. En dark mode casi siempre hay que aclarar y desaturar levemente los acentos, y nunca usar negro puro (`#000000`) como fondo: un gris muy oscuro con un matiz sutil del primary se siente menos agresivo en los ojos y con menos halo alrededor de los textos claros.

<div style="background:#ffffff;border:1px solid #ececec;border-radius:14px;padding:20px;margin:2rem auto;width:100%;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
  <div style="display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(2,70px);gap:8px;background:#ffffff;border-radius:8px;">
    <div style="grid-column:1/3;grid-row:1/3;background:#15181d;border:1px solid #262b33;border-radius:3px;display:flex;align-items:flex-end;padding:10px;color:#e8ebef;font-family:monospace;font-size:12px;">#15181d background</div>
    <div style="grid-column:3/4;grid-row:1/2;background:#7aa2f7;border-radius:3px;display:flex;align-items:flex-end;padding:8px;color:#0d0f12;font-family:monospace;font-size:11px;">#7aa2f7</div>
    <div style="grid-column:4/6;grid-row:1/2;background:#e8ebef;border-radius:3px;display:flex;align-items:flex-end;padding:8px;color:#15181d;font-family:monospace;font-size:11px;">#e8ebef fg</div>
    <div style="grid-column:3/4;grid-row:2/3;background:#4fae7d;border-radius:3px;"></div>
    <div style="grid-column:4/5;grid-row:2/3;background:#d9a441;border-radius:3px;"></div>
    <div style="grid-column:5/6;grid-row:2/3;background:#d9695c;border-radius:3px;"></div>
  </div>
</div>

Esa versión de azul (`#7aa2f7`) es más clara y menos saturada que un azul típico de modo claro, a propósito: sobre un fondo casi negro un azul saturado de día se ve casi fosforescente y cansa la vista en sesiones largas. Es el mismo primary "en espíritu" que en modo claro, pero recalculado para el contexto, no una simple inversión de valores.

## Herramientas que uso de verdad, no de lista genérica

De las decenas de herramientas de color que existen, tres cubren el 90% de lo que necesito en el día a día. [Coolors](https://coolors.co) sigue siendo mi punto de partida: generás paletas al instante con la barra espaciadora, bloqueás el color que ya te convenció y dejás que genere el resto siguiendo reglas de armonía, explorás entre millones de paletas ya hechas cuando necesitás inspiración rápida, y exportás directo a variables CSS. WebAIM Contrast Checker es el que uso religiosamente antes de dar por cerrada cualquier paleta, porque calcula el ratio exacto contra el estándar WCAG y te dice si pasa AA o AAA en texto normal y grande, no una aproximación visual. Y para paletas más elaboradas con variaciones tonales completas (50 a 900, al estilo Tailwind), uso los generadores de escalas de Radix Colors o UI Colors, porque generan progresiones perceptualmente uniformes en vez de simplemente aclarar u oscurecer el hex a ojo, que es lo que pasa cuando generás los tints a mano con un editor de imágenes.

## El color no arregla un mal producto, pero puede arruinar uno bueno

Al final, ninguna paleta perfecta salva una interfaz con mala jerarquía o un flujo confuso. Pero he visto productos sólidos perder confianza solo porque el rojo de sus botones de "eliminar" es indistinguible del rojo de sus alertas informativas, o porque el primary no aguanta contraste y alguien con baja visión directamente no puede leer el CTA. Elegir el color de un sitio no es la parte divertida antes del trabajo serio: es una de las decisiones que más rápido comunica si detrás hay alguien pensando en quién va a usar eso, o alguien que simplemente eligió lo que le gustaba.
