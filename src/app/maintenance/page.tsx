import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full">
              <Wrench className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Under Maintenance
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're currently performing scheduled maintenance to improve your experience. 
            We'll be back shortly.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Expected downtime: <span className="font-semibold">30-60 minutes</span>
            </p>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Thank you for your patience. If you have any urgent concerns, 
            please contact support.
          </p>
        </div>
        
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Status updates: Check back in a few minutes
        </p>
      </div>
    </div>
  );
}
