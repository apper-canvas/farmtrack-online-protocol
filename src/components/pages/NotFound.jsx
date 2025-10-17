import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center">
        <div className="flex flex-col items-center gap-6 p-8">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
            <ApperIcon name="MapOff" size={48} className="text-primary-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary-700">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
            <p className="text-gray-600">
              Looks like you've wandered off the farm! The page you're looking for doesn't exist.
            </p>
          </div>

          <Button
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ApperIcon name="Home" size={18} />
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}