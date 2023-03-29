import { useMotion } from "@vueuse/motion";
import type { DirectiveBinding } from "vue";

export const fade = (el: HTMLElement, bin: DirectiveBinding) => {
  useMotion(el, {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        delay: (bin.value + 1) * 100,
      },
    },
  });
};
export const slide = (el: HTMLElement, bin: DirectiveBinding) => {
  useMotion(el, {
    initial: {
      opacity: 0,
      x: 20,
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: {
        delay: (bin.value + 1) * 100,
      },
    },
  });
};
