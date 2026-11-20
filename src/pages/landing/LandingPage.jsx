import { useMemo } from "react";
import LandingNav from "./LandingNav";
import HeroSection from "./HeroSection";
import ModulesSection from "./ModulesSection";
import HowItWorksSection from "./HowItWorksSection";
import CtaBanner from "./CtaBanner";
import LandingFooter from "./LandingFooter";

/**
 * Check localStorage for a logged-in user under the key 'lifesync_user'.
 * Returns true if a non-empty value is stored.
 */
function checkLoggedIn() {
  try {
    const raw = localStorage.getItem("lifesync_user");
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    // Accept a truthy object or non-empty string
    return Boolean(parsed && (typeof parsed === "object" ? parsed.id || parsed.email || parsed.name : parsed));
  } catch {
    // If the value is a plain non-JSON string, treat presence as logged-in
    return Boolean(localStorage.getItem("lifesync_user"));
  }
}

export default function LandingPage() {
  // Memoize so it only reads localStorage once per mount
  const isLoggedIn = useMemo(() => checkLoggedIn(), []);

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased">
      <LandingNav isLoggedIn={isLoggedIn} />
      <main>
        <HeroSection isLoggedIn={isLoggedIn} />
        <ModulesSection />
        <HowItWorksSection />
        <CtaBanner isLoggedIn={isLoggedIn} />
      </main>
      <LandingFooter />
    </div>
  );
}
