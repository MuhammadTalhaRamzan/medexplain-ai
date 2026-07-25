import React, { useState } from 'react';
import { Copy, Check, Plus, Stethoscope } from 'lucide-react';

interface DoctorQuestionsProps {
  questions: string[];
}

export const DoctorQuestions: React.FC<DoctorQuestionsProps> = ({ questions: initialQuestions }) => {
  const [questionsList, setQuestionsList] = useState<string[]>(initialQuestions);
  const [checkedState, setCheckedState] = useState<{ [key: number]: boolean }>({});
  const [copied, setCopied] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  const toggleCheck = (idx: number) => {
    setCheckedState((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyAll = () => {
    const textToCopy = questionsList.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(`Questions for My Doctor (MedExplain AI):\n\n${textToCopy}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      setQuestionsList([...questionsList, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  return (
    <div className="bg-blue-600 p-5 sm:p-6 rounded-2xl shadow-lg text-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-blue-100 uppercase tracking-widest flex items-center">
          <Stethoscope className="w-3.5 h-3.5 mr-1.5 text-blue-200" />
          Questions for your Doctor
        </h2>

        <button
          onClick={handleCopyAll}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-blue-100 border border-blue-500/40 transition-colors cursor-pointer flex items-center space-x-1"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-blue-200" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {questionsList.map((q, idx) => (
          <div
            key={idx}
            onClick={() => toggleCheck(idx)}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start space-x-2.5 text-xs ${
              checkedState[idx]
                ? 'bg-blue-800/60 border-blue-500/20 text-blue-200/70 line-through'
                : 'bg-blue-700/50 hover:bg-blue-700/70 border-blue-500/30 text-white'
            }`}
          >
            <input
              type="checkbox"
              checked={!!checkedState[idx]}
              onChange={() => {}}
              className="mt-0.5 w-3.5 h-3.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="italic leading-relaxed flex-1">"{q}"</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddQuestion} className="flex gap-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Add custom question..."
          className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-blue-700/80 border border-blue-500/40 text-white placeholder-blue-300/70 focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
        <button
          type="submit"
          className="px-3 py-1.5 text-xs font-bold bg-white text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-0.5" />
          Add
        </button>
      </form>
    </div>
  );
};

