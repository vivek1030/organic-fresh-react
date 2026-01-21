import type { User } from '../../../types/auth';

const SIMULATED_DELAY = 1000;

export const authService = {
  signIn: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password.length >= 6) {
          resolve({
            id: '1',
            name: 'Demo User',
            email: email,
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, SIMULATED_DELAY);
    });
  },

  signUp: async (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password.length >= 6) {
          resolve({
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
          });
        } else {
          reject(new Error('Registration failed'));
        }
      }, SIMULATED_DELAY);
    });
  },
};
