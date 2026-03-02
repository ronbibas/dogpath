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
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          trainer_id: string;
          title: string;
          description: string;
          video_url: string | null;
          video_file_url: string | null;
          voice_memo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          title: string;
          description: string;
          video_url?: string | null;
          video_file_url?: string | null;
          voice_memo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trainer_id?: string;
          title?: string;
          description?: string;
          video_url?: string | null;
          video_file_url?: string | null;
          voice_memo_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          id: string;
          trainer_id: string;
          title: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          title: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trainer_id?: string;
          title?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      program_stages: {
        Row: {
          id: string;
          program_id: string;
          exercise_id: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          exercise_id: string;
          order_index: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          exercise_id?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export interface Exercise {
  id: string;
  trainer_id: string;
  title: string;
  description: string;
  video_url: string | null;
  video_file_url: string | null;
  voice_memo_url: string | null;
  created_at: string;
}

export interface Program {
  id: string;
  trainer_id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface ProgramStage {
  id: string;
  program_id: string;
  exercise_id: string;
  order_index: number;
  created_at: string;
}

export interface ProgramStageWithExercise extends ProgramStage {
  exercise: Exercise;
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
