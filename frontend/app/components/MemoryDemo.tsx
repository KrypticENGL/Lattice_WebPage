"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
 * A hand-made, pre-recorded replay of the canonical Lattice example
 * (CONTEXT.md §9). Nothing is executed in the browser: each step is a
 * snapshot of what Lattice would draw at that point in the run.
 */

type Tok = [string, string?];

const CODE: Tok[][] = [
  [["struct", "kw"], [" "], ["Node", "type"], [" {"]],
  [["    "], ["int", "kw"], [" value;"]],
  [["    "], ["Node", "type"], ["* next;"]],
  [["};"]],
  [],
  [["int", "kw"], [" main() {"]],
  [["    "], ["Node", "type"], ["* a = "], ["new", "kw"], [" "], ["Node", "type"], ["{"], ["10", "num"], [", "], ["nullptr", "kw"], ["};"]],
  [["    "], ["Node", "type"], ["* b = "], ["new", "kw"], [" "], ["Node", "type"], ["{"], ["20", "num"], [", "], ["nullptr", "kw"], ["};"]],
  [["    "], ["Node", "type"], ["* c = "], ["new", "kw"], [" "], ["Node", "type"], ["{"], ["30", "num"], [", "], ["nullptr", "kw"], ["};"]],
  [["    a->next = b;"]],
  [["    b->next = c;"]],
  [["    c->next = a;   "], ["// closes the loop", "comment"]],
  [["    "], ["delete", "kw"], [" c;     "], ["// b->next now dangles", "comment"]],
  [["    "], ["return", "kw"], [" "], ["0", "num"], [";"]],
  [["}"]],
];

type VarName = "a" | "b" | "c";
type ObjId = 1 | 2 | 3;

interface Snapshot {
  line: number;
  caption: string;
  vars: Record<VarName, ObjId | null>;
  objs: { id: ObjId; value: number; next: ObjId | null; freed: boolean }[];
  /** What this step changed, for highlighting: "var:a", "obj:1", "next:1". */
  changed: string[];
}

function buildSteps(): Snapshot[] {
  const steps: Snapshot[] = [];
  const vars: Snapshot["vars"] = { a: null, b: null, c: null };
  const objs: Snapshot["objs"] = [];
  const push = (line: number, caption: string, changed: string[]) =>
    steps.push({
      line,
      caption,
      changed,
      vars: { ...vars },
      objs: objs.map((o) => ({ ...o })),
    });

  push(6, "main() starts. a, b and c exist on the stack but hold nothing yet.", []);
  (["a", "b", "c"] as const).forEach((v, i) => {
    const id = (i + 1) as ObjId;
    objs.push({ id, value: (i + 1) * 10, next: null, freed: false });
    vars[v] = id;
    push(
      7 + i,
      `new Node{${(i + 1) * 10}, nullptr} creates heap object #${id}, and ${v} points to it.`,
      [`var:${v}`, `obj:${id}`],
    );
  });
  objs[0].next = 2;
  push(10, "a->next = b. The first link: object #1 now points at object #2.", ["next:1"]);
  objs[1].next = 3;
  push(11, "b->next = c. A straight chain, so it is drawn as a row.", ["next:2"]);
  objs[2].next = 1;
  push(12, "c->next = a. The last node points back to the first, and the row closes into a loop.", ["next:3"]);
  objs[2].freed = true;
  push(
    13,
    "delete c frees object #3. b->next and c still point at it, so the object fades and both arrows turn dashed red.",
    ["obj:3"],
  );
  push(14, "main returns 0. This is the full picture Lattice opens on after a run.", []);
  return steps;
}

const STEPS = buildSteps();
const LAST = STEPS.length - 1;

