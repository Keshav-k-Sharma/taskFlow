"use client";
import api from "@/lib/api";

export default function TaskCard({ task, onStatusChange }) {
    const handleToggle = async () => {
        const newStatus = task.status === "pending" ? "completed" : "pending";
        await api.patch(`/api/tasks/${task._id}/status`, { status: newStatus });
        onStatusChange();
    };

    const isCompleted = task.status === "completed";

    return (
        <div style={{ padding: "1rem", backgroundColor: "#0a0a0a", borderRadius: "6px", border: `1px solid ${isCompleted ? "#1a3a1a" : "#2a2a2a"}`, marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                <h3 style={{ fontWeight: "600", color: isCompleted ? "#555" : "#e2e8f0", textDecoration: isCompleted ? "line-through" : "none", fontSize: "0.875rem" }}>{task.title}</h3>
                <span style={{ backgroundColor: isCompleted ? "#0a2a0a" : "#2a1f00", color: isCompleted ? "#4ade80" : "#f5e642", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: "600", flexShrink: 0, marginLeft: "0.5rem" }}>
                    {task.status}
                </span>
            </div>
            <p style={{ color: "#555", fontSize: "0.8rem", marginBottom: "0.75rem" }}>{task.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                    {task.assignedTo && <span style={{ fontSize: "0.75rem", color: "#666" }}>👤 {task.assignedTo.name}</span>}
                    {task.deadline && <span style={{ fontSize: "0.75rem", color: "#666" }}>📅 {new Date(task.deadline).toLocaleDateString()}</span>}
                    {task.project && <span style={{ fontSize: "0.75rem", color: "#f5e642" }}>📁 {task.project.name}</span>}
                </div>
                <button onClick={handleToggle} style={{ padding: "0.3rem 0.75rem", backgroundColor: "transparent", color: isCompleted ? "#4ade80" : "#f5e642", border: `1px solid ${isCompleted ? "#4ade80" : "#f5e642"}`, borderRadius: "5px", fontSize: "0.75rem", fontWeight: "500" }}>
                    {isCompleted ? "Mark Pending" : "Mark Complete"}
                </button>
            </div>
        </div>
    );
}