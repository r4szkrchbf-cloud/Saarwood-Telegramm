import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { usePrompterStore } from '../../store/prompterStore';
import { speechService } from '../../services/SpeechRecognitionService';
import type { PresenterProfile } from '../../types';
import './SettingsPanel.css';

interface SettingsPanelProps {
  onClose: () => void;
}

/**
 * SettingsPanel
 *
 * Presenter preferences and display configuration.
 * All changes are persisted to localStorage via Zustand's persist middleware.
 */
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
    contactEmail: 'support@saarwood.local',
    chatUrl: '' as string | null,
    chatLabel: 'Support Chat',
  });
  const [supportStatus, setSupportStatus] = useState('');
  const [supportSending, setSupportSending] = useState(false);
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [activePage, setActivePage] = useState<'settings' | 'about'>('settings');
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const CALIBRATION_PHRASE = 'Heute testen wir das Voice Tracking fuer den Saarwood Teleprompter.';

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
    let active = true;

    const loadSupportInfo = async () => {
      try {
        const response = await fetch('/api/support/info');
        if (!response.ok) return;
        const payload = await response.json() as {
          contactEmail?: string;
          chatUrl?: string | null;
          chatLabel?: string;
        };
        if (!active) return;
        setSupportInfo({
          contactEmail: payload.contactEmail || 'support@saarwood.local',
          chatUrl: payload.chatUrl || null,
          chatLabel: payload.chatLabel || 'Support Chat',
        });
      } catch {
        // Keep defaults when support service info is unavailable.
      }
    };

    loadSupportInfo();
    return () => {
      active = false;
    };
  }, []);

  const handleSaveProfile = useCallback(() => {
    const nameInput = document.getElementById(profileNameId) as HTMLInputElement | null;
    const name = nameInput?.value.trim();
    if (!name) return;
    const profile: PresenterProfile = {
      id: `profile-${Date.now()}`,
      name,
      displaySettings: { ...display },
    };
    saveProfile(profile);
    if (nameInput) nameInput.value = '';
  }, [display, saveProfile, profileNameId]);

  const handleLoadGermanTestScript = useCallback(() => {
    setScript({
      ...script,
      lastModified: Date.now(),
      segments: [
        {
          id: `seg-${Date.now()}-1`,
          html: '<p>Guten Abend und herzlich willkommen zu unserer Sendung. In den naechsten Minuten fassen wir die wichtigsten Meldungen des Tages kompakt und verstaendlich zusammen.</p>',
          direction: 'ltr',
          isCloaked: false,
          isDirectorsNote: false,
        },
        {
          id: `seg-${Date.now()}-2`,
          html: '<p>Im ersten Themenblock geht es um die Verkehrslage im Saarland. Der Berufsverkehr bleibt auf den Hauptachsen dicht, auf der A sechs kommt es weiterhin zu zoegerlichem Vorankommen.</p>',
          direction: 'ltr',
          isCloaked: false,
          isDirectorsNote: false,
        },
        {
          id: `seg-${Date.now()}-3`,
          html: '<p>Danach schauen wir auf das Wetter: In der Nacht bleibt es weitgehend trocken, lokal kann sich Nebel bilden. Morgen starten wir freundlich, spaeter ziehen Wolken auf.</p>',
          direction: 'ltr',
          isCloaked: false,
          isDirectorsNote: false,
        },
        {
          id: `seg-${Date.now()}-4`,
          html: '<p>Zum Abschluss noch der Sport: Die Saarwood Falcons gewinnen ihr Heimspiel mit zwei zu eins. Das Team zeigt eine stabile Defensive und bleibt damit auf Playoff-Kurs.</p>',
          direction: 'ltr',
          isCloaked: false,
          isDirectorsNote: false,
        },
      ],
    });
  }, [script, setScript]);

  const handleExportSegments = useCallback(() => {
    try {
      const payload = {
        format: 'saarwood-segments-v1',
        exportedAt: new Date().toISOString(),
        title: script.title,
        segments: script.segments,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'saarwood-segmente-export.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setScriptIoInfo('Segmente erfolgreich exportiert.');
    } catch {
      setScriptIoInfo('Export fehlgeschlagen.');
    }
  }, [script]);

  const handleImportSegmentsClick = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const handleImportSegmentsFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as {
        title?: string;
        segments?: Array<{
          id?: string;
          html?: string;
          direction?: 'ltr';
          isCloaked?: boolean;
          isDirectorsNote?: boolean;
          mosItemId?: string;
        }>;
      };

      if (!Array.isArray(parsed.segments)) {
        throw new Error('invalid format');
      }

      const now = Date.now();
      const segments = parsed.segments
        .filter((seg) => typeof seg?.html === 'string')
        .map((seg, idx) => ({
          id: seg.id || `imp-${now}-${idx + 1}`,
          html: seg.html || '<p></p>',
          direction: 'ltr' as const,
          isCloaked: Boolean(seg.isCloaked),
          isDirectorsNote: Boolean(seg.isDirectorsNote),
          mosItemId: seg.mosItemId,
        }));

      if (segments.length === 0) {
        throw new Error('no segments');
      }

      setScript({
        ...script,
        title: parsed.title || script.title,
        lastModified: now,
        segments,
      });
      setScriptIoInfo(`Import erfolgreich: ${segments.length} Segmente geladen.`);
    } catch {
      setScriptIoInfo('Import fehlgeschlagen. Bitte gueltige JSON-Datei verwenden.');
    } finally {
      if (e.target) e.target.value = '';
    }
  }, [script, setScript]);

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
      // Stop runtime voice tracking while calibrating to avoid interference.
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
        return;
      }

      const payload = await response.json() as { id?: string };
      setSupportStatus(`Ticket erstellt: ${payload.id ?? 'ok'}`);
      setTicketSubject('');
      setTicketMessage('');
    } catch {
      setSupportStatus('Ticket konnte nicht gesendet werden (Netzwerkfehler).');
    } finally {
      setSupportSending(false);
    }
  }, [supportSending, ticketName, ticketEmail, ticketSubject, ticketMessage]);

  return (
    <div className="settings-panel" role="complementary" aria-label="Display settings">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
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
        <button
          type="button"
          role="tab"
          aria-selected={activePage === 'settings'}
          className={['settings-page-btn', activePage === 'settings' ? 'active' : ''].join(' ')}
          onClick={() => setActivePage('settings')}
        >
          Einstellungen
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activePage === 'about'}
          className={['settings-page-btn', activePage === 'about' ? 'active' : ''].join(' ')}
          onClick={() => setActivePage('about')}
        >
          Kurzbeschreibung
        </button>
      </div>

      {activePage === 'settings' && (
        <>

      {/* ─── Tier selector ─────────────────────────────────────────────── */}
      <fieldset className="settings-group">
        <legend>Tier</legend>
        <div className="tier-radio-group" role="radiogroup" aria-label="Application tier">
          {(['basic', 'professional', 'expert'] as const).map((t) => (
            <label key={t} className={`tier-label ${tier === t ? 'active' : ''}`}>
              <input
                type="radio"
                name="tier"
                value={t}
                checked={tier === t}
                onChange={() => setTier(t)}
              />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>
      </fieldset>

      {/* ─── Display ───────────────────────────────────────────────────── */}
      <fieldset className="settings-group">
        <legend>Display</legend>

        <div className="settings-row">
          <label htmlFor={fontSizeId}>Font size</label>
          <input
            id={fontSizeId}
            type="range"
            min={16}
            max={120}
            step={2}
            value={display.fontSize}
            onChange={(e) => setDisplay({ fontSize: Number(e.target.value) })}
          />
          <span className="settings-value">{display.fontSize}px</span>
        </div>

        <div className="settings-row">
          <label htmlFor={fontFamilyId}>Font family</label>
          <select
            id={fontFamilyId}
            value={display.fontFamily}
            onChange={(e) => setDisplay({ fontFamily: e.target.value })}
          >
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
          <input
            id={lineHeightId}
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={display.lineHeight}
            onChange={(e) => setDisplay({ lineHeight: Number(e.target.value) })}
          />
          <span className="settings-value">
            {display.lineHeight.toFixed(1)}×
          </span>
        </div>

        <div className="settings-row">
          <label htmlFor={textColorId}>Text color</label>
          <input
            id={textColorId}
            type="color"
            value={display.textColor}
            onChange={(e) => setDisplay({ textColor: e.target.value })}
          />
        </div>

        <div className="settings-row">
          <label htmlFor={bgColorId}>Background</label>
          <input
            id={bgColorId}
            type="color"
            value={display.backgroundColor}
            onChange={(e) => setDisplay({ backgroundColor: e.target.value })}
          />
        </div>

        <div className="settings-row">
          <label htmlFor={textAlignId}>Text align</label>
          <select
            id={textAlignId}
            value={display.textAlign}
            onChange={(e) =>
              setDisplay({
                textAlign: e.target.value as 'left' | 'center' | 'right',
              })
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div className="settings-row">
          <label>
            <input
              type="checkbox"
              checked={display.darkMode}
              onChange={(e) => setDisplay({ darkMode: e.target.checked })}
            />
            Dark mode (Director UI)
          </label>
        </div>

        <div className="settings-row">
          {tier !== 'basic' ? (
            <label>
              <input
                type="checkbox"
                checked={display.cueMarkerEnabled}
                onChange={(e) =>
                  setDisplay({ cueMarkerEnabled: e.target.checked })
                }
              />
              Cue marker
            </label>
          ) : (
            <span className="settings-value">Cue marker available in Professional and Expert tiers.</span>
          )}
        </div>

        {tier !== 'basic' && display.cueMarkerEnabled && (
          <div className="settings-row">
            <label htmlFor={cuePositionId}>Cue position</label>
            <input
              id={cuePositionId}
              type="range"
              min={5}
              max={80}
              step={1}
              value={display.cueMarkerPosition}
              onChange={(e) =>
                setDisplay({ cueMarkerPosition: Number(e.target.value) })
              }
            />
            <span className="settings-value">{display.cueMarkerPosition}%</span>
          </div>
        )}

        {tier === 'expert' && speechService.isSupported && (
          <div className="settings-row">
            <label>
              <input
                type="checkbox"
                checked={speechEnabled}
                onChange={(e) => setSpeechEnabled(e.target.checked)}
              />
              Voice tracking
            </label>
          </div>
        )}

        {tier === 'expert' && speechService.isSupported && (
          <div className="settings-row">
            <label htmlFor={speechInputId}>Microphone source</label>
            <select
              id={speechInputId}
              value={speechInputDeviceId ?? ''}
              onChange={(e) => {
                const deviceId = e.target.value || null;
                setSpeechInputDeviceId(deviceId);
                speechService.setInputDeviceId(deviceId);
              }}
            >
              <option value="">System default</option>
              {audioInputs.map((device, idx) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {tier === 'expert' && speechService.isSupported && (
          <div className="settings-row">
            <label htmlFor={speechSensitivityId}>Voice-Empfindlichkeit</label>
            <input
              id={speechSensitivityId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={speechSensitivity}
              onChange={(e) => setSpeechSensitivity(Number(e.target.value))}
            />
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              className="voice-sensitivity-number"
              value={speechSensitivity}
              onChange={(e) => setSpeechSensitivity(Number(e.target.value))}
              aria-label="Voice-Empfindlichkeit in Prozent"
            />
            <span className="settings-value">{speechSensitivity}%</span>
          </div>
        )}

        {tier === 'expert' && speechService.isSupported && (
          <div className="voice-status-legend" aria-label="Voice status legend">
            <div className="voice-status-legend-title">Voice-Status Legende</div>
            <ul className="voice-status-legend-list">
              <li><strong>Voice: AUS</strong> - Voice-Tracking ist deaktiviert.</li>
              <li><strong>Voice: Gemutet (Pause)</strong> - Bei Pause ist Voice-Tracking stumm und reagiert nicht auf Sprache.</li>
              <li><strong>Voice: Startet</strong> - Mikrofon/Erkennung wird initialisiert.</li>
              <li><strong>Voice: Hoert zu</strong> - Sprache wird aktiv erkannt.</li>
              <li><strong>Voice: Wartet</strong> - Dienst startet nach Unterbrechung neu.</li>
              <li><strong>Voice: Keine Sprache</strong> - Es wurde aktuell nichts Verwertbares erkannt.</li>
              <li><strong>Voice: Fehler</strong> - Konkreter Grund steht in Klammern (z. B. Mikrofonzugriff verweigert).</li>
              <li><strong>Empfindlichkeit 0-100%</strong> - Hoeherer Wert reagiert strenger und reduziert ungenaue Treffer.</li>
            </ul>
          </div>
        )}

        {tier === 'expert' && speechService.isSupported && (
          <div className="voice-calibration" aria-label="Voice calibration assistant">
            <div className="voice-calibration-title">Kalibrierungs-Assistent</div>
            <p className="voice-calibration-phrase">
              Testsatz: "{CALIBRATION_PHRASE}"
            </p>
            <div className="voice-calibration-actions">
              <button
                type="button"
                className="btn-small"
                onClick={handleRunCalibration}
                disabled={isCalibrating}
              >
                {isCalibrating ? 'Kalibriere ...' : 'Kalibrierung starten'}
              </button>
              {calibrationRecommendation !== null && (
                <span className="voice-calibration-rec">
                  Empfehlung aktiv: {calibrationRecommendation}%
                </span>
              )}
            </div>
            {calibrationInfo && (
              <p className="voice-calibration-info">{calibrationInfo}</p>
            )}
          </div>
        )}

        {tier !== 'expert' && (
          <div className="settings-row">
            <span className="settings-value">Voice tracking ist nur im Expert-Tier verfuegbar.</span>
          </div>
        )}

        {tier === 'expert' && !speechService.isSupported && (
          <div className="settings-row">
            <span className="settings-value">
              Voice tracking is not available in this browser because the Web Speech API is not supported.
            </span>
          </div>
        )}
      </fieldset>

      {/* ─── Presenter Profiles (Professional+) ──────────────────────── */}
      <fieldset className="settings-group">
        <legend>Testtext</legend>
        <div className="settings-row">
          <button type="button" className="btn-small" onClick={handleLoadGermanTestScript}>
            Deutschen 4-Segment-Testtext laden
          </button>
        </div>
      </fieldset>

      <fieldset className="settings-group">
        <legend>Segmente</legend>
        <div className="settings-row segment-io-actions">
          <button type="button" className="btn-small" onClick={handleImportSegmentsClick}>
            Importieren
          </button>
          <button type="button" className="btn-small" onClick={handleExportSegments}>
            Exportieren
          </button>
          <button type="button" className="btn-small" onClick={handlePrintSegments}>
            Drucken
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportSegmentsFile}
            className="segment-import-input"
            aria-label="Segmente importieren"
          />
        </div>
        {scriptIoInfo && (
          <div className="settings-row">
            <span className="settings-value segment-io-status">{scriptIoInfo}</span>
          </div>
        )}
      </fieldset>

      {tier !== 'basic' && (
        <fieldset className="settings-group">
          <legend>Presenter Profiles</legend>

          <div className="settings-row">
            <label htmlFor={profileNameId}>New profile name</label>
            <input
              id={profileNameId}
              type="text"
              placeholder="e.g. John Doe"
              className="profile-name-input"
            />
            <button type="button" className="btn-small" onClick={handleSaveProfile}>
              Save current settings
            </button>
          </div>

          <ul className="profile-list" aria-label="Saved presenter profiles">
            {profiles.map((p) => (
              <li
                key={p.id}
                className={`profile-item ${activeProfileId === p.id ? 'active' : ''}`}
              >
                <span className="profile-name">{p.name}</span>
                <button
                  type="button"
                  className="btn-small"
                  onClick={() => applyProfile(p.id)}
                  aria-label={`Apply profile ${p.name}`}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className="btn-small btn-small--danger"
                  onClick={() => deleteProfile(p.id)}
                  aria-label={`Delete profile ${p.name}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      <fieldset className="settings-group">
        <legend>Support</legend>

        <div className="settings-row support-row">
          <span className="support-label">Kontakt</span>
          <a href={`mailto:${supportInfo.contactEmail}`} className="support-link">
            {supportInfo.contactEmail}
          </a>
        </div>

        <div className="settings-row support-row">
          <span className="support-label">Direkt-Chat</span>
          {supportInfo.chatUrl ? (
            <button
              type="button"
              className="btn-small"
              onClick={() => window.open(supportInfo.chatUrl as string, '_blank', 'noopener,noreferrer')}
            >
              {supportInfo.chatLabel}
            </button>
          ) : (
            <span className="settings-value support-muted">Chat aktuell nicht konfiguriert</span>
          )}
        </div>

        <div className="settings-row support-form-row">
          <label htmlFor="support-ticket-name">Name</label>
          <input
            id="support-ticket-name"
            type="text"
            value={ticketName}
            onChange={(e) => setTicketName(e.target.value)}
            className="support-input"
            placeholder="Ihr Name"
          />
        </div>

        <div className="settings-row support-form-row">
          <label htmlFor="support-ticket-email">E-Mail</label>
          <input
            id="support-ticket-email"
            type="email"
            value={ticketEmail}
            onChange={(e) => setTicketEmail(e.target.value)}
            className="support-input"
            placeholder="name@domain.tld"
          />
        </div>

        <div className="settings-row support-form-row">
          <label htmlFor="support-ticket-subject">Betreff</label>
          <input
            id="support-ticket-subject"
            type="text"
            value={ticketSubject}
            onChange={(e) => setTicketSubject(e.target.value)}
            className="support-input"
            placeholder="Kurzer Betreff"
          />
        </div>

        <div className="settings-row support-form-row support-message-row">
          <label htmlFor="support-ticket-message">Beschreibung</label>
          <textarea
            id="support-ticket-message"
            value={ticketMessage}
            onChange={(e) => setTicketMessage(e.target.value)}
            className="support-textarea"
            placeholder="Was ist passiert?"
            rows={4}
          />
        </div>

        <div className="settings-row support-row">
          <button
            type="button"
            className="btn-small"
            onClick={handleCreateSupportTicket}
            disabled={supportSending}
          >
            {supportSending ? 'Sende Ticket ...' : 'Support-Ticket erstellen'}
          </button>
          {supportStatus && <span className="support-status">{supportStatus}</span>}
        </div>
      </fieldset>
        </>
      )}

      {activePage === 'about' && (
        <section className="settings-short-about" aria-label="Kurze App-Beschreibung">
          <h3>Kurzbeschreibung</h3>
          <p>SAARwooD Teleprompter Beta V1 ist eine Teleprompter-App fuer Editor, Split und Prompter-Ausgabe.</p>
          <p>Sie bietet manuelle Steuerung, Cue-Marker, Spiegelung, Rotation und WebSocket-Sync.</p>
          <p>Desktop-Betrieb: Mit Monitor 2 Vollbild kann die Prompter-Ausgabe direkt auf den zweiten Bildschirm gelegt werden.</p>
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
          <p>Voice Tracking ist in dieser Beta Version nicht enthalten.</p>
        </section>
      )}
    </div>
  );
}
