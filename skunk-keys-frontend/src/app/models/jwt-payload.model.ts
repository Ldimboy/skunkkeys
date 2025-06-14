export interface JwtPayload {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at?: string;
  exp?: number;
  iat?: number;
}
