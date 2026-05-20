import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Team, Match } from '../types';
import { store } from '../services/store';
import { Zap, Shuffle, RotateCcw, Box, ArrowRight, Save, ShieldCheck, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DrawingView({ teams, seededIds, onGenSchedule }: { teams: Team[], seededIds: string[], onGenSchedule: () => void }) {
  const [matchCounts, setMatchCounts] = useState<Record<string, number>>({});
  const [pairs, setPairs] = useState<{ teamA: Team, teamB: Team }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [teamGroups, setTeamGroups] = useState<Record<string, string>>({});

  // Scheduling Config
  const [scheduleConfig, setScheduleConfig] = useState({
    startDate: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    halfDuration: 25,
    halftimeBreak: 5,
    matchInterval: 10,
    lunchStart: '12:00',
    lunchEnd: '13:00'
  });

  // Initialize team groups
  useEffect(() => {
    const initial: Record<string, string> = {};
    const seeded = teams.filter(t => seededIds.includes(t.id));
    const unseeded = teams.filter(t => !seededIds.includes(t.id));
    
    // Assign seeded to groups A-D
    const groupLabels = ['A', 'B', 'C', 'D'];
    seeded.forEach((t, i) => initial[t.id] = groupLabels[i % 4]);
    
    // Assign unseeded distributedly
    unseeded.forEach((t, i) => {
      initial[t.id] = groupLabels[i % 4]; 
    });
    setTeamGroups(initial);
  }, [teams, seededIds]);

  // Derived groups object
  const groups = useMemo(() => {
    const g: Record<string, Team[]> = { 'A': [], 'B': [], 'C': [], 'D': [] };
    teams.forEach(t => {
      const gLabel = teamGroups[t.id] || 'A';
      if (g[gLabel]) g[gLabel].push(t);
    });
    return g;
  }, [teams, teamGroups]);

  useEffect(() => {
    const counts: Record<string, number> = {};
    teams.forEach(t => counts[t.id] = 0);
    pairs.forEach(p => {
      counts[p.teamA.id]++;
      counts[p.teamB.id]++;
    });
    setMatchCounts(counts);
  }, [pairs, teams]);

  const getTeamGroup = (teamId: string) => teamGroups[teamId] || 'A';

  const drawFixture = () => {
    // 5 teams per group, each plays 4 matches in a full round robin
    // But user asked for 3 matches max previously. 
    // I will stick to 3 if requested, but check constraints.
    const availableTeams = teams.filter(t => (matchCounts[t.id] || 0) < 2);
    if (availableTeams.length < 2) return;

    setIsDrawing(true);
    setTimeout(() => {
      const possibleA = [...availableTeams];
      const teamA = possibleA[Math.floor(Math.random() * possibleA.length)];
      const groupA = getTeamGroup(teamA.id);

      const alreadyPlayed = pairs
        .filter(p => p.teamA.id === teamA.id || p.teamB.id === teamA.id)
        .map(p => p.teamA.id === teamA.id ? p.teamB.id : p.teamA.id);

      const possibleB = availableTeams.filter(t => {
        if (t.id === teamA.id) return false;
        if (alreadyPlayed.includes(t.id)) return false;
        const groupB = getTeamGroup(t.id);
        if (groupA !== groupB) return false; // Must be in same group
        return true;
      });

      if (possibleB.length === 0) {
        alert("Tidak ada lawan yang valid dalam grup ini!");
        setIsDrawing(false);
        return;
      }

      const teamB = possibleB[Math.floor(Math.random() * possibleB.length)];
      setPairs([...pairs, { teamA, teamB }]);
      setIsDrawing(false);
    }, 600);
  };

  const autoDrawAll = () => {
    setIsDrawing(true);
    let currentPairs: { teamA: Team, teamB: Team }[] = [];
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      let stuck = false;
      let tempPairs: { teamA: Team, teamB: Team }[] = [];
      let tempCounts: Record<string, number> = {};
      teams.forEach(t => tempCounts[t.id] = 0);

      const groupLabels = ['A', 'B', 'C', 'D'];
      
      for (const gLabel of groupLabels) {
        const groupTeams = teams.filter(t => getTeamGroup(t.id) === gLabel);
        // Target 2 matches per team in a group of 5
        const targetMatchesPerGroup = (groupTeams.length * 2) / 2;

        for (let m = 0; m < targetMatchesPerGroup; m++) {
          const needy = groupTeams
            .filter(t => tempCounts[t.id] < 2)
            .sort((a, b) => tempCounts[b.id] - tempCounts[a.id]);
          
          if (needy.length < 2) continue; // Might be done with this group

          const teamA = needy[0];
          const played = tempPairs
            .filter(p => p.teamA.id === teamA.id || p.teamB.id === teamA.id)
            .map(p => p.teamA.id === teamA.id ? p.teamB.id : p.teamA.id);

          const targets = needy.filter(t => 
            t.id !== teamA.id && 
            !played.includes(t.id)
          );

          if (targets.length === 0) {
            stuck = true;
            break;
          }

          const teamB = targets[Math.floor(Math.random() * targets.length)];
          tempPairs.push({ teamA, teamB });
          tempCounts[teamA.id]++;
          tempCounts[teamB.id]++;
        }
        if (stuck) break;
      }

      if (!stuck) {
        currentPairs = tempPairs;
        break;
      }
      attempts++;
    }

    if (attempts >= maxAttempts) {
      alert("Gagal membuat jadwal otomatis. Coba lagi.");
    } else {
      setPairs(currentPairs);
    }
    setIsDrawing(false);
  };

  const resetDraw = () => {
    setPairs([]);
  };

  const handleMoveGroup = (teamId: string, targetGroup: string) => {
    if (seededIds.includes(teamId)) return; // Seeded are fixed
    setTeamGroups(prev => ({
      ...prev,
      [teamId]: targetGroup
    }));
  };

  const handleSaveSchedule = async () => {
    if (pairs.length === 0) return;
    setIsSaving(true);
    try {
      const groupLabels = ['A', 'B', 'C', 'D'];
      const newMatches: Partial<Match>[] = [];
      
      const totalDurationPerMatch = (scheduleConfig.halfDuration * 2) + scheduleConfig.halftimeBreak;
      const totalInterval = totalDurationPerMatch + scheduleConfig.matchInterval;

      // Group matches by group
      const matchesByGroup: Record<string, {teamA: Team, teamB: Team}[]> = { 'A': [], 'B': [], 'C': [], 'D': [] };
      pairs.forEach(p => {
        const group = getTeamGroup(p.teamA.id);
        matchesByGroup[group].push(p);
      });

      let matchGlobalIdx = 0;
      groupLabels.forEach((gLabel, gIdx) => {
        const groupPairs = matchesByGroup[gLabel];
        
        // Each group starts at 08:00 on its own day (per user request)
        const groupBaseDate = new Date(scheduleConfig.startDate);
        groupBaseDate.setDate(groupBaseDate.getDate() + gIdx);
        
        const [startH, startM] = scheduleConfig.startTime.split(':').map(Number);
        const [lunchSH, lunchSM] = scheduleConfig.lunchStart.split(':').map(Number);
        const [lunchEH, lunchEM] = scheduleConfig.lunchEnd.split(':').map(Number);

        const groupStartTime = new Date(groupBaseDate);
        groupStartTime.setHours(startH, startM, 0, 0);

        const lunchStartTime = new Date(groupBaseDate);
        lunchStartTime.setHours(lunchSH, lunchSM, 0, 0);

        const lunchEndTime = new Date(groupBaseDate);
        lunchEndTime.setHours(lunchEH, lunchEM, 0, 0);

        let currentMatchTime = new Date(groupStartTime);

        groupPairs.forEach((pair, pIdx) => {
          // Check if current time + match duration overlaps lunch
          const matchEndTime = new Date(currentMatchTime.getTime() + totalDurationPerMatch * 60000);
          
          if (matchEndTime > lunchStartTime && currentMatchTime < lunchEndTime) {
            // Push to after lunch
            currentMatchTime = new Date(lunchEndTime);
          }

          newMatches.push({
            id: `m-${Date.now()}-${matchGlobalIdx}`,
            teamAId: pair.teamA.id,
            teamBId: pair.teamB.id,
            scoreA: 0,
            scoreB: 0,
            status: 'SCHEDULED',
            round: 'GROUP_STAGE',
            date: currentMatchTime.toISOString(),
            duration: totalDurationPerMatch
          });
          
          currentMatchTime = new Date(currentMatchTime.getTime() + totalInterval * 60000);
          matchGlobalIdx++;
        });
      });

      for (const m of newMatches) {
        await store.addMatch(m as Match);
      }
      
      // Assign groups to teams in store
      for (const team of teams) {
        await store.updateTeam({
          ...team,
          group: teamGroups[team.id]
        });
      }

      onGenSchedule();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const totalMatchesTarget = (teams.length * 2) / 2;
  const progress = (pairs.length / totalMatchesTarget) * 100;

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black italic text-pitch-dark tracking-tighter">GROUP STAGE DRAWING</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto italic">
          Setiap tim bertanding 2 kali dalam satu grup. Tim unggulan otomatis terbagi di grup yang berbeda.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="flex space-x-3">
            <button 
              disabled={progress >= 100 || isDrawing}
              onClick={drawFixture}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-full font-black text-white shadow-xl transition-all active:scale-95",
                progress >= 100 ? "bg-slate-300 pointer-events-none" : "bg-pitch hover:bg-pitch-light"
              )}
            >
              <Shuffle className={cn("w-5 h-5", isDrawing && "animate-spin")} />
              <span>{isDrawing ? 'Undi...' : 'Undi Manual'}</span>
            </button>

            <button 
              disabled={progress >= 100 || isDrawing}
              onClick={autoDrawAll}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-full font-black text-white shadow-xl transition-all active:scale-95",
                progress >= 100 ? "bg-slate-300 pointer-events-none" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              <Zap className="w-5 h-5" />
              <span>Generate Otomatis</span>
            </button>
            
            <button 
              onClick={resetDraw}
              className="flex items-center space-x-2 px-4 py-3 rounded-full font-black text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={handleSaveSchedule}
            disabled={isSaving || progress < 100}
            className={cn(
              "flex items-center space-x-2 px-8 py-3 rounded-full font-black text-white shadow-xl transition-all",
              progress < 100 ? "bg-slate-300 pointer-events-none" : "bg-green-600 hover:bg-green-700 active:scale-95"
            )}
          >
            <Save className={cn("w-5 h-5", isSaving && "animate-pulse")} />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Jadwal'}</span>
          </button>
        </div>

        {progress >= 100 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 p-6 rounded-3xl border border-slate-200 max-w-4xl mx-auto space-y-6"
          >
            <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs flex items-center justify-center">
              <Zap className="w-4 h-4 mr-2 text-pitch" />
              Konfigurasi Jadwal
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 block text-left">TANGGAL MULAI</label>
                <input 
                  type="date"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                  value={scheduleConfig.startDate}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 block text-left">MULAI (PER HARI)</label>
                <input 
                  type="time"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                  value={scheduleConfig.startTime}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, startTime: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 block text-left">MENIT / BABAK</label>
                <input 
                  type="number"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                  value={scheduleConfig.halfDuration}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, halfDuration: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 block text-left">ISTIRAHAT (MENIT)</label>
                <input 
                  type="number"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                  value={scheduleConfig.matchInterval}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, matchInterval: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="flex items-center justify-center space-x-8 pt-2">
              <div className="flex items-center space-x-3">
                 <span className="text-[10px] font-black text-slate-400 uppercase">Istirahat Siang:</span>
                 <input 
                  type="time"
                  className="p-2 rounded-lg border border-slate-200 text-xs font-bold w-24"
                  value={scheduleConfig.lunchStart}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, lunchStart: e.target.value})}
                />
                <span className="text-slate-300 font-bold">-</span>
                <input 
                  type="time"
                  className="p-2 rounded-lg border border-slate-200 text-xs font-bold w-24"
                  value={scheduleConfig.lunchEnd}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, lunchEnd: e.target.value})}
                />
              </div>
            </div>
            <p className="text-[9px] font-bold text-slate-400 italic">
              * Setiap grup akan dijadwalkan pada hari yang berbeda dimulai dari tanggal yang dipilih.
            </p>
          </motion.div>
        )}

        <div className="max-w-md mx-auto space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
            <span>Progress Drawing</span>
            <span>{pairs.length} / {totalMatchesTarget} Pertandingan</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-pitch"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Group Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['A', 'B', 'C', 'D'].map(gLabel => (
            <div key={gLabel} className="space-y-3">
              <div className={cn(
                "p-3 rounded-2xl border-2 border-dashed flex items-center justify-center space-x-2",
                "border-slate-200 bg-slate-50/50"
              )}>
                <Trophy className="w-4 h-4 text-slate-400" />
                <span className="font-black text-xs uppercase tracking-widest text-slate-500">Group {gLabel}</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {groups[gLabel]?.map(team => (
                  <div 
                    key={team.id}
                    className={cn(
                      "p-2 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-2 transition-all group/team",
                      (matchCounts[team.id] || 0) >= 2 ? "opacity-30 grayscale" : "hover:border-pitch hover:shadow-md"
                    )}
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0">
                      {team.logoUrl && <img src={team.logoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <p className="text-[10px] font-bold text-slate-700 truncate">{team.name}</p>
                      {seededIds.includes(team.id) && <p className="text-[7px] text-yellow-600 font-black">UNGGULAN</p>}
                    </div>

                    {/* Group Selector for Non-Seeded */}
                    {!seededIds.includes(team.id) && pairs.length === 0 && (
                      <div className="flex space-x-0.5 opacity-0 group-hover/team:opacity-100 transition-opacity">
                        {['A', 'B', 'C', 'D'].map(g => (
                          <button
                            key={g}
                            onClick={() => handleMoveGroup(team.id, g)}
                            className={cn(
                              "w-4 h-4 rounded-md text-[8px] font-black flex items-center justify-center transition-colors",
                              teamGroups[team.id] === g ? "bg-pitch text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                            )}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex space-x-0.5">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i < (matchCounts[team.id] || 0) ? "bg-pitch" : "bg-slate-100")} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black italic flex items-center space-x-2 text-pitch">
            <Zap className="w-6 h-6" />
            <span>Hasil Undian ({pairs.length})</span>
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            <AnimatePresence>
              {pairs.map((pair, idx) => (
                <motion.div
                  key={`${pair.teamA.id}-${pair.teamB.id}-${idx}`}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center space-x-3 flex-1 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0">
                      {pair.teamA.logoUrl && <img src={pair.teamA.logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                    </div>
                    <span className={cn("font-black text-xs truncate", seededIds.includes(pair.teamA.id) && "text-yellow-600")}>{pair.teamA.name}</span>
                  </div>
                  <div className="px-4 flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-300">VS</span>
                  </div>
                  <div className="flex items-center space-x-3 flex-1 justify-end overflow-hidden">
                    <span className={cn("font-black text-xs text-right truncate", seededIds.includes(pair.teamB.id) && "text-yellow-600")}>{pair.teamB.name}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0">
                      {pair.teamB.logoUrl && <img src={pair.teamB.logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
