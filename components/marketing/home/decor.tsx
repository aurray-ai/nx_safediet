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

export function DashedLeafDoodle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 220 140" fill="none">
      <path
        d="M6 128c40 8 80 4 110-24s46-70 96-78"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="1 9"
        opacity="0.9"
      />
      <path
        d="M18 96c8-14 22-20 34-16"
        stroke="#7ea34a"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M18 96c2 8 2 16-2 22" stroke="#7ea34a" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function DashedHeartDoodle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 220 160" fill="none">
      <path
        d="M214 12c-46 4-84 30-104 66s-24 60-92 66"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="1 9"
        opacity="0.9"
      />
      <path
        d="M132 30c-3-3.4-8-3.4-10.6 0-1.4 1.8-1.4 4.2 0 6l10.6 11 10.6-11c1.4-1.8 1.4-4.2 0-6-2.6-3.4-7.6-3.4-10.6 0Z"
        stroke="#d9a43d"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M158 8l1.6 4.2L164 14l-4.4 1.8L158 20l-1.6-4.2L152 14l4.4-1.8L158 8Z"
        stroke="#d9a43d"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
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
