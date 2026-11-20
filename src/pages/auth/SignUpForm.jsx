import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Zap,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { registerUser, writeSession } from "./authUtils";

/* ── Password strength helper ───────────────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: "Weak",   color: "bg-rose-400"   };
  if (score <= 3) return { level: 2, label: "Fair",   color: "bg-amber-400"  };
  return          { level: 3, label: "Strong", color: "bg-emerald-500" };
}

/* ── Field component helper (MOVED OUTSIDE SignUpForm) ──────────────────── */
function Field({
  id,
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  children,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <Icon size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`min-h-12 w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-11 text-sm outline-none transition focus:bg-white focus:ring-4 ${
            error
              ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
              : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-50"
          }`}
        />
        {children}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

export default function SignUpForm({ onSuccess, onSwitchMode }) {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors]   = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.password);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 350));

    const result = registerUser(form);
    setLoading(false);

    if (!result.ok) {
      setErrors({ [result.field]: result.message });
      return;
    }

    writeSession(result.user);
    onSuccess();
  }

  return (
    <div className="flex w-full flex-col">
      {/* Heading */}
      <div className="mb-6">
        {/* Mobile logo */}
        <div className="mb-5 flex items-center gap-2 lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Zap size={16} className="fill-white" />
          </span>
          <span className="text-lg font-extrabold text-indigo-600">LifeSync</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Free forever. No credit card required.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <Field
          id="signup-name"
          label="Full name"
          icon={User}
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="Alex Johnson"
          error={errors.name}
          autoComplete="name"
        />

        {/* Email */}
        <Field
          id="signup-email"
          label="Email address"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          placeholder="you@example.com"
          error={errors.email}
          autoComplete="email"
        />

        {/* Password */}
        <div>
          <Field
            id="signup-password"
            label="Password"
            type={showPw ? "text" : "password"}
            icon={Lock}
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            placeholder="Min. 6 characters"
            error={errors.password}
            autoComplete="new-password"
          >
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </Field>

          {/* Strength bar */}
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      strength.level >= lvl ? strength.color : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className={`mt-1 text-xs font-semibold ${
                strength.level === 3 ? "text-emerald-600" :
                strength.level === 2 ? "text-amber-600" : "text-rose-600"
              }`}>
                {strength.label} password
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="signup-confirm" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Confirm password
          </label>
          <div className="relative">
            <Lock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="signup-confirm"
              type={showCPw ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
              placeholder="Re-enter your password"
              className={`min-h-12 w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-11 text-sm outline-none transition focus:bg-white focus:ring-4 ${
                errors.confirmPassword
                  ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                  : form.confirmPassword && form.confirmPassword === form.password
                  ? "border-emerald-400 focus:border-emerald-400 focus:ring-emerald-50"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-50"
              }`}
            />
            {/* Match indicator */}
            {form.confirmPassword && form.confirmPassword === form.password && (
              <CheckCircle2
                size={16}
                className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500"
              />
            )}
            <button
              type="button"
              onClick={() => setShowCPw((v) => !v)}
              aria-label={showCPw ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showCPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600">
              <AlertCircle size={12} /> {errors.confirmPassword}
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
              <UserPlus size={17} />
              Create Account
            </>
          )}
        </button>
      </form>

      {/* Terms note */}
      <p className="mt-4 text-center text-xs text-slate-400">
        By creating an account you agree to our{" "}
        <span className="font-semibold text-slate-500">Terms of Service</span>. All data is stored locally on your device.
      </p>

      {/* Switch mode */}
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchMode}
          className="font-bold text-indigo-600 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}