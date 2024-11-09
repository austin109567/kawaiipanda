import { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletContextProvider } from './components/WalletContextProvider';
import { AudioProvider } from './contexts/AudioContext';
import { AudioControls } from './components/AudioControls';
import { WalletConnect } from './components/WalletConnect';
import { Dashboard } from './components/Dashboard';
import { HomePage } from './components/HomePage/HomePage';
import { Gallery } from './components/Gallery';
import { Info } from './components/Info';
import { Settings } from './components/Settings';
import { Navigation } from './components/Navigation';
import { Raid } from './components/Raid';
import { NFTBuilder } from './components/NFTBuilder/NFTBuilder';
import { AdminPanel } from './components/Admin';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';
import { RaidLeaderboards } from './components/RaidLeaderboards/RaidLeaderboards';
import { Footer } from './components/Footer';
import { RaidProfile } from './components/RaidProfile';
import { SubmissionsAdmin } from './components/Admin/SubmissionsAdmin';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { Header } from './components/Header';

export const App: FC = () => {
  return (
    <ErrorBoundary>
      <WalletContextProvider>
        <ThemeProvider>
          <AudioProvider>
            <div className="min-h-screen flex flex-col transition-colors duration-300">
              <ScrollToTop />
              
              {/* Header */}
              <Header />
              
              {/* Main Content - Add top padding for fixed header */}
              <main className="flex-grow pt-20">
                <div className="page-container">
                  <div className="main-content">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/info" element={<Info />} />
                      <Route path="/builder" element={<NFTBuilder />} />
                      <Route path="/leaderboards" element={<RaidLeaderboards />} />

                      {/* Protected Routes */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/gallery" element={
                        <ProtectedRoute>
                          <Gallery />
                        </ProtectedRoute>
                      } />
                      <Route path="/raid" element={
                        <ProtectedRoute>
                          <Raid />
                        </ProtectedRoute>
                      } />
                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <RaidProfile />
                        </ProtectedRoute>
                      } />

                      {/* Admin Routes */}
                      <Route path="/admin" element={
                        <AdminRoute>
                          <AdminPanel />
                        </AdminRoute>
                      } />
                      <Route path="/admin/subs" element={
                        <AdminRoute>
                          <SubmissionsAdmin />
                        </AdminRoute>
                      } />

                      {/* Fallback Route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </div>
              </main>
              
              {/* Footer */}
              <Footer />
              
              {/* Audio Controls */}
              <AudioControls />

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </AudioProvider>
        </ThemeProvider>
      </WalletContextProvider>
    </ErrorBoundary>
  );
};

// Protected Route wrapper component
const ProtectedRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connected } = useWallet();
  if (!connected) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Admin Route wrapper component
const AdminRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { publicKey } = useWallet();
  const isAdmin = publicKey?.toString() === "8jN1XtgiuWeyNjzysYVqGZ1mPAG37sjmuCTnENz66wrs";
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};