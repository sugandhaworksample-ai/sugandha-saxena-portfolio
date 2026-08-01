"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";

import { siteConfig } from "@/constants/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  ensureGsapPlugins,
  gsap,
  killScrollTriggers,
  MotionPathPlugin,
  ScrollTrigger,
} from "@/lib/gsap";

/**
 * Premium hero: sharp name + scroll-scrubbed ribbon.
 * At rest, the ribbon tip sits after “Saxena” like a full stop (no real “.”).
 * Scroll draws the ribbon from that exact point.
 */
export function NameRibbon() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathWispyRef = useRef<SVGPathElement>(null);
  const pathGlowRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion || !rootRef.current || !pathRef.current || !svgRef.current)
      return;

    ensureGsapPlugins();
    gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

    const root = rootRef.current;
    const svg = svgRef.current;
    const group = groupRef.current;
    const chapter =
      (root.closest("[data-chapter]") as HTMLElement | null) ?? root;
    const path = pathRef.current;
    const wispy = pathWispyRef.current;
    const glow = pathGlowRef.current;
    const tip = tipRef.current;
    const chars = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll("[data-weave-char]"),
    );
    const role = chapter.querySelector<HTMLElement>("[data-hero-role]");
    const ctas = chapter.querySelector<HTMLElement>("[data-brand-ctas]");
    const atmosphere = chapter.querySelector<HTMLElement>(
      "[data-hero-atmosphere]",
    );
    const grain = chapter.querySelector<HTMLElement>("[data-hero-grain]");

    const placeRibbonToName = () => {
      const endChar = root.querySelector<HTMLElement>("[data-weave-end]");
      const title = root.querySelector<HTMLElement>(".name-weave__title");
      const ctm = svg.getScreenCTM();
      if (!endChar || !title || !ctm || !tip || !group) return;

      const toLocal = (screenX: number, screenY: number) => {
        const pt = svg.createSVGPoint();
        pt.x = screenX;
        pt.y = screenY;
        return pt.matrixTransform(ctm.inverse());
      };

      const titleRect = title.getBoundingClientRect();
      const endRect = endChar.getBoundingClientRect();

      const nameTL = toLocal(titleRect.left, titleRect.top);
      const nameBR = toLocal(titleRect.right, titleRect.bottom);
      const endPt = toLocal(
        endRect.right + Math.max(endRect.width * 0.18, 4),
        endRect.top + endRect.height * 0.78,
      );

      // Clear transform so getBBox is in path-local space
      group.removeAttribute("transform");
      const bbox = path.getBBox();
      if (bbox.width < 1 || bbox.height < 1) return;

      const nameW = Math.max(nameBR.x - nameTL.x, 1);
      const nameH = Math.max(nameBR.y - nameTL.y, 1);
      const targetW = nameW * 1.12;
      const targetH = nameH * 1.35;
      const scale = Math.min(targetW / bbox.width, targetH / bbox.height);
      const clamped = Math.min(Math.max(scale, 0.9), 2.2);

      const origin = path.getPointAtLength(0);
      // Scale about path start, then park that start on the Saxena tip
      group.setAttribute(
        "transform",
        `translate(${endPt.x} ${endPt.y}) scale(${clamped}) translate(${-origin.x} ${-origin.y})`,
      );

      tip.setAttribute("cx", String(endPt.x));
      tip.setAttribute("cy", String(endPt.y));
    };

    placeRibbonToName();

    const length = path.getTotalLength();
    const wispyLength = wispy?.getTotalLength() ?? length;

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    });
    if (glow) {
      gsap.set(glow, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0.28,
      });
    }
    if (wispy) {
      gsap.set(wispy, {
        strokeDasharray: wispyLength,
        strokeDashoffset: wispyLength,
        opacity: 0.65,
      });
    }
    // Tip visible at rest — typographic full-stop feel
    if (tip) {
      gsap.set(tip, {
        opacity: 1,
        scale: 1,
        transformOrigin: "50% 50%",
      });
    }
    gsap.set(chars, { y: 0, rotateZ: 0, transformOrigin: "50% 70%" });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "hero-ribbon",
          trigger: chapter,
          start: "top top",
          end: "+=240%",
          pin: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onRefresh: placeRibbonToName,
        },
      });

      tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0);
      if (glow) tl.to(glow, { strokeDashoffset: 0, duration: 1 }, 0);
      if (wispy) tl.to(wispy, { strokeDashoffset: 0, duration: 1 }, 0.04);

      if (tip) {
        // Stays put as “.” at the start, then rides the ribbon as it draws
        tl.to(
          tip,
          {
            motionPath: {
              path,
              align: path,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            duration: 1,
          },
          0,
        );
        tl.to(
          tip,
          {
            attr: { fill: "var(--accent)" },
            scale: 1.15,
            duration: 0.2,
          },
          0,
        );
        tl.to(tip, { opacity: 0.35, scale: 0.7, duration: 0.18 }, 0.86);
      }

      tl.to(
        chars,
        {
          y: (i) => (i % 2 === 0 ? -6 : 5),
          rotateZ: (i) => (i % 2 === 0 ? -0.7 : 0.7),
          duration: 1,
          stagger: { each: 0.016, from: "start" },
        },
        0,
      );
      tl.to(
        chars,
        {
          y: 0,
          rotateZ: 0,
          duration: 0.3,
          stagger: { each: 0.01, from: "center" },
        },
        0.78,
      );

      if (atmosphere) {
        tl.fromTo(
          atmosphere,
          { scale: 1, xPercent: 0, yPercent: 0 },
          { scale: 1.1, xPercent: 3, yPercent: -2, duration: 1 },
          0,
        );
      }
      if (grain) tl.to(grain, { opacity: 0.5, duration: 1 }, 0);
      if (role) {
        tl.fromTo(
          role,
          { y: 0, opacity: 0.8 },
          { y: -6, opacity: 1, duration: 1 },
          0,
        );
      }
      if (ctas) {
        tl.fromTo(
          ctas,
          { y: 10, scale: 0.98 },
          { y: 0, scale: 1, duration: 0.3 },
          0.68,
        );
      }
    }, root);

    const onResize = () => {
      placeRibbonToName();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    const refreshId = window.setTimeout(() => {
      placeRibbonToName();
      ScrollTrigger.refresh();
    }, 100);
    requestAnimationFrame(() => {
      placeRibbonToName();
      ScrollTrigger.refresh();
    });

    return () => {
      window.clearTimeout(refreshId);
      window.removeEventListener("resize", onResize);
      ctx.revert();
      killScrollTriggers(chapter);
    };
  }, [reduceMotion]);

  const words = siteConfig.name.split(" ");
  let letterIndex = 0;

  return (
    <div ref={rootRef} data-brand className="name-weave">
      <h1 className="name-weave__title" aria-label={siteConfig.name}>
        <svg
          ref={svgRef}
          aria-hidden
          className="name-weave__svg"
          viewBox="-80 -80 1400 680"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id="hero-ribbon-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
              <stop offset="22%" stopColor="var(--accent)" stopOpacity="1" />
              <stop
                offset="55%"
                stopColor="color-mix(in oklab, var(--accent) 50%, var(--foreground))"
                stopOpacity="1"
              />
              <stop offset="82%" stopColor="var(--accent)" stopOpacity="0.95" />
              <stop
                offset="100%"
                stopColor="var(--accent)"
                stopOpacity="0.25"
              />
            </linearGradient>
            <linearGradient
              id="hero-ribbon-wispy"
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
            >
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.65" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g ref={groupRef}>
            <path
              ref={pathGlowRef}
              className="name-weave__path name-weave__path--glow"
              fill="none"
              stroke="var(--accent)"
              strokeWidth={28}
              strokeLinecap="round"
              strokeLinejoin="round"
              d={RIBBON_PATH}
            />
            <path
              ref={pathWispyRef}
              className="name-weave__path name-weave__path--wispy"
              fill="none"
              stroke="url(#hero-ribbon-wispy)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              d={RIBBON_WISPY_PATH}
            />
            <path
              ref={pathRef}
              data-ribbon-path
              className="name-weave__path"
              fill="none"
              stroke="url(#hero-ribbon-gradient)"
              strokeWidth={13}
              strokeLinecap="round"
              strokeLinejoin="round"
              d={RIBBON_PATH}
            />
          </g>

          {/* Decorative full-stop tip — not real text */}
          <circle
            ref={tipRef}
            className="name-weave__tip"
            r="4.5"
            cx="900"
            cy="420"
            fill="var(--foreground)"
          />
        </svg>

        {words.map((word, wordIndex) => {
          const letters = word.split("");
          const isLastWord = wordIndex === words.length - 1;
          return (
            <span key={word} className="name-weave__word">
              {letters.map((char, charIndex) => {
                const z = letterIndex % 2 === 0 ? 10 : 30;
                const key = `${word}-${letterIndex}-${char}`;
                const isEnd = isLastWord && charIndex === letters.length - 1;
                letterIndex += 1;
                return (
                  <motion.span
                    key={key}
                    data-weave-char
                    data-weave-end={isEnd ? "" : undefined}
                    className="name-weave__char"
                    style={{ zIndex: z }}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y: -8,
                            scale: 1.05,
                            transition: {
                              duration: 0.16,
                              ease: [0.23, 1, 0.32, 1],
                            },
                          }
                    }
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </h1>
    </div>
  );
}

/**
 * Starts at Saxena tip (remapped + scaled in JS to span the full name).
 * Coils through both lines with at most two small heart flourishes.
 */
const RIBBON_PATH = `
  M 900 420
  C 780 455, 620 445, 480 410
  C 360 375, 260 320, 200 260
  C 140 200, 150 140, 240 115
  C 330 90, 450 115, 540 165
  C 490 100, 430 40, 490 10
  C 530 -12, 585 -5, 610 35
  C 635 -5, 690 -12, 730 10
  C 790 40, 750 105, 690 155
  C 780 120, 900 95, 1020 110
  C 1140 125, 1220 180, 1240 250
  C 1260 320, 1180 380, 1060 400
  C 960 415, 860 370, 800 310
  C 740 250, 720 180, 770 130
  C 820 80, 920 60, 1000 85
  C 960 45, 920 0, 960 -25
  C 985 -42, 1020 -38, 1035 -15
  C 1050 -38, 1085 -42, 1110 -25
  C 1150 0, 1115 45, 1075 80
  C 1140 120, 1200 190, 1185 270
  C 1170 350, 1080 400, 960 415
  C 840 430, 720 390, 640 330
  C 560 270, 520 200, 550 145
  C 470 175, 370 230, 310 300
  C 250 370, 280 440, 380 455
  C 520 475, 700 450, 860 420
`;

const RIBBON_WISPY_PATH = `
  M 900 420
  C 760 450, 600 435, 460 395
  C 340 355, 250 300, 195 245
  C 145 195, 165 145, 255 125
  C 350 105, 470 135, 560 180
  C 520 120, 470 60, 520 30
  C 555 10, 600 15, 620 45
  C 640 15, 685 10, 720 30
  C 770 55, 740 115, 690 160
  C 790 130, 930 110, 1050 125
  C 1160 140, 1235 195, 1250 260
  C 1265 330, 1170 390, 1040 405
  C 1040 20, 1100 -20, 1135 5
  C 1170 35, 1135 80, 1095 110
  C 1170 170, 1210 260, 1140 340
  C 1060 410, 900 430, 760 400
  C 620 370, 500 320, 440 360
  C 500 430, 680 440, 850 420
`;
