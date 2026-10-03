import { ArrowUpRight, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="about"
      className="scroll-mt-24 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 font-medium text-muted">
            <Sparkles
              size={14}
              aria-hidden="true"
            />
            AI Tools Explorer
          </p>
          <p className="text-subtle">
            A little less searching. A little more discovering.
          </p>
          <a
            href="https://freeserp.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-primary"
          >
            Powered by FreeSerp{" "}
            <ArrowUpRight
              size={12}
              aria-hidden="true"
            />
          </a>
        </div>
        <p className="mt-5 text-[10px] leading-5 text-subtle">
          An AI discovery interface built with React + TypeScript. Preview
          content is illustrative; live data is not connected yet.
        </p>
      </div>
    </footer>
  );
}
