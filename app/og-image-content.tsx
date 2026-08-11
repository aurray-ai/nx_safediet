export const ogImageSize = { width: 1200, height: 630 };

export function OgImageContent() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#fcfaf5",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "#335444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fcfaf5" strokeWidth="1.8">
            <path d="M12 21c-4.5 0-8-3-8-7.5C4 8 8 3 12 3s8 5 8 10.5c0 4.5-3.5 7.5-8 7.5Z" />
            <path d="M12 21V9" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#335444", letterSpacing: 2 }}>
          SAFEDIET
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 56,
          fontSize: 58,
          fontWeight: 600,
          color: "#14150f",
          lineHeight: 1.15,
          maxWidth: 920,
        }}
      >
        AI meal planning that fits your budget
      </div>
      <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: "#63705f", maxWidth: 820 }}>
        Buy direct from farms, manufacturers and wholesalers. Delivered to your door.
      </div>
    </div>
  );
}
