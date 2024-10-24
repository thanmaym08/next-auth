import bcrypt from 'bcryptjs';

// Hash password
export async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
}
