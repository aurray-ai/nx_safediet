"use client";

import { useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (password !== confirmPassword) {
      setIsSubmitting(false);
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = (await response.json()) as { detail?: string; redirectTo?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to create account.");
      }

      router.push((payload.redirectTo ?? "/account-setup") as Route);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to create account."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__auth-form" onSubmit={handleSubmit}>
      <label className="app__auth-field">
        <span>Full name</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          autoComplete="name"
          required
        />
      </label>

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
          placeholder="Create a password"
          autoComplete="new-password"
          required
        />
      </label>

      <label className="app__auth-field">
        <span>Confirm password</span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
        />
      </label>

      {error ? <p className="app__auth-feedback app__auth-feedback--error">{error}</p> : null}

      <button className="app__auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
