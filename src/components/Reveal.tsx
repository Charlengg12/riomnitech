import type { ReactNode, CSSProperties } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Tilt direction: subtle 3D rotation that snaps flat as it enters. */
  tilt?: "up" | "left" | "right" | "none";
  as?: "div" | "section" | "article" | "header";
};

const tiltMap = {
  up: "rotateX(8deg)",
  left: "rotateY(-8deg)",
  right: "rotateY(8deg)",
  none: "none",
};

export function Reveal({ children, className, delay = 0, tilt = "up", as: Tag = "div" }: RevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const style: CSSProperties = {
    transform: visible ? "perspective(1200px) rotateX(0) rotateY(0) translateY(0)" : `perspective(1200px) ${tiltMap[tilt]} translateY(28px)`,
    opacity: visible ? 1 : 0,
    transition: `transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, opacity 700ms ease ${delay}ms`,
    transformStyle: "preserve-3d",
    willChange: "transform, opacity",
  };
  return (
    <Tag ref={ref as never} style={style} className={className}>
      {children}
    </Tag>
  );
}
