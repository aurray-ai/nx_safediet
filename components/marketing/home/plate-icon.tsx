const PALETTE = ["#3E6B52", "#D9A43D", "#8C5B6B", "#B3624A", "#E8D9B8"];

export function PlateIcon({ seed, className }: { seed: number; className?: string }) {
  const c1 = PALETTE[seed % PALETTE.length];
  const c2 = PALETTE[(seed + 2) % PALETTE.length];
  const c3 = PALETTE[(seed + 3) % PALETTE.length];

  return (
    <div className={className}>
      <span style={{ width: "60%", height: "60%", top: "8%", left: "14%", background: c1, opacity: 0.9 }} />
      <span style={{ width: "34%", height: "34%", bottom: "10%", right: "8%", background: c2, opacity: 0.85 }} />
      <span style={{ width: "20%", height: "20%", top: "14%", right: "12%", background: c3, opacity: 0.85 }} />
    </div>
  );
}
