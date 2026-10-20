export interface User {
  id: number;
  username: string;
  role: 'penulis' | 'admin' | string;
}

export interface Journal {
  id: number;
  user_id: number;
  username?: string;
  title: string;
  category: string;
  content: string;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
  error?: string;
}

export interface JournalApiResponse {
  data?: Journal[];
  message?: string;
  error?: string;
}

export type CategoryOption = 
  | 'Semua'
  | 'Catatan Observasi'
  | 'Flora & Fauna'
  | 'Ekspedisi & Pendakian'
  | 'Konservasi & Hutan'
  | 'Geologi & Bentang Alam'
  | 'Tips Eksplorasi Alam';
