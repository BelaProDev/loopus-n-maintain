import { SHA256 } from 'crypto-js';

export const validateCredentials = async (email: string, password: string) => {
  const user = await authQueries.validateUser(email, password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  return user;
};

export const hashPassword = (password: string): string => {
  return SHA256(password).toString().toLowerCase();
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