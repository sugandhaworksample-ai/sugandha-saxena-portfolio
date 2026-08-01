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
 * At rest, tip sits after “Saxena” like a full stop.
 * Path weaves in/out of the type, draws two hearts, then closes at the start.
 * Pinning is owned by sticky .hero-rise-runway — not GSAP pin.
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
    const runway =
      (chapter.closest("[data-hero-runway]") as HTMLElement | null) ?? chapter;
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

      group.removeAttribute("transform");
      const bbox = path.getBBox();
      if (bbox.width < 1 || bbox.height < 1) return;

      const nameW = Math.max(nameBR.x - nameTL.x, 1);
      const nameH = Math.max(nameBR.y - nameTL.y, 1);
      const targetW = nameW * 1.14;
      const targetH = nameH * 1.4;
      const scale = Math.min(targetW / bbox.width, targetH / bbox.height);
      const clamped = Math.min(Math.max(scale, 0.9), 2.2);

      const origin = path.getPointAtLength(0);
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
          trigger: runway,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onRefresh: placeRibbonToName,
        },
      });

      tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0);
      if (glow) tl.to(glow, { strokeDashoffset: 0, duration: 1 }, 0);
      if (wispy) tl.to(wispy, { strokeDashoffset: 0, duration: 1 }, 0.03);

      if (tip) {
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
            scale: 1.2,
            duration: 0.18,
          },
          0,
        );
        // Closed path — tip returns to the full-stop start
        tl.to(
          tip,
          {
            attr: { fill: "var(--foreground)" },
            scale: 1,
            opacity: 1,
            duration: 0.14,
          },
          0.86,
        );
      }

      tl.to(
        chars,
        {
          y: (i) => (i % 2 === 0 ? -7 : 6),
          rotateZ: (i) => (i % 2 === 0 ? -0.8 : 0.8),
          duration: 1,
          stagger: { each: 0.014, from: "start" },
        },
        0,
      );
      tl.to(
        chars,
        {
          y: 0,
          rotateZ: 0,
          duration: 0.28,
          stagger: { each: 0.01, from: "center" },
        },
        0.8,
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
          { y: 0, scale: 1, duration: 0.28 },
          0.72,
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
      killScrollTriggers(runway);
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
 * Closed silk ribbon — start = end at Saxena tip.
 * Soft weave through both name lines; two hearts kept far apart
 * (one high-right above Sugandha, one low-left by Saxena), then home.
 */
const RIBBON_PATH = `
  M 900 420
  C 740 465, 520 450, 360 385
  C 220 325, 160 230, 220 155
  C 270 95, 400 80, 560 100
  C 720 120, 880 160, 1020 145
  C 1120 130, 1200 95, 1185 45
  C 1172 12, 1130 0, 1095 28
  C 1065 0, 1020 10, 1005 42
  C 985 85, 1040 125, 1140 150
  C 1240 180, 1280 260, 1240 340
  C 1205 400, 1100 425, 980 415
  C 840 400, 700 355, 620 280
  C 555 225, 560 155, 650 125
  C 730 100, 850 115, 940 165
  C 1010 205, 1040 275, 980 335
  C 930 380, 820 395, 700 370
  C 560 340, 420 300, 300 340
  C 230 365, 180 410, 210 450
  C 235 480, 285 485, 310 455
  C 335 485, 385 480, 410 450
  C 440 410, 400 355, 340 320
  C 280 285, 260 220, 320 175
  C 380 130, 500 125, 620 160
  C 740 195, 820 260, 840 340
  C 855 385, 880 410, 900 420
`;

const RIBBON_WISPY_PATH = `
  M 900 420
  C 750 458, 540 445, 380 380
  C 240 325, 180 235, 235 160
  C 280 105, 410 90, 565 108
  C 725 126, 885 162, 1020 148
  C 1115 135, 1190 100, 1175 52
  C 1162 22, 1125 12, 1095 35
  C 1068 12, 1028 20, 1012 48
  C 992 88, 1045 128, 1140 152
  C 1235 182, 1270 258, 1230 335
  C 1198 392, 1095 418, 980 410
  C 845 396, 710 352, 630 282
  C 568 230, 572 162, 655 132
  C 732 108, 848 120, 935 168
  C 1002 205, 1030 272, 972 330
  C 925 375, 820 388, 705 365
  C 570 338, 430 302, 315 342
  C 248 368, 200 410, 225 448
  C 248 475, 292 478, 315 452
  C 338 478, 382 475, 405 448
  C 432 410, 395 358, 338 325
  C 282 292, 265 228, 322 182
  C 380 138, 498 132, 615 165
  C 732 198, 812 258, 835 338
  C 850 382, 878 408, 900 420
`;
