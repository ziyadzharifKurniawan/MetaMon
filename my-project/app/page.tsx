'use client';

import React, { useState, useEffect, useCallback } from 'react';

const C = {
  bg: '#040410',
  panel: '#07071a',
  card: '#0c0c22',
  cardHover: '#10102e',
  border: '#18184a',
  borderActive: '#2a2a70',
  cyan: '#00f5ff',
  pink: '#ff0080',
  yellow: '#ffe600',
  green: '#00ff88',
  purple: '#bb00ff',
  text: '#c8c8f0',
  textMuted: '#484880',
  textDim: '#282860',
  white: '#ffffff'
};

const TYPE_META: Record<string, { bg: string; glow: string }> = {
  normal:   { bg: '#5a5a3a', glow: '#a0a070' },
  fire:     { bg: '#8a3a10', glow: '#ff5500' },
  water:    { bg: '#1a3a9a', glow: '#3366ff' },
  electric: { bg: '#7a6000', glow: '#ffdd00' },
  grass:    { bg: '#2a5a1a', glow: '#33cc33' },
  ice:      { bg: '#2a7a7a', glow: '#00eeff' },
  fighting: { bg: '#7a1010', glow: '#ff2200' },
  poison:   { bg: '#4a1070', glow: '#cc00ff' },
  ground:   { bg: '#6a5010', glow: '#cc9900' },
  flying:   { bg: '#3a2a8a', glow: '#7755ff' },
  psychic:  { bg: '#8a1040', glow: '#ff0055' },
  bug:      { bg: '#3a5000', glow: '#77bb00' },
  rock:     { bg: '#5a4010', glow: '#997700' },
  ghost:    { bg: '#2a1050', glow: '#7722ff' },
  dragon:   { bg: '#2a0a9a', glow: '#4400ff' },
  dark:     { bg: '#2a1a08', glow: '#775522' },
  steel:    { bg: '#3a3a50', glow: '#8888cc' },
  fairy:    { bg: '#7a2050', glow: '#ff44aa' },
  stellar:  { bg: '#005050', glow: '#00ddcc' },
};

const LEGAL_SPECIES_LIST = new Set([
  'abomasnow', 'absol', 'aegislash', 'aerodactyl', 'aggron', 'alakazam', 'alcremie', 'altaria',
  'ampharos', 'appletun', 'araquanid', 'arbok', 'arcanine', 'archaludon', 'ariados', 'armarouge',
  'aromatisse', 'audino', 'aurorus', 'avalugg', 'azumarill', 'banette', 'basculegion', 'bastiodon',
  'beartic', 'beedrill', 'bellibolt', 'blastoise', 'camerupt', 'castform', 'ceruledge', 'chandelure',
  'charizard', 'chesnaught', 'chimecho', 'clawitzer', 'clefable', 'cofagrigus', 'conkeldurr', 'corviknight',
  'crabominable', 'decidueye', 'dedenne', 'delphox', 'diggersby', 'ditto', 'dragapult', 'dragonite',
  'drampa', 'emboar', 'emolga', 'empoleon', 'espathra', 'espeon', 'excadrill', 'farigiraf',
  'feraligatr', 'flapple', 'flareon', 'floette', 'florges', 'forretress', 'froslass', 'furfrou',
  'gallade', 'garbodor', 'garchomp', 'gardevoir', 'garganacl', 'gengar', 'glaceon', 'glalie',
  'glimmora', 'gliscor', 'golurk', 'goodra', 'gourgeist', 'greninja', 'gyarados', 'hatterene',
  'hawlucha', 'heliolisk', 'heracross', 'hippowdon', 'houndoom', 'hydrapple', 'hydreigon', 'incineroar',
  'infernape', 'jolteon', 'kangaskhan', 'kingambit', 'kleavor', 'klefki', 'kommo-o', 'krookodile',
  'leafeon', 'liepard', 'lopunny', 'lucario', 'luxray', 'lycanroc', 'machamp', 'mamoswine',
  'manectric', 'maushold', 'medicham', 'meganium', 'meowscarada', 'meowstic', 'milotic', 'mimikyu',
  'morpeko', 'mr-rime', 'mudsdale', 'ninetales', 'noivern', 'oranguru', 'orthworm', 'palafin',
  'pangoro', 'passimian', 'patrat', 'pelipper', 'pidgeot', 'pikachu', 'pinsir', 'politoed',
  'polteageist', 'primarina', 'quaquaval', 'raichu', 'rampardos', 'reuniclus', 'rhyperior', 'roserade',
  'rotom', 'runerigus', 'sableye', 'salazzle', 'samurott', 'sandaconda', 'scizor', 'scovillain',
  'serperior', 'sharpedo', 'simipour', 'simisage', 'simisear', 'sinistcha', 'skarmory', 'skeledirge',
  'slowbro', 'slowking', 'slurpuff', 'sneasler', 'snorlax', 'spiritomb', 'starmie', 'steelix',
  'stunfisk', 'sylveon', 'talonflame', 'tauros', 'tinkaton', 'torkoal', 'torterra', 'toucannon',
  'toxapex', 'toxicroak', 'trevenant', 'tsareena', 'typhlosion', 'tyranitar', 'tyrantrum', 'umbreon',
  'vanilluxe', 'vaporeon', 'venusaur', 'victreebel', 'vivillon', 'volcarona', 'weavile', 'whimsicott',
  'wyrdeer', 'zoroark'
]);

