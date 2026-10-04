import brainAsset from '../assets/human-brain.png';
import './BrainArtwork.css';

/**
 * BrainArtwork — Anatomically Authentic Human Brain Centerpiece.
 *
 * Performance-optimized:
 *   - Removed expensive SVG feGaussianBlur filters that caused lag when scaling.
 *   - Removed CSS drop-shadow on the 780x780 image layer.
 *   - Luminous nodes use lightweight layered SVG circles for soft glow at 0ms GPU cost.
 */
export default function BrainArtwork({ className = '', style = {} }) {
  return (
    <div className={`brain-artwork-container ${className}`} style={style}>
      <svg
        className="brain-artwork-svg"
        viewBox="0 0 960 840"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Anatomically authentic human brain cortical centerpiece"
      >
        <defs>
          {/* Atmospheric Aura & Illumination */}
          <radialGradient id="auraGlow" cx="50%" cy="47%" r="52%">
            <stop offset="0%" stopColor="#F6EFE3" stopOpacity="0.22" />
            <stop offset="28%" stopColor="#9682AC" stopOpacity="0.14" />
            <stop offset="60%" stopColor="#2E1B3D" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="coreGlow" cx="48%" cy="45%" r="44%">
            <stop offset="0%" stopColor="#FFE7C4" stopOpacity="0.25" />
            <stop offset="35%" stopColor="#8C74A2" stopOpacity="0.15" />
            <stop offset="70%" stopColor="#352248" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── GROUP 1: ATMOSPHERE ── */}
        <g id="brain-atmosphere" className="brain-atmosphere">
          <ellipse cx="480" cy="405" rx="440" ry="345" fill="url(#auraGlow)" />
          <ellipse cx="476" cy="385" rx="340" ry="265" fill="url(#coreGlow)" />

          <circle cx="160" cy="210" r="2.0" fill="#F6EFE3" opacity="0.45" className="ambient-dust-mote" />
          <circle cx="800" cy="230" r="2.2" fill="#E8DFD1" opacity="0.48" className="ambient-dust-mote" />
          <circle cx="230" cy="630" r="1.6" fill="#C8BCD4" opacity="0.38" className="ambient-dust-mote" />
          <circle cx="735" cy="610" r="2.0" fill="#F6EFE3" opacity="0.42" className="ambient-dust-mote" />
          <circle cx="480" cy="85"  r="1.8" fill="#E8DFD1" opacity="0.52" className="ambient-dust-mote" />
          <circle cx="845" cy="415" r="1.6" fill="#D0C4DC" opacity="0.35" className="ambient-dust-mote" />
          <circle cx="115" cy="425" r="1.8" fill="#E8DFD1" opacity="0.38" className="ambient-dust-mote" />
        </g>

        {/* ── GROUP 2: AUTHENTIC ANATOMICAL HUMAN BRAIN (Single Optimized 2D Layer) ── */}
        <g id="brain-base" className="brain-base">
          <image
            href={brainAsset}
            x="90"
            y="10"
            width="780"
            height="780"
            preserveAspectRatio="xMidYMid meet"
            className="brain-anatomical-image"
          />
        </g>

        {/* ── GROUP 3: SUBTLE NEURAL PATHWAYS (Axons resting atop the anatomy) ── */}
        <g id="neural-paths" className="neural-paths">
          {/* Left Hemisphere Axon Highway */}
          <path
            d="M 270 240
               C 310 260, 345 250, 375 285
               C 405 320, 385 365, 420 395
               C 445 415, 465 400, 480 425"
            stroke="#FFF6E5" strokeWidth="1.4" strokeLinecap="round" className="axon-path axon-primary"
          />
          <path
            d="M 230 330
               C 265 350, 295 330, 325 365
               C 355 400, 335 440, 370 470"
            stroke="#DCD0EB" strokeWidth="1.1" strokeDasharray="4 3" strokeLinecap="round" className="axon-path axon-secondary"
          />
          <path
            d="M 310 440
               C 340 470, 380 460, 410 490
               C 435 515, 420 550, 445 570"
            stroke="#FFF6E5" strokeWidth="1.3" strokeLinecap="round" className="axon-path axon-primary"
          />

          {/* Interhemispheric Axon Bridges across Longitudinal Fissure */}
          <path
            d="M 435 270 C 465 285, 495 285, 525 270"
            stroke="#FFFBF0" strokeWidth="1.6" strokeLinecap="round" className="axon-path axon-bridge"
          />
          <path
            d="M 440 375 C 468 390, 492 390, 520 375"
            stroke="#F6EFE3" strokeWidth="1.5" strokeLinecap="round" className="axon-path axon-bridge"
          />
          <path
            d="M 445 470 C 470 485, 490 485, 515 470"
            stroke="#E2D4EE" strokeWidth="1.3" strokeDasharray="5 3" strokeLinecap="round" className="axon-path axon-bridge"
          />

          {/* Right Hemisphere Axon Highway */}
          <path
            d="M 690 240
               C 650 260, 615 250, 585 285
               C 555 320, 575 365, 540 395
               C 515 415, 495 400, 480 425"
            stroke="#FFF6E5" strokeWidth="1.4" strokeLinecap="round" className="axon-path axon-primary"
          />
          <path
            d="M 730 330
               C 695 350, 665 330, 635 365
               C 605 400, 625 440, 590 470"
            stroke="#DCD0EB" strokeWidth="1.1" strokeDasharray="4 3" strokeLinecap="round" className="axon-path axon-secondary"
          />
          <path
            d="M 650 440
               C 620 470, 580 460, 550 490
               C 525 515, 540 550, 515 570"
            stroke="#FFF6E5" strokeWidth="1.3" strokeLinecap="round" className="axon-path axon-primary"
          />
        </g>

        {/* ── GROUP 4: SUBTLE SYNAPTIC NODES (Lightweight layered circles) ── */}
        <g id="neural-nodes" className="neural-nodes">
          {/* Left Synaptic Junctions */}
          <circle cx="270" cy="240" r="7.0" fill="#FFFBF0" opacity="0.25" />
          <circle cx="270" cy="240" r="3.4" fill="#FFFBF0" className="synaptic-node" />
          <circle cx="375" cy="285" r="2.8" fill="#FFE5B4" className="synaptic-node" />
          <circle cx="420" cy="395" r="7.5" fill="#FFF8EB" opacity="0.25" />
          <circle cx="420" cy="395" r="3.6" fill="#FFF8EB" className="synaptic-node" />
          <circle cx="325" cy="365" r="2.5" fill="#E8DCF4" className="synaptic-node" />
          <circle cx="410" cy="490" r="6.5" fill="#FFFBF0" opacity="0.25" />
          <circle cx="410" cy="490" r="3.2" fill="#FFFBF0" className="synaptic-node" />

          {/* Central Hubs */}
          <circle cx="480" cy="278" r="8.0" fill="#FFEACC" opacity="0.3" />
          <circle cx="480" cy="278" r="4.0" fill="#FFEACC" className="synaptic-node" />
          <circle cx="480" cy="382" r="8.0" fill="#FFFBF0" opacity="0.3" />
          <circle cx="480" cy="382" r="3.8" fill="#FFFBF0" className="synaptic-node" />
          <circle cx="480" cy="478" r="7.0" fill="#E4D6F2" opacity="0.3" />
          <circle cx="480" cy="478" r="3.4" fill="#E4D6F2" className="synaptic-node" />

          {/* Right Synaptic Junctions */}
          <circle cx="690" cy="240" r="3.4" fill="#FFE5B4" className="synaptic-node" />
          <circle cx="585" cy="285" r="2.8" fill="#E8DCF4" className="synaptic-node" />
          <circle cx="540" cy="395" r="7.5" fill="#FFF8EB" opacity="0.25" />
          <circle cx="540" cy="395" r="3.6" fill="#FFF8EB" className="synaptic-node" />
          <circle cx="635" cy="365" r="2.5" fill="#E4D6F2" className="synaptic-node" />
          <circle cx="550" cy="490" r="6.5" fill="#FFFBF0" opacity="0.25" />
          <circle cx="550" cy="490" r="3.2" fill="#FFFBF0" className="synaptic-node" />
        </g>
      </svg>
    </div>
  );
}
