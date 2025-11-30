import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { PostsPage } from "./pages/PostsPage";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { Header } from "@/components/Header";
import { ProfilePage } from "@/pages/ProfilePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { TodoPage } from "@/pages/TodoPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/posts" element={<PostsPage />} />
                <Route path="/posts/create" element={<CreatePostPage />} />
                <Route path="/posts/:id" element={<PostDetailPage />} />
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/todos" element={<TodoPage/>}/>
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace/>} />
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
}

export default App;
