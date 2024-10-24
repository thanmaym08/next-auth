import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../lib/auth'; // Helper function to verify password
import User from '../../../models/User'; // User model (MongoDB)

export default NextAuth({
    session: {
        jwt: true, // Use JSON Web Tokens for session management
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'doctor@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Check if the user exists in the database
                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error('No user found with the entered email.');
                }

                // Check if the password is valid
                const isValidPassword = await verifyPassword(credentials.password, user.password);

                if (!isValidPassword) {
                    throw new Error('Invalid credentials.');
                }

                // If the user exists and password is valid, return the user data
                return { email: user.email, role: user.role };
            }
        })
    ],
    callbacks: {
        async jwt(token, user) {
            // Include user role in the JWT token
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session(session, token) {
            // Add the user role to the session object
            session.user.role = token.role;
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin', // Customize the sign-in page
    }
});
