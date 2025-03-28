import { AuthProvider } from './context/AuthContext';
import { WorkflowProvider } from './context/WorkflowContext';

function App() {
  return (
    <AuthProvider>
      <WorkflowProvider>
        {/* ... existing app content ... */}
      </WorkflowProvider>
    </AuthProvider>
  );
}

export default App; 