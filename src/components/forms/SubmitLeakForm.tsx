"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Shield, Radio, Lock, Upload, X, FileText, Image } from "lucide-react";
import { SignalDot } from "@/components/ui/SignalDot";
import type { SubmitLeakPayload } from "@/app/api/submit/route";

type Status = "idle" | "loading" | "success" | "error";

type UploadedFile = {
  id: string;
  file: File;
  preview: string | null; // object URL for images, null for PDFs
};

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
const MAX_FILES      = 5;
const MAX_MB_EACH    = 8;
const MAX_BYTES_EACH = MAX_MB_EACH * 1024 * 1024;

const CATEGORIES: { value: SubmitLeakPayload["category"]; label: string; color: string }[] = [
  { value: "CRYPTO",      label: "CRYPTO",      color: "var(--signal-green)"   },
  { value: "MARKETS",     label: "MARKETS",     color: "var(--signal-cyan)"    },
  { value: "GEOPOLITICS", label: "GEOPOLITICS", color: "var(--signal-amber)"   },
  { value: "MACRO",       label: "MACRO",       color: "var(--signal-red)"     },
  { value: "OTHER",       label: "OTHER",       color: "var(--text-secondary)" },
];

const SOURCE_TYPES: { value: SubmitLeakPayload["sourceType"]; label: string; desc: string }[] = [
  { value: "INSIDER",            label: "INSIDER",       desc: "Direct access to information"     },
  { value: "WHISTLEBLOWER",      label: "WHISTLEBLOWER", desc: "Exposing wrongdoing or cover-ups"  },
  { value: "MARKET_OBSERVATION", label: "MARKET OBS.",   desc: "Pattern or anomaly detected"       },
  { value: "TECHNICAL",          label: "TECHNICAL",     desc: "On-chain / data analysis"          },
  { value: "ANONYMOUS",          label: "ANONYMOUS",     desc: "Prefer not to say"                 },
];

const URGENCIES: { value: SubmitLeakPayload["urgency"]; label: string; color: string }[] = [
  { value: "BREAKING",   label: "BREAKING NOW", color: "var(--signal-red)"   },
  { value: "DEVELOPING", label: "DEVELOPING",   color: "var(--signal-amber)" },
  { value: "ANALYSIS",   label: "ANALYSIS",     color: "var(--signal-cyan)"  },
];

