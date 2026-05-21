import { Team, Match, Player, Official, MatchStatus, PlayerRating, CompetitionSettings, NewsArticle } from '../types';

// Mock Initial Data - Expanded for League Phase
const INITIAL_TEAMS: Team[] = [
  { id: 't1', name: 'Ciamis FC', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=CF', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't2', name: 'Kawali United', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=KU', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't3', name: 'Panumbangan Star', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=PS', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't4', name: 'Sadananya FC', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=SF', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't5', name: 'Rancah District', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=RD', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't6', name: 'Cipaku Boys', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=CB', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't7', name: 'Rajadesa Lions', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=RL', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't8', name: 'Panjalu United', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=PU', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't9', name: 'Sindangkasih Rangers', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=SR', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't10', name: 'Baregbeg Warriors', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=BW', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't11', name: 'Cikoneng Elite', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=CE', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't12', name: 'Cidolog Defenders', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=CD', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't13', name: 'Lakbok Thunder', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=LT', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't14', name: 'Purwadadi City', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=PC', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't15', name: 'Banjarsari Red', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=BR', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't16', name: 'Pamarican Blue', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=PB', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't17', name: 'Cihaurbeuti Goal', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=CG', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't18', name: 'Jatinagara FC', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=JF', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't19', name: 'Tambaksari United', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TU', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
  { id: 't20', name: 'Sukadana Boys', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=SB', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0 },
];

const DEFAULT_SETTINGS: CompetitionSettings = {
  name: "GALA SISWA INDONESIA",
  location: "KABUPATEN CIAMIS 2026",
  subTitle: "Satu Hati, Satu Nyali, Juara!",
  description: "Ajang kompetisi sepak bola bergengsi tingkat SMP se-Kabupaten Ciamis untuk mencetak atlet muda berbakat.",
  footerText: "MGMP PJOK Kabupaten Ciamis",
  heroImageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
};

const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Gala Siswa Indonesia (GSI) Ciamis Resmi Dimulai!',
    content: 'Kompetisi sepak bola tingkat SMP se-Kabupaten Ciamis resmi dibuka hari ini di Stadion Atletik Prabu Linggabuana. Turnamen ini diikuti oleh tim-tim perwakilan kecamatan yang siap memperebutkan gelar juara bertalenta emas dengan sportivitas tinggi.',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    date: '2026-05-20',
    author: 'Panitia GSI Ciamis'
  },
  {
    id: 'n2',
    title: 'Pemanduan Bakat Berbasis Metrik Diluncurkan',
    content: 'Tim Scout Talent GSI Ciamis meluncurkan sistem pemanduan bakat terbaru yang menggunakan pendekatan metrik modern (Pace, Shooting, Passing, Dribbling, Defending, dan Physical). Sistem ini memudahkan identifikasi pemain muda potensial untuk memperkuat skuad GSI Kabupaten Ciamis di level provinsi.',
    imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600&q=80',
    date: '2026-05-19',
    author: 'Tim Scout Talent'
  }
];

export class TournamentStore {
  private static instance: TournamentStore;
  private teams: Team[] = [];
  private matches: Match[] = [];
  private players: Player[] = [];
  private officials: Official[] = [];
  private news: NewsArticle[] = [];
  private settings: CompetitionSettings = DEFAULT_SETTINGS;
  private seededIds: string[] = ['t1', 't2', 't3', 't4'];

  private constructor() {
    this.load();
  }

  static getInstance() {
    if (!TournamentStore.instance) {
      TournamentStore.instance = new TournamentStore();
    }
    return TournamentStore.instance;
  }

  private load() {
    const savedData = localStorage.getItem('gsi_ciamis_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      this.teams = parsed.teams || INITIAL_TEAMS;
      this.matches = parsed.matches || [];
      this.players = parsed.players || [];
      
      // Defensive fix: Ensure all loaded players have a birthDate & age
      let updatedSome = false;
      this.players = this.players.map(p => {
        if (!p.birthDate) {
          const mocks = this.getMockPlayers();
          const foundMock = mocks.find(m => m.id === p.id);
          p.birthDate = foundMock?.birthDate || '2011-05-15';
          p.age = foundMock?.age || 15;
          updatedSome = true;
        }
        return p;
      });

      this.officials = parsed.officials || [];
      this.news = parsed.news || INITIAL_NEWS;
      this.settings = parsed.settings || { ...DEFAULT_SETTINGS };
      this.seededIds = parsed.seededIds || ['t1', 't2', 't3', 't4'];
      if (!this.players || this.players.length === 0 || updatedSome) {
        if (!this.players || this.players.length === 0) {
          this.players = this.getMockPlayers();
        }
        this.save();
      }
    } else {
      this.teams = INITIAL_TEAMS;
      this.players = this.getMockPlayers();
      this.news = INITIAL_NEWS;
      this.settings = { ...DEFAULT_SETTINGS };
      this.save();
    }
  }

