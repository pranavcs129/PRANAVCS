import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  runIdentityReveal,
  revealPersonalSentence,
  revealScrollCue,
  setupScrollExit,
} from '../animations/introAnimations';
import WarpText from './WarpText';
import Orb from './Orb';
import './IdentityReveal.css';

/**
 * IdentityReveal — Opening identity experience.
 *
 * Sequence:
 *   1. BLACK → PCS mark revealed at large scale on pure black screen
 *   2. Holds as a clean identity mark
 *   3. PCS begins transforming into PRANAV C S:
 *      - Atmospheric Orb gradually reveals behind the identity
 *      - Subtle liquid-glass optical displacement animated directly on the text
 *      - Anchors P, C, S glide to their natural positions
 *      - R, A, N, A, V emerge during the fluid phase
 *      - Distortion settles to 0; PRANAV C S becomes perfectly sharp
 *      - Orb reaches its final subtle atmospheric intensity
 *   4. Seamlessly activates React Bits WarpText with interactive cursor warp
 *   5. Deliberate entrance:
 *      PRANAV C S settles → short pause → sentence reveals → settles → subtle organic glow comes alive
 *   6. Hairline scroll cue appears; scroll triggers the exit
 */
export default function IdentityReveal() {
  const pcsRef      = useRef(null);   // .pcs-layer (initial identity mark)
  const nameRef     = useRef(null);   // .name-layer (FLIP morph DOM spans)
  const warpRef     = useRef(null);   // .warp-layer (React Bits WarpText)
  const sentenceRef = useRef(null);   // .personal-sentence
  const cueRef      = useRef(null);   // .scroll-cue
  const stageRef    = useRef(null);   // .identity-stage (centered container)
  const panelRef    = useRef(null);   // .identity-panel (viewport pinned)
  const bufferRef   = useRef(null);   // .scroll-buffer (ScrollTrigger driver)
  const orbWrapRef  = useRef(null);   // .orb-wrapper (luminous energy sphere)

  // SVG filter element refs for high-performance direct attribute updates
  const turbRef     = useRef(null);   // <feTurbulence>
  const dispRef     = useRef(null);   // <feDisplacementMap>
  const blurRef     = useRef(null);   // <feGaussianBlur>

  const [warpActive, setWarpActive] = useState(false);

  useEffect(() => {
    const pcs      = pcsRef.current;
    const name     = nameRef.current;
    const warp     = warpRef.current;
    const sentence = sentenceRef.current;
    const cue      = cueRef.current;
    const stage    = stageRef.current;
    const panel    = panelRef.current;
    const buffer   = bufferRef.current;
    const orb      = orbWrapRef.current;

    const filterNodes = {
      dispEl: dispRef.current,
      turbEl: turbRef.current,
      blurEl: blurRef.current,
    };

    if (!pcs || !name) return;

    let cancelled = false;

    // Use GSAP Context for production-safe scoping and deterministic cleanup
    const ctx = gsap.context(() => {
      const tweens = [];

      // Await web fonts ready (with safe timeout fallback) so layout and FLIP coordinates are deterministic
      const fontCheck = document.fonts?.ready
        ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 600))])
        : Promise.resolve();

      fontCheck.then(() => {
        if (cancelled) return;

        runIdentityReveal(pcs, name, filterNodes, orb, tweens).then(() => {
          if (cancelled) return;

          // Final settled state is explicitly:
          // PRANAV C S: opacity: 1, visibility: visible, transform: none, z-index: above background, pointer-events: auto
          gsap.set(name, {
            opacity: 1,
            visibility: 'visible',
            clearProps: 'transform,filter',
          });
          name.style.opacity = '1';
          name.style.visibility = 'visible';
          name.style.pointerEvents = 'auto';
          name.style.zIndex = '2';

          const allChars = name.querySelectorAll('.nc');
          gsap.set(allChars, {
            opacity: 1,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            clearProps: 'transform',
          });

          // Activate WarpText interaction on hover
          setWarpActive(true);

          // Deliberate entrance:
          // PRANAV C S settles → short pause → sentence subtly reveals → settles → subtle glow begins
          revealPersonalSentence(sentence, null, tweens);

          // Fade in minimal hairline scroll cue
          revealScrollCue(cue, tweens);

          // Set up scroll exit on stage, atmospheric orb, and personal sentence
          const triggers = setupScrollExit(panel, stage, cue, buffer, orb, sentence);
          tweens.push(...triggers.map(st => ({ kill: () => st.kill() })));
        });
      });
    }, panelRef);

    const dispEl = dispRef.current;
    const blurEl = blurRef.current;

    return () => {
      cancelled = true;
      ctx.revert();
      if (sentence) sentence.classList.remove('personal-sentence--glowing');
      if (name) {
        name.style.filter = 'none';
        name.style.opacity = '1';
        name.style.visibility = 'visible';
      }
      if (dispEl) dispEl.setAttribute('scale', '0');
      if (blurEl) blurEl.setAttribute('stdDeviation', '0');
    };
  }, []);

  // Character breakdown for FLIP morph:
  // Anchors: P, C, S (FLIP-transformed from PCS mark)
  // New: R, A, N, A, V and spaces (emerge in the opening gap)
  const chars = [
    { char: 'P', cls: 'char-p nc-anchor' },
    { char: 'R', cls: 'char-r nc-new'    },
    { char: 'A', cls: 'char-a1 nc-new'   },
    { char: 'N', cls: 'char-n nc-new'    },
    { char: 'A', cls: 'char-a2 nc-new'   },
    { char: 'V', cls: 'char-v nc-new'    },
    { char: ' ', cls: 'char-sp1 nc-new nc-space' },
    { char: 'C', cls: 'char-c nc-anchor' },
    { char: ' ', cls: 'char-sp2 nc-new nc-space' },
    { char: 'S', cls: 'char-s nc-anchor' },
  ];

  return (
    <>
      {/* ── SVG Liquid Morph Optical Displacement Filter ── */}
      <svg
        className="liquid-filter-svg"
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        <defs>
          <filter
            id="liquid-morph-filter"
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.014 0.022"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur
              ref={blurRef}
              in="displaced"
              stdDeviation="0"
              result="blurred"
            />
            <feMerge>
              <feMergeNode in="blurred" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <section ref={panelRef} className="identity-panel" aria-label="Identity">
        {/* ── Luminous Orb (Layer 0 — Background) ───────── */}
        <div ref={orbWrapRef} className="orb-wrapper" aria-hidden="true">
          <Orb
            hoverIntensity={0.05}
            rotateOnHover={false}
            hue={324}
            forceHoverState={false}
            backgroundColor="#000000"
          />
        </div>

        {/* ── Foreground Identity Stage (Layer 2) ─────────── */}
        <div ref={stageRef} className="identity-stage">

          {/* ── PCS mark (Layer A) ───────────────────────── */}
          <div ref={pcsRef} className="pcs-layer" aria-hidden="true">
            <span className="pcs-p">P</span>
            <span className="pcs-c">C</span>
            <span className="pcs-s">S</span>
          </div>

          {/* ── Full name DOM FLIP morph (Layer B) ────────── */}
          <div ref={nameRef} className="name-layer" aria-hidden="true">
            {chars.map((c, i) => (
              <span key={i} className={`nc ${c.cls}`}>
                {c.char === ' ' ? '\u00A0' : c.char}
              </span>
            ))}
          </div>

          {/* ── WarpText WebGL Interactive (Layer C) ─────── */}
          <div
            ref={warpRef}
            className={`warp-layer ${warpActive ? 'warp-layer--active' : ''}`}
            aria-hidden="true"
          >
            <WarpText
              text="PRANAV C S"
              color="#f8f5ff"
              warpStrength={0.045}
              warpScale={1.35}
              speed={0.38}
              pointerInfluence={0.28}
              pointerStrength={0.24}
              refraction={0.01}
              ripple
              fontSize="clamp(4.5rem, 9vw, 10rem)"
              fontWeight={400}
              letterSpacing="-0.035em"
              fontFamily='"Space Mono", monospace'
              style={{ height: '260px' }}
            />
          </div>

          <span className="sr-only">Pranav C S</span>
        </div>

        {/* ── Personal Sentence ────────────────────────────── */}
        <div ref={sentenceRef} className="personal-sentence" aria-hidden="true">
          <span className="personal-sentence__line">i have no idea what i'm doing</span>
          <span className="personal-sentence__line">but it usually works</span>
        </div>

        {/* ── Scroll cue ─────────────────────────────────── */}
        <div ref={cueRef} className="scroll-cue" aria-hidden="true">
          <span className="scroll-cue__label">scroll</span>
          <span className="scroll-cue__line" />
        </div>
      </section>

      {/* ── Scroll buffer ────────────────────────────────── */}
      <div ref={bufferRef} className="scroll-buffer" aria-hidden="true" />
    </>
  );
}
