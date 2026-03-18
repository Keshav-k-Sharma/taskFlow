import TaskCard from "./TaskCard";

export default function TaskList({ tasks, onStatusChange }) {
    if (tasks.length === 0) {
        return <p style={{ color: "#555", textAlign: "center", padding: "2rem", border: "1px dashed #2a2a2a", borderRadius: "6px" }}>No tasks found.</p>;
    }
    return (
        <div>
            {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onStatusChange={onStatusChange} />
            ))}
        </div>
    );
}