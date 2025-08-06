import React, { useState, useEffect } from 'react';
import { sessionManager } from '../../utils/sessionManager';
import { DataMigration } from '../../utils/dataMigration';

const SessionDebug: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allSessions = sessionManager.getAllSessions();
    const allEvaluations = sessionManager.getAllEvaluations();
    const current = sessionManager.getCurrentSession();

    setSessions(allSessions);
    setEvaluations(allEvaluations);
    setCurrentSession(current);
  };

  const runMigration = () => {
    DataMigration.runCompleteMigration();
    setTimeout(loadData, 1000);
  };

  const clearLegacyData = () => {
    DataMigration.cleanupLegacyData();
    setTimeout(loadData, 1000);
  };

  const createTestSession = () => {
    sessionManager.startSession({
      studentName: 'Test Student',
      date: new Date().toLocaleDateString('en-GB'),
      session: '10am - 1pm',
      room: 'Room 1',
      subject: 'Mathematics',
      chapter: 'Algebra'
    });

    sessionManager.saveEvaluation({
      score: 8,
      feedback: 'Great performance!',
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'What is algebra?',
          timestamp: new Date().toLocaleString()
        },
        {
          id: '2',
          role: 'assistant',
          content: 'Algebra is a branch of mathematics dealing with symbols and the rules for manipulating these symbols.',
          timestamp: new Date().toLocaleString()
        }
      ]
    });

    setTimeout(loadData, 1000);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Session Management Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={runMigration}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Run Migration
              </button>
              <button
                onClick={clearLegacyData}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
              >
                Clear Legacy Data
              </button>
              <button
                onClick={createTestSession}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
              >
                Create Test Session
              </button>
              <button
                onClick={loadData}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
              >
                Refresh Data
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Current Session</h2>
            {currentSession ? (
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(currentSession, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">No current session</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Sessions ({sessions.length})</h2>
            <div className="space-y-2 max-h-96 overflow-auto">
              {sessions.map((session) => (
                <div key={session.sessionId} className="border p-2 rounded">
                  <div className="font-medium">{session.studentName}</div>
                  <div className="text-sm text-gray-600">
                    {session.date} - {session.session} - {session.room}
                  </div>
                  <div className="text-xs text-gray-500">ID: {session.sessionId}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Evaluations ({evaluations.length})</h2>
            <div className="space-y-2 max-h-96 overflow-auto">
              {evaluations.map((evaluation) => (
                <div key={evaluation.sessionId} className="border p-2 rounded">
                  <div className="font-medium">{evaluation.studentName}</div>
                  <div className="text-sm text-gray-600">
                    Score: {evaluation.score}/10
                  </div>
                  <div className="text-sm text-gray-600">
                    {evaluation.date} - {evaluation.session}
                  </div>
                  <div className="text-xs text-gray-500">ID: {evaluation.sessionId}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDebug; 