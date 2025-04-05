import React from 'react';
import { CyclePhase } from '../types/cycle-phases';
import { useTheme } from './ThemeProviderCustom';

interface CycleProgressProps {
  currentDay: number;
  cycleLength: number;
}

export function CycleProgress({ currentDay, cycleLength = 28 }: CycleProgressProps) {
  const { phase } = useTheme();

  const getSegmentColor = (segmentPhase: CyclePhase) => {
    const opacity = phase === segmentPhase ? '1' : '0.5';
    switch (segmentPhase) {
      case CyclePhase.MENSTRUAL:
        return `rgba(244, 63, 94, ${opacity})`;
      case CyclePhase.FOLLICULAR:
        return `rgba(250, 237, 52, ${opacity})`;
      case CyclePhase.OVULATION:
        return `rgba(106, 215, 255, ${opacity})`;
      case CyclePhase.LUTEAL:
        return `rgba(116, 207, 47, ${opacity})`;
      default:
        return `rgba(200, 200, 200, ${opacity})`;
    }
  };

  return (
    <div className="cycle-progress">
      <div className="cycle-day">
        <span className="text-3xl font-bold">{currentDay}</span>
        <span className="text-sm">Day</span>
      </div>
    </div>
  );
}