'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigation } from '../context/useNavigation';
import { CARD_ROUTES } from '../router/routes';
import './MagicBento.css';

const DEFAULT_PARTICLE_COUNT = 8;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '220, 205, 190';
const MOBILE_BREAKPOINT = 768;

/* ─────────────────────────────────────────────────────────────────
   DEFAULT CARDS: "THINGS I SOMEHOW KNOW"
───────────────────────────────────────────────────────────────── */
const defaultThingsCards = [
  {
    id: 'photography',
    title: 'PHOTOGRAPHY',
    description: 'point camera at tiny thing. immediately forget what time it is.',
    label: '01 / FRAME',
    hierarchy: 'large',
    gridSpan: 'card-span-7',
    microVisual: 'photography',
  },
  {
    id: 'videography',
    title: 'VIDEOGRAPHY',
    description: 'apparently moving pictures are better than standing still.',
    label: '02 / MOTION',
    hierarchy: 'medium',
    gridSpan: 'card-span-5',
    microVisual: 'videography',
  },
  {
    id: 'video-editing',
    title: 'VIDEO EDITING',
    description: 'one more tiny adjustment.',
    label: '03 / TIMELINE',
    hierarchy: 'medium',
    gridSpan: 'card-span-5',
    microVisual: 'editing',
  },
  {
    id: 'c',
    title: 'C',
    description: 'somehow this still works.',
    label: '04 / LOW LEVEL',
    hierarchy: 'smaller',
    gridSpan: 'card-span-3',
    microVisual: 'c',
  },
  {
    id: 'java',
    title: 'JAVA',
    description: 'we are currently negotiating.',
    label: '05 / RUNTIME',
    hierarchy: 'medium',
    gridSpan: 'card-span-4',
    microVisual: 'java',
  },
  {
    id: 'vibe-coding',
    title: 'VIBE CODING',
    description: 'tell the computer what I mean and hope for the best.',
    label: '06 / INTUITION',
    hierarchy: 'large',
    gridSpan: 'card-span-12',
    microVisual: 'vibecoding',
  },
];

