import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Loader ──────────────────────────────────────────────────────────────────

/**
 * Counts 0 → 100, holds, then fades the loader out.
 * Accepts a tweens[] for cleanup tracking.
 */
export function runLoader(counterEl, loaderEl, tweens = []) {
  return new Promise((resolve) => {
    const obj = { value: 0 };

    const t1 = gsap.to(obj, {
      value: 100,
      duration: 2.4,
      ease: 'power1.inOut',
      onUpdate() {
        if (counterEl) counterEl.textContent = Math.round(obj.value);
      },
      onComplete() {
        const t2 = gsap.to(loaderEl, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          delay: 0.5,
          onComplete: resolve,
        });
        tweens.push(t2);
      },
    });
    tweens.push(t1);
  });
}

// ─── Identity Reveal — Optical Fluid FLIP Morph with Atmospheric Orb ────────

/**
 * Optical Fluid FLIP Morph with Atmospheric Orb:
 *   PCS physically transforms into PRANAV C S with subtle liquid-glass distortion
 *   while the atmospheric Orb gently reveals behind the expanding identity.
 *
 * Sequence:
 *   1. PCS mark revealed at large scale on pure black screen (Orb stays hidden)
 *   2. Holds as a clean identity mark
 *   3. FLIP measurement & initial alignment:
 *      - Anchors P, C, S mapped directly from PCS positions
 *      - PCS hidden; name-layer takes over seamlessly
 *   4. Fluid text morph + atmospheric Orb emergence:
 *      - Orb begins revealing and scaling subtly behind the text
 *      - Animate SVG displacement + optical softness directly on the text layer
 *      - P and S stretch elastically along their travel vectors (P left, S right)
 *      - C responds to central lateral tension
 *      - Additional characters (R, A, N, A, V, spaces) emerge during the distortion
 *      - Displacement & elasticity peak around the midpoint, then smoothly return to 0
 *   5. PRANAV C S settles 100% sharp and clean; Orb reaches subtle final intensity
 *   6. Resolves to hand off to WarpText cursor interaction
 *
 * @param {HTMLElement} pcsEl       - .pcs-layer
 * @param {HTMLElement} nameEl      - .name-layer
 * @param {Object}      filterNodes - { dispEl, turbEl, blurEl }
 * @param {HTMLElement} orbEl       - .orb-backdrop (atmospheric background)
 * @param {Array}       tweens      - array to push GSAP instances into
 */
