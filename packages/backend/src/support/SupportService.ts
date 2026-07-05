import fs from 'fs';
import path from 'path';

export interface SupportInfo {
  contactEmail: string;
  chatUrl: string | null;
  chatLabel: string;
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

export class SupportService {
  private readonly contactEmail: string;

  private readonly chatUrl: string | null;

  private readonly chatLabel: string;

  private readonly ticketFilePath: string;

  private readonly ticketWebhookUrl: string | null;

  constructor() {
    this.contactEmail = process.env.SUPPORT_CONTACT_EMAIL ?? 'support@saarwood.local';
    this.chatUrl = process.env.SUPPORT_CHAT_URL ?? null;
    this.chatLabel = process.env.SUPPORT_CHAT_LABEL ?? 'Support Chat';
    this.ticketFilePath = process.env.SUPPORT_TICKET_FILE
      ?? path.resolve(__dirname, '../../data/support-tickets.ndjson');
    this.ticketWebhookUrl = process.env.SUPPORT_TICKET_WEBHOOK_URL ?? null;
  }

  getInfo(): SupportInfo {
    return {
      contactEmail: this.contactEmail,
      chatUrl: this.chatUrl,
      chatLabel: this.chatLabel,
    };
  }

  async createTicket(input: SupportTicketInput): Promise<{ id: string; stored: boolean; forwarded: boolean }> {
    const id = `sup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
