export interface User {
  id: string;
  username: string;
  email: string;
  coders_count: number;
  avatar: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  author_id: string;
  language: string;
  views: number;
  timestamp: string;
}

export interface Message {
  id?: number;
  conversation_id: string;
  sender_id: string;
  content: string;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  name: string;
  is_group: boolean;
  last_message?: string;
  members?: User[];
}

export interface InternshipProgress {
  user_id: string;
  week_number: number;
  completed: boolean;
  test_score: number | null;
}

export type AppState = 'login' | 'loading' | 'home' | 'chat' | 'internship' | 'compiler' | 'profile';
