import { useState, useCallback } from 'react';
import Loader from './components/Loader';
import IdentityReveal from './components/IdentityReveal';
import WhoIsThisGuy from './sections/WhoIsThisGuy';
import CurrentlyCooking from './sections/CurrentlyCooking';
import BrainEntry from './sections/BrainEntry';
import BrainInterior from './sections/BrainInterior';
import ThingsIKnow from './sections/ThingsIKnow';
import { NavigationProvider } from './context/NavigationContext';
import { useNavigation } from './context/useNavigation';
import { ROUTES } from './router/routes';
import CardTransitionOverlay from './components/CardTransitionOverlay';
import PhotographyPage from './pages/PhotographyPage';
import VideoEditingPage from './pages/VideoEditingPage';
import VibeCodingPage from './pages/VibeCodingPage';
import './index.css';

/**
 * AppContent — handles routing between the home cinematic journey
 * and dedicated skill pages with smooth card-entry transitions.
 */
function AppContent() {
  const { currentPath, isSkillPage, transitionState } = useNavigation();

  // If user lands directly on a skill route, bypass initial home loader
  const [phase, setPhase] = useState(() => (isSkillPage ? 'identity' : 'loading'));

  const handleLoaderComplete = useCallback(() => {
    setPhase('identity');
  }, []);

  // Determine which skill page to show when on a dedicated route
  const renderSkillPage = () => {
    if (!isSkillPage && transitionState.phase !== 'active') return null;

    if (currentPath === ROUTES.PHOTOGRAPHY || transitionState.targetPath === ROUTES.PHOTOGRAPHY) {
      return <PhotographyPage />;
    }
    if (currentPath === ROUTES.VIDEO_EDITING || transitionState.targetPath === ROUTES.VIDEO_EDITING) {
      return <VideoEditingPage />;
    }
    if (currentPath === ROUTES.VIBE_CODING || transitionState.targetPath === ROUTES.VIBE_CODING) {
      return <VibeCodingPage />;
    }
    return null;
  };

  return (
    <main>
      {phase === 'loading' && (
        <Loader onComplete={handleLoaderComplete} />
      )}

      {/* Main Home Experience — preserved underneath so scroll position & WebGL brain remain intact */}
      {phase === 'identity' && (
        <>
          <IdentityReveal />
          <WhoIsThisGuy />
          <CurrentlyCooking />
          <BrainEntry />
          <BrainInterior />
          <ThingsIKnow />
        </>
      )}

      {/* Card Transition Morph Overlay */}
      <CardTransitionOverlay />

      {/* Dedicated Skill Page View */}
      {(isSkillPage || transitionState.phase === 'active') && renderSkillPage()}
    </main>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}
