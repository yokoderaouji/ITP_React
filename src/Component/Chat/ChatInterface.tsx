export interface ChatMessage {
  id: number;
  text: string;
  title?: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}