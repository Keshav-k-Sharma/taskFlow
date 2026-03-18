"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <nav>
            <Link href="/dashboard">TaskFlow</Link>
            
            <div>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/members">Members</Link>
                <Link href="/tasks">Tasks</Link>
            </div>

            <div>
                {user && <span>{user.name} ({user.role})</span>}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}