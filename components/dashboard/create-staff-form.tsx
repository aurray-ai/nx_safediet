"use client";

import { type FormEvent, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import type { StaffType } from "@/lib/types";

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "chef", label: "Chef" },
  { value: "shopper", label: "Shopper" },
  { value: "platform_user", label: "Platform user" },
];

const STAFF_TYPE_OPTIONS: { value: StaffType | ""; label: string }[] = [
  { value: "", label: "Not specified" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contractor", label: "Contractor" },
];

export function CreateStaffForm({ role }: { role: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["chef"]);
  const [staffType, setStaffType] = useState<StaffType | "">("full_time");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleRole(value: string) {
    setSelectedRoles((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (selectedRoles.length === 0) {
      setError("Select at least one role.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          user_types: selectedRoles,
          staff_type: staffType || null,
        }),
      });

      const payload = (await response.json()) as { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? "Unable to create staff account.");
      }

      router.push(`/dashboard/${role}/staff` as Route);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to create staff account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="app__admin-teamForm" onSubmit={handleSubmit}>
      <label className="app__admin-field">
        <span>Name</span>
        <input
          className="app__admin-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full name"
          required
        />
      </label>

      <label className="app__admin-field">
        <span>Email</span>
        <input
          type="email"
          className="app__admin-input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          required
        />
      </label>

      <div className="app__admin-field">
        <span>Roles</span>
        <div className="app__admin-teamRoleGroup">
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={selectedRoles.includes(option.value) ? "app__admin-teamToggle is-active" : "app__admin-teamToggle"}
              onClick={() => toggleRole(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <label className="app__admin-field">
        <span>Employment type</span>
        <select
          className="app__admin-input"
          value={staffType}
          onChange={(event) => setStaffType(event.target.value as StaffType | "")}
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
        <button type="submit" className="app__admin-primaryButton" disabled={isSubmitting}>
          {isSubmitting ? "Sending invite..." : "Send invite"}
        </button>
      </div>
    </form>
  );
}
