/**
 * Utility to suppress passive event listener warnings from third-party libraries
 * This specifically targets the APlayer library touchstart event warnings
 * 
 * The warnings occur because APlayer doesn't use passive event listeners
 * for touchstart events, but this doesn't affect functionality.
 */

let originalConsoleWarn: typeof console.warn;

export const suppressPassiveEventWarnings = () => {
  if (typeof window !== 'undefined' && !originalConsoleWarn) {
    originalConsoleWarn = console.warn;
    
    console.warn = (...args: any[]) => {
      // Suppress specific passive event warnings from APlayer
      const message = args[0];
      if (
        typeof message === 'string' && 
        (
          message.includes('Added non-passive event listener to a scroll-blocking') ||
          message.includes('touchstart') ||
          message.includes('touchmove')
        ) &&
        message.includes('Violation')
      ) {
        // Don't log these specific warnings
        return;
      }
      
      // Log all other warnings normally
      originalConsoleWarn.apply(console, args);
    };
  }
};

export const restoreConsoleWarn = () => {
  if (originalConsoleWarn) {
    console.warn = originalConsoleWarn;
  }
};
