import { hashPassword } from '../../../lib/auth'; // Helper function for hashing passwords
import User from '../../../models/User'; // Import your MongoDB User model

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(422).json({ message: 'User already exists!' });
    }

    // Hash the password before saving it
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = new User({
        email,
        password: hashedPassword,
        role, // Either 'doctor' or 'patient'
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
}
