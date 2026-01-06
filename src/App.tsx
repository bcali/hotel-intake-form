import { useState } from 'react';
import { WizardProgress } from './components/wizard-progress';
import { PropertyStep } from './components/property-step';
import { TimePeriodStep } from './components/time-period-step';
import { ReviewsStep } from './components/reviews-step';
import { SocialStep } from './components/social-step';
import { ConfirmationScreen } from './components/confirmation-screen';
import { Dashboard } from './components/dashboard';

export interface FormData {
  // Step 1
  hotelName: string;
  brand: string;
  country: string;
  city: string;
  keywords: string[];
  localLanguage: string;
  
  // Step 2
  startDate: string;
  endDate: string;
  comparisonPeriod: string;
  
  // Step 3
  googleMapsUrl: string;
  tripadvisorUrl: string;
  selectedOTAs: string[];
  bookingUrl: string;
  agodaUrl: string;
  expediaUrl: string;
  otherOtaUrl: string;
  totalReviews: string;
  averageRating: string;
  
  // Step 4
  instagram: string;
  facebook: string;
  tiktok: string;
  snapchat: string;
  youtube: string;
  taggedLocationUrl: string;
  tiktokSearchUrl: string;
  guestIssues: string;
  recentChanges: string[];
  additionalNotes: string;
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
    localLanguage: '',
    startDate: '',
    endDate: '',
    comparisonPeriod: 'previous-period',
    googleMapsUrl: '',
    tripadvisorUrl: '',
    selectedOTAs: [],
    bookingUrl: '',
    agodaUrl: '',
    expediaUrl: '',
    otherOtaUrl: '',
    totalReviews: '',
    averageRating: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    snapchat: '',
    youtube: '',
    taggedLocationUrl: '',
    tiktokSearchUrl: '',
    guestIssues: '',
    recentChanges: [],
    additionalNotes: '',
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
    
    // In a real app, this would be your Power Automate HTTP endpoint
    const POWER_AUTOMATE_URL = import.meta.env.VITE_POWER_AUTOMATE_URL || 'https://prod-XX.westus.logic.azure.com:443/workflows/...';
    
    try {
      // For MVP, we'll log it and proceed. 
      // In production, you'd uncomment the fetch below.
      /*
      const response = await fetch(POWER_AUTOMATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          ...formData
        }),
      });
      if (!response.ok) throw new Error('Submission failed');
      */
      
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    }
  };

  const handleSaveDraft = () => {
    alert('Draft saved! You can continue later.');
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
