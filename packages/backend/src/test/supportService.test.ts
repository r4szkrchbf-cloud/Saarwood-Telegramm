import { afterEach, describe, expect, it, vi } from 'vitest';
import { SupportService } from '../support/SupportService';

describe('SupportService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('builds absolute fallback support URLs from the request host', () => {
    const service = new SupportService();

    expect(service.getInfo({ protocol: 'https', host: 'teleprompter.saarwood.ch' })).toMatchObject({
      handbookUrl: 'https://teleprompter.saarwood.ch/support/saarwood-nutzerhandbuch-beta-v1-de.pdf',
      testerGuideUrl: 'https://teleprompter.saarwood.ch/support/beta-tester-guide-de.pdf',
      testerFormUrl: 'https://teleprompter.saarwood.ch/tester-form.html',
    });
  });

  it('replaces homepage placeholders with the document fallback URL', () => {
    vi.stubEnv('SUPPORT_HANDBOOK_URL', 'https://teleprompter.saarwood.ch/');
    vi.stubEnv('SUPPORT_TESTER_GUIDE_URL', 'https://teleprompter.saarwood.ch/');
    vi.stubEnv('SUPPORT_TESTER_FORM_URL', 'https://teleprompter.saarwood.ch/');

    const service = new SupportService();
    const info = service.getInfo({ protocol: 'https', host: 'teleprompter.saarwood.ch' });

    expect(info.handbookUrl).toBe('https://teleprompter.saarwood.ch/support/saarwood-nutzerhandbuch-beta-v1-de.pdf');
    expect(info.testerGuideUrl).toBe('https://teleprompter.saarwood.ch/support/beta-tester-guide-de.pdf');
    expect(info.testerFormUrl).toBe('https://teleprompter.saarwood.ch/tester-form.html');
  });

  it('keeps real document URLs untouched', () => {
    vi.stubEnv('SUPPORT_HANDBOOK_URL', 'https://cdn.saarwood.ch/docs/handbook.pdf');

    const service = new SupportService();
    const info = service.getInfo({ protocol: 'https', host: 'teleprompter.saarwood.ch' });

    expect(info.handbookUrl).toBe('https://cdn.saarwood.ch/docs/handbook.pdf');
  });
});