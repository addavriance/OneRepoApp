import {ReactNode, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {useAuth} from "@/contexts/auth/useAuth";
import {api} from "@/api";
import {PostDataUserBased} from "../../shared/interfaces";
import {hasFlag, setFlag, SortType} from "../../shared/flags";
import {Trash2, Eye, Plus, Loader2} from "lucide-react";

export function PostsPage() {
    const [posts, setPosts] = useState<PostDataUserBased[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState(SortType.CreatedDate);
    const navigate = useNavigate();
    const {toast} = useToast();
    const {user, isAuthenticated, isLoading: isAuthLoading} = useAuth();

    const loadPosts = async () => {
        if (!posts) setIsLoading(true);

        try {
            const result = await api.getPosts(0, 20, sortBy);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load posts"
                });
            } else if (result.data) {
                setPosts(result.data);
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred while loading posts"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated && !isAuthLoading) {
            navigate('/login');
            return;
        }

        if (isAuthenticated) {
            loadPosts();
        }
    }, [isAuthLoading, sortBy]);

    const handleDelete = async (postId: number) => {
        try {
            const result = await api.deletePost(postId);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete post"
                });
            } else {
                toast({
                    title: "Success",
                    description: "Post deleted successfully"
                });
                loadPosts();
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred while deleting post"
            });
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const switchSortBy = (flag: SortType) => setSortBy(setFlag(sortBy, flag));

    const canEditPost = (post: PostDataUserBased) => {
        return user && (post.author.username === user.username);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8">
                {isLoading ? (
                    <div className="text-center py-12 flex justify-center gap-2">
                        <Loader2 className="animate-spin"/>
                        Loading posts...
                    </div>
                ) : posts.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No posts found. Create your first post!</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <Button size="sm" variant="secondary" onClick={() => navigate("/posts/create")}>
                                <Plus className="mr-2 h-4 w-4"/>
                                New Post
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={(hasFlag(sortBy, SortType.CreatedDate) ? "default" : "outline") as "default" | "outline"}
                                    onClick={() => switchSortBy(SortType.CreatedDate)}
                                >
                                    Sort by Created
                                </Button>
                                <Button
                                    size="sm"
                                    variant={(hasFlag(sortBy, SortType.UpdatedDate) ? "default" : "outline") as "default" | "outline"}
                                    onClick={() => switchSortBy(SortType.UpdatedDate)}
                                >
                                    Sort by Updated
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <Card key={post.id}>
                                    <CardHeader>
                                        <CardTitle>{post.title}</CardTitle>
                                        <CardDescription>
                                            <div className="flex flex-col gap-1">
                                                <span>By: {post.author.username}</span>
                                                <span>Created: {formatDate(post.createdAt)}</span>
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {post.desc}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/posts/${post.id}`)}
                                        >
                                            <Eye className="mr-2 h-4 w-4"/>
                                            View
                                        </Button>
                                        {canEditPost(post) && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4"/>
                                                Delete
                                            </Button>
                                        ) as ReactNode}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
