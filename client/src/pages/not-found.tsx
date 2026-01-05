import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <StandardNav variant="default" />
      <div className="page-background flex-1 w-full flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <Card className="w-full max-w-md mx-4 dark:bg-slate-900 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              The page you're looking for doesn't exist. Let's get you back on track.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setLocation('/')}
                className="flex-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex-1 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
