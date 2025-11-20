import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {api} from "@/api";
import {PostData} from "../../shared/interfaces";
import {ArrowLeft, Trash2} from "lucide-react";

export function PostDetailPage() {
    const {id} = useParams<{ id: string }>();
    const [post, setPost] = useState<PostData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const {toast} = useToast();

    useEffect(() => {
        const loadPost = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const result = await api.getPost(parseInt(id));

                if (result.error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to load post"
                    });
                    navigate("/posts");
                } else if (result.data) {
                    setPost(result.data);
                }
            } catch {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An error occurred while loading post"
                });
                navigate("/posts");
            } finally {
                setIsLoading(false);
            }
        };

        loadPost();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        try {
            const result = await api.deletePost(parseInt(id));

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
                navigate("/posts");
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div>Loading post...</div>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8 max-w-3xl">
                <div className="flex justify-between items-center mb-4">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate("/posts")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Posts
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Delete Post
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{post.title}</CardTitle>
                        <CardDescription>
                            <div className="flex flex-col gap-1 mt-2">
                                <span>Created: {formatDate(post.createdAt)}</span>
                                <span>Updated: {formatDate(post.updatedAt)}</span>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="prose max-w-none">
                            <p className="text-base leading-relaxed whitespace-pre-wrap">
                                {post.desc}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
