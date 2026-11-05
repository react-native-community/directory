import { useRouter } from 'next/router';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  use,
  useEffect,
  useMemo,
  useState,
} from 'react';

type QuickSearchState = {
  isExpanded: boolean;
  isNavigating: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
};

const QuickSearchStateContext = createContext<QuickSearchState | null>(null);

export function QuickSearchStateProvider({ children }: PropsWithChildren) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  useEffect(() => {
    function handleBeforeHistoryChange() {
      setIsNavigating(true);
    }

    function handleRouteChangeComplete() {
      setIsNavigating(false);
      setIsExpanded(false);
      setSearchValue('');
    }

    function handleRouteChangeError() {
      setIsNavigating(false);
    }

    router.events.on('beforeHistoryChange', handleBeforeHistoryChange);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('beforeHistoryChange', handleBeforeHistoryChange);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events]);

  const value = useMemo(
    () => ({ isExpanded, isNavigating, setIsExpanded, searchValue, setSearchValue }),
    [isExpanded, isNavigating, searchValue]
  );

  return (
    <QuickSearchStateContext.Provider value={value}>{children}</QuickSearchStateContext.Provider>
  );
}

export function useQuickSearchState() {
  const context = use(QuickSearchStateContext);
  if (!context) {
    throw new Error('useQuickSearchState must be used within a QuickSearchStateProvider');
  }
  return context;
}
