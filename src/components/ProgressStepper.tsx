interface ProgressStepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'SELECT', sublabel: 'Room & Dates' },
  { number: 2, label: 'DETAILS', sublabel: 'Payment' },
  { number: 3, label: 'CONFIRMATION', sublabel: '' }
];

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 -z-10">
            <div 
              className="h-full bg-[#1a2847] transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.number <= currentStep
                    ? 'bg-[#1a2847] border-[#1a2847] text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {step.number}
              </div>
              <div className="text-center mt-2">
                <div className={`text-xs uppercase tracking-wide ${
                  step.number === currentStep ? 'text-[#1a2847]' : 'text-gray-500'
                }`}>
                  {step.label}
                </div>
                {step.sublabel && (
                  <div className="text-xs text-gray-400">{step.sublabel}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

