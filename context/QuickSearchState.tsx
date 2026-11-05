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
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
};

const QuickSearchStateContext = createContext<QuickSearchState | null>(null);

export function QuickSearchStateProvider({ children }: PropsWithChildren) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  useEffect(() => {
    function handleRouteChange() {
      setIsExpanded(false);
      setSearchValue('');
    }

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  const value = useMemo(
    () => ({ isExpanded, setIsExpanded, searchValue, setSearchValue }),
    [isExpanded, searchValue]
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
