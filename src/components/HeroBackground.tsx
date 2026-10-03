export function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-12 left-[calc(50%-340px)] h-[420px] w-[520px] animate-glow-violet rounded-full bg-accent/10 blur-[100px]" />
      <div className="absolute right-[calc(50%-460px)] top-28 h-[340px] w-[480px] animate-glow-blue rounded-full bg-indigo-accent/10 blur-[100px]" />
      <div className="absolute bottom-0 left-[calc(50%-160px)] h-48 w-80 animate-glow-secondary rounded-full bg-accent/5 blur-[80px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-grid)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_65%_70%_at_50%_30%,black,transparent)]" />
      <span className="absolute left-[18%] top-[24%] size-1 animate-light-point rounded-full bg-accent/50 blur-[1px]" />
      <span className="absolute right-[17%] top-[48%] size-1 animate-light-point rounded-full bg-indigo-accent/50 blur-[1px] [animation-delay:-9s]" />
      <span className="absolute bottom-[23%] left-[30%] size-0.5 animate-light-point rounded-full bg-accent/50 [animation-delay:-15s]" />
    </div>
  )
}
