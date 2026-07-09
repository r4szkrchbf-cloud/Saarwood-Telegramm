import { useMemo, useState, type FormEvent } from 'react';
import './TesterFormPage.css';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

interface SupportTicketResponse {
  ok?: boolean;
  ticketId?: string;
  confirmationEmailSent?: boolean;
  supportNotificationEmailSent?: boolean;
  error?: string;
  issues?: Array<{ path: string; message: string }>;
}

const DEFAULT_SUBJECT = 'Beta-Testformular Saarwood Teleprompter';

function sanitize(value: string): string {
  return value.trim();
}

export function TesterFormPage() {
  const [testerName, setTesterName] = useState('');
  const [testerId, setTesterId] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<SubmitState>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);

  const summary = useMemo(() => ({
    testerName: sanitize(testerName) || 'Nicht angegeben',
    testerId: sanitize(testerId) || 'Nicht angegeben',
    email: sanitize(email),
    subject: sanitize(subject) || DEFAULT_SUBJECT,
    message: sanitize(message),
    notes: sanitize(notes),
  }), [email, message, notes, subject, testerId, testerName]);

  const canSubmit = summary.email.length > 0 && summary.message.length >= 10 && status !== 'submitting';

  const buildTicketMessage = () => [
    'Testerformular aus der Live-Seite',
    '',
    `Tester Name: ${summary.testerName}`,
    `Tester ID: ${summary.testerId}`,
    `E-Mail: ${summary.email}`,
    '',
    'Rueckmeldung:',
    summary.message,
    ...(summary.notes
      ? [
        '',
        'Ergaenzende Notizen:',
        summary.notes,
      ]
      : []),
  ].join('\n');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setStatus('error');
      setStatusMessage('Bitte E-Mail-Adresse und mindestens 10 Zeichen Rueckmeldung ausfuellen.');
      return;
    }

    setStatus('submitting');
    setStatusMessage('Sende Testerformular ...');

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: summary.testerName === 'Nicht angegeben' ? 'Anonymer Tester' : summary.testerName,
          email: summary.email,
          subject: summary.subject,
          message: buildTicketMessage(),
          appVersion: (import.meta as { env?: { VITE_APP_VERSION?: string } }).env?.VITE_APP_VERSION ?? 'beta-v1',
          sourceApp: 'tester-form-web',
          context: 'unknown',
        }),
      });

      const payload = await response.json() as SupportTicketResponse;
      if (!response.ok || !payload.ok || !payload.ticketId) {
        const issueText = payload.issues?.map((issue) => `${issue.path}: ${issue.message}`).join(', ');
        throw new Error(issueText || payload.error || 'ticket-create-failed');
      }

      setTicketId(payload.ticketId);
      setConfirmationEmailSent(Boolean(payload.confirmationEmailSent));
      setStatus('success');
      setStatusMessage('Formular gespeichert. Eine Kopie wurde an die angegebene E-Mail-Adresse gesendet.');
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'unbekannter-fehler';
      setStatus('error');
      setStatusMessage(`Senden fehlgeschlagen: ${messageText}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="tester-form-page">
      <div className="tester-form-orb tester-form-orb--one" />
      <div className="tester-form-orb tester-form-orb--two" />

      <section className="tester-form-shell">
        <header className="tester-form-hero">
          <p className="tester-form-kicker">/tester-form.html</p>
          <h1>SAARwood Beta Testerformular</h1>
          <p className="tester-form-intro">
            Optional kannst du deinen Namen und eine Tester-ID angeben. Die E-Mail-Adresse ist Pflicht,
            damit du eine Kopie deiner Einsendung bekommst.
          </p>
          <div className="tester-form-badges">
            <span className="tester-form-badge">Pflicht: E-Mail</span>
            <span className="tester-form-badge">Kopie per Mail</span>
            <span className="tester-form-badge">Druckansicht</span>
          </div>
        </header>

        <div className="tester-form-grid">
          <form className="tester-form-card" onSubmit={handleSubmit}>
            <div className="tester-form-card-head">
              <div>
                <h2>Tester eingeben</h2>
                <p>Die Daten gehen an das bestehende Support-System. Nach dem Absenden kannst du die Seite drucken.</p>
              </div>
              <button type="button" className="tester-form-print-btn" onClick={handlePrint}>Druckansicht</button>
            </div>

            <div className="tester-form-fields">
              <label className="tester-form-field">
                <span>Tester Name</span>
                <input
                  type="text"
                  value={testerName}
                  onChange={(event) => setTesterName(event.target.value)}
                  placeholder="Optionaler Name"
                  autoComplete="name"
                />
              </label>

              <label className="tester-form-field">
                <span>Tester ID</span>
                <input
                  type="text"
                  value={testerId}
                  onChange={(event) => setTesterId(event.target.value)}
                  placeholder="Optionaler Tester-Code"
                  autoComplete="off"
                />
              </label>

              <label className="tester-form-field">
                <span>E-Mail-Adresse *</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@domain.tld"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="tester-form-field tester-form-field--full">
                <span>Betreff *</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder={DEFAULT_SUBJECT}
                  required
                />
              </label>

              <label className="tester-form-field tester-form-field--full">
                <span>Testerbericht *</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Was ist dir aufgefallen? Was hat gut funktioniert? Was muss verbessert werden?"
                  rows={8}
                  minLength={10}
                  required
                />
              </label>

              <label className="tester-form-field tester-form-field--full">
                <span>Ergaenzende Notizen (optional)</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional: zusaetzliche Hinweise ohne direkten Fehlerbezug"
                  rows={4}
                />
              </label>
            </div>

            <div className="tester-form-actions">
              <button type="submit" className="tester-form-submit" disabled={!canSubmit}>
                {status === 'submitting' ? 'Sende ...' : 'Testerformular absenden'}
              </button>
              <p className="tester-form-status" aria-live="polite">{statusMessage || 'Fülle die Pflichtfelder aus und sende dann ab.'}</p>
            </div>
          </form>

          <aside className="tester-form-card tester-form-preview">
            <div className="tester-form-card-head">
              <div>
                <h2>Vorschau</h2>
                <p>So wird der Eintrag im Ticket und in der Druckansicht dargestellt.</p>
              </div>
            </div>

            <dl className="tester-form-summary">
              <div>
                <dt>Tester Name</dt>
                <dd>{summary.testerName}</dd>
              </div>
              <div>
                <dt>Tester ID</dt>
                <dd>{summary.testerId}</dd>
              </div>
              <div>
                <dt>E-Mail</dt>
                <dd>{summary.email || 'Noch offen'}</dd>
              </div>
              <div className="tester-form-summary--full">
                <dt>Betreff</dt>
                <dd>{summary.subject}</dd>
              </div>
              <div className="tester-form-summary--full">
                <dt>Bericht</dt>
                <dd>{summary.message || 'Noch kein Text erfasst.'}</dd>
              </div>
              <div className="tester-form-summary--full">
                <dt>Ergaenzende Notizen</dt>
                <dd>{summary.notes || 'Keine zusaetzlichen Notizen.'}</dd>
              </div>
            </dl>

            {status === 'success' && (
              <section className="tester-form-success">
                <h3>Gesendet</h3>
                <p>Ticket-ID: {ticketId}</p>
                <p>{confirmationEmailSent ? 'Die Kopie per E-Mail wurde angelegt.' : 'Das Ticket wurde gespeichert. E-Mail-Versand ist in der aktuellen Konfiguration nicht aktiv.'}</p>
              </section>
            )}

            <section className="tester-form-print-note">
              <h3>Hinweis zur Druckansicht</h3>
              <p>Der Button oben öffnet die Browser-Druckansicht. Beim Drucken wird diese Vorschau mit ausgegeben.</p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}