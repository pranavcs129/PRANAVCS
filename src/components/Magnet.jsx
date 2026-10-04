'use client';

import { useEffect, useRef } from 'react';

/**
 * Magnet — High-Performance Magnetic Physics Component.
 *
 * Uses direct DOM manipulation via requestAnimationFrame instead of React state
 * to prevent unnecessary component re-renders on mousemove.
 *
 * Layered depth:
 * - Inner content moves by (offsetX, offsetY) [typically 3–8px]
 * - Any supporting visual marked with .who-magnet-visual or .magnet-visual
 *   moves by (offsetX * visualFactor, offsetY * visualFactor) [typically 1–3px]
 *
 * Automatically disabled on touch / coarse-pointer devices.
 */
const Magnet = ({
  children,
  padding = 90,
  disabled = false,
  magnetStrength = 16,
  maxMovement = 8,
  visualFactor = 0.4,
  activeTransition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
  inactiveTransition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
  wrapperClassName = '',
  innerClassName = '',
  style = {},
  ...props
}) => {
  const magnetRef = useRef(null);
  const innerRef  = useRef(null);

  useEffect(() => {
    // Gracefully disable on touch / coarse pointer devices
    const isTouch = typeof window !== 'undefined' &&
      window.matchMedia?.('(hover: none), (pointer: coarse)').matches;
    if (disabled || isTouch) return;

    const magnetEl = magnetRef.current;
    const innerEl  = innerRef.current;
    if (!magnetEl || !innerEl) return;

    let visualEl = magnetEl.querySelector('.who-magnet-visual, .magnet-visual');
    let rafId = null;
    let isIntersecting = false;
    let isAtRest = true;
    let cachedRect = null;

    const updateRect = () => {
      if (!magnetEl || !isIntersecting) return;
      const { left, top, width, height } = magnetEl.getBoundingClientRect();
      cachedRect = {
        centerX: left + width / 2,
        centerY: top + height / 2,
        halfW: width / 2,
        halfH: height / 2,
      };
    };

    const setTransitions = (transition) => {
      innerEl.style.transition = transition;
      if (visualEl) visualEl.style.transition = transition;
    };

    setTransitions(inactiveTransition);

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        updateRect();
      } else if (!isAtRest) {
        setTransitions(inactiveTransition);
        innerEl.style.transform = 'translate3d(0px, 0px, 0px)';
        if (visualEl) visualEl.style.transform = 'translate3d(0px, 0px, 0px)';
        isAtRest = true;
      }
    }, { threshold: 0 });
    observer.observe(magnetEl);

    const handleMouseMove = (e) => {
      if (!isIntersecting) return;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!magnetEl || !innerEl || !isIntersecting) return;
        if (!cachedRect) updateRect();
        if (!cachedRect) return;

        if (!visualEl) visualEl = magnetEl.querySelector('.who-magnet-visual, .magnet-visual');

        const distX = Math.abs(cachedRect.centerX - e.clientX);
        const distY = Math.abs(cachedRect.centerY - e.clientY);

        if (distX < cachedRect.halfW + padding && distY < cachedRect.halfH + padding) {
          isAtRest = false;
          setTransitions(activeTransition);

          const rawX = (e.clientX - cachedRect.centerX) / magnetStrength;
          const rawY = (e.clientY - cachedRect.centerY) / magnetStrength;

          // Target movement: approximately 3–8px
          const offsetX = Math.max(-maxMovement, Math.min(maxMovement, rawX));
          const offsetY = Math.max(-maxMovement, Math.min(maxMovement, rawY));

          innerEl.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;

          // Layered physical depth: visual moves ~1–4px
          if (visualEl) {
            visualEl.style.transform = `translate3d(${offsetX * visualFactor}px, ${offsetY * visualFactor}px, 0)`;
          }
        } else if (!isAtRest) {
          setTransitions(inactiveTransition);
          innerEl.style.transform = 'translate3d(0px, 0px, 0px)';
          if (visualEl) {
            visualEl.style.transform = 'translate3d(0px, 0px, 0px)';
          }
          isAtRest = true;
        }
      });
    };

    const handleMouseLeave = () => {
      if (!isAtRest) {
        setTransitions(inactiveTransition);
        innerEl.style.transform = 'translate3d(0px, 0px, 0px)';
        if (visualEl) {
          visualEl.style.transform = 'translate3d(0px, 0px, 0px)';
        }
        isAtRest = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', updateRect, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', updateRect);
    };
  }, [padding, disabled, magnetStrength, maxMovement, visualFactor, activeTransition, inactiveTransition]);

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block', ...style }}
      {...props}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{
          width: '100%',
          height: '100%',
          transform: 'translate3d(0px, 0px, 0px)',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
