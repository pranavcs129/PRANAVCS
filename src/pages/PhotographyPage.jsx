import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigation } from '../context/useNavigation';
import DriftWall from '../components/DriftWall';
import { PHOTOGRAPHY_ITEMS } from '../data/photographyData';
import './PhotographyPage.css';

export default function PhotographyPage() {
  const { triggerCardExit } = useNavigation();
  const pageRef = useRef(null);
  const wallRef = useRef(null);

  // Responsive column count
  const [columns, setColumns] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 800) {
      return 3;
    }
    return 5;
  });

  useEffect(() => {
    const handleResize = () => {
      setColumns(window.innerWidth < 800 ? 3 : 5);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Settle naturally after the card transition completes without any extra loader
    if (wallRef.current) {
      gsap.fromTo(
        wallRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.65, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, []);

  return (
    <div ref={pageRef} className="skill-page photography-page">
      <div className="skill-page__atmosphere" aria-hidden="true" />

      {/* Subtle back navigation */}
      <nav className="skill-page__nav photography-nav">
        <button
          className="skill-back-btn"
          onClick={triggerCardExit}
          aria-label="Return to Things I Somehow Know"
        >
          <span className="back-arrow">←</span>
          <span className="back-label">SOMEHOW KNOW</span>
        </button>
      </nav>

      {/* Minimal opening header */}
      <header className="photography-hero">
        <h1 className="photography-hero__title">PHOTOGRAPHY</h1>
        <p className="photography-hero__quote">
          &ldquo;point camera at tiny thing.
          <br />
          immediately forget what time it is.&rdquo;
        </p>
      </header>

      {/* Main DriftWall Visual Experience */}
      <main ref={wallRef} className="photography-wall-wrapper" aria-label="Visual Archive Wall">
        <DriftWall
          items={PHOTOGRAPHY_ITEMS}
          columns={columns}
          tileWidth={220}
          tileHeight={150}
          gap={22}
          tilt={12}
          turn={-10}
          perspective={1400}
          depth={100}
          speed={26}
          direction="up"
          variance={0.35}
          parallax={0.35}
          lift={48}
          fade={0.55}
          dim={0.72}
          grayscale={false}
          overlayColor="#08070b"
        />
      </main>
    </div>
  );
}
