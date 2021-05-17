export interface Message {
  [key: string]: any;
  type: string;
}

export interface MessageRecord {
  id?: string;
  name?: string;
  message: string;
  type: 'chat' | 'tm' | 'es' | 'sys' | 'pty' | 'fam' | 'rumor';
  time?: number;
}