  private getMockPlayers(): Player[] {
    return [
      { id: 'p1', name: 'Rafi Ahmad', teamId: 't1', goals: 5, position: 'ST', rating: { pac: 86, sho: 84, pas: 72, dri: 80, def: 38, phy: 75 }, birthDate: '2011-02-12', age: 15 },
      { id: 'p2', name: 'Bintang Pamungkas', teamId: 't2', goals: 2, position: 'CM', rating: { pac: 78, sho: 76, pas: 88, dri: 84, def: 62, phy: 74 }, birthDate: '2010-08-20', age: 15 },
      { id: 'p3', name: 'Gilang Ramadhan', teamId: 't3', goals: 0, position: 'CB', rating: { pac: 72, sho: 48, pas: 65, dri: 60, def: 86, phy: 84 }, birthDate: '2011-12-05', age: 14 },
      { id: 'p4', name: 'Irfan Bachdim Jr', teamId: 't4', goals: 4, position: 'LW', rating: { pac: 92, sho: 80, pas: 75, dri: 86, def: 35, phy: 68 }, birthDate: '2010-05-18', age: 16 },
      { id: 'p5', name: 'Fajar Pratama', teamId: 't5', goals: 0, position: 'GK', rating: { pac: 76, sho: 71, pas: 74, dri: 78, def: 32, phy: 76 }, birthDate: '2011-04-30', age: 15 },
      { id: 'p6', name: 'Reza Aditya', teamId: 't2', goals: 3, position: 'ST', rating: { pac: 83, sho: 81, pas: 68, dri: 75, def: 40, phy: 73 }, birthDate: '2011-09-14', age: 14 },
      { id: 'p7', name: 'Dika Pratama', teamId: 't1', goals: 1, position: 'CAM', rating: { pac: 81, sho: 79, pas: 85, dri: 87, def: 44, phy: 70 }, birthDate: '2010-11-22', age: 15 },
      { id: 'p8', name: 'Andik Vermansyah Jr', teamId: 't6', goals: 3, position: 'RW', rating: { pac: 94, sho: 75, pas: 78, dri: 88, def: 30, phy: 62 }, birthDate: '2012-01-08', age: 14 },
    ];
  }

  private save() {
    localStorage.setItem('gsi_ciamis_data', JSON.stringify({
      teams: this.teams,
      matches: this.matches,
      players: this.players,
      officials: this.officials,
      news: this.news,
      settings: this.settings,
      seededIds: this.seededIds
    }));
  }

  async getTeams() { return this.teams; }
  async getMatches() { return this.matches; }
  async getPlayers() { return this.players; }
  async getOfficials() { return this.officials; }
  async getNews() { return this.news || []; }

  async addNews(item: NewsArticle) {
    this.news = [item, ...(this.news || [])];
    this.save();
    return item;
  }

  async updateNews(updated: NewsArticle) {
    this.news = (this.news || []).map(n => n.id === updated.id ? updated : n);
    this.save();
    return updated;
  }

  async deleteNews(id: string) {
    this.news = (this.news || []).filter(n => n.id !== id);
    this.save();
  }
  async getSettings() { return this.settings; }
  async updateSettings(settings: CompetitionSettings) {
    this.settings = settings;
    this.save();
    return this.settings;
  }
  async getSeededIds() { return this.seededIds; }

  async addTeam(team: Team) {
    this.teams.push(team);
    this.save();
    return team;
  }

  async updateTeam(updatedTeam: Team) {
    this.teams = this.teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    this.save();
    return updatedTeam;
  }

  async deleteTeam(id: string) {
    this.teams = this.teams.filter(t => t.id !== id);
    this.matches = this.matches.filter(m => m.teamAId !== id && m.teamBId !== id);
    this.save();
  }

