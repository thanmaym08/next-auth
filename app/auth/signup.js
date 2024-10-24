import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('doctor'); // Default role is doctor
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, role }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            router.push('/auth/signin'); // Redirect to sign-in page after successful signup
        } else {
            const data = await response.json();
            alert(data.message || 'Error signing up');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
            </select>
            <button type="submit">Sign Up</button>
        </form>
    );
}
