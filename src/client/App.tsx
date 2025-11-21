import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { PostsPage } from "./pages/PostsPage";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostDetailPage } from "./pages/PostDetailPage";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/posts" element={<PostsPage />} />
                    <Route path="/posts/create" element={<CreatePostPage />} />
                    <Route path="/posts/:id" element={<PostDetailPage />} />
                </Routes>
                <Toaster />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
