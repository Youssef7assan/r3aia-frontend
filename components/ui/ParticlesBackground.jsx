"use client";

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false, zIndex: 0 },
      fpsLimit: 120,
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: {
            enable: true,
            mode: "parallax",
            parallax: { enable: true, force: 60, smooth: 10 }
          },
        },
        modes: {
          parallax: {
            enable: true,
            force: 60,
            smooth: 10,
          },
        },
      },
      particles: {
        color: {
          value: ["#ffffff", "#38bdf8", "#bae6fd"],
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: true,
          speed: 0.6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            width: 800,
            height: 800,
          },
          value: 200,
        },
        opacity: {
          value: { min: 0.1, max: 0.8 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
        shadow: {
          enable: true,
          color: "#38bdf8",
          blur: 15,
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[0] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-sky-800 to-sky-950 opacity-90 z-[0]" />
      
      {/* Background Subtle Rings */}
      <div className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none flex items-center justify-center">
         <div className="absolute w-[60vw] h-[60vw] border border-white rounded-full translate-x-[20%]" />
         <div className="absolute w-[100vw] h-[100vw] border border-white rounded-full translate-x-[20%]" />
         <div className="absolute w-[140vw] h-[140vw] border border-white rounded-full translate-x-[20%]" />
      </div>

      {init && (
        <Particles
          id="tsparticles"
          options={options}
          className="absolute inset-0 w-full h-full z-[2] mix-blend-screen"
        />
      )}
    </div>
  );
}
