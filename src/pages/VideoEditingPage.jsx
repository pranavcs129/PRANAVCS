import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigation } from '../context/useNavigation';
import './VideoEditingPage.css';

export default function VideoEditingPage() {
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
    <div className="skill-page video-editing-page">
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
        <span className="skill-nav-tag">ENTRY / 03</span>
      </nav>

      <main className="skill-page__main">
        {/* Editorial Hero */}
        <header className="skill-hero">
          <span className="skill-hero__label">03 / TIME &amp; PACING</span>
          <h1 className="skill-hero__title">VIDEO EDITING</h1>
          <p className="skill-hero__statement">
            "one more tiny adjustment."
          </p>
        </header>

        {/* Video Editing Experience Body */}
        <div ref={contentRef} className="editing-experience">
          {/* Master Timeline Console */}
          <section className="timeline-console" aria-label="Editing timeline console">
            <div className="timecode-bar">
              <div className="tc-readout">
                <span className="tc-label">PLAYHEAD TC</span>
                <span className="tc-digits">00:01:24:18</span>
              </div>
              <div className="tc-meta">
                <span className="tc-badge">23.976 FPS</span>
                <span className="tc-badge">4K DCI · PRORES 422 HQ</span>
                <span className="tc-badge">J-CUT ENGAGED</span>
              </div>
            </div>

            {/* Multi-Track Editor Strip */}
            <div className="timeline-tracks-wrap">
              <div className="time-ruler">
                <span>00:00</span>
                <span>00:30</span>
                <span>01:00</span>
                <span>01:24:18 (PLAYHEAD)</span>
                <span>02:00</span>
                <span>02:30</span>
              </div>

              {/* V2 Cutaway */}
              <div className="timeline-track-row">
                <span className="track-identifier">V2 · B-ROLL</span>
                <div className="track-lane">
                  <div className="timeline-clip-block clip--v2" style={{ marginLeft: '18%' }}>
                    MACRO_WATER_DROPLET_120FPS.MOV
                  </div>
                </div>
              </div>

              {/* V1 Hero Footage */}
              <div className="timeline-track-row">
                <span className="track-identifier">V1 · HERO</span>
                <div className="track-lane">
                  <div className="timeline-clip-block clip--v1">
                    SCENE_04_WIDE_ESTABLISHING.BRAW
                  </div>
                  <div className="timeline-clip-block clip--v3">
                    SCENE_04_CU_INSPECTION.BRAW
                  </div>
                </div>
              </div>

              {/* A1 Atmosphere Sound */}
              <div className="timeline-track-row">
                <span className="track-identifier">A1 · ATMO</span>
                <div className="track-lane">
                  <div className="timeline-clip-block clip--a1">
                    ROOM_TONE_ANALOG_HUM_48K.WAV
                  </div>
                </div>
              </div>

              {/* A2 Foley & Music */}
              <div className="timeline-track-row">
                <span className="track-identifier">A2 · FOLEY</span>
                <div className="track-lane">
                  <div className="timeline-clip-block clip--a2" style={{ marginLeft: '40%' }}>
                    SUB_IMPACT_AND_REVERB_TAIL.WAV
                  </div>
                </div>
              </div>

              {/* The Playhead Needle */}
              <div className="timeline-playhead-line" aria-hidden="true">
                <div className="playhead-marker" />
              </div>
            </div>
          </section>

          {/* Editing Philosophy Principles */}
          <section className="editing-philosophy-grid" aria-label="Editing principles">
            <article className="editing-card">
              <span className="editing-card__tag">PRINCIPLE 01</span>
              <h3 className="editing-card__heading">The Rhythm of Breathing</h3>
              <p className="editing-card__desc">
                A cut isn't just where two clips collide. It's the inhalation between two sentences. If the rhythm doesn't breathe, the viewer's subconscious gets tired before the story even begins.
              </p>
            </article>

            <article className="editing-card">
              <span className="editing-card__tag">PRINCIPLE 02</span>
              <h3 className="editing-card__heading">The Invisible Two Frames</h3>
              <p className="editing-card__desc">
                Nudging an audio transient two frames earlier transforms a jarring transition into an instinctive realization. Nobody consciously notices; everybody feels it.
              </p>
            </article>

            <article className="editing-card">
              <span className="editing-card__tag">PRINCIPLE 03</span>
              <h3 className="editing-card__heading">Kill Your Darlings</h3>
              <p className="editing-card__desc">
                The most gorgeous shot you spent 6 hours lighting has to be cut if it slows down the momentum by 1.4 seconds. Ruthless brevity wins every time.
              </p>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