export function SubmitLeakForm() {
  const [category,   setCategory]   = useState<SubmitLeakPayload["category"]>("CRYPTO");
  const [sourceType, setSourceType] = useState<SubmitLeakPayload["sourceType"]>("ANONYMOUS");
  const [urgency,    setUrgency]    = useState<SubmitLeakPayload["urgency"]>("DEVELOPING");
  const [message,    setMessage]    = useState("");
  const [contact,    setContact]    = useState("");
  const [photos,     setPhotos]     = useState<UploadedFile[]>([]);
  const [dragging,   setDragging]   = useState(false);
  const [status,     setStatus]     = useState<Status>("idle");
  const [error,      setError]      = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: File[]) => {
    const valid: UploadedFile[] = [];
    for (const file of incoming) {
      if (!ACCEPTED.includes(file.type)) {
        setError(`Unsupported type: ${file.name}`);
        continue;
      }
      if (file.size > MAX_BYTES_EACH) {
        setError(`File too large (max ${MAX_MB_EACH}MB): ${file.name}`);
        continue;
      }
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
      valid.push({ id: `${file.name}-${Date.now()}-${Math.random()}`, file, preview });
    }
    setPhotos((prev) => {
      const combined = [...prev, ...valid];
      return combined.slice(0, MAX_FILES);
    });
    if (valid.length) setError("");
  }, []);

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); };
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setError("");
    setStatus("loading");

    const fd = new FormData();
    fd.append("category",   category);
    fd.append("sourceType", sourceType);
    fd.append("urgency",    urgency);
    fd.append("message",    message);
    if (contact) fd.append("contact", contact);
    for (const p of photos) fd.append("photos", p.file);

    try {
      const res = await fetch("/api/submit", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "TRANSMISSION FAILED — TRY AGAIN");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("TRANSMISSION FAILED — CHECK CONNECTION");
      setStatus("error");
    }
  };

  // ── Success ──────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center border"
          style={{ borderColor: "var(--signal-green)", backgroundColor: "rgba(92,255,92,0.06)" }}
        >
          <Shield size={28} style={{ color: "var(--signal-green)" }} />
        </div>
        <div>
          <p className="font-broadcast text-2xl tracking-[0.1em]" style={{ color: "var(--signal-green)" }}>
            SIGNAL RECEIVED
          </p>
          <p className="mt-2 font-data text-xs tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>
            YOUR TRANSMISSION HAS BEEN LOGGED. WE WILL INVESTIGATE.
          </p>
        </div>
        <button
          onClick={() => { setStatus("idle"); setMessage(""); setContact(""); setPhotos([]); setError(""); }}
          className="font-data text-[10px] uppercase tracking-[0.12em] underline"
          style={{ color: "var(--text-muted)" }}
        >
          SUBMIT ANOTHER LEAK
        </button>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">

      {/* 01 Category */}
      <fieldset>
        <legend className="mb-3 font-data text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
          01 — SIGNAL CATEGORY
        </legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = category === cat.value;
            return (
              <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                className="border px-3 py-1.5 font-data text-[10px] uppercase tracking-[0.1em] transition-all duration-150"
                style={{
                  borderColor:     active ? cat.color : "var(--border-default)",
                  color:           active ? cat.color : "var(--text-muted)",
                  backgroundColor: active ? `color-mix(in srgb, ${cat.color} 10%, transparent)` : "transparent",
                  borderRadius:    "var(--radius-sm)",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 02 Source type */}
      <fieldset>
        <legend className="mb-3 font-data text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
          02 — SOURCE TYPE
        </legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SOURCE_TYPES.map((src) => {
            const active = sourceType === src.value;
            return (
              <button key={src.value} type="button" onClick={() => setSourceType(src.value)}
                className="flex flex-col items-start gap-1 border p-3 text-left transition-all duration-150"
                style={{
                  borderColor:     active ? "var(--signal-amber)" : "var(--border-default)",
                  backgroundColor: active ? "rgba(255,176,0,0.06)" : "var(--bg-panel)",
                  borderRadius:    "var(--radius-sm)",
                }}
              >
                <span className="font-data text-[10px] uppercase tracking-[0.1em]"
                  style={{ color: active ? "var(--signal-amber)" : "var(--text-secondary)" }}>
                  {src.label}
                </span>
                <span className="font-data text-[9px]" style={{ color: "var(--text-muted)" }}>
                  {src.desc}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 03 Urgency */}
      <fieldset>
        <legend className="mb-3 font-data text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
          03 — URGENCY ASSESSMENT
        </legend>
        <div className="flex flex-wrap gap-2">
          {URGENCIES.map((u) => {
            const active = urgency === u.value;
            return (
              <button key={u.value} type="button" onClick={() => setUrgency(u.value)}
                className="flex items-center gap-2 border px-3 py-1.5 font-data text-[10px] uppercase tracking-[0.1em] transition-all duration-150"
                style={{
                  borderColor:     active ? u.color : "var(--border-default)",
                  color:           active ? u.color : "var(--text-muted)",
                  backgroundColor: active ? `color-mix(in srgb, ${u.color} 8%, transparent)` : "transparent",
                  borderRadius:    "var(--radius-sm)",
                }}
              >
                {active && <span className="blink inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: u.color }} />}
                {u.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 04 Message */}
      <div>
        <label className="mb-2 block font-data text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
          04 — THE LEAK <span style={{ color: "var(--signal-red)" }}>*</span>
        </label>
        <textarea
          required minLength={20} maxLength={5000}
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="WHAT DO YOU KNOW? BE SPECIFIC. NAMES, DATES, TICKERS, AMOUNTS. THE MORE DETAIL, THE MORE SIGNAL."
          rows={7}
          className="w-full resize-y border bg-transparent px-4 py-3 font-data text-[11px] leading-relaxed tracking-[0.04em] placeholder:text-[var(--text-muted)] focus:outline-none"
          style={{ borderColor: "var(--border-default)", color: "var(--text-primary)", borderRadius: "var(--radius-sm)", minHeight: "160px" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--signal-amber)")}
          onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border-default)")}
        />
        <div className="mt-1 flex justify-between">
          <span className="font-data text-[9px]" style={{ color: "var(--text-muted)" }}>MIN 20 CHARS</span>
          <span className="font-data text-[9px]" style={{ color: "var(--text-muted)" }}>{message.length} / 5000</span>
        </div>
      </div>

      {/* 05 Photo evidence */}
      <div>
        <label className="mb-2 block font-data text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
          05 — EVIDENCE{" "}
          <span className="font-data text-[9px] normal-case tracking-normal" style={{ color: "var(--text-muted)" }}>
            (optional — up to {MAX_FILES} files · JPG, PNG, WebP, GIF, PDF · max {MAX_MB_EACH}MB each)
          </span>
        </label>

        {/* Drop zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => photos.length < MAX_FILES && fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center gap-3 border-2 border-dashed px-4 py-8 transition-all duration-150"
          style={{
            borderColor:     dragging ? "var(--signal-amber)" : "var(--border-default)",
            backgroundColor: dragging ? "rgba(255,176,0,0.04)" : "var(--bg-panel)",
            borderRadius:    "var(--radius-sm)",
            cursor:          photos.length >= MAX_FILES ? "not-allowed" : "pointer",
            opacity:         photos.length >= MAX_FILES ? 0.5 : 1,
          }}
        >
          <Upload size={20} style={{ color: dragging ? "var(--signal-amber)" : "var(--text-muted)" }} />
          <div className="text-center">
            <p className="font-data text-[11px] uppercase tracking-[0.1em]"
              style={{ color: dragging ? "var(--signal-amber)" : "var(--text-secondary)" }}>
              {dragging ? "DROP TO UPLOAD" : photos.length >= MAX_FILES ? `MAX ${MAX_FILES} FILES REACHED` : "DRAG & DROP OR CLICK TO SELECT"}
            </p>
            <p className="mt-1 font-data text-[9px]" style={{ color: "var(--text-muted)" }}>
              Screenshots, documents, photos — anything that supports the leak
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED.join(",")}
            onChange={onFileChange}
            className="sr-only"
          />
        </div>

        {/* Preview grid */}
        {photos.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {photos.map((p) => (
              <div
                key={p.id}
                className="group relative overflow-hidden border"
                style={{
                  borderColor:     "var(--border-default)",
                  backgroundColor: "var(--bg-elevated)",
                  borderRadius:    "var(--radius-sm)",
                  aspectRatio:     "1",
                }}
              >
                {p.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.preview} alt={p.file.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2">
                    <FileText size={20} style={{ color: "var(--signal-amber)" }} />
                    <span className="truncate w-full text-center font-data text-[8px]"
                      style={{ color: "var(--text-muted)" }}>
                      {p.file.name}
                    </span>
                  </div>
                )}

                {/* File info overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}>
                  <p className="truncate font-data text-[8px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {p.file.name}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removePhoto(p.id); }}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  style={{ backgroundColor: "var(--signal-red)", color: "#fff" }}
                  aria-label="Remove file"
                >
                  <X size={10} />
                </button>

                {/* Image icon badge for non-previewed */}
                {p.preview && (
                  <div className="absolute left-1 top-1">
                    <Image size={10} style={{ color: "rgba(255,255,255,0.5)" }} />
                  </div>
                )}
              </div>
            ))}

            {/* Add more slot */}
            {photos.length < MAX_FILES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1 border border-dashed transition-all duration-150"
                style={{
                  borderColor:     "var(--border-default)",
                  backgroundColor: "transparent",
                  borderRadius:    "var(--radius-sm)",
                  aspectRatio:     "1",
                  color:           "var(--text-muted)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--signal-amber)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
              >
                <Upload size={14} />
                <span className="font-data text-[8px] uppercase tracking-[0.08em]">ADD MORE</span>
              </button>
            )}
          </div>
        )}

        <p className="mt-2 font-data text-[9px]" style={{ color: "var(--text-muted)" }}>
          {photos.length} / {MAX_FILES} files selected
          {photos.length > 0 && ` · ${(photos.reduce((a, p) => a + p.file.size, 0) / 1024 / 1024).toFixed(1)} MB total`}
        </p>
      </div>

      {/* 06 Contact */}
      <div>
        <label className="mb-2 block font-data text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
          06 — CONTACT VECTOR{" "}
          <span className="font-data text-[9px] normal-case tracking-normal" style={{ color: "var(--text-muted)" }}>
            (optional — for follow-up only)
          </span>
        </label>
        <input
          type="text" value={contact} onChange={(e) => setContact(e.target.value)}
          maxLength={200}
          placeholder="@TWITTER / SIGNAL / EMAIL — OR LEAVE BLANK TO STAY ANONYMOUS"
          className="w-full border bg-transparent px-4 py-3 font-data text-[11px] uppercase tracking-[0.04em] placeholder:text-[var(--text-muted)] focus:outline-none"
          style={{ borderColor: "var(--border-default)", color: "var(--text-primary)", borderRadius: "var(--radius-sm)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--signal-amber)")}
          onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border-default)")}
        />
      </div>

      {/* Error */}
      {status === "error" && error && (
        <div
          className="flex items-center gap-2 border px-3 py-2.5 font-data text-[11px] tracking-[0.08em]"
          style={{ borderColor: "var(--signal-red)", color: "var(--signal-red)", backgroundColor: "rgba(255,43,43,0.06)", borderRadius: "var(--radius-sm)" }}
        >
          <SignalDot color="red" size="sm" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading" || message.length < 20}
        className="flex items-center justify-center gap-2 border px-6 py-4 font-broadcast text-base tracking-[0.14em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ borderColor: "var(--signal-amber)", color: "var(--signal-amber)", backgroundColor: "rgba(255,176,0,0.06)", borderRadius: "var(--radius-md)" }}
        onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.backgroundColor = "rgba(255,176,0,0.14)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,176,0,0.06)"; }}
      >
        {status === "loading" ? (
          <><Radio size={14} className="animate-spin" /> TRANSMITTING...</>
        ) : (
          <><Send size={14} /> TRANSMIT LEAK{photos.length > 0 ? ` + ${photos.length} FILE${photos.length > 1 ? "S" : ""}` : ""}</>
        )}
      </button>

    </form>
  );
}