export function runIdentityReveal(pcsEl, nameEl, filterNodes = {}, orbEl = null, tweens = []) {
  return new Promise((resolve) => {
    const { dispEl, turbEl, blurEl } = filterNodes;

    /* ── 1. Initial state ─────────────────────────────────── */
    gsap.set(nameEl, { visibility: 'hidden' });
    if (orbEl) gsap.set(orbEl, { opacity: 0, scale: 0.92 });
    const pcsSpans = pcsEl.querySelectorAll('span');
    gsap.set(pcsSpans, { opacity: 0, y: 14 });

    /* ── 2. PCS staggered reveal ──────────────────────────── */
    const tl = gsap.timeline();
    tweens.push(tl);

    tl.to(pcsSpans, {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: 'power3.out',
      stagger: 0.13,
    });

    /* ── 3. Hold — identity mark moment on pure black ─────── */
    tl.to({}, { duration: 1.05 });

    /* ── 4. FLIP: take measurements and launch morph ─────── */
    tl.call(() => {
      const pcsP = pcsEl.querySelector('.pcs-p');
      const pcsC = pcsEl.querySelector('.pcs-c');
      const pcsS = pcsEl.querySelector('.pcs-s');

      const namePEl = nameEl.querySelector('.char-p');
      const nameCEl = nameEl.querySelector('.char-c');
      const nameSEl = nameEl.querySelector('.char-s');

      if (!pcsP || !pcsC || !pcsS || !namePEl || !nameCEl || !nameSEl) {
        gsap.set(nameEl, { visibility: 'visible', opacity: 1, filter: 'none' });
        gsap.set(nameEl.querySelectorAll('.nc'), { opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1 });
        gsap.set(pcsEl, { opacity: 0, visibility: 'hidden' });
        resolve();
        return;
      }

      const fromP = pcsP.getBoundingClientRect();
      const fromC = pcsC.getBoundingClientRect();
      const fromS = pcsS.getBoundingClientRect();

      // Make name layer renderable for measurement
      gsap.set(nameEl, { visibility: 'visible', opacity: 1 });

      const toP = namePEl.getBoundingClientRect();
      const toC = nameCEl.getBoundingClientRect();
      const toS = nameSEl.getBoundingClientRect();

      // Dynamic peak displacement scale proportional to rendered font height
      const fontHeight = toP.height || 120;
      const peakScale = Math.round(Math.min(26, Math.max(10, fontHeight * 0.13)));

      const safeDiv = (num, den, fallback = 1) => {
        if (!den || !isFinite(num) || !isFinite(den) || den === 0) return fallback;
        const res = num / den;
        return isFinite(res) && res > 0 ? res : fallback;
      };
      const safeDelta = (a, b) => {
        const d = a - b;
        return isFinite(d) ? d : 0;
      };

      // Apply FLIP transforms: anchors look identical to PCS mark positions
      const applyFlip = (from, to, el) => {
        if (!el || !from || !to) return;
        const scaleX = safeDiv(from.width, to.width, 1);
        const scaleY = safeDiv(from.height, to.height, 1);
        const x = safeDelta(from.left + from.width * 0.5, to.left + to.width * 0.5);
        const y = safeDelta(from.top + from.height * 0.5, to.top + to.height * 0.5);
        gsap.set(el, { x, y, scaleX, scaleY, skewX: 0, opacity: 1, transformOrigin: '50% 50%' });
      };

      applyFlip(fromP, toP, namePEl);
      applyFlip(fromC, toC, nameCEl);
      applyFlip(fromS, toS, nameSEl);

      // New chars start invisible
      const newChars = nameEl.querySelectorAll('.nc-new');
      gsap.set(newChars, { opacity: 0, scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });

      // Instantly hide PCS layer — name-layer's anchors take over without discontinuity
      gsap.set(pcsEl, { opacity: 0, visibility: 'hidden' });

      // Attach the SVG optical displacement filter to the text layer
      nameEl.style.filter = 'url(#liquid-morph-filter)';

      /* ── 5. Optical Fluid Morph + Atmospheric Orb Timeline ── */
      const morphTl = gsap.timeline({
        onComplete: () => {
          // Explicit final settled state: 100% clean and sharp text
          if (nameEl) {
            nameEl.style.filter = 'none';
            gsap.set(nameEl, {
              opacity: 1,
              visibility: 'visible',
              clearProps: 'transform,filter',
            });
            nameEl.style.opacity = '1';
            nameEl.style.visibility = 'visible';
            nameEl.style.pointerEvents = 'auto';
            nameEl.style.zIndex = '2';

            const allChars = nameEl.querySelectorAll('.nc');
            gsap.set(allChars, {
              opacity: 1,
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              clearProps: 'transform',
            });
          }
          if (dispEl) dispEl.setAttribute('scale', '0');
          if (blurEl) blurEl.setAttribute('stdDeviation', '0');
          resolve();
        },
      });
      tweens.push(morphTl);

      // ── Luminous Orb gradual reveal behind the morph ─────
      if (orbEl) {
        morphTl.to(orbEl, {
          opacity: 1,
          scale: 1,
          duration: 1.6,
          ease: 'power2.out',
        }, 0);
      }

      // ── Optical liquid displacement & softness proxy ───────
      const liquid = {
        scale: 0,
        blur: 0,
        freqX: 0.014,
        freqY: 0.022,
      };

      const updateFilter = () => {
        if (dispEl) dispEl.setAttribute('scale', liquid.scale.toFixed(2));
        if (blurEl) blurEl.setAttribute('stdDeviation', liquid.blur.toFixed(2));
        if (turbEl) turbEl.setAttribute('baseFrequency', `${liquid.freqX.toFixed(4)} ${liquid.freqY.toFixed(4)}`);
      };

      // Displacement ramp-up to peak (middle of transformation)
      morphTl.to(liquid, {
        scale: peakScale,
        blur: 0.5,
        freqX: 0.019,
        freqY: 0.027,
        duration: 0.65,
        ease: 'sine.inOut',
        onUpdate: updateFilter,
      }, 0);

      // Displacement ramp-down to 0 as characters settle
      morphTl.to(liquid, {
        scale: 0,
        blur: 0,
        freqX: 0.014,
        freqY: 0.022,
        duration: 0.85,
        ease: 'sine.out',
        onUpdate: updateFilter,
      }, '>0.06');

      // ── Character Movement (pure physical translation, no scaleX stretching) ──
      const moveDuration = 1.6;

      // P moves left — pulls open the word "PRANAV"
      morphTl.to(namePEl, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: moveDuration,
        ease: 'power2.inOut',
      }, 0);

      // S moves right — anchors the end of the identity
      morphTl.to(nameSEl, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: moveDuration,
        ease: 'power2.inOut',
      }, 0);

      // C in center
      morphTl.to(nameCEl, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: moveDuration,
        ease: 'power2.inOut',
      }, 0);

      // ── Additional letters emerge during distortion ────────
      morphTl.to(newChars, {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: { each: 0.042, from: 'start' },
      }, 0.28);

      /* ── 6. Settle — brief quiet pause on clean name ──────── */
      morphTl.to({}, { duration: 0.5 });
    });
  });
}

