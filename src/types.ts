export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  awayGoals: number;
  awayWins: number;
  points: number;
  group?: string; // e.g., 'A', 'B', 'C', 'D'
  photoUrl?: string; // Team Photo
}

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED';
export type MatchRound = 'GROUP_STAGE' | 'QUARTER_FINAL' | 'SEMI_FINAL' | 'FINAL';

export interface Match {
  id: string;
  teamAId: string;
  teamBId: string;
  scoreA: number;
  scoreB: number;
  date: string;
  duration: number; // Duration in minutes
  status: MatchStatus;
  round: MatchRound;
}

export interface PlayerRating {
  pac: number; // Pace
  sho: number; // Shooting
  pas: number; // Passing
  dri: number; // Dribbling
  def: number; // Defending
  phy: number; // Physical
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  goals: number;
  position?: string; // e.g., 'ST', 'CM', 'CB', 'GK', etc.
  rating?: PlayerRating;
  customAttributes?: { name: string; value: string }[];
  isMarkedForScouting?: boolean;
  secondaryPosition?: string;
  secondaryRating?: PlayerRating;
  secondaryCustomAttributes?: { name: string; value: string }[];
  birthDate?: string;
  age?: number;
  photoUrl?: string;
  jerseyNumber?: number;
}

export interface Official {
  id: string;
  name: string;
  role: string;
  teamId: string;
  photoUrl?: string;
}

export interface Goal {
  id: string;
  matchId: string;
  playerId: string;
  minute: number;
}

export interface CompetitionSettings {
  name: string;
  location: string;
  subTitle: string;
  description: string;
  footerText: string;
  heroImageUrl?: string;
  logoUrl?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
  author?: string;
}

export function getAge(birthDateStr?: string): number {
  if (!birthDateStr) return 15; // default fallback age for SMP
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return isNaN(age) || age < 0 ? 15 : age;
}

