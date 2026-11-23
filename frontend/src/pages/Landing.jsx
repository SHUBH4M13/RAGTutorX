
import { BookOpen, BrainCircuit, FileText, MessageSquare } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Upload your textbooks",
    description: "Upload PDF chapters and let RAGTutorX understand your study material.",
  },
  {
    icon: BrainCircuit,
    title: "AI-powered learning",
    description: "Ask questions and receive answers grounded in your uploaded content.",
  },
  {
    icon: MessageSquare,
    title: "Context-aware answers",
    description: "Get relevant explanations with references to textbook pages.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <BookOpen className="text-indigo-400" />
          RAGTutorX
        </div>

        <button className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium hover:bg-indigo-500 transition">
          Get Started
        </button>
      </nav>

      <main className="mx-auto max-w-6xl px-6">
        <section className="flex min-h-[65vh] flex-col items-center justify-center text-center">
          <span className="mb-6 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
            Your personal AI learning assistant
          </span>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Learn smarter with
            <span className="text-indigo-400"> your textbooks.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Upload your study material, ask questions, and get
            context-aware answers with references to the original pages.
          </p>

          <button className="mt-9 rounded-xl bg-indigo-600 px-8 py-4 font-semibold hover:bg-indigo-500 transition">
            Start Learning
          </button>
        </section>

        <section className="grid gap-6 pb-24 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-7"
              >
                <Icon className="mb-5 text-indigo-400" size={30} />

                <h3 className="text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default Landing;
