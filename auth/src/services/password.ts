import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string): Promise<string> {
        const salt = randomBytes(16).toString('hex');
        const hash = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${hash.toString('hex')}.${salt}`;
    }
    static async compare(password: string, hashedPassword: string): Promise<boolean> {
        const [hash, salt] = hashedPassword.split('.');
        const hashed = (await scryptAsync(password, salt, 64)) as Buffer;
        return hash === hashed.toString('hex');
    }
}