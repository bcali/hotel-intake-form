interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const steps = [
    { id: 1, name: 'Property' },
    { id: 2, name: 'Time Period' },
    { id: 3, name: 'Reviews' },
    { id: 4, name: 'Social & Context' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connection Lines */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300" 
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {/* Step Circles */}
        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
                currentStep >= step.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-400 border-gray-200'
              }`}
            >
              {step.id}
            </div>
            <span
              className={`absolute top-12 text-xs font-medium whitespace-nowrap ${
                currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

