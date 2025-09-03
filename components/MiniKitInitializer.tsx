'use client';

import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

export default function MiniKitInitializer() {
  const { setFrameReady } = useMiniKit();
  
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);
  
  return null;
}

