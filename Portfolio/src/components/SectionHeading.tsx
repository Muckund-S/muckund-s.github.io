export function SectionHeading({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string
  eyebrow: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="label">
          <span className="text-burn-400">{index}</span> / {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-steel-100 md:text-4xl">
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}
