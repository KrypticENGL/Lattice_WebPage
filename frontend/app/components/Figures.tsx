/* Small static diagrams in the app's visual language: boxes, dots and arrows. */

function Markers({ id }: { id: string }) {
  return (
    <defs>
      <marker id={`${id}-h`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 1 L10 5 L0 9 z" fill="#9aa8b7" />
      </marker>
      <marker id={`${id}-d`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 1 L10 5 L0 9 z" style={{ fill: "var(--color-danger)" }} />
      </marker>
    </defs>
  );
}

function Cell({ x, y, w = 34, h = 22 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" className="mem-box" />
      <circle cx={x + w - 9} cy={y + h / 2} r="3" className="mem-dot" />
    </g>
  );
}

/** The same mechanism produces a row, a fan and a loop. */
export function ShapesFigure() {
  const m = "url(#shapes-h)";
  return (
    <svg viewBox="0 0 540 190" className="mem h-auto w-full" role="img" aria-label="Three diagrams: a linked list drawn as a row, a tree drawn as a fan, and a cycle drawn as a loop.">
      <Markers id="shapes" />
      {/* Row */}
      <Cell x={8} y={72} />
      <Cell x={64} y={72} />
      <Cell x={120} y={72} />
      <path d="M33 83 H62" className="mem-arrow" markerEnd={m} />
      <path d="M89 83 H118" className="mem-arrow" markerEnd={m} />
      <text x={8} y={176} className="mem-title">A list runs in a row</text>

      {/* Fan */}
      <Cell x={265} y={12} />
      <Cell x={215} y={80} />
      <Cell x={315} y={80} />
      <Cell x={190} y={140} w={30} />
      <Cell x={240} y={140} w={30} />
      <path d="M290 34 C290 58 232 52 232 78" className="mem-arrow" markerEnd={m} />
      <path d="M290 34 C290 58 332 52 332 78" className="mem-arrow" markerEnd={m} />
      <path d="M240 102 C240 122 205 118 205 138" className="mem-arrow" markerEnd={m} />
      <path d="M240 102 C240 122 255 118 255 138" className="mem-arrow" markerEnd={m} />
      <text x={190} y={176} className="mem-title">A tree fans out</text>

      {/* Loop */}
      <Cell x={450} y={20} />
      <Cell x={492} y={100} />
      <Cell x={408} y={100} />
      <path d="M475 31 C510 31 512 60 509 98" className="mem-arrow" markerEnd={m} />
      <path d="M517 111 C517 150 450 150 444 123" className="mem-arrow" markerEnd={m} />
      <path d="M433 111 C400 111 400 31 448 31" className="mem-arrow" markerEnd={m} />
      <text x={408} y={176} className="mem-title">A cycle loops</text>
    </svg>
  );
}

/** A freed object that something still points at. */
export function DanglingFigure() {
  const box = (x: number, label: string, value: string, freed = false) => (
    <g className={`mem-node ${freed ? "is-freed" : ""}`} style={{ animation: "none" }}>
      <rect x={x} y={30} width={112} height={80} rx="6" className="mem-box" />
      <rect x={x + 1} y={31} width={110} height={21} rx="5" className="mem-head" />
      <text x={x + 10} y={45}>
        {label}
        {freed && <tspan className="mem-muted"> freed</tspan>}
      </text>
      <line x1={x} x2={x + 112} y1={52} y2={52} className="mem-rule" />
      <line x1={x} x2={x + 112} y1={81} y2={81} className="mem-rule" />
      <text x={x + 10} y={71} className="mem-muted">value</text>
      <text x={x + 102} y={71} textAnchor="end">{value}</text>
      <text x={x + 10} y={100} className="mem-muted">next</text>
      <circle cx={x + 100} cy={95.5} r="3.5" className="mem-dot" />
    </g>
  );
  return (
    <svg viewBox="0 0 420 150" className="mem h-auto w-full" role="img" aria-label="Node #2 points at Node #3, which has been freed. Node #3 is faded with a dashed outline and the arrow to it is dashed red.">
      <Markers id="dangle" />
      {box(24, "Node #2", "20")}
      {box(260, "Node #3", "30", true)}
      <path d="M124 95.5 C190 95.5 196 60 257 60" className="mem-arrow is-dangling" markerEnd="url(#dangle-d)" />
      <text x={260} y={136} className="mem-title" style={{ fill: "var(--color-danger)" }}>
        freed at line 13 by delete c
      </text>
    </svg>
  );
}

/** A mock of the inspector panel for the selected pointer. */
export function InspectorFigure() {
  const rows: [string, React.ReactNode][] = [
    ["Type", <span key="t" className="font-mono">Node*</span>],
    ["Value", <span key="v"><span className="font-mono">Node #3</span> <span className="text-danger">(freed)</span></span>],
    [
      "Lifetime",
      <span key="l">
        Created at step 4, line 9 by <span className="font-mono">new</span>. Freed at step 8, line 13 by{" "}
        <span className="font-mono">delete c</span>.
      </span>,
    ],
    ["Points here", <span key="i" className="font-mono">b-&gt;next, c</span>],
  ];
  return (
    <div className="rounded-lg border border-line bg-surface text-[0.9rem]">
      <div className="flex items-baseline justify-between gap-4 border-b border-line px-4 py-3">
        <span className="font-mono text-ink">b-&gt;next</span>
        <span className="text-sm text-muted">Step 8 of 9</span>
      </div>
      <dl className="divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 px-4 py-2.5">
            <dt className="text-muted">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
