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