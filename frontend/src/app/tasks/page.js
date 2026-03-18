"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import TaskList from "@/components/TaskList";
import Link from "next/link";
import api from "@/lib/api";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        const res = await api.get("/api/tasks");
        setTasks(res.data);
    };

    useEffect(() => { fetchTasks(); }, []);

    return (
        <div>
            <Navbar />
            <div style={{ padding: "2rem", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1 style={{ color: "#1e293b" }}>Tasks</h1>
                    <Link href="/tasks/add" style={{ padding: "0.75rem 1.5rem", backgroundColor: "#1e293b", color: "white", borderRadius: "4px", textDecoration: "none" }}>+ Add Task</Link>
                </div>
                <TaskList tasks={tasks} onStatusChange={fetchTasks} />
            </div>
        </div>
    );
}