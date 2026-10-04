import { useEffect, useRef } from 'react';
import { runLoader } from '../animations/introAnimations';
import './Loader.css';

export default function Loader({ onComplete }) {
  const counterRef = useRef(null);
  const loaderRef  = useRef(null);

  useEffect(() => {
    runLoader(counterRef.current, loaderRef.current).then(onComplete);
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="loader" aria-hidden="true">
      <div className="loader__counter-wrap">
        <span ref={counterRef} className="loader__counter">0</span>
        <span className="loader__percent">%</span>
      </div>
    </div>
  );
}
