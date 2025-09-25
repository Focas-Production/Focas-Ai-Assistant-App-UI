// Define the shape of the timer object
interface TimerState {
  isRunning: boolean;
  time: number;
  startTime: number | null;
  duration: number;
}

export interface AllocationData {
  _id: string;
  studentName?: string; // Add studentName as it's used in the sprint
  subject: string;
  chapter: string;
  session: string;
  room: string;
  date: string;
  topic?: string;
  status?: string;
  timer?: TimerState; 
}

export interface SessionData {
  _id: string; // From MongoDB or your database
  date: string;
  session: string;
  room: string;
  messages: ChatMessage[]; // An array of messages
}


export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  // These are optional to support different message formats
  inputMode?: 'text' | 'voice' | 'file';
  file?: { type: string };
}

