"use client";

import { useState } from "react";

type CopyPublicLinkButtonProps = {
  slug: string;
  className?: string;
  label?: string;
};

export function CopyPublicLinkButton({
  slug,
  className = "app__admin-primaryButton",
  label = "Copy Link",
}: CopyPublicLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const url = `${window.location.origin}/surveys/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {copied ? "Copied" : label}
    </button>
  );
}
