import React, { useState, useEffect, useRef } from 'react';
import { CodingProblem, TestExecutionResult } from '../../types/coding';
import { usePyodide } from '../../hooks/usePyodide';
import { 
  X, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  FileText, 
  Lightbulb, 
  Code2, 
  Check, 
  Copy, 
  Sparkles,
  Clock,
  Cpu,
  Send,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PracticeModalProps {
  problem: CodingProblem;
  onClose: () => void;
  onMarkSolved: (id: string) => void;
  savedDraft?: string;
  onSaveDraft: (id: string, code: string) => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  problem,
  onClose,
  onMarkSolved,
  savedDraft,
  onSaveDraft
}) => {
  const [leftTab, setLeftTab] = useState<'desc' | 'approach' | 'solution'>('desc');
  const [bottomTab, setBottomTab] = useState<'tests' | 'custom_input' | 'console'>('tests');
  const [code, setCode] = useState<string>(savedDraft || problem.starterCode || problem.pythonSolution);
  const [customStdin, setCustomStdin] = useState<string>(
    problem.testCases && problem.testCases[0] ? problem.testCases[0].input : ''
  );
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [testResults, setTestResults] = useState<TestExecutionResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [isRunningCustom, setIsRunningCustom] = useState<boolean>(false);
  const [copiedSolution, setCopiedSolution] = useState<boolean>(false);

  const { isReady, isLoading, runCode, runTestCases } = usePyodide();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save code draft
  useEffect(() => {
    onSaveDraft(problem.id, code);
  }, [code, problem.id, onSaveDraft]);

  // Handle Tab key in editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Run against automated test cases
  const handleRunAllTests = async () => {
    if (!isReady || isRunningTests) return;
    setIsRunningTests(true);
    setBottomTab('tests');

    try {
      const results = await runTestCases(code, problem.testCases);
      setTestResults(results);

      const allPassed = results.length > 0 && results.every(r => r.passed);
      if (allPassed) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
        onMarkSolved(problem.id);
      }
    } catch (err: any) {
      console.error('Error running test cases:', err);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Run with custom stdin input
  const handleRunCustomCode = async () => {
    if (!isReady || isRunningCustom) return;
    setIsRunningCustom(true);
    setBottomTab('console');

    try {
      const res = await runCode(code, customStdin);
      let output = '';
      if (res.stdout) output += res.stdout;
      if (res.stderr) output += '\n[STDERR]: ' + res.stderr;
      if (res.error) output += '\n[ERROR]: ' + res.error;
      output += `\n\n--- Process finished in ${res.executionTimeMs}ms ---`;
      setConsoleOutput(output);
    } catch (err: any) {
      setConsoleOutput(`[Execution Error]: ${err?.message || err}`);
    } finally {
      setIsRunningCustom(false);
    }
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to initial template?')) {
      setCode(problem.starterCode || problem.pythonSolution);
    }
  };

  const handleCopySolution = () => {
    navigator.clipboard.writeText(problem.pythonSolution);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  // Calculate line numbers
  const linesCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(linesCount, 18) }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full h-[95vh] max-w-7xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Navbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border ${
              problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
              problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {problem.difficulty}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-md sm:max-w-xl">
              {problem.title}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            {/* Pyodide Runtime Engine Status */}
            <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-slate-800 border border-slate-700/60">
              <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className={isReady ? 'text-slate-300' : 'text-amber-400'}>
                {isReady ? 'Pyodide WASM Ready' : isLoading ? 'Loading Python Engine...' : 'WASM Standby'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LeetCode Split Workspace (Left: Theory/Problem, Right: Python IDE) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* LEFT PANEL (5 Columns): Description / Approach / Solution */}
          <div className="lg:col-span-5 border-r border-slate-800 flex flex-col min-h-0 bg-slate-900/60">
            {/* Left Tabs */}
            <div className="flex items-center space-x-1 p-2 bg-slate-950/60 border-b border-slate-800 text-xs">
              <button
                onClick={() => setLeftTab('desc')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  leftTab === 'desc'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Description</span>
              </button>

              <button
                onClick={() => setLeftTab('approach')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  leftTab === 'approach'
                    ? 'bg-slate-800 text-amber-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Approach & Hints</span>
              </button>

              <button
                onClick={() => setLeftTab('solution')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  leftTab === 'solution'
                    ? 'bg-slate-800 text-indigo-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Python Reference</span>
              </button>
            </div>

            {/* Left Body Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-slate-200">
              {leftTab === 'desc' && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Problem Statement</h3>
                    <div className="text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                      {problem.description}
                    </div>
                  </div>

                  {problem.constraints && problem.constraints.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Constraints</h3>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 font-mono">
                        {problem.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {problem.examples && problem.examples.map((ex, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
                      <div className="text-indigo-400 font-bold uppercase text-[10px]">Example {i + 1}</div>
                      <div>
                        <span className="text-slate-500 font-bold block mb-1">Input:</span>
                        <pre className="p-2 rounded bg-slate-900 text-slate-200 overflow-x-auto whitespace-pre-wrap">{ex.input}</pre>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block mb-1">Output:</span>
                        <pre className="p-2 rounded bg-slate-900 text-emerald-300 overflow-x-auto whitespace-pre-wrap">{ex.output}</pre>
                      </div>
                      {ex.explanation && (
                        <div className="text-slate-400 font-sans italic pt-1">
                          Explanation: {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {leftTab === 'approach' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Intuition & Theory</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                      {problem.approach.intuition}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Step-by-Step Algorithm
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                      {problem.approach.algorithm.map((step, idx) => (
                        <li key={idx} className="leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-500 font-bold mb-1">Time Complexity</div>
                      <div className="font-mono text-cyan-300 font-semibold">{problem.approach.timeComplexity}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-500 font-bold mb-1">Space Complexity</div>
                      <div className="font-mono text-purple-300 font-semibold">{problem.approach.spaceComplexity}</div>
                    </div>
                  </div>
                </div>
              )}

              {leftTab === 'solution' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Python 3 Solution
                    </span>
                    <button
                      onClick={handleCopySolution}
                      className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      {copiedSolution ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSolution ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <code>{problem.pythonSolution}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL (7 Columns): Python Editor & Runner Workspace */}
          <div className="lg:col-span-7 flex flex-col min-h-0 bg-slate-950">
            
            {/* Editor Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center space-x-1.5">
                  <span className="text-emerald-400">🐍</span>
                  <span>solution.py</span>
                </span>
                <button
                  onClick={handleResetCode}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
                  title="Reset Code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRunCustomCode}
                  disabled={!isReady || isRunningCustom}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isRunningCustom ? 'Running...' : 'Run Custom'}</span>
                </button>

                <button
                  onClick={handleRunAllTests}
                  disabled={!isReady || isRunningTests}
                  className="flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shadow-lg shadow-indigo-500/25 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunningTests ? 'Evaluating...' : 'Run All Tests'}</span>
                </button>
              </div>
            </div>

            {/* Code Editor Body */}
            <div className="flex-1 flex min-h-0 bg-slate-950 font-mono text-xs overflow-hidden">
              {/* Line Numbers Gutter */}
              <div className="w-12 py-3 bg-slate-900/40 text-slate-600 select-none text-right pr-3 font-mono text-[11px] border-r border-slate-800/80 overflow-hidden">
                {lineNumbers.map((num) => (
                  <div key={num} className="leading-5 h-5">{num}</div>
                ))}
              </div>

              {/* Textarea Editor */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="flex-1 p-3 bg-transparent text-slate-100 resize-none focus:outline-none font-mono text-xs leading-5 whitespace-pre overflow-auto"
                placeholder="# Write your Python 3 code here..."
              />
            </div>

            {/* Bottom Drawer Tabs (Test Cases, Custom Input, Console) */}
            <div className="h-64 border-t border-slate-800 bg-slate-900/90 flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-950/70 text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setBottomTab('tests')}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition-colors ${
                      bottomTab === 'tests' ? 'bg-slate-800 text-indigo-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Test Cases ({problem.testCases?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => setBottomTab('custom_input')}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition-colors ${
                      bottomTab === 'custom_input' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Custom Input</span>
                  </button>

                  <button
                    onClick={() => setBottomTab('console')}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition-colors ${
                      bottomTab === 'console' ? 'bg-slate-800 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Terminal Console</span>
                  </button>
                </div>

                {testResults.length > 0 && bottomTab === 'tests' && (
                  <div className="flex items-center space-x-2 text-xs font-mono">
                    <span className="text-emerald-400 font-bold">
                      {testResults.filter(r => r.passed).length}/{testResults.length} Passed
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
                {bottomTab === 'tests' && (
                  <div className="space-y-3">
                    {testResults.length === 0 ? (
                      <div className="text-slate-500 italic text-center py-6">
                        Click <strong className="text-indigo-400">"Run All Tests"</strong> to validate your Python logic against predefined test cases.
                      </div>
                    ) : (
                      testResults.map((tr) => (
                        <div
                          key={tr.testIndex}
                          className={`p-3 rounded-xl border leading-relaxed ${
                            tr.passed
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                              : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2 font-bold">
                              {tr.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-400" />
                              )}
                              <span>Test Case {tr.testIndex}</span>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {tr.executionTimeMs}ms
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-500 block">Input:</span>
                              <pre className="p-1.5 rounded bg-slate-950 overflow-x-auto text-slate-300">{tr.input || '(empty)'}</pre>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Expected:</span>
                              <pre className="p-1.5 rounded bg-slate-950 overflow-x-auto text-emerald-300">{tr.expectedOutput}</pre>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Your Output:</span>
                              <pre className={`p-1.5 rounded bg-slate-950 overflow-x-auto ${tr.passed ? 'text-emerald-300' : 'text-rose-300'}`}>
                                {tr.actualOutput || (tr.error ? 'ERROR' : '(no output)')}
                              </pre>
                            </div>
                          </div>

                          {tr.error && (
                            <div className="mt-2 text-rose-400 text-[11px] whitespace-pre-wrap">
                              {tr.error}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {bottomTab === 'custom_input' && (
                  <div className="h-full flex flex-col space-y-2">
                    <span className="text-[11px] text-slate-400">
                      Standard Input passed to <code className="text-indigo-300">sys.stdin</code>:
                    </span>
                    <textarea
                      value={customStdin}
                      onChange={(e) => setCustomStdin(e.target.value)}
                      placeholder="Enter lines of input for your program..."
                      className="flex-1 w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs resize-none focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}

                {bottomTab === 'console' && (
                  <div className="h-full">
                    {consoleOutput ? (
                      <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {consoleOutput}
                      </pre>
                    ) : (
                      <div className="text-slate-500 italic py-6 text-center">
                        Terminal output is empty. Run custom code or test cases to see logs.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
