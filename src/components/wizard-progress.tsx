interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const steps = [
    { number: 1, label: 'Property' },
    { number: 2, label: 'Time period' },
    { number: 3, label: 'Review links' },
    { number: 4, label: 'Social & Submit' },
  ];

  return (
    <div className="mb-8">
      {/* Step Label */}
      <div className="text-center mb-4">
        <span className="text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors font-semibold ${
                  step.number <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.number}
              </div>
              {/* Label */}
              <span
                className={`mt-2 text-xs md:text-sm font-medium ${
                  step.number === currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 -mt-6 transition-colors ${
                  step.number < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



