"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP scroll-triggered animations
 */
export function useGsapScrollTrigger(config = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      from = { opacity: 0, y: 60 },
      to = { opacity: 1, y: 0 },
      duration = 0.8,
      delay = 0,
      ease = "power3.out",
      start = "top 85%",
      toggleActions = "play none none none",
    } = config;

    const anim = gsap.fromTo(el, from, {
      ...to,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return ref;
}

/**
 * Stagger children animation with GSAP
 */
export function useGsapStaggerChildren(config = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.children;
    if (!children.length) return;

    const {
      from = { opacity: 0, y: 40 },
      to = { opacity: 1, y: 0 },
      stagger = 0.12,
      duration = 0.6,
      ease = "power3.out",
      start = "top 85%",
    } = config;

    const anim = gsap.fromTo(children, from, {
      ...to,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return ref;
}

/**
 * GSAP Parallax Effect
 */
export function useGsapParallax(speed = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const anim = gsap.to(el, {
      y: () => speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [speed]);

  return ref;
}
