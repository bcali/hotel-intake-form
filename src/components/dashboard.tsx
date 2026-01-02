import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Download, 
  Share2, 
  Filter,
  RefreshCcw,
  ChevronDown,
  LayoutDashboard,
  MessageSquare,
  Users,
  Building2,
  ExternalLink,
  Star,
  Globe,
  Instagram,
  Facebook,
  Video
} from 'lucide-react';

export interface DashboardFilters {
  department: string;
  source: string;
  period: string;
}

export function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({
    department: 'all',
    source: 'all',
    period: 'last_30_days'
  });

  const [activeTab, setActiveTab] = useState('overview');

  const updateFilters = (newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      department: 'all',
      source: 'all',
      period: 'last_30_days'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">HotelVoice</span>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Internal Analysis Tool</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'drivers', icon: TrendingUp, label: 'Drivers & Themes' },
            { id: 'actions', icon: CheckCircle2, label: 'Action Plan' },
            { id: 'platforms', icon: Globe, label: 'OTA Comparison' },
            { id: 'social', icon: Share2, label: 'Social Context' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-blue-600 rounded-xl p-4 text-white">
            <p className="text-xs font-medium opacity-80 mb-1">Need help?</p>
            <p className="text-sm font-bold mb-3">View Documentation</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">
              Open Guide
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-gray-900">Grand Resort & Spa</h1>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Report Ready
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
              <Download size={16} /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
              <RefreshCcw size={16} /> Re-run Analysis
            </button>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Department</span>
              <select 
                className="text-sm font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 cursor-pointer"
                value={filters.department}
                onChange={(e) => updateFilters({ department: e.target.value })}
              >
                <option value="all">All Departments</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="f&b">Food & Beverage</option>
                <option value="engineering">Engineering</option>
                <option value="front_office">Front Office</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Source</span>
              <select 
                className="text-sm font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 cursor-pointer"
                value={filters.source}
                onChange={(e) => updateFilters({ source: e.target.value })}
              >
                <option value="all">All Sources</option>
                <option value="google">Google Maps</option>
                <option value="tripadvisor">TripAdvisor</option>
                <option value="booking">Booking.com</option>
                <option value="agoda">Agoda</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Period:</span>
            <span className="text-sm font-bold text-gray-900">Nov 1, 2025 - Nov 30, 2025</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Overall Sentiment', value: '84%', trend: '+4.2%', color: 'blue', icon: BarChart3 },
              { label: 'Review Volume', value: '1,248', trend: '+12%', color: 'green', icon: MessageSquare },
              { label: 'Avg. Rating', value: '4.6', trend: '+0.1', color: 'yellow', icon: Star },
              { label: 'Response Rate', value: '92%', trend: '-2.5%', color: 'purple', icon: Users },
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-lg`}>
                    <kpi.icon size={20} />
                  </div>
                  <span className={`text-xs font-bold ${kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'} bg-gray-50 px-2 py-1 rounded-md`}>
                    {kpi.trend}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{kpi.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Drivers Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-600" /> Top Positive Drivers
              </h3>
              <div className="space-y-6">
                {[
                  { theme: 'Staff Friendliness', score: 94, impact: 'High' },
                  { theme: 'Breakfast Variety', score: 88, impact: 'Medium' },
                  { theme: 'Ocean View Rooms', score: 91, impact: 'High' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-gray-700">{item.theme}</span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">{item.impact} Impact</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600" /> Top Negative Drivers
              </h3>
              <div className="space-y-6">
                {[
                  { theme: 'AC Noise Levels', score: 62, impact: 'High' },
                  { theme: 'Elevator Wait Time', score: 45, impact: 'Medium' },
                  { theme: 'Pool Towel Availability', score: 38, impact: 'Low' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-gray-700">{item.theme}</span>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase">{item.impact} Impact</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Top 5 Action Items</h3>
                <p className="text-sm text-gray-500">Prioritized by impact on ranking and bookings</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                <Clock size={14} /> Next 14 Days
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { task: 'Replace AC Filters in 4th Floor Wing', owner: 'Engineering', priority: 'Critical' },
                { task: 'Implement Secondary Towel Station at Pool', owner: 'Housekeeping', priority: 'High' },
                { task: 'Staff Training: Personalizing Check-ins', owner: 'Front Office', priority: 'Medium' },
                { task: 'Refresh Vegan Breakfast Menu Options', owner: 'F&B', priority: 'Medium' },
                { task: 'Audit Elevator Response Optimization', owner: 'Engineering', priority: 'High' },
              ].map((item, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-0.5">{item.task}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                          <Building2 size={12} /> {item.owner}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className={`text-xs font-bold uppercase ${
                          item.priority === 'Critical' ? 'text-red-600' : 
                          item.priority === 'High' ? 'text-orange-600' : 'text-blue-600'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
