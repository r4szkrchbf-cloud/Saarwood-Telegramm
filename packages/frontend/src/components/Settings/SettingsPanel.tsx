import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { usePrompterStore } from '../../store/prompterStore';
import { speechService } from '../../services/SpeechRecognitionService';
import type { PresenterProfile } from '../../types';
import './SettingsPanel.css';

interface SettingsPanelProps {
  onClose: () => void;
}

type SettingsPage = 'settings' | 'io' | 'templates' | 'support' | 'about';

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const display = usePrompterStore((s) => s.display);
  const profiles = usePrompterStore((s) => s.profiles);
  const activeProfileId = usePrompterStore((s) => s.activeProfileId);
  const tier = usePrompterStore((s) => s.tier);
  const setDisplay = usePrompterStore((s) => s.setDisplay);
  const speechEnabled = usePrompterStore((s) => s.speechEnabled);
  const setSpeechEnabled = usePrompterStore((s) => s.setSpeechEnabled);
  const speechInputDeviceId = usePrompterStore((s) => s.speechInputDeviceId);
  const setSpeechInputDeviceId = usePrompterStore((s) => s.setSpeechInputDeviceId);
  const speechSensitivity = usePrompterStore((s) => s.speechSensitivity);
  const setSpeechSensitivity = usePrompterStore((s) => s.setSpeechSensitivity);
  const saveProfile = usePrompterStore((s) => s.saveProfile);
  const renameProfile = usePrompterStore((s) => s.renameProfile);
  const deleteProfile = usePrompterStore((s) => s.deleteProfile);
  const applyProfile = usePrompterStore((s) => s.applyProfile);
  const setTier = usePrompterStore((s) => s.setTier);
  const script = usePrompterStore((s) => s.script);
  const setScript = usePrompterStore((s) => s.setScript);

  const fontSizeId = useId();
  const fontFamilyId = useId();
  const lineHeightId = useId();
  const textColorId = useId();
  const bgColorId = useId();
  const textAlignId = useId();
  const cuePositionId = useId();
  const speechInputId = useId();
  const speechSensitivityId = useId();
  const profileNameId = useId();

  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationInfo, setCalibrationInfo] = useState('');
  const [calibrationRecommendation, setCalibrationRecommendation] = useState<number | null>(null);
  const [scriptIoInfo, setScriptIoInfo] = useState('');
  const [supportInfo, setSupportInfo] = useState({
    chatUrl: '' as string | null,
    chatLabel: 'Support Chat',
    handbookUrl: '' as string | null,
    testerGuideUrl: '' as string | null,
    testerFormUrl: '' as string | null,
  });
  const [supportStatus, setSupportStatus] = useState('');
  const [supportSending, setSupportSending] = useState(false);
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [profileName, setProfileName] = useState('');
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCreateName, setTemplateCreateName] = useState('');
  const [templateNameDrafts, setTemplateNameDrafts] = useState<Record<string, string>>({});
  const [supportAccessKey, setSupportAccessKey] = useState('');
  const [supportLogs, setSupportLogs] = useState<Array<{ createdAt: string; level: string; source: string; message: string; details?: string }>>([]);
  const [supportLogsStatus, setSupportLogsStatus] = useState('');
  const [supportLogsLoading, setSupportLogsLoading] = useState(false);
  const [activePage, setActivePage] = useState<SettingsPage>('settings');
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const CALIBRATION_PHRASE = 'Heute testen wir das Voice Tracking fuer den Saarwood Teleprompter.';

  const postClientLog = useCallback((entry: { level: 'info' | 'warn' | 'error'; source: string; message: string; details?: string }) => {
    void fetch('/api/support/logs/client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    }).catch(() => {
      // Swallow logging errors to keep UX unaffected.
    });
  }, []);

  useEffect(() => {
    let active = true;
    speechService
      .listInputDevices()
      .then((devices) => {
        if (!active) return;
        setAudioInputs(devices);
      })
      .catch(() => {
        if (!active) return;
        setAudioInputs([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    postClientLog({ level: 'info', source: 'settings', message: 'SettingsPanel opened' });

    const onError = (event: ErrorEvent) => {
      postClientLog({
        level: 'error',
        source: 'window.error',
        message: event.message || 'unknown-window-error',
        details: `${event.filename ?? 'n/a'}:${event.lineno ?? 0}:${event.colno ?? 0}`,
      });
    };
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = typeof event.reason === 'string'
        ? event.reason
        : JSON.stringify(event.reason ?? 'unknown-rejection');
      postClientLog({ level: 'error', source: 'window.unhandledrejection', message: reason });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, [postClientLog]);

  useEffect(() => {
    let active = true;

    const loadSupportInfo = async () => {
      try {
        const response = await fetch('/api/support/info');
        if (!response.ok) return;
        const payload = await response.json() as {
          chatUrl?: string | null;
          chatLabel?: string;
          handbookUrl?: string | null;
          testerGuideUrl?: string | null;
          testerFormUrl?: string | null;
        };
        if (!active) return;
        setSupportInfo({
          chatUrl: payload.chatUrl || null,
          chatLabel: payload.chatLabel || 'Support Chat',
          handbookUrl: payload.handbookUrl || null,
          testerGuideUrl: payload.testerGuideUrl || null,
          testerFormUrl: payload.testerFormUrl || null,
        });
      } catch {
        // Keep defaults
      }
    };

    loadSupportInfo();
    return () => {
      active = false;
    };
  }, []);

  const filteredProfiles = useMemo(() => {
    const q = templateSearch.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) => p.name.toLowerCase().includes(q));
  }, [profiles, templateSearch]);

  const htmlToPlain = useCallback((html: string): string => {
    if (typeof window === 'undefined') {
      return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
  }, []);

  const escapeCsv = useCallback((value: string): string => `"${value.replaceAll('"', '""')}"`, []);

  const buildCsv = useCallback((): string => {
    const rows = script.segments.map((seg, idx) => [
      String(idx + 1),
      seg.id,
      seg.isCloaked ? '1' : '0',
      seg.isDirectorsNote ? '1' : '0',
      htmlToPlain(seg.html),
      seg.html,
    ]);
    const header = ['index', 'id', 'isCloaked', 'isDirectorsNote', 'text', 'html'];
    return [header, ...rows].map((row) => row.map((cell) => escapeCsv(cell)).join(',')).join('\n');
  }, [escapeCsv, htmlToPlain, script.segments]);

  const downloadBlob = useCallback((content: string, mimeType: string, filename: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, []);

  const handleSaveProfile = useCallback(() => {
    const name = profileName.trim();
    if (!name) return;
    const profile: PresenterProfile = {
      id: `profile-${Date.now()}`,
      name,
      displaySettings: { ...display },
      scriptTemplate: {
        ...script,
        segments: script.segments.map((seg) => ({ ...seg })),
      },
    };
    saveProfile(profile);
    postClientLog({ level: 'info', source: 'template', message: `Template saved: ${name}` });
    setProfileName('');
  }, [display, profileName, saveProfile, script, postClientLog]);

  const handleCreateTemplate = useCallback(() => {
    const name = templateCreateName.trim();
    if (!name) return;

    const profile: PresenterProfile = {
      id: `profile-${Date.now()}`,
      name,
      displaySettings: { ...display },
      scriptTemplate: {
        ...script,
        segments: script.segments.map((seg) => ({ ...seg })),
      },
    };

    saveProfile(profile);
    setTemplateCreateName('');
    postClientLog({ level: 'info', source: 'template', message: `Template created: ${name}` });
  }, [display, script, saveProfile, templateCreateName, postClientLog]);

  const handleRenameTemplate = useCallback((id: string) => {
    const nextName = templateNameDrafts[id]?.trim();
    if (!nextName) return;
    renameProfile(id, nextName);
    postClientLog({ level: 'info', source: 'template', message: `Template renamed: ${nextName}` });
  }, [renameProfile, templateNameDrafts, postClientLog]);

  const handleLoadGermanTestScript = useCallback(() => {
    const now = Date.now();
    setScript({
      ...script,
      lastModified: now,
      segments: [
        {
          id: `seg-${now}-1`,
          html: '<p>Guten Abend und herzlich willkommen zu unserer Sendung. In den naechsten Minuten fassen wir die wichtigsten Meldungen des Tages kompakt und verstaendlich zusammen.</p>',
          direction: 'ltr',
          isCloaked: false,
          isDirectorsNote: false,
        },
        {
          id: `seg-${now}-2`,
          html: '<p>Im ersten Themenblock geht es um die Verkehrslage im Saarland. Der Berufsverkehr bleibt auf den Hauptachsen dicht, auf der A sechs kommt es weiterhin zu zoegerlichem Vorankommen.</p>',
          direction: 'ltr',
          isCloaked: false,
          isDirectorsNote: false,
        },
        {
          id: `seg-${now}-3`,
          html: '<p>Danach schauen wir auf das Wetter: In der Nacht bleibt es weitgehend trocken, lokal kann sich Nebel bilden. Morgen starten wir freundlich, spaeter ziehen Wolken auf.</p>',
          direction: 'ltr',
          isCloaked: false,
          isDirectorsNote: false,
        },
        {
          id: `seg-${now}-4`,
          html: '<p>Zum Abschluss noch der Sport: Die Saarwood Falcons gewinnen ihr Heimspiel mit zwei zu eins. Das Team zeigt eine stabile Defensive und bleibt damit auf Playoff-Kurs.</p>',
          direction: 'ltr',
          isCloaked: false,
          isDirectorsNote: false,
        },
      ],
    });
  }, [script, setScript]);

  const handleExportSegmentsJson = useCallback(() => {
    try {
      const payload = {
        format: 'saarwood-segments-v1',
        exportedAt: new Date().toISOString(),
        title: script.title,
        segments: script.segments,
      };
      downloadBlob(JSON.stringify(payload, null, 2), 'application/json', 'telepromptervorlage-export.json');
      setScriptIoInfo('JSON-Export erfolgreich erstellt.');
      postClientLog({ level: 'info', source: 'export.json', message: `Exported ${script.segments.length} segments` });
    } catch {
      setScriptIoInfo('JSON-Export fehlgeschlagen.');
    }
  }, [downloadBlob, script, postClientLog]);

  const handleExportSegmentsCsv = useCallback(() => {
    try {
      downloadBlob(buildCsv(), 'text/csv;charset=utf-8', 'telepromptervorlage-export.csv');
      setScriptIoInfo('CSV-Export erfolgreich erstellt.');
      postClientLog({ level: 'info', source: 'export.csv', message: `Exported ${script.segments.length} segments` });
    } catch {
      setScriptIoInfo('CSV-Export fehlgeschlagen.');
    }
  }, [buildCsv, downloadBlob, postClientLog, script.segments.length]);

  const handleExportSegmentsTxt = useCallback(() => {
    try {
      const lines = [
        `Titel: ${script.title}`,
        `Exportiert: ${new Date().toISOString()}`,
        '',
        ...script.segments.flatMap((seg, idx) => [
          `### Segment ${idx + 1} (${seg.id})`,
          htmlToPlain(seg.html),
          '',
        ]),
      ];
      downloadBlob(lines.join('\n'), 'text/plain;charset=utf-8', 'telepromptervorlage-export.txt');
      setScriptIoInfo('TXT-Export erfolgreich erstellt.');
      postClientLog({ level: 'info', source: 'export.txt', message: `Exported ${script.segments.length} segments` });
    } catch {
      setScriptIoInfo('TXT-Export fehlgeschlagen.');
    }
  }, [downloadBlob, htmlToPlain, script, postClientLog]);

  const handleExportSegmentsPdf = useCallback(() => {
    try {
      const run = async () => {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        let y = 40;
        doc.setFontSize(14);
        doc.text(`Telepromptervorlage: ${script.title}`, 40, y);
        y += 24;
        doc.setFontSize(10);
        doc.text(`Exportiert: ${new Date().toISOString()}`, 40, y);
        y += 20;

        script.segments.forEach((seg, idx) => {
          if (y > 760) {
            doc.addPage();
            y = 40;
          }
          const title = doc.splitTextToSize(`Segment ${idx + 1} (${seg.id})`, 500);
          const body = doc.splitTextToSize(htmlToPlain(seg.html) || '-', 500);
          doc.setFontSize(11);
          doc.text(title, 40, y);
          y += title.length * 14;
          doc.setFontSize(10);
          doc.text(body, 40, y);
          y += body.length * 12 + 12;
        });

        doc.save('telepromptervorlage-export.pdf');
        setScriptIoInfo('PDF-Export erfolgreich erstellt.');
        postClientLog({ level: 'info', source: 'export.pdf', message: `Exported ${script.segments.length} segments` });
      };

      void run().catch(() => {
        setScriptIoInfo('PDF-Export fehlgeschlagen.');
      });
    } catch {
      setScriptIoInfo('PDF-Export fehlgeschlagen.');
    }
  }, [htmlToPlain, script, postClientLog]);

  const handlePrintSegments = useCallback(() => {
    if (typeof window === 'undefined') return;

    const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
    if (!printWindow) {
      setScriptIoInfo('Drucken blockiert. Bitte Pop-up erlauben.');
      return;
    }

    const bodyHtml = script.segments
      .map((seg, idx) => `<section><h3>Segment ${idx + 1}</h3>${seg.html}</section>`)
      .join('<hr />');

    const html = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <title>${script.title} - Segmentdruck</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
      h1 { margin-top: 0; }
      h3 { margin-bottom: 6px; }
      section { margin-bottom: 18px; }
      hr { margin: 18px 0; border: 0; border-top: 1px solid #ddd; }
    </style>
  </head>
  <body>
    <h1>${script.title}</h1>
    ${bodyHtml}
  </body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setScriptIoInfo('Druckansicht geoeffnet.');
  }, [script]);

  const handleImportSegmentsClick = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const handleImportSegmentsFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const raw = await file.text();
      const now = Date.now();
      let title = script.title;
      let segments: Array<{
        id: string;
        html: string;
        direction: 'ltr';
        isCloaked: boolean;
        isDirectorsNote: boolean;
      }> = [];

      if (file.name.toLowerCase().endsWith('.csv')) {
        const rows = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
        const dataRows = rows.slice(1);
        segments = dataRows.map((line, idx) => {
          const cols = line.match(/("(?:[^"]|"")*"|[^,]+)/g)?.map((col) =>
            col.replace(/^"|"$/g, '').replaceAll('""', '"').trim(),
          ) ?? [];
          const text = cols[4] || '';
          return {
            id: cols[1] || `imp-${now}-${idx + 1}`,
            html: cols[5] || `<p>${text}</p>`,
            direction: 'ltr' as const,
            isCloaked: cols[2] === '1' || cols[2]?.toLowerCase() === 'true',
            isDirectorsNote: cols[3] === '1' || cols[3]?.toLowerCase() === 'true',
          };
        });
      } else {
        const parsed = JSON.parse(raw) as {
          title?: string;
          segments?: Array<{
            id?: string;
            html?: string;
            direction?: 'ltr';
            isCloaked?: boolean;
            isDirectorsNote?: boolean;
          }>;
        };
        if (!Array.isArray(parsed.segments)) throw new Error('invalid-json');
        title = parsed.title || script.title;
        segments = parsed.segments
          .filter((seg) => typeof seg?.html === 'string')
          .map((seg, idx) => ({
            id: seg.id || `imp-${now}-${idx + 1}`,
            html: seg.html || '<p></p>',
            direction: 'ltr' as const,
            isCloaked: Boolean(seg.isCloaked),
            isDirectorsNote: Boolean(seg.isDirectorsNote),
          }));
      }

      if (segments.length === 0) throw new Error('empty');

      setScript({
        ...script,
        title,
        lastModified: now,
        segments,
      });
      setScriptIoInfo(`Import erfolgreich: ${segments.length} Segmente geladen (${file.name}).`);
      postClientLog({ level: 'info', source: 'import', message: `Imported ${segments.length} segments from ${file.name}` });
    } catch {
      setScriptIoInfo('Import fehlgeschlagen. Bitte gueltige JSON- oder CSV-Datei verwenden.');
      postClientLog({ level: 'warn', source: 'import', message: 'Import failed' });
    } finally {
      if (e.target) e.target.value = '';
    }
  }, [script, setScript, postClientLog]);

  const handleDownloadJsonTemplate = useCallback(() => {
    const sample = {
      title: 'Beispiel Telepromptervorlage',
      segments: [
        {
          id: 'sample-1',
          html: '<p>Willkommen zur Sendung.</p>',
          direction: 'ltr',
          isCloaked: false,
          isDirectorsNote: false,
        },
      ],
    };
    downloadBlob(JSON.stringify(sample, null, 2), 'application/json', 'import-vorlage.json');
  }, [downloadBlob]);

  const handleDownloadCsvTemplate = useCallback(() => {
    const sample = [
      '"index","id","isCloaked","isDirectorsNote","text","html"',
      '"1","sample-1","0","0","Willkommen zur Sendung.","<p>Willkommen zur Sendung.</p>"',
    ].join('\n');
    downloadBlob(sample, 'text/csv;charset=utf-8', 'import-vorlage.csv');
  }, [downloadBlob]);

  const handleRunCalibration = useCallback(async () => {
    if (tier !== 'expert' || !speechService.isSupported || isCalibrating) return;

    const normalize = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const phraseWords = new Set(normalize(CALIBRATION_PHRASE).split(' ').filter(Boolean));
    const computeWordMatch = (spoken: string) => {
      const words = normalize(spoken).split(' ').filter(Boolean);
      if (words.length === 0 || phraseWords.size === 0) return 0;
      let hits = 0;
      words.forEach((word) => {
        if (phraseWords.has(word)) hits += 1;
      });
      return Math.min(1, hits / phraseWords.size);
    };

    setIsCalibrating(true);
    setCalibrationRecommendation(null);
    setCalibrationInfo('Kalibrierung laeuft: Bitte den Testsatz klar und normal laut sprechen ...');

    const previouslyEnabled = speechEnabled;

    try {
      setSpeechEnabled(false);
      speechService.stop();
      speechService.setLanguage('de-DE');
      speechService.start();

      const confidences: number[] = [];
      const matches: number[] = [];
      let lastTranscript = '';

      const unsub = speechService.onTranscript(({ transcript, isFinal, confidence }) => {
        if (!isFinal) return;
        lastTranscript = transcript;
        confidences.push(confidence > 0 ? confidence : 0.5);
        matches.push(computeWordMatch(transcript));
      });

      await new Promise((resolve) => setTimeout(resolve, 7000));
      unsub();
      speechService.stop();

      if (confidences.length === 0) {
        setCalibrationInfo('Keine stabile Erkennung erhalten. Bitte Mikrofon pruefen und erneut kalibrieren.');
        return;
      }

      const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
      const avgMatch = matches.reduce((a, b) => a + b, 0) / matches.length;
      const qualityScore = avgConfidence * 0.6 + avgMatch * 0.4;
      const recommended = Math.max(20, Math.min(90, Math.round(80 - qualityScore * 50)));

      setSpeechSensitivity(recommended);
      setCalibrationRecommendation(recommended);
      setCalibrationInfo(
        `Erkannt: "${lastTranscript || '---'}" | Trefferqualitaet: ${Math.round(qualityScore * 100)}% | Empfohlene Empfindlichkeit gesetzt auf ${recommended}%`,
      );
    } catch {
      speechService.stop();
      setCalibrationInfo('Kalibrierung fehlgeschlagen. Bitte Browser-Mikrofonberechtigung pruefen.');
    } finally {
      setSpeechEnabled(previouslyEnabled);
      setIsCalibrating(false);
    }
  }, [tier, isCalibrating, speechEnabled, setSpeechEnabled, setSpeechSensitivity, CALIBRATION_PHRASE]);

  const handleCreateSupportTicket = useCallback(async () => {
    if (supportSending) return;

    if (!ticketName.trim() || !ticketEmail.trim() || !ticketSubject.trim() || !ticketMessage.trim()) {
      setSupportStatus('Bitte alle Ticket-Felder ausfuellen.');
      return;
    }

    setSupportSending(true);
    setSupportStatus('Support-Ticket wird gesendet ...');

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ticketName.trim(),
          email: ticketEmail.trim(),
          subject: ticketSubject.trim(),
          message: ticketMessage.trim(),
          appVersion: '1.0.0-beta.1',
          context: 'split',
        }),
      });

      if (!response.ok) {
        setSupportStatus('Ticket konnte nicht erstellt werden.');
        postClientLog({ level: 'warn', source: 'ticket', message: 'Ticket creation failed' });
        return;
      }

      const payload = await response.json() as {
        ticketId?: string;
        confirmationEmailSent?: boolean;
      };

      const ticketId = payload.ticketId ?? 'unbekannt';
      if (payload.confirmationEmailSent === false) {
        setSupportStatus(
          `Ihr Ticket ist beim Support eingegangen. Bitte verwenden Sie diese Ticket-ID: ${ticketId}. ` +
          'Hinweis: Die automatische E-Mail mit der Ticket-Kopie konnte noch nicht versendet werden.',
        );
      } else {
        setSupportStatus(
          `Ihr Ticket ist beim Support eingegangen. Bitte verwenden Sie diese Ticket-ID: ${ticketId}. ` +
          'Sie haben eine automatische E-Mail mit einer Kopie Ihres Tickets erhalten.',
        );
      }
      setTicketSubject('');
      setTicketMessage('');
      postClientLog({ level: 'info', source: 'ticket', message: `Ticket created: ${ticketId}` });
    } catch {
      setSupportStatus('Ticket konnte nicht gesendet werden (Netzwerkfehler).');
      postClientLog({ level: 'error', source: 'ticket', message: 'Ticket request network failure' });
    } finally {
      setSupportSending(false);
    }
  }, [supportSending, ticketName, ticketEmail, ticketSubject, ticketMessage, postClientLog]);

  const handleLoadSupportLogs = useCallback(async () => {
    if (!supportAccessKey.trim()) {
      setSupportLogsStatus('Bitte Support-Key eingeben.');
      return;
    }
    setSupportLogsLoading(true);
    setSupportLogsStatus('Support-Logs werden geladen ...');
    try {
      const response = await fetch('/api/support/logs?hours=78&limit=2000', {
        headers: {
          Authorization: `Bearer ${supportAccessKey.trim()}`,
        },
      });
      if (!response.ok) {
        setSupportLogsStatus('Kein Zugriff auf Support-Logs.');
        return;
      }
      const payload = await response.json() as {
        logs?: Array<{ createdAt: string; level: string; source: string; message: string; details?: string }>;
      };
      const logs = Array.isArray(payload.logs) ? payload.logs : [];
      setSupportLogs(logs);
      setSupportLogsStatus(`Support-Logs geladen: ${logs.length} Eintraege (letzte 78 Stunden).`);
    } catch {
      setSupportLogsStatus('Support-Logs konnten nicht geladen werden.');
    } finally {
      setSupportLogsLoading(false);
    }
  }, [supportAccessKey]);

  const handleDownloadSupportLogs = useCallback(() => {
    if (supportLogs.length === 0) return;
    const lines = supportLogs.map((log) => {
      const details = log.details ? ` | ${log.details}` : '';
      return `[${log.createdAt}] ${log.level.toUpperCase()} ${log.source}: ${log.message}${details}`;
    });
    downloadBlob(lines.join('\n'), 'text/plain;charset=utf-8', 'support-logs-78h.txt');
  }, [supportLogs, downloadBlob]);

  return (
    <div className="settings-panel" role="complementary" aria-label="Display settings">
      <div className="settings-header">
        <h2 className="settings-title">Einstellungsmenue</h2>
        <button
          type="button"
          className="settings-close-btn"
          onClick={onClose}
          aria-label="Close settings"
          title="Close settings"
        >
          Close
        </button>
      </div>

      <div className="settings-page-switch" role="tablist" aria-label="Settings pages">
        <button type="button" role="tab" aria-selected={activePage === 'settings'} className={['settings-page-btn', activePage === 'settings' ? 'active' : ''].join(' ')} onClick={() => setActivePage('settings')}>Einstellungen</button>
        <button type="button" role="tab" aria-selected={activePage === 'io'} className={['settings-page-btn', activePage === 'io' ? 'active' : ''].join(' ')} onClick={() => setActivePage('io')}>Import / Export</button>
        <button type="button" role="tab" aria-selected={activePage === 'templates'} className={['settings-page-btn', activePage === 'templates' ? 'active' : ''].join(' ')} onClick={() => setActivePage('templates')}>Vorlagen</button>
        <button type="button" role="tab" aria-selected={activePage === 'support'} className={['settings-page-btn', activePage === 'support' ? 'active' : ''].join(' ')} onClick={() => setActivePage('support')}>Kontakt & Support</button>
        <button type="button" role="tab" aria-selected={activePage === 'about'} className={['settings-page-btn', activePage === 'about' ? 'active' : ''].join(' ')} onClick={() => setActivePage('about')}>Kurzbeschreibung</button>
      </div>

      {activePage === 'settings' && (
        <>
          <fieldset className="settings-group">
            <legend>Tier</legend>
            <div className="tier-radio-group" role="radiogroup" aria-label="Application tier">
              {(['basic', 'professional', 'expert'] as const).map((t) => (
                <label key={t} className={`tier-label ${tier === t ? 'active' : ''}`}>
                  <input type="radio" name="tier" value={t} checked={tier === t} onChange={() => setTier(t)} />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="settings-group">
            <legend>Einstellungen</legend>
            <div className="settings-row">
              <label htmlFor={fontSizeId}>Font size</label>
              <input id={fontSizeId} type="range" min={16} max={120} step={2} value={display.fontSize} onChange={(e) => setDisplay({ fontSize: Number(e.target.value) })} />
              <span className="settings-value">{display.fontSize}px</span>
            </div>
            <div className="settings-row">
              <label htmlFor={fontFamilyId}>Font family</label>
              <select id={fontFamilyId} value={display.fontFamily} onChange={(e) => setDisplay({ fontFamily: e.target.value })}>
                <option value="sans-serif">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
              </select>
            </div>
            <div className="settings-row">
              <label htmlFor={lineHeightId}>Line height</label>
              <input id={lineHeightId} type="range" min={1} max={3} step={0.1} value={display.lineHeight} onChange={(e) => setDisplay({ lineHeight: Number(e.target.value) })} />
              <span className="settings-value">{display.lineHeight.toFixed(1)}x</span>
            </div>
            <div className="settings-row">
              <label htmlFor={textColorId}>Text color</label>
              <input id={textColorId} type="color" value={display.textColor} onChange={(e) => setDisplay({ textColor: e.target.value })} />
            </div>
            <div className="settings-row">
              <label htmlFor={bgColorId}>Background</label>
              <input id={bgColorId} type="color" value={display.backgroundColor} onChange={(e) => setDisplay({ backgroundColor: e.target.value })} />
            </div>
            <div className="settings-row">
              <label htmlFor={textAlignId}>Text align</label>
              <select id={textAlignId} value={display.textAlign} onChange={(e) => setDisplay({ textAlign: e.target.value as 'left' | 'center' | 'right' })}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="settings-row">
              <label><input type="checkbox" checked={display.darkMode} onChange={(e) => setDisplay({ darkMode: e.target.checked })} />Dark mode (Director UI)</label>
            </div>
            <div className="settings-row">
              {tier !== 'basic' ? (
                <label><input type="checkbox" checked={display.cueMarkerEnabled} onChange={(e) => setDisplay({ cueMarkerEnabled: e.target.checked })} />Cue marker</label>
              ) : (
                <span className="settings-value">Cue marker available in Professional and Expert tiers.</span>
              )}
            </div>
            {tier !== 'basic' && display.cueMarkerEnabled && (
              <div className="settings-row">
                <label htmlFor={cuePositionId}>Cue position</label>
                <input id={cuePositionId} type="range" min={5} max={80} step={1} value={display.cueMarkerPosition} onChange={(e) => setDisplay({ cueMarkerPosition: Number(e.target.value) })} />
                <span className="settings-value">{display.cueMarkerPosition}%</span>
              </div>
            )}
            {tier === 'expert' && speechService.isSupported && (
              <>
                <div className="settings-row">
                  <label><input type="checkbox" checked={speechEnabled} onChange={(e) => setSpeechEnabled(e.target.checked)} />Voice tracking</label>
                </div>
                <div className="settings-row">
                  <label htmlFor={speechInputId}>Microphone source</label>
                  <select id={speechInputId} value={speechInputDeviceId ?? ''} onChange={(e) => {
                    const deviceId = e.target.value || null;
                    setSpeechInputDeviceId(deviceId);
                    speechService.setInputDeviceId(deviceId);
                  }}>
                    <option value="">System default</option>
                    {audioInputs.map((device, idx) => (
                      <option key={device.deviceId} value={device.deviceId}>{device.label || `Microphone ${idx + 1}`}</option>
                    ))}
                  </select>
                </div>
                <div className="settings-row">
                  <label htmlFor={speechSensitivityId}>Voice-Empfindlichkeit</label>
                  <input id={speechSensitivityId} type="range" min={0} max={100} step={1} value={speechSensitivity} onChange={(e) => setSpeechSensitivity(Number(e.target.value))} />
                  <input type="number" min={0} max={100} step={1} className="voice-sensitivity-number" value={speechSensitivity} onChange={(e) => setSpeechSensitivity(Number(e.target.value))} aria-label="Voice-Empfindlichkeit in Prozent" />
                  <span className="settings-value">{speechSensitivity}%</span>
                </div>
                <div className="voice-calibration" aria-label="Voice calibration assistant">
                  <div className="voice-calibration-title">Kalibrierungs-Assistent</div>
                  <p className="voice-calibration-phrase">Testsatz: "{CALIBRATION_PHRASE}"</p>
                  <div className="voice-calibration-actions">
                    <button type="button" className="btn-small" onClick={handleRunCalibration} disabled={isCalibrating}>{isCalibrating ? 'Kalibriere ...' : 'Kalibrierung starten'}</button>
                    {calibrationRecommendation !== null && <span className="voice-calibration-rec">Empfehlung aktiv: {calibrationRecommendation}%</span>}
                  </div>
                  {calibrationInfo && <p className="voice-calibration-info">{calibrationInfo}</p>}
                </div>
              </>
            )}

            <div className="settings-row">
              <label htmlFor={profileNameId}>Telepromptervorlage</label>
              <input id={profileNameId} type="text" className="profile-name-input" placeholder="z. B. Abendnachrichten" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
              <button type="button" className="btn-small" onClick={handleSaveProfile} disabled={!profileName.trim()}>Speichern</button>
            </div>
          </fieldset>
        </>
      )}

      {activePage === 'io' && (
        <>
          <fieldset className="settings-group">
            <legend>Export und Import</legend>
            <p className="settings-help-text">Exportiere Telepromptervorlagen als CSV, JSON, PDF oder TXT. Import unterstuetzt JSON und CSV.</p>
            <div className="settings-row segment-io-actions">
              <button type="button" className="btn-small" onClick={handleExportSegmentsJson}>JSON Export</button>
              <button type="button" className="btn-small" onClick={handleExportSegmentsCsv}>CSV Export</button>
              <button type="button" className="btn-small" onClick={handleExportSegmentsPdf}>PDF Export</button>
              <button type="button" className="btn-small" onClick={handleExportSegmentsTxt}>TXT Export</button>
              <button type="button" className="btn-small" onClick={handlePrintSegments}>Klassisch drucken</button>
            </div>
            <div className="settings-row segment-io-actions">
              <button type="button" className="btn-small" onClick={handleImportSegmentsClick}>Import JSON/CSV</button>
              <input ref={importInputRef} type="file" accept="application/json,text/csv,.csv" onChange={handleImportSegmentsFile} className="segment-import-input" aria-label="Telepromptervorlagen importieren" />
            </div>
            {scriptIoInfo && <div className="settings-row"><span className="settings-value segment-io-status">{scriptIoInfo}</span></div>}
          </fieldset>

          <fieldset className="settings-group">
            <legend>Downloads fuer Importbeispiele</legend>
            <div className="settings-row segment-io-actions">
              <button type="button" className="btn-small" onClick={handleDownloadJsonTemplate}>JSON Importvorlage</button>
              <button type="button" className="btn-small" onClick={handleDownloadCsvTemplate}>CSV Importvorlage</button>
            </div>
          </fieldset>
        </>
      )}

      {activePage === 'templates' && (
        <fieldset className="settings-group">
          <legend>Telepromptervorlagen</legend>
          <div className="settings-row">
            <label htmlFor="template-create-name">Neu anlegen</label>
            <input
              id="template-create-name"
              type="text"
              className="profile-name-input"
              placeholder="Neuer Vorlagenname"
              value={templateCreateName}
              onChange={(e) => setTemplateCreateName(e.target.value)}
            />
            <button type="button" className="btn-small btn-small--primary" onClick={handleCreateTemplate} disabled={!templateCreateName.trim()}>
              Vorlage anlegen
            </button>
          </div>
          <div className="settings-row">
            <label htmlFor="template-search">Suchen</label>
            <input id="template-search" type="search" className="profile-name-input" placeholder="Telepromptervorlage durchsuchen" value={templateSearch} onChange={(e) => setTemplateSearch(e.target.value)} />
          </div>
          <div className="template-table-wrap" role="region" aria-label="Liste Telepromptervorlagen">
            <table className="template-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Segmente</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((p) => (
                  <tr key={p.id} className={activeProfileId === p.id ? 'active' : ''}>
                    <td>
                      <input
                        type="text"
                        className="template-name-input"
                        value={templateNameDrafts[p.id] ?? p.name}
                        onChange={(e) => setTemplateNameDrafts((current) => ({ ...current, [p.id]: e.target.value }))}
                        aria-label={`Vorlagenname von ${p.name}`}
                      />
                    </td>
                    <td>{activeProfileId === p.id ? 'Aktiv' : '-'}</td>
                    <td>{p.scriptTemplate?.segments.length ?? 0}</td>
                    <td>
                      <div className="template-actions">
                        <button type="button" className="btn-small" onClick={() => applyProfile(p.id)}>Anwenden</button>
                        <button type="button" className="btn-small" onClick={() => handleRenameTemplate(p.id)} disabled={!templateNameDrafts[p.id]?.trim() || templateNameDrafts[p.id] === p.name}>Name speichern</button>
                        <button type="button" className="btn-small btn-small--danger" onClick={() => deleteProfile(p.id)}>Loeschen</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="settings-row">
            <button type="button" className="btn-small" onClick={handleLoadGermanTestScript}>Deutschen 4-Segment-Testtext laden</button>
          </div>
        </fieldset>
      )}

      {activePage === 'support' && (
        <section className="support-dashboard" aria-label="Kontakt und Support">
          <div className="support-hero">
            <div>
              <h3>Kontakt & Support</h3>
              <p>Ticket, Wissensquellen und Support-Logs an einem Ort, sauber nach Aufgaben getrennt.</p>
            </div>
            <div className="support-chip-row" aria-label="Support highlights">
              <span className="support-chip">Ticket-ID per E-Mail</span>
              <span className="support-chip">78h Log-Zugriff</span>
              <span className="support-chip">Schnelle Doku-Links</span>
            </div>
          </div>

          <div className="support-card-grid">
            <article className="support-card support-card--contact">
              <div className="support-card-head">
                <div>
                  <h4>Kontakt mit support. Ticketerstellung:</h4>
                  <p>Wenn Chat nicht reicht, wird hier direkt ein Ticket mit Rueckmeldung erstellt.</p>
                </div>
                {supportInfo.chatUrl ? (
                  <button type="button" className="support-ghost-btn" onClick={() => window.open(supportInfo.chatUrl as string, '_blank', 'noopener,noreferrer')}>
                    {supportInfo.chatLabel}
                  </button>
                ) : (
                  <span className="support-chip support-chip--muted">Chat nicht konfiguriert</span>
                )}
              </div>

              <div className="settings-row support-form-row">
                <label htmlFor="support-ticket-name">Name</label>
                <input id="support-ticket-name" type="text" value={ticketName} onChange={(e) => setTicketName(e.target.value)} className="support-input" placeholder="Ihr Name" />
              </div>
              <div className="settings-row support-form-row">
                <label htmlFor="support-ticket-email">E-Mail</label>
                <input id="support-ticket-email" type="email" value={ticketEmail} onChange={(e) => setTicketEmail(e.target.value)} className="support-input" placeholder="name@domain.tld" />
              </div>
              <div className="settings-row support-form-row">
                <label htmlFor="support-ticket-subject">Betreff</label>
                <input id="support-ticket-subject" type="text" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} className="support-input" placeholder="Kurzer Betreff" />
              </div>
              <div className="settings-row support-form-row support-message-row">
                <label htmlFor="support-ticket-message">Beschreibung</label>
                <textarea id="support-ticket-message" value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} className="support-textarea" placeholder="Was ist passiert?" rows={4} />
              </div>
              <div className="support-card-footer">
                <button type="button" className="btn-small btn-small--primary" onClick={handleCreateSupportTicket} disabled={supportSending}>
                  {supportSending ? 'Sende Ticket ...' : 'Support-Ticket erstellen'}
                </button>
                {supportStatus && <span className="support-status">{supportStatus}</span>}
              </div>
            </article>

            <article className="support-card support-card--resources">
              <div className="support-card-head">
                <div>
                  <h4>Hilfe & Unterlagen</h4>
                  <p>Wichtige Links fuer Support, Tester und Betrieb.</p>
                </div>
              </div>

              <div className="support-link-list">
                {supportInfo.handbookUrl && (
                  <a className="support-link-card" href={supportInfo.handbookUrl} target="_blank" rel="noreferrer">
                    <span>Handbuch</span>
                    <small>Technische Referenz und Abläufe</small>
                  </a>
                )}
                {supportInfo.testerGuideUrl && (
                  <a className="support-link-card" href={supportInfo.testerGuideUrl} target="_blank" rel="noreferrer">
                    <span>Live-Tester Guide</span>
                    <small>Checkliste fuer Beta-Feedback</small>
                  </a>
                )}
                {supportInfo.testerFormUrl && (
                  <a className="support-link-card" href={supportInfo.testerFormUrl} target="_blank" rel="noreferrer">
                    <span>Testerformular</span>
                    <small>Formular fuer Rueckmeldungen</small>
                  </a>
                )}
              </div>
            </article>

            <article className="support-card support-card--logs">
              <div className="support-card-head">
                <div>
                  <h4>Support-Logs</h4>
                  <p>Nur fuer Support: letzte 78 Stunden Client-Logs abrufen.</p>
                </div>
                <span className="support-chip">Zugriff geschuetzt</span>
              </div>

              <div className="settings-row support-form-row">
                <label htmlFor="support-access-key">Support-Key</label>
                <input
                  id="support-access-key"
                  type="password"
                  value={supportAccessKey}
                  onChange={(e) => setSupportAccessKey(e.target.value)}
                  className="support-input"
                  placeholder="Support API Key"
                />
              </div>
              <div className="support-card-footer">
                <button type="button" className="btn-small btn-small--primary" onClick={handleLoadSupportLogs} disabled={supportLogsLoading}>
                  {supportLogsLoading ? 'Lade ...' : 'Logs laden (78h)'}
                </button>
                <button type="button" className="btn-small" onClick={handleDownloadSupportLogs} disabled={supportLogs.length === 0}>
                  Logs als TXT herunterladen
                </button>
              </div>
              {supportLogsStatus && <p className="support-status support-status--block">{supportLogsStatus}</p>}
              {supportLogs.length > 0 && (
                <div className="support-log-view" role="region" aria-label="Support-Log Ausgabe">
                  <pre>
                    {supportLogs.map((log) => {
                      const details = log.details ? ` | ${log.details}` : '';
                      return `[${log.createdAt}] ${log.level.toUpperCase()} ${log.source}: ${log.message}${details}`;
                    }).join('\n')}
                  </pre>
                </div>
              )}
            </article>
          </div>
        </section>
      )}

      {activePage === 'about' && (
        <section className="settings-short-about" aria-label="Kurze App-Beschreibung">
          <h3>Kurzbeschreibung</h3>
          <p>SAARwooD Teleprompter Beta V1 ist eine Teleprompter-App fuer Editor, Split und Prompter-Ausgabe.</p>
          <p>Sie bietet manuelle Steuerung, Cue-Marker, Spiegelung, Rotation und WebSocket-Sync.</p>
          <p>Desktop-Betrieb: Mit Monitor 2 Vollbild kann die Prompter-Ausgabe direkt auf den zweiten Bildschirm gelegt werden.</p>
          <h4 className="settings-subheading">Tastenbelegung</h4>
          <ul className="settings-short-about-hotkeys" aria-label="Tastaturbelegungen">
            <li>Leertaste: Play/Pause</li>
            <li>R: Text auf Anfang (Reset/Stop), Escape: Stop</li>
            <li>N: Prompter NeuStart (mit Bestaetigung)</li>
            <li>+ / = / Numpad+: Geschwindigkeit +5</li>
            <li>- / _ / Numpad-: Geschwindigkeit -5</li>
            <li>Pfeil hoch / runter: Richtung hoch / runter</li>
            <li>H: Spiegelung horizontal</li>
            <li>[ / ]: Rotation -90 / +90</li>
            <li>F: Vollbild umschalten</li>
            <li>V: Voice ON (nur Expert), M: Voice OFF (nur Expert)</li>
          </ul>
          <h4 className="settings-subheading">Links</h4>
          <div className="settings-link-grid">
            {supportInfo.chatUrl && (
              <a className="support-link-card" href={supportInfo.chatUrl} target="_blank" rel="noreferrer">
                <span>{supportInfo.chatLabel}</span>
                <small>Direkter Support-Kontakt</small>
              </a>
            )}
            {supportInfo.handbookUrl && (
              <a className="support-link-card" href={supportInfo.handbookUrl} target="_blank" rel="noreferrer">
                <span>Handbuch</span>
                <small>Technische Referenz und Abläufe</small>
              </a>
            )}
            {supportInfo.testerGuideUrl && (
              <a className="support-link-card" href={supportInfo.testerGuideUrl} target="_blank" rel="noreferrer">
                <span>Live-Tester Guide</span>
                <small>Checkliste fuer Beta-Feedback</small>
              </a>
            )}
            {supportInfo.testerFormUrl && (
              <a className="support-link-card" href={supportInfo.testerFormUrl} target="_blank" rel="noreferrer">
                <span>Testerformular</span>
                <small>Formular fuer Rueckmeldungen</small>
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
