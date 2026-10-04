import { useState, useEffect, useCallback, useRef } from 'react';
import { ROUTES, CARD_ROUTES, isSkillRoute } from '../router/routes';
import { NavigationContext } from './navigation-context';

export function NavigationProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.replace(/\/$/, '') || '/';
      return p;
    }
    return ROUTES.HOME;
  });

  const [transitionState, setTransitionState] = useState({
    phase: 'idle', // 'idle' | 'expanding' | 'active' | 'collapsing'
    cardId: null,
    cardData: null,
    sourceRect: null,
    targetPath: null,
  });

  const cardElementRef = useRef(null);
  const transitionStateRef = useRef(transitionState);

  useEffect(() => {
    transitionStateRef.current = transitionState;
  }, [transitionState]);

  // Trigger smooth return back to Bento
  const triggerCardExit = useCallback(() => {
    const currentState = transitionStateRef.current;
    let rect = currentState.sourceRect;
    if (cardElementRef.current) {
      rect = cardElementRef.current.getBoundingClientRect();
    } else if (currentState.cardId) {
      const el = document.querySelector(`.magic-bento-card[data-card-id="${currentState.cardId}"]`);
      if (el) rect = el.getBoundingClientRect();
    }

    setTransitionState((prev) => ({
      ...prev,
      phase: 'collapsing',
      sourceRect: rect,
    }));
  }, []);

  const triggerCardExitRef = useRef(triggerCardExit);
  useEffect(() => {
    triggerCardExitRef.current = triggerCardExit;
  }, [triggerCardExit]);

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      if (path === ROUTES.HOME && transitionStateRef.current.phase === 'active') {
        triggerCardExitRef.current();
      } else {
        setCurrentPath(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Trigger smooth card expansion into dedicated skill page
  const triggerCardEntry = useCallback((card, cardElement) => {
    const targetPath = CARD_ROUTES[card.id];
    if (!targetPath) return;

    cardElementRef.current = cardElement;
    const rect = cardElement ? cardElement.getBoundingClientRect() : null;

    setTransitionState({
      phase: 'expanding',
      cardId: card.id,
      cardData: {
        id: card.id,
        title: card.title,
        label: card.label,
        description: card.description,
        glowColor: card.glowColor || '220, 205, 190',
      },
      sourceRect: rect,
      targetPath,
    });
  }, []);

  // Called when expansion animation finishes
  const completeCardEntry = useCallback(() => {
    const currentTarget = transitionStateRef.current.targetPath;
    if (currentTarget) {
      window.history.pushState(null, '', currentTarget);
      setCurrentPath(currentTarget);
      setTransitionState((prev) => ({
        ...prev,
        phase: 'active',
      }));
    }
  }, []);

  // Called when collapse animation finishes
  const completeCardExit = useCallback(() => {
    window.history.pushState(null, '', ROUTES.HOME);
    setCurrentPath(ROUTES.HOME);
    setTransitionState({
      phase: 'idle',
      cardId: null,
      cardData: null,
      sourceRect: null,
      targetPath: null,
    });
    cardElementRef.current = null;
  }, []);

  // Direct navigation without card transition (e.g. if loaded directly)
  const navigateDirect = useCallback((toPath) => {
    window.history.pushState(null, '', toPath);
    setCurrentPath(toPath);
    setTransitionState({
      phase: 'idle',
      cardId: null,
      cardData: null,
      sourceRect: null,
      targetPath: null,
    });
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentPath,
        isSkillPage: isSkillRoute(currentPath),
        transitionState,
        triggerCardEntry,
        completeCardEntry,
        triggerCardExit,
        completeCardExit,
        navigateDirect,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export default NavigationProvider;
