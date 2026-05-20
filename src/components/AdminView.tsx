import React, { useState, useEffect } from 'react';
import { Team, Match, Player, MatchStatus, MatchRound, CompetitionSettings, NewsArticle } from '../types';
import { store } from '../services/store';
import * as XLSX from 'xlsx';
import DrawingView from './DrawingView';
import { 
  Plus, 
  Trash2, 
  Save, 
  RefreshCcw, 
  Lock, 
  Unlock,
  PlusCircle,
  Trophy,
  History,
  Globe,
  Edit2,
  Check,
  X,
  Download,
  Upload,
  FileSpreadsheet,
  Newspaper
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminView({ teams, matches, players, seededIds, onRefresh }: { 
  teams: Team[], 
  matches: Match[], 
  players: Player[],
  seededIds: string[],
  onRefresh: () => void 
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'drawing' | 'matches' | 'scorers' | 'teams' | 'players' | 'officials' | 'news' | 'settings'>('drawing');

  const handleSyncAPI = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    alert('Synchronization Complete: Data updated from External Sports API (Simulation)');
  };

  const handleReset = async () => {
    await store.resetData();
    onRefresh();
    setShowResetConfirm(false);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-2xl border border-slate-200">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Lock className="w-10 h-10" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black italic">MENU ADMIN</h2>
            <p className="text-slate-500 text-sm">Masukkan kata sandi pengurus GSI Ciamis</p>
          </div>
          <div className="w-full space-y-4">
            <input 
              type="password" 
              placeholder="Kata Sandi"
              className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-pitch focus:outline-none font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && password === 'gsiciamis' && setIsAdmin(true)}
            />
            <button 
              onClick={() => password === 'gsiciamis' ? setIsAdmin(true) : alert('Salah!')}
              className="w-full py-4 bg-pitch text-white rounded-xl font-black hover:bg-pitch-light transition-all shadow-lg active:scale-95"
            >
              Masuk Sekarang
            </button>
            <p className="text-[10px] text-center text-slate-400">Hint: gsiciamis</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black italic text-pitch-dark">DASHBOARD ADMIN</h2>
          <p className="text-slate-500 font-medium">Kelola data kompetisi GSI Ciamis 2026</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleSyncAPI}
            disabled={isSyncing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-xs font-black shadow-sm"
          >
            <Globe className={cn("w-4 h-4", isSyncing && "animate-spin")} />
            <span>{isSyncing ? 'SYNCING...' : 'SYNC WITH API'}</span>
          </button>

          <button 
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-black shadow-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>RESET DATA</span>
          </button>
          
          {showResetConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <RefreshCcw className="w-8 h-8" />
                </div>
                <div className="text-center space-y-2">
                   <h3 className="text-xl font-black italic">HAPUS SEMUA DATA?</h3>
                   <p className="text-slate-500 text-sm">Tindakan ini akan menghapus semua jadwal, skor, dan klasemen secara permanen.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                     onClick={() => setShowResetConfirm(false)}
                     className="py-3 rounded-xl font-bold border border-slate-200 text-slate-500 hover:bg-slate-50"
                   >
                     Batal
                   </button>
                   <button 
                     onClick={handleReset}
                     className="py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg"
                   >
                     Ya, Reset
                   </button>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={() => setIsAdmin(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-black shadow-sm"
          >
            <Unlock className="w-4 h-4" />
            <span>KELUAR</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 md:gap-4 border-b border-slate-200 bg-slate-50/50 p-2 rounded-t-3xl border-t border-x border-slate-100">
        {(['drawing', 'matches', 'scorers', 'teams', 'players', 'officials', 'news', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-black uppercase tracking-wider md:tracking-widest border-b-2 transition-all whitespace-nowrap rounded-t-xl",
              activeTab === tab ? "border-pitch text-pitch bg-white shadow-sm" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            {tab === 'drawing' ? 'Drawing Jadwal' : 
             tab === 'matches' ? 'Pertandingan' : 
             tab === 'scorers' ? 'Pencetak Gol' : 
             tab === 'teams' ? 'Tim' : 
             tab === 'players' ? 'Pemain' : 
             tab === 'officials' ? 'Official' : 
             tab === 'news' ? 'Berita' :
             'Pengaturan'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-b-3xl shadow-xl border-x border-b border-slate-100 overflow-hidden min-h-[600px]">
        {activeTab === 'matches' && <MatchManager teams={teams} matches={matches} onRefresh={onRefresh} />}
        {activeTab === 'scorers' && <ScorerManager teams={teams} players={players} onRefresh={onRefresh} />}
        {activeTab === 'teams' && <TeamManager teams={teams} seededIds={seededIds} onRefresh={onRefresh} />}
        {activeTab === 'players' && <PlayerManager teams={teams} players={players} onRefresh={onRefresh} />}
        {activeTab === 'officials' && <OfficialManager teams={teams} onRefresh={onRefresh} />}
        {activeTab === 'settings' && <SettingsManager onRefresh={onRefresh} />}
        {activeTab === 'news' && <NewsManager onRefresh={onRefresh} />}
        {activeTab === 'drawing' && (
          <div className="p-6 md:p-8">
            <DrawingView 
              teams={teams} 
              seededIds={seededIds} 
              onGenSchedule={() => {
                onRefresh();
                setActiveTab('matches');
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MatchManager({ teams, matches, onRefresh }: { teams: Team[], matches: Match[], onRefresh: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [roundFilter, setRoundFilter] = useState<MatchRound | 'ALL'>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    teamAId: '', teamBId: '', scoreA: 0, scoreB: 0, 
    date: new Date().toISOString().slice(0, 16), 
    status: 'SCHEDULED', round: 'GROUP_STAGE',
    duration: 50
  });

  const [editMatchData, setEditMatchData] = useState<Partial<Match> | null>(null);

  const handleAdd = async () => {
    if (!newMatch.teamAId || !newMatch.teamBId) return;
    if (newMatch.teamAId === newMatch.teamBId) {
      alert("Tim tidak boleh sama!");
      return;
    }
    await store.addMatch({
       ...newMatch,
       id: `m-${Date.now()}`,
    } as Match);
    setShowAdd(false);
    onRefresh();
  };

  const handleUpdateStatus = async (match: Match, status: MatchStatus, scoreA: number, scoreB: number) => {
    await store.updateStatus(match.id, status, scoreA, scoreB);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus pertandingan ini?')) {
      await store.deleteMatch(id);
      onRefresh();
    }
  };

  const startEdit = (m: Match) => {
    setEditingId(m.id);
    setEditMatchData({
      ...m,
      date: new Date(m.date).toISOString().slice(0, 16)
    });
  };

  const saveEdit = async () => {
    if (!editMatchData || !editingId) return;
    await store.updateMatch(editMatchData as Match);
    setEditingId(null);
    setEditMatchData(null);
    onRefresh();
  };

  const filteredMatches = matches
    .filter(m => roundFilter === 'ALL' || m.round === roundFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-700">Kelola Pertandingan</h3>
          <div className="flex space-x-2 mt-2">
            {(['ALL', 'GROUP_STAGE', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRoundFilter(r)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase transition-all",
                  roundFilter === r ? "bg-pitch text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                )}
              >
                {r === 'ALL' ? 'Semua' : r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center space-x-2 bg-pitch text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-pitch-light shadow-lg"
        >
          {showAdd ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAdd ? 'Batal' : 'Tambah Pertandingan'}</span>
        </button>
      </div>

      {showAdd && (
        <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border-2 border-dashed border-slate-200 space-y-6 animate-in slide-in-from-top duration-300">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
               <label className="text-xs font-black uppercase text-slate-400">Tim Kandang (Home)</label>
               <select 
                 className="w-full p-3 rounded-xl border border-slate-200 font-bold"
                 value={newMatch.teamAId}
                 onChange={(e) => setNewMatch({...newMatch, teamAId: e.target.value})}
               >
                  <option value="">Pilih Tim</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
               </select>
             </div>
             <div className="flex items-center justify-center pt-8">
               <span className="font-black text-slate-300">VS</span>
             </div>
             <div className="space-y-2">
               <label className="text-xs font-black uppercase text-slate-400">Tim Tandang (Away)</label>
               <select 
                 className="w-full p-3 rounded-xl border border-slate-200 font-bold"
                 value={newMatch.teamBId}
                 onChange={(e) => setNewMatch({...newMatch, teamBId: e.target.value})}
               >
                  <option value="">Pilih Tim</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
               </select>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-xs font-black uppercase text-slate-400">Babak / Fase</label>
               <select 
                 className="w-full p-3 rounded-xl border border-slate-200 font-bold"
                 value={newMatch.round}
                 onChange={(e) => setNewMatch({...newMatch, round: e.target.value as MatchRound})}
               >
                  <option value="GROUP_STAGE">Group Stage</option>
                   <option value="QUARTER_FINAL">Perempat Final</option>
                  <option value="SEMI_FINAL">Semi Final</option>
                  <option value="FINAL">Final</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-xs font-black uppercase text-slate-400">Waktu Kick-off</label>
               <input 
                 type="datetime-local"
                 className="w-full p-3 rounded-xl border border-slate-200 font-bold"
                 value={newMatch.date}
                 onChange={(e) => setNewMatch({...newMatch, date: e.target.value})}
               />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Durasi (Menit)</label>
                <input 
                  type="number"
                  className="w-full p-3 rounded-xl border border-slate-200 font-bold"
                  value={newMatch.duration}
                  onChange={(e) => setNewMatch({...newMatch, duration: parseInt(e.target.value) || 0})}
                />
             </div>
           </div>

           <div className="flex justify-end pt-4">
              <button 
                onClick={handleAdd}
                className="px-10 py-4 bg-slate-900 text-white rounded-xl font-black flex items-center space-x-2 hover:bg-slate-800 transition-all shadow-xl"
              >
                <Save className="w-5 h-5" />
                <span>Simpan Jadwal</span>
              </button>
           </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredMatches.length === 0 && (
          <div className="text-center py-20 text-slate-400 font-bold italic">
            Tidak ada pertandingan ditemukan untuk filter ini.
          </div>
        )}
        {filteredMatches.map(m => {
          const isEditing = editingId === m.id;

          if (isEditing && editMatchData) {
            return (
              <div key={m.id} className="bg-slate-50 border-2 border-pitch rounded-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Home Team</label>
                    <select 
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                      value={editMatchData.teamAId}
                      onChange={(e) => setEditMatchData({...editMatchData, teamAId: e.target.value})}
                    >
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Away Team</label>
                    <select 
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                      value={editMatchData.teamBId}
                      onChange={(e) => setEditMatchData({...editMatchData, teamBId: e.target.value})}
                    >
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Waktu & Tanggal</label>
                    <input 
                      type="datetime-local"
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                      value={editMatchData.date}
                      onChange={(e) => setEditMatchData({...editMatchData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Skor A</label>
                    <input 
                      type="number"
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                      value={editMatchData.scoreA}
                      onChange={(e) => setEditMatchData({...editMatchData, scoreA: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Skor B</label>
                    <input 
                      type="number"
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                      value={editMatchData.scoreB}
                      onChange={(e) => setEditMatchData({...editMatchData, scoreB: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Durasi (Min)</label>
                    <input 
                      type="number"
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                      value={editMatchData.duration}
                      onChange={(e) => setEditMatchData({...editMatchData, duration: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Status</label>
                    <select 
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                      value={editMatchData.status}
                      onChange={(e) => setEditMatchData({...editMatchData, status: e.target.value as MatchStatus})}
                    >
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="LIVE">LIVE</option>
                      <option value="FINISHED">FINISHED</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                  <button 
                    onClick={() => { setEditingId(null); setEditMatchData(null); }}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-[10px] font-black text-slate-400 uppercase hover:bg-white"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={saveEdit}
                    className="flex items-center space-x-2 px-6 py-2 bg-pitch text-white rounded-lg text-xs font-black shadow-lg active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>SIMPAN PERUBAHAN</span>
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-pitch transition-colors group">
              <div className="flex items-center space-x-6 flex-1">
                 <div className="text-center min-w-[80px]">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{m.round.replace('_', ' ')}</p>
                   <p className="text-[10px] font-bold text-slate-500 mt-1">{new Date(m.date).toLocaleDateString()}</p>
                   <p className="text-[10px] font-bold text-slate-400">{new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    {m.duration && <p className="text-[8px] font-black text-pitch mt-0.5">{m.duration} MIN</p>}
                 </div>
                 <div className="flex-1 flex items-center justify-center space-x-4">
                    <div className="flex items-center justify-end flex-1 space-x-3 overflow-hidden">
                      <span className="font-black truncate text-sm">{teams.find(t => t.id === m.teamAId)?.name}</span>
                      <div className="w-8 h-8 rounded-full bg-slate-50 overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                        {teams.find(t => t.id === m.teamAId)?.logoUrl && <img src={teams.find(t => t.id === m.teamAId)?.logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                      </div>
                    </div>
                    <div className="flex items-center px-4 py-2 bg-slate-50 rounded-xl space-x-3">
                      <span className="font-black text-lg w-6 text-center">{m.scoreA}</span>
                      <span className="font-black text-slate-300">-</span>
                      <span className="font-black text-lg w-6 text-center">{m.scoreB}</span>
                    </div>
                    <div className="flex items-center flex-1 space-x-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-slate-50 overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                        {teams.find(t => t.id === m.teamBId)?.logoUrl && <img src={teams.find(t => t.id === m.teamBId)?.logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                      </div>
                      <span className="font-black flex-1 truncate text-sm">{teams.find(t => t.id === m.teamBId)?.name}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={cn(
                  "px-4 py-2 rounded-lg font-black text-[10px] uppercase",
                  m.status === 'FINISHED' ? "bg-slate-200 text-slate-600" :
                  m.status === 'LIVE' ? "bg-red-500 text-white" : "bg-blue-100 text-blue-600"
                )}>
                  {m.status === 'FINISHED' ? 'SELESAI' : m.status === 'LIVE' ? 'LIVE' : 'TERJADWAL'}
                </div>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(m)}
                    className="p-2 text-slate-400 hover:text-pitch transition-colors"
                    title="Edit Pertandingan"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(m.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScorerManager({ teams, players, onRefresh }: { teams: Team[], players: Player[], onRefresh: () => void }) {
  const [newPlayer, setNewPlayer] = useState({ name: '', teamId: '', goals: 0 });

  const handleAdd = async () => {
    if (!newPlayer.name || !newPlayer.teamId) return;
    await store.addPlayer({
      id: Math.random().toString(36).substr(2, 9),
      ...newPlayer
    });
    setNewPlayer({ name: '', teamId: '', goals: 0 });
    onRefresh();
  };

  const handleUpdateGoals = async (id: string, goals: number) => {
    await store.updatePlayerGoals(id, goals);
    onRefresh();
  };

  return (
    <div className="p-8 space-y-12">
      <div className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 space-y-6">
        <h4 className="font-black text-slate-700 flex items-center space-x-2 underline decoration-pitch underline-offset-4 decoration-2">
          <PlusCircle className="w-5 h-5 text-pitch" />
          <span>Tambah Pencetak Gol</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <input 
            placeholder="Nama Pemain"
            className="p-3 rounded-xl border border-slate-200 font-bold"
            value={newPlayer.name}
            onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
          />
          <select 
            className="p-3 rounded-xl border border-slate-200 font-bold"
            value={newPlayer.teamId}
            onChange={(e) => setNewPlayer({...newPlayer, teamId: e.target.value})}
          >
            <option value="">Pilih Tim</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input 
            type="number"
            placeholder="Jumlah Gol"
            className="p-3 rounded-xl border border-slate-200 font-bold"
            value={newPlayer.goals}
            onChange={(e) => setNewPlayer({...newPlayer, goals: parseInt(e.target.value)})}
          />
          <button 
            onClick={handleAdd}
            className="bg-slate-900 text-white rounded-xl font-black py-3 hover:bg-slate-800 transition-all"
          >
            Simpan Pemain
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {players.map(p => (
           <div key={p.id} className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-between shadow-sm">
             <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 overflow-hidden border border-slate-100 shadow-sm">
                  {teams.find(t => t.id === p.teamId)?.logoUrl ? (
                    <img src={teams.find(t => t.id === p.teamId)?.logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Trophy className="w-6 h-6" />
                  )}
                </div>
                <div>
                   <p className="font-black text-lg text-slate-800">{p.name}</p>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{teams.find(t => t.id === p.teamId)?.name}</p>
                </div>
             </div>
             <div className="flex items-center space-x-4">
                <span className="text-xs font-black text-slate-400">GOL:</span>
                <input 
                  type="number"
                  className="w-16 p-3 rounded-xl border border-slate-200 text-center font-black text-pitch text-lg"
                  value={p.goals}
                  onChange={(e) => handleUpdateGoals(p.id, parseInt(e.target.value))}
                />
             </div>
           </div>
        ))}
      </div>
    </div>
  );
}

function OfficialManager({ teams, onRefresh }: { teams: Team[], onRefresh: () => void }) {
  const [officials, setOfficials] = useState<any[]>([]);
  const [newOfficial, setNewOfficial] = useState({ name: '', role: '', teamId: '' });

  React.useEffect(() => {
    store.getOfficials().then(setOfficials);
  }, [teams]);

  const handleAdd = async () => {
    if (!newOfficial.name || !newOfficial.teamId || !newOfficial.role) return;
    await store.addOfficial({
      id: `off-${Date.now()}`,
      ...newOfficial
    });
    setNewOfficial({ name: '', role: '', teamId: '' });
    store.getOfficials().then(setOfficials);
    onRefresh();
  };

  return (
    <div className="p-8 space-y-12">
      <div className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 space-y-6">
        <h4 className="font-black text-slate-700 flex items-center space-x-2 underline decoration-pitch underline-offset-4 decoration-2">
          <PlusCircle className="w-5 h-5 text-pitch" />
          <span>Tambah Official Tim</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <input 
            placeholder="Nama Official"
            className="p-3 rounded-xl border border-slate-200 font-bold"
            value={newOfficial.name}
            onChange={(e) => setNewOfficial({...newOfficial, name: e.target.value})}
          />
          <input 
            placeholder="Jabatan (e.g. Manajer, Pelatih)"
            className="p-3 rounded-xl border border-slate-200 font-bold"
            value={newOfficial.role}
            onChange={(e) => setNewOfficial({...newOfficial, role: e.target.value})}
          />
          <select 
            className="p-3 rounded-xl border border-slate-200 font-bold"
            value={newOfficial.teamId}
            onChange={(e) => setNewOfficial({...newOfficial, teamId: e.target.value})}
          >
            <option value="">Pilih Tim</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button 
            onClick={handleAdd}
            className="bg-slate-900 text-white rounded-xl font-black py-3 hover:bg-slate-800 transition-all"
          >
            Simpan Official
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {officials.map(o => (
           <div key={o.id} className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-between shadow-sm group">
             <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                   <p className="font-black text-slate-800">{o.name}</p>
                   <p className="text-[10px] font-bold text-pitch uppercase tracking-widest">{o.role}</p>
                   <p className="text-[9px] font-medium text-slate-400 uppercase">{teams.find(t => t.id === o.teamId)?.name}</p>
                </div>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
}

function TeamManager({ teams, seededIds, onRefresh }: { teams: Team[], seededIds: string[], onRefresh: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', logoUrl: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTeam, setEditTeam] = useState<{ name: string, logoUrl: string }>({ name: '', logoUrl: '' });

  const handleAdd = async () => {
    if (!newTeam.name) return;
    const team: Team = {
      id: `t${Date.now()}`,
      name: newTeam.name,
      logoUrl: newTeam.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${newTeam.name}`,
      played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, awayGoals: 0, awayWins: 0, points: 0
    };
    await store.addTeam(team);
    setNewTeam({ name: '', logoUrl: '' });
    setShowAdd(false);
    onRefresh();
  };

  const handleStartEdit = (team: Team) => {
    setEditingId(team.id);
    setEditTeam({ name: team.name, logoUrl: team.logoUrl });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const team = teams.find(t => t.id === editingId);
    if (team) {
      await store.updateTeam({
        ...team,
        name: editTeam.name,
        logoUrl: editTeam.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${editTeam.name}`
      });
      setEditingId(null);
      onRefresh();
    }
  };

  const handleExportExcel = async () => {
    const teams = await store.getTeams();
    const players = await store.getPlayers();
    const officials = await store.getOfficials();

    const wb = XLSX.utils.book_new();

    // Teams Sheet
    const teamsData = teams.map(t => ({
      ID: t.id,
      Nama: t.name,
      LogoURL: t.logoUrl,
      Main: t.played,
      Menang: t.won,
      Seri: t.drawn,
      Kalah: t.lost,
      Gol_Masuk: t.goalsFor,
      Gol_Kemasukan: t.goalsAgainst,
      Gol_Tandang: t.awayGoals,
      Menang_Tandang: t.awayWins,
      Poin: t.points,
      Unggulan: seededIds.includes(t.id) ? 'Ya' : 'Tidak'
    }));
    const teamsWs = XLSX.utils.json_to_sheet(teamsData);
    XLSX.utils.book_append_sheet(wb, teamsWs, "Data Tim");

    // Players Sheet
    const playersData = players.map(p => ({
      ID: p.id,
      Nama: p.name,
      Tim: teams.find(t => t.id === p.teamId)?.name || p.teamId,
      Gol: p.goals
    }));
    const playersWs = XLSX.utils.json_to_sheet(playersData);
    XLSX.utils.book_append_sheet(wb, playersWs, "Data Pemain");

    // Officials Sheet
    const officialsData = officials.map(o => ({
      ID: o.id,
      Nama: o.name,
      Role: o.role,
      Tim: teams.find(t => t.id === o.teamId)?.name || o.teamId,
    }));
    const officialsWs = XLSX.utils.json_to_sheet(officialsData);
    XLSX.utils.book_append_sheet(wb, officialsWs, "Data Official");

    XLSX.writeFile(wb, `GSI_Ciamis_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExport = async () => {
    const data = await store.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_tim_gsi_ciamis_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('Impor data akan menambah tim/pemain baru. Lanjutkan?')) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const success = await store.importData(content);
      if (success) {
        alert('Data berhasil diimpor!');
        onRefresh();
      } else {
        alert('Gagal mengimpor data. Pastikan format file benar.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus tim ini? Semua data terkait mungkin terpengaruh.')) {
      await store.deleteTeam(id);
      onRefresh();
    }
  };

  const toggleSeeded = async (teamId: string) => {
    const newSeeded = seededIds.includes(teamId) 
      ? seededIds.filter(id => id !== teamId)
      : [...seededIds, teamId];
    
    await store.updateSeededIds(newSeeded);
    onRefresh();
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-700">Kelola Tim & Unggulan</h3>
          <p className="text-xs font-bold text-slate-400 italic">Total: {teams.length} Tim</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold transition-all hover:bg-blue-100 cursor-pointer text-xs">
            <Upload className="w-4 h-4" />
            <span>Impor Data</span>
            <input type="file" className="hidden" accept=".json" onChange={handleImport} />
          </label>
          <button 
            onClick={handleExportExcel}
            className="flex items-center space-x-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl font-bold transition-all hover:bg-yellow-100 text-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold transition-all hover:bg-emerald-100 text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Data</span>
          </button>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-slate-800"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tim</span>
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top duration-300">
          <input 
            placeholder="Nama Tim" 
            className="p-3 rounded-xl border border-slate-200 font-bold"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
          />
          <input 
            placeholder="URL Logo (Opsional)" 
            className="p-3 rounded-xl border border-slate-200 font-bold"
            value={newTeam.logoUrl}
            onChange={(e) => setNewTeam({ ...newTeam, logoUrl: e.target.value })}
          />
          <button 
            onClick={handleAdd}
            className="bg-pitch text-white rounded-xl font-black py-3 hover:bg-pitch-light"
          >
            Simpan Tim
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => (
          <div 
            key={team.id} 
            className={cn(
              "p-4 rounded-2xl border transition-all flex flex-col space-y-4",
              seededIds.includes(team.id) 
                ? "bg-yellow-50 border-yellow-200 shadow-md" 
                : "bg-white border-slate-100 hover:border-pitch hover:shadow-sm"
            )}
          >
            {editingId === team.id ? (
              <div className="space-y-3">
                <input 
                  className="w-full p-2 rounded-lg border border-slate-200 text-sm font-bold"
                  value={editTeam.name}
                  onChange={(e) => setEditTeam({ ...editTeam, name: e.target.value })}
                  placeholder="Nama Tim"
                />
                <input 
                  className="w-full p-2 rounded-lg border border-slate-200 text-sm font-bold"
                  value={editTeam.logoUrl}
                  onChange={(e) => setEditTeam({ ...editTeam, logoUrl: e.target.value })}
                  placeholder="URL Logo"
                />
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSaveEdit}
                    className="flex-1 bg-pitch text-white py-2 rounded-lg text-xs font-black flex items-center justify-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>SIMPAN</span>
                  </button>
                  <button 
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-slate-100 text-slate-500 py-2 rounded-lg text-xs font-black flex items-center justify-center space-x-1"
                  >
                    <X className="w-3 h-3" />
                    <span>BATAL</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0">
                    {team.logoUrl && <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                  </div>
                  <div>
                    <p className="font-black text-slate-800">{team.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Kabupaten Ciamis</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleStartEdit(team)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-300 hover:bg-pitch/10 hover:text-pitch transition-all opacity-0 group-hover:opacity-100"
                    title="Edit Tim"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toggleSeeded(team.id)}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      seededIds.includes(team.id)
                        ? "bg-yellow-400 text-white shadow-lg scale-110"
                        : "bg-slate-100 text-slate-300 hover:bg-yellow-100 hover:text-yellow-500"
                    )}
                    title="Tandai sebagai Unggulan"
                  >
                    <Trophy className={cn("w-5 h-5", seededIds.includes(team.id) && "fill-current")} />
                  </button>
                  <button 
                    onClick={() => handleDelete(team.id)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-300 hover:bg-red-100 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    title="Hapus Tim"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayerManager({ teams, players, onRefresh }: { teams: Team[], players: Player[], onRefresh: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [newPlayer, setNewPlayer] = useState({ name: '', position: 'ST', teamId: '', goals: 0 });
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const handleAdd = async () => {
    if (!newPlayer.name || !newPlayer.teamId) return;
    await store.addPlayer({
      id: `p-${Date.now()}`,
      name: newPlayer.name,
      teamId: newPlayer.teamId,
      position: newPlayer.position,
      goals: Number(newPlayer.goals) || 0,
      rating: { pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 }
    });
    setNewPlayer({ name: '', position: 'ST', teamId: '', goals: 0 });
    onRefresh();
  };

  const handleUpdate = async () => {
    if (!editingPlayer || !editingPlayer.name || !editingPlayer.teamId) return;
    await store.updatePlayer({
      ...editingPlayer,
      goals: Number(editingPlayer.goals) || 0
    });
    setEditingPlayer(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pemain ini?')) {
      await store.deletePlayer(id);
      onRefresh();
    }
  };

  const filtered = players.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTeam = teamFilter === 'ALL' || p.teamId === teamFilter;
    return matchSearch && matchTeam;
  });

  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-300">
      {/* Edit Form Modal/Section */}
      {editingPlayer && (
        <div className="bg-amber-50 p-8 rounded-3xl border-2 border-dashed border-amber-250 space-y-6">
          <h4 className="font-black text-amber-800 flex items-center space-x-2">
            <Edit2 className="w-5 h-5 animate-pulse" />
            <span>Edit Profil Pemain</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Pemain</label>
              <input 
                className="w-full p-3 rounded-xl border border-amber-200 font-bold bg-white focus:outline-none focus:border-amber-500"
                value={editingPlayer.name}
                onChange={(e) => setEditingPlayer({...editingPlayer, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Posisi</label>
              <select 
                className="w-full p-3 rounded-xl border border-amber-200 font-bold bg-white focus:outline-none focus:border-amber-500"
                value={editingPlayer.position || 'ST'}
                onChange={(e) => setEditingPlayer({...editingPlayer, position: e.target.value})}
              >
                <option value="GK">GK (Kiper)</option>
                <option value="CB">CB (Bek Tengah)</option>
                <option value="LB">LB (Bek Kiri)</option>
                <option value="RB">RB (Bek Kanan)</option>
                <option value="CM">CM (Gelandang Tengah)</option>
                <option value="LM">LM (Sayap Kiri)</option>
                <option value="RM">RM (Sayap Kanan)</option>
                <option value="CAM">CAM (Gelandang Serang)</option>
                <option value="ST">ST (Penyerang)</option>
                <option value="LW">LW (Penyerang Sayap Kiri)</option>
                <option value="RW">RW (Penyerang Sayap Kanan)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Jumlah Gol</label>
              <input 
                type="number"
                className="w-full p-3 rounded-xl border border-amber-200 font-bold bg-white focus:outline-none focus:border-amber-500"
                value={editingPlayer.goals}
                onChange={(e) => setEditingPlayer({...editingPlayer, goals: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Klub / Tim</label>
              <select 
                className="w-full p-3 rounded-xl border border-amber-200 font-bold bg-white focus:outline-none focus:border-amber-500"
                value={editingPlayer.teamId}
                onChange={(e) => setEditingPlayer({...editingPlayer, teamId: e.target.value})}
              >
                <option value="">Pilih Tim</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => setEditingPlayer(null)}
              className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-500 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleUpdate}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-lg transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      )}

      {/* Add Form */}
      {!editingPlayer && (
        <div className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 space-y-6">
          <h4 className="font-black text-slate-700 flex items-center space-x-2 underline decoration-pitch underline-offset-4 decoration-2">
            <PlusCircle className="w-5 h-5 text-pitch" />
            <span>Tambah Pemain Baru</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <input 
              placeholder="Nama Lengkap Pemain"
              className="p-3 rounded-xl border border-slate-200 font-bold text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-pitch"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
            />
            <select 
              className="p-3 rounded-xl border border-slate-200 font-bold text-slate-600 bg-white focus:outline-none focus:border-pitch"
              value={newPlayer.position}
              onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})}
            >
              <option value="GK">GK (Kiper)</option>
              <option value="CB">CB (Bek Tengah)</option>
              <option value="LB">LB (Bek Kiri)</option>
              <option value="RB">RB (Bek Kanan)</option>
              <option value="CM">CM (Gelandang Tengah)</option>
              <option value="LM">LM (Sayap Kiri)</option>
              <option value="RM">RM (Sayap Kanan)</option>
              <option value="CAM">CAM (Gelandang Serang)</option>
              <option value="ST">ST (Penyerang)</option>
              <option value="LW">LW (Penyerang Sayap Kiri)</option>
              <option value="RW">RW (Penyerang Sayap Kanan)</option>
            </select>
            <select 
              className="p-3 rounded-xl border border-slate-200 font-bold text-slate-600 bg-white focus:outline-none focus:border-pitch"
              value={newPlayer.teamId}
              onChange={(e) => setNewPlayer({...newPlayer, teamId: e.target.value})}
            >
              <option value="">Pilih Tim</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button 
              onClick={handleAdd}
              disabled={!newPlayer.name || !newPlayer.teamId}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black py-3 px-6 shadow-lg transition-all disabled:opacity-50 disabled:hover:bg-slate-900"
            >
              Simpan Pemain
            </button>
          </div>
        </div>
      )}

      {/* List and Actions */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Cari nama pemain..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 text-sm focus:outline-none focus:border-pitch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full md:w-auto p-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 bg-white text-sm"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <option value="ALL">Semua Tim</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => {
            const team = teams.find(t => t.id === p.teamId);
            return (
              <div key={p.id} className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                <div className="space-y-1">
                  <p className="font-extrabold text-slate-800 tracking-tight">{p.name}</p>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {p.position || 'ST'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 capitalize truncate max-w-[120px]">
                      {team?.name || '-'}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 mt-1 inline-block">{p.goals || 0} GOL</p>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 md:transition-opacity">
                  <button
                    onClick={() => setEditingPlayer(p)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Pemain"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Pemain"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SettingsManager({ onRefresh }: { onRefresh: () => void }) {
  const [settings, setSettings] = useState<CompetitionSettings | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    store.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    await store.updateSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    onRefresh();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Silakan upload file gambar di bawah 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSettings(prev => prev ? { ...prev, heroImageUrl: reader.result } : null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Silakan upload file gambar di bawah 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSettings(prev => prev ? { ...prev, logoUrl: reader.result } : null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!settings) return <div className="p-8 font-bold text-center text-slate-500">Memuat Pengaturan...</div>;

  return (
    <div className="p-8 space-y-8 max-w-2xl animate-in fade-in duration-300">
      <div>
        <h3 className="text-xl font-black text-slate-850 uppercase tracking-tight flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span>Pengaturan Informasi Kompetisi</span>
        </h3>
        <p className="text-slate-500 text-sm mt-1">Ubah judul, sub-judul, keterangan, lokasi, dan teks kaki kompetisi secara realtime.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Nama Kompetisi</label>
          <input
            type="text"
            className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-700 focus:outline-none focus:border-pitch focus:ring-1 focus:ring-pitch"
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            placeholder="e.g. GALA SISWA INDONESIA"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Lokasi / Tahun / Judul Utama</label>
          <input
            type="text"
            className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-700 focus:outline-none focus:border-pitch focus:ring-1 focus:ring-pitch"
            value={settings.location}
            onChange={(e) => setSettings({ ...settings, location: e.target.value })}
            placeholder="e.g. KABUPATEN CIAMIS 2026"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Sub-Judul / Slogan</label>
          <input
            type="text"
            className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-700 focus:outline-none focus:border-pitch focus:ring-1 focus:ring-pitch"
            value={settings.subTitle}
            onChange={(e) => setSettings({ ...settings, subTitle: e.target.value })}
            placeholder="e.g. Satu Hati, Satu Nyali, Juara!"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Keterangan / Deskripsi Kompetisi</label>
          <textarea
            className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-700 h-24 focus:outline-none focus:border-pitch focus:ring-1 focus:ring-pitch"
            value={settings.description}
            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            placeholder="Masukkan keterangan lengkap kompetisi disini..."
          />
        </div>

        {/* Hero Image Management */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Logo Hero / Gambar Beranda</label>
            <span className="text-[10px] font-bold text-slate-400">Dimensi Rekomendasi: Landscape (16:9)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Live Preview */}
            <div className="col-span-1 border border-slate-200 rounded-xl overflow-hidden aspect-video relative group bg-slate-200 shadow-inner flex items-center justify-center">
              {settings.heroImageUrl ? (
                <>
                  <img 
                    src={settings.heroImageUrl} 
                    alt="Preview hero" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => setSettings({ ...settings, heroImageUrl: "" })}
                    className="absolute top-1.5 right-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                    title="Hapus gambar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <span className="text-xs font-black text-slate-400">Tanpa Gambar</span>
              )}
            </div>

            {/* Input & Upload */}
            <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Link URL Gambar Langsung</span>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-pitch"
                  value={settings.heroImageUrl || ""}
                  onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                  placeholder="https://example.com/logo.jpg"
                />
              </div>

              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center space-x-2 bg-white hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl cursor-pointer text-[11px] font-bold text-slate-600 shadow-sm transition-all">
                  <Upload className="w-3.5 h-3.5 text-pitch" />
                  <span>Upload File Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, heroImageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80" })}
                  className="bg-slate-200 hover:bg-slate-300 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all border border-slate-250"
                >
                  Bawaan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Header Logo Management */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Logo Header / Icon Pojok Kiri</label>
            <span className="text-[10px] font-bold text-slate-400">Dimensi Rekomendasi: Square (1:1) / Bulat</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Live Preview */}
            <div className="col-span-1 border border-slate-200 rounded-xl overflow-hidden aspect-square h-24 w-24 relative group bg-slate-200 shadow-inner flex items-center justify-center mx-auto md:mx-0">
              {settings.logoUrl ? (
                <>
                  <img 
                    src={settings.logoUrl} 
                    alt="Preview logo" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => setSettings({ ...settings, logoUrl: "" })}
                    className="absolute top-1.5 right-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                    title="Hapus logo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="bg-pitch p-3 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
              )}
            </div>

            {/* Input & Upload */}
            <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Link URL Logo Langsung</span>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-pitch"
                  value={settings.logoUrl || ""}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo-circle.png"
                />
              </div>

              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center space-x-2 bg-white hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl cursor-pointer text-[11px] font-bold text-slate-600 shadow-sm transition-all">
                  <Upload className="w-3.5 h-3.5 text-pitch" />
                  <span>Upload File Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleHeaderIconUpload}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, logoUrl: "" })}
                  className="bg-slate-200 hover:bg-slate-300 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all border border-slate-250"
                >
                  Gunakan Trophy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Teks Hak Cipta / Footer</label>
          <input
            type="text"
            className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-700 focus:outline-none focus:border-pitch focus:ring-1 focus:ring-pitch"
            value={settings.footerText}
            onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
            placeholder="e.g. MGMP PJOK Kabupaten Ciamis"
          />
        </div>

        <div className="flex items-center space-x-4 pt-4">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-pitch hover:bg-pitch-light text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Simpan Pengaturan</span>
          </button>

          {isSaved && (
            <span className="text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-100 flex items-center">
              <Check className="w-4 h-4 mr-1.5" />
              Berhasil Disimpan!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function NewsManager({ onRefresh }: { onRefresh: () => void }) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    const data = await store.getNews();
    setNews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openAdd = () => {
    setEditingArticle(null);
    setTitle('');
    setContent('');
    setImageUrl('');
    setDate(new Date().toISOString().slice(0, 10));
    setAuthor('Panitia GSI Ciamis');
    setShowForm(true);
  };

  const openEdit = (art: NewsArticle) => {
    setEditingArticle(art);
    setTitle(art.title);
    setContent(art.content);
    setImageUrl(art.imageUrl || '');
    setDate(art.date);
    setAuthor(art.author || '');
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Silakan upload file di bawah 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Judul dan Isi Berita harus diisi!');
      return;
    }

    if (editingArticle) {
      // Edit
      const updated: NewsArticle = {
        ...editingArticle,
        title,
        content,
        imageUrl,
        date,
        author
      };
      await store.updateNews(updated);
    } else {
      // Add
      const added: NewsArticle = {
        id: 'news_' + Date.now(),
        title,
        content,
        imageUrl,
        date,
        author
      };
      await store.addNews(added);
    }

    setShowForm(false);
    fetchNews();
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      await store.deleteNews(id);
      fetchNews();
      onRefresh();
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-850 uppercase tracking-tight flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-pitch" />
            <span>Pengaturan Berita Turnamen</span>
          </h3>
          <p className="text-slate-500 text-sm mt-1">Tambahkan, edit, atau hapus berita dan pengumuman terkait turnamen GSI Ciamis.</p>
        </div>
        {!showForm && (
          <button
            onClick={openAdd}
            className="flex items-center space-x-2 bg-pitch hover:bg-pitch-light text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Berita Baru</span>
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSave} className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-6 animate-in fade-in duration-200 max-w-3xl">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider">
              {editingArticle ? 'Edit Artikel Berita' : 'Tambah Artikel Berita Baru'}
            </h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Judul Berita</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pembukaan GSI Ciamis Berlangsung Meriah"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-pitch focus:ring-1 focus:ring-pitch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Penulis</label>
                <input
                  type="text"
                  placeholder="e.g. Panitia Resmi"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-pitch focus:ring-1 focus:ring-pitch"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Tanggal Diterbitkan</label>
                <input
                  type="date"
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-pitch focus:ring-1 focus:ring-pitch"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Gambar Banner Berita</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden aspect-video relative group bg-slate-200 shadow-inner flex items-center justify-center">
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 bg-slate-950/80 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                        title="Hapus gambar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-black text-slate-400">Tanpa Gambar Berita</span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Link URL Gambar Langsung</span>
                  <input
                    type="text"
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 focus:outline-none focus:border-pitch"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <label className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl cursor-pointer text-xs font-bold text-slate-600 transition-all shadow-sm">
                  <Upload className="w-4 h-4 text-pitch" />
                  <span>Upload File Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Isi Berita Lengkap</label>
            <textarea
              required
              rows={6}
              placeholder="Masukkan isi lengkap berita di sini..."
              className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-700 text-xs focus:outline-none focus:border-pitch focus:ring-1 focus:ring-pitch"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center space-x-3">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-pitch hover:bg-pitch-light text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Berita</span>
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-black hover:bg-slate-150 transition-all uppercase tracking-wider"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-pitch border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Memuat Berita...</p>
            </div>
          ) : news.length > 0 ? (
            <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm bg-white divide-y divide-slate-150">
              {news.map((item) => (
                <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-800 truncate max-w-sm md:max-w-md">{item.title}</h4>
                      <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>Oleh: {item.author || '-'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-black flex items-center space-x-1"
                      title="Edit Berit"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-pitch" />
                      <span className="hidden md:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg text-xs font-black flex items-center space-x-1"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span className="hidden md:inline">Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-150 rounded-3xl bg-slate-50/50 max-w-md mx-auto space-y-3">
              <Newspaper className="w-10 h-10 text-slate-350 mx-auto" />
              <div>
                <h5 className="font-black text-slate-700 uppercase">Belum ada berita</h5>
                <p className="text-slate-400 text-xs mt-1">Silakan klik tombol "Tambah Berita Baru" untuk membuat berita utama pertama Anda.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
