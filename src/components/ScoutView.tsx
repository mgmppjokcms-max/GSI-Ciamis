import React, { useState } from 'react';
import { Player, Team, PlayerRating, Match, getAge } from '../types';
import { store } from '../services/store';
import { 
  Award, 
  Search, 
  Star, 
  Edit3, 
  User, 
  Sparkles, 
  Save, 
  X, 
  Activity,
  Flame,
  Zap,
  RotateCcw,
  PlusCircle,
  TrendingUp,
  Sliders,
  ChevronRight,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

// Helper to determine tier & style based on FUT overall
export function getRatingDetails(overall: number) {
  if (overall >= 80) {
    return {
      cardBg: "bg-gradient-to-b from-yellow-100 via-yellow-250 to-amber-400 border-amber-400 text-amber-950 shadow-yellow-200/50",
      badgeColor: "bg-amber-950 text-yellow-300 border-amber-300",
      tierLabel: "GOLD",
      starColor: "text-amber-500",
      textMuted: "text-amber-900/60"
    };
  } else if (overall >= 70) {
    return {
      cardBg: "bg-gradient-to-b from-slate-150 via-slate-200 to-slate-400 border-slate-400 text-slate-900 shadow-slate-200/50",
      badgeColor: "bg-slate-800 text-slate-100 border-slate-500",
      tierLabel: "SILVER",
      starColor: "text-slate-600",
      textMuted: "text-slate-900/60"
    };
  } else {
    return {
      cardBg: "bg-gradient-to-b from-amber-100 via-orange-100 to-amber-700 border-amber-800 text-amber-950 shadow-orange-100/50",
      badgeColor: "bg-amber-900 text-amber-100 border-amber-500",
      tierLabel: "BRONZE",
      starColor: "text-amber-800",
      textMuted: "text-amber-950/60"
    };
  }
}

// FUT Player Card Component
export function FutCard({ player, team, onClick, globalShowCustom = false }: { player: Player, team?: Team, onClick?: () => void, globalShowCustom?: boolean, key?: string }) {
  const [showSecondaryState, setShowSecondaryState] = useState(false);
  
  const hasSecondary = !!(player.secondaryPosition && player.secondaryRating);
  const isSecondaryActive = showSecondaryState && hasSecondary;

  const rating = isSecondaryActive && player.secondaryRating
    ? player.secondaryRating
    : (player.rating || { pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 });

  const position = isSecondaryActive && player.secondaryPosition
    ? player.secondaryPosition
    : (player.position || 'ST');

  const overall = Math.round((rating.pac + rating.sho + rating.pas + rating.dri + rating.def + rating.phy) / 6);
  const { cardBg, badgeColor, tierLabel, textMuted } = getRatingDetails(overall);
  const [localShowCustom, setLocalShowCustom] = useState(false);

  const hasCustom = player.customAttributes && player.customAttributes.length > 0;
  const displayingCustom = (localShowCustom || globalShowCustom) && hasCustom;
  const isGK = position.toUpperCase() === 'GK';

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "relative w-52 h-76 rounded-2xl p-4 flex flex-col justify-between border-2 shadow-xl cursor-pointer overflow-hidden group select-none transition-all",
        cardBg
      )}
    >
      {/* Shimmer overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -rotate-45 pointer-events-none transition-transform duration-1000 group-hover:translate-x-full" style={{ transform: 'translateX(-100%)', opacity: overall >= 80 ? '0.4' : '0.2' }} />

      {/* Custom attributes toggler badge on card face */}
      {hasCustom && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLocalShowCustom(!localShowCustom);
          }}
          className="absolute top-2 right-2 z-30 bg-slate-900/90 hover:bg-slate-800 text-yellow-400 hover:text-white border border-yellow-400/50 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase transition-all shadow-md"
          title="Klik untuk flip ke Atribut Kustom"
        >
          {displayingCustom ? "📊 FIFA" : "✨ CATATAN"}
        </button>
      )}

      {/* Top Banner Stats */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black tracking-tight filter drop-shadow-sm">{overall}</span>
          <span className="text-xs font-black tracking-widest uppercase mt-0.5 bg-black/5 px-1.5 py-0.5 rounded">{position}</span>
          {player.jerseyNumber !== undefined && player.jerseyNumber !== null && (
            <span className="text-[10px] font-black tracking-wider uppercase mt-1 bg-red-600 text-white px-2 py-0.5 rounded shadow-sm border border-red-500 leading-none">
              #{player.jerseyNumber}
            </span>
          )}
          {hasSecondary && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowSecondaryState(!showSecondaryState);
              }}
              className="mt-1.5 px-2 py-0.5 rounded bg-slate-900 text-yellow-300 hover:bg-black text-[7px] font-black tracking-wider uppercase border border-amber-500/40 cursor-pointer"
              title="Klik untuk melihat Posisi Utama atau Posisi Tambahan"
            >
              🔄 {isSecondaryActive ? 'Tambahan' : 'Utama'}
            </button>
          )}
          
          {/* USIA/AGE Badge replacing ID flag */}
          <div className="mt-2 text-center" title="Usia Pemain">
            <span className="text-[7.5px] font-black text-white bg-slate-900 px-1.5 py-0.5 rounded tracking-wider uppercase border border-slate-750/30 font-sans block min-w-[32px]">
              {getAge(player.birthDate)} THN
            </span>
          </div>

          {/* Logo and Full Team Name on Card Face */}
          <div className="flex flex-row items-center justify-center mt-2.5 w-16 -mx-1 gap-1">
            {team?.logoUrl ? (
              <img src={team.logoUrl} alt={team.name} className="w-4 h-4 rounded-full object-cover border border-black/10 shrink-0" referrerPolicy="no-referrer" />
            ) : null}
            <span className="text-[7px] font-black leading-tight bg-black/10 px-1 py-0.5 rounded uppercase text-center max-w-[48px] truncate" title={team?.name || 'GSI'}>
              {team?.name || 'GSI'}
            </span>
          </div>
        </div>

        {/* Player Silhouette Drawing / Photo */}
        <div className="relative w-24 h-24 flex items-end justify-center overflow-hidden">
          <div className="absolute inset-0 rounded-full bg-black/5 flex items-center justify-center">
            {player.photoUrl ? null : team?.logoUrl ? (
              <img src={team.logoUrl} alt="avatar" className="w-14 h-14 rounded-full object-cover opacity-15 filter grayscale" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-12 h-12 text-black/10" />
            )}
          </div>
          {player.photoUrl ? (
            <img 
              src={player.photoUrl} 
              alt={player.name} 
              className="w-full h-full object-cover object-top z-10 absolute bottom-0 select-none" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = ''; 
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="z-10 font-bold text-4xl text-white/20 uppercase tracking-tighter">
              {player.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Name banner */}
      <div className="text-center font-black uppercase text-sm border-t border-b border-black/10 py-1 tracking-tight truncate">
        {player.name}
      </div>

      {/* Attributes breakdown / Custom list */}
      {displayingCustom && player.customAttributes ? (
        <div className="bg-black/10 border border-black/5 rounded-xl p-2 h-[4.5rem] flex flex-col justify-start space-y-1 overflow-y-auto scrollbar-none text-[9px] text-left">
          {player.customAttributes.map((attr, idx) => (
            <div key={idx} className="flex items-center space-x-1 border-b border-black/5 pb-0.5 font-bold text-slate-800">
              <span className="text-amber-600 font-extrabold">•</span>
              <span className="truncate w-full text-left uppercase text-[8.5px] tracking-tight">{attr.name}</span>
            </div>
          ))}
        </div>
      ) : isGK ? (
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] font-bold px-1 text-left">
          <div className="flex justify-between border-r border-black/10 pr-2" title="Diving">
            <span className={textMuted}>DIV</span>
            <span className="font-extrabold">{rating.pac}</span>
          </div>
          <div className="flex justify-between pl-2" title="Reflexes">
            <span className={textMuted}>REF</span>
            <span className="font-extrabold">{rating.dri}</span>
          </div>
          <div className="flex justify-between border-r border-black/10 pr-2" title="Handling">
            <span className={textMuted}>HAN</span>
            <span className="font-extrabold">{rating.sho}</span>
          </div>
          <div className="flex justify-between pl-2" title="Physical">
            <span className={textMuted}>PHY</span>
            <span className="font-extrabold">{rating.def}</span>
          </div>
          <div className="flex justify-between border-r border-black/10 pr-2" title="Kicking">
            <span className={textMuted}>KIC</span>
            <span className="font-extrabold">{rating.pas}</span>
          </div>
          <div className="flex justify-between pl-2" title="Positioning">
            <span className={textMuted}>POS</span>
            <span className="font-extrabold">{rating.phy}</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] font-bold px-1 text-left">
          <div className="flex justify-between border-r border-black/10 pr-2">
            <span className={textMuted}>SPD</span>
            <span className="font-extrabold">{rating.pac}</span>
          </div>
          <div className="flex justify-between pl-2">
            <span className={textMuted}>DRI</span>
            <span className="font-extrabold">{rating.dri}</span>
          </div>
          <div className="flex justify-between border-r border-black/10 pr-2">
            <span className={textMuted}>SHO</span>
            <span className="font-extrabold">{rating.sho}</span>
          </div>
          <div className="flex justify-between pl-2">
            <span className={textMuted}>DEF</span>
            <span className="font-extrabold">{rating.def}</span>
          </div>
          <div className="flex justify-between border-r border-black/10 pr-2">
            <span className={textMuted}>PAS</span>
            <span className="font-extrabold">{rating.pas}</span>
          </div>
          <div className="flex justify-between pl-2">
            <span className={textMuted}>PHY</span>
            <span className="font-extrabold">{rating.phy}</span>
          </div>
        </div>
      )}

      {/* Card Footer branding */}
      <div className="flex justify-between items-center text-[7px] font-black tracking-widest text-black/40 pt-1 border-t border-black/5">
        <span>GSI TALENT SCOUT</span>
        <span className={cn("px-1 rounded-sm text-[6px] text-white font-black", badgeColor)}>
          {tierLabel}
        </span>
      </div>
    </motion.div>
  );
}

