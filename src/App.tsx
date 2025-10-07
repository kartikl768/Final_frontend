import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/global.css';
import { AuthProvider } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';
import { HRProvider } from './contexts/HRContext';
import { CandidateProvider } from './contexts/CandidateContext';
import React from 'react';
import { Toaster } from 'react-hot-toast';

const AppContent: React.FC = () => {
  return (
    <>
     <Toaster position="top-center" reverseOrder={false} />
      <AppRouter />
    </>
  );
};

function App() {
  return (
    
    <AuthProvider>
      <BrowserRouter>
        <JobProvider>
          <HRProvider>
            <CandidateProvider>
              <AppContent />
            </CandidateProvider>
          </HRProvider>
        </JobProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;