/* ─────────────────────────────────────────────────────────────────
   MICRO-VISUAL COMPONENTS
───────────────────────────────────────────────────────────────── */
function CardMicroVisual({ type }) {
  switch (type) {
    case 'photography':
      return (
        <div className="card-micro-visual micro-photography" aria-hidden="true">
          <svg className="micro-icon micro-camera-reticle" viewBox="0 0 36 36" fill="none">
            {/* Viewfinder corner brackets */}
            <path d="M 4 11 V 4 H 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 32 11 V 4 H 25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 4 25 V 32 H 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 32 25 V 32 H 25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            {/* Focus ring & crosshair */}
            <circle cx="18" cy="18" r="4" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 2" />
            <circle cx="18" cy="18" r="1.2" fill="currentColor" />
          </svg>
          <span className="micro-tag-text">AF-C · 35mm</span>
        </div>
      );

    case 'videography':
      return (
        <div className="card-micro-visual micro-videography" aria-hidden="true">
          <svg className="micro-icon micro-frame-marks" viewBox="0 0 46 24" fill="none">
            {/* 16:9 crop framing lines */}
            <path d="M 2 7 V 2 H 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 44 7 V 2 H 38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 2 17 V 22 H 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 44 17 V 22 H 38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="15" y1="12" x2="31" y2="12" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
          </svg>
          <div className="micro-rec-indicator">
            <span className="rec-dot" />
            <span className="rec-label">24 FPS</span>
          </div>
        </div>
      );

    case 'editing':
      return (
        <div className="card-micro-visual micro-editing" aria-hidden="true">
          <div className="timeline-mini-widget">
            <div className="timeline-tracks">
              <div className="track-row video-track">
                <span className="clip clip-a" />
                <span className="clip clip-b" />
                <span className="clip clip-c" />
              </div>
              <div className="track-row audio-track">
                <span className="audio-chunk" />
                <span className="audio-chunk chunk-wide" />
              </div>
            </div>
            <div className="timeline-needle">
              <span className="needle-head">▼</span>
              <span className="needle-line" />
            </div>
          </div>
        </div>
      );

    case 'c':
      return (
        <div className="card-micro-visual micro-c" aria-hidden="true">
          <div className="c-mini-terminal">
            <span className="c-prefix">&gt;</span>
            <span className="c-syntax">char* ptr;</span>
            <span className="c-cursor" />
          </div>
        </div>
      );

    case 'java':
      return (
        <div className="card-micro-visual micro-java" aria-hidden="true">
          <div className="java-mini-syntax">
            <span className="java-keyword">class</span>
            <span className="java-braces">&#123;&nbsp;&#125;;</span>
            <span className="java-status">ok</span>
          </div>
        </div>
      );

    case 'vibecoding':
      return (
        <div className="card-micro-visual micro-vibecoding" aria-hidden="true">
          <div className="vibe-header-mark">
            <span className="vibe-sparkle">✨</span>
            <span className="vibe-prompt">&gt; prompt_</span>
          </div>
          <div className="vibe-code-marks">
            <span className="vibe-chip">// works on my machine</span>
            <span className="vibe-chip chip-glow">git push -f</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ─────────────────────────────────────────────────────────────────
   PARTICLE HELPER
───────────────────────────────────────────────────────────────── */
const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 3.5px;
    height: 3.5px;
    border-radius: 50%;
    background: rgba(${color}, 0.85);
    box-shadow: 0 0 8px rgba(${color}, 0.55);
    pointer-events: none;
    z-index: 10;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = radius => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius, cardRect = null) => {
  const rect = cardRect || card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

/* ─────────────────────────────────────────────────────────────────
   PARTICLE CARD COMPONENT
───────────────────────────────────────────────────────────────── */
const ParticleCard = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = true,
  ...rest
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 0.75, duration: 0.4, ease: 'power2.out' }
        );

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
          duration: 3 + Math.random() * 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.25,
          duration: 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 90);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;
    let cachedCardRect = null;

    const handleMouseEnter = () => {
      const bentoLayer = element.closest('.brain-bento-layer');
      if (bentoLayer && !bentoLayer.classList.contains('is-active')) return;
      cachedCardRect = element.getBoundingClientRect();
      isHoveredRef.current = true;
      animateParticles();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      cachedCardRect = null;
      clearAllParticles();
      element.style.transform = 'perspective(1000px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
    };

    const handleMouseMove = e => {
      if (!isHoveredRef.current) return;
      if (!enableTilt && !enableMagnetism) return;
      if (!cachedCardRect) cachedCardRect = element.getBoundingClientRect();

      const rect = cachedCardRect;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle restrained physical tilt (max ~5-6 deg)
      const rotateX = enableTilt ? (((y - centerY) / centerY) * -5.5) : 0;
      const rotateY = enableTilt ? (((x - centerX) / centerX) * 5.5) : 0;
      const magnetX = enableMagnetism ? ((x - centerX) * 0.035) : 0;
      const magnetY = enableMagnetism ? ((y - centerY) * 0.035) : 0;

      element.style.transform = `perspective(1000px) translate3d(${magnetX.toFixed(1)}px, ${magnetY.toFixed(1)}px, 0) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    };

    const handleClick = e => {
      if (!clickEffect) return;
      const bentoLayer = element.closest('.brain-bento-layer');
      if (bentoLayer && !bentoLayer.classList.contains('is-active')) return;

      const rect = cachedCardRect || element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      // Warm, physical ripple
      const ripple = document.createElement('div');
      ripple.className = 'magic-bento-ripple';
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.22) 0%, rgba(${glowColor}, 0.08) 35%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 100;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} particle-container`}
      style={{ ...style, position: 'relative' }}
      {...rest}
    >
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   GLOBAL SPOTLIGHT COMPONENT
───────────────────────────────────────────────────────────────── */
const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 700px;
      height: 700px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.12) 0%,
        rgba(${glowColor}, 0.06) 20%,
        rgba(${glowColor}, 0.03) 40%,
        rgba(${glowColor}, 0.01) 60%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate3d(-9999px, -9999px, 0) translate(-50%, -50%);
      mix-blend-mode: screen;
      transition: opacity 0.25s ease;
      will-change: transform, opacity;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    let cachedCards = [];
    let sectionRect = null;

    const updateCardCache = () => {
      if (!gridRef.current) return;
      const section = gridRef.current.closest('.bento-section') || gridRef.current;
      sectionRect = section.getBoundingClientRect();
      const cards = gridRef.current.querySelectorAll('.magic-bento-card');
      cachedCards = Array.from(cards).map(card => ({
        el: card,
        rect: card.getBoundingClientRect(),
      }));
    };

    const handleMouseMove = e => {
      if (!spotlightRef.current || !gridRef.current) return;

      // Only run when the bento layer is active/visible!
      const bentoLayer = gridRef.current.closest('.brain-bento-layer');
      if (bentoLayer && !bentoLayer.classList.contains('is-active')) {
        if (isInsideSection.current) {
          isInsideSection.current = false;
          spotlightRef.current.style.opacity = '0';
        }
        return;
      }

      if (!sectionRect) updateCardCache();
      const rect = sectionRect;
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;

      if (!mouseInside) {
        spotlightRef.current.style.opacity = '0';
        cachedCards.forEach(({ el }) => {
          el.style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cachedCards.forEach(({ el, rect: cardRect }) => {
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(el, e.clientX, e.clientY, glowIntensity, spotlightRadius, cardRect);
      });

      // Update spotlight position directly via GPU transform
      spotlightRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

      const targetOpacity =
        minDistance <= proximity
          ? 0.75
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.75
            : 0;

      spotlightRef.current.style.opacity = targetOpacity.toFixed(2);
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      sectionRect = null;
      cachedCards.forEach(({ el }) => {
        el.style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '0';
      }
    };

    const handleScrollOrResize = () => {
      sectionRect = null;
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid = ({ children, gridRef }) => (
  <div className="card-grid bento-section" ref={gridRef}>
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

/* ─────────────────────────────────────────────────────────────────
   MAGIC BENTO MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
const MagicBento = ({
  cards = defaultThingsCards,
  textAutoHide = false,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true
}) => {
  const { triggerCardEntry } = useNavigation();
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        {cards.map((card, index) => {
          const isInteractive = Boolean(CARD_ROUTES[card.id]);
          const spanClass = card.gridSpan || '';
          const hierarchyClass = card.hierarchy ? `bento-card--${card.hierarchy}` : '';
          const baseClassName = `magic-bento-card ${spanClass} ${hierarchyClass} ${
            textAutoHide ? 'magic-bento-card--text-autohide' : ''
          } ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''} ${
            isInteractive ? 'magic-bento-card--interactive' : ''
          }`;

          const handleCardClick = (e) => {
            if (isInteractive) {
              triggerCardEntry(card, e.currentTarget);
            }
          };

          const cardProps = {
            className: baseClassName,
            'data-card-id': card.id,
            tabIndex: isInteractive ? 0 : undefined,
            role: isInteractive ? 'button' : undefined,
            'aria-label': isInteractive ? `Open ${card.title} dedicated experience` : undefined,
            onClick: handleCardClick,
            onKeyDown: isInteractive
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    triggerCardEntry(card, e.currentTarget);
                  }
                }
              : undefined,
            style: {
              '--glow-rgb': glowColor,
              '--glow-color': glowColor
            }
          };

          const cardContent = (
            <>
              {/* Header: Label / Index tag + micro visual detail */}
              <div className="magic-bento-card__header">
                <span className="magic-bento-card__label">
                  {card.label}
                  {isInteractive && (
                    <span className="magic-bento-card__enter-cue" aria-hidden="true"> ↗</span>
                  )}
                </span>
                {card.microVisual && <CardMicroVisual type={card.microVisual} />}
              </div>

              {/* Content: Title (always visible) + description (brightens on hover) */}
              <div className="magic-bento-card__content">
                <h3 className="magic-bento-card__title" data-card-id={card.id}>{card.title}</h3>
                <p className="magic-bento-card__description">{card.description}</p>
              </div>
            </>
          );

          if (enableStars) {
            return (
              <ParticleCard
                key={card.id || index}
                {...cardProps}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                {cardContent}
              </ParticleCard>
            );
          }

          return (
            <div key={card.id || index} {...cardProps}>
              {cardContent}
            </div>
          );
        })}
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
