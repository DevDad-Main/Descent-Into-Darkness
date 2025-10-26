import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CRTDisplayProps {
  children: ReactNode;
  className?: string;
}

export default function CRTDisplay({ children, className }: CRTDisplayProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full h-full bg-black p-4",
        className,
      )}
    >
      {/* Outer Bezel / Frame */}
      <div className="crt-bezel relative w-full h-full rounded-[1.5rem] bg-gradient-to-b from-[#111] via-[#060606] to-black border border-[#0f0]/10 shadow-[inset_0_0_40px_rgba(0,255,0,0.05),0_0_40px_rgba(0,255,0,0.05)] overflow-hidden">
        {/* Inner Display Area */}
        <div className="crt-screen relative w-full h-full rounded-[1.25rem] overflow-hidden bg-black m-1">
          {/* Curvature simulation */}
          <div className="crt-curvature absolute inset-0 pointer-events-none z-[5]" />

          {/* Scanlines */}
          <div className="scanlines pointer-events-none absolute inset-0 z-20" />

          {/* Chromatic Aberration Layer */}
          <div className="chromatic-aberration relative w-full h-full">
            <div className="screen-curve relative w-full h-full p-8 overflow-auto">
              <div className="screen-glow">{children}</div>
            </div>
          </div>

          {/* Vignette */}
          <div className="vignette pointer-events-none absolute inset-0 z-10" />

          {/* Reflection */}
          <div className="reflection pointer-events-none absolute inset-0 z-15" />

          {/* Flicker */}
          <div className="flicker pointer-events-none absolute inset-0 z-30" />
        </div>
      </div>

      <style>{`
        .crt-bezel {
          box-shadow:
            inset 0 0 80px rgba(0, 255, 0, 0.05),
            0 0 100px rgba(0, 255, 0, 0.05),
            0 0 40px rgba(0, 255, 0, 0.1);
        }

        .crt-screen {
          background: radial-gradient(ellipse at center, #0a0a0a 0%, #000 100%);
          box-shadow:
            inset 0 0 80px rgba(0, 255, 0, 0.08),
            inset 0 0 150px rgba(0, 255, 0, 0.05);
          perspective: 1200px;
          transform-style: preserve-3d;
        }

        /* This is the magic curvature layer */
        .crt-curvature {

          background: radial-gradient(ellipse at center,
            rgba(255,255,255,0.08) 0%,
            rgba(255,255,255,0.03) 25%,
            rgba(0,0,0,0.2) 55%,
            rgba(0,0,0,0.85) 100%);
            mix-blend-mode: overlay;
          transform: scale(1.05);
          {/* background: */}
          {/*   radial-gradient(ellipse at center, */}
          {/*     rgba(255,255,255,0.08) 0%, */}
          {/*     rgba(255,255,255,0.02) 35%, */}
          {/*     rgba(0,0,0,0.35) 70%, */}
          {/*     rgba(0,0,0,0.8) 100%); */}
          {/* mix-blend-mode: overlay; */}
          {/* transform: scale(1.03); */}
          border-radius: inherit;
          box-shadow:
            inset 0 0 100px rgba(0,255,0,0.1),
            inset 0 0 60px rgba(0,255,0,0.05);
        }

        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.25),
            rgba(0, 0, 0, 0.25) 1px,
            transparent 1px,
            transparent 2px
          );
          animation: scanline 8s linear infinite;
          mix-blend-mode: overlay;
        }

        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }

        .chromatic-aberration {
          animation: chromatic 0.3s ease-in-out infinite alternate;
        }

        @keyframes chromatic {
          0% {
            text-shadow:
              0.7px 0 0 rgba(255, 0, 0, 0.4),
              -0.7px 0 0 rgba(0, 255, 255, 0.4);
          }
          100% {
            text-shadow:
              -0.7px 0 0 rgba(255, 0, 0, 0.4),
              0.7px 0 0 rgba(0, 255, 255, 0.4);
          }
        }


        .screen-curve {
          border-radius: 1.25rem;
          transform: perspective(1600px) translateZ(20px) rotateX(1.5deg) rotateY(0deg);
        }


        .screen-glow {
          color: #00ff00;
          text-shadow:
            0 0 6px rgba(0, 255, 0, 0.8),
            0 0 15px rgba(0, 255, 0, 0.6);
          font-family: 'Courier New', monospace;
        }

        .vignette {
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 70%,
            rgba(0, 0, 0, 0.8) 100%
          );
        }

        .reflection {
          background: linear-gradient(
            115deg,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(255, 255, 255, 0.02) 25%,
            transparent 60%
          );
          mix-blend-mode: overlay;
        }

        .flicker {
          animation: flicker 0.15s infinite;
          opacity: 0.05;
          background: rgba(255, 255, 255, 0.1);
        }

        @keyframes flicker {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.08; }
        }

        /* Scrollbar styling */
        .screen-curve::-webkit-scrollbar {
          width: 10px;
        }
        .screen-curve::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        .screen-curve::-webkit-scrollbar-thumb {
          background: #00ff00;
          border-radius: 5px;
          box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
        }
        .screen-curve::-webkit-scrollbar-thumb:hover {
          background: #00cc00;
        }
      `}</style>
    </div>
  );
}
