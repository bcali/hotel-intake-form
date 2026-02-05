import { useState, useEffect } from 'react';
import type { FormData } from '../App';
import { runFullAnalysis, type AnalysisResult, type ScrapeResult } from '../services/review-analysis';
import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  RefreshCcw,
  LayoutDashboard,
  MessageSquare,
  Building2,
  ExternalLink,
  Star,
  Globe,
  Loader2
} from 'lucide-react';

interface DashboardProps {
  formData: FormData;
}

type AnalysisStatus = 'idle' | 'scraping' | 'analyzing' | 'complete' | 'error';

export function Dashboard({ formData }: DashboardProps) {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const runAnalysis = async () => {
    setStatus('scraping');
    setError(null);
    setStatusMessage('Starting analysis...');

    try {
      const result = await runFullAnalysis(formData, (step, message) => {
        setStatus(step as AnalysisStatus);
        setStatusMessage(message);
      });

      if (result.success) {
        setScrapeResult(result.scrapeResult);
        setAnalysis(result.analysis);
        setStatus('complete');
      } else {
        setError(result.error || 'Analysis failed');
        setStatus('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '...';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Loading state
  if (status === 'scraping' || status === 'analyzing' || status === 'idle') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {status === 'scraping' ? 'Collecting Reviews' : 'Analyzing with AI'}
          </h2>
          <p className="text-gray-600 mb-4">{statusMessage}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className={`w-3 h-3 rounded-full ${status === 'scraping' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
            <span>Scrape Reviews</span>
            <div className="w-8 h-px bg-gray-300" />
            <div className={`w-3 h-3 rounded-full ${status === 'analyzing' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
            <span>AI Analysis</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={runAnalysis}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Success - show dashboard with real data
  return (
    <div className="min-h-screen bg-gray-50 flex text-left">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">HotelVoice</span>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">POC Analysis Tool</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'drivers', icon: TrendingUp, label: 'Drivers & Themes' },
            { id: 'actions', icon: CheckCircle2, label: 'Action Plan' },
            { id: 'platforms', icon: Globe, label: 'OTA Comparison' },
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

        {/* Scrape Stats */}
        {scrapeResult && (
          <div className="p-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Reviews Collected</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Google Maps</span>
                <span className="font-bold">{scrapeResult.breakdown.googleMaps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TripAdvisor</span>
                <span className="font-bold">{scrapeResult.breakdown.tripAdvisor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booking.com</span>
                <span className="font-bold">{scrapeResult.breakdown.booking}</span>
              </div>
              <div className="flex justify-between border-t pt-1 mt-1">
                <span className="text-gray-900 font-bold">Total</span>
                <span className="font-bold text-blue-600">{scrapeResult.totalReviews}</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none mb-1">
                {formData.hotelName || 'Hotel Analysis'}
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                {formData.brand} · {formData.city}, {formData.country}
              </p>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Analysis Complete
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
              <Download size={16} /> Export PDF
            </button>
            <button
              onClick={runAnalysis}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              <RefreshCcw size={16} /> Re-run Analysis
            </button>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Period:</span>
            <span className="text-sm font-bold text-gray-900">
              {formatDate(formData.startDate)} - {formatDate(formData.endDate)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Powered by Claude AI
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <BarChart3 size={20} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Overall Sentiment</h3>
              <p className="text-2xl font-bold text-gray-900">{analysis?.overallSentiment || 0}%</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <MessageSquare size={20} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Reviews Analyzed</h3>
              <p className="text-2xl font-bold text-gray-900">{analysis?.reviewCount || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                  <Star size={20} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Rating</h3>
              <p className="text-2xl font-bold text-gray-900">{analysis?.averageRating?.toFixed(1) || 'N/A'}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Action Items</h3>
              <p className="text-2xl font-bold text-gray-900">{analysis?.actionItems?.length || 0}</p>
            </div>
          </div>

          {/* Drivers Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-600" /> Top Positive Drivers
              </h3>
              <div className="space-y-6">
                {(analysis?.positiveDrivers || []).slice(0, 5).map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-gray-700">{item.theme}</span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">{item.impact} Impact</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                    {item.examples?.[0] && (
                      <p className="text-xs text-gray-500 italic">"{item.examples[0]}"</p>
                    )}
                  </div>
                ))}
                {(!analysis?.positiveDrivers || analysis.positiveDrivers.length === 0) && (
                  <p className="text-gray-500 text-sm">No positive drivers identified</p>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600" /> Top Negative Drivers
              </h3>
              <div className="space-y-6">
                {(analysis?.negativeDrivers || []).slice(0, 5).map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-gray-700">{item.theme}</span>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase">{item.impact} Impact</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                    {item.examples?.[0] && (
                      <p className="text-xs text-gray-500 italic">"{item.examples[0]}"</p>
                    )}
                  </div>
                ))}
                {(!analysis?.negativeDrivers || analysis.negativeDrivers.length === 0) && (
                  <p className="text-gray-500 text-sm">No negative drivers identified</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Action Items</h3>
                <p className="text-sm text-gray-500">Prioritized by impact on guest satisfaction</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                <Clock size={14} /> AI Recommended
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {(analysis?.actionItems || []).map((item, i) => (
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
                      {item.rationale && (
                        <p className="text-xs text-gray-500 mt-1">{item.rationale}</p>
                      )}
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </div>
              ))}
              {(!analysis?.actionItems || analysis.actionItems.length === 0) && (
                <div className="p-6 text-gray-500 text-center">No action items generated</div>
              )}
            </div>
          </div>

          {/* OTA Comparison */}
          {analysis?.otaComparison && analysis.otaComparison.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Globe size={20} className="text-blue-600" /> Platform Comparison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.otaComparison.map((platform, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-bold text-gray-900 mb-2">{platform.source}</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Rating</p>
                        <p className="text-lg font-bold">{platform.rating?.toFixed(1) || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Sentiment</p>
                        <p className="text-lg font-bold">{platform.sentiment}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Reviews</p>
                        <p className="text-lg font-bold">{platform.reviewCount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
