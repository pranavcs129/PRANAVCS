import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigation } from '../context/useNavigation';
import './CardTransitionOverlay.css';

export default function CardTransitionOverlay() {
  const { transitionState, completeCardEntry, completeCardExit } = useNavigation();
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  const { phase, cardId, cardData, sourceRect } = transitionState;

  useEffect(() => {
    if (!overlayRef.current || !cardData) return;

    const overlay = overlayRef.current;
    const title = titleRef.current;
    const desc = descRef.current;

    // Elements on the main page to quiet down
    const surroundingCards = Array.from(document.querySelectorAll('.magic-bento-card'))
      .filter((el) => el.getAttribute('data-card-id') !== cardId);
    const bentoHeader = document.querySelector('.things-header');
    const sourceCard = document.querySelector(`.magic-bento-card[data-card-id="${cardId}"]`);

    if (phase === 'expanding') {
      const startRect = sourceRect || (sourceCard ? sourceCard.getBoundingClientRect() : null);

      if (!startRect) {
        completeCardEntry();
        return;
      }

      // Step 1: Surrounding cards become quieter
      gsap.to(surroundingCards, {
        opacity: 0.15,
        scale: 0.96,
        duration: 0.35,
        ease: 'power2.out',
      });

      if (bentoHeader) {
        gsap.to(bentoHeader, {
          opacity: 0.15,
          duration: 0.35,
          ease: 'power2.out',
        });
      }

      // Step 2: Initialize overlay at exact card coordinates
      gsap.set(overlay, {
        top: startRect.top,
        left: startRect.left,
        width: startRect.width,
        height: startRect.height,
        borderRadius: '20px',
        opacity: 1,
      });

      // Temporarily hide source card to avoid duplicate ghost
      if (sourceCard) {
        sourceCard.style.opacity = '0';
      }

      // Step 3: Expand overlay toward viewport
      const tl = gsap.timeline({
        onComplete: () => {
          completeCardEntry();
        },
      });

      tl.to(overlay, {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: '0px',
        duration: 0.65,
        ease: 'power3.inOut',
      }, 0);

      // Title glides and expands smoothly
      if (title) {
        tl.to(title, {
          fontSize: 'clamp(2.2rem, 5.2vw, 4.4rem)',
          letterSpacing: '0.04em',
          duration: 0.65,
          ease: 'power3.inOut',
        }, 0);
      }

      // Description softly fades as page reveals its own deep content
      if (desc) {
        tl.to(desc, {
          opacity: 0.4,
          duration: 0.45,
          ease: 'power2.out',
        }, 0.2);
      }
    } else if (phase === 'collapsing') {
      const returnRect = sourceCard ? sourceCard.getBoundingClientRect() : sourceRect;

      if (!returnRect) {
        if (sourceCard) sourceCard.style.opacity = '1';
        completeCardExit();
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (sourceCard) {
            sourceCard.style.opacity = '1';
          }
          // Restore surrounding cards and header
          gsap.to(surroundingCards, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: 'power2.out',
          });
          if (bentoHeader) {
            gsap.to(bentoHeader, {
              opacity: 1,
              duration: 0.35,
              ease: 'power2.out',
            });
          }
          completeCardExit();
        },
      });

      tl.to(overlay, {
        top: returnRect.top,
        left: returnRect.left,
        width: returnRect.width,
        height: returnRect.height,
        borderRadius: '20px',
        duration: 0.55,
        ease: 'power3.inOut',
      }, 0);

      if (title) {
        tl.to(title, {
          fontSize: 'clamp(1.25rem, 1.05rem + 0.6vw, 1.75rem)',
          letterSpacing: '0.03em',
          duration: 0.55,
          ease: 'power3.inOut',
        }, 0);
      }

      if (desc) {
        tl.to(desc, {
          opacity: 1,
          duration: 0.35,
          ease: 'power2.in',
        }, 0.2);
      }
    }
  }, [phase, cardId, cardData, sourceRect, completeCardEntry, completeCardExit]);

  if (phase === 'idle' || !cardData) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`card-transition-overlay ${phase === 'active' ? 'is-fullscreen' : ''}`}
      aria-hidden="true"
    >
      <div className="card-transition-overlay__header">
        <span className="card-transition-overlay__label">{cardData.label}</span>
      </div>

      <div className="card-transition-overlay__content">
        <h3 ref={titleRef} className="card-transition-overlay__title">
          {cardData.title}
        </h3>
        <p ref={descRef} className="card-transition-overlay__description">
          {cardData.description}
        </p>
      </div>
    </div>
  );
}