/* ---- Diagram geometry (SVG user units) ---- */
const BOX = { y: 40, w: 104, head: 22, row: 29 };
const BOX_X: Record<ObjId, number> = { 1: 240, 2: 380, 3: 520 };
const NEXT_Y = BOX.y + BOX.head + BOX.row + BOX.row / 2; // centre of the "next" row
const BOX_BOTTOM = BOX.y + BOX.head + BOX.row * 2;
const FRAME = { x: 16, y: 150, w: 160, head: 26, row: 32 };
const VAR_Y: Record<VarName, number> = {
  a: FRAME.y + FRAME.head + FRAME.row * 0.5,
  b: FRAME.y + FRAME.head + FRAME.row * 1.5,
  c: FRAME.y + FRAME.head + FRAME.row * 2.5,
};

function varPath(v: VarName, target: ObjId) {
  const y = VAR_Y[v];
  const cx = BOX_X[target] + BOX.w / 2;
  return `M${FRAME.x + FRAME.w - 12} ${y} H${cx - 14} Q${cx} ${y} ${cx} ${y - 14} V${BOX_BOTTOM + 2}`;
}

function nextPath(from: ObjId, to: ObjId) {
  const sx = BOX_X[from] + BOX.w - 12;
  if (to > from) {
    const tx = BOX_X[to];
    return `M${sx} ${NEXT_Y} C${sx + 40} ${NEXT_Y} ${tx - 26} ${BOX.y + 40} ${tx - 2} ${BOX.y + 40}`;
  }
  // Back edge: up and over the row of boxes, down into the target's top.
  const tx = BOX_X[to] + BOX.w / 2;
  const top = 14;
  return `M${sx} ${NEXT_Y} C${sx + 56} ${NEXT_Y} ${sx + 56} ${top} ${sx - 10} ${top} H${tx + 14} Q${tx} ${top} ${tx} ${top + 14} V${BOX.y - 2}`;
}

function arrowClass(isNew: boolean, dangling: boolean, faded: boolean) {
  return [
    "mem-arrow",
    isNew ? "is-new" : "",
    dangling ? "is-dangling" : "",
    faded ? "is-faded" : "",
  ].join(" ");
}

