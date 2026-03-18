"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("member");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/auth/register", { name, email, password, role });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            router.push("/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        }
    };

    const inputStyle = { width: "100%", padding: "0.75rem", backgroundColor: "#111", border: "1px solid #2a2a2a", borderRadius: "6px", color: "#e2e8f0", fontSize: "0.95rem", outline: "none" };
    const labelStyle = { display: "block", marginBottom: "0.4rem", color: "#666", fontSize: "0.875rem" };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a" }}>
            <div style={{ backgroundColor: "#111", padding: "2.5rem", borderRadius: "12px", border: "1px solid #2a2a2a", width: "100%", maxWidth: "420px" }}>
                <h1 style={{ textAlign: "center", marginBottom: "0.5rem", color: "#e2e8f0", fontSize: "1.75rem", fontWeight: "700" }}>
                    Task<span style={{ color: "#f5e642" }}>Flow</span>
                </h1>
                <p style={{ textAlign: "center", color: "#555", marginBottom: "2rem", fontSize: "0.875rem" }}>Create your account</p>
                {error && <p style={{ color: "#ef4444", textAlign: "center", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label style={labelStyle}>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Your name" />
                    </div>
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label style={labelStyle}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" />
                    </div>
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label style={labelStyle}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={labelStyle}>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" style={{ width: "100%", padding: "0.75rem", backgroundColor: "#f5e642", color: "#111", border: "none", borderRadius: "6px", fontWeight: "700", fontSize: "1rem" }}>
                        Create Account
                    </button>
                </form>
                <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#555", fontSize: "0.875rem" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "#f5e642", fontWeight: "600" }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}