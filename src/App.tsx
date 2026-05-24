import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Calendar, 
  ListOrdered, 
  User, 
  Settings, 
  ChevronRight,
  Shield,
  Zap,
  LayoutDashboard,
  Award,
  Users,
  Newspaper
} from 'lucide-react';
import { cn } from './lib/utils';
import { store } from './services/store';
import { Team, Match, Player, CompetitionSettings } from './types';

// Import sub-components (will create these next)
import StandingsView from './components/StandingsView';
import ScheduleView from './components/ScheduleView';
import ScorersView from './components/ScorersView';
import DrawingView from './components/DrawingView';
import AdminView from './components/AdminView';
import HomeView from './components/HomeView';
import TeamDetailView from './components/TeamDetailView';
import ScoutView from './components/ScoutView';
import TeamsPlayersView from './components/TeamsPlayersView';
import NewsView from './components/NewsView';

type View = 'home' | 'standings' | 'schedule' | 'scorers' | 'teams-players' | 'scout' | 'admin' | 'team-detail' | 'news';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [backView, setBackView] = useState<View>('standings');
  const [initialTeamsPlayersSegment, setInitialTeamsPlayersSegment] = useState<'teams' | 'players'>('teams');
  const [initialTeamsPlayersFilter, setInitialTeamsPlayersFilter] = useState<string>('ALL');
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [seededIds, setSeededIds] = useState<string[]>([]);
  const [settings, setSettings] = useState<CompetitionSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentView]);

  const loadData = async () => {
    const [t, m, p, s, set] = await Promise.all([
      store.getTeams(),
      store.getMatches(),
      store.getPlayers(),
      store.getSeededIds(),
      store.getSettings()
    ]);
    setTeams([...t]);
    setMatches([...m]);
    setPlayers([...p]);
    setSeededIds([...s]);
    setSettings(set);
    setLoading(false);
  };

  const navigateToTeam = (teamId: string, fromView: View = 'standings') => {
    setSelectedTeamId(teamId);
    setBackView(fromView);
    setCurrentView('team-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: 'Beranda', icon: LayoutDashboard },
    { id: 'news', label: 'Berita', icon: Newspaper },
    { id: 'standings', label: 'Klasemen', icon: ListOrdered },
    { id: 'schedule', label: 'Jadwal', icon: Calendar },
    { id: 'scorers', label: 'Top Skor', icon: User },
    { id: 'teams-players', label: 'Tim & Pemain', icon: Users },
    { id: 'scout', label: 'Talent Scout', icon: Award },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-pitch-dark text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            {settings?.logoUrl ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-pitch-dark/45 flex items-center justify-center">
                <img 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            ) : (
              <div className="bg-pitch p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-black tracking-tight text-white uppercase">{settings?.name || "GSI CIAMIS"}</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none mt-0.5">{settings?.location || "KABUPATEN CIAMIS"}</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const isSpecial = item.id === 'scout' || item.id === 'admin';
              
              const specialColorClass = 
                item.id === 'scout' 
                  ? (currentView === 'scout' ? 'bg-amber-500 text-slate-950 font-black' : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10')
                  : (currentView === 'admin' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                     setCurrentView(item.id as View);
                     setSelectedTeamId(null);
                     if (item.id === 'teams-players') {
                       setInitialTeamsPlayersSegment('teams');
                       setInitialTeamsPlayersFilter('ALL');
                     }
                  }}
                  title={item.label}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2",
                    isSpecial 
                      ? specialColorClass 
                      : (currentView === item.id 
                          ? "bg-pitch text-white" 
                          : (currentView === 'team-detail' && item.id === backView) 
                             ? "bg-pitch/20 text-white" 
                             : "text-slate-300 hover:text-white hover:bg-white/10")
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {!isSpecial && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="lg:hidden">
             {/* Mobile menu button could go here */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (selectedTeamId || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'home' && <HomeView teams={teams} matches={matches} settings={settings || undefined} />}
            {currentView === 'news' && <NewsView />}
            {currentView === 'standings' && <StandingsView teams={teams} matches={matches} seededIds={seededIds} onTeamClick={navigateToTeam} />}
            {currentView === 'schedule' && <ScheduleView matches={matches} teams={teams} />}
            {currentView === 'scorers' && <ScorersView players={players} teams={teams} />}
            {currentView === 'teams-players' && (
              <TeamsPlayersView 
                teams={teams} 
                players={players} 
                onTeamClick={(teamId) => navigateToTeam(teamId, 'teams-players')} 
                initialSegment={initialTeamsPlayersSegment}
                initialFilter={initialTeamsPlayersFilter}
              />
            )}
            {currentView === 'scout' && <ScoutView players={players} teams={teams} matches={matches} onRefresh={loadData} />}
            {currentView === 'admin' && <AdminView teams={teams} matches={matches} players={players} seededIds={seededIds} onRefresh={loadData} />}
            {currentView === 'team-detail' && selectedTeam && (
              <TeamDetailView 
                team={selectedTeam} 
                matches={matches} 
                players={players} 
                allTeams={teams} 
                onBack={() => setCurrentView(backView)} 
                onGoToPlayersList={(teamId) => {
                  setInitialTeamsPlayersSegment('players');
                  setInitialTeamsPlayersFilter(teamId);
                  setCurrentView('teams-players');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile & Tablet Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-1 py-2.5 z-50">
        <div className="grid grid-cols-8 gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as View);
                if (item.id === 'teams-players') {
                  setInitialTeamsPlayersSegment('teams');
                  setInitialTeamsPlayersFilter('ALL');
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center p-0.5 rounded-lg transition-colors",
                currentView === item.id ? "text-pitch" : "text-slate-400"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-[8px] mt-0.5 font-semibold text-center leading-tight truncate w-full">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 py-12 px-4 text-center mt-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-pitch" />
            <span className="font-extrabold text-slate-300 uppercase tracking-wider">{settings?.name || "GALA SISWA INDONESIA"}</span>
          </div>
          <p className="text-sm max-w-md mx-auto text-slate-400 font-medium">
            {settings?.description || "Aplikasi resmi kompetisi sepak bola Gala Siswa Indonesia."}
          </p>
          <div className="mt-8 pt-8 border-t border-slate-800 text-xs text-slate-600 font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {settings?.footerText || "MGMP PJOK Kabupaten Ciamis"}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
