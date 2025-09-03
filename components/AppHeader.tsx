'use client';

import { Name, Avatar, Identity } from '@coinbase/onchainkit/identity';
import { Wallet } from '@coinbase/onchainkit/wallet';

export default function AppHeader() {
  return (
    <header className="bg-surface p-4 shadow-card">
      <div className="flex items-center justify-between">
        <h1 className="text-display font-extrabold text-primary">VibeFinder</h1>
        <div className="flex items-center gap-4">
          <Identity>
            <Avatar />
            <Name />
          </Identity>
          <Wallet />
        </div>
      </div>
    </header>
  );
}
