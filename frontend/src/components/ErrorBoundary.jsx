import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem("gap2grow_user");
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-6 text-center">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 max-w-lg w-full space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Gap2Grow Portal Encountered a Runtime Issue
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              {this.state.error?.message || "An unexpected error occurred while rendering this page."}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#1264E8] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0E52C2] transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Reset Session & Sign In
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