// Tactical Formation Coordinates
const FORMATION_SLOTS = {
  '4-4-2': [
    { role: 'GK', x: 50, y: 90 },
    { role: 'LB', x: 20, y: 76 },
    { role: 'LCB', x: 38, y: 78 },
    { role: 'RCB', x: 62, y: 78 },
    { role: 'RB', x: 80, y: 76 },
    { role: 'LM', x: 20, y: 61 },
    { role: 'LCM', x: 38, y: 62 },
    { role: 'RCM', x: 62, y: 62 },
    { role: 'RM', x: 80, y: 61 },
    { role: 'LST', x: 38, y: 47 },
    { role: 'RST', x: 62, y: 47 }
  ],
  '4-3-3': [
    { role: 'GK', x: 50, y: 90 },
    { role: 'LB', x: 20, y: 76 },
    { role: 'LCB', x: 38, y: 78 },
    { role: 'RCB', x: 62, y: 78 },
    { role: 'RB', x: 80, y: 76 },
    { role: 'LCM', x: 32, y: 61 },
    { role: 'CDM', x: 50, y: 66 },
    { role: 'RCM', x: 68, y: 61 },
    { role: 'LW', x: 22, y: 48 },
    { role: 'ST', x: 50, y: 46 },
    { role: 'RW', x: 78, y: 48 }
  ],
  '3-5-2': [
    { role: 'GK', x: 50, y: 90 },
    { role: 'LCB', x: 28, y: 78 },
    { role: 'CB', x: 50, y: 79 },
    { role: 'RCB', x: 72, y: 78 },
    { role: 'LM', x: 18, y: 62 },
    { role: 'LCM', x: 36, y: 65 },
    { role: 'CAM', x: 50, y: 56 },
    { role: 'RCM', x: 64, y: 65 },
    { role: 'RM', x: 82, y: 62 },
    { role: 'LST', x: 38, y: 47 },
    { role: 'RST', x: 62, y: 47 }
  ],
  '3-4-3': [
    { role: 'GK', x: 50, y: 90 },
    { role: 'LCB', x: 28, y: 78 },
    { role: 'CB', x: 50, y: 79 },
    { role: 'RCB', x: 72, y: 78 },
    { role: 'LM', x: 18, y: 62 },
    { role: 'LCM', x: 38, y: 63 },
    { role: 'RCM', x: 62, y: 63 },
    { role: 'RM', x: 82, y: 62 },
    { role: 'LW', x: 22, y: 48 },
    { role: 'ST', x: 50, y: 46 },
    { role: 'RW', x: 78, y: 48 }
  ],
  '4-2-3-1': [
    { role: 'GK', x: 50, y: 90 },
    { role: 'LB', x: 20, y: 76 },
    { role: 'LCB', x: 38, y: 78 },
    { role: 'RCB', x: 62, y: 78 },
    { role: 'RB', x: 80, y: 76 },
    { role: 'LDM', x: 36, y: 66 },
    { role: 'RDM', x: 64, y: 66 },
    { role: 'LM', x: 20, y: 56 },
    { role: 'CAM', x: 50, y: 55 },
    { role: 'RM', x: 80, y: 56 },
    { role: 'ST', x: 50, y: 45 }
  ]
};

// Sort players by tactical role priority (GK -> DF -> MF -> FW)
const sortPlayersBySoccerRole = (plist: Player[]) => {
  const getRolePriority = (pos: string) => {
    const p = (pos || 'ST').toUpperCase();
    if (p === 'GK') return 1;
    if (['CB', 'LB', 'RB', 'LWB', 'RWB', 'DF'].includes(p)) return 2;
    if (['CDM', 'CM', 'CAM', 'LM', 'RM', 'MF'].includes(p)) return 3;
    if (['ST', 'CF', 'LW', 'RW', 'ATT', 'FW'].includes(p)) return 4;
    return 3;
  };
  return [...plist].sort((a, b) => getRolePriority(a.position) - getRolePriority(b.position));
};

