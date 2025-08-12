// Session Management Utility
// Handles unique session IDs, session state, and evaluation storage

export interface SessionData {
  sessionId: string;
  studentId: string;
  studentName: string;
  date: string;
  session: string;
  room: string;
  subject: string;
  chapter: string;
  topic?: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'paused';
}

export interface EvaluationData {
  sessionId: string;
  studentId: string;
  studentName: string;
  date: string;
  session: string;
  room: string;
  score: number;
  feedback: string;
  messages: ChatMessage[];
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  file?: File;
}

export class SessionManager {
  private static instance: SessionManager;
  private currentSessionId: string | null = null;
  private sessionEvaluations: Map<string, EvaluationData> = new Map();

  private constructor() {
    this.loadSessionEvaluations();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Generate unique session ID
  public generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate unique student ID
  public generateStudentId(): string {
    return `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Start a new session
  public startSession(sessionData: Omit<SessionData, 'sessionId' | 'studentId' | 'startTime' | 'status'>): SessionData {
    // Check for existing session with same (date, session, room, studentName)
    const allSessions = this.getAllSessions();
    const existing = allSessions.find(s =>
      s.date === sessionData.date &&
      s.session === sessionData.session &&
      s.room === sessionData.room &&
      s.studentName === sessionData.studentName
    );
    if (existing) {
      // Set as current session
      this.currentSessionId = existing.sessionId;
      localStorage.setItem('currentSessionId', existing.sessionId);
      return existing;
    }

    const sessionId = this.generateSessionId();
    const studentId = this.generateStudentId();
    
    const newSession: SessionData = {
      ...sessionData,
      sessionId,
      studentId,
      startTime: new Date().toISOString(),
      status: 'active'
    };

    // Save session data
    this.saveSessionData(newSession);
    
    // Set as current session
    this.currentSessionId = sessionId;
    localStorage.setItem('currentSessionId', sessionId);
    
    console.log('Started new session:', newSession);
    return newSession;
  }

  // Get current session
  public getCurrentSession(): SessionData | null {
    if (!this.currentSessionId) {
      this.currentSessionId = localStorage.getItem('currentSessionId');
    }
    
    if (!this.currentSessionId) return null;
    
    const sessionData = localStorage.getItem(`session_${this.currentSessionId}`);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  // End current session
  public endSession(): void {
    if (!this.currentSessionId) return;
    
    const session = this.getCurrentSession();
    if (session) {
      session.endTime = new Date().toISOString();
      session.status = 'completed';
      this.saveSessionData(session);
    }
    
    this.currentSessionId = null;
    localStorage.removeItem('currentSessionId');
  }

  // Save evaluation for current session
  public saveEvaluation(evaluation: Omit<EvaluationData, 'sessionId' | 'studentId' | 'studentName' | 'date' | 'session' | 'room' | 'timestamp'>): void {
    const currentSession = this.getCurrentSession();
    if (!currentSession) {
      console.error('No active session found for evaluation');
      return;
    }

    const evaluationData: EvaluationData = {
      ...evaluation,
      sessionId: currentSession.sessionId,
      studentId: currentSession.studentId,
      studentName: currentSession.studentName,
      date: currentSession.date,
      session: currentSession.session,
      room: currentSession.room,
      timestamp: new Date().toISOString()
    };

    // Save to memory
    this.sessionEvaluations.set(currentSession.sessionId, evaluationData);
    
    // Save to localStorage
    this.saveEvaluationToStorage(evaluationData);
    
    console.log('Saved evaluation:', evaluationData);
  }

  // Get evaluation by session ID
  public getEvaluation(sessionId: string): EvaluationData | null {
    // Check memory first
    if (this.sessionEvaluations.has(sessionId)) {
      return this.sessionEvaluations.get(sessionId)!;
    }
    
    // Check localStorage
    const evaluationData = localStorage.getItem(`evaluation_${sessionId}`);
    if (evaluationData) {
      const evaluation = JSON.parse(evaluationData);
      this.sessionEvaluations.set(sessionId, evaluation);
      return evaluation;
    }
    
    return null;
  }

  // Get all evaluations for a student
  public getStudentEvaluations(studentId: string): EvaluationData[] {
    const evaluations: EvaluationData[] = [];
    
    // Check localStorage for all evaluations
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        const evaluationData = localStorage.getItem(key);
        if (evaluationData) {
          const evaluation = JSON.parse(evaluationData);
          if (evaluation.studentId === studentId) {
            evaluations.push(evaluation);
          }
        }
      }
    }
    
    return evaluations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Get all sessions for a student
  public getStudentSessions(studentId: string): SessionData[] {
    const sessions: SessionData[] = [];
    
    // Check localStorage for all sessions
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('session_')) {
        const sessionData = localStorage.getItem(key);
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.studentId === studentId) {
            sessions.push(session);
          }
        }
      }
    }
    
    return sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }

  // Get all sessions (for admin/tutor view)
  public getAllSessions(): SessionData[] {
    const sessions: SessionData[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('session_')) {
        const sessionData = localStorage.getItem(key);
        if (sessionData) {
          sessions.push(JSON.parse(sessionData));
        }
      }
    }
    
    return sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }

  // Get all evaluations (for admin/tutor view)
  public getAllEvaluations(): EvaluationData[] {
    const evaluations: EvaluationData[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        const evaluationData = localStorage.getItem(key);
        if (evaluationData) {
          evaluations.push(JSON.parse(evaluationData));
        }
      }
    }
    
    return evaluations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Clear session state (for logout or session reset)
  public clearSessionState(): void {
    this.currentSessionId = null;
    this.sessionEvaluations.clear();
    localStorage.removeItem('currentSessionId');
  }

  // Private methods
  private saveSessionData(session: SessionData): void {
    localStorage.setItem(`session_${session.sessionId}`, JSON.stringify(session));
  }

  private saveEvaluationToStorage(evaluation: EvaluationData): void {
    localStorage.setItem(`evaluation_${evaluation.sessionId}`, JSON.stringify(evaluation));
  }

  private loadSessionEvaluations(): void {
    // Load evaluations from localStorage into memory
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        const evaluationData = localStorage.getItem(key);
        if (evaluationData) {
          const evaluation = JSON.parse(evaluationData);
          this.sessionEvaluations.set(evaluation.sessionId, evaluation);
        }
      }
    }
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance(); 