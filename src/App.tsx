import { useState } from 'react';
import { WizardProgress } from './components/wizard-progress';
import { PropertyStep } from './components/property-step';
import { TimePeriodStep } from './components/time-period-step';
import { ReviewsStep } from './components/reviews-step';
import { SocialStep } from './components/social-step';
import { ConfirmationScreen } from './components/confirmation-screen';
import { Dashboard } from './components/dashboard';

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

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
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
    console.log('Submitting form data:', formData);
    // Placeholder for actual submission logic
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDashboard = () => {
    setShowDashboard(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showDashboard) {
    return <Dashboard />;
  }

  if (isSubmitted) {
    return <ConfirmationScreen formData={formData} onViewDashboard={handleViewDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Improve Your Hotel Reviews & Bookings
          </h1>
          <p className="text-gray-600">
            Paste your public listing links. We'll return a prioritized action plan.
          </p>
        </div>

        {/* Progress Bar */}
        <WizardProgress currentStep={currentStep} totalSteps={4} />

        {/* Card Container */}
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

        {/* Save Draft Button */}
        <div className="text-center">
          <button
            onClick={() => alert('Draft saved!')}
            className="text-gray-600 hover:text-gray-800 underline bg-transparent border-none p-0 cursor-pointer"
          >
            Save & continue later
          </button>
        </div>
      </div>
    </div>
  );
}
