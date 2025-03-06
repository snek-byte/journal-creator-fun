
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
            <span className="text-2xl font-bold">404</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Looking for: {location.pathname}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button asChild variant="default" className="w-full">
            <Link to="/">
              <HomeIcon className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full" onClick={() => window.history.back()}>
            <div>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
