import {useAuth} from "@/contexts/auth/useAuth";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Loader2} from "lucide-react";

export const ProfilePage = () => {
    const {user, isAuthenticated, isLoading: isAuthLoading} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated && !isAuthLoading) {
            navigate('/login');
            return;
        }
    });

    return <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 max-w-2xl">
            {isAuthLoading && (
                <div className="text-center py-12 flex justify-center gap-2">
                    <Loader2 className="animate-spin"/>
                    Loading posts...
                </div>
            ) || (
                <Card>
                    <CardHeader>
                        <CardTitle>{user?.username}'s profile</CardTitle>
                        <CardDescription>Click 'edit' button to change your profile information</CardDescription>
                    </CardHeader>
                </Card>
            )}
        </div>
    </div>
}
