import type { TransitionDirectionalAnimations } from "astro";

/**
 * Custom View Transitions pair used by NoteLayout to simulate a bottom sheet
 * (modal) opening/closing while the URL genuinely changes to the note's slug.
 * Applied only to the note detail page's <main>, so list <-> list navigation
 * (pagination) keeps Root's default crossfade untouched.
 */
export const noteModalTransition: TransitionDirectionalAnimations = {
  forwards: {
    old: { name: "note-modal-backdrop-out", duration: "0.32s", easing: "cubic-bezier(0.32, 0.72, 0, 1)", fillMode: "forwards" },
    new: { name: "note-modal-in", duration: "0.45s", easing: "cubic-bezier(0.32, 0.72, 0, 1)", fillMode: "forwards" },
  },
  backwards: {
    old: { name: "note-modal-out", duration: "0.32s", easing: "cubic-bezier(0.32, 0.72, 0, 1)", fillMode: "forwards" },
    new: { name: "note-modal-backdrop-in", duration: "0.3s", easing: "ease-out", fillMode: "forwards" },
  },
};
