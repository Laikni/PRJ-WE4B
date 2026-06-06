export interface User {
  id_user?: number;  
  email: string;
  password?: string;
  role: 'client' | 'admin';
}