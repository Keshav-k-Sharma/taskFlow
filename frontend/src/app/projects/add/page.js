"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import api from "@/lib/api";

export default function AddProjectPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role !== "admin") router.push("/dashboard");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/projects", { name, description, deadline });
            router.push("/projects");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create project");
        }
    };

    const inputStyle = { width: "100%", padding: "0.75rem", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "6px", color: "#e2e8f0", fontSize: "0.95rem" };
    const labelStyle = { display: "block", marginBottom: "0.4rem", color: "#666", fontSize: "0.875rem" };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a" }}>
            <Navbar />
            <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
                <h1 style={{ color: "#e2e8f0", marginBottom: "0.25rem" }}>New Project</h1>
                <p style={{ color: "#555", marginBottom: "2rem", fontSize: "0.875rem" }}>Create a new project</p>
                <div style={{ backgroundColor: "#111", padding: "2rem", borderRadius: "8px", border: "1px solid #2a2a2a" }}>
                    {error && <p style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Project Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="e.g. Website Redesign" />
                        </div>
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="What is this project about?" />
                        </div>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={labelStyle}>Deadline</label>
                            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={inputStyle} />
                        </div>
                        <button type="submit" style={{ width: "100%", padding: "0.75rem", backgroundColor: "#f5e642", color: "#111", border: "none", borderRadius: "6px", fontWeight: "700" }}>
                            Create Project
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}