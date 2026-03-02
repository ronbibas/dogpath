export type UserRole = 'trainer' | 'client';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          full_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          created_at?: string;
        };
      };
    };
  };
}

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  created_at: string;
}

export interface UserWithProfile {
  id: string;
  email: string;
  profile: Profile | null;
}

export interface AuthContextType {
  user: UserWithProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  isTrainer: boolean;
  isClient: boolean;
}
