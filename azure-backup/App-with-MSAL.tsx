/**
 * App Component with MSAL Authentication
 *
 * Main application entry point with Azure AD authentication
 * and Azure Functions integration for real-time analysis
 */

import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, isMsalConfigured } from './config/msal-config';
import { LoginScreen } from './components/login-screen';
import { useState } from 'react';
import { WizardProgress } from './components/wizard-progress';
import { PropertyStep } from './components/property-step';
import { TimePeriodStep } from './components/time-period-step';
import { ReviewsStep } from './components/reviews-step';
import { SocialStep } from './components/social-step';
import { Dashboard } from './components/dashboard';
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
  const [showDashboard, setShowDashboard] = useState(false);

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

  const handleSubmit = () => {
    // Clear draft and show dashboard
    localStorage.removeItem('formDraft');
    setShowDashboard(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNew = () => {
    setShowDashboard(false);
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
    instance.logoutRedirect().catch(e => {
      console.error('Logout failed:', e);
    });
  };

  // If dashboard should be shown
  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
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
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={handleStartNew}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Start New Analysis
            </button>
          </div>
          <Dashboard formData={formData} />
        </main>
      </div>
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
            />
          )}
        </div>
      </main>
    </div>
  );
}
