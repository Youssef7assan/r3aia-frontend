"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

// =============================================
// Text Reveal Animation (Aceternity Style)
// =============================================
export function TextReveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// =============================================
// Gradient Text (Aceternity Style)
// =============================================
export function GradientText({ children, className = "" }) {
  return (
    <span className={`gradient-text ${className}`}>
      {children}
    </span>
  );
}

// =============================================
// Floating Badge Component
// =============================================
export function FloatingBadge({ icon, text, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`inline-flex items-center gap-2.5 px-5 py-2.5 glass rounded-full text-white text-sm font-semibold ${className}`}
    >
      {icon && <span className="text-xs">{icon}</span>}
      <span>{text}</span>
    </motion.div>
  );
}

// =============================================
// Animated Counter
// =============================================
export function AnimatedCounter({ target, suffix = "+", className = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * easeOut));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }, [isInView, target]);

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString("ar-EG")}{suffix}
    </span>
  );
}

// =============================================
// Spotlight Card (Aceternity Style)
// =============================================
export function SpotlightCard({ children, className = "" }) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-white transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(14,165,233,0.15)] ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(14, 165, 233, 0.06), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

// =============================================
// Magnetic Button (Aceternity Style)
// =============================================
export function MagneticButton({ children, className = "", href, onClick }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  const Component = href ? "a" : "button";

  return (
    <Component
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center justify-center gap-2.5 transition-all duration-300 ${className}`}
    >
      {children}
    </Component>
  );
}

// =============================================
// Infinite Moving Cards (Aceternity Style)
// =============================================
export function InfiniteMovingCards({ items, direction = "right", speed = "normal", className = "" }) {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicate = item.cloneNode(true);
      scrollerRef.current.appendChild(duplicate);
    });

    const directionVal = direction === "left" ? "forwards" : "reverse";
    scrollerRef.current.style.setProperty("--animation-direction", directionVal);

    const speedVal = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
    scrollerRef.current.style.setProperty("--animation-duration", speedVal);

    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={`scroller relative z-20 overflow-hidden [mask-image:linear-gradient(to_left,transparent,white_20%,white_80%,transparent)] ${className}`}
    >
      <ul
        ref={scrollerRef}
        className={`flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap ${start ? "animate-scroll" : ""}`}
        style={{
          animation: start
            ? `scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite`
            : "none",
        }}
      >
        {items}
      </ul>
      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 0.75rem)); }
        }
        .animate-scroll {
          animation: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite;
        }
      `}</style>
    </div>
  );
}

// =============================================
// Parallax Scroll Component
// =============================================
export function ParallaxSection({ children, className = "", speed = 0.3 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      if (scrolled > 0) {
        el.style.transform = `translateY(${scrolled * speed * -0.1}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// =============================================
// Stagger Container
// =============================================
export function StaggerContainer({ children, className = "", staggerDelay = 0.1 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
