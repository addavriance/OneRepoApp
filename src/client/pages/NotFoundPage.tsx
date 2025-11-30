import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardContent className="pt-6">
                    <div className="text-6xl font-light text-gray-400 mb-4">404</div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        Page not found
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Looks like this page doesn't exist
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
