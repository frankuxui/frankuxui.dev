import type { TransitionDirectionalAnimations } from "astro";

export const noteModalTransition: TransitionDirectionalAnimations = {
  forwards: {
    old: { name: "note-modal-backdrop-out", duration: "0.01s", easing: "linear", fillMode: "forwards" },
    new: { name: "note-modal-in", duration: "0.3s", easing: "cubic-bezier(0.32, 0.72, 0, 1)", fillMode: "forwards" }
  },
  backwards: {
    old: { name: "note-modal-out", duration: "0.25s", easing: "cubic-bezier(0.32, 0.72, 0, 1)", fillMode: "forwards" },
    new: { name: "note-modal-backdrop-in", duration: "0.2s", easing: "ease-out", fillMode: "forwards" }
  }
};