function Diagram({ snap }: { snap: Snapshot }) {
  const freed = new Set(snap.objs.filter((o) => o.freed).map((o) => o.id));
  const has = (key: string) => snap.changed.includes(key);
  const markerFor = (dangling: boolean, isNew: boolean) =>
    dangling ? "url(#head-danger)" : isNew ? "url(#head-new)" : "url(#head)";

  return (
    <svg
      viewBox="0 0 680 290"
      className="mem block h-auto w-full"
      role="img"
      aria-label={`Memory diagram. ${snap.caption}`}
    >
      <defs>
        {[
          ["head", "#9aa8b7"],
          ["head-new", "var(--color-lime)"],
          ["head-danger", "var(--color-danger)"],
        ].map(([id, color]) => (
          <marker
            key={id}
            id={id}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 1 L10 5 L0 9 z" style={{ fill: color }} />
          </marker>
        ))}
      </defs>

      <text x={FRAME.x} y={FRAME.y - 10} className="mem-title">
        Stack
      </text>
      <text x={BOX_X[1]} y={BOX.y - 10} className="mem-title">
        Heap
      </text>

      {/* Stack frame */}
      <g>
        <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.head + FRAME.row * 3} rx="6" className="mem-box" style={{ stroke: "var(--color-lime)" }} />
        <rect x={FRAME.x + 1} y={FRAME.y + 1} width={FRAME.w - 2} height={FRAME.head - 1} rx="5" className="mem-head" />
        <text x={FRAME.x + 10} y={FRAME.y + 17}>main()</text>
        {(["a", "b", "c"] as const).map((v, i) => {
          const rowTop = FRAME.y + FRAME.head + FRAME.row * i;
          const target = snap.vars[v];
          return (
            <g key={v}>
              {has(`var:${v}`) && (
                <rect x={FRAME.x + 1} y={rowTop} width={FRAME.w - 2} height={FRAME.row} className="mem-row-lit" />
              )}
              <line x1={FRAME.x} x2={FRAME.x + FRAME.w} y1={rowTop} y2={rowTop} className="mem-rule" />
              <text x={FRAME.x + 10} y={rowTop + 20}>
                <tspan className="mem-muted">Node* </tspan>
                {v}
              </text>
              {target === null ? (
                <text x={FRAME.x + FRAME.w - 10} y={rowTop + 20} textAnchor="end" className="mem-muted">
                  ?
                </text>
              ) : (
                <circle cx={FRAME.x + FRAME.w - 12} cy={VAR_Y[v]} r="3.5" className="mem-dot" />
              )}
            </g>
          );
        })}
      </g>

      {/* Heap objects */}
      {snap.objs.map((o) => {
        const x = BOX_X[o.id];
        const isNew = has(`obj:${o.id}`);
        return (
          <g key={o.id} className={`mem-node ${isNew ? "is-new" : ""} ${o.freed ? "is-freed" : ""}`}>
            <rect x={x} y={BOX.y} width={BOX.w} height={BOX_BOTTOM - BOX.y} rx="6" className="mem-box" />
            <rect x={x + 1} y={BOX.y + 1} width={BOX.w - 2} height={BOX.head - 1} rx="5" className="mem-head" />
            <text x={x + 10} y={BOX.y + 15}>
              Node #{o.id}
              {o.freed && <tspan className="mem-muted"> freed</tspan>}
            </text>
            {has(`next:${o.id}`) && (
              <rect x={x + 1} y={BOX.y + BOX.head + BOX.row} width={BOX.w - 2} height={BOX.row - 1} className="mem-row-lit" />
            )}
            <line x1={x} x2={x + BOX.w} y1={BOX.y + BOX.head} y2={BOX.y + BOX.head} className="mem-rule" />
            <line x1={x} x2={x + BOX.w} y1={BOX.y + BOX.head + BOX.row} y2={BOX.y + BOX.head + BOX.row} className="mem-rule" />
            <text x={x + 10} y={BOX.y + BOX.head + 19} className="mem-muted">value</text>
            <text x={x + BOX.w - 10} y={BOX.y + BOX.head + 19} textAnchor="end">{o.value}</text>
            <text x={x + 10} y={BOX.y + BOX.head + BOX.row + 19} className="mem-muted">next</text>
            {o.next === null ? (
              <text x={x + BOX.w - 10} y={BOX.y + BOX.head + BOX.row + 19} textAnchor="end" className="mem-muted">
                nullptr
              </text>
            ) : (
              <circle cx={x + BOX.w - 12} cy={NEXT_Y} r="3.5" className="mem-dot" />
            )}
          </g>
        );
      })}

      {/* Pointers: stack → heap */}
      {(["a", "b", "c"] as const).map((v) => {
        const target = snap.vars[v];
        if (target === null) return null;
        const dangling = freed.has(target);
        const isNew = has(`var:${v}`);
        return (
          <path
            key={`var-${v}-${dangling ? "d" : "ok"}`}
            d={varPath(v, target)}
            pathLength={isNew && !dangling ? 1 : undefined}
            className={arrowClass(isNew, dangling, false)}
            markerEnd={markerFor(dangling, isNew)}
          />
        );
      })}

      {/* Pointers: heap → heap */}
      {snap.objs.map((o) => {
        if (o.next === null) return null;
        const dangling = freed.has(o.next);
        const isNew = has(`next:${o.id}`);
        return (
          <path
            key={`next-${o.id}-${dangling ? "d" : "ok"}`}
            d={nextPath(o.id, o.next)}
            pathLength={isNew && !dangling ? 1 : undefined}
            className={arrowClass(isNew, dangling, o.freed)}
            markerEnd={markerFor(dangling, isNew)}
          />
        );
      })}
    </svg>
  );
}

