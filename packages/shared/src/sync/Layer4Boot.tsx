import { useEffect } from 'react';
import { initAuth } from '../firebase/household';
import { subscribeSyncDrain } from '../firebase/sync';

type Props = {
  children: React.ReactNode;
};

export function Layer4Boot({ children }: Props) {
  useEffect(() => {
    void initAuth();
    return subscribeSyncDrain();
  }, []);

  return <>{children}</>;
}
