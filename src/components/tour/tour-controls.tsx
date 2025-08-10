"use client";

import React from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTour } from './tour-provider';
import { useAppContext } from '@/context/app-context';

interface TourControlsProps {
  className?: string;
}

export function TourControls({ className }: TourControlsProps) {
  const { startTour } = useTour();
  const { currentUser } = useAppContext();

  const handleStartTour = () => {
    startTour();
  };

  return (
    <Button
      onClick={handleStartTour}
      variant="outline"
      size="sm"
      className={className}
    >
      {currentUser?.tourCompleted ? (
        <>
          <RotateCcw className="h-4 w-4 mr-2" />
          Replay Tour
        </>
      ) : (
        <>
          <Play className="h-4 w-4 mr-2" />
          Start Tour
        </>
      )}
    </Button>
  );
}

// Component to mark tour elements (invisible div)
export function TourElement({
  id,
  className = "",
  children
}: {
  id: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${className} ${id}`}>
      {children}
    </div>
  );
}
