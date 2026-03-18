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
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", backgroundColor: "#111111", borderBottom: "1px solid #2a2a2a", position: "sticky", top: 0, zIndex: 100 }}>
            <Link href="/dashboard" style={{ fontSize: "1.3rem", fontWeight: "700", color: "#f5e642", letterSpacing: "-0.5px" }}>
                Task<span style={{ color: "#e2e8f0" }}>Flow</span>
            </Link>
            <div style={{ display: "flex", gap: "2rem" }}>
                {[{ href: "/dashboard", label: "Dashboard" }, { href: "/projects", label: "Projects" }, { href: "/members", label: "Members" }, { href: "/tasks", label: "Tasks" }].map(({ href, label }) => (
                    <Link key={href} href={href} style={{ color: "#666", fontSize: "0.875rem", fontWeight: "500" }}
                        onMouseEnter={e => e.target.style.color = "#f5e642"}
                        onMouseLeave={e => e.target.style.color = "#666"}>
                        {label}
                    </Link>
                ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {user && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: user.role === "admin" ? "#f5e642" : "#4ade80", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#111", fontSize: "0.875rem" }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#e2e8f0" }}>{user.name}</p>
                            <p style={{ fontSize: "0.75rem", color: user.role === "admin" ? "#f5e642" : "#4ade80", textTransform: "uppercase", letterSpacing: "0.5px" }}>{user.role}</p>
                        </div>
                    </div>
                )}
                <button onClick={handleLogout} style={{ padding: "0.4rem 1rem", backgroundColor: "transparent", color: "#666", border: "1px solid #2a2a2a", borderRadius: "6px", fontSize: "0.875rem" }}
                    onMouseEnter={e => { e.target.style.backgroundColor = "#ef4444"; e.target.style.color = "white"; e.target.style.borderColor = "#ef4444"; }}
                    onMouseLeave={e => { e.target.style.backgroundColor = "transparent"; e.target.style.color = "#666"; e.target.style.borderColor = "#2a2a2a"; }}>
                    Logout
                </button>
            </div>
        </nav>
    );
}