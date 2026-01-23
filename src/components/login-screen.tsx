/**
 * Login Screen Component
 *
 * Displays Microsoft sign-in button for unauthenticated users
 */

import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/msal-config';
import { Building2, Lock } from 'lucide-react';
import { useState } from 'react';

export const LoginScreen = () => {
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use redirect instead of popup for better reliability
      await instance.loginRedirect(loginRequest);
    } catch (err) {
      console.error('Login failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          {/* Logo/Icon */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hotel Voice of Guest
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Automated guest feedback analysis
            </p>
          </div>

          {/* Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">
              What this tool does:
            </h2>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Automatically scrapes reviews from Google, TripAdvisor, Booking.com</li>
              <li>• Analyzes sentiment and identifies key themes</li>
              <li>• Generates prioritized action items for your team</li>
              <li>• Delivers insights in 2-3 minutes</li>
            </ul>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700
                     transition-colors flex items-center justify-center gap-2 font-medium
                     disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Sign in with Microsoft
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {error}
              </p>
              <p className="text-xs text-red-600 mt-2">
                If this problem persists, please contact IT support.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-500">
            <p>Internal use only</p>
            <p className="mt-1">
              By signing in, you agree to use this tool in accordance with company policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
