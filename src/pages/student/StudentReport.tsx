import { useState } from 'react';
import { Download, Share2, Clock } from 'lucide-react';

const ReportPage = () => {
  const reportData = [
    {
      id: 1,
      date: '15 July 2025',
      score: 68,
      accuracy: 77.3,
      summary: {
        total: 25,
        attempted: 22,
        correct: 17,
        incorrect: 5,
        unattempted: 3,
      },
    },
    {
      id: 2,
      date: '10 July 2025',
      score: 72,
      accuracy: 80,
      summary: {
        total: 28,
        attempted: 25,
        correct: 20,
        incorrect: 5,
        unattempted: 3,
      },
    },
    {
      id: 3,
      date: '5 July 2025',
      score: 65,
      accuracy: 66.7,
      summary: {
        total: 30,
        attempted: 27,
        correct: 18,
        incorrect: 9,
        unattempted: 3,
      },
    },
  ];

  const [selectedReport, setSelectedReport] = useState(reportData[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Viewer */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl p-6 lg:p-8 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-1">CA Assessment Insights</h2>
              <p className="text-sm text-blue-500">{selectedReport.date}</p>
            </div>
            <div className="flex gap-3">
              <button className="group bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4 group-hover:animate-bounce" />
                Download
              </button>
              <button className="group bg-white text-blue-700 border border-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Share2 className="w-4 h-4 group-hover:animate-pulse" />
                Share
              </button>
            </div>
          </div>

          {/* Score Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-blue-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-600"
                  strokeWidth="10"
                  strokeDasharray={`${selectedReport.score * 2.83}, 283`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-3xl font-bold text-blue-800">{selectedReport.score}<span className="text-sm">/100</span></p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
              <p className="text-xs text-blue-600">Accuracy</p>
              <p className="text-xl font-semibold text-blue-800">{selectedReport.accuracy}%</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
              <p className="text-xs text-blue-600">Attempted</p>
              <p className="text-xl font-semibold text-blue-800">{selectedReport.summary.attempted}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
              <p className="text-xs text-blue-600">Correct</p>
              <p className="text-xl font-semibold text-blue-800">{selectedReport.summary.correct}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
              <p className="text-xs text-blue-600">Unattempted</p>
              <p className="text-xl font-semibold text-blue-800">{selectedReport.summary.unattempted}</p>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Questions', value: selectedReport.summary.total, color: 'bg-blue-50' },
              { label: 'Correct', value: selectedReport.summary.correct, color: 'bg-blue-100' },
              { label: 'Incorrect', value: selectedReport.summary.incorrect, color: 'bg-blue-200' },
            ].map((item, index) => (
              <div key={index} className={`${item.color} rounded-lg p-3 text-center transform hover:scale-105 transition-transform`}>
                <p className="text-xs text-blue-600">{item.label}</p>
                <p className="text-lg font-medium text-blue-800">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-blue-500 mt-4 italic">
            Visualize your progress and share insights with your mentor!
          </p>
        </div>

        {/* Report History Sidebar */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-4 text-blue-800 font-semibold">
            <Clock className="w-5 h-5 text-blue-600" />
            Past Assessments
          </div>
          <div className="space-y-3">
            {reportData.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                  selectedReport.id === report.id
                    ? 'bg-blue-100 text-blue-900 shadow-md'
                    : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 text-blue-700'
                }`}
              >
                <p className="font-medium text-sm mb-1">{report.date}</p>
                <div className="flex gap-3 text-xs text-blue-600">
                  <span>Score: {report.score}/100</span>
                  <span>Accuracy: {report.accuracy}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;