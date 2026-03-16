"use client";

type SignalDotProps = {
  color?: "green" | "red" | "amber" | "cyan";
  size?: "sm" | "md";
  pulse?: boolean;
};

const colorMap = {
  green: "var(--signal-green)",
  red:   "var(--signal-red)",
  amber: "var(--signal-amber)",
  cyan:  "var(--signal-cyan)",
};

const sizeMap = { sm: 6, md: 8 };

export function SignalDot({ color = "green", size = "sm", pulse = true }: SignalDotProps) {
  return (
    <span
      className={pulse ? "blink" : ""}
      style={{
        display: "inline-block",
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: "50%",
        backgroundColor: colorMap[color],
        flexShrink: 0,
      }}
    />
  );
}
