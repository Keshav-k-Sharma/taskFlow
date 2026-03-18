"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import api from "@/lib/api";

export default function MembersPage() {
    const [members, setMembers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchMembers = async () => {
        try {
            const res = await api.get("/api/members");
            setMembers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setIsAdmin(user?.role === "admin");
        fetchMembers();
    }, []);

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a" }}>
            <Navbar />
            <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <div>
                        <h1 style={{ color: "#e2e8f0" }}>Members</h1>
                        <p style={{ color: "#555", fontSize: "0.875rem" }}>{members.length} total members</p>
                    </div>
                </div>
                <div style={{ backgroundColor: "#111", padding: "1.5rem", borderRadius: "8px", border: "1px solid #2a2a2a" }}>
                    {members.map((member) => (
                        <div key={member._id} style={{ padding: "0.75rem", backgroundColor: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "6px", marginBottom: "0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "#f5e642"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#f5e642", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#111", fontSize: "0.875rem", flexShrink: 0 }}>
                                    {member.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ fontWeight: "600", color: "#e2e8f0", fontSize: "0.875rem" }}>{member.name}</p>
                                    <p style={{ fontSize: "0.75rem", color: "#555" }}>{member.email}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {members.length === 0 && (
                        <p style={{ color: "#555", textAlign: "center", padding: "2rem" }}>No members yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}