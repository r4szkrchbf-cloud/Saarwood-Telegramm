import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';

interface ScrollEngineOptions {
  /** Pixels per second. 0 = paused. */
  speed: number;
  isPlaying: boolean;
  direction?: 'down' | 'up';
  /** Ref to the clipping/viewport container element. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Ref to the scrollable content element (translated via CSS transform). */
  contentRef: React.RefObject<HTMLElement | null>;
  /** Called on every frame with the current scroll position in pixels. */
  onPositionChange?: (position: number) => void;
  /** Called when scrolling reaches top or bottom while playing. */
  onBoundaryReached?: (boundary: 'top' | 'bottom', position: number) => void;
}

interface ScrollEngineControls {
  /** Imperatively jump to a specific pixel offset. */
  setPosition: (position: number) => void;
  /** Read the current position without triggering a re-render. */
  positionRef: React.MutableRefObject<number>;
}

/**
 * useScrollEngine
 *
 * Hardware-accelerated, ruckle-free scroll engine.
 *
 * Strategy:
 *  - requestAnimationFrame drives every frame at the display refresh rate.
 *  - Position is accumulated as a floating-point pixel value so sub-pixel
 *    speeds produce smooth motion without drift.
 *  - CSS `transform: translateY()` is used (not scrollTop) so the update runs
 *    on the GPU compositor thread and never triggers layout/paint.
 *  - `will-change: transform` on the content element creates a dedicated
 *    compositing layer — apply via CSS on the element.
 *  - Delta time is capped at 50 ms to suppress jumps after tab focus restore.
 */
export function useScrollEngine({
  speed,
  isPlaying,
  direction = 'down',
  containerRef,
  contentRef,
  onPositionChange,
  onBoundaryReached,
}: ScrollEngineOptions): ScrollEngineControls {
  const positionRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Keep mutable refs in sync so the stable `animate` closure always sees
  // the latest values without needing to be recreated on each render.
  const speedRef = useRef(speed);
  const isPlayingRef = useRef(isPlaying);
  const directionRef = useRef(direction);
  const onPositionChangeRef = useRef(onPositionChange);
  const onBoundaryReachedRef = useRef(onBoundaryReached);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { onPositionChangeRef.current = onPositionChange; }, [onPositionChange]);
  useEffect(() => { onBoundaryReachedRef.current = onBoundaryReached; }, [onBoundaryReached]);

  // Stable ref to the animate callback so the rAF loop can call it without
  // creating a self-referencing closure (which lint flags as access-before-init).
  const animateRef = useRef<FrameRequestCallback | null>(null);

  const animate = useCallback((timestamp: number) => {
    if (lastTimestampRef.current === null) {
      lastTimestampRef.current = timestamp;
    }

    const deltaMs = Math.min(timestamp - lastTimestampRef.current, 50);
    lastTimestampRef.current = timestamp;

    const content = contentRef.current;
    const container = containerRef.current;

    if (isPlayingRef.current && speedRef.current > 0 && content && container) {
      const deltaPixels = (speedRef.current * deltaMs) / 1000;
      const maxScroll = Math.max(
        0,
        content.scrollHeight - container.clientHeight,
      );

      if (directionRef.current === 'down') {
        positionRef.current = Math.min(
          positionRef.current + deltaPixels,
          maxScroll,
        );
        if (positionRef.current >= maxScroll && maxScroll > 0) {
          onBoundaryReachedRef.current?.('bottom', positionRef.current);
        }
      } else {
        positionRef.current = Math.max(positionRef.current - deltaPixels, 0);
        if (positionRef.current <= 0) {
          onBoundaryReachedRef.current?.('top', positionRef.current);
        }
      }

      content.style.transform = `translateY(-${positionRef.current}px)`;
      onPositionChangeRef.current?.(positionRef.current);
    }

    // Call via ref to avoid a self-referencing closure that would violate
    // the react-hooks/immutability rule.
    rafIdRef.current = requestAnimationFrame(animateRef.current!);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- intentionally stable

  // Keep the ref in sync with the latest animate function inside a layout
  // effect (not at render level) so react-hooks/refs is satisfied.
  // animate is stable (empty deps), so this runs only on mount.
  useLayoutEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  useEffect(() => {
    lastTimestampRef.current = null;
    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [animate]);

  const setPosition = useCallback(
    (position: number) => {
      positionRef.current = position;
      const content = contentRef.current;
      if (content) {
        content.style.transform = `translateY(-${position}px)`;
      }
    },
    [contentRef],
  );

  return { setPosition, positionRef };
}
