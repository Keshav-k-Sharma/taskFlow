"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

export default function AddMemberPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/members", { name, email, role });
            router.push("/members");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to add member");
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: "2rem", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
                <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", maxWidth: "500px", margin: "0 auto" }}>
                    <h1 style={{ color: "#1e293b" }}>Add Member</h1>
                    {error && <p style={{ color: "red" }}>{error}</p>}
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
                            <label>Role / Position</label>
                            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Developer, Designer, Tech Lead" style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #e2e8f0", borderRadius: "4px" }} />
                        </div>
                        <button type="submit" style={{ width: "100%", padding: "0.75rem", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Add Member</button>
                    </form>
                </div>
            </div>
        </div>
    );
}