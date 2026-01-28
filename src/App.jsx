import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PublicForm from './pages/PublicForm';
import AdminDashboard from './pages/AdminDashboard';
import TemplateEditor from './pages/TemplateEditor';
import SubmissionViewer from './pages/SubmissionViewer';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center mesh-bg">Loading...</div>;

    if (!currentUser) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Navigate to="/admin" replace />} />
                    <Route path="/form/:templateId" element={<PublicForm />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/editor/:templateId" element={
                        <ProtectedRoute>
                            <TemplateEditor />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/submissions/:templateId" element={
                        <ProtectedRoute>
                            <SubmissionViewer />
                        </ProtectedRoute>
                    } />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
}

export default App;
