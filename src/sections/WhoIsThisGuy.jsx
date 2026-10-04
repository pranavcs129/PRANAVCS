import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FoldText from '../components/FoldText';
import Magnet from '../components/Magnet';
import macroBugImg from '../assets/macro-bug.jpg';
import './WhoIsThisGuy.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * WhoIsThisGuy — Living Typographic Collage.
 *
 * Visual Polish:
 * - Editorial Palette: Warm creamy typography (#F6EFE3 main title, #F0E7D8 secondary lines, #B8AEA0 details).
 * - "WHO IS THIS GUY?" is permanently crisp, sharp, #F6EFE3 visual anchor.
 * - Active text moment during scroll: Active phrase gets soft warm cream spotlight (glow, brightness, scale 1.02),
 *   while inactive phrases remain cleanly visible at 0.70-0.85 opacity.
 * - Real bug macro photograph: Embedded ONLY behind TAKES PHOTOS OF BUGS in its FULL ORIGINAL COLORS (no grayscale/recolor),
 *   soft feathered edges, subtle localized halo glow, resting opacity ~0.22, active opacity ~0.36. Never fades away.
 * - Distinct visible floating motion: Desynchronized inertia on all 5 phrases (~5.5s - ~7.0s, ±5-8px).
 * - Magnet on ALL five identity elements: Text moves ~3-8px; supporting visual moves ~1-3px for layered depth.
 * - Existing scroll architecture preserved.
 */
export default function WhoIsThisGuy() {
  const containerRef    = useRef(null);
  const stageRef        = useRef(null);
  const canvasRef       = useRef(null);

  // Typography anchors
  const soRef           = useRef(null);
  const whoRef          = useRef(null);
  const websitesRef     = useRef(null);
  const videosRef       = useRef(null);
  const bugsRef         = useRef(null);
  const bugsWordRef     = useRef(null);
  const moviesRef       = useRef(null);
  const stillWatchesRef = useRef(null);
  const shinchanRef     = useRef(null);
  const anywayRef       = useRef(null);

  // Decorative visual artifacts
  const browserDecoRef  = useRef(null);
  const timelineDecoRef = useRef(null);
  const playheadRef     = useRef(null);
  const bugGhostRef     = useRef(null);
  const bugInsectRef    = useRef(null);
  const bugGlowRef      = useRef(null);
  const bugPlateRef     = useRef(null);
  const cinemaDecoRef   = useRef(null);

  // Activity management refs
  const idleTimerRef    = useRef(null);
  const isScrollingRef  = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const stage     = stageRef.current;
    if (!container || !stage) return;

    let visibilityObserver = null;

    const ctx = gsap.context(() => {
      /* ─────────────────────────────────────────────────────────────
         1. INITIAL RESTING STATES
         - "WHO IS THIS GUY?" is ALWAYS 100% sharp, high contrast, #F6EFE3.
         - The 5 lines start clean and readable (blur: 0px, opacity 0.75).
         - Inactive elements stay quietly visible at 0.70-0.85.
      ───────────────────────────────────────────────────────────── */
      gsap.set(soRef.current, {
        opacity: 0.55,
        letterSpacing: '0.22em',
      });

      const initialStyle = {
        opacity: 0.75,
        y: 0,
        scale: 1.0,
      };

      gsap.set(websitesRef.current, initialStyle);
      gsap.set(videosRef.current,   initialStyle);
      gsap.set(bugsRef.current,     initialStyle);
      gsap.set(moviesRef.current,   initialStyle);
      gsap.set(shinchanRef.current, {
        ...initialStyle,
        rotate: -2.5,
      });

      gsap.set(stillWatchesRef.current, {
        opacity: 0.70,
      });

      gsap.set(anywayRef.current, {
        opacity: 0,
        y: 10,
      });

      // Supporting visuals baseline opacities
      gsap.set(browserDecoRef.current,  { opacity: 0.06, scale: 0.98 });
      gsap.set(timelineDecoRef.current, { opacity: 0.06, scaleX: 0.92 });
      gsap.set(playheadRef.current,     { left: '10%' });
      // Bug starts completely hidden/imperceptible before the BUGS moment
      gsap.set(bugGhostRef.current,     { opacity: 0 });
      gsap.set(bugInsectRef.current,    { opacity: 0, scale: 0.96, y: 2.5 });
      gsap.set(bugGlowRef.current,      { opacity: 0 });
      gsap.set(bugPlateRef.current,     { opacity: 0 });
      gsap.set(cinemaDecoRef.current,   { opacity: 0.05, scaleX: 0.88 });

      /* ─────────────────────────────────────────────────────────────
         2. STRONGER, ORGANIC FLOATING MOTION (DESYNCHRONIZED)
         - Clearly noticeable physical movement with gentle inertia.
         - X: ±5–8px, Y: ±4–7px, Rotation: ±0.4–0.8deg.
         - Desynchronized timings: ~5.5s, ~6.5s, ~7.0s, ~5.8s, ~6.8s.
      ───────────────────────────────────────────────────────────── */
      const ambientConfigs = [
        { sel: '.who-ambient-1', x: 6.5,  y: -5.0, rot: 0.60,  dur: 5.5, delay: 0 },
        { sel: '.who-ambient-2', x: -7.0, y: 5.5,  rot: -0.65, dur: 6.5, delay: 0.7 },
        { sel: '.who-ambient-3', x: 6.0,  y: -6.0, rot: 0.50,  dur: 7.0, delay: 1.4 },
        { sel: '.who-ambient-4', x: -6.5, y: 5.0,  rot: -0.55, dur: 5.8, delay: 0.4 },
        { sel: '.who-ambient-5', x: 7.2,  y: -4.5, rot: 0.75,  dur: 6.8, delay: 1.1 },
      ];

      const ambientTweens = [];
      ambientConfigs.forEach(({ sel, x, y, rot, dur, delay }) => {
        const el = container.querySelector(sel);
        if (el) {
          ambientTweens.push(
            gsap.to(el, {
              x,
              y,
              rotation: rot,
              duration: dur,
              delay,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            })
          );
        }
      });

      const visibilityObserver = new IntersectionObserver(([entry]) => {
        const isVisible = entry.isIntersecting;
        ambientTweens.forEach(tw => {
          if (isVisible) tw.resume();
          else tw.pause();
        });
      }, { threshold: 0 });
      visibilityObserver.observe(container);

      /* ─────────────────────────────────────────────────────────────
         3. MASTER SCROLL TIMELINE (Preserved architecture)
         Controls the progressive step-forward of text into full presence.
      ───────────────────────────────────────────────────────────── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start:   'top top',
          end:     'bottom bottom',
          pin:     stage,
          scrub:   1.0,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            handleScrollActivity(self.progress);
          },
        },
      });

      // ── 0.0 → 2.5: SO... + FoldText settled anchor ───────────────
      tl.to(soRef.current, {
        opacity: 0.45,
        duration: 2.0,
        ease: 'power1.out',
      }, 0);

      // ── 2.5 → 8.0: MAKES WEBSITES moment ─────────────────────────
      tl.to(websitesRef.current, {
        opacity: 1.0,
        y: 0,
        duration: 3.5,
        ease: 'power2.out',
      }, 2.5);

      tl.to([videosRef.current, bugsRef.current], {
        opacity: 0.72,
        duration: 3.5,
        ease: 'sine.out',
      }, 3.0);

      tl.to(websitesRef.current, {
        opacity: 0.85,
        duration: 1.8,
        ease: 'power1.inOut',
      }, 6.5);

      // ── 8.0 → 13.5: EDITS VIDEOS moment ──────────────────────────
      tl.to(videosRef.current, {
        opacity: 1.0,
        y: 0,
        duration: 3.2,
        ease: 'power2.out',
      }, 8.0);

      tl.to(playheadRef.current, {
        left: '84%',
        duration: 3.8,
        ease: 'none',
      }, 8.5);

      tl.to([bugsRef.current, moviesRef.current], {
        opacity: 0.74,
        duration: 3.2,
        ease: 'sine.out',
      }, 8.5);

      tl.to(videosRef.current, {
        opacity: 0.85,
        duration: 1.8,
        ease: 'power1.inOut',
      }, 12.0);

      // ── 13.5 → 19.0: TAKES PHOTOS OF BUGS moment ─────────────────
      tl.to(bugsRef.current, {
        opacity: 1.0,
        y: 0,
        duration: 3.2,
        ease: 'power2.out',
      }, 13.5);

      // Bug photograph reveals ONLY during the BUGS moment:
      // 1. Container opens
      tl.to(bugGhostRef.current, {
        opacity: 0.48,
        duration: 2.8,
        ease: 'power2.out',
      }, 13.5);

      // 2. Feathered photograph aperture layer establishes frame
      tl.to(bugPlateRef.current, {
        opacity: 0.35,
        duration: 2.4,
        ease: 'power2.out',
      }, 13.5);

      // 3. Real bug gently emerges FROM BEHIND the photograph (opacity: 0->1, scale: 0.96->1, y: 2.5->0)
      tl.to(bugInsectRef.current, {
        opacity: 1.0,
        scale: 1.0,
        y: 0,
        duration: 3.0,
        ease: 'power2.out',
      }, 13.6);

      // 4. Soft photographic halo glow illuminates
      tl.to(bugGlowRef.current, {
        opacity: 0.85,
        duration: 2.8,
        ease: 'power2.out',
      }, 13.6);

      tl.to(bugsWordRef.current, {
        color: '#F6EFE3',
        duration: 2.4,
        ease: 'power2.out',
      }, 14.0);

      tl.to([moviesRef.current, shinchanRef.current], {
        opacity: 0.76,
        duration: 3.0,
        ease: 'sine.out',
      }, 14.0);

      tl.to(bugsRef.current, {
        opacity: 0.85,
        duration: 1.8,
        ease: 'power1.inOut',
      }, 17.5);

      // After BUGS moment: bug settles into subtle presence behind the text - never disappears, never replays!
      tl.to(bugGhostRef.current, {
        opacity: 0.30,
        duration: 2.2,
        ease: 'power1.inOut',
      }, 18.5);

      tl.to(bugGlowRef.current, {
        opacity: 0.25,
        duration: 2.2,
        ease: 'power1.inOut',
      }, 18.5);

      // ── 19.0 → 24.5: WATCHES MOVIES moment ───────────────────────
      tl.to(moviesRef.current, {
        opacity: 1.0,
        y: 0,
        letterSpacing: '0.04em',
        duration: 3.2,
        ease: 'power2.out',
      }, 19.0);

      tl.to(shinchanRef.current, {
        opacity: 0.78,
        duration: 2.8,
        ease: 'sine.out',
      }, 19.5);

      tl.to(moviesRef.current, {
        opacity: 0.85,
        letterSpacing: '0.025em',
        duration: 1.8,
        ease: 'power1.inOut',
      }, 23.0);

      // ── 24.5 → 29.0: AND STILL WATCHES SHIN CHAN. ────────────────
      tl.to(stillWatchesRef.current, {
        opacity: 0.88,
        duration: 2.0,
        ease: 'power2.out',
      }, 24.5);

      tl.to(shinchanRef.current, {
        opacity: 1.0,
        y: 0,
        rotate: -3.4,
        duration: 2.4,
        ease: 'back.out(1.6)',
      }, 24.8);

      tl.to(shinchanRef.current, {
        rotate: -2.5,
        opacity: 0.95,
        duration: 1.8,
        ease: 'power1.out',
      }, 27.2);

      // ── 29.0 → 32.5: EXTENDED HOLD (Clean, Sharp, Minimal) ────────
      tl.to([
        websitesRef.current,
        videosRef.current,
        bugsRef.current,
        moviesRef.current,
      ], {
        opacity: 0.88,
        y: 0,
        duration: 1.2,
        ease: 'power1.out',
      }, 28.5);

      // ANYWAY... bridge appears quietly during the hold
      tl.to(anywayRef.current, {
        opacity: 0.60,
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
      }, 30.0);

      // Extended hold time
      tl.to({}, { duration: 2.5 });

      // ── 32.5 → 35.0: Seamless Exit to CURRENTLY COOKING ──────────
      tl.to(canvasRef.current, {
        y: -48,
        opacity: 0,
        duration: 2.0,
        ease: 'power2.in',
      }, 33.0);

      tl.to(anywayRef.current, {
        y: -16,
        opacity: 0,
        duration: 1.6,
        ease: 'power2.in',
      }, 33.2);

      /* ─────────────────────────────────────────────────────────────
         4. SCROLL ACTIVITY CONTROLLER (High Performance)
         - Cached DOM references and batched class updates.
         - Floats update direct transforms; zero GSAP tweens on scroll.
         - Decorations only tween when active phrase transitions.
      ───────────────────────────────────────────────────────────── */
      let lastActiveKey = null;
      const floatEls = [
        container.querySelector('.who-float-1'),
        container.querySelector('.who-float-2'),
        container.querySelector('.who-float-3'),
        container.querySelector('.who-float-4'),
        container.querySelector('.who-float-5'),
      ];

      const phrases = [
        { key: 'websites', el: websitesRef.current },
        { key: 'videos',   el: videosRef.current },
        { key: 'bugs',     el: bugsRef.current },
        { key: 'movies',   el: moviesRef.current },
        { key: 'shinchan', el: shinchanRef.current },
      ];

      const decorations = [
        { key: 'websites', el: browserDecoRef.current,  activeOp: 0.82, restOp: 0.06 },
        { key: 'videos',   el: timelineDecoRef.current, activeOp: 0.84, restOp: 0.06 },
        { key: 'movies',   el: cinemaDecoRef.current,   activeOp: 0.82, restOp: 0.05 },
      ];

      const floatParams = [
        { dxMult: 8, baseProg: 0.14, dy: -2.0, rot: -0.20 },
        { dxMult: -7, baseProg: 0.31, dy: 1.8,  rot: 0.18 },
        { dxMult: 7, baseProg: 0.47, dy: -1.5, rot: -0.15 },
        { dxMult: -7, baseProg: 0.63, dy: 1.6,  rot: 0.18 },
        { dxMult: 5, baseProg: 0.78, dy: -1.2, rot: -0.18 },
      ];

      const handleScrollActivity = (progress) => {
        isScrollingRef.current = true;

        // Determine which identity line is active based on scroll progress:
        let activeKey = null;
        if (progress >= 0.05 && progress < 0.23) {
          activeKey = 'websites';
        } else if (progress >= 0.23 && progress < 0.39) {
          activeKey = 'videos';
        } else if (progress >= 0.39 && progress < 0.55) {
          activeKey = 'bugs';
        } else if (progress >= 0.55 && progress < 0.71) {
          activeKey = 'movies';
        } else if (progress >= 0.71 && progress < 0.88) {
          activeKey = 'shinchan';
        }

        // Only update classes and tweens when the active phrase transitions!
        if (activeKey !== lastActiveKey) {
          lastActiveKey = activeKey;
          phrases.forEach(({ key, el }) => {
            if (!el) return;
            if (key === activeKey) {
              el.classList.add('who-phrase--active');
            } else {
              el.classList.remove('who-phrase--active');
            }
          });

          decorations.forEach(({ key, el, activeOp, restOp }) => {
            if (!el) return;
            const isActive = key === activeKey;
            gsap.to(el, {
              opacity: isActive ? activeOp : restOp,
              duration: isActive ? 0.35 : 0.55,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          });
        }

        // Lightweight direct transform drift on outer .who-float wrappers during scroll
        for (let i = 0; i < 5; i++) {
          const el = floatEls[i];
          if (el) {
            const p = floatParams[i];
            const rawX = (progress - p.baseProg) * p.dxMult;
            const clampedX = Math.max(-3.5, Math.min(3.5, rawX));
            el.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${p.dy}px, 0) rotate(${p.rot}deg)`;
          }
        }

        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          isScrollingRef.current = false;
          for (let i = 0; i < 5; i++) {
            const el = floatEls[i];
            if (el) el.style.transform = 'translate3d(0, 0, 0)';
          }
        }, 250);
      };

    }, container);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      visibilityObserver?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="who-section" aria-label="Who is this guy?">
      <div ref={stageRef} className="who-stage">
        {/* Continuous Typographic Canvas */}
        <div ref={canvasRef} className="who-canvas">

          {/* ── Anchor: SO... + FoldText WHO IS THIS GUY? ─────────────────
              ALWAYS 100% crisp, sharp, warm creamy #F6EFE3, visually dominant.
              No blur, no opacity reduction, no haze, no Magnet.
          ───────────────────────────────────────────────────────────────── */}
          <div className="who-title-anchor">
            <div ref={soRef} className="who-phrase-so">
              SO...
            </div>
            <div ref={whoRef} className="who-fold-wrap">
              <FoldText
                text="WHO IS THIS GUY?"
                splitBy="char"
                hinge="top"
                trigger="scroll"
                duration={0.7}
                stagger={0.035}
                ease="power3.out"
                perspective={850}
                creaseShading={0.38}
                fontSize="clamp(3.8rem, 8vw, 8rem)"
                fontWeight={600}
                color="#F6EFE3"
                className="who-is-this-fold"
              />
            </div>
          </div>

          {/* ── Line 1: MAKES WEBSITES ─────────────────────────────────────
              Magnet: padding 90, strength 16, max movement 8px
          ───────────────────────────────────────────────────────────────── */}
          <div
            ref={websitesRef}
            className="who-phrase who-phrase-websites"
          >
            <Magnet
              padding={90}
              magnetStrength={16}
              maxMovement={8}
              visualFactor={0.4}
              activeTransition="transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
              inactiveTransition="transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
              wrapperClassName="who-line-magnet-wrap"
            >
              <div className="who-float who-float-1">
                <div className="who-ambient who-ambient-1">
                  {/* Embedded browser artifact: moves ~1-3px via Magnet */}
                  <div ref={browserDecoRef} className="who-browser-easter who-magnet-visual" aria-hidden="true">
                    <div className="who-browser-topbar">
                      <div className="who-b-dots">
                        <span className="who-b-dot who-b-dot--red" />
                        <span className="who-b-dot who-b-dot--yellow" />
                        <span className="who-b-dot who-b-dot--green" />
                      </div>
                      <div className="who-b-address">
                        <span className="who-b-lock">🔒</span>
                        <span className="who-b-url">pranav.design</span>
                      </div>
                      <span className="who-b-viewport">1440 × 900</span>
                    </div>
                    <div className="who-browser-body">
                      <div className="who-b-wire-header">
                        <div className="who-b-wire-logo" />
                        <div className="who-b-wire-nav">
                          <span className="who-b-wire-pill" />
                          <span className="who-b-wire-pill" />
                          <span className="who-b-wire-pill" />
                        </div>
                      </div>
                      <div className="who-b-wire-hero">
                        <div className="who-b-wire-title" />
                        <div className="who-b-wire-desc" />
                      </div>
                      <div className="who-b-cursor">
                        <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                          <path d="M0.5 0.5L9 6L4.8 7L3.2 11.2L0.5 0.5Z" fill="#F6EFE3" stroke="#000" strokeWidth="0.8" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Clean creamy text in front: moves ~3-8px via Magnet */}
                  <h3 className="who-line-text">MAKES WEBSITES</h3>
                </div>
              </div>
            </Magnet>
          </div>

          {/* ── Line 2: EDITS VIDEOS ───────────────────────────────────────
              Magnet: padding 90, strength 16, max movement 8px
          ───────────────────────────────────────────────────────────────── */}
          <div
            ref={videosRef}
            className="who-phrase who-phrase-videos"
          >
            <Magnet
              padding={90}
              magnetStrength={16}
              maxMovement={8}
              visualFactor={0.4}
              activeTransition="transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
              inactiveTransition="transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
              wrapperClassName="who-line-magnet-wrap"
            >
              <div className="who-float who-float-2">
                <div className="who-ambient who-ambient-2">
                  <h3 className="who-line-text">EDITS VIDEOS</h3>

                  {/* Editing timeline visual: moves ~1-3px via Magnet */}
                  <div ref={timelineDecoRef} className="who-timeline-easter who-magnet-visual" aria-hidden="true">
                    <div className="who-tl-meta">
                      <span className="who-tl-rec">REC ● 4K 24FPS</span>
                      <span className="who-tl-tc">00:01:24:18</span>
                    </div>
                    <div className="who-tl-board">
                      <div className="who-tl-lane who-tl-lane--v1">
                        <span className="who-tl-clip who-tl-clip--a" style={{ left: '3%',  width: '30%' }}>
                          <span className="who-tl-label">A01_04</span>
                        </span>
                        <span className="who-tl-clip who-tl-clip--b" style={{ left: '36%', width: '32%' }}>
                          <span className="who-tl-label">B_ROLL</span>
                        </span>
                        <span className="who-tl-clip who-tl-clip--c" style={{ left: '71%', width: '25%' }}>
                          <span className="who-tl-label">OUT</span>
                        </span>
                      </div>
                      <div className="who-tl-lane who-tl-lane--a1">
                        <span className="who-tl-clip who-tl-clip--aud" style={{ left: '3%',  width: '45%' }} />
                        <span className="who-tl-clip who-tl-clip--aud" style={{ left: '51%', width: '45%' }} />
                      </div>
                      <div ref={playheadRef} className="who-tl-playhead">
                        <span className="who-tl-needle" />
                        <span className="who-tl-wire" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Magnet>
          </div>

          {/* ── Line 3: TAKES PHOTOS OF BUGS ───────────────────────────────
              Real macro bug photograph behind typography in FULL ORIGINAL COLORS.
              Feathered edges, soft localized halo, never fades away.
              Magnet: padding 100, strength 15, max movement 8px
          ───────────────────────────────────────────────────────────────── */}
          <div
            ref={bugsRef}
            className="who-phrase who-phrase-bugs"
          >
            <Magnet
              padding={100}
              magnetStrength={15}
              maxMovement={8}
              visualFactor={0.35}
              activeTransition="transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
              inactiveTransition="transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
              wrapperClassName="who-line-magnet-wrap"
            >
              <div className="who-float who-float-3">
                <div className="who-ambient who-ambient-3">
                  {/* Layered bug photo container: tightly localized behind TAKES PHOTOS OF BUGS */}
                  <div ref={bugGhostRef} className="who-bug-photo-wrap who-magnet-visual" aria-hidden="true">
                    {/* Layer 1: The REAL insect emerging from behind the photograph */}
                    <div ref={bugInsectRef} className="who-bug-insect-layer">
                      <img src={macroBugImg} alt="Macro insect photograph" className="who-bug-photo-img" />
                    </div>

                    {/* Layer 2: Soft photographic halo glow */}
                    <div ref={bugGlowRef} className="who-bug-local-glow" />

                    {/* Layer 3: Feathered photograph aperture / window layer */}
                    <div ref={bugPlateRef} className="who-bug-plate-layer">
                      <img src={macroBugImg} alt="" className="who-bug-plate-img" />
                    </div>
                  </div>

                  {/* Creamy typography strictly in front: moves ~3-7px via Magnet */}
                  <h3 className="who-line-text who-bugs-heading">
                    <span className="who-bugs-prefix">TAKES PHOTOS OF </span>
                    <span ref={bugsWordRef} className="who-bugs-word">BUGS</span>
                  </h3>
                </div>
              </div>
            </Magnet>
          </div>

          {/* ── Line 4: WATCHES MOVIES ─────────────────────────────────────
              Magnet: padding 90, strength 17, max movement 8px
          ───────────────────────────────────────────────────────────────── */}
          <div
            ref={moviesRef}
            className="who-phrase who-phrase-movies"
          >
            <Magnet
              padding={90}
              magnetStrength={17}
              maxMovement={8}
              visualFactor={0.4}
              activeTransition="transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
              inactiveTransition="transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
              wrapperClassName="who-line-magnet-wrap"
            >
              <div className="who-float who-float-4">
                <div className="who-ambient who-ambient-4">
                  <div className="who-cinema-container">
                    {/* Cinematic crop framing: moves ~1-3px via Magnet */}
                    <div ref={cinemaDecoRef} className="who-cinema-easter who-magnet-visual" aria-hidden="true">
                      <div className="who-cinema-crop who-cinema-crop--top">
                        <span className="who-cinema-badge">SCOPE 2.39 : 1</span>
                        <span className="who-cinema-rule" />
                      </div>
                      <div className="who-cinema-crop who-cinema-crop--bottom">
                        <span className="who-cinema-rule" />
                        <span className="who-cinema-fps">24.000 FPS</span>
                      </div>
                    </div>

                    <h3 className="who-line-text who-line-movies">WATCHES MOVIES</h3>
                  </div>
                </div>
              </div>
            </Magnet>
          </div>

          {/* ── Line 5: AND STILL WATCHES SHIN CHAN. ───────────────────────
              Magnet: padding 90, strength 16, max movement 8px
          ───────────────────────────────────────────────────────────────── */}
          <div
            ref={shinchanRef}
            className="who-phrase who-phrase-shinchan"
          >
            <Magnet
              padding={90}
              magnetStrength={16}
              maxMovement={8}
              visualFactor={0.4}
              activeTransition="transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
              inactiveTransition="transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
              wrapperClassName="who-line-magnet-wrap"
            >
              <div className="who-float who-float-5">
                <div className="who-ambient who-ambient-5">
                  <div className="who-shin-composite">
                    <span ref={stillWatchesRef} className="who-still-lead who-magnet-visual">
                      AND STILL WATCHES
                    </span>
                    <h3 className="who-shinchan-title">
                      SHIN CHAN<span className="who-shinchan-dot">.</span>
                    </h3>
                  </div>
                </div>
              </div>
            </Magnet>
          </div>

          {/* ── ANYWAY... Bridge to CURRENTLY COOKING ────────────────────── */}
          <div ref={anywayRef} className="who-phrase-anyway" aria-label="Anyway...">
            ANYWAY...
          </div>

        </div>{/* .who-canvas */}
      </div>{/* .who-stage */}
    </section>
  );
}
