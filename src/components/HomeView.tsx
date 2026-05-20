import React from 'react';
import { Match, Team, CompetitionSettings } from '../types';
import { Calendar, Trophy, Zap, ChevronRight } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function HomeView({ teams, matches, settings }: { teams: Team[], matches: Match[], settings?: CompetitionSettings }) {
  const upcomingMatches = matches
    .filter(m => m.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentResults = matches
    .filter(m => m.status === 'FINISHED')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative min-h-[16rem] md:h-80 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-pitch-dark to-pitch-light flex flex-col md:flex-row items-center justify-between p-6 md:p-12 text-white gap-6">
        <div className="absolute inset-0 bg-radial-at-l from-transparent to-pitch-dark/50 pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-4 flex-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm tracking-wide uppercase">
            {settings?.subTitle || "Satu Hati, Satu Nyali, Juara!"}
          </div>
          <h2 className="text-3xl md:text-5xl font-black leading-tight italic uppercase drop-shadow-sm">
            {settings?.name || "GALA SISWA INDONESIA"} <br /> 
            <span className="text-yellow-400">{settings?.location || "KABUPATEN CIAMIS"}</span>
          </h2>
          <p className="text-slate-250 text-xs md:text-sm leading-relaxed max-w-lg">
            {settings?.description || "Ajang kompetisi sepak bola bergengsi tingkat SMP se-Kabupaten Ciamis untuk mencetak atlet muda berbakat."}
          </p>
        </div>

        {/* Dynamic Hero Image / Logo right-aligned */}
        <div className="relative z-10 w-full md:w-96 h-48 md:h-56 flex-shrink-0">
          <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl relative group bg-pitch-dark/40">
            <img 
              src={settings?.heroImageUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"} 
              alt="Competition Logo / Hero" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-pitch" />
              <span>Pertandingan Mendatang</span>
            </h3>
            <button className="text-sm font-medium text-pitch hover:underline flex items-center">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {upcomingMatches.length > 0 ? upcomingMatches.map(match => (
              <MatchItem key={match.id} match={match} teams={teams} />
            )) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
                Belum ada jadwal pertandingan yang tersedia.
              </div>
            )}
          </div>
        </div>

        {/* Recent Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>Hasil Terakhir</span>
            </h3>
          </div>

          <div className="space-y-4">
             {recentResults.length > 0 ? recentResults.map(match => (
              <ResultItem key={match.id} match={match} teams={teams} />
            )) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
                Belum ada hasil pertandingan.
              </div>
            )}
          </div>

          {/* Quick Standings Summary */}
          <div className="bg-pitch-dark text-white p-6 rounded-2xl shadow-xl space-y-4">
            <h4 className="font-bold flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Klasemen Sementara</span>
            </h4>
            <div className="space-y-3">
              {teams.slice(0, 4).sort((a,b) => b.points - a.points).map((team, idx) => (
                <div key={team.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 font-mono w-4">{idx + 1}</span>
                    <div className="w-6 h-6 rounded-full bg-white overflow-hidden border border-white/20">
                      {team.logoUrl && <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                    </div>
                    <span className="font-medium">{team.name}</span>
                  </div>
                  <span className="font-bold text-yellow-400">{team.points} PT</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchItem({ match, teams }: { match: Match, teams: Team[], key?: React.Key }) {
  const teamA = teams.find(t => t.id === match.teamAId);
  const teamB = teams.find(t => t.id === match.teamBId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 flex flex-col items-center">
        <div className="w-14 h-14 bg-white rounded-full mb-2 flex items-center justify-center font-bold text-slate-400 overflow-hidden border border-slate-100 shadow-sm">
          {teamA?.logoUrl ? (
            <img src={teamA.logoUrl} alt={teamA?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            teamA?.name.charAt(0)
          )}
        </div>
        <span className="font-bold text-center text-sm">{teamA?.name}</span>
      </div>
      
      <div className="px-6 flex flex-col items-center">
        <span className="text-xs font-bold text-pitch uppercase tracking-wider mb-1">VS</span>
        <span className="text-[10px] text-slate-400 text-center font-medium max-w-[100px]">
          {formatDate(match.date)}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="w-14 h-14 bg-white rounded-full mb-2 flex items-center justify-center font-bold text-slate-400 overflow-hidden border border-slate-100 shadow-sm">
          {teamB?.logoUrl ? (
            <img src={teamB.logoUrl} alt={teamB?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            teamB?.name.charAt(0)
          )}
        </div>
        <span className="font-bold text-center text-sm">{teamB?.name}</span>
      </div>
    </div>
  );
}

function ResultItem({ match, teams }: { match: Match, teams: Team[], key?: React.Key }) {
  const teamA = teams.find(t => t.id === match.teamAId);
  const teamB = teams.find(t => t.id === match.teamBId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{match.round}</span>
        <span className="bg-slate-100 text-[9px] px-2 py-0.5 rounded-full font-bold text-slate-600">SELESAI</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
            {teamA?.logoUrl && <img src={teamA.logoUrl} alt={teamA.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
          </div>
          <span className="font-bold text-sm truncate">{teamA?.name}</span>
        </div>
        <div className="flex items-center space-x-2 px-4">
          <span className="text-xl font-black">{match.scoreA}</span>
          <span className="text-slate-300 font-bold">-</span>
          <span className="text-xl font-black">{match.scoreB}</span>
        </div>
        <div className="flex items-center justify-end space-x-3 flex-1">
          <span className="font-bold text-sm truncate text-right">{teamB?.name}</span>
          <div className="w-8 h-8 rounded-full bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
            {teamB?.logoUrl && <img src={teamB.logoUrl} alt={teamB.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
          </div>
        </div>
      </div>
    </div>
  );
}
