import BrainArtwork from '../components/BrainArtwork';
import './BrainShowcase.css';

/**
 * BrainShowcase — Dedicated Showcase Section for the Brain Artwork Centerpiece.
 *
 * Sits naturally in the page flow between CurrentlyCooking and ThingsIKnow.
 * Follows all project guidelines:
 *   - Normal document flow (no extra ScrollTrigger, no scroll listeners, no pinning).
 *   - Allows pristine inspection of the sculptural brain artwork.
 *   - Dark cinematic aesthetic matching the site's design system.
 */
export default function BrainShowcase() {
  return (
    <section className="brain-showcase-section" aria-label="Brain Artwork Centerpiece">
      <div className="brain-showcase-inner">
        <header className="brain-showcase-header">
          <span className="brain-showcase-tag">CENTERPIECE // STAGE PREVIEW</span>
          <h2 className="brain-showcase-title">THE BRAIN</h2>
        </header>

        <div className="brain-showcase-stage">
          <BrainArtwork />
        </div>

        <footer className="brain-showcase-footer">
          <span className="brain-showcase-coord">LATERAL PROFILE — 3/4 AXON VECTOR MATRIX</span>
        </footer>
      </div>
    </section>
  );
}
