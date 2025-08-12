
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { sessionManager } from './utils/sessionManager';
import { DataMigration } from './utils/dataMigration';

function App() {
  useEffect(() => {
    // Initialize session management system
    console.log('Initializing session management system...');
    
    // Check if data migration is needed
    if (DataMigration.needsMigration()) {
      console.log('Legacy data detected, running migration...');
      DataMigration.runCompleteMigration();
    }
    
    // Clear any stale session state on app start
    sessionManager.clearSessionState();
  }, []);

  return <AppRoutes />;
}

export default App;
