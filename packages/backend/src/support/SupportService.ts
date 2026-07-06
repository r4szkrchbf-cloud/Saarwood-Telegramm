import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface SupportInfo {
  chatUrl: string | null;
  chatLabel: string;
  handbookUrl: string | null;
  testerGuideUrl: string | null;
  testerFormUrl: string | null;
}

export interface SupportTicketInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  appVersion: string;
  context: 'editor' | 'split' | 'prompter' | 'unknown';
}

interface SupportTicketRecord extends SupportTicketInput {
  id: string;
  createdAt: string;
}

interface SupportTicketCreateResult {
  id: string;
  stored: boolean;
  forwarded: boolean;
  confirmationEmailSent: boolean;
}

interface TicketSequenceState {
  year: number;
  seq: number;
}

export class SupportService {
  private readonly chatUrl: string | null;

  private readonly chatLabel: string;

  private readonly ticketFilePath: string;

  private readonly ticketWebhookUrl: string | null;

  private readonly ticketSequenceFilePath: string;

  private readonly handbookUrl: string | null;

  private readonly testerGuideUrl: string | null;

  private readonly testerFormUrl: string | null;

  private readonly smtpHost: string | null;

  private readonly smtpPort: number;

  private readonly smtpSecure: boolean;

  private readonly smtpUser: string | null;

  private readonly smtpPass: string | null;

  private readonly mailFrom: string | null;

  private readonly mailReplyTo: string | null;

  private readonly supportContactEmail: string | null;

  private readonly confirmationMailEnabled: boolean;

  private readonly confirmationSubjectPrefix: string;

  private smtpTransporter: nodemailer.Transporter | null = null;

  constructor() {
    this.chatUrl = process.env.SUPPORT_CHAT_URL ?? null;
    this.chatLabel = process.env.SUPPORT_CHAT_LABEL ?? 'Support Chat';
    this.ticketFilePath = process.env.SUPPORT_TICKET_FILE
      ?? path.resolve(__dirname, '../../data/support-tickets.ndjson');
    this.ticketWebhookUrl = process.env.SUPPORT_TICKET_WEBHOOK_URL ?? null;
    this.ticketSequenceFilePath = process.env.SUPPORT_TICKET_SEQUENCE_FILE
      ?? path.resolve(__dirname, '../../data/support-ticket-sequence.json');
    this.handbookUrl = process.env.SUPPORT_HANDBOOK_URL ?? null;
    this.testerGuideUrl = process.env.SUPPORT_TESTER_GUIDE_URL ?? null;
    this.testerFormUrl = process.env.SUPPORT_TESTER_FORM_URL ?? null;
    this.smtpHost = process.env.SUPPORT_SMTP_HOST ?? null;
    this.smtpPort = parseInt(process.env.SUPPORT_SMTP_PORT ?? '587', 10);
    this.smtpSecure = process.env.SUPPORT_SMTP_SECURE === 'true';
    this.smtpUser = process.env.SUPPORT_SMTP_USER ?? null;
    this.smtpPass = process.env.SUPPORT_SMTP_PASS ?? null;
    this.mailFrom = process.env.SUPPORT_MAIL_FROM ?? null;
    this.mailReplyTo = process.env.SUPPORT_MAIL_REPLY_TO ?? null;
    this.supportContactEmail = process.env.SUPPORT_CONTACT_EMAIL ?? null;
    this.confirmationMailEnabled = process.env.SUPPORT_CONFIRMATION_MAIL_ENABLED !== 'false';
    this.confirmationSubjectPrefix = process.env.SUPPORT_CONFIRMATION_SUBJECT_PREFIX
      ?? '[Saarwood Support]';
  }

  getInfo(): SupportInfo {
    return {
      chatUrl: this.chatUrl,
      chatLabel: this.chatLabel,
      handbookUrl: this.handbookUrl,
      testerGuideUrl: this.testerGuideUrl,
      testerFormUrl: this.testerFormUrl,
    };
  }

