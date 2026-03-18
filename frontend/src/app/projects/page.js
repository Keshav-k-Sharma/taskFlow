"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import api from "@/lib/api";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [members, setMembers] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedMember, setSelectedMember] = useState("");

    const fetchData = async () => {
        const [projectsRes, membersRes] = await Promise.all([
            api.get("/api/projects"),
            api.get("/api/members")
        ]);
        setProjects(projectsRes.data);
        setMembers(membersRes.data);
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setIsAdmin(user?.role === "admin");
        fetchData();
    }, []);

    const handleAddMember = async (projectId) => {
        if (!selectedMember) return;
        await api.patch(`/api/projects/${projectId}/members`, { memberId: selectedMember });
        setSelectedProject(null);
        setSelectedMember("");
        fetchData();
    };

    const handleStatusChange = async (projectId, status) => {
        await api.patch(`/api/projects/${projectId}/status`, { status });
        fetchData();
    };

    const cardStyle = { backgroundColor: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "1.5rem", marginBottom: "1rem" };
    const inputStyle = { padding: "0.5rem", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "6px", color: "#e2e8f0", fontSize: "0.875rem" };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a" }}>
            <Navbar />
            <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <div>
                        <h1 style={{ color: "#e2e8f0" }}>Projects</h1>
                        <p style={{ color: "#555", fontSize: "0.875rem" }}>{projects.length} total projects</p>
                    </div>
                    {isAdmin && (
                        <Link href="/projects/add" style={{ padding: "0.75rem 1.5rem", backgroundColor: "#f5e642", color: "#111", borderRadius: "6px", fontWeight: "700", fontSize: "0.875rem" }}>
                            + New Project
                        </Link>
                    )}
                </div>

                {projects.map((project) => (
                    <div key={project._id} style={cardStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                            <div>
                                <h2 style={{ color: "#e2e8f0", fontSize: "1.1rem", marginBottom: "0.25rem" }}>{project.name}</h2>
                                <p style={{ color: "#555", fontSize: "0.875rem" }}>{project.description}</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                {project.deadline && <span style={{ fontSize: "0.75rem", color: "#666" }}>📅 {new Date(project.deadline).toLocaleDateString()}</span>}
                                <span style={{ backgroundColor: project.status === "completed" ? "#0a2a0a" : "#2a1f00", color: project.status === "completed" ? "#4ade80" : "#f5e642", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "600" }}>
                                    {project.status}
                                </span>
                                {isAdmin && (
                                    <button onClick={() => handleStatusChange(project._id, project.status === "active" ? "completed" : "active")}
                                        style={{ padding: "0.3rem 0.75rem", backgroundColor: "transparent", border: "1px solid #2a2a2a", borderRadius: "5px", color: "#666", fontSize: "0.75rem" }}>
                                        {project.status === "active" ? "Mark Complete" : "Reopen"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <p style={{ fontSize: "0.75rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.5rem" }}>Members</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                {project.members.map((member) => (
                                    <span key={member._id} style={{ backgroundColor: "#2a2a2a", color: "#e2e8f0", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem" }}>
                                        {member.name} <span style={{ color: "#f5e642" }}>· {member.position}</span>
                                    </span>
                                ))}
                                {project.members.length === 0 && <span style={{ color: "#555", fontSize: "0.8rem" }}>No members yet</span>}
                            </div>
                        </div>

                        {isAdmin && (
                            selectedProject === project._id ? (
                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                    <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} style={inputStyle}>
                                        <option value="">Select member</option>
                                        {members.filter(m => !project.members.find(pm => pm._id === m._id)).map(m => (
                                            <option key={m._id} value={m._id}>{m.name} — {m.position}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => handleAddMember(project._id)} style={{ padding: "0.5rem 1rem", backgroundColor: "#f5e642", color: "#111", border: "none", borderRadius: "6px", fontWeight: "700", fontSize: "0.8rem" }}>Add</button>
                                    <button onClick={() => setSelectedProject(null)} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", border: "1px solid #2a2a2a", borderRadius: "6px", color: "#666", fontSize: "0.8rem" }}>Cancel</button>
                                </div>
                            ) : (
                                <button onClick={() => setSelectedProject(project._id)} style={{ padding: "0.4rem 0.75rem", backgroundColor: "transparent", border: "1px solid #f5e642", borderRadius: "5px", color: "#f5e642", fontSize: "0.8rem" }}>
                                    + Add Member
                                </button>
                            )
                        )}
                    </div>
                ))}
                {projects.length === 0 && <p style={{ color: "#555", textAlign: "center", padding: "3rem", border: "1px dashed #2a2a2a", borderRadius: "8px" }}>No projects yet.</p>}
            </div>
        </div>
    );
}