"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MemberCard from "@/components/MemberCard";
import Link from "next/link";
import api from "@/lib/api";

export default function MembersPage() {
    const [members, setMembers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchMembers = async () => {
        const res = await api.get("/api/members");
        setMembers(res.data);
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
                    {isAdmin && (
                        <Link href="/members/add" style={{ padding: "0.75rem 1.5rem", backgroundColor: "#f5e642", color: "#111", borderRadius: "6px", fontWeight: "700", fontSize: "0.875rem" }}>
                            + Add Member
                        </Link>
                    )}
                </div>
                <div style={{ backgroundColor: "#111", padding: "1.5rem", borderRadius: "8px", border: "1px solid #2a2a2a" }}>
                    {members.map((member) => (
                        <MemberCard key={member._id} member={member} isAdmin={isAdmin} onUpdate={fetchMembers} />
                    ))}
                    {members.length === 0 && <p style={{ color: "#555", textAlign: "center", padding: "2rem" }}>No members yet.</p>}
                </div>
            </div>
        </div>
    );
}