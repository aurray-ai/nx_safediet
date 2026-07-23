"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";

import type { HouseholdInvitationDetailResponse } from "@/lib/types";

type HouseholdInviteViewProps = {
  token: string;
  isAuthenticated: boolean;
  currentEmail: string | null;
};

type InviteLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; detail: HouseholdInvitationDetailResponse };

export function HouseholdInviteView({
  token,
  isAuthenticated,
  currentEmail,
}: HouseholdInviteViewProps) {
  const [state, setState] = useState<InviteLoadState>({ status: "loading" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await fetch(`/api/household-invitations/${token}`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as HouseholdInvitationDetailResponse & { detail?: string };
        if (!response.ok) {
          throw new Error(payload.detail ?? "Unable to load invitation.");
        }
        if (isMounted) {
          setState({ status: "ready", detail: payload });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to load invitation.",
          });
        }
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, [token]);

  async function handleAccept() {
    setIsSubmitting(true);
    setActionError(null);

    try {
      const response = await fetch(`/api/household-invitations/${token}/accept`, {
        method: "POST",
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to accept invitation.");
      }
      setSuccessMessage("Invitation accepted. Your shared budget access is now ready.");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to accept invitation.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (state.status == "loading") {
    return <p className="app__auth-copy">Loading invitation…</p>;
  }

  if (state.status == "error") {
    return <p className="app__auth-feedback app__auth-feedback--error">{state.message}</p>;
  }

  const { detail } = state;
  const invitedEmail = detail.invitation.invitee_email.trim().toLowerCase();
  const currentEmailMatches =
    currentEmail !== null && currentEmail.trim().toLowerCase() === invitedEmail;
  const redirectTo = `/household-invite/${token}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}&email=${encodeURIComponent(invitedEmail)}` as Route;
  const registerHref = `/register?redirectTo=${encodeURIComponent(redirectTo)}&email=${encodeURIComponent(invitedEmail)}` as Route;

  return (
    <div className="app__auth-panel">
      <div className="app__auth-panelInner">
        <p className="app__auth-eyebrow">Household invitation</p>
        <h1 className="app__auth-title">Join {detail.household_name}</h1>
        <p className="app__auth-copy">
          {detail.inviter_name} invited <strong>{detail.invitation.display_name}</strong> to join
          the shared budget on Safediet.
        </p>

        <div className="app__auth-meta" style={{ marginTop: 24 }}>
          <p className="app__auth-helper">Invited email: {detail.invitation.invitee_email}</p>
          <p className="app__auth-helper">Role: {detail.invitation.role}</p>
        </div>

        {successMessage ? (
          <>
            <p className="app__auth-feedback">{successMessage}</p>
            <Link href="/account-setup" className="app__auth-submit" style={{ textAlign: "center" }}>
              Continue
            </Link>
          </>
        ) : null}

        {!successMessage && !isAuthenticated ? (
          <div className="app__auth-meta" style={{ display: "grid", gap: 12, marginTop: 28 }}>
            <p className="app__auth-copy">
              {detail.requires_registration
                ? "Create your Safediet account, then accept this invitation."
                : "Sign in with the invited Safediet account to accept this invitation."}
            </p>
            <Link href={detail.requires_registration ? registerHref : loginHref} className="app__auth-submit" style={{ textAlign: "center" }}>
              {detail.requires_registration ? "Create account" : "Sign in to accept"}
            </Link>
            {detail.requires_registration ? (
              <Link href={loginHref} className="app__auth-helper">
                Already have an account? Sign in instead
              </Link>
            ) : null}
          </div>
        ) : null}

        {!successMessage && isAuthenticated && !currentEmailMatches ? (
          <div className="app__auth-meta" style={{ display: "grid", gap: 12, marginTop: 28 }}>
            <p className="app__auth-feedback app__auth-feedback--error">
              This invitation belongs to {detail.invitation.invitee_email}. Sign in with that account to accept it.
            </p>
            <Link href={loginHref} className="app__auth-submit" style={{ textAlign: "center" }}>
              Switch account
            </Link>
          </div>
        ) : null}

        {!successMessage && isAuthenticated && currentEmailMatches ? (
          <div className="app__auth-meta" style={{ display: "grid", gap: 12, marginTop: 28 }}>
            <button className="app__auth-submit" type="button" onClick={handleAccept} disabled={isSubmitting}>
              {isSubmitting ? "Accepting..." : "Accept invitation"}
            </button>
            {actionError ? <p className="app__auth-feedback app__auth-feedback--error">{actionError}</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
