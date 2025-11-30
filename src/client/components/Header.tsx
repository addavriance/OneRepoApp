import {Button} from "@/components/ui/button.tsx";
import {LogOut, UserCircle, File, NotebookPen} from "lucide-react";
import {useAuth} from "@/contexts/auth/useAuth";
import {useLocation, useNavigate} from "react-router-dom";
import {useMemo} from "react";

const pageDetails = {
    profile: {
      name: 'Profile',
      desc: 'Profileeee'
    },
    posts: {
        name: 'Posts',
        desc: 'Posts posts posts'
    },
    todos: {
        name: 'Todos',
        desc: 'Your todos with reminders'
    }
}

interface RootRoute {
    path: string;
    name: string;
    desc: string;
    rawSegment: string;
}

function useRootRoute(): RootRoute | undefined {
    const location = useLocation();

    return useMemo(() => {
        const segments = location.pathname.split('/').filter(segment => segment);

        if (segments.length === 0) return;

        const rootSegment = segments[0];

        if (!pageDetails[rootSegment]) return;

        return {
            path: `/${rootSegment}`,
            name: pageDetails[rootSegment].name || rootSegment,
            desc: pageDetails[rootSegment].desc || rootSegment,
            rawSegment: rootSegment
        };
    }, [location.pathname]);
}

export const Header = () => {
    const {user, isAuthenticated, isLoading: isAuthLoading, logout} = useAuth();
    const location = useRootRoute();
    const navigate = useNavigate();

    if (!location) return <></>;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return <div className="container mx-auto pt-7">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold">{location?.name || 'Hello'}</h1>
                {user && (
                    <p className="text-sm text-muted-foreground mt-1">
                        Welcome, {user.username}!
                    </p>
                ) || isAuthLoading && (
                    <p className="text-sm text-muted-foreground mt-1 animate-pulse">
                        Loading...
                    </p>
                )}
            </div>
            {isAuthenticated && (
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate('/profile')}>
                        <UserCircle className="mr-2 h-4 w-4"/>
                        Profile
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate('/posts')}>
                        <File className="mr-2 h-4 w-4"/>
                        Posts
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate('/todos')}>
                        <NotebookPen className="mr-2 h-4 w-4"/>
                        Todos
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        Logout
                    </Button>
                </div>
            )}
        </div>
    </div>
}
