import React from 'react';

interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-white">
          <div className="max-w-2xl w-full bg-red-950/60 border border-red-700 rounded-2xl p-6 space-y-4">
            <h1 className="text-xl font-black text-red-400">⚠️ Runtime Error — JanSetu</h1>
            <p className="text-sm text-slate-300">The app crashed with the following error:</p>
            <pre className="bg-slate-950 p-4 rounded-xl text-xs text-red-300 overflow-auto whitespace-pre-wrap border border-red-900">
              {this.state.error?.message}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-bold"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
