import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full text-center space-y-4">
        <p className="text-sm text-muted-foreground">Error 404</p>
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/">Go to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
