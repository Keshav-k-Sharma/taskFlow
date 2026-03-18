"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MemberGroup from "@/components/MemberGroup";
import TaskList from "@/components/TaskList";
import api from "@/lib/api";

export default function DashboardPage() {
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);

    const fetchData = async () => {
        const [membersRes, tasksRes] = await Promise.all([
            api.get("/api/members"),
            api.get("/api/tasks")
        ]);
        setMembers(membersRes.data);
        setTasks(tasksRes.data);
    };

    useEffect(() => { fetchData(); }, []);

    
    const grouped = members.reduce((acc, member) => {
        if (!acc[member.role]) acc[member.role] = [];
        acc[member.role].push(member);
        return acc;
    }, {});

    return (
        <div>
            <Navbar />
            <div style={{ padding: "2rem", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
                <h1 style={{ color: "#1e293b" }}>Dashboard</h1>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div>
                        <h2>Members by Role</h2>
                        {Object.entries(grouped).map(([role, members]) => (
                            <MemberGroup key={role} role={role} members={members} />
                        ))}
                    </div>
                    <div>
                        <h2>All Tasks</h2>
                        <TaskList tasks={tasks} onStatusChange={fetchData} />
                    </div>
                </div>
            </div>
        </div>
    );
}