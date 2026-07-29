"use client";

import { useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

type StaffInviteFormProps = {
  token: string;
};

export function StaffInviteForm({ token }: StaffInviteFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/staff-invitations/${encodeURIComponent(token)}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const payload = (await response.json()) as { detail?: string; redirectTo?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to set up your account.");
      }

      router.push((payload.redirectTo ?? "/dashboard/admin") as Route);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to set up your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__auth-form" onSubmit={handleSubmit}>
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
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
        />
      </label>

      {error ? <p className="app__auth-feedback app__auth-feedback--error">{error}</p> : null}

      <button className="app__auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Setting up your account..." : "Set up account"}
      </button>
    </form>
  );
}
