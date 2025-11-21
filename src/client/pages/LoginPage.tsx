import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {useAuth} from "@/contexts/AuthContext";
import {api} from "@/api";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {toast} = useToast();
    const {login} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await api.login(username, password);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.messages?.server || "Login failed"
                });
            } else if (result.data?.authToken) {
                await login(result.data.authToken);
                toast({
                    title: "Success",
                    description: "Logged in successfully"
                });
                navigate("/posts");
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred during login"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button size="sm" variant="default" type="submit" className="w-full" disabled={isLoading}>

                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                        <Button
                            type="button"
                            variant="link"
                            className="w-full"
                            onClick={() => navigate("/register")}
                        >
                            Don't have an account? Register
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
