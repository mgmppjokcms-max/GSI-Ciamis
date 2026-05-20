import React from 'react';
import { Team, Match } from '../types';
import { Trophy, TrendingUp, TrendingDown, Minus, ShieldCheck, Scale } from 'lucide-react';
import { cn } from '../lib/utils';

export default function StandingsView({ teams, matches, seededIds, onTeamClick }: { teams: Team[], matches: Match[], seededIds: string[], onTeamClick: (id: string) => void }) {
  const getSortedTeams = (groupTeams: Team[]) => {
    return [...groupTeams].sort((a, b) => {
      // 0. Points
      if (b.points !== a.points) return b.points - a.points;

      // 1. Selisih Gol (Goal Difference)
      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;

      // 2. Jumlah Gol yang Dicetak (Goals For)
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

      // 3. Jumlah Gol Tandang (Away Goals)
      if (b.awayGoals !== a.awayGoals) return b.awayGoals - a.awayGoals;

      // 4. Jumlah Kemenangan (Wins)
      if (b.won !== a.won) return b.won - a.won;

      // 5. Jumlah Kemenangan Tandang (Away Wins)
      if (b.awayWins !== a.awayWins) return b.awayWins - a.awayWins;

      // Collective Opponent Stats (Still useful in groups if needed)
      const getOpponentStats = (teamId: string) => {
        const opponents = matches
          .filter(m => m.round === 'GROUP_STAGE' && (m.teamAId === teamId || m.teamBId === teamId))
          .map(m => m.teamAId === teamId ? m.teamBId : m.teamAId);
        
        let collectivePoints = 0;
        let collectiveGD = 0;
        let collectiveGF = 0;

        opponents.forEach(oppId => {
          const opp = teams.find(t => t.id === oppId);
          if (opp) {
            collectivePoints += opp.points;
            collectiveGD += (opp.goalsFor - opp.goalsAgainst);
            collectiveGF += opp.goalsFor;
          }
        });

        return { collectivePoints, collectiveGD, collectiveGF };
      };

      const statsA = getOpponentStats(a.id);
      const statsB = getOpponentStats(b.id);
      if (statsB.collectivePoints !== statsA.collectivePoints) return statsB.collectivePoints - statsA.collectivePoints;
      if (statsB.collectiveGD !== statsA.collectiveGD) return statsB.collectiveGD - statsA.collectiveGD;
      if (statsB.collectiveGF !== statsA.collectiveGF) return statsB.collectiveGF - statsA.collectiveGF;

      return a.name.localeCompare(b.name);
    });
  };

  const groupLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black italic text-pitch-dark">GROUP STAGE</h2>
        <p className="text-slate-500 font-medium italic underline decoration-pitch decoration-2">Fase Grup Gala Siswa Indonesia (GSI) Ciamis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {groupLabels.map(label => {
          const groupTeams = teams.filter(t => t.group === label);
          const sorted = getSortedTeams(groupTeams);

          return (
            <div key={label} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-pitch-dark text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-pitch rounded-lg flex items-center justify-center font-black">
                    {label}
                  </div>
                  <div>
                    <h3 className="font-bold text-base tracking-tight">Grup {label}</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Klasemen Fase Grup</p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                      <th className="px-4 py-3 text-left w-12">Pos</th>
                      <th className="px-4 py-3 text-left">Tim</th>
                      <th className="px-2 py-3 text-center">P</th>
                      <th className="px-2 py-3 text-center">SG</th>
                      <th className="px-4 py-3 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sorted.map((team, idx) => (
                      <tr 
                        key={team.id} 
                        onClick={() => onTeamClick(team.id)}
                        className={cn(
                          "group hover:bg-slate-50 transition-colors cursor-pointer",
                          idx < 2 && "bg-green-50/20"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className={cn(
                            "w-6 h-6 rounded flex items-center justify-center font-mono font-black text-[10px]",
                            idx < 2 ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"
                          )}>
                            {idx + 1}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-slate-50 overflow-hidden border border-slate-200 flex-shrink-0">
                              {team.logoUrl && <img src={team.logoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                            </div>
                            <span className="font-bold text-slate-700 truncate max-w-[120px]">{team.name}</span>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-center font-medium text-slate-500">{team.played}</td>
                        <td className="px-2 py-3 text-center font-black text-slate-700">{team.goalsFor - team.goalsAgainst}</td>
                        <td className="px-4 py-3 text-right font-black text-pitch">{team.points}</td>
                      </tr>
                    ))}
                    {sorted.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-bold italic">
                          Belum ada tim di grup ini
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-3xl">
        <h4 className="font-black text-slate-700 flex items-center mb-4">
          <Scale className="w-5 h-5 mr-2 text-pitch" />
          <span>Kriteria Tiebreaker</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-[10px] font-bold text-slate-500 uppercase">
          <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-pitch mr-2" /> Selisih Gol</div>
          <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-pitch mr-2" /> Jumlah Gol Dicetak</div>
          <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-pitch mr-2" /> Jumlah Gol Tandang</div>
          <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-pitch mr-2" /> Jumlah Kemenangan</div>
          <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-pitch mr-2" /> Menang Tandang</div>
          <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-pitch mr-2" /> Poin Kolektif Lawan</div>
        </div>
      </div>
    </div>
  );
}
