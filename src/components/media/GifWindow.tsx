import { CRTFrame } from "./CRTFrame";

type GifWindowProps = {
  src: string;
  alt?: string;
  label?: string;
  sublabel?: string;
  aspectRatio?: string;
  className?: string;
};

export function GifWindow({
  src,
  alt = "",
  label = "INTERCEPTED CLIP",
  sublabel,
  aspectRatio = "16/9",
  className = "",
}: GifWindowProps) {
  return (
    <CRTFrame label={label} sublabel={sublabel} className={className}>
      <div style={{ aspectRatio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          style={{ display: "block" }}
        />
      </div>
    </CRTFrame>
  );
}
