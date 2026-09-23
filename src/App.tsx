import Header from "./components/Header";
import Generator from "./components/Generator";
import SavedCodes from "./components/SavedCodes";
import ErrorBoundary from "./components/ErrorBoundary";
import { BulkBand, Features, Security, Solutions, Testimonials, TrustedBand } from "./components/Sections";
import { Faq, FinalCta, Footer } from "./components/Closing";

export default function App() {
  return (
    <ErrorBoundary>
      <div id="top" className="min-h-screen font-body text-ink antialiased">
        <Header />
        <main>
          <Generator />
          <SavedCodes />
          <TrustedBand />
          <Solutions />
          <Features />
          <Security />
          <Testimonials />
          <BulkBand />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
