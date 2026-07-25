import React, { useState } from 'react';
import { Search, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LabTestItem, TestStatus, TestTrend } from '../types/report';

interface LabResultsTableProps {
  tests: LabTestItem[];
  isComparison?: boolean;
}

export const LabResultsTable: React.FC<LabResultsTableProps> = ({ tests, isComparison = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'abnormal_borderline' | 'normal'>('all');

  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.result.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'abnormal_borderline') {
      return t.status === 'abnormal' || t.status === 'borderline';
    } else if (filterStatus === 'normal') {
      return t.status === 'normal';
    }
    return true;
  });

  const getStatusBadge = (status: TestStatus) => {
    switch (status) {
      case 'abnormal':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wider">
            High / Attention
          </span>
        );
      case 'borderline':
        return (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">
            Borderline
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">
            Normal
          </span>
        );
    }
  };

  const getTrendBadge = (trend?: TestTrend) => {
    if (!trend) return null;
    switch (trend) {
      case 'improved':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider border border-emerald-300">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>Improved</span>
          </span>
        );
      case 'worsened':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider border border-rose-300">
            <TrendingDown className="w-3 h-3 text-rose-600" />
            <span>Worsened</span>
          </span>
        );
      case 'stable':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md uppercase tracking-wider border border-slate-300">
            <Minus className="w-3 h-3 text-slate-500" />
            <span>Stable</span>
          </span>
        );
    }
  };

  const hasComparisonData = isComparison || tests.some((t) => Boolean(t.beforeResult || t.trend));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      {/* Table Header */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <span>Detected Lab Test Results</span>
            {hasComparisonData && (
              <span className="ml-2 px-2.5 py-0.5 text-xs font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                Before vs After Medicine
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {hasComparisonData
              ? 'Comparing values before medicine with follow-up values after treatment.'
              : 'Reference values extracted directly from report text.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search test..."
              className="pl-8 pr-2.5 py-1 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors cursor-pointer ${
                filterStatus === 'all' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'
              }`}
            >
              All ({tests.length})
            </button>
            <button
              onClick={() => setFilterStatus('abnormal_borderline')}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors cursor-pointer ${
                filterStatus === 'abnormal_borderline' ? 'bg-white text-amber-700 shadow-2xs' : 'text-gray-500'
              }`}
            >
              Attention ({tests.filter((t) => t.status !== 'normal').length})
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-3">Test Name</th>
              {hasComparisonData && <th className="px-6 py-3">Initial (Before Medicine)</th>}
              <th className="px-6 py-3">{hasComparisonData ? 'Follow-Up (After Medicine)' : 'Result'}</th>
              {hasComparisonData && <th className="px-6 py-3">Medicine Trend</th>}
              <th className="px-6 py-3">Reference Range</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredTests.length > 0 ? (
              filteredTests.map((t) => (
                <tr
                  key={t.id}
                  className={`hover:bg-gray-50/60 transition-colors ${
                    t.status === 'abnormal' ? 'bg-red-50/30' : t.status === 'borderline' ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold block text-gray-900">{t.testName}</span>
                    {t.category && <span className="text-[10px] text-gray-400 font-mono">{t.category}</span>}
                  </td>

                  {hasComparisonData && (
                    <td className="px-6 py-4 font-mono font-medium text-slate-500 bg-amber-50/20">
                      {t.beforeResult ? `${t.beforeResult} ${t.unit || ''}` : 'N/A'}
                    </td>
                  )}

                  <td
                    className={`px-6 py-4 font-mono font-bold ${
                      t.status === 'abnormal'
                        ? 'text-red-600'
                        : t.status === 'borderline'
                        ? 'text-amber-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {t.result} {t.unit || ''}
                  </td>

                  {hasComparisonData && <td className="px-6 py-4">{getTrendBadge(t.trend)}</td>}

                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {t.referenceRange || 'Not specified'}
                  </td>

                  <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={hasComparisonData ? 6 : 4} className="text-center py-8 text-gray-400 text-xs font-mono">
                  No tests found matching search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span>
            {hasComparisonData
              ? 'Comparison shows value progress from initial report to follow-up report after medication.'
              : 'Test results are based on provided report text/OCR. Reference ranges vary by laboratory.'}
          </span>
        </div>
      </div>
    </div>
  );
};
