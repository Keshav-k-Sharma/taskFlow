"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            router.push("/login");
        } else {
            setUser(storedUser);
        }
    }, []);

    const isAdmin = user?.role === "admin";

    return { user, isAdmin };
}