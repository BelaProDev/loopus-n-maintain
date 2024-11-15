import { SHA256 } from 'crypto-js';

export const hashPassword = (password: string): string => {
  // Ensure consistent encoding by using lowercase hex output
  return SHA256(password).toString().toLowerCase();
};

export const validateCredentials = async (email: string, password: string) => {
  const users = await settingsQueries.getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = hashPassword(password);
  if (user.password !== hashedPassword) {
    throw new Error('Invalid password');
  }

  return user;
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