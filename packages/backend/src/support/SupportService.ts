import fs from 'fs';
import path from 'path';

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

  async createTicket(input: SupportTicketInput): Promise<{ id: string; stored: boolean; forwarded: boolean }> {
    const id = this.nextTicketId();
    const record: SupportTicketRecord = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
    };

    this.appendTicket(record);

    const forwarded = await this.forwardTicket(record);
    return { id, stored: true, forwarded };
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
}
