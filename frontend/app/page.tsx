import MemoryDemo from "./components/MemoryDemo";
import { DanglingFigure, InspectorFigure, ShapesFigure } from "./components/Figures";

const GITHUB_URL = "https://github.com/KrypticENGL/Lattice_Standalone_Windows-Linux-Mac";
const EMAIL = "phanishwar07@gmail.com";
const WAITLIST_URL = `mailto:${EMAIL}?subject=${encodeURIComponent("Lattice waitlist")}&body=${encodeURIComponent(
  "Please let me know when Lattice is available.\n\nI'm on: Windows / macOS / Linux",
)}`;

function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <rect width="512" height="512" rx="96" fill="#0b1118" />
      <path d="M256 92 398 174v164L256 420 114 338V174z" fill="none" stroke="#c9e265" strokeWidth="28" strokeLinejoin="round" />
      <circle cx="256" cy="256" r="34" fill="#c9e265" />
      <path d="M256 222v-52M285 273l45 26M227 273l-45 26" stroke="#c9e265" strokeWidth="20" strokeLinecap="round" />
    </svg>
  );
}

function GitHubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-lg bg-lime px-5 py-3 font-medium text-lime-ink transition hover:brightness-110"
    >
      {children}
    </a>
  );
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-5 py-3 font-medium text-ink transition hover:border-muted"
    >
      {children}
    </a>
  );
}

