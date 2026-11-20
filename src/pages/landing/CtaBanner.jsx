import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

export default function CtaBanner({ isLoggedIn }) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Background gradient card */}
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-16 text-center shadow-2xl shadow-indigo-200 sm:px-16">
          {/* Decorative circles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10"
          />

          <div className="relative">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              <Zap size={12} className="fill-white" />
              Start your journey today
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Take Control
              <br />
              of Your Life?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base text-indigo-100">
              Join thousands of people who use LifeSync to build better habits,
              stay focused, and achieve their goals — one day at a time.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isLoggedIn ? (
                <Link
                  to="/tasks"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-base font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50 hover:-translate-y-0.5"
                >
                  Go to Dashboard
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth?mode=register"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-base font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50 hover:-translate-y-0.5"
                  >
                    Get Started Free
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20 hover:-translate-y-0.5"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
