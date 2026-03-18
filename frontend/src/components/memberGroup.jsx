import MemberCard from "./memberCard";

export default function MemberGroup({ projectName, members, isAdmin, onUpdate ,projectId}) {
    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <h3 style={{ color: "#f5e642", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>{projectName}</h3>
                <span style={{ backgroundColor: "#2a2a2a", color: "#666", padding: "0.1rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem" }}>{members.length}</span>
            </div>
            {members.map((member) => (
                <MemberCard key={member._id} entry={member} isAdmin={isAdmin} onUpdate={onUpdate} projectId={projectId}/>
            ))}
        </div>
    );
}