// ─── Personal Sentence ───────────────────────────────────────────────────────

/**
 * Reveals the personal sentence with a deliberate, subtle entrance,
 * then activates the organic atmospheric glow once it has settled.
 */
export function revealPersonalSentence(sentenceEl, onSettled = null, tweens = []) {
  if (!sentenceEl) return;

  const t = gsap.fromTo(
    sentenceEl,
    { opacity: 0, y: 7 },
    {
      opacity: 0.82,
      y: 0,
      duration: 1.25,
      ease: 'power2.out',
      delay: 0.45, // short pause after PRANAV C S settles
      onComplete: () => {
        // Sentence has settled — activate the subtle atmospheric glow
        sentenceEl.classList.add('personal-sentence--glowing');
        if (onSettled) onSettled();
      },
    }
  );
  tweens.push(t);
}

// ─── Scroll Cue ──────────────────────────────────────────────────────────────

/**
 * Fades the scroll cue in after the identity settles.
 */
export function revealScrollCue(cueEl, tweens = []) {
  const t = gsap.fromTo(
    cueEl,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.8 }
  );
  tweens.push(t);
}

// ─── Scroll Exit ─────────────────────────────────────────────────────────────

/**
 * Drives the scroll-exit. As the user scrolls through the buffer:
 *   - The full name drifts upward and scales down slightly
 *   - The personal sentence recedes in sync
 *   - The atmospheric Orb recedes gracefully
 *   - The scroll cue disappears immediately
 *   - Opacity reduces gradually
 */
export function setupScrollExit(panelEl, targetEl, cueEl, bufferEl, orbEl = null, sentenceEl = null) {
  const triggers = [];

  triggers.push(
    ScrollTrigger.create({
      trigger: bufferEl,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1.8,
      onUpdate(self) {
        const p = self.progress;

        gsap.set(targetEl, {
          y:       -(p * 90),
          scale:    1 - p * 0.07,
          opacity:  Math.max(0, 1 - p * 1.5),
        });

        if (sentenceEl) {
          gsap.set(sentenceEl, {
            y:       -(p * 90),
            opacity:  Math.max(0, 0.82 * (1 - p * 1.6)),
          });
        }

        if (orbEl) {
          gsap.set(orbEl, {
            opacity: Math.max(0, 1 - p * 1.5),
            scale: 1 - p * 0.08,
          });
        }

        // Scroll cue vanishes immediately at first scroll
        gsap.set(cueEl, {
          opacity: Math.max(0, 1 - p * 10),
        });
      },
    })
  );

  return triggers;
}
