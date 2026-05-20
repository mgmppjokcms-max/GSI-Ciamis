import React, { useState } from 'react';
import { Match, Team, MatchRound } from '../types';
import { Calendar, Filter, ChevronDown, Trophy } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';

export default function ScheduleView({ matches, teams }: { matches: Match[], teams: Team[] }) {
  const [filter, setFilter] = useState<MatchRound | 'ALL'>('ALL');

  const filteredMatches = matches.filter(m => filter === 'ALL' || m.round === filter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const rounds: { id: MatchRound | 'ALL', label: string }[] = [
    { id: 'ALL', label: 'Semua Babak' },
    { id: 'GROUP_STAGE', label: 'Group Stage' },
    { id: 'QUARTER_FINAL', label: 'Perempat Final' },
    { id: 'SEMI_FINAL', label: 'Semi Final' },
    { id: 'FINAL', label: 'Final' },
  ];

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black italic text-pitch-dark">JADWAL & HASIL</h2>
          <p className="text-slate-500 font-medium">Kalender Pertandingan GSI Ciamis 2026</p>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {rounds.map(r => (
            <button
              key={r.id}
              onClick={() => setFilter(r.id)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all",
                filter === r.id 
                  ? "bg-pitch text-white shadow-md shadow-pitch/20" 
                  : "bg-white text-slate-500 border border-slate-200 hover:border-pitch hover:text-pitch"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {['GROUP_STAGE', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL'].map(round => {
          const roundMatches = filteredMatches.filter(m => m.round === round);
          if (roundMatches.length === 0 && filter !== 'ALL' && filter !== round) return null;
          if (roundMatches.length === 0) return null;

          return (
            <div key={round} className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-0.5 flex-grow bg-slate-200" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>BABAK {round.replace('_', ' ')}</span>
                </h3>
                <div className="h-0.5 flex-grow bg-slate-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roundMatches.map(match => (
                  <MatchCard key={match.id} match={match} teams={teams} />
                ))}
              </div>
            </div>
          );
        })}

        {filteredMatches.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Belum ada jadwal pertandingan untuk kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({ match, teams }: { match: Match, teams: Team[], key?: React.Key }) {
  const teamA = teams.find(t => t.id === match.teamAId);
  const teamB = teams.find(t => t.id === match.teamBId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           {match.round.replace('_', ' ')}
        </span>
        <div className="flex items-center space-x-2">
          {match.status === 'LIVE' && (
            <div className="relative flex h-2 w-2">
              <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></div>
            </div>
          )}
          <div className={cn(
            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight",
            match.status === 'LIVE' ? "bg-red-500 text-white" :
            match.status === 'FINISHED' ? "bg-slate-200 text-slate-600" :
            "bg-emerald-100 text-emerald-700 border border-emerald-200"
          )}>
            {match.status === 'LIVE' ? 'Langsung' : match.status === 'FINISHED' ? 'Selesai' : 'Akan Datang'}
          </div>
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex items-center justify-between">
        <div className="flex-1 flex flex-col items-center space-y-3">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center font-black text-xl text-slate-300 overflow-hidden border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
            {teamA?.logoUrl ? (
              <img src={teamA.logoUrl} alt={teamA.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              teamA?.name.charAt(0)
            )}
          </div>
          <span className="font-bold text-sm md:text-base text-center line-clamp-1">{teamA?.name}</span>
        </div>

        <div className="px-4 md:px-8 flex flex-col items-center justify-center">
          {match.status === 'SCHEDULED' ? (
            <div className="text-center space-y-2">
              <span className="text-2xl font-black text-slate-200">VS</span>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-pitch whitespace-nowrap uppercase tracking-widest">Kick Off</span>
                 <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{formatDate(match.date).split(',')[1]}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-3xl md:text-5xl font-black tabular-nums">{match.scoreA}</span>
              <span className="text-2xl font-black text-slate-300">:</span>
              <span className="text-3xl md:text-5xl font-black tabular-nums">{match.scoreB}</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center space-y-3">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center font-black text-xl text-slate-300 overflow-hidden border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
            {teamB?.logoUrl ? (
              <img src={teamB.logoUrl} alt={teamB.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              teamB?.name.charAt(0)
            )}
          </div>
          <span className="font-bold text-sm md:text-base text-center line-clamp-1">{teamB?.name}</span>
        </div>
      </div>

      <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 text-center">
        <span className="text-[10px] font-bold text-slate-500">{formatDate(match.date)}</span>
      </div>
    </div>
  );
}
