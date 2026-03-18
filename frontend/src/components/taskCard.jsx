import api from "@/lib/api";

export default function TaskCard({ task, onStatusChange }) {
    const handleToggle = async () => {
        const newStatus = task.status === "pending" ? "completed" : "pending";
        await api.patch(`/api/tasks/${task._id}/status`, { status: newStatus });
        onStatusChange();
    };

    return (
        <div style={{ padding: "1rem", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>{task.title}</h3>
                <span style={{ backgroundColor: task.status === "completed" ? "#22c55e" : "#f59e0b", color: "white", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.875rem" }}>
                    {task.status}
                </span>
            </div>
            <p style={{ color: "#64748b" }}>{task.description}</p>
            {task.deadline && <p style={{ fontSize: "0.875rem" }}>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>}
            {task.assignedTo && <p style={{ fontSize: "0.875rem" }}>Assigned to: {task.assignedTo.name}</p>}
            <button onClick={handleToggle} style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Mark as {task.status === "pending" ? "Completed" : "Pending"}
            </button>
        </div>
    );
}