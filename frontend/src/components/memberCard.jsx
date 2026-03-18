export default function MemberCard({ member }) {
    return (
        <div style={{ padding: "1rem", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "0.5rem" }}>
            <h3 style={{ margin: 0 }}>{member.name}</h3>
            <p style={{ margin: "0.25rem 0", color: "#64748b" }}>{member.email}</p>
            <span style={{ backgroundColor: "#e2e8f0", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.875rem" }}>{member.role}</span>
        </div>
    );
}