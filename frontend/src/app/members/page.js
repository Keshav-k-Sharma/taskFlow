"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MemberGroup from "@/components/MemberGroup";
import Link from "next/link";
import api from "@/lib/api";

export default function MembersPage() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        api.get("/api/members").then((res) => setMembers(res.data));
    }, []);

    const grouped = members.reduce((acc, member) => {
        if (!acc[member.role]) acc[member.role] = [];
        acc[member.role].push(member);
        return acc;
    }, {});

    return (
        <div>
            <Navbar />
            <div style={{ padding: "2rem", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1 style={{ color: "#1e293b" }}>Members</h1>
                    <Link href="/members/add" style={{ padding: "0.75rem 1.5rem", backgroundColor: "#1e293b", color: "white", borderRadius: "4px", textDecoration: "none" }}>+ Add Member</Link>
                </div>
                {Object.entries(grouped).map(([role, members]) => (
                    <MemberGroup key={role} role={role} members={members} />
                ))}
            </div>
        </div>
    );
}