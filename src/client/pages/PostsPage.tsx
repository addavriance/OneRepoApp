import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {api} from "@/api";
import {PostData} from "../../shared/interfaces";
import {hasFlag, setFlag, SortType} from "../../shared/flags";
import {Trash2, Eye, Plus} from "lucide-react";

export function PostsPage() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState(SortType.CreatedDate);
    const navigate = useNavigate();
    const {toast} = useToast();

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
        loadPosts();
    }, [sortBy]);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Posts</h1>
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
                        <Button size="sm" variant="secondary" onClick={() => navigate("/posts/create")}>
                            <Plus className="mr-2 h-4 w-4"/>
                            New Post
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No posts found. Create your first post!</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <Card key={post.id}>
                                <CardHeader>
                                    <CardTitle>{post.title}</CardTitle>
                                    <CardDescription>
                                        Created: {formatDate(post.createdAt)}
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
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4"/>
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
