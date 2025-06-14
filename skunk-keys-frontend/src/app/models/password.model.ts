export interface Password {
  id: number;
  user_id: number;
  folder_id: number | null;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}
