import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {api} from "@/api";
import {ArrowLeft} from "lucide-react";
import {useAuth} from "@/contexts/auth/useAuth";

export function CreatePostPage() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {toast} = useToast();
    const {isAuthenticated, isLoading: isAuthLoading} = useAuth();

    useEffect(() => {
        if (!isAuthenticated && !isAuthLoading) {
            navigate('/login');
            return;
        }
    }, [isAuthLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await api.createPost(title, desc);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to create post"
                });
            } else {
                toast({
                    title: "Success",
                    description: "Post created successfully"
                });
                navigate("/posts");
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred while creating post"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8 max-w-2xl">
                <Button
                    size="sm"
                    variant="ghost"
                    className="mb-4"
                    onClick={() => navigate("/posts")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to Posts
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Post</CardTitle>
                        <CardDescription>Share your thoughts with the community</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Enter post title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc">Description</Label>
                                <textarea
                                    id="desc"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Write your post content..."
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                size="sm"
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/posts")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" disabled={isLoading} variant="default">
                                {isLoading ? "Creating..." : "Create Post"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
