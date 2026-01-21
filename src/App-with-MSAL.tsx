/**
 * App Component with MSAL Authentication
 *
 * Main application entry point with Azure AD authentication
 * and Azure Functions integration for real-time analysis
 */

import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { msalConfig, loginRequest, isMsalConfigured } from './config/msal-config';
import { LoginScreen } from './components/login-screen';
import { useState, useEffect } from 'react';
import { WizardProgress } from './components/wizard-progress';
import { PropertyStep } from './components/property-step';
import { TimePeriodStep } from './components/time-period-step';
import { ReviewsStep } from './components/reviews-step';
import { SocialStep } from './components/social-step';
import { Dashboard } from './components/dashboard';
import { fetchAndAnalyze, FetchAndAnalyzeResponse } from './services/api';
import { LogOut, AlertCircle } from 'lucide-react';

export interface FormData {
  hotelName: string;
  brand: string;
  country: string;
  city: string;
  keywords: string[];
  localLanguage: string;
  startDate: string;
  endDate: string;
  comparisonPeriod: string;
  googleMapsUrl: string;
  tripAdvisorUrl: string;
  selectedOTAs: string[];
  otaUrls: Record<string, string>;
  totalReviews?: string;
  averageRating?: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    taggedLocation?: string;
    tiktokSearchUrl?: string;
  };
  notes: {
    topGuestIssues?: string;
    recentChanges?: string;
    recentChangesNotes?: string;
    additionalNotes?: string;
  };
}

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// App wrapper with MSAL Provider
export default function App() {
  // Check if MSAL is configured (production) or use localhost mode (development)
  const useMSAL = isMsalConfigured();

  if (!useMSAL) {
    // Localhost mode - show configuration warning
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Configuration Required
              </h2>
              <p className="text-gray-700 mb-4">
                Azure AD authentication is not configured. To use this application:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
                <li>Set up Azure App Registration (see IT-REQUIREMENTS.md)</li>
                <li>Build with injected configuration (see BUILD-STATIC-HTML.md)</li>
                <li>Deploy to OneDrive</li>
              </ol>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-800">
                  <strong>For localhost development:</strong> Set environment variables in <code className="bg-blue-100 px-1 rounded">.env.local</code>:
                </p>
                <pre className="mt-2 text-xs bg-blue-100 p-2 rounded overflow-x-auto">
{`VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_AZURE_FUNCTION_URL=http://localhost:7071`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate>
        <MainApp />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginScreen />
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}

// Main authenticated application
function MainApp() {
  const { instance, accounts } = useMsal();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [analysisData, setAnalysisData] = useState<FetchAndAnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize formData from localStorage if available
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const savedDraft = localStorage.getItem('formDraft');
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch (error) {
      console.warn('Failed to load draft from localStorage:', error);
    }
    return {
      hotelName: '',
      brand: '',
      country: '',
      city: '',
      keywords: [],
      localLanguage: 'English',
      startDate: '',
      endDate: '',
      comparisonPeriod: 'previous_period',
      googleMapsUrl: '',
      tripAdvisorUrl: '',
      selectedOTAs: [],
      otaUrls: {},
      socialLinks: {},
      notes: {}
    };
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...data };
      // Auto-save to localStorage on every update
      try {
        localStorage.setItem('formDraft', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to auto-save draft:', error);
      }
      return updated;
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setProgressMessage('Preparing analysis...');

    try {
      // Get access token
      const account = accounts[0];
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account
      });

      const accessToken = response.accessToken;

      // Call Azure Function API
      setProgressMessage('Connecting to analysis service...');

      const result = await fetchAndAnalyze(
        {
          hotelName: formData.hotelName,
          timePeriod: {
            startDate: formData.startDate,
            endDate: formData.endDate
          },
          reviewSources: {
            googleMaps: formData.googleMapsUrl,
            tripAdvisor: formData.tripAdvisorUrl,
            selectedOTAs: formData.selectedOTAs,
            otaUrls: formData.otaUrls
          }
        },
        accessToken,
        (message) => setProgressMessage(message)
      );

      // Store analysis data
      setAnalysisData(result);

      // Clear draft
      localStorage.removeItem('formDraft');

      // Show dashboard
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Submission error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Analysis failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
      setProgressMessage('');
    }
  };

  const handleStartNew = () => {
    setAnalysisData(null);
    setCurrentStep(1);
    setFormData({
      hotelName: '',
      brand: '',
      country: '',
      city: '',
      keywords: [],
      localLanguage: 'English',
      startDate: '',
      endDate: '',
      comparisonPeriod: 'previous_period',
      googleMapsUrl: '',
      tripAdvisorUrl: '',
      selectedOTAs: [],
      otaUrls: {},
      socialLinks: {},
      notes: {}
    });
    localStorage.removeItem('formDraft');
  };

  const handleLogout = () => {
    instance.logoutPopup().catch(e => {
      console.error('Logout failed:', e);
    });
  };

  // If analysis is complete, show dashboard
  if (analysisData) {
    return (
      <Dashboard
        analysisData={analysisData}
        formData={formData}
        onStartNew={handleStartNew}
        onLogout={handleLogout}
        userEmail={accounts[0]?.username || ''}
      />
    );
  }

  // Show main wizard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Hotel Voice of Guest
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {accounts[0]?.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">
            Automated Guest Feedback Analysis
          </h2>
          <p className="text-gray-600">
            Paste your review links. Get actionable insights in 2-3 minutes.
          </p>
        </div>

        {/* Progress Bar */}
        <WizardProgress currentStep={currentStep} totalSteps={4} />

        {/* Wizard Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          {currentStep === 1 && (
            <PropertyStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          )}
          {currentStep === 2 && (
            <TimePeriodStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <ReviewsStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <SocialStep
              formData={formData}
              updateFormData={updateFormData}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-900 mb-1">
                  Analysis Failed
                </h3>
                <p className="text-sm text-red-800">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analyzing Reviews
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {progressMessage || 'This may take 2-3 minutes...'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-xs text-blue-800">
                  Please don't close this window.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
