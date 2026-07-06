import { describe, it, expect, beforeEach } from 'vitest';
import { usePrompterStore } from '../store/prompterStore';

describe('prompterStore', () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    usePrompterStore.setState({
      scroll: { isPlaying: false, speed: 80, position: 0, direction: 'down' },
      script: { id: 'test', title: 'Test', segments: [], lastModified: 0 },
      profiles: [],
      activeProfileId: null,
    });
  });

  describe('scroll control', () => {
    it('play sets isPlaying to true', () => {
      usePrompterStore.getState().play();
      expect(usePrompterStore.getState().scroll.isPlaying).toBe(true);
    });

    it('pause sets isPlaying to false', () => {
      usePrompterStore.getState().play();
      usePrompterStore.getState().pause();
      expect(usePrompterStore.getState().scroll.isPlaying).toBe(false);
    });

    it('stop resets isPlaying and position', () => {
      usePrompterStore.setState({ scroll: { isPlaying: true, speed: 80, position: 500, direction: 'down' } });
      usePrompterStore.getState().stop();
      const { isPlaying, position } = usePrompterStore.getState().scroll;
      expect(isPlaying).toBe(false);
      expect(position).toBe(0);
    });

    it('setSpeed clamps to 0–400', () => {
      usePrompterStore.getState().setSpeed(-50);
      expect(usePrompterStore.getState().scroll.speed).toBe(0);
      usePrompterStore.getState().setSpeed(999);
      expect(usePrompterStore.getState().scroll.speed).toBe(400);
      usePrompterStore.getState().setSpeed(120);
      expect(usePrompterStore.getState().scroll.speed).toBe(120);
    });
  });

  describe('script management', () => {
    it('adds a segment', () => {
      usePrompterStore.getState().addSegment({
        id: 'seg-1',
        html: '<p>Hello</p>',
        direction: 'ltr',
        isCloaked: false,
        isDirectorsNote: false,
      });
      expect(usePrompterStore.getState().script.segments).toHaveLength(1);
    });

    it('updates a segment', () => {
      usePrompterStore.getState().addSegment({
        id: 'seg-1',
        html: '<p>Hello</p>',
        direction: 'ltr',
        isCloaked: false,
        isDirectorsNote: false,
      });
      usePrompterStore.getState().updateSegment('seg-1', { isCloaked: true });
      expect(usePrompterStore.getState().script.segments[0].isCloaked).toBe(true);
    });

    it('removes a segment', () => {
      usePrompterStore.getState().addSegment({
        id: 'seg-1',
        html: '<p>Hello</p>',
        direction: 'ltr',
        isCloaked: false,
        isDirectorsNote: false,
      });
      usePrompterStore.getState().removeSegment('seg-1');
      expect(usePrompterStore.getState().script.segments).toHaveLength(0);
    });

    it('reorders a segment upward', () => {
      usePrompterStore.getState().addSegment({ id: 'a', html: '<p>A</p>', direction: 'ltr', isCloaked: false, isDirectorsNote: false });
      usePrompterStore.getState().addSegment({ id: 'b', html: '<p>B</p>', direction: 'ltr', isCloaked: false, isDirectorsNote: false });
      usePrompterStore.getState().reorderSegment('b', 'up');
      const ids = usePrompterStore.getState().script.segments.map((s) => s.id);
      expect(ids).toEqual(['b', 'a']);
    });

    it('reorders a segment downward', () => {
      usePrompterStore.getState().addSegment({ id: 'a', html: '<p>A</p>', direction: 'ltr', isCloaked: false, isDirectorsNote: false });
      usePrompterStore.getState().addSegment({ id: 'b', html: '<p>B</p>', direction: 'ltr', isCloaked: false, isDirectorsNote: false });
      usePrompterStore.getState().reorderSegment('a', 'down');
      const ids = usePrompterStore.getState().script.segments.map((s) => s.id);
      expect(ids).toEqual(['b', 'a']);
    });

    it('does not reorder first segment further up', () => {
      usePrompterStore.getState().addSegment({ id: 'a', html: '<p>A</p>', direction: 'ltr', isCloaked: false, isDirectorsNote: false });
      usePrompterStore.getState().addSegment({ id: 'b', html: '<p>B</p>', direction: 'ltr', isCloaked: false, isDirectorsNote: false });
      usePrompterStore.getState().reorderSegment('a', 'up');
      const ids = usePrompterStore.getState().script.segments.map((s) => s.id);
      expect(ids).toEqual(['a', 'b']);
    });

    it('sets the script title', () => {
      usePrompterStore.getState().setScriptTitle('Breaking News');
      expect(usePrompterStore.getState().script.title).toBe('Breaking News');
    });
  });

  describe('presenter profiles', () => {
    const mockProfile = {
      id: 'p1',
      name: 'John Doe',
      displaySettings: {
        mirrorHorizontal: false,
        mirrorVertical: false,
        rotation: 0 as const,
        fontSize: 64,
        fontFamily: 'serif',
        textColor: '#fff',
        backgroundColor: '#000',
        lineHeight: 1.8,
        textAlign: 'center' as const,
        darkMode: true,
        cueMarkerEnabled: true,
        cueMarkerPosition: 30,
      },
    };

    it('saves a profile', () => {
      usePrompterStore.getState().saveProfile(mockProfile);
      expect(usePrompterStore.getState().profiles).toHaveLength(1);
    });

    it('applies a profile, updating display settings', () => {
      usePrompterStore.getState().saveProfile(mockProfile);
      usePrompterStore.getState().applyProfile('p1');
      expect(usePrompterStore.getState().display.fontSize).toBe(64);
      expect(usePrompterStore.getState().activeProfileId).toBe('p1');
    });

    it('deletes a profile', () => {
      usePrompterStore.getState().saveProfile(mockProfile);
      usePrompterStore.getState().deleteProfile('p1');
      expect(usePrompterStore.getState().profiles).toHaveLength(0);
    });

    it('renames a profile', () => {
      usePrompterStore.getState().saveProfile(mockProfile);
      usePrompterStore.getState().renameProfile('p1', 'New Name');
      expect(usePrompterStore.getState().profiles[0].name).toBe('New Name');
    });
  });
});
