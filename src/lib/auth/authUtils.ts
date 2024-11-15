import { SHA256 } from 'crypto-js';
import { authQueries } from '../fauna/authQueries';

export const validateCredentials = async (email: string, password: string) => {
  console.log('Attempting to validate credentials for:', email);
  const hashedPassword = hashPassword(password);
  console.log('Client hashed password:', hashedPassword);
  const user = await authQueries.validateUser(email, hashedPassword);
  
  if (!user) {
    console.log('No user found with provided credentials');
    throw new Error('Invalid credentials');
  }

  return user;
};

export const hashPassword = (password: string): string => {
  const hash = SHA256(password).toString().toLowerCase();
  console.log('Client generated hash:', hash);
  return hash;
};

export const createSession = (email: string) => {
  sessionStorage.setItem('craft_coordination_session', JSON.stringify({
    email,
    timestamp: Date.now()
  }));
};

export const clearSession = () => {
  sessionStorage.removeItem('craft_coordination_session');
};

export const getSession = () => {
  const session = sessionStorage.getItem('craft_coordination_session');
  if (!session) return null;
  
  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
};