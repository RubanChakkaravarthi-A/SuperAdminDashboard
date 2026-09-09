import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signInDemo } from "../api/API";

const demoAccount = {
  email: "admin@superadmin.com",
  password: "Admin@123",
};

function CloudMark() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-[0_12px_28px_rgba(37,99,235,0.28)]">
      <svg aria-hidden="true" className="h-9 w-9 text-white" fill="none" viewBox="0 0 48 48">
        <path
          d="M14.5 35.5h19.2a8.3 8.3 0 0 0 .8-16.6A11.4 11.4 0 0 0 13.1 22a6.8 6.8 0 0 0 1.4 13.5Z"
          fill="currentColor"
          opacity="0.98"
        />
        <path d="M17.5 29h13" stroke="#2563eb" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

export default function Login({ onAuthenticated }: { onAuthenticated?: () => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try { await signInDemo(email, password); onAuthenticated?.(); navigate("/dashboard", { replace: true }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to sign in."); }
    finally { setSubmitting(false); }
  };

  const useDemoAccount = () => {
    setEmail(demoAccount.email);
    setPassword(demoAccount.password);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-10 text-slate-900">
      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="absolute -bottom-40 -right-28 h-96 w-96 rounded-full bg-sky-100/80 blur-3xl" />

      <section className="relative w-full max-w-[440px]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_24px_65px_rgba(15,23,42,0.12)] sm:p-10">
          <div className="flex flex-col items-center text-center">
            <CloudMark />
            <p className="mt-6 text-xl font-bold tracking-tight">Super Admin Portal</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to manage your platform, tenants, and operations.</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={submit}>
            <label className="block text-sm font-semibold text-slate-700">
              Email address
              <input
                autoComplete="email"
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Password
              <div className="relative mt-2">
                <input
                  autoComplete="current-password"
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button disabled={isSubmitting} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60" type="submit">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-blue-950">Demo account</p>
              <button className="text-xs font-semibold text-blue-700 hover:text-blue-800" onClick={useDemoAccount} type="button">
                Use demo details
              </button>
            </div>
            <dl className="mt-3 space-y-1.5 text-xs leading-5 text-slate-600">
              <div className="flex gap-2"><dt className="font-medium text-slate-500">Email:</dt><dd>{demoAccount.email}</dd></div>
              <div className="flex gap-2"><dt className="font-medium text-slate-500">Password:</dt><dd>{demoAccount.password}</dd></div>
            </dl>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">Secure access for authorized administrators only.</p>
      </section>
    </main>
  );
}
