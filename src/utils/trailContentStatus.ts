import { Sequence } from "../types/trail";
import { ItemStatus, TimelineTheme } from "../types/trailContent";


export const getItemStatus = (seq: Sequence): ItemStatus => {
  if (!seq.active) return 'locked';
  
  if (seq.form) {
    if (seq.isPassed) return 'completed';
    if (seq.maxAttempts && seq.attemptNumber && seq.attemptNumber >= seq.maxAttempts) {
      return 'failed';
    }
    return 'current';
  }

  return seq.content ? 'current' : 'locked';
};

export const getItemTheme = (status: ItemStatus): TimelineTheme => {
  switch (status) {
    case 'completed':
      return { color: '#4CAF50', bg: '#4CAF50', borderColor: '#4CAF50', icon: 'check', lightColor: '#4CAF50' };
    case 'failed':
      return { color: '#F44336', bg: '#F44336', borderColor: '#F44336', icon: 'x', lightColor: '#F44336' };
    case 'current':
      return { color: '#3b82f6', bg: '#3b82f6', borderColor: '#3b82f6', icon: 'unlock', lightColor: '#3b82f6' }; 
    case 'locked':
    default:
      return { color: '#9ca3af', bg: '#e5e7eb', borderColor: '#d1d5db', icon: 'lock', lightColor: '#9ca3af' };
  }
};