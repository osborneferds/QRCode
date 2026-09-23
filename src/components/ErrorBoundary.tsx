import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[QRForge] Render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-xl border-[1.5px] border-ink bg-cream p-6 shadow-[6px_6px_0_0_#e4572e]">
            <p className="font-display text-xl font-bold text-ink">Something went wrong</p>
            <p className="mt-2 text-sm text-ink-soft">
              Please refresh the page. If the problem persists, contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-bold text-lime transition hover:bg-moss"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