function Section({
  id,
  title,
  intro,
  children,
}: {
  id?: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">{title}</h2>
          {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
        </div>
        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */

function Nav() {
  const links = [
    ["Features", "#features"],
    ["How it works", "#how-it-works"],
    ["Platforms", "#platforms"],
    ["FAQ", "#faq"],
  ];
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-bg/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6" aria-label="Main">
        <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight text-ink">
          <Logo />
          Lattice
        </a>
        <ul className="hidden items-center gap-7 text-[0.95rem] text-muted md:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="transition hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={GITHUB_URL}
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-line-strong px-3.5 py-2 text-sm text-ink transition hover:border-muted"
        >
          <GitHubIcon />
          GitHub
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="max-w-3xl">
          <h1 className="text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:text-[4.2rem]">
            See what your pointers are actually doing.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            Write ordinary C++ and press Run. Lattice compiles it with your own compiler and draws the program&rsquo;s
            memory as it runs: stack frames, heap objects and the pointers between them. Then you can step back and
            forth through every change.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <PrimaryButton href={GITHUB_URL}>
              <GitHubIcon />
              View on GitHub
            </PrimaryButton>
            <SecondaryButton href={WAITLIST_URL}>Join the waitlist</SecondaryButton>
          </div>
          <p className="mt-5 text-[0.95rem] text-muted">
            Coming to Windows, macOS and Linux. Joining the waitlist opens an email to the developer.
          </p>
        </div>

        <div className="mt-16 sm:mt-20">
          <MemoryDemo />
          <p className="mt-4 text-sm text-muted">
            A replay of a real example. Press play, drag the timeline, or focus the demo and use the arrow keys, Home,
            End and Space.
          </p>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
          Pointers are invisible.
        </h2>
        <div className="max-w-2xl space-y-5 text-lg text-muted">
          <p>
            A pointer is just an address. <span className="font-mono text-[0.95em] text-ink">printf</span> shows you a
            number, a debugger shows you one variable at a time, and the drawing on the whiteboard is out of date by
            the next line.
          </p>
          <p>
            Lattice records everything your program does to memory and draws the whole picture, at every step. You
            don&rsquo;t add annotations or call a special API. You write your code, and Lattice observes it.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  title,
  children,
  figure,
  flip = false,
}: {
  title: string;
  children: React.ReactNode;
  figure: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-10 border-t border-line py-14 first:border-t-0 first:pt-0 lg:grid-cols-2 lg:gap-20">
      <div className={flip ? "lg:order-2" : ""}>
        <h3 className="text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.75rem]">{title}</h3>
        <div className="mt-4 max-w-xl space-y-4 text-muted">{children}</div>
      </div>
      <div className={flip ? "lg:order-1" : ""}>{figure}</div>
    </div>
  );
}

function Features() {
  const more: [string, string][] = [
    [
      "Step through time",
      "Raw events are grouped into readable steps. Scrub with the slider or the keyboard, and each step highlights the line of source that caused it.",
    ],
    [
      "Your real compiler",
      "Lattice builds your program with Clang or GCC on your machine. There is no interpreter and no cut-down C++ subset, and your program's output is unchanged.",
    ],
    [
      "Your code stays yours",
      "Tracking calls are only ever inserted into a temporary copy. Your files are never edited, nothing is moved, and line numbers stay the same.",
    ],
    [
      "A real editor",
      "Monaco, the editor from VS Code, with clangd: completion, hover, go to definition, rename, quick fixes, formatting and live errors. Multi-file projects open in tabs.",
    ],
    [
      "Built for long runs",
      "Lattice records around 367,000 events a second. If a run gets too long, it marks exactly where recording stopped, so a partial picture is never passed off as a complete one.",
    ],
    [
      "Safe to experiment",
      "Runaway programs are stopped after a timeout, output is capped, and Stop ends the whole process tree. Uninitialized memory is shown as uninitialized, never as a fake zero.",
    ],
  ];

  return (
    <Section
      id="features"
      title="Built to show you exactly what happened"
      intro="Every box and arrow comes from what your program really did: real types, real allocations, real addresses resolved to the objects they belong to."
    >
      <div>
        <FeatureRow title="Draws your data structures, whatever they are" figure={<ShapesFigure />}>
          <p>
            Lattice has no special view for &ldquo;a linked list&rdquo; or &ldquo;a tree&rdquo;. It records objects,
            the variables that name them, the pointers between them and when each one lives and dies. Then it lays
            that out.
          </p>
          <p>
            A list comes out as a row, a tree as a fan and a cycle as a loop because that&rsquo;s what the pointers
            say, and shared nodes are never drawn twice. It works on your own{" "}
            <span className="font-mono text-[0.95em] text-ink">struct Employee</span> as well as on textbook code.
          </p>
        </FeatureRow>
        <FeatureRow title="Catches dangling pointers" figure={<DanglingFigure />} flip>
          <p>
            When an object is freed while something still points at it, the object stays on screen, faded and dashed,
            and every arrow into it turns dashed red.
          </p>
          <p>Use-after-free bugs stop being a mystery crash and become something you can see.</p>
        </FeatureRow>
        <FeatureRow title="Inspect anything you click" figure={<InspectorFigure />}>
          <p>
            Click a stack frame, variable, object or field to see its type, its value, when it was created or freed
            and why, and every link into and out of it.
          </p>
          <p>The selection stays put as you move through the timeline, so you can follow one object through the whole run.</p>
        </FeatureRow>
      </div>

      <div className="mt-6 grid gap-x-12 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {more.map(([title, body]) => (
          <div key={title} className="py-6">
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-[0.98rem] text-muted">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  const steps: [string, string][] = [
    ["Write", "Write C++ in the built-in editor, with completion and live errors from clangd."],
    [
      "Observe",
      "Turn on Observe and press Run. Lattice reads your code with libclang and inserts tracking calls into a temporary copy. It never deletes or moves anything.",
    ],
    ["Compile", "Your own compiler builds it, together with a small runtime library. The program runs normally and prints what it always prints."],
    [
      "Record",
      "As it runs, the program streams events to Lattice: allocations, field writes, function calls, scopes and frees. Lattice turns them into a timeline of the program's whole state.",
    ],
    ["Replay", "Move through the timeline. Every step redraws memory and highlights the line responsible."],
  ];
  const pipeline = [
    "C++ source",
    "libclang analysis",
    "insertion-only rewrite",
    "your compiler",
    "running program",
    "event stream",
    "timeline",
    "picture",
  ];

  return (
    <Section id="how-it-works" title="How it works" intro="Five steps between your source file and a picture of its memory.">
      <ol className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-5">
        {steps.map(([title, body], i) => (
          <li key={title} className="border-t-2 border-line-strong pt-5 first:border-lime">
            <span className="font-mono text-sm text-lime">{i + 1}</span>
            <h3 className="mt-2 text-lg font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-[0.98rem] text-muted">{body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-16 rounded-xl border border-line bg-surface p-5 sm:p-6">
        <p className="text-sm text-muted">The pipeline</p>
        <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3 font-mono text-[0.85rem]" aria-label="Pipeline">
          {pipeline.map((stage, i) => (
            <li key={stage} className="flex items-center gap-2">
              <span
                className={`rounded-md border px-2.5 py-1 ${
                  i === pipeline.length - 1 ? "border-lime text-lime" : "border-line-strong text-ink"
                }`}
              >
                {stage}
              </span>
              {i < pipeline.length - 1 && (
                <svg viewBox="0 0 20 10" className="h-2.5 w-5 text-muted" aria-hidden="true">
                  <path d="M0 5h17M13 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

function Platforms() {
  const platforms: { name: string; status: string; active: boolean; detail: string }[] = [
    {
      name: "Windows",
      status: "Pre-release in testing",
      active: true,
      detail: "Windows 10 or 11. Builds with Clang (preferred) or GCC through MinGW.",
    },
    {
      name: "macOS",
      status: "In development",
      active: false,
      detail: "The same app and the same features, built natively for the Mac.",
    },
    {
      name: "Linux",
      status: "In development",
      active: false,
      detail: "The same app and the same features, built natively for Linux desktops.",
    },
  ];

  return (
    <Section
      id="platforms"
      title="Windows, macOS and Linux"
      intro="Lattice is a native desktop app with a core written in Rust on Tauri 2. It installs as a small native app on each system rather than a bundled browser."
    >
      <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
        {platforms.map((p) => (
          <div key={p.name} className="bg-bg p-6 sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight text-ink">{p.name}</h3>
            <p className={`mt-3 inline-flex items-center gap-2 text-[0.95rem] ${p.active ? "text-lime" : "text-muted"}`}>
              <span
                className={`h-2 w-2 rounded-full ${p.active ? "bg-lime" : "border border-muted"}`}
                aria-hidden="true"
              />
              {p.status}
            </p>
            <p className="mt-4 text-[0.98rem] text-muted">{p.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 text-[0.98rem] text-muted md:grid-cols-2">
        <p>
          <span className="text-ink">What you&rsquo;ll need:</span> a C++ compiler (Clang or GCC). For editor
          IntelliSense, add clangd. For observing and drawing your program, Lattice uses libclang 17 or newer. If
          it&rsquo;s missing, the Observe toggle tells you what to install.
        </p>
        <p>
          <span className="text-ink">Where it stands:</span> Lattice is at version 0.1.0 and there are no public
          installers yet. Join the waitlist to hear when builds are ready for your system, or follow the source on
          GitHub.
        </p>
      </div>
    </Section>
  );
}

function Roadmap() {
  const items: [string, string][] = [
    ["Standard library containers", "std::vector, std::string, std::unique_ptr and maps drawn as the containers they are."],
    ["Threads and optimized builds", "Observing multi-threaded programs and code built with -O2."],
    ["More of C++", "Destructors as their own steps, base classes, templates per instantiation, static locals and lambdas."],
    ["Clearer pictures", "Arrays as rows of cells, arrows that route around boxes, stable positions between steps, zoom and pan."],
    ["Canvas", "Build programs by connecting nodes, and watch what they do to memory."],
    ["Plugins and Posts", "Extend Lattice with plugins, and share your visualizations with other people learning C++."],
  ];
  return (
    <Section
      id="roadmap"
      title="What's next"
      intro="These aren't built yet. They're where Lattice is heading after the first release."
    >
      <ul className="grid border-t border-line md:grid-cols-2">
        {items.map(([title, body]) => (
          <li key={title} className="grid content-start gap-1 border-b border-line py-6 md:pr-10 md:[&:nth-child(even)]:pl-10">
            <h3 className="font-semibold text-ink">{title}</h3>
            <p className="text-[0.98rem] text-muted">{body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Faq() {
  const faqs: [string, React.ReactNode][] = [
    [
      "Do I need to change my code?",
      "No. There are no annotations and no special API. Lattice inserts its tracking calls into a temporary copy at build time and leaves your files alone.",
    ],
    [
      "Which compilers does it work with?",
      "Clang (preferred) and GCC, including MinGW on Windows. It's been tested with GCC 15 and Clang 18 and 23. MSVC isn't supported as the compiler yet.",
    ],
    [
      "Is it a debugger?",
      "No. A debugger pauses a live program. Lattice records the whole run and then lets you move backwards and forwards through it, so you can look at any moment as often as you like.",
    ],
    [
      "Is my program sandboxed?",
      "No. Your program runs as you, with your permissions, just as it would from a terminal. Lattice protects you from runaway programs with timeouts and by stopping the whole process tree, but it doesn't protect against malicious code. Only run code you trust.",
    ],
    [
      "Does it show std::vector and other containers?",
      "Not as containers yet. Drawing standard library types as the containers they are is planned for after the first release.",
    ],
    [
      "When can I download it?",
      "Lattice is at version 0.1.0 and being tested on Windows, with macOS and Linux builds in development. Join the waitlist and you'll get an email when there's a build for your system.",
    ],
  ];
  return (
    <Section id="faq" title="Questions">
      <div className="faq max-w-3xl divide-y divide-line border-y border-line">
        {faqs.map(([q, a]) => (
          <details key={q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg text-ink">
              {q}
              <svg viewBox="0 0 16 16" className="faq-mark h-4 w-4 shrink-0 text-muted" aria-hidden="true">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </summary>
            <p className="max-w-2xl pb-6 text-muted">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function Closing() {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
            Stop drawing memory on the whiteboard.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Get an email when Lattice is ready for your system, or follow along with the source on GitHub.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <PrimaryButton href={WAITLIST_URL}>Join the waitlist</PrimaryButton>
          <SecondaryButton href={GITHUB_URL}>
            <GitHubIcon />
            View on GitHub
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-[0.95rem] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Logo className="h-6 w-6" />
          <span>
            <span className="text-ink">Lattice</span> 0.1.0, pre-release
          </span>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a href={GITHUB_URL} className="hover:text-ink">GitHub</a>
          </li>
          <li>
            <a href={`mailto:${EMAIL}`} className="hover:text-ink">{EMAIL}</a>
          </li>
          <li>&copy; 2026 Lattice</li>
        </ul>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <Platforms />
        <Roadmap />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
