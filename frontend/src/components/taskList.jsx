import TaskCard from "./TaskCard";

export default function TaskList({ tasks, onStatusChange }) {
    return (
        <div>
            {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onStatusChange={onStatusChange} />
            ))}
        </div>
    );
}