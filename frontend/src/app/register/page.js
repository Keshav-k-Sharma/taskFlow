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

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f1f5f9" }}>
            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" }}>
                <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#1e293b" }}>Create Account</h1>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #e2e8f0", borderRadius: "4px" }} />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #e2e8f0", borderRadius: "4px" }} />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #e2e8f0", borderRadius: "4px" }} />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" style={{ width: "100%", padding: "0.75rem", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}>Register</button>
                </form>
                <p style={{ textAlign: "center", marginTop: "1rem" }}>
                    Already have an account? <Link href="/login" style={{ color: "#1e293b", fontWeight: "bold" }}>Login</Link>
                </p>
            </div>
        </div>
    );
}