export default function MemoryDemo() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const autoplayed = useRef(false);

  const go = useCallback((n: number) => {
    setStep(Math.max(0, Math.min(LAST, n)));
  }, []);

  // Play once when the demo first scrolls into view. With reduced motion,
  // open on the full picture instead, like the app does.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || autoplayed.current) return;
        autoplayed.current = true;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setStep(LAST);
        else setPlaying(true);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Playback stops by itself on the last step.
  const isPlaying = playing && step < LAST;

  useEffect(() => {
    if (!isPlaying) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 900 : 1400);
    return () => window.clearTimeout(t);
  }, [isPlaying, step]);

  const togglePlay = () => {
    if (!isPlaying && step >= LAST) setStep(0);
    setPlaying(!isPlaying);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowLeft: () => go(step - 1),
      ArrowRight: () => go(step + 1),
      Home: () => go(0),
      End: () => go(LAST),
      " ": togglePlay,
    };
    const action = keys[e.key];
    if (!action) return;
    // Let the slider handle its own arrow keys.
    if ((e.target as HTMLElement).tagName === "INPUT" && e.key !== " ") return;
    e.preventDefault();
    if (e.key !== " ") setPlaying(false);
    action();
  };

  const snap = STEPS[step];

  return (
    <div
      ref={rootRef}
      onKeyDown={onKeyDown}
      className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5 text-sm text-muted">
        <svg viewBox="0 0 512 512" className="h-4 w-4" aria-hidden="true">
          <path d="M256 92 398 174v164L256 420 114 338V174z" fill="none" stroke="#c9e265" strokeWidth="36" strokeLinejoin="round" />
          <circle cx="256" cy="256" r="44" fill="#c9e265" />
        </svg>
        <span>linked_list.cpp</span>
        <span className="ml-auto hidden items-center gap-2 sm:flex">
          <span className="h-2 w-2 rounded-full bg-lime" aria-hidden="true" />
          Observe on
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* Editor */}
        <pre
          className="overflow-x-auto border-b border-line py-3 font-mono text-[12.5px] leading-[1.7] lg:border-b-0 lg:border-r"
          aria-label="Example C++ program"
        >
          <code>
            {CODE.map((line, i) => {
              const n = i + 1;
              const current = n === snap.line;
              return (
                <span
                  key={n}
                  className={`flex border-l-2 pr-4 ${current ? "border-lime bg-lime/10" : "border-transparent"}`}
                  aria-current={current ? "step" : undefined}
                >
                  <span className={`w-10 shrink-0 select-none pr-3 text-right ${current ? "text-lime" : "text-muted/60"}`}>
                    {n}
                  </span>
                  <span className="whitespace-pre">
                    {line.map(([t, kind], j) => (
                      <span key={j} className={kind ? `code-${kind}` : undefined}>
                        {t}
                      </span>
                    ))}
                    {line.length === 0 && " "}
                  </span>
                </span>
              );
            })}
          </code>
        </pre>

        {/* Visualization */}
        <div className="flex flex-col justify-center overflow-x-auto bg-bg/40 p-3 sm:p-5">
          <div className="min-w-[540px]">
            <Diagram snap={snap} />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-t border-line px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => { setPlaying(false); go(step - 1); }}
            disabled={step === 0}
            className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-raised hover:text-ink disabled:opacity-40"
            aria-label="Previous step"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="grid h-8 w-8 place-items-center rounded-md bg-lime text-lime-ink hover:brightness-110"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true"><path d="M4 2.5v11L13 8z" fill="currentColor" /></svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => { setPlaying(false); go(step + 1); }}
            disabled={step === LAST}
            className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-raised hover:text-ink disabled:opacity-40"
            aria-label="Next step"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <input
            type="range"
            min={0}
            max={LAST}
            value={step}
            onChange={(e) => { setPlaying(false); go(Number(e.target.value)); }}
            className="timeline mx-1 min-w-0 flex-1"
            style={{ "--fill": `${(step / LAST) * 100}%` } as React.CSSProperties}
            aria-label="Timeline"
            aria-valuetext={`Step ${step + 1} of ${STEPS.length}, line ${snap.line}`}
          />
          <span className="shrink-0 text-sm tabular-nums text-muted">
            {step + 1}/{STEPS.length}
          </span>
        </div>
        <p className="mt-3 min-h-[3.2em] text-[0.95rem] leading-snug text-ink sm:min-h-[1.6em]" aria-live="polite">
          <span className="text-muted">Line {snap.line}. </span>
          {snap.caption}
        </p>
      </div>
    </div>
  );
}
