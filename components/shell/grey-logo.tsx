/**
 * THE CLIENT'S MARK, SET RATHER THAN PASTED.
 *
 * The brand file is a 225px PNG with a light grey plate baked into it. Dropped
 * onto this page it would arrive soft, carry a rectangle of the wrong grey
 * around it, and break the moment anything scaled. The mark is a wordmark, so
 * it is set as type instead: a high contrast serif for the name, the practice
 * line letterspaced beneath it. That version is sharp at any size, takes the
 * ink colour of whatever sits around it, and weighs nothing.
 *
 * The source PNG stays in /public as the reference it was set from.
 */

const SIZES = {
  sm: { name: "text-[26px]", line: "text-[8px] tracking-[0.19em]", gap: "mt-1" },
  md: { name: "text-[34px]", line: "text-[9px] tracking-[0.2em]", gap: "mt-1.5" },
  lg: { name: "text-[44px]", line: "text-[10.5px] tracking-[0.21em]", gap: "mt-2" },
} as const;

export function GreyMark({
  size = "md",
  className = "",
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span
      className={`flex flex-col leading-none ${className}`}
      role="img"
      aria-label="Grey Landmarks LLP"
    >
      <span className={`font-serif font-normal tracking-[-0.005em] ${s.name}`}>Grey</span>
      <span className={`font-serif font-medium uppercase opacity-80 ${s.line} ${s.gap}`}>
        Landmarks LLP
      </span>
    </span>
  );
}

/** The client block as it sits at the foot of the outline rail. */
export function ClientMark() {
  return (
    <div className="mt-8 border-t border-edge pt-6 pl-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">The client</p>
      <div className="mt-3.5 text-ink/70">
        <GreyMark size="sm" />
      </div>
      <p className="mt-3 text-[11.5px] leading-[1.5] text-faint">
        Six live projects across Pune, Thane and Chakan. 427 crore of contract value.
      </p>
    </div>
  );
}
