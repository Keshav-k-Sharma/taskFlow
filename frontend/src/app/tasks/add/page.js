"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

export default function AddTaskPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [deadline, setDeadline] = useState("");
    const [project, setProject] = useState("");
    const [members, setMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role !== "admin") router.push("/dashboard");
        Promise.all([api.get("/api/members"), api.get("/api/projects")]).then(([membersRes, projectsRes]) => {
            setMembers(membersRes.data);
            setProjects(projectsRes.data);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/tasks", { title, description, assignedTo, deadline, project: project || undefined });
            router.push("/tasks");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create task");
        }
    };

    const inputStyle = { width: "100%", padding: "0.75rem", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "6px", color: "#e2e8f0", fontSize: "0.95rem" };
    const labelStyle = { display: "block", marginBottom: "0.4rem", color: "#666", fontSize: "0.875rem" };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a" }}>
            <Navbar />
            <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
                <h1 style={{ color: "#e2e8f0", marginBottom: "0.25rem" }}>Create Task</h1>
                <p style={{ color: "#555", marginBottom: "2rem", fontSize: "0.875rem" }}>Assign a task to a team member</p>
                <div style={{ backgroundColor: "#111", padding: "2rem", borderRadius: "8px", border: "1px solid #2a2a2a" }}>
                    {error && <p style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} placeholder="Task title" />
                        </div>
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Task description" />
                        </div>
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Assign To</label>
                            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                                <option value="">Select a member</option>
                                {members.map((member) => (
                                    <option key={member._id} value={member._id}>{member.name} — {member.position}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Project (optional)</label>
                            <select value={project} onChange={(e) => setProject(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                                <option value="">No project</option>
                                {projects.map((p) => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={labelStyle}>Deadline</label>
                            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={inputStyle} />
                        </div>
                        <button type="submit" style={{ width: "100%", padding: "0.75rem", backgroundColor: "#f5e642", color: "#111", border: "none", borderRadius: "6px", fontWeight: "700" }}>
                            Create Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}