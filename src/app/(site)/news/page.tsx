import { BroadcastShell } from "@/components/layout/BroadcastShell";

export default function Page() {
  return (
    <BroadcastShell>
      <div className="mx-auto max-w-[1440px] px-4 py-24 text-center">
        <span className="font-broadcast text-4xl tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
           — COMING SOON
        </span>
      </div>
    </BroadcastShell>
  );
}