  async updateSeededIds(ids: string[]) {
    this.seededIds = ids;
    this.save();
  }

  async addMatch(match: Match) {
    this.matches.push(match);
    this.save();
    return match;
  }

  async deleteMatch(id: string) {
    this.matches = this.matches.filter(m => m.id !== id);
    this.recalculateStandings();
    this.save();
  }

  async updateMatch(updatedMatch: Match) {
    this.matches = this.matches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
    this.recalculateStandings();
    this.save();
    return updatedMatch;
  }

  async updateStatus(matchId: string, status: MatchStatus, scoreA: number, scoreB: number) {
    this.matches = this.matches.map(m => 
      m.id === matchId ? { ...m, status, scoreA, scoreB } : m
    );
    this.recalculateStandings();
    this.save();
  }

  async addPlayer(player: Player) {
    this.players.push(player);
    this.save();
    return player;
  }

  async updatePlayer(updatedPlayer: Player) {
    this.players = this.players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p);
    this.save();
    return updatedPlayer;
  }

  async deletePlayer(playerId: string) {
    this.players = this.players.filter(p => p.id !== playerId);
    this.save();
  }

  async updatePlayerGoals(playerId: string, goals: number) {
    this.players = this.players.map(p => p.id === playerId ? { ...p, goals } : p);
    this.save();
  }

  async updatePlayerRating(
    playerId: string, 
    position: string, 
    rating: PlayerRating, 
    customAttributes?: { name: string; value: string }[], 
    isMarkedForScouting?: boolean,
    secondaryPosition?: string,
    secondaryRating?: PlayerRating,
    secondaryCustomAttributes?: { name: string; value: string }[]
  ) {
    this.players = this.players.map(p => p.id === playerId ? { 
      ...p, 
      position, 
      rating, 
      customAttributes, 
      isMarkedForScouting,
      secondaryPosition,
      secondaryRating,
      secondaryCustomAttributes
    } : p);
    this.save();
  }

  async addOfficial(official: Official) {
    this.officials.push(official);
    this.save();
    return official;
  }

  async exportData() {
    return JSON.stringify({
      teams: this.teams,
      players: this.players,
      officials: this.officials
    }, null, 2);
  }

  async importData(jsonString: string) {
    try {
      const data = JSON.parse(jsonString);
      if (data.teams) {
        data.teams.forEach((t: Team) => {
          if (!this.teams.find(existing => existing.id === t.id)) {
            this.teams.push(t);
          }
        });
      }
      if (data.players) this.players = [...this.players, ...data.players];
      if (data.officials) this.officials = [...this.officials, ...data.officials];
      this.save();
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  }

  private recalculateStandings() {
    // Reset standings
    this.teams = this.teams.map(t => ({
      ...t,
      played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0
    }));

    // Process finished matches
    this.matches.filter(m => m.status === 'FINISHED' && (m.round === 'GROUP_STAGE')).forEach(m => {
      const teamA = this.teams.find(t => t.id === m.teamAId);
      const teamB = this.teams.find(t => t.id === m.teamBId);

      if (teamA && teamB) {
        teamA.played++;
        teamB.played++;
        teamA.goalsFor += m.scoreA;
        teamA.goalsAgainst += m.scoreB;
        teamB.goalsFor += m.scoreB;
        teamB.goalsAgainst += m.scoreA;
        
        // Away stats for team B (Team B is away)
        teamB.awayGoals += m.scoreB;

        if (m.scoreA > m.scoreB) {
          teamA.won++;
          teamA.points += 3;
          teamB.lost++;
        } else if (m.scoreA < m.scoreB) {
          teamB.won++;
          teamB.awayWins++; // Team B won as away team
          teamB.points += 3;
          teamA.lost++;
        } else {
          teamA.drawn++;
          teamB.drawn++;
          teamA.points += 1;
          teamB.points += 1;
        }
      }
    });

    // Sort teams within groups
    // In a real app we'd handle H2H, Goal Diff, etc.
  }

  async resetData() {
    this.teams = INITIAL_TEAMS;
    this.matches = [];
    this.players = [];
    this.officials = [];
    this.news = INITIAL_NEWS;
    this.settings = { ...DEFAULT_SETTINGS };
    this.save();
  }
}

export const store = TournamentStore.getInstance();
