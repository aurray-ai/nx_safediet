"use client";

import { useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  redirectTo?: string;
  initialEmail?: string;
};

export function LoginForm({ redirectTo, initialEmail = "" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, redirectTo }),
      });

      const payload = (await response.json()) as { detail?: string; redirectTo?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to sign in.");
      }

      router.push((payload.redirectTo ?? "/dashboard/admin") as Route);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to sign in."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__auth-form" onSubmit={handleSubmit}>
      <label className="app__auth-field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </label>

      <label className="app__auth-field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </label>

      {error ? <p className="app__auth-feedback app__auth-feedback--error">{error}</p> : null}

      <button className="app__auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
