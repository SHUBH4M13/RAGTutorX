
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    BookOpen,
    Upload,
    FileText,
    MessageSquare,
    LayoutDashboard,
    Settings,
    LogOut,
    Plus,
    Search,
    Loader2,
    CheckCircle,
} from "lucide-react";
import api from "../services/api";

function Dashboard() {

    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a PDF file first.");
            return;
        }

        if (selectedFile.type !== "application/pdf") {
            setError("Only PDF files are supported.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("user_id", "user_2");

        try {
            setUploading(true);
            setError("");
            setSuccess("");

            const response = await api.post(
                "/api/documents/upload",
                formData
            );

            const uploadedDocument = {
                id: response.data.document_id,
                name: selectedFile.name,
                pages: response.data.pages,
                chunks: response.data.chunks,
                vectors: response.data.vectors,
            };

            setDocuments((previous) => [
                uploadedDocument,
                ...previous,
            ]);

            setSelectedFile(null);
            setSuccess("Document uploaded successfully!");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Document upload failed. Please try again."
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-white">

            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900 p-6 md:flex">

                <div className="mb-12 flex items-center gap-3">
                    <BookOpen className="text-indigo-400" size={28} />
                    <span className="text-xl font-bold">RAGTutorX</span>
                </div>

                <nav className="flex-1 space-y-3">

                    <button className="flex w-full items-center gap-3 rounded-lg bg-indigo-600/15 px-4 py-3 text-indigo-400">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>

                    <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
                        <FileText size={20} />
                        My Documents
                    </button>

                    <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
                        <MessageSquare size={20} />
                        AI Tutor
                    </button>

                </nav>

                <div className="space-y-3 border-t border-slate-800 pt-5">
                    <button className="flex items-center gap-3 text-slate-400">
                        <Settings size={20} />
                        Settings
                    </button>

                    <button className="flex items-center gap-3 text-slate-400">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="min-w-0 flex-1 p-6 md:p-10">

                {/* Header */}
                <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="mt-2 text-slate-400">
                            Manage your study materials and start learning.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold">
                            S
                        </div>
                    </div>
                </header>

                {/* Welcome section */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold">
                        Welcome to your learning space
                    </h2>
                    <p className="mt-2 text-slate-400">
                        Upload a textbook chapter to start asking questions.
                    </p>
                </section>

                {/* Stats */}
                <section className="mb-10 grid gap-5 sm:grid-cols-3">

                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                        <FileText className="mb-4 text-indigo-400" />
                        <p className="text-2xl font-bold">{documents.length}</p>
                        <p className="mt-1 text-sm text-slate-400">
                            Uploaded Documents
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                        <BookOpen className="mb-4 text-emerald-400" />
                        <p className="text-2xl font-bold">
                            {documents.reduce((sum, doc) => sum + doc.pages, 0)}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                            Pages Processed
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                        <MessageSquare className="mb-4 text-purple-400" />
                        <p className="text-2xl font-bold">AI</p>
                        <p className="mt-1 text-sm text-slate-400">
                            Learning Assistant
                        </p>
                    </div>

                </section>

                {/* Upload section */}
                <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">
                            Upload Study Material
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Upload your PDF textbook or chapter.
                        </p>
                    </div>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 px-6 py-12 text-center transition hover:border-indigo-500">

                        <Upload size={36} className="mb-4 text-indigo-400" />

                        <p className="font-medium">
                            {selectedFile
                                ? selectedFile.name
                                : "Click to select a PDF"}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            PDF files only · Maximum 20 MB
                        </p>

                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                                setSelectedFile(e.target.files?.[0] || null);
                                setError("");
                                setSuccess("");
                            }}
                        />
                    </label>

                    {error && (
                        <p className="mt-4 text-sm text-red-400">{error}</p>
                    )}

                    {success && (
                        <p className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
                            <CheckCircle size={16} />
                            {success}
                        </p>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="mt-5 flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Processing PDF...
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                Upload Document
                            </>
                        )}
                    </button>

                </section>

                {/* Documents */}
                <section>

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold">My Documents</h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Your uploaded study materials.
                            </p>
                        </div>

                        <Search className="text-slate-500" />
                    </div>

                    {documents.length === 0 ? (
                        <div className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-12 text-center">
                            <FileText className="mx-auto mb-4 text-slate-600" size={36} />
                            <p className="font-medium">No documents yet</p>
                            <p className="mt-2 text-sm text-slate-500">
                                Upload your first PDF to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                                >
                                    <FileText className="mb-4 text-indigo-400" size={28} />

                                    <h3 className="truncate font-semibold">{doc.name}</h3>

                                    <p className="mt-2 text-sm text-slate-400">
                                        {doc.pages} pages · {doc.chunks} chunks
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {doc.vectors} vectors indexed
                                    </p>

                                    {/* Open AI Tutor */}
                                    <button
                                        onClick={() => navigate(`/tutor/${doc.id}`)}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium hover:bg-indigo-500"
                                    >
                                        <MessageSquare size={16} />
                                        Open AI Tutor
                                    </button>

                                </div>
                            ))}
                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default Dashboard;
