
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Send,
  Bot,
  User,
  Loader2,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../services/api";

function Tutor() {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = "user_2";

  const handleAsk = async (e) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    const userMessage = {
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/chat/ask", {
        question: trimmedQuestion,
        user_id: userId,
        document_id: documentId,
      });

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        sources: response.data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 px-5 py-4 md:px-8">

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-600/20 p-2">
              <BookOpen className="text-indigo-400" size={22} />
            </div>

            <div>
              <h1 className="font-semibold">RAGTutorX AI Tutor</h1>
              <p className="text-xs text-slate-400">
                Ask questions about your textbook
              </p>
            </div>
          </div>
        </div>

        <div className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 sm:block">
          Document connected
        </div>

      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8">

        <div className="mx-auto max-w-4xl">

          {messages.length === 0 && (
            <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">

              <div className="mb-6 rounded-2xl bg-indigo-600/15 p-5">
                <Bot size={42} className="text-indigo-400" />
              </div>

              <h2 className="text-3xl font-bold">
                What would you like to learn?
              </h2>

              <p className="mt-3 max-w-lg text-slate-400">
                Ask anything about your uploaded textbook.
                I'll find relevant passages and generate
                answers grounded in your study material.
              </p>

              <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">

                {[
                  "Summarize this chapter",
                  "Explain the important concepts",
                  "Give me important questions",
                  "Explain the chapter in simple words",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuestion(suggestion)}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left text-sm text-slate-300 transition hover:border-indigo-500"
                  >
                    {suggestion}
                  </button>
                ))}

              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-8">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${
                  message.role === "user"
                    ? "flex-row-reverse"
                    : ""
                }`}
              >

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    message.role === "user"
                      ? "bg-indigo-600"
                      : "bg-slate-800"
                  }`}
                >
                  {message.role === "user" ? (
                    <User size={18} />
                  ) : (
                    <Bot size={18} className="text-indigo-400" />
                  )}
                </div>

                <div className={`min-w-0 max-w-[85%] ${
                  message.role === "user" ? "text-right" : ""
                }`}>

                  <p className="mb-2 text-sm font-semibold">
                    {message.role === "user" ? "You" : "RAGTutorX"}
                  </p>

                  <div
                    className={`rounded-2xl p-4 text-sm leading-7 ${
                      message.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-800 bg-slate-900 text-slate-200"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-li:my-1">
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>

                  {/* Sources */}
                  {message.role === "assistant" &&
                    message.sources.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <FileText size={14} />
                          Referenced sources
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, i) => {
                            const page =
                              typeof source === "number"
                                ? source
                                : source.page_number;

                            return (
                              <span
                                key={i}
                                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-indigo-300"
                              >
                                Page {page ?? "Unknown"}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Loader2 className="animate-spin text-indigo-400" size={20} />
                Searching your textbook and generating an answer...
              </div>
            )}

          </div>

          {error && (
            <p className="mt-6 text-sm text-red-400">{error}</p>
          )}

        </div>
      </main>

      {/* Input */}
      <footer className="border-t border-slate-800 bg-slate-950 p-4 md:px-8">

        <form
          onSubmit={handleAsk}
          className="mx-auto flex max-w-4xl items-end gap-3 rounded-xl border border-slate-700 bg-slate-900 p-3"
        >

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk(e);
              }
            }}
            placeholder="Ask a question about your textbook..."
            rows={1}
            className="max-h-32 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500"
          />

          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="rounded-lg bg-indigo-600 p-3 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={18} />
          </button>

        </form>

        <p className="mt-3 text-center text-xs text-slate-500">
          RAGTutorX generates answers using your uploaded study material.
        </p>

      </footer>

    </div>
  );
}

export default Tutor;
