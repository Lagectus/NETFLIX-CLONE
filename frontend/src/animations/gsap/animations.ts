/* ═══════════════════════════════════════════
   CineVault — GSAP Animation Factories
   Reusable ScrollTrigger & timeline presets
   ═══════════════════════════════════════════ */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugin (safe for SSR)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Reveal animation: fade + slide up on scroll ── */
export function createScrollReveal(
  elements: string | Element | Element[],
  options?: {
    y?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    start?: string;
  }
) {
  const {
    y = 60,
    duration = 1,
    stagger = 0.1,
    delay = 0,
    start = "top 85%",
  } = options || {};

  return gsap.from(elements, {
    y,
    opacity: 0,
    duration,
    stagger,
    delay,
    ease: "power3.out",
    scrollTrigger: {
      trigger: typeof elements === "string" ? elements : (elements as Element[])[0] || (elements as Element),
      start,
      toggleActions: "play none none none",
    },
  });
}

/* ── Parallax effect ── */
export function createParallax(
  element: string | Element,
  options?: {
    speed?: number;
    direction?: "vertical" | "horizontal";
  }
) {
  const { speed = 0.3, direction = "vertical" } = options || {};
  const prop = direction === "vertical" ? "y" : "x";

  return gsap.to(element, {
    [prop]: () => speed * 100,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
}

/* ── Text split & animate characters ── */
export function createTextReveal(
  element: string | Element,
  options?: {
    duration?: number;
    stagger?: number;
    delay?: number;
  }
) {
  const { duration = 0.8, stagger = 0.02, delay = 0 } = options || {};

  // Get the text element
  const el =
    typeof element === "string"
      ? document.querySelector(element)
      : element;
  if (!el || !el.textContent) return;

  const text = el.textContent;
  el.textContent = "";

  // Split into spans
  const chars = text.split("").map((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.style.overflow = "hidden";
    el.appendChild(span);
    return span;
  });

  return gsap.from(chars, {
    y: "100%",
    opacity: 0,
    rotateX: -90,
    duration,
    stagger,
    delay,
    ease: "power4.out",
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
}

/* ── Horizontal scroll section ── */
export function createHorizontalScroll(
  container: string | Element,
  scrollContainer: string | Element,
  options?: { speed?: number }
) {
  const { speed = 1 } = options || {};
  const scrollEl =
    typeof scrollContainer === "string"
      ? document.querySelector(scrollContainer)
      : scrollContainer;

  if (!scrollEl) return;

  const scrollWidth = (scrollEl as HTMLElement).scrollWidth - window.innerWidth;

  return gsap.to(scrollContainer, {
    x: -scrollWidth * speed,
    ease: "none",
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: () => `+=${scrollWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
  });
}

/* ── Infinite marquee ── */
export function createMarquee(
  elements: string | Element,
  options?: { speed?: number; direction?: "left" | "right" }
) {
  const { speed = 30, direction = "left" } = options || {};
  const dir = direction === "left" ? -1 : 1;

  return gsap.to(elements, {
    xPercent: dir * -50,
    duration: speed,
    ease: "none",
    repeat: -1,
  });
}

/* ── Stagger cards reveal ── */
export function createCardStagger(
  container: string | Element,
  cards: string,
  options?: {
    stagger?: number;
    y?: number;
    duration?: number;
  }
) {
  const { stagger = 0.08, y = 40, duration = 0.8 } = options || {};

  return gsap.from(cards, {
    y,
    opacity: 0,
    scale: 0.95,
    duration,
    stagger,
    ease: "power3.out",
    scrollTrigger: {
      trigger: container,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });
}

/* ── Pinned section with scrub ── */
export function createPinnedSection(
  trigger: string | Element,
  timeline: gsap.core.Timeline,
  options?: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
  }
) {
  const { start = "top top", end = "+=200%", scrub = 1 } = options || {};

  ScrollTrigger.create({
    trigger,
    start,
    end,
    pin: true,
    scrub,
    animation: timeline,
    anticipatePin: 1,
  });
}

/* ── Counter animation ── */
export function createCounter(
  element: string | Element,
  endValue: number,
  options?: { duration?: number; prefix?: string; suffix?: string }
) {
  const { duration = 2, prefix = "", suffix = "" } = options || {};
  const el =
    typeof element === "string" ? document.querySelector(element) : element;
  if (!el) return;

  const obj = { value: 0 };

  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      (el as HTMLElement).textContent = `${prefix}${Math.floor(obj.value).toLocaleString()}${suffix}`;
    },
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
}

/* ── Cleanup utility ── */
export function killScrollTriggers() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}
