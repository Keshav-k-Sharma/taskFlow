import MemberCard from "./MemberCard";

export default function MemberGroup({ role, members }) {
    return (
        <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ backgroundColor: "#1e293b", color: "white", padding: "0.5rem 1rem", borderRadius: "4px" }}>{role}</h2>
            {members.map((member) => (
                <MemberCard key={member._id} member={member} />
            ))}
        </div>
    );
}   