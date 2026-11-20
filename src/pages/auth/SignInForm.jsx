import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, Zap, AlertCircle } from "lucide-react";
import { loginUser, writeSession, DEMO_USER } from "./authUtils";

export default function SignInForm({ onSuccess, onSwitchMode }) {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "", general: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Small artificial delay for UX feel
    await new Promise((r) => setTimeout(r, 350));

    const result = loginUser(form);
    setLoading(false);

    if (!result.ok) {
      setErrors({ [result.field]: result.message });
      return;
    }

    writeSession(result.user);
    onSuccess();
  }

  async function handleDemoLogin() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    writeSession(DEMO_USER);
    setLoading(false);
    onSuccess();
  }

  return (
    <div className="flex w-full flex-col">
      {/* Heading */}
      <div className="mb-7">
        {/* Mobile logo */}
        <div className="mb-5 flex items-center gap-2 lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Zap size={16} className="fill-white" />
          </span>
          <span className="text-lg font-extrabold text-indigo-600">LifeSync</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Sign in to continue to your LifeSync dashboard.
        </p>
      </div>

      {/* General error */}
      {errors.general && (
        <div
          role="alert"
          className="mb-5 flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-sm text-rose-700 ring-1 ring-rose-200"
        >
          <AlertCircle size={16} className="shrink-0" />
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="signin-email" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Email address
          </label>
          <div className="relative">
            <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="you@example.com"
              className={`min-h-12 w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:bg-white focus:ring-4 ${
                errors.email
                  ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-50"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600">
              <AlertCircle size={12} /> {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="signin-password" className="text-sm font-semibold text-slate-700">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="signin-password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              placeholder="••••••••"
              className={`min-h-12 w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-11 text-sm outline-none transition focus:bg-white focus:ring-4 ${
                errors.password
                  ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-50"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600">
              <AlertCircle size={12} /> {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <LogIn size={17} />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-semibold text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Quick Demo Login */}
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={loading}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-bold text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-100 disabled:opacity-60"
      >
        <span className="text-base">🚀</span>
        Quick Demo Login — Try as Alex Demo
      </button>

      {/* Switch mode */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchMode}
          className="font-bold text-indigo-600 hover:underline"
        >
          Create one free
        </button>
      </p>
    </div>
  );
}
