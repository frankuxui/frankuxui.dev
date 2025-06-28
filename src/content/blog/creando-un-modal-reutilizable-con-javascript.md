---
slug: "creando-un-modal-reutilizable-con-javascript"
title: "Creando un modal reutilizable con JavaScript Vanilla para tu proyecto."
subtitle: "Desarrolla una experiencia de usuario consistente con modales dinámicos."
description: "Las ventanas modales son una parte esencial de muchas interfaces web. En este artículo aprenderás a crear un modal reutilizable y personalizable utilizando solo JavaScript vanilla."
date: "2025-04-12"
tags:
  - "javascript"
  - "html"
  - "css"
cover:
  src: "https://images.unsplash.com/photo-1470092306007-055b6797ca72?w=768&h=512&auto=format&fit=crop&crop=center&fm=webp&q=90"
  author: "https://unsplash.com/es/@scottwebb"
  authorName: "Scott Webb"
  alt: "Imagen de unsplash de Scott Webb"
---

## Introducción

Las ventanas modales son fundamentales para mostrar contenido emergente sin salir de la página actual. Desde formularios, alertas, confirmaciones o contenido multimedia, un buen modal mejora significativamente la experiencia del usuario.

En este artículo aprenderás cómo crear un **modal reutilizable, dinámico y accesible utilizando JavaScript vanilla**, sin necesidad de frameworks externos.

## ¿Qué es un modal?

Un **modal** es un componente que se superpone al contenido principal de una página para captar la atención del usuario y permitirle realizar una acción específica sin redirigirlo.

Un modal efectivo debe:

- ✅ Bloquear la interacción con el contenido de fondo.
- ✅ Permitir cierre fácil (botón, clic fuera, tecla Escape).
- ✅ Ser accesible para lectores de pantalla.

## Ventajas de usar un modal reutilizable

- ✅ Reutilización de código: Puedes llamarlo desde diferentes secciones sin duplicar lógica.
- ✅ Escalabilidad: Ideal para aplicaciones grandes donde se usan múltiples modales.
- ✅ Mantenimiento centralizado: Una sola fuente de verdad para estilos y comportamiento.

### Estructura HTML básica

```html showLineNumbers{1,2} caption="Example JavaScript Code"
<!-- Botón para abrir el modal -->
<button data-toggle="myModal">Abrir Modal</button>

<!-- Modal -->
<div id="myModal" class="modal hidden" aria-labelledby="modalLabel">
  <div class="modal-content">
    <div class="modal-header">
      <h2 id="modalLabel">Título del modal</h2>
      <button data-toggle="myModal">&times;</button>
    </div>
    <div class="modal-body">
      <p>Lorem ipsum dolor sit amet consectetur...</p>
    </div>
    <div class="modal-footer">
      <button data-toggle="myModal">Cerrar</button>
    </div>
  </div>
</div>
```

### Detalles clave:

- `id` único: Cada modal debe tener un identificador único (myModal).
- `data-toggle`: Los botones con `data-toggle="myModal"` abren o cierran ese modal.
- `aria-labelledby`: Mejora la accesibilidad conectando el modal con su título.
- `hidden`: Clase que mantiene el modal oculto por defecto
- **Estructura interna:**: Compuesta por `.modal-header`, `.modal-body` y `.modal-footer` para mantener una jerarquía clara.

## Lógica en JavaScript (modal.js)

Aquí creamos una clase `Modal` que maneja cada instancia del modal: apertura, cierre, backdrop, accesibilidad y stacking.

Incluye:

- Registro en un array global `modalRegistry`
- Backdrop dinámico
- Asignación de `z-index` en cascada
- Apoyo para `Escape` y clic fuera
- Soporte para backdrop estático `(staticBackdrop: true)`
- Soporte para `scrollBehavior` (dentro/fuera del modal)
- Soporte para `placement` (posición del modal)
- Soporte para `size` (tamaño del modal)

