import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigation } from '../context/useNavigation';
import './VibeCodingPage.css';

export default function VibeCodingPage() {
  const { triggerCardExit } = useNavigation();
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, []);

  return (
    <div className="skill-page vibe-coding-page">
      <div className="skill-page__atmosphere" aria-hidden="true" />

      {/* Top Navigation */}
      <nav className="skill-page__nav">
        <button
          className="skill-back-btn"
          onClick={triggerCardExit}
          aria-label="Return to Things I Somehow Know"
        >
          <span className="back-arrow">←</span>
          <span className="back-label">SOMEHOW KNOW</span>
        </button>
        <span className="skill-nav-tag">ENTRY / 06</span>
      </nav>

      <main className="skill-page__main">
        {/* Editorial Hero */}
        <header className="skill-hero">
          <span className="skill-hero__label">06 / INTUITION &amp; FLOW</span>
          <h1 className="skill-hero__title">VIBE CODING</h1>
          <p className="skill-hero__statement">
            "tell the computer what I mean and hope for the best."
          </p>
        </header>

        {/* Vibe Coding Experience Body */}
        <div ref={contentRef} className="vibe-experience">
          {/* The Cycle Sequence Banner */}
          <section className="vibe-cycle-banner" aria-label="The build loop">
            <span className="cycle-step">IDEA</span>
            <span className="cycle-arrow">→</span>
            <span className="cycle-step">PROMPT</span>
            <span className="cycle-arrow">→</span>
            <span className="cycle-step">CODE</span>
            <span className="cycle-arrow">→</span>
            <span className="cycle-step is-highlight">BROKEN</span>
            <span className="cycle-arrow">→</span>
            <span className="cycle-step">FIX</span>
            <span className="cycle-arrow">→</span>
            <span className="cycle-step is-highlight">SOMEHOW WORKS</span>
            <span className="cycle-arrow">→</span>
            <span className="cycle-step">ONE MORE CHANGE</span>
            <span className="cycle-arrow">→</span>
            <span className="cycle-step">FINISHED</span>
          </section>

          {/* Real Experiments & Projects Grid */}
          <section className="vibe-experiments-grid" aria-label="Experiments">
            <article className="vibe-card">
              <div className="vibe-card__top">
                <span className="vibe-tag">EXPERIMENT 01</span>
                <span className="vibe-status">SHIPPED &amp; ALIVE</span>
              </div>
              <h2 className="vibe-card__title">The 3D Kinetic Neural Cortex</h2>
              <div className="vibe-card__prompt-box">
                <span className="prompt-prefix">&gt;</span>
                "make the brain feel like entering someone's living biological cortex at 2 AM, but keep it at 60 FPS"
              </div>
              <p className="vibe-card__notes">
                Spent 4 days fighting memory leaks, single master RAF sync, and WebGL depth slicing.
                Now 4 depth planes of axons breathe in tandem with ScrollTrigger.
              </p>
            </article>

            <article className="vibe-card">
              <div className="vibe-card__top">
                <span className="vibe-tag">EXPERIMENT 02</span>
                <span className="vibe-status">SURVIVED</span>
              </div>
              <h2 className="vibe-card__title">Falling Thoughts Crash Sequence</h2>
              <div className="vibe-card__prompt-box">
                <span className="prompt-prefix">&gt;</span>
                "thoughts should fall naturally across the black void and crash into the bento cards, but REMOVE THE SMOKE COMPLETELY"
              </div>
              <p className="vibe-card__notes">
                Subtle tactile scale punch on impact, 0ms delayed reveal, zero smoke layer.
                The card title catches the falling word directly out of the sky.
              </p>
            </article>
          </section>

          {/* Terminal Reality Log */}
          <section className="terminal-reality" aria-label="Authentic terminal log">
            <div className="terminal-titlebar">
              <div className="term-dot" />
              <span>TERMINAL / REALITY CHECK</span>
            </div>
            <div className="term-line term-green">&gt; git status</div>
            <div className="term-line">On branch main · Your branch is ahead of 'origin/main' by 14 commits.</div>
            <div className="term-line term-yellow">&gt; git log --oneline -n 4</div>
            <div className="term-line">e8f2a1b (HEAD -&gt; main) one more tiny adjustment</div>
            <div className="term-line">c4b9d03 why is this working now</div>
            <div className="term-line">a19e482 do not touch this function</div>
            <div className="term-line">88ef019 initial vibe coding session</div>
            <div className="term-line term-pink">&gt; npm run dev -- --host</div>
            <div className="term-line term-green">✓ Ready in 180ms · Vibe check passed</div>
          </section>
        </div>
      </main>
    </div>
  );
}
