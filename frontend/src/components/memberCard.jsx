"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function MemberCard({ entry, isAdmin, onUpdate, projectId }) {
    if (!entry || !entry.member) return null;
    const [editing, setEditing] = useState(false);
    const [position, setPosition] = useState(entry.position);

    const handleUpdate = async () => {
        await api.patch(`/api/projects/${projectId}/memberPosition`, {
            entryId: entry._id,
            position
        });
        setEditing(false);
        onUpdate();
    };

    return (
        <div style={{ padding: "0.75rem", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "6px", marginBottom: "0.5rem" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#f5e642"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#f5e642", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#111", fontSize: "0.875rem", flexShrink: 0 }}>
                        {entry.member?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p style={{ fontWeight: "600", color: "#e2e8f0", fontSize: "0.875rem" }}>{entry.member?.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "#555" }}>{entry.member?.email}</p>
                    </div>
                </div>
                {isAdmin && (
                    <button onClick={() => setEditing(!editing)} style={{ padding: "0.25rem 0.5rem", backgroundColor: "transparent", border: "1px solid #2a2a2a", borderRadius: "4px", color: "#666", fontSize: "0.75rem" }}>
                        {editing ? "Cancel" : "Edit"}
                    </button>
                )}
            </div>
            {editing ? (
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                    <input value={position} onChange={e => setPosition(e.target.value)} style={{ flex: 1, padding: "0.4rem", backgroundColor: "#111", border: "1px solid #2a2a2a", borderRadius: "4px", color: "#e2e8f0", fontSize: "0.8rem" }} />
                    <button onClick={handleUpdate} style={{ padding: "0.4rem 0.75rem", backgroundColor: "#f5e642", color: "#111", border: "none", borderRadius: "4px", fontWeight: "700", fontSize: "0.8rem" }}>Save</button>
                </div>
            ) : (
                <span style={{ marginTop: "0.4rem", display: "inline-block", backgroundColor: "#2a2a2a", color: "#f5e642", padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem" }}>{entry.position}</span>
            )}
        </div>
    );
}