const getPlayerJerseyNumber = (role: string, playerName: string, player?: Player): number => {
  if (player && player.jerseyNumber !== undefined && player.jerseyNumber !== null) {
    return player.jerseyNumber;
  }
  const cleanRole = (role || '').toUpperCase().trim();
  let baseJersey = 9;
  switch (cleanRole) {
    case 'GK': baseJersey = 1; break;
    case 'RB': baseJersey = 2; break;
    case 'LB': baseJersey = 3; break;
    case 'LCB': baseJersey = 4; break;
    case 'CB': baseJersey = 5; break;
    case 'RCB': baseJersey = 5; break;
    case 'CDM': baseJersey = 6; break;
    case 'LDM': baseJersey = 6; break;
    case 'RDM': baseJersey = 8; break;
    case 'RM': baseJersey = 7; break;
    case 'RW': baseJersey = 7; break;
    case 'LM': baseJersey = 11; break;
    case 'LW': baseJersey = 11; break;
    case 'CM': baseJersey = 8; break;
    case 'LCM': baseJersey = 8; break;
    case 'RCM': baseJersey = 14; break;
    case 'CAM': baseJersey = 10; break;
    case 'ST': baseJersey = 9; break;
    case 'CF': baseJersey = 9; break;
    case 'LST': baseJersey = 9; break;
    case 'RST': baseJersey = 19; break;
  }
  
  if (playerName) {
    let hash = 0;
    for (let i = 0; i < playerName.length; i++) {
      hash = playerName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const offset = Math.abs(hash) % 3;
    if (offset > 0) {
      if (cleanRole === 'GK') {
        const gkNumbers = [1, 12, 22, 20];
        return gkNumbers[offset % gkNumbers.length];
      } else if (['LCB', 'RCB', 'CB'].includes(cleanRole)) {
        const defNumbers = [4, 5, 23, 15, 16];
        return defNumbers[Math.abs(hash) % defNumbers.length];
      } else if (['LB', 'RB', 'LWB', 'RWB'].includes(cleanRole)) {
        const fbNumbers = [2, 3, 12, 14, 22, 17];
        return fbNumbers[Math.abs(hash) % fbNumbers.length];
      } else if (['CM', 'LCM', 'RCM', 'CDM', 'LDM', 'RDM', 'CAM'].includes(cleanRole)) {
        const mfNumbers = [6, 8, 10, 14, 18, 21, 23, 16];
        return mfNumbers[Math.abs(hash) % mfNumbers.length];
      } else if (['LM', 'RM', 'LW', 'RW'].includes(cleanRole)) {
        const wingNumbers = [7, 11, 17, 22, 23, 15];
        return wingNumbers[Math.abs(hash) % wingNumbers.length];
      } else if (['ST', 'CF', 'LST', 'RST'].includes(cleanRole)) {
        const fwNumbers = [9, 10, 19, 11, 20, 29];
        return fwNumbers[Math.abs(hash) % fwNumbers.length];
      }
    }
  }

  return baseJersey;
};

const getMatchScore = (playerPos: string, slotRole: string) => {
  const p = (playerPos || 'ST').toUpperCase();
  const s = (slotRole || 'ST').toUpperCase();
  if (p === s) return 100;
  
  // CB matches LCB, RCB, CB
  if (p === 'CB' && ['CB', 'LCB', 'RCB'].includes(s)) return 90;
  // Fullbacks/wingbacks
  if (p === 'LB' && ['LB', 'LWB'].includes(s)) return 90;
  if (p === 'RB' && ['RB', 'RWB'].includes(s)) return 90;
  
  // Midfielders
  if (['CM', 'CDM', 'CAM', 'LDM', 'RDM'].includes(p) && ['CM', 'LCM', 'RCM', 'CDM', 'LDM', 'RDM', 'CAM', 'LM', 'RM'].includes(s)) return 85;
  if (p === 'LM' && ['LM', 'LW', 'LCM'].includes(s)) return 80;
  if (p === 'RM' && ['RM', 'RW', 'RCM'].includes(s)) return 80;
  if (p === 'LW' && ['LW', 'LM'].includes(s)) return 80;
  if (p === 'RW' && ['RW', 'RM'].includes(s)) return 80;
  
  // Forwards
  if (['ST', 'CF'].includes(p) && ['ST', 'LST', 'RST', 'CF', 'LW', 'RW'].includes(s)) return 90;
  
  // General category matches (GK, DF, MF, FW)
  const getCategory = (role: string) => {
    if (['GK'].includes(role)) return 'GK';
    if (['LB', 'RB', 'CB', 'LCB', 'RCB', 'LWB', 'RWB', 'DF'].includes(role)) return 'DF';
    if (['CM', 'LCM', 'RCM', 'CDM', 'LDM', 'RDM', 'CAM', 'LM', 'RM', 'MF'].includes(role)) return 'MF';
    return 'FW';
  };
  
  if (getCategory(p) === getCategory(s)) return 50;
  return 10;
};

const getTeamMockPlayersForSlots = (teamId: string, teamName: string, existingPlayers: Player[]) => {
  const list = [...existingPlayers];
  
  // High quality Indonesian football names to fill mock squads realistically
  const randomFirstNames = ["Rizky", "Pratama", "Asnawi", "Witan", "Marselino", "Ernando", "Rachmat", "Egy", "Saddam", "Fachruddin", "Ricky", "Kadek", "Syahrian", "Ramadhan", "Yacob", "Fachri", "Bagas", "Bagus", "Ilham"];
  const randomLastNames = ["Ridho", "Arhan", "Mangkualam", "Sulaeman", "Ferdinan", "Ari", "Irianto", "Vikri", "Alfat", "Aryanto", "Kambuaya", "Agung", "Abimanyu", "Sananta", "Sayuri", "Lestaluhu", "Kaffa", "Kahfi", "Udin"];
  
  const usedNames = new Set(list.map(p => p.name));
  let idCounter = 1;
  
  const targetCounts: Record<string, number> = {
    GK: 1, CB: 2, LB: 1, RB: 1, CM: 2, CAM: 1, LM: 1, RM: 1, ST: 1
  };
  
  while (list.length < 11) {
    const currentCounts: Record<string, number> = {};
    list.forEach(p => {
      const pos = (p.position || 'ST').toUpperCase();
      currentCounts[pos] = (currentCounts[pos] || 0) + 1;
    });
    
    let neededPos = 'ST';
    for (const pos of Object.keys(targetCounts)) {
      if ((currentCounts[pos] || 0) < targetCounts[pos]) {
        neededPos = pos;
        break;
      }
    }
    
    let fullName = "";
    let attempts = 0;
    do {
      const first = randomFirstNames[Math.floor(Math.random() * randomFirstNames.length)];
      const last = randomLastNames[Math.floor(Math.random() * randomLastNames.length)];
      fullName = `${first} ${last}`;
      attempts++;
    } while (usedNames.has(fullName) && attempts < 100);
    
    usedNames.add(fullName);
    
    // Position realistic stats
    let rating: PlayerRating = { pac: 65, sho: 55, pas: 60, dri: 62, def: 55, phy: 60 };
    if (neededPos === 'GK') {
      rating = { pac: 68, sho: 65, pas: 68, dri: 72, def: 35, phy: 68 };
    } else if (['CB', 'LB', 'RB'].includes(neededPos)) {
      rating = { pac: 68, sho: 40, pas: 58, dri: 55, def: 74, phy: 72 };
    } else if (['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(neededPos)) {
      rating = { pac: 72, sho: 60, pas: 74, dri: 70, def: 58, phy: 65 };
    } else {
      rating = { pac: 80, sho: 74, pas: 65, dri: 75, def: 32, phy: 64 };
    }
    
    list.push({
      id: `virtual-${teamId}-${idCounter++}`,
      name: fullName,
      teamId: teamId,
      goals: 0,
      position: neededPos,
      rating: rating,
      customAttributes: []
    });
  }
  
  return list;
};

const matchPlayersToSlots = (plist: Player[], slots: { role: string; x: number; y: number }[]) => {
  const assigned: { player: Player; role: string; x: number; y: number }[] = [];
  const remainingPlayers = [...plist];
  const remainingSlots = [...slots];
  
  // Phase 1: Exact matches (position === slot.role uppercase)
  for (let i = remainingSlots.length - 1; i >= 0; i--) {
    const slot = remainingSlots[i];
    const sRole = slot.role.toUpperCase();
    const exactMatchIndex = remainingPlayers.findIndex(p => {
      const pPos = (p.position || 'ST').toUpperCase();
      // Also map generic CB, LCB, RCB as exact for CB roles, etc.
      if (['LCB', 'RCB', 'CB'].includes(sRole) && pPos === 'CB') return true;
      if (['LST', 'RST', 'ST'].includes(sRole) && pPos === 'ST') return true;
      if (['LCM', 'RCM', 'CM'].includes(sRole) && pPos === 'CM') return true;
      if (['LDM', 'RDM', 'CDM'].includes(sRole) && pPos === 'CDM') return true;
      return pPos === sRole;
    });
    
    if (exactMatchIndex !== -1) {
      const matchedPlayer = remainingPlayers.splice(exactMatchIndex, 1)[0];
      assigned.push({
        player: matchedPlayer,
        role: slot.role,
        x: slot.x,
        y: slot.y
      });
      remainingSlots.splice(i, 1);
    }
  }
  
  // Phase 2: Category compatible matches (score >= 80)
  for (let i = remainingSlots.length - 1; i >= 0; i--) {
    const slot = remainingSlots[i];
    const sRole = slot.role.toUpperCase();
    const matchIndex = remainingPlayers.findIndex(p => {
      const pPos = (p.position || 'ST').toUpperCase();
      return getMatchScore(pPos, sRole) >= 80;
    });
    
    if (matchIndex !== -1) {
      const matchedPlayer = remainingPlayers.splice(matchIndex, 1)[0];
      assigned.push({
        player: matchedPlayer,
        role: slot.role,
        x: slot.x,
        y: slot.y
      });
      remainingSlots.splice(i, 1);
    }
  }
  
  // Phase 3: General category matches (score >= 50)
  for (let i = remainingSlots.length - 1; i >= 0; i--) {
    const slot = remainingSlots[i];
    const sRole = slot.role.toUpperCase();
    const matchIndex = remainingPlayers.findIndex(p => {
      const pPos = (p.position || 'ST').toUpperCase();
      return getMatchScore(pPos, sRole) >= 50;
    });
    
    if (matchIndex !== -1) {
      const matchedPlayer = remainingPlayers.splice(matchIndex, 1)[0];
      assigned.push({
        player: matchedPlayer,
        role: slot.role,
        x: slot.x,
        y: slot.y
      });
      remainingSlots.splice(i, 1);
    }
  }
  
  // Phase 4: Fallback
  while (remainingSlots.length > 0 && remainingPlayers.length > 0) {
    const slot = remainingSlots.pop()!;
    const matchedPlayer = remainingPlayers.pop()!;
    assigned.push({
      player: matchedPlayer,
      role: slot.role,
      x: slot.x,
      y: slot.y
    });
  }
  
  return assigned;
};

// Main Scout Talent View
export default function ScoutView({ players, teams, matches = [], onRefresh }: { players: Player[], teams: Team[], matches?: Match[], onRefresh: () => void }) {
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  // Rating form state
  const [position, setPosition] = useState<string>('ST');
  const [ratings, setRatings] = useState<PlayerRating>({ pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [markedForScoutTeam, setMarkedForScoutTeam] = useState<boolean>(false);

  // Secondary position/role form states
  const [enableSecondary, setEnableSecondary] = useState<boolean>(false);
  const [secondaryPosition, setSecondaryPosition] = useState<string>('CM');
  const [secondaryRatings, setSecondaryRatings] = useState<PlayerRating>({ pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 });

  // Compare players state
  const [comparePlayerAId, setComparePlayerAId] = useState<string>('');
  const [comparePlayerBId, setComparePlayerBId] = useState<string>('');

  // Custom attributes states
  const [customAttrs, setCustomAttrs] = useState<{ name: string; value: string }[]>([]);
  const [showCustomAttrs, setShowCustomAttrs] = useState<boolean>(true);
  const [newAttrName, setNewAttrName] = useState<string>('');
  const [newAttrValue, setNewAttrValue] = useState<string>('');

  // New scout player form
  const [newPlayerName, setNewPlayerName] = useState<string>('');
  const [newPlayerTeamId, setNewPlayerTeamId] = useState<string>('');

  // Tactical formation states
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches.length > 0 ? matches[0].id : 'CUSTOM');
  const [customHomeTeamId, setCustomHomeTeamId] = useState<string>(teams[0]?.id || '');
  const [customAwayTeamId, setCustomAwayTeamId] = useState<string>(teams[1]?.id || '');
  const [homeFormation, setHomeFormation] = useState<string>('4-4-2');
  const [awayFormation, setAwayFormation] = useState<string>('4-3-3');

  // Helper to compute overall
  const getOverall = (p: Player) => {
    const r = p.rating || { pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 };
    return Math.round((r.pac + r.sho + r.pas + r.dri + r.def + r.phy) / 6);
  };

  // Find currently shortlisted players
  const shortlistedPlayers = players.filter(p => p.isMarkedForScouting);

  // Comparison logic helper
  const playerA = players.find(p => p.id === comparePlayerAId);
  const playerB = players.find(p => p.id === comparePlayerBId);

  const getRecommendation = (pA: Player, pB: Player) => {
    const ovrA = getOverall(pA);
    const ovrB = getOverall(pB);
    const rA = pA.rating || { pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 };
    const rB = pB.rating || { pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 };

    // Find highest individual attributes
    const stats = [
      { key: 'pac', valueA: rA.pac, valueB: rB.pac, label: pA.position === 'GK' ? 'Diving' : 'Pace (Kecepatan)' },
      { key: 'sho', valueA: rA.sho, valueB: rB.sho, label: pA.position === 'GK' ? 'Handling' : 'Shooting (Menembak)' },
      { key: 'pas', valueA: rA.pas, valueB: rB.pas, label: pA.position === 'GK' ? 'Kicking' : 'Passing (Mengoper)' },
      { key: 'dri', valueA: rA.dri, valueB: rB.dri, label: pA.position === 'GK' ? 'Reflexes' : 'Dribbling (Menggiring)' },
      { key: 'def', valueA: rA.def, valueB: rB.def, label: pA.position === 'GK' ? 'Physical (Fisik)' : 'Defending (Bertahan)' },
      { key: 'phy', valueA: rA.phy, valueB: rB.phy, label: pA.position === 'GK' ? 'Positioning' : 'Physical (Fisik)' },
    ];

    let winCountA = 0;
    let winCountB = 0;
    stats.forEach(stat => {
      if (stat.valueA > stat.valueB) {
        winCountA++;
      } else if (stat.valueB > stat.valueA) {
        winCountB++;
      }
    });

    const highestStatA = stats.reduce((prev, current) => (prev.valueA > current.valueA) ? prev : current);
    const highestStatB = stats.reduce((prev, current) => (prev.valueB > current.valueB) ? prev : current);

    let roleAdvantage = '';
    if (ovrA > ovrB + 3) {
      roleAdvantage = `Rekomendasi Utama: <strong>${pA.name}</strong> memiliki keunggulan performa menyeluruh yang lebih unggul (OVR <strong>${ovrA}</strong> vs OVR <strong>${ovrB}</strong>).`;
    } else if (ovrB > ovrA + 3) {
      roleAdvantage = `Rekomendasi Utama: <strong>${pB.name}</strong> memiliki keunggulan performa menyeluruh yang lebih unggul (OVR <strong>${ovrB}</strong> vs OVR <strong>${ovrA}</strong>).`;
    } else {
      roleAdvantage = `Rekomendasi Utama: Kedua pemain memiliki tingkat kompetensi taktis yang setara (OVR <strong>${ovrA}</strong> vs OVR <strong>${ovrB}</strong>).`;
    }

    // Role recommendations based on highest attributes
    let tacticalNote = "";
    if (highestStatA.key === 'pac' || highestStatA.key === 'dri') {
      tacticalNote += `<strong>${pA.name}</strong> sangat berbahaya saat menyerang karena kecepatan tinggi (<strong>${highestStatA.valueA}</strong>), cocok untuk skema serangan kilat atau counter-attack. `;
    } else if (highestStatA.key === 'sho') {
      tacticalNote += `<strong>${pA.name}</strong> adalah eksekutor ulung dengan efisiensi tendangan klinis (<strong>${highestStatA.valueA}</strong>), handal sebagai juru gedor utama. `;
    } else if (highestStatA.key === 'def' || highestStatA.key === 'phy') {
      tacticalNote += `<strong>${pA.name}</strong> sangat tangguh bertahan dengan fisik solid atau pembacaan taktis (<strong>${highestStatA.valueA}</strong>), ideal sebagai jangkar pertahanan kokoh. `;
    } else {
      tacticalNote += `<strong>${pA.name}</strong> sangat seimbang dalam mengalirkan bola dengan teknik umpannya (<strong>${highestStatA.valueA}</strong>), penting untuk kreativitas lini tengah. `;
    }

    if (highestStatB.key === 'pac' || highestStatB.key === 'dri') {
      tacticalNote += `Sedangkan, <strong>${pB.name}</strong> diunggulkan pada aspek kelincahan dan kecepatan (<strong>${highestStatB.valueB}</strong>) untuk membongkar barisan musuh.`;
    } else if (highestStatB.key === 'sho') {
      tacticalNote += `Sedangkan, <strong>${pB.name}</strong> memiliki kekuatan tembakan jitu (<strong>${highestStatB.valueB}</strong>) sebagai finisher tajam.`;
    } else if (highestStatB.key === 'def' || highestStatB.key === 'phy') {
      tacticalNote += `Sedangkan, <strong>${pB.name}</strong> memiliki dominasi tinggi pada pertahanan kokoh (<strong>${highestStatB.valueB}</strong>) untuk mematahkan penyerangan.`;
    } else {
      tacticalNote += `Sedangkan, <strong>${pB.name}</strong> diunggulkan pada penguasaan ritme dan distribusi umpan akurat (<strong>${highestStatB.valueB}</strong>).`;
    }

    const verdict = ovrA > ovrB 
      ? `Verdict Pemanduan: <strong>${pA.name}</strong> merupakan pilihan utama saat ini untuk memperkuat kedalaman skuad utama.`
      : ovrB > ovrA 
        ? `Verdict Pemanduan: <strong>${pB.name}</strong> merupakan pilihan utama saat ini untuk memperkuat kedalaman skuad utama.`
        : `Verdict Pemanduan: Pemilihan tergantung pada kubu strategi yang digunakan (Serangan kilat vs Pertahanan rapat).`;

    return {
      winCountA,
      winCountB,
      verdict,
      roleAdvantage,
      tacticalNote,
      stats
    };
  };

  const compResult = playerA && playerB ? getRecommendation(playerA, playerB) : null;

  // Handle opening evaluation panel for a player
  const handleOpenEvaluation = (player: Player) => {
    setSelectedPlayer(player);
    setPosition(player.position || 'ST');
    setRatings(player.rating || { pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 });
    setCustomAttrs(player.customAttributes || []);
    setNewAttrName('');
    setNewAttrValue('');
    setIsAddingNew(false);
    setMarkedForScoutTeam(player.isMarkedForScouting || false);

    if (player.secondaryPosition) {
      setEnableSecondary(true);
      setSecondaryPosition(player.secondaryPosition);
      setSecondaryRatings(player.secondaryRating || { pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 });
    } else {
      setEnableSecondary(false);
      setSecondaryPosition('CM');
      setSecondaryRatings({ pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 });
    }
  };

  // Handle save ratings
  const handleSaveRatings = async () => {
    if (!selectedPlayer) return;
    setIsSaving(true);

    const secPos = enableSecondary ? secondaryPosition : undefined;
    const secRat = enableSecondary ? secondaryRatings : undefined;

    if (selectedPlayer.id.startsWith('virtual-')) {
      // Promote virtual/placeholder player to a real registered scouted player in the database
      const newRealId = `p-${Date.now()}`;
      await store.addPlayer({
        id: newRealId,
        name: selectedPlayer.name,
        teamId: selectedPlayer.teamId,
        goals: 0,
        position: position,
        rating: ratings,
        customAttributes: customAttrs,
        isMarkedForScouting: markedForScoutTeam,
        secondaryPosition: secPos,
        secondaryRating: secRat
      });
    } else {
      await store.updatePlayerRating(
        selectedPlayer.id, 
        position, 
        ratings, 
        customAttrs, 
        markedForScoutTeam,
        secPos,
        secRat
      );
    }
    setIsSaving(false);
    setSelectedPlayer(null);
    onRefresh();
  };

  // Handle adding new custom scouted player
  const handleAddNewPlayer = async () => {
    if (!newPlayerName || !newPlayerTeamId) return;
    const newPlayerId = `p-${Date.now()}`;
    await store.addPlayer({
      id: newPlayerId,
      name: newPlayerName,
      teamId: newPlayerTeamId,
      goals: 0,
      position: 'ST',
      rating: { pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 }
    });
    setNewPlayerName('');
    setIsAddingNew(false);
    onRefresh();

    // Directly open ratings for the newly added player
    const updatedPlayers = await store.getPlayers();
    const createdPlayer = updatedPlayers.find(p => p.id === newPlayerId);
    if (createdPlayer) {
      handleOpenEvaluation(createdPlayer);
    }
  };

  // Resolve active Home & Away teams based on selection
  const activeMatch = matches.find(m => m.id === selectedMatchId);
  const homeTeamId = activeMatch ? activeMatch.teamAId : customHomeTeamId;
  const awayTeamId = activeMatch ? activeMatch.teamBId : customAwayTeamId;

  const homeTeam = teams.find(t => t.id === homeTeamId);
  const awayTeam = teams.find(t => t.id === awayTeamId);

  // Get players for Home & Away
  const homePlayers = players.filter(p => p.teamId === homeTeamId);
  const awayPlayers = players.filter(p => p.teamId === awayTeamId);

  const fullHomePlayers = getTeamMockPlayersForSlots(homeTeamId || 't1', homeTeam?.name || 'Kandang', homePlayers);
  const fullAwayPlayers = getTeamMockPlayersForSlots(awayTeamId || 't2', awayTeam?.name || 'Tandang', awayPlayers);

  // Helper to scale coordinates strictly to their respective halves:
  // Home team players (isAway=false) should stay in [53, 93]%
  // Away team players (isAway=true) should stay in [7, 47]%
  const scalePlayerY = (yVal: number, isAway: boolean) => {
    const minOriginal = 45;
    const maxOriginal = 90;
    const normalized = (yVal - minOriginal) / (maxOriginal - minOriginal);
    const clamped = Math.max(0, Math.min(1, normalized));

    if (isAway) {
      return 47 - clamped * (47 - 7);
    } else {
      return 53 + clamped * (93 - 53);
    }
  };

  // Match players matching their assigned playing positions to the formation slots
  const homeFormationKey = homeFormation as keyof typeof FORMATION_SLOTS;
  const currentHomeSlots = FORMATION_SLOTS[homeFormationKey] || FORMATION_SLOTS['4-4-2'];
  const homePlayersOnPitch = matchPlayersToSlots(fullHomePlayers, currentHomeSlots).map(item => ({
    ...item,
    y: scalePlayerY(item.y, false)
  }));

  const awayFormationKey = awayFormation as keyof typeof FORMATION_SLOTS;
  const currentAwaySlots = FORMATION_SLOTS[awayFormationKey] || FORMATION_SLOTS['4-3-3'];
  const matchedAwayOnPitch = matchPlayersToSlots(fullAwayPlayers, currentAwaySlots);
  const awayPlayersOnPitch = matchedAwayOnPitch.map(item => ({
    ...item,
    y: scalePlayerY(item.y, true)
  }));

  // Filter players list
  const filteredPlayers = players.filter(p => {
    const matchesTeam = selectedTeamFilter === 'ALL' || p.teamId === selectedTeamFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  // Sort by overall rating desc
  const sortedPlayers = [...filteredPlayers].sort((a, b) => getOverall(b) - getOverall(a));

  // Determine Elite XI or top 5 stars
  const topElitePlayers = [...players]
    .sort((a, b) => getOverall(b) - getOverall(a))
    .slice(0, 5);

  // Group positions available
  const positionsOptions = ['ST', 'CF', 'RW', 'LW', 'CAM', 'CM', 'CDM', 'CB', 'LB', 'RB', 'GK'];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Title block */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full text-amber-700 text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span>FIFA Fut Card Generator & Evaluator</span>
        </div>
        <h2 className="text-4xl font-black italic text-pitch-dark tracking-tight">TALENT SCOUTING PANEL</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Penilaian performa taktis tim Gala Siswa Indonesia (GSI) Ciamis. Beri rating performa pemain secara langsung untuk memetakan bakat muda terbaik!
        </p>
      </div>

      {/* Top statistics overview row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Top Scout Stars */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-black text-slate-800 text-sm flex items-center space-x-2 uppercase tracking-wide border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Pemain Kategori Gold (OVR 80+)</span>
            </h3>
            
            <div className="space-y-3">
              {topElitePlayers.map((p, idx) => {
                const ovr = getOverall(p);
                const t = teams.find(team => team.id === p.teamId);
                const details = getRatingDetails(ovr);
                return (
                  <div 
                    key={p.id} 
                    onClick={() => handleOpenEvaluation(p)}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-black text-slate-400">#0{idx+1}</span>
                      <div>
                        <p className="font-black text-sm text-slate-800">{p.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{t?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{p.position || 'ST'}</span>
                      <span className={cn("px-2.5 py-1 rounded-lg text-xs font-black", details.badgeColor)}>
                        {ovr} OVR
                      </span>
                    </div>
                  </div>
                );
              })}
              {topElitePlayers.length === 0 && (
                <div className="text-center text-slate-400 text-xs py-8">Belum ada penilaian pemain.</div>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold italic">
            <span>* Nilai minimal 80 untuk predikat Gold</span>
            <Activity className="w-4 h-4 text-slate-300" />
          </div>
        </div>

        {/* Right Columns: Active Scout Card Rating Panel or Tutorial */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          {/* Subtle field markings on background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px]" />
          
          {selectedPlayer ? (
            <>
              {/* Card visualizer */}
              <div className="flex flex-col items-center justify-center space-y-3 z-10">
                <FutCard 
                  player={{
                    ...selectedPlayer, 
                    position, // use live form state
                    rating: ratings, // use live form state
                    customAttributes: customAttrs, // use live form state
                    secondaryPosition: enableSecondary ? secondaryPosition : undefined,
                    secondaryRating: enableSecondary ? secondaryRatings : undefined,
                  }} 
                  team={teams.find(t => t.id === selectedPlayer.teamId)} 
                  globalShowCustom={showCustomAttrs}
                />
                <p className="text-[10px] font-black tracking-widest text-amber-500 uppercase flex items-center">
                  <Flame className="w-3 h-3 mr-1" /> LIVE CARDS VIEW
                </p>
              </div>

              {/* Input forms editor */}
              <div className="flex-1 space-y-5 z-10 w-full md:max-w-md">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Scout Form</span>
                    <h4 className="text-lg font-black text-white">{selectedPlayer.name}</h4>
                  </div>
                  <button 
                    onClick={() => setSelectedPlayer(null)}
                    className="p-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs font-black"
                  >
                    X BATAL
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">POSISI UTAMA</label>
                    <select 
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm font-black text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all font-sans"
                    >
                      {positionsOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  {/* Posisi Tambahan Selector Header & Checkbox */}
                  <div className="col-span-2 bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          id="enable-secondary-checkbox"
                          type="checkbox"
                          checked={enableSecondary}
                          onChange={(e) => setEnableSecondary(e.target.checked)}
                          className="w-4 h-4 text-amber-500 focus:ring-amber-500 rounded accent-amber-500 cursor-pointer"
                        />
                        <label htmlFor="enable-secondary-checkbox" className="text-xs font-black text-amber-400 uppercase tracking-widest cursor-pointer select-none">
                          Posisi / Peran Tambahan
                        </label>
                      </div>
                      <span className="text-[8px] font-extrabold bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded tracking-wider border border-amber-500/10">SECONDARY</span>
                    </div>

                    {enableSecondary && (
                      <div className="space-y-4 pt-1 border-t border-slate-800/60">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-sans">PILIH POSISI TAMBAHAN</label>
                          <select 
                            value={secondaryPosition}
                            onChange={(e) => setSecondaryPosition(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs font-black text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all font-sans"
                          >
                            {positionsOptions.filter(p => p !== position).map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>

                        {/* Sliders for secondary position attributes */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/40">
                          {/* Secondary Slider 1 */}
                          <div className="space-y-1 font-sans">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                              <span>{secondaryPosition === 'GK' ? 'DIV' : 'SPD (LARI)'}</span>
                              <span className="text-amber-400 font-extrabold font-mono text-[10px]">{secondaryRatings.pac}</span>
                            </label>
                            <input 
                              type="range" min="1" max="99" 
                              value={secondaryRatings.pac}
                              onChange={(e) => setSecondaryRatings({...secondaryRatings, pac: parseInt(e.target.value)})}
                              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                            />
                          </div>

                          {/* Secondary Slider 2 */}
                          <div className="space-y-1 font-sans">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                              <span>{secondaryPosition === 'GK' ? 'HAN' : 'SHO (TENDANG)'}</span>
                              <span className="text-amber-400 font-extrabold font-mono text-[10px]">{secondaryRatings.sho}</span>
                            </label>
                            <input 
                              type="range" min="1" max="99" 
                              value={secondaryRatings.sho}
                              onChange={(e) => setSecondaryRatings({...secondaryRatings, sho: parseInt(e.target.value)})}
                              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                            />
                          </div>

                          {/* Secondary Slider 3 */}
                          <div className="space-y-1 font-sans">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                              <span>{secondaryPosition === 'GK' ? 'KIC' : 'PAS (UMPAN)'}</span>
                              <span className="text-amber-400 font-extrabold font-mono text-[10px]">{secondaryRatings.pas}</span>
                            </label>
                            <input 
                              type="range" min="1" max="99" 
                              value={secondaryRatings.pas}
                              onChange={(e) => setSecondaryRatings({...secondaryRatings, pas: parseInt(e.target.value)})}
                              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                            />
                          </div>

                          {/* Secondary Slider 4 */}
                          <div className="space-y-1 font-sans">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                              <span>{secondaryPosition === 'GK' ? 'REF' : 'DRI (GIRING)'}</span>
                              <span className="text-amber-400 font-extrabold font-mono text-[10px]">{secondaryRatings.dri}</span>
                            </label>
                            <input 
                              type="range" min="1" max="99" 
                              value={secondaryRatings.dri}
                              onChange={(e) => setSecondaryRatings({...secondaryRatings, dri: parseInt(e.target.value)})}
                              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                            />
                          </div>

                          {/* Secondary Slider 5 */}
                          <div className="space-y-1 font-sans">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                              <span>{secondaryPosition === 'GK' ? 'PHY' : 'DEF (BERTAHAN)'}</span>
                              <span className="text-amber-400 font-extrabold font-mono text-[10px]">{secondaryRatings.def}</span>
                            </label>
                            <input 
                              type="range" min="1" max="99" 
                              value={secondaryRatings.def}
                              onChange={(e) => setSecondaryRatings({...secondaryRatings, def: parseInt(e.target.value)})}
                              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                            />
                          </div>

                          {/* Secondary Slider 6 */}
                          <div className="space-y-1 font-sans">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                              <span>{secondaryPosition === 'GK' ? 'POS' : 'PHY (FISIK)'}</span>
                              <span className="text-amber-400 font-extrabold font-mono text-[10px]">{secondaryRatings.phy}</span>
                            </label>
                            <input 
                              type="range" min="1" max="99" 
                              value={secondaryRatings.phy}
                              onChange={(e) => setSecondaryRatings({...secondaryRatings, phy: parseInt(e.target.value)})}
                              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Slider 1 */}
                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest flex justify-between">
                      <span>{position === 'GK' ? 'DIV (DIVING)' : 'SPD (LARI)'}</span>
                      <span className="text-amber-400 font-black font-mono">{ratings.pac}</span>
                    </label>
                    <input 
                      type="range" min="1" max="99" 
                      value={ratings.pac}
                      onChange={(e) => setRatings({...ratings, pac: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Slider 2 */}
                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest flex justify-between">
                      <span>{position === 'GK' ? 'HAN (TANGKAP)' : 'SHO (TENDANG)'}</span>
                      <span className="text-amber-400 font-black font-mono">{ratings.sho}</span>
                    </label>
                    <input 
                      type="range" min="1" max="99" 
                      value={ratings.sho}
                      onChange={(e) => setRatings({...ratings, sho: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Slider 3 */}
                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest flex justify-between">
                      <span>{position === 'GK' ? 'KIC (TENDANG)' : 'PAS (UMPAN)'}</span>
                      <span className="text-amber-400 font-black font-mono">{ratings.pas}</span>
                    </label>
                    <input 
                      type="range" min="1" max="99" 
                      value={ratings.pas}
                      onChange={(e) => setRatings({...ratings, pas: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Slider 4 */}
                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest flex justify-between">
                      <span>{position === 'GK' ? 'REF (REFLEKS)' : 'DRI (GIRING)'}</span>
                      <span className="text-amber-400 font-black font-mono">{ratings.dri}</span>
                    </label>
                    <input 
                      type="range" min="1" max="99" 
                      value={ratings.dri}
                      onChange={(e) => setRatings({...ratings, dri: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Slider 5 */}
                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest flex justify-between">
                      <span>{position === 'GK' ? 'PHY (FISIK)' : 'DEF (BERTAHAN)'}</span>
                      <span className="text-amber-400 font-black font-mono">{ratings.def}</span>
                    </label>
                    <input 
                      type="range" min="1" max="99" 
                      value={ratings.def}
                      onChange={(e) => setRatings({...ratings, def: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Slider 6 */}
                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest flex justify-between">
                      <span>{position === 'GK' ? 'POS (POSISI)' : 'PHY (FISIK)'}</span>
                      <span className="text-amber-400 font-black font-mono">{ratings.phy}</span>
                    </label>
                    <input 
                      type="range" min="1" max="99" 
                      value={ratings.phy}
                      onChange={(e) => setRatings({...ratings, phy: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>

                {/* Shortlist Checkbox */}
                <div className="bg-slate-900 border border-amber-500/25 p-4 rounded-2xl flex items-start space-x-3 text-left font-sans transition-all hover:bg-slate-850">
                  <input
                    id="shortlist-scout"
                    type="checkbox"
                    checked={markedForScoutTeam}
                    onChange={(e) => setMarkedForScoutTeam(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 outline-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="shortlist-scout" className="text-xs font-black text-amber-400 uppercase tracking-wider cursor-pointer select-none">
                      Masuk Tim Hasil Pemantauan
                    </label>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-relaxed">
                      Tandai ini agar otomatis masuk ke Tim hasil pemantauan pemandu bakat Scout Talent.
                    </p>
                  </div>
                </div>

                {/* Seksi Atribut Tambahan Kustom */}
                <div className="border-t border-slate-800 pt-4 space-y-3 font-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400 animate-pulse" /> Atribut Tambahan Kustom
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCustomAttrs(!showCustomAttrs)}
                      className={cn(
                        "text-[9px] font-extrabold px-2 py-1 rounded transition-all border",
                        showCustomAttrs 
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-slate-800" 
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:text-white"
                      )}
                    >
                      {showCustomAttrs ? '👁️ Tampilkan di Kartu' : '👁️ Sembunyikan Baru'}
                    </button>
                  </div>

                  {/* List atribut tambahan yang siap disimpan */}
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {customAttrs.map((attr, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-900/80 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs font-sans">
                        <div className="flex items-center space-x-2 truncate">
                          <span className="text-amber-500 font-black">•</span>
                          <span className="font-semibold text-slate-350 truncate">{attr.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomAttrs(customAttrs.filter((_, i) => i !== idx));
                          }}
                          className="text-red-400 hover:text-red-300 font-bold text-[9px] hover:underline shrink-0"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                    {customAttrs.length === 0 && (
                      <p className="text-[11px] text-slate-500 italic pl-1 pb-1">Belum ada atribut kustom. Tulis & tambahkan di bawah.</p>
                    )}
                  </div>

                  {/* Form manual input tambahan (Text Note Input only without rating input) */}
                  <div className="flex gap-2">
                    <input
                      placeholder="Tulis Catatan Kustom Scout (e.g. Tendangan bebas melengkung tajam)"
                      value={newAttrName}
                      onChange={(e) => setNewAttrName(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs font-bold text-white outline-none focus:border-amber-500 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newAttrName.trim()) {
                          setCustomAttrs([...customAttrs, { name: newAttrName.trim(), value: '-' }]);
                          setNewAttrName('');
                        }
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 font-black rounded-lg text-xs flex items-center justify-center transition-colors shrink-0 font-sans"
                      title="Tambah Catatan"
                    >
                      TAMBAH
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setRatings({ pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 })}
                    className="flex-1 bg-slate-850 hover:bg-slate-800 border border-slate-700 py-3 text-xs font-black uppercase text-slate-300 rounded-xl active:scale-95 transition-all text-center font-sans"
                  >
                    Reset Nilai
                  </button>
                  <button 
                    onClick={handleSaveRatings}
                    disabled={isSaving}
                    className="flex-[2] flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-450 hover:to-amber-550 text-slate-950 py-3 text-xs font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all font-sans"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Rating'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : isAddingNew ? (
            <div className="space-y-6 z-10 w-full max-w-xl mx-auto">
              <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Prospek GSI Ciamis</span>
                  <h4 className="text-lg font-black text-white">TAMBAH PEMAIN BARU</h4>
                </div>
                <button 
                  onClick={() => setIsAddingNew(false)}
                  className="p-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs font-black"
                >
                  BATAL
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block">NAMA PEMAIN</label>
                  <input 
                    placeholder="Contoh: Pratama Arhan Jr"
                    className="w-full p-3 rounded-xl bg-slate-850 border border-slate-755 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-amber-500"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block">TIM ASOSIASI / SEKOLAH</label>
                  <select 
                    className="w-full p-3 rounded-xl bg-slate-850 border border-slate-755 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-amber-500"
                    value={newPlayerTeamId}
                    onChange={(e) => setNewPlayerTeamId(e.target.value)}
                  >
                    <option value="">Pilih Tim</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleAddNewPlayer}
                  disabled={!newPlayerName || !newPlayerTeamId}
                  className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 px-8 py-3.5 text-xs font-black uppercase rounded-xl transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambahkan Pemain & Atur Rating</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Default Welcome Information */}
              <div className="space-y-5 z-10 max-w-md">
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl font-bold flex items-center space-x-2 text-amber-300 text-xs">
                  <Sliders className="w-5 h-5 text-amber-500" />
                  <span>Instruksi Penilaian Scout Kompetisi</span>
                </div>
                <h3 className="text-2xl font-black italic text-white uppercase tracking-tight">SILAKAN PILIH PEMAIN UNTUK DINILAI</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Pilih salah satu kartu pemain yang terdaftar di bawah untuk melakukan modifikasi rating performa taktis (FUT Rating Badge) atau tambah prospek baru.
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsAddingNew(true)}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 px-5 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tambah Pemain Scout</span>
                  </button>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 rounded-3xl w-52 h-72 space-y-3 shadow-lg opacity-40">
                <User className="w-12 h-12 text-slate-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">SILHOUETTE FIFA FUT</p>
              </div>
            </>
          )}
        </div>
      </div>
          {/* SEKSI TAKTIKAL & LAPANGAN FORMASI */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest block">Simulasi Skuad Pertandingan</span>
            <span className="inline-flex items-center space-x-1.5 font-black text-2xl italic text-slate-800">
              <span>LAPANGAN TAKTIS & FORMASI TIM</span>
            </span>
            <p className="text-slate-500 text-xs font-semibold mt-1">Pilih pertandingan turnamen atau buat visualisasi simulasi bebas tim A vs B.</p>
          </div>

          <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
            {/* Match Select dropdown */}
            <div className="flex flex-col w-full sm:w-auto">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pertandingan Turnamen</label>
              <select
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                className="px-4 py-2.5 text-xs font-black bg-slate-50 border border-slate-200 rounded-xl cursor-pointer outline-none focus:ring-1 focus:ring-pitch transition-all text-slate-700"
              >
                <option value="CUSTOM">⚡ Simulasi Bebas (Kustom)</option>
                {matches.map(m => {
                  const tA = teams.find(t => t.id === m.teamAId);
                  const tB = teams.find(t => t.id === m.teamBId);
                  return (
                    <option key={m.id} value={m.id}>
                      {tA?.name || 'Tim A'} vs {tB?.name || 'Tim B'} - Babak {m.round}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedMatchId === 'CUSTOM' && (
              <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center w-full sm:w-auto">
                <div className="flex flex-col w-full sm:w-40">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tim Kandang (A)</label>
                  <select
                    value={customHomeTeamId}
                    onChange={(e) => setCustomHomeTeamId(e.target.value)}
                    className="px-4 py-2.5 text-xs font-black bg-slate-50 border border-slate-200 rounded-xl cursor-pointer outline-none focus:ring-1 focus:ring-pitch transition-all text-slate-705"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id} disabled={t.id === customAwayTeamId}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="text-slate-400 font-extrabold text-xs self-end pb-3 flex justify-center w-full sm:w-auto">VS</div>

                <div className="flex flex-col w-full sm:w-40">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tim Tandang (B)</label>
                  <select
                    value={customAwayTeamId}
                    onChange={(e) => setCustomAwayTeamId(e.target.value)}
                    className="px-4 py-2.5 text-xs font-black bg-slate-50 border border-slate-200 rounded-xl cursor-pointer outline-none focus:ring-1 focus:ring-pitch transition-all text-slate-705"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id} disabled={t.id === customHomeTeamId}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Formasi Team Selectors */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center w-full sm:w-auto">
              <div className="flex flex-col w-full sm:w-36">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Formasi Kandang</label>
                <select
                  value={homeFormation}
                  onChange={(e) => setHomeFormation(e.target.value)}
                  className="px-4 py-2.5 text-xs font-black bg-emerald-50 border border-emerald-200 rounded-xl cursor-pointer outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-emerald-950"
                >
                  <option value="4-4-2">4-4-2 Standard</option>
                  <option value="4-3-3">4-3-3 Offensive</option>
                  <option value="3-5-2">3-5-2 Balanced</option>
                  <option value="3-4-3">3-4-3 Dynamic</option>
                  <option value="4-2-3-1">4-2-3-1 Modern</option>
                </select>
              </div>

              <div className="flex flex-col w-full sm:w-36">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Formasi Tandang</label>
                <select
                  value={awayFormation}
                  onChange={(e) => setAwayFormation(e.target.value)}
                  className="px-4 py-2.5 text-xs font-black bg-blue-50 border border-blue-200 rounded-xl cursor-pointer outline-none focus:ring-1 focus:ring-blue-500 transition-all text-blue-950"
                >
                  <option value="4-4-2">4-4-2 Standard</option>
                  <option value="4-3-3">4-3-3 Offensive</option>
                  <option value="3-5-2">3-5-2 Balanced</option>
                  <option value="3-4-3">3-4-3 Dynamic</option>
                  <option value="4-2-3-1">4-2-3-1 Modern</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: Left Field, Right Skuad List info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tactical Football Pitch Visual (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-center font-black text-[10px] text-slate-400 tracking-wider flex justify-between bg-slate-50 py-2.5 px-4 rounded-xl border border-slate-100 uppercase">
              <span>{awayTeam?.name || 'Tandang'} (TANDANG - ATAS)</span>
              <span className="text-slate-300">• Setengah Lapangan •</span>
              <span>{homeTeam?.name || 'Kandang'} (KANDANG - BAWAH)</span>
            </div>

            {/* Tactical Football Pitch Container */}
            <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-emerald-800 via-green-800 to-emerald-900 rounded-[2rem] border-[6px] border-slate-100 shadow-xl p-4 overflow-hidden select-none">
              
              {/* Pitch patterns (stripes) */}
              <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-col h-full justify-between">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`flex-1 w-full ${i % 2 === 0 ? 'bg-black/25' : 'bg-transparent'}`} />
                ))}
              </div>

              {/* Pitch markup lines/circles */}
              <div className="absolute inset-4 border border-white/20 pointer-events-none rounded-xl" />
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/20 -translate-y-1/2 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              
              {/* Goal Area Top */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-20 border-b border-x border-white/20 pointer-events-none" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-8 border-b border-x border-white/20 pointer-events-none" />
              {/* Penalty Area Arc Top */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 w-28 h-16 border-b border-x border-white/0 rounded-b-full pointer-events-none border-white/20" style={{ clipPath: 'inset(14px 0 0 0)' }} />

              {/* Goal Area Bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-20 border-t border-x border-white/20 pointer-events-none" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-8 border-t border-x border-white/20 pointer-events-none" />
              {/* Penalty Area Arc Bottom */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-28 h-16 border-t border-x border-white/0 rounded-t-full pointer-events-none border-white/20" style={{ clipPath: 'inset(0 0 14px 0)' }} />

              {/* Goal Posts rendering */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/40 rounded-b-md" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/40 rounded-t-md" />

              {/* HOME TEAM (Bottom Half, facing UP) */}
              {homePlayersOnPitch.map((item) => {
                const p = item.player;
                const ovr = getOverall(p);
                const isSelected = selectedPlayer?.id === p.id;

                return (
                  <motion.div
                    key={p.id}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    whileHover={{ scale: 1.15 }}
                    onClick={() => {
                      handleOpenEvaluation(p);
                      // Scroll to target scout card editor on top smoothly
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20"
                  >
                    {/* Jersey Node */}
                    <div className={cn(
                      "w-5 h-5 md:w-9 md:h-9 rounded-full flex flex-col items-center justify-center font-black relative border transition-all shadow-lg",
                      isSelected 
                        ? "bg-amber-400 text-slate-950 border-white scale-110 ring-4 ring-amber-400/40" 
                        : "bg-emerald-100 text-emerald-950 border-emerald-600 hover:bg-amber-400 hover:text-slate-950 group-hover:bg-amber-400 group-hover:text-slate-950 hover:border-white"
                    )}>
                      {/* Rating pill indicator */}
                      <span className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 bg-slate-900 border border-slate-700 text-[4px] md:text-[6.5px] px-0.5 md:px-1 py-0 md:py-0.5 text-yellow-300 font-extrabold rounded-md shadow">
                        {ovr}
                      </span>
                      {/* Jersey number inside player node on the field */}
                      <span className="text-[6.5px] md:text-[10px] leading-none font-black">{getPlayerJerseyNumber(item.role, p.name, p)}</span>
                    </div>

                    {/* Name block */}
                    <div className={cn(
                      "mt-0.5 md:mt-1 bg-slate-900/85 backdrop-blur-sm px-1 md:px-1.5 py-0 md:py-0.5 rounded-full text-[5px] md:text-[8.0px] font-black tracking-tight text-white max-w-[42px] md:max-w-[75px] truncate border border-white/5 transition-colors pointer-events-none shadow-md whitespace-nowrap",
                      isSelected ? "border-amber-400 text-amber-300" : "group-hover:border-amber-450"
                    )}>
                      {p.name.split(' ')[0]} <span className="text-[4px] md:text-[6.5px] opacity-60">({p.position || 'ST'})</span>
                    </div>
                  </motion.div>
                );
              })}

              {/* AWAY TEAM (Top Half, facing DOWN) */}
              {awayPlayersOnPitch.map((item) => {
                const p = item.player;
                const ovr = getOverall(p);
                const isSelected = selectedPlayer?.id === p.id;

                return (
                  <motion.div
                    key={p.id}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    whileHover={{ scale: 1.15 }}
                    onClick={() => {
                      handleOpenEvaluation(p);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20"
                  >
                    {/* Jersey Node (Away has blue/white distinction style) */}
                    <div className={cn(
                      "w-5 h-5 md:w-9 md:h-9 rounded-full flex flex-col items-center justify-center font-black relative border transition-all shadow-lg",
                      isSelected 
                        ? "bg-amber-400 text-slate-950 border-white scale-110 ring-4 ring-amber-400/40" 
                        : "bg-blue-100 text-blue-950 border-blue-500 hover:bg-amber-400 hover:text-slate-950 group-hover:bg-amber-400 group-hover:text-slate-950 hover:border-white"
                    )}>
                      {/* Rating pill indicator */}
                      <span className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 bg-slate-900 border border-slate-700 text-[4px] md:text-[6.5px] px-0.5 md:px-1 py-0 md:py-0.5 text-yellow-300 font-extrabold rounded-md shadow">
                        {ovr}
                      </span>
                      {/* Jersey number inside player node on the field */}
                      <span className="text-[6.5px] md:text-[10px] leading-none font-black">{getPlayerJerseyNumber(item.role, p.name, p)}</span>
                    </div>

                    {/* Name block */}
                    <div className={cn(
                      "mt-0.5 md:mt-1 bg-slate-900/85 backdrop-blur-sm px-1 md:px-1.5 py-0.5 rounded-full text-[5px] md:text-[8.0px] font-black tracking-tight text-white max-w-[42px] md:max-w-[75px] truncate border border-white/5 transition-colors pointer-events-none shadow-md whitespace-nowrap",
                      isSelected ? "border-amber-400 text-amber-300" : "group-hover:border-amber-450"
                    )}>
                      {p.name.split(' ')[0]} <span className="text-[4px] md:text-[6.5px] opacity-60">({p.position || 'ST'})</span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Midfield brand labels */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[8px] font-black uppercase text-white/10 tracking-widest leading-none rotate-90 origin-left">
                GSI Tactical Alignment
              </div>
            </div>
          </div>

          {/* Skuad Breakdown informational Panel (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-4">
              <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest flex items-center">
                <Users className="w-4 h-4 text-slate-500 mr-2" /> Detail Skuad Duel Taktis
              </h4>

              <div className="grid grid-cols-2 gap-4">
                {/* Home Stats Column */}
                <div className="space-y-2 border-r border-slate-200 pr-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span className="font-black text-xs text-slate-800 truncate" title={homeTeam?.name}>{homeTeam?.name || 'Kandang'}</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Total Pemain:</span>
                      <span className="font-bold text-slate-700">{homePlayers.length}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Rata-Rata OVR:</span>
                      <span className="font-bold text-slate-750">
                        {homePlayers.length > 0 
                          ? Math.round(homePlayers.reduce((acc, p) => acc + getOverall(p), 0) / homePlayers.length)
                          : '-'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Away Stats Column */}
                <div className="space-y-2 pl-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    <span className="font-black text-xs text-slate-800 truncate" title={awayTeam?.name}>{awayTeam?.name || 'Tandang'}</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Total Pemain:</span>
                      <span className="font-bold text-slate-700">{awayPlayers.length}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Rata-Rata OVR:</span>
                      <span className="font-bold text-slate-755">
                        {awayPlayers.length > 0 
                          ? Math.round(awayPlayers.reduce((acc, p) => acc + getOverall(p), 0) / awayPlayers.length)
                          : '-'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skuad Lists Selection Details */}
            <div className="space-y-4">
              <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest pl-1">Pilih Pemain di Skuad Sesuai Posisi:</h4>
              
              <div className="max-h-[22rem] overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                {/* Home Skuad */}
                <div className="space-y-2">
                   <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg px-2.5 py-1.5 text-[9px] font-black text-emerald-800 uppercase tracking-wider flex justify-between items-center">
                    <span>{homeTeam?.name || 'Kandang'}</span>
                    <span className="text-[8px] bg-emerald-600 text-white px-1 py-0.2 rounded font-black">{homePlayers.length} Skuad</span>
                  </div>
                  <div className="space-y-1">
                    {homePlayers.map(p => {
                      const ovr = getOverall(p);
                      const isSelected = selectedPlayer?.id === p.id;
                      return (
                        <div 
                          key={p.id}
                          onClick={() => {
                            handleOpenEvaluation(p);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition-all hover:bg-slate-50",
                            isSelected 
                              ? "bg-amber-50 border-amber-300 text-amber-950 shadow-sm" 
                              : "bg-white border-slate-100 text-slate-700"
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="bg-slate-100 text-slate-500 text-[8.5px] px-1 py-0.5 rounded font-black w-8 text-center shrink-0">{p.position || 'ST'}</span>
                            {p.jerseyNumber !== undefined && p.jerseyNumber !== null && (
                              <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[8.5px] px-1.5 py-0.2 rounded font-black shrink-0">
                                #{p.jerseyNumber}
                              </span>
                            )}
                            <span className="truncate max-w-[130px] font-semibold text-slate-700">{p.name}</span>
                          </div>
                          <span className="text-[8.5px] bg-slate-900 text-yellow-300 rounded px-1.5 py-0.5 font-black shrink-0">{ovr} OVR</span>
                        </div>
                      );
                    })}
                    {homePlayers.length === 0 && (
                      <p className="text-xs text-slate-400 italic pl-2">Belum ada pemain di tim ini.</p>
                    )}
                  </div>
                </div>

                {/* Away Skuad */}
                <div className="space-y-2">
                  <div className="bg-blue-50/70 border border-blue-100 rounded-lg px-2.5 py-1.5 text-[9px] font-black text-blue-800 uppercase tracking-wider flex justify-between items-center">
                    <span>{awayTeam?.name || 'Tandang'}</span>
                    <span className="text-[8px] bg-blue-600 text-white px-1 py-0.2 rounded font-black">{awayPlayers.length} Skuad</span>
                  </div>
                  <div className="space-y-1">
                    {awayPlayers.map(p => {
                      const ovr = getOverall(p);
                      const isSelected = selectedPlayer?.id === p.id;
                      return (
                        <div 
                          key={p.id}
                          onClick={() => {
                            handleOpenEvaluation(p);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition-all hover:bg-slate-50",
                            isSelected 
                              ? "bg-amber-50 border-amber-300 text-amber-950 shadow-sm" 
                              : "bg-white border-slate-100 text-slate-700"
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="bg-slate-100 text-slate-500 text-[8.5px] px-1 py-0.5 rounded font-black w-8 text-center shrink-0">{p.position || 'ST'}</span>
                            {p.jerseyNumber !== undefined && p.jerseyNumber !== null && (
                              <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[8.5px] px-1.5 py-0.2 rounded font-black shrink-0">
                                #{p.jerseyNumber}
                              </span>
                            )}
                            <span className="truncate max-w-[130px] font-semibold text-slate-700">{p.name}</span>
                          </div>
                          <span className="text-[8.5px] bg-slate-900 text-yellow-300 rounded px-1.5 py-0.5 font-black shrink-0">{ovr} OVR</span>
                        </div>
                      );
                    })}
                    {awayPlayers.length === 0 && (
                      <p className="text-xs text-slate-400 italic pl-2">Belum ada pemain di tim ini.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* SEKSI PERBANDINGAN & HASIL PEMANTAUAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* WIDGET 1: HASIL PEMANTAUAN SCOUT TALENT */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest block">Hasil Pemantauan</span>
                <span className="inline-flex items-center space-x-1.5 font-black text-xl italic text-slate-800">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>TIM HASIL PEMANTAUAN SCOUT TALENT</span>
                </span>
              </div>
              <span className="text-xs font-black bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                {shortlistedPlayers.length} Pemain Ditandai
              </span>
            </div>

            <p className="text-slate-500 text-xs font-semibold leading-relaxed">
              Daftar pemain-pemain bertalenta emas yang telah ditandai melalui lembar Scout Form untuk dipantau dan diproyeksikan masuk ke dalam kerangka Tim Inti Turnamen GSI Ciamis.
            </p>

            {/* Grid of Shortlisted Players cards (compact styling) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
              {shortlistedPlayers.map(p => {
                const ovr = getOverall(p);
                const t = teams.find(team => team.id === p.teamId);
                const ratingDetails = getRatingDetails(ovr);
                return (
                  <div
                    key={p.id}
                    onClick={() => handleOpenEvaluation(p)}
                    className="group bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-amber-400 hover:bg-amber-50/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-9 h-9 rounded-full bg-slate-250 flex items-center justify-center font-bold text-slate-700 relative overflow-hidden flex-shrink-0">
                        {t?.logoUrl ? (
                          <img src={t.logoUrl} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 bg-slate-900 text-yellow-400 text-[6px] px-1 py-0.2 rounded font-black uppercase">
                          {p.position || 'ST'}
                        </span>
                      </div>
                      <div className="truncate">
                        <p className="font-black text-sm text-slate-850 group-hover:text-amber-800 transition-colors truncate">{p.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase truncate">{t?.name || 'Asosiasi GSI'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={cn("px-2 py-1 rounded-lg text-xs font-black", ratingDetails.badgeColor)}>
                        {ovr} OVR
                      </span>
                    </div>
                  </div>
                );
              })}

              {shortlistedPlayers.length === 0 && (
                <div className="col-span-full py-16 text-center space-y-3 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <Sliders className="w-10 h-10 text-slate-300 mx-auto animate-bounce" />
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-700 uppercase">Belum ada pemain ditandai</h5>
                    <p className="text-slate-400 text-xs px-6 mt-1 leading-relaxed">
                      Silakan pilih pemain di daftar bawah, isi evaluasinya, dan centang kotak <span className="text-amber-600 font-bold">"Masuk Tim Hasil Pemantauan"</span> lalu simpan.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold tracking-wide flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <span>💡 Klik manapun pada kartu pemain di atas untuk langsung menyesuaikan evaluasi rating</span>
            <span className="text-amber-500 font-black">GSI 2026</span>
          </div>
        </div>

        {/* WIDGET 2: KOMPARASI PEMAIN & REKOMENDASI TUGAS */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 md:p-8 shadow-md space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest block">Sistem Komparasi Mandiri</span>
                <span className="inline-flex items-center space-x-1.5 font-black text-xl italic text-white">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span>KOMPARASI PEMAIN & REKOMENDASI</span>
                </span>
              </div>
              <span className="text-[9px] font-black bg-amber-400 text-slate-900 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Live Stats Analysis
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Bandingkan metrik performa taktis antara dua pemain secara langsung. Panel komparasi akan merumuskan rekomendasi penempatan taktis ideal secara real-time.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Select Player A */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">PEMAIN PERTAMA (A)</label>
                <select
                  value={comparePlayerAId}
                  onChange={(e) => setComparePlayerAId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs font-black text-white outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Pilih Pemain A</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id} disabled={p.id === comparePlayerBId}>
                      {p.name} ({p.position || 'ST'} - {getOverall(p)} OVR)
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Player B */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">PEMAIN KEDUA (B)</label>
                <select
                  value={comparePlayerBId}
                  onChange={(e) => setComparePlayerBId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs font-black text-white outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Pilih Pemain B</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id} disabled={p.id === comparePlayerAId}>
                      {p.name} ({p.position || 'ST'} - {getOverall(p)} OVR)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Display comparison if both selected */}
            {compResult && playerA && playerB ? (
              <div className="space-y-4">
                {/* Visual Head-to-Head Attributes */}
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 space-y-2.5">
                  <div className="grid grid-cols-3 text-center text-[10px] font-extrabold text-slate-400 border-b border-slate-900 pb-1.5 font-mono">
                    <span className="text-left font-sans truncate">{playerA.name.split(' ')[0]}</span>
                    <span>METRIK</span>
                    <span className="text-right font-sans truncate">{playerB.name.split(' ')[0]}</span>
                  </div>

                  {compResult.stats.map(stat => {
                    const diff = stat.valueA - stat.valueB;
                    return (
                      <div key={stat.key} className="space-y-1 font-sans">
                        <div className="grid grid-cols-3 text-center items-center text-xs">
                          {/* Value A */}
                          <div className={cn(
                            "text-left font-black font-mono",
                            diff > 0 ? "text-emerald-400" : diff < 0 ? "text-slate-500" : "text-slate-350"
                          )}>
                            {stat.valueA}
                          </div>
                          {/* Label */}
                          <div className="text-[10px] uppercase font-bold text-slate-400">
                            {stat.key.toUpperCase()}
                          </div>
                          {/* Value B */}
                          <div className={cn(
                            "text-right font-black font-mono",
                            diff < 0 ? "text-emerald-400" : diff > 0 ? "text-slate-500" : "text-slate-350"
                          )}>
                            {stat.valueB}
                          </div>
                        </div>
                        {/* Custom horizontal slider bar representing bias */}
                        <div className="h-1.5 bg-slate-900 rounded-full flex overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-300", diff > 0 ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-transparent")}
                            style={{ width: `${Math.max(0, Math.min(100, 50 + (diff * 2)))}%` }}
                          />
                          <div 
                            className={cn("h-full transition-all duration-300", diff < 0 ? "bg-gradient-to-l from-emerald-500 to-teal-400" : "bg-transparent")}
                            style={{ width: `${Math.max(0, Math.min(100, 50 - (diff * 2)))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AI / Custom Rule-based Recommendation Output */}
                <div className="bg-amber-400/10 border border-amber-400/20 p-4 rounded-2xl space-y-2 text-left text-xs text-slate-200">
                  <div className="flex items-center space-x-2 text-amber-450 font-black uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Rekomendasi Penempatan Skuad</span>
                  </div>
                  <p className="leading-relaxed text-slate-300" dangerouslySetInnerHTML={{ __html: compResult.roleAdvantage }} />
                  <p className="leading-relaxed text-slate-300 mt-1" dangerouslySetInnerHTML={{ __html: compResult.tacticalNote }} />
                  <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-[10.5px]">
                    <span className="text-amber-400/80 font-black" dangerouslySetInnerHTML={{ __html: compResult.verdict }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="w-8 h-8 text-slate-750" />
                <h5 className="font-extrabold text-slate-400 text-xs uppercase">Komposisi Data Belum Lengkap</h5>
                <p className="text-[11px] text-slate-500 px-6 leading-relaxed">
                  Silakan tentukan Pemain Pertama & Pemain Kedua pada bilah dropdown di atas untuk memulai kalkulasi taktis komparatif.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-bold font-sans">
            <span>⚡ Data statistik dinamis dari profil performa riil masing-masing pemain</span>
            <span className="text-amber-500">Live AI Scout</span>
          </div>
        </div>

      </div>

      {/* Main Players List Filters and Cards Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
          <div>
            <h3 className="font-extrabold text-xl text-slate-800">Daftar Bakat Terpantau</h3>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">Total terpantau: {sortedPlayers.length} Pemain</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            {/* Global Attributes toggle */}
            <button
              type="button"
              onClick={() => setShowCustomAttrs(!showCustomAttrs)}
              className={cn(
                "px-4 py-2.5 text-xs font-black rounded-xl transition-all border flex items-center justify-center space-x-1.5 w-full sm:w-auto",
                showCustomAttrs
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              )}
            >
              <span>{showCustomAttrs ? '👁️ Sembunyikan Atribut Kustom' : '👁️ Tampilkan Atribut Kustom'}</span>
            </button>

            {/* Search Input */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                placeholder="Cari Nama Pemain..."
                className="pl-10 pr-4 py-2.5 w-full sm:w-64 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-pitch focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Team Filter Dropdown */}
            <select 
              className="px-4 py-2.5 text-sm font-black bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer focus:ring-1 focus:ring-pitch focus:bg-white transition-all text-slate-700 w-full sm:w-auto"
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
            >
              <option value="ALL">Semua Tim / Sekolah</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>

        {/* FUT Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
          {sortedPlayers.map(p => (
            <FutCard 
              key={p.id} 
              player={p} 
              team={teams.find(t => t.id === p.teamId)} 
              onClick={() => handleOpenEvaluation(p)} 
              globalShowCustom={showCustomAttrs}
            />
          ))}

          {sortedPlayers.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-3">
              <Search className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-black text-slate-600 text-sm uppercase">Pemain Tidak Ditemukan</h4>
              <p className="text-slate-400 text-xs">Silakan ganti kata kunci pencarian atau filter tim terpilih.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
