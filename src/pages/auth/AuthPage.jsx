import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import AuthBranding from "./AuthBranding";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { readSession } from "./authUtils";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive current mode from ?mode=register, default to sign-in
  const isRegister = searchParams.get("mode") === "register";
  const [mode, setMode] = useState(isRegister ? "register" : "login");

  // If already logged in, bounce to dashboard immediately
  useEffect(() => {
    if (readSession()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // Keep URL query param in sync with tab
  function switchTo(newMode) {
    setMode(newMode);
    if (newMode === "register") {
      setSearchParams({ mode: "register" });
    } else {
      setSearchParams({});
    }
  }

  function onSuccess() {
    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 sm:p-6">
      {/* Outer card */}
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/80 ring-1 ring-slate-200 lg:grid lg:grid-cols-[1fr_1.1fr]">
        {/* Left — branding (desktop only) */}
        <AuthBranding />

        {/* Right — forms */}
        <div className="flex flex-col px-6 py-10 sm:px-10 sm:py-12">
          {/* Mode tabs */}
          <div className="mb-8 flex gap-1 self-start rounded-xl bg-slate-100 p-1">
            {[
              { key: "login",    label: "Sign In"        },
              { key: "register", label: "Create Account" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => switchTo(key)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  mode === key
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Active form */}
          <div className="flex-1">
            {mode === "login" ? (
              <SignInForm
                onSuccess={onSuccess}
                onSwitchMode={() => switchTo("register")}
              />
            ) : (
              <SignUpForm
                onSuccess={onSuccess}
                onSwitchMode={() => switchTo("login")}
              />
            )}
          </div>

          {/* Footer — back to landing */}
          <div className="mt-8 border-t border-slate-100 pt-5 text-center">
            <Link
              to="/"
              className="text-xs text-slate-400 transition hover:text-indigo-600"
            >
              ← Back to LifeSync Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
