import { useContext } from 'react';
import { NavigationContext } from './navigation-context';

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return ctx;
}

export default useNavigation;
