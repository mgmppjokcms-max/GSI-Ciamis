import React from 'react';
import { Team, Match, Player } from '../types';
import { ChevronLeft, Trophy, Calendar, Users, Zap, Shield } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';

interface TeamDetailViewProps {
  team: Team;
  matches: Match[];
  players: Player[];
  allTeams: Team[];
  onBack: () => void;
}

export default function TeamDetailView({ team, matches, players, allTeams, onBack }: TeamDetailViewProps) {
  const teamMatches = matches
    .filter(m => m.teamAId === team.id || m.teamBId === team.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const teamPlayers = players.filter(p => p.teamId === team.id);

  // Calculate Standing Position
  const groupTeams = allTeams.filter(t => t.group === team.group);
  const sortedGroupTeams = [...groupTeams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;
    if (diffB !== diffA) return diffB - diffA;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.name.localeCompare(b.name);
  });
  const standingPos = sortedGroupTeams.findIndex(t => t.id === team.id) + 1;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-500 hover:text-pitch transition-colors font-bold group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Kembali ke Klasemen</span>
      </button>

      {/* Header Profile */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Shield className="w-64 h-64 text-pitch" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-slate-50 shadow-2xl">
            {team.logoUrl ? (
              <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-4xl text-slate-300">
                {team.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="text-center md:text-left space-y-4">
            <div className="space-y-1">
              <h2 className="text-4xl font-black italic text-pitch-dark tracking-tight">{team.name}</h2>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                  Grup {team.group || '-'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-pitch/10 text-pitch text-[10px] font-black uppercase tracking-widest border border-pitch/20">
                  Posisi {standingPos}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <StatCard label="Poin" value={team.points} icon={Trophy} color="bg-yellow-400" />
               <StatCard label="Menang" value={team.won} icon={Zap} color="bg-green-500" />
               <StatCard label="SG" value={team.goalsFor - team.goalsAgainst} icon={Shield} color="bg-pitch" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match History */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black italic flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-pitch" />
            <span>Riwayat Pertandingan</span>
          </h3>
          
          <div className="space-y-4">
            {teamMatches.length > 0 ? teamMatches.map(match => (
              <HistoryMatchItem key={match.id} match={match} currentTeamId={team.id} allTeams={allTeams} />
            )) : (
              <div className="bg-slate-50 p-12 rounded-2xl text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-200">
                Belum ada data pertandingan.
              </div>
            )}
          </div>
        </div>

        {/* Squad List */}
        <div className="space-y-6">
          <h3 className="text-xl font-black italic flex items-center space-x-2">
            <Users className="w-5 h-5 text-pitch" />
            <span>Daftar Pemain</span>
          </h3>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {teamPlayers.length > 0 ? teamPlayers.map(player => {
              const rating = player.rating || { pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 };
              const overall = Math.round((rating.pac + rating.sho + rating.pas + rating.dri + rating.def + rating.phy) / 6);
              const position = player.position || 'ST';

              const secondaryRating = player.secondaryRating;
              const secondaryOverall = secondaryRating 
                ? Math.round((secondaryRating.pac + secondaryRating.sho + secondaryRating.pas + secondaryRating.dri + secondaryRating.def + secondaryRating.phy) / 6)
                : null;
              const secondaryPosition = player.secondaryPosition;

              return (
                <div key={player.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-slate-700">{player.name}</span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{position}</span>
                      {secondaryPosition && (
                        <>
                          <span className="text-slate-350 text-[10px]">•</span>
                          <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200/50 px-1.5 py-0.2 rounded-md uppercase tracking-tight" title="Posisi Tambahan">
                            {secondaryPosition} (TAMBAHAN)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {player.rating && (
                      <span className="bg-yellow-100 text-yellow-800 border border-yellow-300 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase shadow-xs">
                        {overall} OVR
                      </span>
                    )}
                    {secondaryOverall && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300/60 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase shadow-xs" title="Rating Posisi Tambahan">
                        {secondaryOverall} OVR 2
                      </span>
                    )}
                    <span className="bg-pitch text-white text-[10px] px-2.5 py-1 rounded-full font-black">
                      {player.goals} GOL
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-slate-400 text-sm font-medium italic">
                Belum ada data pemain.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) {
  return (
    <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm", color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">{label}</p>
        <p className="text-xl font-black text-slate-800 leading-none">{value}</p>
      </div>
    </div>
  );
}

function HistoryMatchItem({ match, currentTeamId, allTeams }: { match: Match, currentTeamId: string, allTeams: Team[], key?: string }) {
  const teamA = allTeams.find(t => t.id === match.teamAId);
  const teamB = allTeams.find(t => t.id === match.teamBId);
  const isA = match.teamAId === currentTeamId;
  const opponent = isA ? teamB : teamA;
  const scoreSelf = isA ? match.scoreA : match.scoreB;
  const scoreOpponent = isA ? match.scoreB : match.scoreA;

  const result = match.status !== 'FINISHED' ? 'UPCOMING' : 
                 scoreSelf > scoreOpponent ? 'WIN' : 
                 scoreSelf < scoreOpponent ? 'LOSS' : 'DRAW';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-pitch transition-colors">
      <div className="flex items-center space-x-4 flex-1">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white",
          result === 'WIN' ? "bg-green-500" :
          result === 'LOSS' ? "bg-red-500" :
          result === 'DRAW' ? "bg-slate-400" : "bg-blue-400"
        )}>
          {result === 'WIN' ? 'W' : result === 'LOSS' ? 'L' : result === 'DRAW' ? 'D' : '?'}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400">{formatDate(match.date)}</p>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-500">vs</span>
            <span className="font-black text-slate-800">{opponent?.name}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center px-4">
        {match.status === 'FINISHED' ? (
          <span className="text-xl font-black">{scoreSelf} - {scoreOpponent}</span>
        ) : (
          <span className="text-xs font-black text-blue-500 uppercase tracking-widest">{match.status}</span>
        )}
      </div>
    </div>
  );
}
