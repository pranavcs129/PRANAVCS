import { forwardRef } from 'react';
import './Intro.css';

/**
 * Intro — first scroll-driven section.
 *
 * Deliberately sparse. Two text fragments that act as a question,
 * not an answer. The GSAP ScrollTrigger in introAnimations.js
 * drives the reveal as the user scrolls in.
 *
 * This section will be expanded in later stages.
 */
const Intro = forwardRef(function Intro(_, ref) {
  return (
    <section ref={ref} className="intro" aria-label="Introduction">
      <div className="intro__inner">
        <p className="intro-line intro__hook">So…</p>
        <h2 className="intro-line intro__question">Who is this guy?</h2>
      </div>
    </section>
  );
});

export default Intro;
