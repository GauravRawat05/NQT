import { useState, useEffect, useCallback, useRef } from 'react';
import { TestCase, TestExecutionResult } from '../types/coding';

// Global singleton cache for Pyodide instance
let globalPyodideInstance: any = null;
let globalPyodidePromise: Promise<any> | null = null;

async function getPyodideInstance(): Promise<any> {
  if (globalPyodideInstance) {
    return globalPyodideInstance;
  }

  if (globalPyodidePromise) {
    return globalPyodidePromise;
  }

  globalPyodidePromise = (async () => {
    // Check if script is already present
    if (typeof (window as any).loadPyodide !== 'function') {
      await new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector('script[src*="pyodide"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', (e) => reject(e));
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.onload = () => resolve();
        script.onerror = (e) => reject(new Error('Failed to load Pyodide WebAssembly runtime: ' + e));
        document.head.appendChild(script);
      });
    }

    const loadPyodide = (window as any).loadPyodide;
    const pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
    });

    // Pre-import sys, io, math
    await pyodide.runPythonAsync(`
import sys
import io
import math
`);

    globalPyodideInstance = pyodide;
    return pyodide;
  })();

  return globalPyodidePromise;
}

export function usePyodide() {
  const [isReady, setIsReady] = useState<boolean>(!!globalPyodideInstance);
  const [isLoading, setIsLoading] = useState<boolean>(!globalPyodideInstance);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getPyodideInstance()
      .then(() => {
        if (mounted) {
          setIsReady(true);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error('Pyodide initialization error:', err);
          setError(err?.message || 'Failed to initialize Python WebAssembly engine');
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const runCode = useCallback(async (code: string, stdinText: string = ''): Promise<{
    stdout: string;
    stderr: string;
    executionTimeMs: number;
    error?: string;
  }> => {
    const pyodide = await getPyodideInstance();
    const startTime = performance.now();

    try {
      // Escape the stdin string safely for Python
      const encodedStdin = JSON.stringify(stdinText || '');

      const runnerScript = `
import sys
import io

_py_stdout_buffer = io.StringIO()
_py_stderr_buffer = io.StringIO()
_old_stdout = sys.stdout
_old_stderr = sys.stderr
_old_stdin = sys.stdin

sys.stdout = _py_stdout_buffer
sys.stderr = _py_stderr_buffer
sys.stdin = io.StringIO(${encodedStdin})

_py_exec_error = None
try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as _e:
    import traceback
    _py_exec_error = traceback.format_exc()
finally:
    sys.stdout = _old_stdout
    sys.stderr = _old_stderr
    sys.stdin = _old_stdin

_py_res_out = _py_stdout_buffer.getvalue()
_py_res_err = _py_stderr_buffer.getvalue()
`;

      await pyodide.runPythonAsync(runnerScript);

      const stdout = pyodide.globals.get('_py_res_out') || '';
      const stderr = pyodide.globals.get('_py_res_err') || '';
      const execError = pyodide.globals.get('_py_exec_error') || undefined;
      const executionTimeMs = Math.round(performance.now() - startTime);

      return {
        stdout: String(stdout),
        stderr: String(stderr),
        executionTimeMs,
        error: execError ? String(execError) : undefined
      };
    } catch (err: any) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      return {
        stdout: '',
        stderr: err?.message || String(err),
        executionTimeMs,
        error: err?.message || 'Execution error'
      };
    }
  }, []);

  const runTestCases = useCallback(async (
    code: string,
    testCases: TestCase[]
  ): Promise<TestExecutionResult[]> => {
    if (!testCases || testCases.length === 0) return [];

    const results: TestExecutionResult[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const res = await runCode(code, tc.input);

      // Normalize outputs for comparison (trim trailing whitespace/newlines)
      const cleanActual = res.stdout.trim().replace(/\r\n/g, '\n');
      const cleanExpected = tc.expectedOutput.trim().replace(/\r\n/g, '\n');
      const passed = !res.error && cleanActual === cleanExpected;

      results.push({
        testIndex: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: res.stdout,
        passed,
        executionTimeMs: res.executionTimeMs,
        error: res.error
      });
    }

    return results;
  }, [runCode]);

  return {
    isReady,
    isLoading,
    error,
    runCode,
    runTestCases
  };
}
