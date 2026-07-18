import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Full-page loading spinner
 */
export const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-accent" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
);

/**
 * Inline / small spinner
 */
export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <Loader2 className={`animate-spin ${className ?? 'w-5 h-5'}`} />
);

export default PageLoader;
