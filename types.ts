
export interface UserProfile {
  height: string;
  weight: number;
  targetWeight: number;
  experience: 'beginner' | 'intermediate' | 'advanced';
  alignment: 'fire' | 'ice';
  photoUrl?: string;
  videoUrl?: string;
  streak: number;
  lastCheckIn?: string;
  currentDay: number;
}

export interface DailyZen {
  mantra: string;
  inspiration: string;
  meditationGuide: string;
  gratitudeSuggestions: string[];
}

export interface Exercise {
  id: string;
  name: string;
  discipline: 'Yoga' | 'Tai Chi' | 'Krav Maga' | 'Jiu-Jitsu' | 'Conditioning';
  reps?: string;
  durationMinutes?: number;
  description: string;
  targets?: string[];
}

export interface WorkoutSession {
  day: number;
  title: string;
  exercises: Exercise[];
}

export interface SearchResult {
  title: string;
  uri: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
