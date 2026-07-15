"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { formatCurrencyMinor, formatDate, formatNumber } from "@/lib/admin-format";
import type { DeliveryFeeRule, DeliveryFeeRulePayload, SupportedCountry } from "@/lib/types";

type DeliveryFeeRulesManagerProps = {
  supportedCountries: SupportedCountry[];
  initialRules: DeliveryFeeRule[];
};

function buildDefaultRule(currency = "GBP"): DeliveryFeeRulePayload {
  return {
    currency,
    min_weight_grams: 0,
    max_weight_grams: 5000,
    fee_minor: 0,
    is_active: true,
  };
}

function RuleEditorCard({
  rule,
  supportedCurrencies,
}: {
  rule: DeliveryFeeRule;
  supportedCurrencies: string[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<DeliveryFeeRulePayload>({
    currency: rule.currency,
    min_weight_grams: rule.min_weight_grams,
    max_weight_grams: rule.max_weight_grams,
    fee_minor: rule.fee_minor,
    is_active: rule.is_active,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<Key extends keyof DeliveryFeeRulePayload>(key: Key, value: DeliveryFeeRulePayload[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/delivery-fees/${rule.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to update delivery fee rule.");
      }

      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to update delivery fee rule.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="app__admin-priceCard" onSubmit={handleSubmit}>
      <div className="app__admin-sectionHeader">
        <div>
          <strong>{formatCurrencyMinor(rule.fee_minor, rule.currency)}</strong>
          <p>
            {formatNumber(rule.min_weight_grams)}g to {formatNumber(rule.max_weight_grams)}g
          </p>
        </div>
        <span className={`app__admin-statusPill ${draft.is_active ? "" : "is-inactive"}`}>
          {draft.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="app__admin-inlineGrid app__admin-inlineGrid--price">
        <label className="app__admin-field">
          <span>Currency</span>
          <select
            className="app__admin-select"
            value={draft.currency}
            onChange={(event) => updateField("currency", event.target.value)}
          >
            {supportedCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label className="app__admin-field">
          <span>Min weight</span>
          <input
            type="number"
            min="0"
            className="app__admin-input"
            value={draft.min_weight_grams}
            onChange={(event) => updateField("min_weight_grams", Number(event.target.value))}
          />
        </label>

        <label className="app__admin-field">
          <span>Max weight</span>
          <input
            type="number"
            min="1"
            className="app__admin-input"
            value={draft.max_weight_grams}
            onChange={(event) => updateField("max_weight_grams", Number(event.target.value))}
          />
        </label>

        <label className="app__admin-field">
          <span>Fee minor</span>
          <input
            type="number"
            min="0"
            className="app__admin-input"
            value={draft.fee_minor}
            onChange={(event) => updateField("fee_minor", Number(event.target.value))}
          />
        </label>
      </div>

      <div className="app__admin-rowActions">
        <label className="app__admin-checkbox app__admin-checkbox--inline">
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(event) => updateField("is_active", event.target.checked)}
          />
          <span>Active rule</span>
        </label>
        <span className="app__admin-inlineMeta">Updated {formatDate(rule.updated_at)}</span>
      </div>

      <div className="app__admin-submitRow">
        {error ? <p className="app__admin-formError">{error}</p> : <span />}
        <button type="submit" className="app__admin-primaryButton" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save rule"}
        </button>
      </div>
    </form>
  );
}

export function DeliveryFeeRulesManager({
  supportedCountries,
  initialRules,
}: DeliveryFeeRulesManagerProps) {
  const router = useRouter();
  const supportedCurrencies = Array.from(new Set(supportedCountries.map((country) => country.currency_code)));
  const currencyOptions = supportedCurrencies.length ? supportedCurrencies : ["GBP"];
  const [draft, setDraft] = useState<DeliveryFeeRulePayload>(buildDefaultRule(supportedCurrencies[0] ?? "GBP"));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<Key extends keyof DeliveryFeeRulePayload>(key: Key, value: DeliveryFeeRulePayload[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/delivery-fees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to create delivery fee rule.");
      }

      setDraft(buildDefaultRule(draft.currency));
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to create delivery fee rule.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-detailGrid">
        <form className="app__admin-productSection" onSubmit={handleSubmit}>
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Delivery fees</p>
              <h2>Create weight band</h2>
            </div>
          </div>

          <div className="app__admin-editorGrid">
            <label className="app__admin-field">
              <span>Currency</span>
              <select
                className="app__admin-select"
                value={draft.currency}
                onChange={(event) => updateField("currency", event.target.value)}
              >
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>

            <label className="app__admin-field">
              <span>Fee minor</span>
              <input
                type="number"
                min="0"
                className="app__admin-input"
                value={draft.fee_minor}
                onChange={(event) => updateField("fee_minor", Number(event.target.value))}
              />
            </label>

            <label className="app__admin-field">
              <span>Min weight grams</span>
              <input
                type="number"
                min="0"
                className="app__admin-input"
                value={draft.min_weight_grams}
                onChange={(event) => updateField("min_weight_grams", Number(event.target.value))}
              />
            </label>

            <label className="app__admin-field">
              <span>Max weight grams</span>
              <input
                type="number"
                min="1"
                className="app__admin-input"
                value={draft.max_weight_grams}
                onChange={(event) => updateField("max_weight_grams", Number(event.target.value))}
              />
            </label>
          </div>

          <div className="app__admin-rowActions">
            <label className="app__admin-checkbox app__admin-checkbox--inline">
              <input
                type="checkbox"
                checked={draft.is_active}
                onChange={(event) => updateField("is_active", event.target.checked)}
              />
              <span>Active rule</span>
            </label>
          </div>

          <div className="app__admin-submitRow">
            {error ? <p className="app__admin-formError">{error}</p> : <span />}
            <button type="submit" className="app__admin-primaryButton" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create rule"}
            </button>
          </div>
        </form>

        <section className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Coverage</p>
              <h2>Current rules</h2>
            </div>
          </div>

          <div className="app__admin-stack">
            {initialRules.length === 0 ? (
              <p className="app__admin-inlineMeta">No delivery fee rules exist yet.</p>
            ) : (
              initialRules.map((rule) => (
                <RuleEditorCard key={rule.id} rule={rule} supportedCurrencies={currencyOptions} />
              ))
            )}
          </div>
        </section>
      </section>
    </section>
  );
}
