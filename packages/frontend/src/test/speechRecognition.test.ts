import { describe, it, expect } from 'vitest';
import { matchTranscriptToScript } from '../services/SpeechRecognitionService';

describe('matchTranscriptToScript', () => {
  const scriptText =
    'Welcome to Saarwood Teleprompter. This is a professional broadcast tool for newsrooms worldwide.';

  it('returns -1 for empty transcript', () => {
    expect(matchTranscriptToScript(scriptText, '')).toBe(-1);
  });

  it('returns -1 for empty script', () => {
    expect(matchTranscriptToScript('', 'hello world')).toBe(-1);
  });

  it('finds an exact phrase in the script', () => {
    const idx = matchTranscriptToScript(scriptText, 'professional broadcast tool');
    expect(idx).toBeGreaterThan(-1);
  });

  it('is case-insensitive', () => {
    const idx = matchTranscriptToScript(scriptText, 'SAARWOOD TELEPROMPTER');
    expect(idx).toBeGreaterThan(-1);
  });

  it('finds a partial word sequence when full phrase is not present', () => {
    const idx = matchTranscriptToScript(scriptText, 'broadcast tool newsrooms');
    expect(idx).toBeGreaterThan(-1);
  });

  it('returns -1 for completely non-matching transcript', () => {
    const idx = matchTranscriptToScript(scriptText, 'xyz abc xyz abc xyz abc');
    expect(idx).toBe(-1);
  });
});
