"use client";

import { useState } from "react";

import type { DiscountAuditEntry } from "@/lib/types";
import { formatDate, formatLabel } from "@/lib/admin-format";

const PREVIEW_SIZE = 5;

export function DiscountActivityLog({ entries }: { entries: DiscountAuditEntry[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (entries.length === 0) {
    return <p className="app__admin-inlineMeta">No changes recorded yet.</p>;
  }

  const visibleEntries = isExpanded ? entries : entries.slice(0, PREVIEW_SIZE);

  return (
    <div className="app__admin-stack">
      <div className="app__admin-dataList">
        {visibleEntries.map((entry, index) => (
          <div key={index} className="app__admin-dataRow app__admin-dataRow--stacked">
            <div className="app__admin-stack">
              <strong>{formatLabel(entry.action)}</strong>
              <span className="app__admin-inlineMeta">
                {formatDate(entry.created_at)} by {entry.actor_name}
              </span>
            </div>
          </div>
        ))}
      </div>
      {!isExpanded && entries.length > visibleEntries.length ? (
        <button type="button" className="app__admin-linkButton" onClick={() => setIsExpanded(true)}>
          View full activity history
        </button>
      ) : null}
    </div>
  );
}