```javascript showLineNumbers{1,2} caption="Example JavaScript Code"
const positionMap = ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "center", "center-start", "center-end"];
const sizeMap = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "full", "screen"];
const scrollBehaviorMap = ["inside", "outside"];

const modalRegistry = []; // Array para manejar todos los modales
let baseZIndex = 50;

export class Modal {
  constructor(selector, options = {}) {
    this.modal = document.querySelector(selector);
    this.modalContent = this.modal?.querySelector(".modal-content");
    this.portal = document.querySelector("#modal-portal");

    if (!this.modal || !this.modalContent || !this.portal) {
      console.error(`Faltan elementos requeridos para el modal: ${selector}`);
      return;
    }

    // Backdrop único y dinámico
    this.backdrop = document.createElement("div");
    this.backdrop.classList.add("modal-backdrop");
    this.backdrop.setAttribute("data-modal-backdrop", this.modal.id);

    // Opciones del modal
    this.options = {
      placement: positionMap.includes(options.placement) ? options.placement : "center",
      size: sizeMap.includes(options.size) ? options.size : "md",
      scrollBehavior: scrollBehaviorMap.includes(options.scrollBehavior) ? options.scrollBehavior : "inside",
      staticBackdrop: options.staticBackdrop || false,
      ...options,
    };

    this.isOpen = false;
    modalRegistry.push({
      name: this.modal.id,
      instance: this,
      target: `#${this.modal.id}`,
      backdropTarget: `[data-modal-backdrop='${this.modal.id}']`,
      level: modalRegistry.filter((m) => m.instance.isOpen).length + 1,
      zIndex: baseZIndex + (modalRegistry.filter((m) => m.instance.isOpen).length + 1) * 10,
    });
  }

  init() {
    const { modal, backdrop, portal } = this;

    modal.classList.add("hidden");
    backdrop.classList.add("hidden");

    // Inserta solo si no existe ya en el DOM
    if (!portal.querySelector(`[data-modal-backdrop="${modal.id}"]`)) {
      portal.appendChild(backdrop);
    }

    this.registerToggleTriggers();

    backdrop.addEventListener("click", () => {
      if (!this.options.staticBackdrop) this.close();
      else this.animateStatic();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        if (!this.options.staticBackdrop) this.close();
        else this.animateStatic();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        if (!this.options.staticBackdrop) this.close();
        else this.animateStatic();
      }
    });
  }

  registerToggleTriggers() {
    const modalId = this.modal.id;
    const triggers = document.querySelectorAll(`[data-toggle="${modalId}"]`);

    triggers.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.modal.classList.contains("open") ? this.close() : this.open();
      }),
    );
  }

  animateStatic() {
    const { modalContent } = this;
    modalContent.classList.add("backdrop-static");
    setTimeout(() => {
      modalContent.classList.remove("backdrop-static");
    }, 80);
  }

  open() {
    const { modal, backdrop, portal, options } = this;

    // Asignar nivel según cuántos están abiertos
    const level = modalRegistry.filter((m) => m.instance.isOpen).length + 1;
    const zIndex = baseZIndex + level * 10;
    this.isOpen = true;

    // Insertar si no están dentro aún
    if (!portal.contains(modal)) {
      portal.appendChild(modal);
    }
    if (!portal.contains(backdrop)) {
      portal.appendChild(backdrop);
    }

    // Asignar z-index
    backdrop.style = `--z-index: ${zIndex};`;
    modal.style = `--z-index: ${zIndex + 1};`;

    document.body.classList.add("modal-open");
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");

    modal.classList.add("open");
    backdrop.classList.add("open");

    modal.setAttribute("data-placement", options.placement);
    modal.setAttribute("data-size", options.size);
    modal.setAttribute("data-scroll-behavior", options.scrollBehavior);
    backdrop.setAttribute("data-static-backdrop", "true");
  }

  close() {
    const { modal, backdrop, portal } = this;

    document.body.classList.remove("modal-open");

    modal.classList.remove("open");
    backdrop.classList.remove("open");

    modal.classList.add("closing");
    backdrop.classList.add("closing");

    setTimeout(() => {
      modal.classList.remove("closing");
      backdrop.classList.remove("closing");
      modal.classList.add("hidden");
      backdrop.classList.add("hidden");
      this.isOpen = false;
    }, 200);
  }
}

export { modalRegistry };
```

## Inicialización desde HTML

En esta sección importamos el módulo del modal utilizando el atributo `type="module"`. Este atributo indica al navegador que debe interpretar el script como un módulo de **ECMAScript (ESM)**, introducido oficialmente en **ES6 (ECMAScript 2015).**

El uso de `type="module"` permite:

- Importar y exportar módulos de JavaScript.
- Asegurar un alcance de variables limitado (scope local).
- Ejecutar el script en modo estricto por defecto.

Esto es esencial para poder utilizar la instrucción import directamente en el navegador, como se muestra a continuación:

```html showLineNumbers{1,2} caption="Example JavaScript Code"
<script type="module">
  import { Modal } from "./modal.js";

  document.addEventListener("DOMContentLoaded", () => {
    const modal = new Modal("#myModal", {
      animation: true,
      placement: "center",
      size: "md",
      scrollBehavior: "outside",
      staticBackdrop: true,
    });

    modal.init();
  });
</script>
```

Puedes repetir esta lógica para tantos modales como necesites, cambiando solo el `#id` y las opciones.

## Conclusión

Has aprendido a crear un sistema de modales reutilizable, modular y accesible utilizando JavaScript puro. Esta base puede extenderse fácilmente con animaciones, componentes dinámicos o integración con librerías de UI.

- Reutilizable
- Accesible
- Escalable