const LEGAL_ITEMS_LIST = new Set([
  'abomasite', 'absolite', 'aerodactylite', 'aggronite', 'alakazite', 'altarianite',
  'ampharosite', 'aspearberry', 'audinite', 'babiriberry', 'banettite', 'beedrillite',
  'blackbelt', 'blackglasses', 'blastoisinite', 'brightpowder', 'cameruptite', 'chandelurite',
  'charcoal', 'charizarditex', 'charizarditey', 'chartiberry', 'cheriberry', 'chesnaughtite',
  'chestoberry', 'chilanberry', 'chimechite', 'choicescarf', 'chopleberry', 'clefablite',
  'cobaberry', 'colburberry', 'crabominite', 'delphoxite', 'dragonfang', 'dragoninite',
  'drampanite', 'emboarite', 'excadrite', 'fairyfeather', 'feraligite', 'floettite',
  'focusband', 'focussash', 'froslassite', 'galladite', 'garchompite', 'gardevoirite',
  'gengarite', 'glalitite', 'glimmoranite', 'golurkite', 'greninjite', 'gyaradosite',
  'habanberry', 'hardstone', 'hawluchanite', 'heracronite', 'houndoominite', 'kangaskhanite',
  'kasibberry', 'kebiaberry', 'kingsrock', 'leftovers', 'leppaberry', 'lightball',
  'lopunnite', 'lucarionite', 'lumberry', 'magnet', 'manectite', 'medichamite',
  'meganiumite', 'mentalherb', 'meowsticite', 'metalcoat', 'miracleseed', 'mysticwater',
  'nevermeltice', 'occaberry', 'oranberry', 'passhoberry', 'payapaberry', 'pechaberry',
  'persimberry', 'pidgeotite', 'pinsirite', 'poisonbarb', 'quickclaw', 'rawstberry',
  'rindoberry', 'roseliberry', 'sablenite', 'scizorite', 'scopelens', 'scovillainite',
  'sharpbeak', 'sharpedonite', 'shellbell', 'shucaberry', 'silkscarf', 'silverpowder',
  'sitrusberry', 'skarmorite', 'slowbronite', 'softsand', 'spelltag', 'starminite',
  'steelixite', 'tangaberry', 'twistedspoon', 'tyranitarite', 'venusaurite', 'victreebelite',
  'wacanberry', 'whiteherb', 'yacheberry'
]);

const parseCleanString = (str: string): string => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
};

