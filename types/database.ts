export type StarType = 'savouring' | 'kindness' | 'gratitude';

export interface StarEntry {
  id: string;
  user_id: string;
  type: StarType;
  content: string;
  created_at: string;
  jar_id?: string; // Optional: null means it's in the current active jar
}

export interface Jar {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  created_at: string;
}
