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

  const handleSaveDraft = () => {
    try {
      localStorage.setItem('formDraft', JSON.stringify(formData));
      localStorage.setItem('formDraftStep', currentStep.toString());
      alert('Draft saved successfully! Your progress has been saved to this browser.');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft. Please ensure your browser allows local storage.');
    }
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
    // Generate submission data with metadata
    const submissionId = `submission-${Date.now()}`;
    const submissionData = {
      id: submissionId,
      timestamp: new Date().toISOString(),
      property: {
        hotelName: formData.hotelName,
        brand: formData.brand,
        country: formData.country,
        cityArea: formData.city,
        keywords: formData.keywords,
        localLanguage: formData.localLanguage,
      },
      timePeriod: {
        startDate: formData.startDate,
        endDate: formData.endDate,
        comparisonPeriod: formData.comparisonPeriod,
      },
      reviewSources: {
        googleMaps: formData.googleMapsUrl,
        tripAdvisor: formData.tripAdvisorUrl,
        selectedOTAs: formData.selectedOTAs,
        otaUrls: formData.otaUrls,
        totalReviews: formData.totalReviews,
        averageRating: formData.averageRating,
      },
      socialLinks: formData.socialLinks,
      internalNotes: formData.notes,
    };

    // Save to localStorage as backup
    try {
      localStorage.setItem('lastSubmission', JSON.stringify(submissionData));
      localStorage.setItem('lastSubmissionId', submissionId);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }

    // Download JSON file (localhost mode)
    try {
      const jsonString = JSON.stringify(submissionData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `${formData.hotelName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}_${Date.now()}.json`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Submission data downloaded:', fileName);
    } catch (error) {
      console.error('Failed to download JSON:', error);
      alert('Failed to download submission file. Please try again or contact support.');
      return;
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDashboard = () => {
    setShowDashboard(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showDashboard) {
    return <Dashboard formData={formData} />;
  }

  if (isSubmitted) {
    return <ConfirmationScreen formData={formData} onViewDashboard={handleViewDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Localhost Mode Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            <span className="font-semibold">Localhost Mode:</span> Your submission will be downloaded as a JSON file for manual processing
          </p>
        </div>

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
            onClick={handleSaveDraft}
            className="text-gray-600 hover:text-gray-800 underline bg-transparent border-none p-0 cursor-pointer"
          >
            Save & continue later
          </button>
        </div>
      </div>
    </div>
  );
}
