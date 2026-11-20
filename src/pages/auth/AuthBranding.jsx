
import { Zap } from "lucide-react";
import loginIllustration from "../../assets/mobile-login.svg";

export default function AuthBranding() {
  return (
    <div className="relative hidden lg:flex min-h-[650px] flex-col items-center overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-600 to-purple-700 px-10 py-10 text-white">

      {/* Decorative background circles */}
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10" />

      {/* Logo */}
      <div className="relative z-10 flex w-full items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
          <Zap size={23} className="fill-white" />
        </div>
        <span className="text-2xl font-extrabold tracking-tight">
          LifeSync
        </span>
      </div>

      {/* Heading */}
      <div className="relative z-10 mt-12 text-center">
        <h1 className="text-4xl font-extrabold leading-tight">
          Your Life,
          <br />
          Beautifully in Sync.
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-indigo-100">
          One space to organize your tasks, build better habits,
          and make every day count.
        </p>
      </div>

      {/* Main illustration */}
      <div className="relative z-10 mt-5 flex flex-1 items-center justify-center">
        <img
          src={loginIllustration}
          alt="LifeSync login illustration"
          className="w-full max-w-[410px] object-contain drop-shadow-xl"
        />
      </div>

      {/* Bottom tagline */}
      <p className="relative z-10 mt-2 text-sm font-medium tracking-wide text-indigo-100">
        Plan better. Live better. Be better.
      </p>

    </div>
  );
}
