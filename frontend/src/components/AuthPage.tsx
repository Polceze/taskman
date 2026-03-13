import { useState } from "react";
import type { RegisterPayload, LoginPayload } from "../types/auth.ts";

interface Props {
  onLogin: (payload: LoginPayload) => Promise<boolean>;
  onRegister: (payload: RegisterPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function AuthPage({ onLogin, onRegister, loading, error }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setConfirmPassword("");
    setLocalError("");
  };

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (mode === "register") {
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        setLocalError("Password must be at least 8 characters.");
        return;
      }
      await onRegister({ email, full_name: fullName, password });
    } else {
      await onLogin({ email, password });
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo / App name */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">TaskMan</h1>
          <p className="text-sm text-subtle mt-1">
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        {/* Card */}
        <div className="card p-6">

          {/* Mode tabs */}
          <div className="flex rounded-lg bg-canvas border border-border p-1 mb-6">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                  mode === m
                    ? "bg-surface shadow-sm text-ink"
                    : "text-subtle hover:text-ink"
                }`}
              >
                {m === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name — register only */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-ink mb-1">
                  Full name
                </label>
                <input
                  className="input"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Email address
              </label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus={mode === "login"}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Password
              </label>
              <input
                type="password"
                className="input"
                placeholder={mode === "register" ? "At least 8 characters" : "••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm password — register only */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-ink mb-1">
                  Confirm password
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Error message */}
            {displayError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                <p className="text-xs text-red-600">{displayError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full justify-center mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "login" ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                mode === "login" ? "Sign in" : "Create account"
              )}
            </button>
          </form>
        </div>

        {/* Switch mode link */}
        <p className="text-center text-xs text-subtle mt-4">
          {mode === "login" ? (
            <>Don't have an account?{" "}
              <button
                onClick={() => switchMode("register")}
                className="text-accent hover:underline font-medium"
              >
                Register
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button
                onClick={() => switchMode("login")}
                className="text-accent hover:underline font-medium"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}