  async createTicket(input: SupportTicketInput): Promise<SupportTicketCreateResult> {
    const id = this.nextTicketId();
    const record: SupportTicketRecord = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
    };

    this.appendTicket(record);

    const forwarded = await this.forwardTicket(record);
    const confirmationEmailSent = await this.sendTicketConfirmationEmail(record);
    return { id, stored: true, forwarded, confirmationEmailSent };
  }

  private appendTicket(record: SupportTicketRecord): void {
    fs.mkdirSync(path.dirname(this.ticketFilePath), { recursive: true });
    fs.appendFileSync(this.ticketFilePath, `${JSON.stringify(record)}\n`, 'utf-8');
  }

  private nextTicketId(): string {
    const now = new Date();
    const year = now.getUTCFullYear();

    const state = this.readTicketSequence();
    const seq = state.year === year ? state.seq + 1 : 1;
    this.writeTicketSequence({ year, seq });

    return `SWD-${year}-${String(seq).padStart(6, '0')}`;
  }

  private readTicketSequence(): TicketSequenceState {
    try {
      const raw = fs.readFileSync(this.ticketSequenceFilePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<TicketSequenceState>;
      const year = typeof parsed.year === 'number' ? parsed.year : 1970;
      const seq = typeof parsed.seq === 'number' ? parsed.seq : 0;
      return { year, seq };
    } catch {
      return { year: 1970, seq: 0 };
    }
  }

  private writeTicketSequence(state: TicketSequenceState): void {
    fs.mkdirSync(path.dirname(this.ticketSequenceFilePath), { recursive: true });
    fs.writeFileSync(this.ticketSequenceFilePath, `${JSON.stringify(state, null, 2)}\n`, 'utf-8');
  }

  private async forwardTicket(record: SupportTicketRecord): Promise<boolean> {
    if (!this.ticketWebhookUrl) return false;

    try {
      const response = await fetch(this.ticketWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private getTransporter(): nodemailer.Transporter | null {
    if (this.smtpTransporter) return this.smtpTransporter;
    if (!this.smtpHost || !this.mailFrom) return null;

    const config: SMTPTransport.Options = {
      host: this.smtpHost,
      port: Number.isFinite(this.smtpPort) ? this.smtpPort : 587,
      secure: this.smtpSecure,
    };

    if (this.smtpUser && this.smtpPass) {
      config.auth = {
        user: this.smtpUser,
        pass: this.smtpPass,
      };
    }

    this.smtpTransporter = nodemailer.createTransport(config);
    return this.smtpTransporter;
  }

  private async sendTicketConfirmationEmail(record: SupportTicketRecord): Promise<boolean> {
    if (!this.confirmationMailEnabled) return false;
    const transporter = this.getTransporter();
    if (!transporter || !this.mailFrom) return false;

    const subject = `${this.confirmationSubjectPrefix} Ticket bestaetigt: ${record.id}`;
    const text = [
      'Guten Tag,',
      '',
      'vielen Dank fuer Ihre Nachricht an den Saarwood Support.',
      '',
      `Ihr Ticket ist beim Support eingegangen. Bitte verwenden Sie diese Ticket-ID: ${record.id}`,
      '',
      'Kopie Ihres Tickets:',
      `Name: ${record.name}`,
      `E-Mail: ${record.email}`,
      `Betreff: ${record.subject}`,
      `App-Version: ${record.appVersion}`,
      `Kontext: ${record.context}`,
      `Erstellt am (UTC): ${record.createdAt}`,
      '',
      'Nachricht:',
      record.message,
      '',
      'Diese E-Mail wurde automatisch erstellt.',
    ].join('\n');

    try {
      await transporter.sendMail({
        from: this.mailFrom,
        to: record.email,
        ...(this.mailReplyTo ? { replyTo: this.mailReplyTo } : {}),
        ...(this.supportContactEmail ? { bcc: this.supportContactEmail } : {}),
        subject,
        text,
      });
      return true;
    } catch {
      return false;
    }
  }
}
