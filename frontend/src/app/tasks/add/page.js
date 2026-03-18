"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

export default function AddTaskPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [deadline, setDeadline] = useState("");
    const [members, setMembers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/api/members").then((res) => setMembers(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/tasks", { title, description, assignedTo, deadline });
            router.push("/tasks");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create task");
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: "2rem", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
                <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", maxWidth: "500px", margin: "0 auto" }}>
                    <h1 style={{ color: "#1e293b" }}>Add Task</h1>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #e2e8f0", borderRadius: "4px" }} />
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #e2e8f0", borderRadius: "4px" }} />
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Assign To</label>
                            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                                <option value="">Select a member</option>
                                {members.map((member) => (
                                    <option key={member._id} value={member._id}>{member.name} - {member.role}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Deadline</label>
                            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #e2e8f0", borderRadius: "4px" }} />
                        </div>
                        <button type="submit" style={{ width: "100%", padding: "0.75rem", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Create Task</button>
                    </form>
                </div>
            </div>
        </div>
    );
}