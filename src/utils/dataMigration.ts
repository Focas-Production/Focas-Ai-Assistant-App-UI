// Data Migration Utility
// Converts existing localStorage data to the new session management system

import { sessionManager } from './sessionManager';
import type { ChatMessage } from './sessionManager';

export interface LegacyMessage {
  sender: string;
  text: string;
  timestamp?: string;
}

export interface LegacySessionData {
  date: string;
  session: string;
  room: string;
  messages: LegacyMessage[];
}
export interface LegacyScoreData {
  studentName: string;
  date: string;
  session: string;
  room: string;
  score: number;
}

export interface LegacyStudentData {
  id: number;
  name: string;
  phoneNumber: string;
  subject: string;
  chapter: string;
  session: string;
  room: string;
  date: string;
}

export class DataMigration {
  
  // Migrate existing chat history to new session system
  public static migrateChatHistory(): void {
    console.log('Starting chat history migration...');
    
    // Find all legacy chat history keys
    const legacyKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('studentChatHistory_')) {
        legacyKeys.push(key);
      }
    }
    
    console.log('Found legacy keys:', legacyKeys);
    
    legacyKeys.forEach(key => {
      try {
        const sessionData = localStorage.getItem(key);
        if (sessionData) {
          const parsedData: LegacySessionData = JSON.parse(sessionData);
          
          // Extract session info from key
          const sessionInfo = this.parseLegacyKey(key);
          if (sessionInfo) {
            // Create new session
            const newSession = sessionManager.startSession({
              studentName: 'Migrated Student', // Will be updated if we find matching student data
              date: sessionInfo.date,
              session: sessionInfo.session,
              room: sessionInfo.room,
              subject: 'Unknown', // Will be updated if we find matching student data
              chapter: 'Unknown'
            });
            
            // Map LegacyMessage[] to ChatMessage[]
            const chatMessages = parsedData.messages.map((msg, idx) => ({
              id: `legacy-${idx}`,
              role: msg.sender === 'assistant' ? 'assistant' : 'user',
              content: msg.text,
              timestamp: msg.timestamp || new Date().toISOString()
            }) as ChatMessage);
            sessionManager.saveEvaluation({
              score: 0,
              feedback: 'Migrated from legacy system',
              messages: chatMessages
            });
            
            console.log(`Migrated session: ${key} -> ${newSession.sessionId}`);
          }
        }
      } catch (error) {
        console.error(`Error migrating key ${key}:`, error);
      }
    });
    
    console.log('Chat history migration completed');
  }
  
  // Migrate existing student data to new session system
  public static migrateStudentData(): void {
    console.log('Starting student data migration...');
    
    const sessionStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
    
    sessionStudents.forEach((student: LegacyStudentData) => {
      try {
        // Create new session for this student
        const newSession = sessionManager.startSession({
          studentName: student.name,
          date: student.date,
          session: student.session,
          room: student.room,
          subject: student.subject,
          chapter: student.chapter
        });
        
        console.log(`Migrated student session: ${student.name} -> ${newSession.sessionId}`);
      } catch (error) {
        console.error(`Error migrating student ${student.name}:`, error);
      }
    });
    
    console.log('Student data migration completed');
  }
  
  // Migrate existing scores to new session system
  public static migrateScores(): void {
    console.log('Starting scores migration...');
    
    const scores = JSON.parse(localStorage.getItem('studentScores') || '[]');
    
  scores.forEach((scoreData: LegacyScoreData) => {
      try {
        // Find matching session by student name, date, session, and room
        const allSessions = sessionManager.getAllSessions();
        const matchingSession = allSessions.find(session => 
          session.studentName === scoreData.studentName &&
          session.date === scoreData.date &&
          session.session === scoreData.session &&
          session.room === scoreData.room
        );
        
        if (matchingSession) {
          // Update the evaluation with the score
          const existingEvaluation = sessionManager.getEvaluation(matchingSession.sessionId);
          if (existingEvaluation) {
            sessionManager.saveEvaluation({
              ...existingEvaluation,
              score: scoreData.score,
              feedback: `Score: ${scoreData.score}/10`
            });
            
            console.log(`Migrated score for session ${matchingSession.sessionId}: ${scoreData.score}/10`);
          }
        }
      } catch (error) {
        console.error(`Error migrating score:`, error);
      }
    });
    
    console.log('Scores migration completed');
  }
  
  // Run complete migration
  public static runCompleteMigration(): void {
    console.log('=== Starting Complete Data Migration ===');
    
    this.migrateStudentData();
    this.migrateChatHistory();
    this.migrateScores();
    
    console.log('=== Data Migration Completed ===');
  }
  
  // Parse legacy session key to extract date, session, and room
  private static parseLegacyKey(key: string): { date: string; session: string; room: string } | null {
    try {
      const parts = key.replace('studentChatHistory_', '').split('_');
      if (parts.length >= 3) {
        const date = parts[0];
        const session = parts[1];
        const room = parts.slice(2).join('_'); // Room might contain underscores
        return { date, session, room };
      }
    } catch (error) {
      console.error('Error parsing legacy key:', key, error);
    }
    return null;
  }
  
  // Check if migration is needed
  public static needsMigration(): boolean {
    // Check if there are any legacy keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('studentChatHistory_')) {
        return true;
      }
    }
    
    // Check if there are session students but no new sessions
    const sessionStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
    const allSessions = sessionManager.getAllSessions();
    
    return sessionStudents.length > 0 && allSessions.length === 0;
  }
  
  // Clean up legacy data after successful migration
  public static cleanupLegacyData(): void {
    console.log('Cleaning up legacy data...');
    
    const keysToRemove: string[] = [];
    
    // Find all legacy keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('studentChatHistory_') ||
        key === 'sessionStudents' ||
        key === 'studentScores'
      )) {
        keysToRemove.push(key);
      }
    }
    
    // Remove legacy keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed legacy key: ${key}`);
    });
    
    console.log('Legacy data cleanup completed');
  }
}

// Auto-migration on import (only in development)
if (import.meta.env.DEV && DataMigration.needsMigration()) {
  console.log('Auto-migrating legacy data...');
  DataMigration.runCompleteMigration();
} 