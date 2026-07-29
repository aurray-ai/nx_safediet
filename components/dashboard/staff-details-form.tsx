"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { StaffType } from "@/lib/types";

const STAFF_TYPE_OPTIONS: { value: StaffType | ""; label: string }[] = [
  { value: "", label: "Not specified" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contractor", label: "Contractor" },
];

export function StaffDetailsForm({
  userId,
  userTypes,
  staffType,
}: {
  userId: string;
  userTypes: string[];
  staffType: StaffType | null;
}) {
  const router = useRouter();
  const [isChef, setIsChef] = useState(userTypes.includes("chef"));
  const [isShopper, setIsShopper] = useState(userTypes.includes("shopper"));
  const [selectedStaffType, setSelectedStaffType] = useState<StaffType | "">(staffType ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const otherRoles = userTypes.filter((type) => type !== "chef" && type !== "shopper");
    const nextRoles = [...otherRoles, ...(isChef ? ["chef"] : []), ...(isShopper ? ["shopper"] : [])];

    try {
      const response = await fetch(`/api/admin/staff/${userId}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_types: nextRoles, staff_type: selectedStaffType || null }),
      });
      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to update staff details.");
      }

      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to update staff details.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__admin-stack" onSubmit={handleSubmit}>
      <div className="app__admin-tagRow">
        <button
          type="button"
          className={isChef ? "app__admin-primaryButton" : "app__admin-secondaryButton"}
          onClick={() => setIsChef((current) => !current)}
        >
          Chef
        </button>
        <button
          type="button"
          className={isShopper ? "app__admin-primaryButton" : "app__admin-secondaryButton"}
          onClick={() => setIsShopper((current) => !current)}
        >
          Shopper
        </button>
      </div>

      <label className="app__admin-field">
        <span>Employment type</span>
        <select
          className="app__admin-input"
          value={selectedStaffType}
          onChange={(event) => setSelectedStaffType(event.target.value as StaffType | "")}
        >
          {STAFF_TYPE_OPTIONS.map((option) => (
            <option key={option.value || "none"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="app__admin-submitRow">
        {error ? <p className="app__admin-formError">{error}</p> : <span />}
        <button type="submit" className="app__admin-filterButton" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