const checkPokemonLegality = (pokemonId: string): boolean => {
  const lowerId = pokemonId.toLowerCase().trim();
  if (LEGAL_SPECIES_LIST.has(lowerId)) return true;
  if (lowerId.startsWith('kommo-o')) return true;
  if (lowerId.startsWith('mr-rime')) return true;

  const baseMatch = lowerId.match(/^([a-z0-9]+)/);
  if (baseMatch && LEGAL_SPECIES_LIST.has(baseMatch[1])) return true;
  return false;
};

const checkItemLegality = (itemName: string): boolean => {
  if (!itemName) return false;
  return LEGAL_ITEMS_LIST.has(parseCleanString(itemName));
};

interface Pokemon {
  id: string;
  name: string;
  type1: string;
  type2: string | null;
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
  tier: string;
  is_nonstandard: string | null;
}

interface LearnsetMove {
  id: string;
  name: string;
  type: string;
  category: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
  description: string | null;
  method: string;
  level: number | null;
}

interface Ability {
  name: string;
  description?: string;
}

interface TeamSlot {
  pokemon: Pokemon | null;
  learnset: LearnsetMove[];
  availableAbilities: Ability[];
  ability: string;
  item: string;
  nature: string;
  moves: string[];
  ivs: Record<string, number>;
}

const emptySlot = (): TeamSlot => ({
  pokemon: null,
  learnset: [],
  availableAbilities: [],
  ability: '',
  item: '',
  nature: '',
  moves: ['', '', '', ''],
  ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
});

const ExpandableDescription = ({ text }: { text: string | null | undefined }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  
  const isLong = text.length > 50;
  return (
    <div style={{ fontSize: 11, color: C.white, marginTop: 6, lineHeight: 1.4 }}>
      {expanded || !isLong ? text : `${text.substring(0, 50)}...`}
      {isLong && (
        <span 
          onClick={(e) => { 
            e.stopPropagation(); 
            setExpanded(!expanded); 
          }}
          style={{
            color: C.cyan, 
            fontSize: 9, 
            cursor: 'pointer', 
            marginLeft: 8,
            textDecoration: 'underline'
          }}
        >
          {expanded ? 'LESS' : 'MORE'}
        </span>
      )}
    </div>
  );
};

const PokemonSprite = ({ id, size = 64 }: { id: string; size?: number }) => {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div style={{
        width: size, height: size,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.textMuted, fontSize: size * 0.35,
        border: `1px dashed ${C.border}`, borderRadius: 4,
      }}>?</div>
    );
  }
  return (
    <img
      src={`https://play.pokemonshowdown.com/sprites/dex/${id}.png`}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
      onError={() => setErr(true)}
      alt={id}
    />
  );
};

const TypeBadge = ({ type }: { type: string | null | undefined }) => {
  const safeType = (type || 'unknown').toLowerCase();
  const meta = TYPE_META[safeType] || { bg: '#333', glow: '#666' };
  return (
    <span
      style={{
        background: meta.bg, color: '#fff',
        border: `1px solid ${meta.glow}60`,
        boxShadow: `0 0 5px ${meta.glow}40`,
        padding: '2px 7px', borderRadius: 2,
        fontSize: 7, fontFamily: "'Press Start 2P', monospace",
        textTransform: 'uppercase', letterSpacing: 0.5,
        display: 'inline-block',
      }}
    >
      {safeType}
    </span>
  );
};

