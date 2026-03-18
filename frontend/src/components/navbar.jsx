"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "#1e293b", color: "white" }}>
            <Link href="/dashboard" style={{ color: "white", fontWeight: "bold", fontSize: "1.5rem", textDecoration: "none" }}>TaskFlow</Link>
            <div style={{ display: "flex", gap: "1.5rem" }}>
                <Link href="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
                <Link href="/members" style={{ color: "white", textDecoration: "none" }}>Members</Link>
                <Link href="/tasks" style={{ color: "white", textDecoration: "none" }}>Tasks</Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {user && <span>{user.name} ({user.role})</span>}
                <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Logout</button>
            </div>
        </nav>
    );
}