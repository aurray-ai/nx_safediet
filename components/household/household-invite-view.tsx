"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";

import type { HouseholdInvitationDetailResponse } from "@/lib/types";
import styles from "./household-invite-view.module.css";

type HouseholdInviteViewProps = {
  token: string;
  isAuthenticated: boolean;
  currentEmail: string | null;
};

type InviteLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; detail: HouseholdInvitationDetailResponse };

function formatRole(role: string) {
  return role
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

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
    return (
      <section className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          Back to home
        </Link>
        <article className={`${styles.messageCard} ${styles.loadingCard}`}>
          <p className={styles.eyebrow}>Household invitation</p>
          <h1 className={styles.title}>Loading your invitation</h1>
          <p className={styles.copy}>
            We&apos;re checking the invitation details and preparing the next step for you.
          </p>
        </article>
      </section>
    );
  }

  if (state.status == "error") {
    return (
      <section className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          Back to home
        </Link>
        <article className={styles.messageCard}>
          <p className={styles.eyebrow}>Household invitation</p>
          <h1 className={styles.title}>This invitation is not available</h1>
          <p className={styles.feedbackError}>{state.message}</p>
          <p className={styles.helperText}>
            The link may have expired, already been used, or been copied incorrectly.
          </p>
          <div className={styles.actionStack}>
            <Link href="/" className={styles.primaryButton}>
              Return to home
            </Link>
            <Link href="/login" className={styles.secondaryButton}>
              Log in
            </Link>
          </div>
        </article>
      </section>
    );
  }

  const { detail } = state;
  const invitedEmail = detail.invitation.invitee_email.trim().toLowerCase();
  const currentEmailMatches =
    currentEmail !== null && currentEmail.trim().toLowerCase() === invitedEmail;
  const redirectTo = `/household-invite/${token}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}&email=${encodeURIComponent(invitedEmail)}` as Route;
  const registerHref = `/register?redirectTo=${encodeURIComponent(redirectTo)}&email=${encodeURIComponent(invitedEmail)}` as Route;
  const inviteeName = detail.invitation.display_name?.trim() || detail.invitation.invitee_email;
  const invitationStatus = formatRole(detail.invitation.status);
  const memberRole = formatRole(detail.invitation.role);

  return (
    <section className={styles.shell}>
      <Link href="/" className={styles.backLink}>
        Back to home
      </Link>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Household invitation</p>
          <h1 className={styles.title}>Join {detail.household_name}</h1>
          <p className={styles.copy}>
            {detail.inviter_name} invited <strong>{inviteeName}</strong> to join a shared Safediet
            household for meal planning, grocery coordination, and budget tracking.
          </p>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>Invited: {detail.invitation.invitee_email}</span>
            <span className={styles.badge}>Role: {memberRole}</span>
            <span className={styles.badge}>Status: {invitationStatus}</span>
          </div>
        </div>

        <aside className={styles.heroAside}>
          <p className={styles.sectionEyebrow}>What you&apos;ll unlock</p>
          <ul className={styles.featureList}>
            <li>See the same shared meal plan and household grocery activity.</li>
            <li>Coordinate spending with one household budget view.</li>
            <li>Join with the invited email so the household links correctly.</li>
          </ul>
        </aside>
      </section>

      <section className={styles.detailGrid}>
        <article className={styles.detailCard}>
          <p className={styles.sectionEyebrow}>Invitation details</p>
          <div className={styles.detailList}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Household</span>
              <span className={styles.detailValue}>{detail.household_name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Invited by</span>
              <span className={styles.detailValue}>{detail.inviter_name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Account email required</span>
              <span className={styles.detailValue}>{detail.invitation.invitee_email}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Member role</span>
              <span className={styles.detailValue}>{memberRole}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Expires</span>
              <span className={styles.detailValue}>{formatDateTime(detail.invitation.expires_at)}</span>
            </div>
          </div>
        </article>

        <article className={styles.actionCard}>
          <p className={styles.sectionEyebrow}>Next step</p>

          {successMessage ? (
            <div className={styles.actionStack}>
              <p className={styles.feedbackSuccess}>{successMessage}</p>
              <p className={styles.helperText}>
                Your household connection is ready. Continue to finish setting up your experience.
              </p>
              <Link href="/account-setup" className={styles.primaryButton}>
                Continue
              </Link>
            </div>
          ) : null}

          {!successMessage && !isAuthenticated ? (
            <div className={styles.actionStack}>
              <p className={styles.copy}>
                {detail.requires_registration
                  ? "Create your Safediet account with the invited email first, then return here to join the household."
                  : "Sign in with the invited Safediet account to accept this invitation."}
              </p>
              <Link
                href={detail.requires_registration ? registerHref : loginHref}
                className={styles.primaryButton}
              >
                {detail.requires_registration ? "Create account" : "Sign in to accept"}
              </Link>
              {detail.requires_registration ? (
                <Link href={loginHref} className={styles.helperLink}>
                  Already have an account? Sign in instead
                </Link>
              ) : null}
            </div>
          ) : null}

          {!successMessage && isAuthenticated && !currentEmailMatches ? (
            <div className={styles.actionStack}>
              <p className={styles.feedbackError}>
                This invitation belongs to {detail.invitation.invitee_email}. Sign in with that account
                to accept it.
              </p>
              <Link href={loginHref} className={styles.primaryButton}>
                Switch account
              </Link>
            </div>
          ) : null}

          {!successMessage && isAuthenticated && currentEmailMatches ? (
            <div className={styles.actionStack}>
              <p className={styles.feedback}>
                You&apos;re signed in with the correct email. Accept the invitation to join this household.
              </p>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={handleAccept}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Accepting..." : "Accept invitation"}
              </button>
              {actionError ? <p className={styles.feedbackError}>{actionError}</p> : null}
            </div>
          ) : null}
        </article>
      </section>
    </section>
  );
}
