"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import TaskList from "@/components/taskList";
import Link from "next/link";
import api from "@/lib/api";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [filter, setFilter] = useState("all");

    const fetchTasks = async () => {
        const res = await api.get("/api/tasks");
        setTasks(res.data);
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setIsAdmin(user?.role === "admin");
        fetchTasks();
    }, []);

    const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);

    const btnStyle = (active) => ({
        padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: "500",
        backgroundColor: active ? "#f5e642" : "#111", color: active ? "#111" : "#666",
        border: active ? "none" : "1px solid #2a2a2a"
    });

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a" }}>
            <Navbar />
            <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <div>
                        <h1 style={{ color: "#e2e8f0" }}>Tasks</h1>
                        <p style={{ color: "#555", fontSize: "0.875rem" }}>{tasks.length} total tasks</p>
                    </div>
                    {isAdmin && (
                        <Link href="/tasks/add" style={{ padding: "0.75rem 1.5rem", backgroundColor: "#f5e642", color: "#111", borderRadius: "6px", fontWeight: "700", fontSize: "0.875rem" }}>
                            + Add Task
                        </Link>
                    )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                    <button style={btnStyle(filter === "all")} onClick={() => setFilter("all")}>All</button>
                    <button style={btnStyle(filter === "pending")} onClick={() => setFilter("pending")}>Pending</button>
                    <button style={btnStyle(filter === "completed")} onClick={() => setFilter("completed")}>Completed</button>
                </div>
                <TaskList tasks={filtered} onStatusChange={fetchTasks} />
            </div>
        </div>
    );
}