export default function Home() {
  const [team, setTeam] = useState<TeamSlot[]>(Array(6).fill(null).map(emptySlot));
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pokemon' | 'moves' | 'items' | 'stats'>('pokemon');
  
  // API & Client side pagination controls
  const [pokemonPage, setPokemonPage] = useState(1);
  const [totalPokemonPages, setTotalPokemonPages] = useState(1);
  const [loadingMorePokemon, setLoadingMorePokemon] = useState(false);

  const [items, setItems] = useState<any[]>([]);
  const [visibleItemsCount, setVisibleItemsCount] = useState(25);
  
  const [natures, setNatures] = useState<any[]>([]);
  const [moveSearch, setMoveSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [selectedMoveSlot, setSelectedMoveSlot] = useState<number | null>(null);
  const [visibleMovesCount, setVisibleMovesCount] = useState(25);

  const [showVerify, setShowVerify] = useState(false);
  const [verifyErrors, setVerifyErrors] = useState<string[]>([]);

  const searchPokemon = useCallback(async (q: string, pageNum = 1, append = false) => {
    if (!append) {
      setLoading(true);
    } else {
      setLoadingMorePokemon(true);
    }
    try {
      const res = await fetch(`/api/pokemon?search=${q}&page=${pageNum}`);
      const data = await res.json();
      if (append) {
        setPokemonList(prev => [...prev, ...data.pokemon]);
      } else {
        setPokemonList(data.pokemon || []);
      }
      setTotalPokemonPages(data.pages || 1);
      setPokemonPage(pageNum);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setLoadingMorePokemon(false);
  }, []);

  useEffect(() => { searchPokemon('', 1, false); }, []);

  useEffect(() => {
    const t = setTimeout(() => { searchPokemon(search, 1, false); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetch('/api/natures').then(r => r.json()).then(setNatures);
  }, []);

  useEffect(() => {
    if (activeTab === 'items') {
      const t = setTimeout(() => {
        fetch(`/api/items?search=${itemSearch}`).then(r => r.json()).then(data => {
          setItems(data || []);
          setVisibleItemsCount(25); // Reset viewing slice window on query updates
        });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [itemSearch, activeTab]);

  // Reset move slice when active target configurations swap
  useEffect(() => {
    setVisibleMovesCount(25);
  }, [moveSearch, selectedMoveSlot]);

  const addPokemon = async (pokemon: Pokemon) => {
    if (selectedSlot === null) return;
    const res = await fetch(`/api/pokemon/${pokemon.id}`);
    const data = await res.json();
    const learnset: LearnsetMove[] = data.learnset || [];
    const availableAbilities = data.abilities?.map((a: any) => ({
      name: a.name, description: a.description || 'No description available.'
    })) || [];

    setTeam(prev => {
      const next = [...prev];
      next[selectedSlot] = {
        ...next[selectedSlot],
        pokemon,
        learnset,
        availableAbilities,
        moves: ['', '', '', ''],
        ability: availableAbilities[0]?.name || '',
      };
      return next;
    });
  };

  const updateSlot = (field: string, value: any) => {
    if (selectedSlot === null) return;
    setTeam(prev => {
      const next = [...prev];
      next[selectedSlot] = { ...next[selectedSlot], [field]: value };
      return next;
    });
  };

  const updateIV = (stat: string, value: number) => {
    if (selectedSlot === null) return;
    setTeam(prev => {
      const next = [...prev];
      next[selectedSlot!] = {
        ...next[selectedSlot!],
        ivs: { ...next[selectedSlot!].ivs, [stat]: Math.min(31, Math.max(0, value)) }
      };
      return next;
    });
  };

  const setMove = (moveName: string) => {
    if (selectedSlot === null || selectedMoveSlot === null) return;
    setTeam(prev => {
      const next = [...prev];
      const moves = [...next[selectedSlot!].moves];
      moves[selectedMoveSlot] = moveName;
      next[selectedSlot!] = { ...next[selectedSlot!], moves };
      return next;
    });
    setSelectedMoveSlot(null);
  };

  const runVerification = () => {
    const errors: string[] = [];
    team.forEach((slot) => {
      if (!slot.pokemon) return;
      
      if (!checkPokemonLegality(slot.pokemon.id)) {
        errors.push(`${slot.pokemon.name} is Illegal under current rules.`);
      }

      if (slot.item && !checkItemLegality(slot.item)) {
        errors.push(`The item "${slot.item}" chosen for ${slot.pokemon.name} is Illegal.`);
      }

      const activeMoves = slot.moves.filter(Boolean);
      const moveCounts: Record<string, number> = {};
      activeMoves.forEach(m => { moveCounts[m] = (moveCounts[m] || 0) + 1; });
      Object.entries(moveCounts).forEach(([move, count]) => {
        if (count > 1) {
          errors.push(`${slot.pokemon.name} has duplicate configurations for the move: ${move}`);
        }
      });
    });
    setVerifyErrors(errors);
    setShowVerify(true);
  };

  const currentSlot = selectedSlot !== null ? team[selectedSlot] : null;
  const activeNatureData = natures.find(n => n.id === currentSlot?.nature);

  const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
  const statLabels: Record<string, string> = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
  const statColors: Record<string, string> = { hp: C.green, atk: C.pink, def: C.yellow, spa: C.cyan, spd: C.purple, spe: '#ff8800' };
  
  const filteredLearnset = currentSlot?.learnset.filter(m => {
    return m.name.toLowerCase().includes(moveSearch.toLowerCase());
  }) ?? [];

  const uniqueMoveNames = Array.from(new Map(filteredLearnset.map(m => [m.name, m])).values());
  const itemsSlice = items.slice(0, visibleItemsCount);
  const movesSlice = uniqueMoveNames.slice(0, visibleMovesCount);

  const inputStyle: React.CSSProperties = {
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 3,
    padding: '10px 14px', color: C.text, fontFamily: 'monospace',
    fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box',
  };

  const loadMoreButtonStyle: React.CSSProperties = {
    width: '100%', padding: '14px', marginTop: '12px', background: C.panel,
    border: `2px dashed ${C.borderActive}`, color: C.cyan, cursor: 'pointer',
    fontFamily: "'Press Start 2P', monospace", fontSize: '9px', borderRadius: '4px',
    textAlign: 'center', transition: 'all 0.15s'
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'monospace' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.panel}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.borderActive}; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
        select option { background: ${C.card}; }
        .load-more-btn:hover { background: ${C.cyan}15 !important; border-style: solid !important; }
      `}</style>

      {showVerify && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: C.panel, padding: 30, border: `2px solid ${verifyErrors.length ? C.pink : C.green}`,
            borderRadius: 8, maxWidth: 500, width: '100%', boxShadow: `0 0 40px ${verifyErrors.length ? C.pink : C.green}40`
          }}>
            <h2 style={{ fontFamily: "'Press Start 2P', monospace", color: verifyErrors.length ? C.pink : C.green, fontSize: 14, textAlign: 'center' }}>
              {verifyErrors.length ? 'REGULATION ERRORS DETECTED' : 'TEAM IS COMPLETELY LEGAL!'}
            </h2>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {verifyErrors.map((err, i) => (
                <div key={i} style={{ color: C.white, fontSize: 12 }}>• {err}</div>
              ))}
              {verifyErrors.length === 0 && (
                <div style={{ color: C.white, fontSize: 12, textAlign: 'center' }}>All Pokémon and held items match tournament rules perfectly.</div>
              )}
            </div>
            <button
              onClick={() => setShowVerify(false)}
              style={{ width: '100%', padding: 12, marginTop: 24, background: C.card, border: `1px solid ${C.border}`, color: C.white, cursor: 'pointer', fontFamily: "'Press Start 2P', monospace", fontSize: 10 }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      <header style={{
        background: C.panel, borderBottom: `2px solid ${C.cyan}`,
        boxShadow: `0 0 30px ${C.cyan}25, 0 2px 40px ${C.cyan}15`,
        padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 15, color: C.cyan, textShadow: `0 0 10px ${C.cyan}, 0 0 30px ${C.cyan}60`, margin: 0, letterSpacing: 1 }}>
          ⚡ POKÉMON TEAM BUILDER
        </h1>
        <button 
          onClick={runVerification}
          style={{
            background: C.cardHover, border: `1px solid ${C.cyan}`, color: C.cyan, 
            padding: '8px 16px', fontFamily: "'Press Start 2P', monospace", fontSize: 10,
            cursor: 'pointer', borderRadius: 4, boxShadow: `0 0 10px ${C.cyan}40`
          }}
        >
          VERIFY TEAM
        </button>
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 57px)' }}>

        <div style={{ width: 340, background: C.panel, borderRight: `2px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.textMuted, letterSpacing: 2 }}>YOUR TEAM</div>
          </div>
          <div style={{ padding: 10, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {team.map((slot, i) => {
              const isSelected = selectedSlot === i;
              const isItemLegal = slot.item ? checkItemLegality(slot.item) : true;
              return (
                <button
                  key={i} onClick={() => setSelectedSlot(i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                    background: isSelected ? `${C.cyan}12` : C.card,
                    border: `2px solid ${isSelected ? C.cyan : C.border}`,
                    borderRadius: 4, boxShadow: isSelected ? `0 0 14px ${C.cyan}45, inset 0 0 20px ${C.cyan}08` : 'none',
                    cursor: 'pointer', transition: 'all 0.15s', color: C.text, textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    border: `2px solid ${isSelected ? C.cyan : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                    color: isSelected ? C.cyan : C.textMuted, flexShrink: 0,
                  }}>{i + 1}</div>

                  {slot.pokemon ? (
                    <>
                      <PokemonSprite id={slot.pokemon.id} size={44} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{
                          fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                          color: isSelected ? C.cyan : C.text, textTransform: 'uppercase',
                          marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {slot.pokemon.name}
                        </div>
                        {slot.item && (
                          <div style={{ fontSize: 9, color: isItemLegal ? C.green : C.pink, marginBottom: 4 }}>
                            Item: {slot.item} ({isItemLegal ? 'Legal' : 'Illegal'})
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          <TypeBadge type={slot.pokemon.type1} />
                          {slot.pokemon.type2 && <TypeBadge type={slot.pokemon.type2} />}
                        </div>
                      </div>
                    </>
                  ) : (
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.textDim, letterSpacing: 1 }}>EMPTY SLOT</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {selectedSlot !== null && (
            <div style={{ display: 'flex', background: C.panel, borderBottom: `2px solid ${C.border}` }}>
              {(['pokemon', 'moves', 'items', 'stats'] as const).map(tab => (
                <button
                  key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '14px 22px', fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                    textTransform: 'uppercase', letterSpacing: 1,
                    color: activeTab === tab ? C.cyan : C.textMuted,
                    background: activeTab === tab ? `${C.cyan}10` : 'transparent',
                    border: 'none', borderBottom: `3px solid ${activeTab === tab ? C.cyan : 'transparent'}`,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            {selectedSlot === null && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 20 }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: C.cyan, textShadow: `0 0 20px ${C.cyan}`, textAlign: 'center' }}>
                  SELECT A SLOT
                </div>
              </div>
            )}

            {selectedSlot !== null && activeTab === 'pokemon' && (
              <div>
                <input
                  type="text" placeholder="SEARCH POKÉMON..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 16, fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 1 }}
                />
                {loading ? (
                  <div style={{ textAlign: 'center', color: C.cyan, fontFamily: "'Press Start 2P', monospace", fontSize: 10, padding: 48 }}>LOADING...</div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {pokemonList.map(p => {
                        const isLegal = checkPokemonLegality(p.id);
                        return (
                          <button
                            key={p.id} onClick={() => addPokemon(p)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                              background: C.card, border: `1px solid ${isLegal ? C.green : C.pink}`, borderRadius: 4,
                              cursor: 'pointer', textAlign: 'left', color: C.text, transition: 'all 0.12s',
                            }}
                          >
                            <PokemonSprite id={p.id} size={54} />
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: isLegal ? C.green : C.pink, textTransform: 'uppercase', marginBottom: 6 }}>
                                {p.name} <span>({isLegal ? 'Legal' : 'Illegal'})</span>
                              </div>
                              <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                                <TypeBadge type={p.type1} />
                                {p.type2 && <TypeBadge type={p.type2} />}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    
                    {pokemonPage < totalPokemonPages && (
                      <button 
                        className="load-more-btn"
                        style={loadMoreButtonStyle}
                        onClick={() => searchPokemon(search, pokemonPage + 1, true)}
                        disabled={loadingMorePokemon}
                      >
                        {loadingMorePokemon ? 'LOADING CONTENT...' : '▼ LOAD MORE POKÉMON ▼'}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {selectedSlot !== null && activeTab === 'moves' && currentSlot && (
              <div>
                {!currentSlot.pokemon ? (
                  <div style={{ textAlign: 'center', color: C.textMuted, fontFamily: "'Press Start 2P', monospace", fontSize: 9, padding: 48 }}>SELECT A POKÉMON FIRST</div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                      {currentSlot.moves.map((move, i) => (
                        <button
                          key={i} onClick={() => setSelectedMoveSlot(i)}
                          style={{
                            padding: '12px 14px',
                            background: selectedMoveSlot === i ? `${C.pink}15` : C.card,
                            border: `2px solid ${selectedMoveSlot === i ? C.pink : C.border}`,
                            borderRadius: 4, cursor: 'pointer', textAlign: 'left', color: C.text,
                          }}
                        >
                          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: selectedMoveSlot === i ? C.pink : C.textMuted, marginBottom: 8 }}>MOVE {i + 1}</div>
                          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: move ? (selectedMoveSlot === i ? C.pink : C.text) : C.textDim, textTransform: 'uppercase' }}>
                            {move || 'NO MOVE'}
                          </div>
                        </button>
                      ))}
                    </div>

                    {selectedMoveSlot !== null && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <input type="text" placeholder="SEARCH MOVES..." value={moveSearch} onChange={e => setMoveSearch(e.target.value)} style={{ ...inputStyle, marginBottom: 10, fontFamily: "'Press Start 2P', monospace", fontSize: 9 }} />
                        
                        {movesSlice.map(m => (
                          <button
                            key={m.id} onClick={() => setMove(m.name)}
                            style={{
                              width: '100%', padding: '9px 12px', background: C.card, border: `1px solid ${C.border}`,
                              borderRadius: 3, cursor: 'pointer', textAlign: 'left', color: C.text, display: 'block'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <TypeBadge type={m.type} />
                              <span style={{ flex: 1, fontSize: 12 }}>{m.name}</span>
                              <span style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase' }}>{m.category}</span>
                            </div>
                          </button>
                        ))}

                        {visibleMovesCount < uniqueMoveNames.length && (
                          <button 
                            className="load-more-btn"
                            style={loadMoreButtonStyle}
                            onClick={() => setVisibleMovesCount(prev => prev + 25)}
                          >
                            ▼ LOAD MORE MOVES ({uniqueMoveNames.length - visibleMovesCount} REMAINING) ▼
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {selectedSlot !== null && activeTab === 'items' && currentSlot && (
              <div>
                <input type="text" placeholder="SEARCH ITEMS..." value={itemSearch} onChange={e => setItemSearch(e.target.value)} style={{ ...inputStyle, marginBottom: 14, fontFamily: "'Press Start 2P', monospace", fontSize: 9 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {itemsSlice.map(item => {
                    const isLegal = checkItemLegality(item.name);
                    return (
                      <button
                        key={item.id} onClick={() => updateSlot('item', item.name)}
                        style={{
                          width: '100%', padding: '10px 14px', display: 'block',
                          background: C.card, border: `1px solid ${isLegal ? C.green : C.pink}`,
                          borderRadius: 4, cursor: 'pointer', textAlign: 'left', color: isLegal ? C.green : C.pink,
                        }}
                      >
                        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9 }}>
                          {item.name} <span>({isLegal ? 'Legal' : 'Illegal'})</span>
                        </div>
                        <ExpandableDescription text={item.description} />
                      </button>
                    );
                  })}

                  {visibleItemsCount < items.length && (
                    <button 
                      className="load-more-btn"
                      style={loadMoreButtonStyle}
                      onClick={() => setVisibleItemsCount(prev => prev + 25)}
                    >
                      ▼ LOAD MORE ITEMS ({items.length - visibleItemsCount} REMAINING) ▼
                    </button>
                  )}
                </div>
              </div>
            )}

            {selectedSlot !== null && activeTab === 'stats' && currentSlot && (
              <div style={{ maxWidth: 800 }}>
                {currentSlot.pokemon && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, padding: '14px 20px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                    <PokemonSprite id={currentSlot.pokemon.id} size={90} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: C.cyan, textTransform: 'uppercase', marginBottom: 10 }}>
                        {currentSlot.pokemon.name}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        <TypeBadge type={currentSlot.pokemon.type1} />
                        {currentSlot.pokemon.type2 && <TypeBadge type={currentSlot.pokemon.type2} />}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.textMuted, letterSpacing: 2, marginBottom: 10 }}>NATURE</div>
                    <select
                      value={currentSlot.nature} onChange={e => updateSlot('nature', e.target.value)}
                      style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: '10px 14px', color: C.text, fontFamily: 'monospace', fontSize: 13, outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="">SELECT NATURE</option>
                      {natures.map(n => (
                        <option key={n.id} value={n.id}>
                          {n.name}{n.plus_stat ? ` (+${statLabels[n.plus_stat]} -${statLabels[n.minus_stat]})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.textMuted, letterSpacing: 2, marginBottom: 10 }}>ABILITY</div>
                    <select
                      value={currentSlot.ability} onChange={e => updateSlot('ability', e.target.value)}
                      style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: '10px 14px', color: C.text, fontFamily: 'monospace', fontSize: 13, outline: 'none', cursor: 'pointer' }}
                    >
                      {currentSlot.availableAbilities?.length > 0 ? (
                        currentSlot.availableAbilities.map(a => (
                          <option key={a.name} value={a.name}>{a.name}</option>
                        ))
                      ) : (
                        <option value="">No Abilities Available</option>
                      )}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 24 }}>
                  {currentSlot.pokemon && (
                    <div>
                      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.textMuted, letterSpacing: 2, marginBottom: 12 }}>BASE STATS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {stats.map(stat => {
                          const base = (currentSlot.pokemon![stat as keyof Pokemon] as number) ?? 0;
                          const color = statColors[stat];
                          return (
                            <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ width: 36, fontFamily: "'Press Start 2P', monospace", fontSize: 7, color }}>{statLabels[stat]}</span>
                              <div style={{ flex: 1, height: 14, background: '#0a0a20', border: `1px solid ${C.border}`, borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${Math.min(100, (base / 255) * 100)}%`, background: `linear-gradient(90deg, ${color}55, ${color})` }} />
                              </div>
                              <span style={{ width: 50, textAlign: 'right', fontSize: 12, color, fontWeight: 'bold' }}>{base}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.textMuted, letterSpacing: 2, marginBottom: 12 }}>IVS (0 - 31)</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {stats.map(stat => (
                        <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ width: 36, fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: statColors[stat] }}>{statLabels[stat]}</span>
                          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', height: 8, background: '#0a0a20', borderRadius: 4, zIndex: 0 }}>
                              <div style={{ height: '100%', width: `${(currentSlot.ivs[stat] / 31) * 100}%`, background: C.cyan, borderRadius: 4 }} />
                            </div>
                            <input
                              type="range" min={0} max={31} value={currentSlot.ivs[stat]} onChange={e => updateIV(stat, parseInt(e.target.value))}
                              style={{ flex: 1, zIndex: 1, opacity: 0, cursor: 'pointer' }}
                            />
                          </div>
                          <input
                            type="number" min={0} max={31} value={currentSlot.ivs[stat]} onChange={e => updateIV(stat, parseInt(e.target.value) || 0)}
                            style={{
                              width: 52, background: C.card, border: `1px solid ${C.border}`, borderRadius: 3, padding: '5px 6px',
                              fontSize: 14, color: C.white, textAlign: 'center', fontFamily: 'monospace', outline: 'none', fontWeight: 'bold'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}