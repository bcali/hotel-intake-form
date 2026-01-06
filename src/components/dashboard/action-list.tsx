import { Target, TrendingUp } from 'lucide-react';
import type { FormData } from '../../App';

interface Action {
  id: string;
  title: string;
  owner: string;
  why: string;
  impact: string;
  measurement: string;
  target: string;
}

interface ActionListProps {
  formData: FormData;
}

export function ActionList({ formData }: ActionListProps) {
  const mainKeyword = formData.keywords[0] || formData.brand || 'Property';
  
  const actions: Action[] = [
    {
      id: '1',
      title: `Emergency ${mainKeyword} AC audit and preventive maintenance`,
      owner: 'Engineering',
      why: 'AC failures are the #1 complaint (24 mentions, 18.8%) across Google, Booking, and Agoda',
      impact: 'Reduce high-severity complaints by 40% and improve OTA scores',
      measurement: 'AC-related complaints',
      target: '< 5 mentions/month',
    },
    {
      id: '2',
      title: 'Deep clean checklist with photo verification',
      owner: 'Housekeeping',
      why: 'Room cleanliness is #2 issue (18 mentions) with bathroom and floor complaints',
      impact: 'Improve room quality perception and reduce negative reviews',
      measurement: 'Cleanliness complaints',
      target: '< 3% of reviews',
    },
    {
      id: '3',
      title: `Add second agent at ${mainKeyword} during peak hours`,
      owner: 'Front Office',
      why: 'Check-in wait times averaging 45 minutes (16 mentions)',
      impact: 'Improve first impression and guest satisfaction scores',
      measurement: 'Average check-in time',
      target: '< 10 minutes',
    },
    {
      id: '4',
      title: 'Stagger breakfast seating or extend hours',
      owner: 'F&B',
      why: 'Breakfast crowding complaints (15 mentions) especially 8-9am',
      impact: 'Reduce wait times and improve dining experience',
      measurement: 'Breakfast crowding mentions',
      target: '< 5 mentions/month',
    },
    {
      id: '5',
      title: 'Upgrade WiFi infrastructure in guest rooms',
      owner: 'Engineering',
      why: 'WiFi speed complaints (12 mentions) affecting business travelers',
      impact: 'Improve connectivity and attract business segment',
      measurement: 'WiFi-related complaints',
      target: '< 2% of reviews',
    },
  ];

  return (
    <div id="actions" className="text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="m-0 text-xl md:text-2xl font-bold text-gray-900 text-left">Top 5 Actions (Next 14 Days)</h2>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm font-bold text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer self-start sm:self-auto"
        >
          Back to top
        </button>
      </div>

      <div className="space-y-6">
        {actions.map((action, index) => (
          <div key={action.id} className="bg-white border border-gray-200 rounded-xl p-5 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Number Badge */}
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-100">
                {index + 1}
              </div>

              <div className="flex-1 space-y-5 w-full">
                {/* Title and Owner */}
                <div>
                  <h3 className="mb-1 text-lg md:text-xl font-bold text-gray-900">{action.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Owner:</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-bold uppercase">{action.owner}</span>
                  </div>
                </div>

                {/* Why */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Primary Driver</p>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">{action.why}</p>
                </div>

                {/* Impact and Measurement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-green-100 rounded-md">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expected impact</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 leading-normal pl-8">{action.impact}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-blue-100 rounded-md">
                        <Target className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">How to measure</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 leading-normal pl-8">
                      {action.measurement}: <span className="text-blue-600 font-bold">{action.target}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



