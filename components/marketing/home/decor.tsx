export function LeafBranch({
  className,
  flip,
  style,
}: {
  className?: string;
  flip?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 260"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      style={flip ? { ...style, transform: `${style?.transform ?? ""} scaleX(-1)` } : style}
    >
      <path d="M60 260C58 180 62 100 90 10" strokeLinecap="round" />
      <path d="M62 220c14-8 28-10 38-6" strokeLinecap="round" />
      <path d="M60 220c-14-6-26-6-34 0" strokeLinecap="round" />
      <path d="M66 170c16-6 30-6 40 0" strokeLinecap="round" />
      <path d="M64 170c-14-4-26-2-34 6" strokeLinecap="round" />
      <path d="M73 110c14-10 26-14 36-12" strokeLinecap="round" />
      <path d="M71 110c-12-6-24-6-32 0" strokeLinecap="round" />
      <path d="M82 55c10-10 20-16 30-16" strokeLinecap="round" />
    </svg>
  );
}

export function SwirlRing({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 400 400" fill="none">
      <path
        d="M200 6c107 0 194 87 194 194S307 394 200 394"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 7"
      />
    </svg>
  );
}
