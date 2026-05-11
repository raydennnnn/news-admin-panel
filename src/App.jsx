import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AllArticles from './pages/AllArticles';
import ReportedArticles from './pages/ReportedArticles';
import AllPublishers from './pages/AllPublishers';
import VerificationQueue from './pages/VerificationQueue';
import MediaHouses from './pages/MediaHouses';
import Users from './pages/Users';
import Topics from './pages/Topics';
// import Comments from './pages/Comments';
// import Analytics from './pages/Analytics';
// import AuditLogs from './pages/AuditLogs';
import GenericPage from './pages/GenericPage';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="articles" element={<AllArticles />} />
              <Route path="reported-articles" element={<ReportedArticles />} />
              <Route path="publishers" element={<AllPublishers />} />
              <Route path="verification" element={<VerificationQueue />} />
              <Route path="media-houses" element={<MediaHouses />} />
              <Route path="users" element={<Users />} />
              <Route path="topics" element={<Topics />} />
              {/* <Route path="comments" element={<Comments />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="audit-logs" element={<AuditLogs />} /> */}
              <Route path="*" element={<GenericPage title="Page Not Found" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
