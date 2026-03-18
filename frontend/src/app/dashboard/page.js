"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import MemberGroup from "@/components/memberGroup";
import TaskList from "@/components/taskList";
import api from "@/lib/api";

export default function DashboardPage() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchData = async () => {
    try {
        const [projectsRes, tasksRes] = await Promise.all([
            api.get("/api/projects"),
            api.get("/api/tasks")
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
    } catch (error) {
        console.error("Fetch error:", error.response?.data);
    }
};

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
        setIsAdmin(storedUser?.role === "admin");
        fetchData();
    }, []);

    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = tasks.filter(t => t.status === "pending").length;
    const totalMembers = [...new Set(projects.flatMap(p => p.members.map(m => m.member?._id?.toString())))].filter(Boolean).length;

    const cardStyle = { backgroundColor: "#111", padding: "1.25rem", borderRadius: "8px", border: "1px solid #2a2a2a" };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a" }}>
            <Navbar />
            <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
                <h1 style={{ color: "#e2e8f0", marginBottom: "0.25rem" }}>Dashboard</h1>
                <p style={{ color: "#555", marginBottom: "2rem", fontSize: "0.875rem" }}>Welcome back, {user?.name}</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
                    {[
                        { label: "Total Members", value: totalMembers, color: "#f5e642" },
                        { label: "Pending Tasks", value: pending, color: "#f5e642" },
                        { label: "Completed Tasks", value: completed, color: "#4ade80" },
                    ].map(({ label, value, color }) => (
                        <div key={label} style={cardStyle}>
                            <p style={{ color: "#555", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{label}</p>
                            <p style={{ color, fontSize: "2rem", fontWeight: "700" }}>{value}</p>
                        </div>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div style={cardStyle}>
                        <h2 style={{ color: "#e2e8f0", marginBottom: "1.5rem", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Members by Project</h2>
                        {projects.map((project) => (
                            <MemberGroup 
                                key={project._id} 
                                projectName={project.name} 
                                members={project.members.filter(m => m && m.member)} 
                                isAdmin={isAdmin} 
                                onUpdate={fetchData} 
                                projectId={project._id}
                            />
                        ))}
                        {projects.length === 0 && <p style={{ color: "#555", textAlign: "center", padding: "2rem", border: "1px dashed #2a2a2a", borderRadius: "6px" }}>No projects yet.</p>}
                    </div>
                    <div style={cardStyle}>
                        <h2 style={{ color: "#e2e8f0", marginBottom: "1.5rem", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>All Tasks</h2>
                        <TaskList tasks={tasks} onStatusChange={fetchData} />
                    </div>
                </div>
            </div>
        </div>
    );
}