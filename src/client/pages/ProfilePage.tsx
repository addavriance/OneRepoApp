import { useAuth } from "@/contexts/auth/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {useToast} from "@/hooks/use-toast.ts";

export const ProfilePage = () => {
    const { user, isAuthenticated, isLoading: isAuthLoading, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        avatar_url: ''
    });

    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                avatar_url: user.avatar_url || ''
            });
        }
    }, [user]);

    useEffect(() => {
        if (!isAuthenticated && !isAuthLoading) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, isAuthLoading, navigate]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                avatar_url: user.avatar_url || ''
            });
        }
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            await updateUser(formData);
            setIsEditing(false);
        } catch (error: Error) {
            toast(
                {
                    variant: "destructive",
                    title: "Failed to save user",
                    description: error.message
                }
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const getInitials = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8 max-w-2xl">
                {isAuthLoading && (
                    <div className="text-center py-12 flex justify-center gap-2">
                        <Loader2 className="animate-spin"/>
                        Loading profile...
                    </div>
                ) || (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{user?.username}'s profile</CardTitle>
                                <CardDescription>
                                    {isEditing
                                        ? "Edit your profile information"
                                        : "Click edit button to change your profile information"
                                    }
                                </CardDescription>
                            </div>
                            {!isEditing ? (
                                <Button onClick={handleEdit} variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            ) as React.ReactNode : (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleSave}
                                        variant="default"
                                        size="sm"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) as React.ReactNode : (
                                            <Save className="w-4 h-4 mr-2" />
                                        ) as React.ReactNode}
                                        Save
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        variant="outline"
                                        size="sm"
                                        disabled={isSaving}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            ) as React.ReactNode}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={formData.avatar_url} />
                                        <AvatarFallback className="text-lg">
                                            {getInitials(formData.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <Label htmlFor="avatar_url">Avatar URL</Label>
                                                <Input
                                                    id="avatar_url"
                                                    value={formData.avatar_url}
                                                    onChange={handleInputChange('avatar_url')}
                                                    placeholder="https://example.com/avatar.jpg"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-medium">Avatar</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formData.avatar_url || "No avatar set"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    {isEditing ? (
                                        <Input
                                            id="username"
                                            value={formData.username}
                                            onChange={handleInputChange('username')}
                                            placeholder="Enter your username"
                                        />
                                    ) : (
                                        <p className="text-sm py-2 px-3 border border-transparent rounded-md">
                                            {formData.username}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    {isEditing ? (
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange('email')}
                                            placeholder="Enter your email"
                                        />
                                    ) : (
                                        <p className="text-sm py-2 px-3 border border-transparent rounded-md">
                                            {formData.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
