import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicForm from './pages/PublicForm';
import AdminDashboard from './pages/AdminDashboard';
import TemplateEditor from './pages/TemplateEditor';
import SubmissionViewer from './pages/SubmissionViewer';
import Login from './pages/Login';

// Simple Protected Route
const ProtectedRoute = ({ children }) => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
        return <Navigate to="/admin" replace />;
    }
    return children;
};

function App() {
    return (
        <HashRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/form/:templateId" element={<PublicForm />} />

                {/* Admin Login */}
                <Route path="/admin" element={<Login />} />

                {/* Protected Admin Routes */}
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
    );
}

export default App;
