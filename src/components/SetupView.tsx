import React, { useState } from 'react';
import { Player, Language, GameMode } from '../types';
import { PLAYER_COLORS, ColorTheme, getColorById } from '../data/colors';
import { getTranslation, getDefaultPlayerName, formatPlayerNumber } from '../data/translations';
import { Plus, Minus, Home, Check, Globe, Trophy, ChevronDown, User } from 'lucide-react';

interface SetupViewProps {
  initialPlayers?: Player[];
  initialTargetGameCount?: number;
  initialGameMode?: GameMode;
  initialImposterCount?: number;
  language: Language;
  onToggleLanguage: () => void;
  onBackToHome: () => void;
  onStartGame: (
    players: Player[],
    targetGameCount: number,
    gameMode: GameMode,
    imposterCount: number
  ) => void;
}

export const SetupView: React.FC<SetupViewProps> = ({
  initialPlayers,
  initialTargetGameCount = 0,
  language,
  onToggleLanguage,
  onBackToHome,
  onStartGame,
}) => {
  const t = getTranslation(language);

  // targetGameCount: 0 = No Limit (optional continuous play), or 3, 5, 10
  const [targetGameCount, setTargetGameCount] = useState<number>(() => {
    if (initialTargetGameCount === 3 || initialTargetGameCount === 5 || initialTargetGameCount === 10) {
      return initialTargetGameCount;
    }
    return 0;
  });

  // Small/compact accordion state (false by default, tap to expand)
  const [isMatchLengthExpanded, setIsMatchLengthExpanded] = useState<boolean>(false);

  // Default 3 players
  const [players, setPlayers] = useState<Player[]>(() => {
    if (initialPlayers && initialPlayers.length >= 3) {
      return initialPlayers;
    }
    return [
      {
        id: 'p_1',
        name: getDefaultPlayerName(1, language),
        color: PLAYER_COLORS[0].id, // Red
        textColor: PLAYER_COLORS[0].contrastText,
        isImposter: false,
        score: 0,
      },
      {
        id: 'p_2',
        name: getDefaultPlayerName(2, language),
        color: PLAYER_COLORS[1].id, // Black
        textColor: PLAYER_COLORS[1].contrastText,
        isImposter: false,
        score: 0,
      },
      {
        id: 'p_3',
        name: getDefaultPlayerName(3, language),
        color: PLAYER_COLORS[2].id, // Yellow
        textColor: PLAYER_COLORS[2].contrastText,
        isImposter: false,
        score: 0,
      },
    ];
  });

  const [editingColorPlayerId, setEditingColorPlayerId] = useState<string | null>(null);

  // Helper to find an unused distinct color
  const getAvailableColor = (existingPlayers: Player[]): ColorTheme => {
    const usedColorIds = new Set(existingPlayers.map((p) => p.color));
    const unused = PLAYER_COLORS.find((c) => !usedColorIds.has(c.id));
    if (unused) return unused;
    return PLAYER_COLORS[existingPlayers.length % PLAYER_COLORS.length];
  };

  // Add Player (up to 15 total)
  const handleAddPlayer = () => {
    if (players.length >= 15) return;
    const nextIdx = players.length;
    const availableColor = getAvailableColor(players);
    const defaultName = getDefaultPlayerName(nextIdx + 1, language);

    const newPlayer: Player = {
      id: `p_${Date.now()}_${nextIdx + 1}`,
      name: defaultName,
      color: availableColor.id,
      textColor: availableColor.contrastText,
      isImposter: false,
      score: 0,
    };
    setPlayers([...players, newPlayer]);
  };

  // Remove player (down to minimum 3)
  const handleRemovePlayer = (id: string) => {
    if (players.length <= 3) return;
    setPlayers(players.filter((p) => p.id !== id));
  };

  // Update player name
  const handleUpdateName = (id: string, name: string) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  // Change player color
  const handleChangeColor = (playerId: string, colorTheme: ColorTheme) => {
    setPlayers(
      players.map((p) =>
        p.id === playerId
          ? { ...p, color: colorTheme.id, textColor: colorTheme.contrastText }
          : p
      )
    );
    setEditingColorPlayerId(null);
  };

  // Quick Add players up to target count
  const handleQuickPadPlayers = (targetTotal: number = 6) => {
    let current = [...players];
    while (current.length < targetTotal && current.length < 15) {
      const nextIdx = current.length;
      const availableColor = getAvailableColor(current);
      const defaultName = getDefaultPlayerName(nextIdx + 1, language);
      current.push({
        id: `p_${Date.now()}_${nextIdx + 1}`,
        name: defaultName,
        color: availableColor.id,
        textColor: availableColor.contrastText,
        isImposter: false,
        score: 0,
      });
    }
    setPlayers(current);
  };

  const handleGotIt = () => {
    onStartGame(players, targetGameCount, 'classic', 1);
  };

  return (
    <div id="setup-screen" className="min-h-screen min-h-[100dvh] bg-neutral-50 text-neutral-900 flex flex-col items-center justify-between px-4 sm:px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] select-none font-sans">
      {/* Header with Home, Settings, and Language Switcher */}
      <header className="w-full max-w-lg flex items-center justify-between py-3 border-b border-neutral-200">
        <button
          id="btn-setup-home"
          onClick={onBackToHome}
          className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 text-xs font-medium shadow-2xs"
          title="Go to Home / হোমে ফিরে যান"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{t.home}</span>
        </button>

        <div className="text-center flex items-center gap-1.5">
          <h2 className="text-sm font-semibold text-neutral-900 tracking-tight">
            {t.playersCount} ({players.length}/15)
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleLanguage}
            className="px-2 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-medium flex items-center gap-1 shadow-2xs"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-[11px]">{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>
        </div>
      </header>

      {/* Optional Series Length Selector (Small / Compact, Taps to Expand) */}
      <section id="match-length-container" className="w-full max-w-lg mt-2 bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden transition-all">
        <button
          type="button"
          id="btn-toggle-match-length"
          onClick={() => setIsMatchLengthExpanded((prev) => !prev)}
          className="w-full p-2.5 sm:p-3 flex items-center justify-between hover:bg-neutral-50/80 transition-colors text-left"
          aria-expanded={isMatchLengthExpanded}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-neutral-900">{t.matchLengthOptional}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200/80">
              {targetGameCount === 0 ? t.gamesNone : targetGameCount === 3 ? t.games3 : targetGameCount === 5 ? t.games5 : t.games10}
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${isMatchLengthExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isMatchLengthExpanded && (
          <div className="p-3 pt-0 border-t border-neutral-100">
            <p className="text-[11px] text-neutral-600 font-normal my-2">
              {t.matchLengthSub}
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { count: 0, label: t.gamesNone },
                { count: 3, label: t.games3 },
                { count: 5, label: t.games5 },
                { count: 10, label: t.games10 },
              ].map((item) => {
                const isSelected = targetGameCount === item.count;
                return (
                  <button
                    key={item.count}
                    id={`btn-match-length-${item.count}`}
                    type="button"
                    onClick={() => setTargetGameCount(item.count)}
                    className={`py-2 px-1.5 rounded-lg text-[11px] font-medium border transition-all text-center ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Action Bar for Adding Players */}
      <section className="w-full max-w-lg pt-2.5 flex items-center justify-between gap-2">
        <button
          id="btn-add-player"
          disabled={players.length >= 15}
          onClick={handleAddPlayer}
          className="w-full py-2.5 px-3 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50 text-neutral-900 text-xs font-medium shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
          title={t.addPlayer}
        >
          <User className="w-3.5 h-3.5 text-neutral-700" />
          <span>{t.addPlayer}</span>
        </button>
      </section>

      {/* Main Players List */}
      <main className="w-full max-w-lg flex-1 overflow-y-auto my-3 space-y-2.5 pr-0.5 max-h-[60vh]">
        {players.map((player, index) => {
          const playerColor = getColorById(player.color);
          const isEditingColor = editingColorPlayerId === player.id;

          return (
            <div
              key={player.id}
              id={`player-setup-card-${player.id}`}
              className="rounded-xl border p-3 shadow-2xs transition-all bg-white border-neutral-200 hover:border-neutral-300"
            >
              <div className="flex items-center gap-2.5">
                {/* Color Circle Button */}
                <button
                  onClick={() =>
                    setEditingColorPlayerId(isEditingColor ? null : player.id)
                  }
                  style={{ backgroundColor: playerColor.bgHex }}
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-xs shadow-2xs hover:scale-105 transition-transform"
                  title="Change Color"
                >
                  <span style={{ color: playerColor.contrastText }}>
                    {formatPlayerNumber(index + 1, language)}
                  </span>
                </button>

                {/* Player Name Input */}
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={player.name}
                    maxLength={18}
                    onChange={(e) => handleUpdateName(player.id, e.target.value)}
                    placeholder={getDefaultPlayerName(index + 1, language)}
                    className="w-full bg-white/90 hover:bg-white focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-lg px-2.5 py-1 text-sm font-medium text-neutral-900 outline-none transition-all"
                  />
                </div>

                {/* Delete Button (if above 3) */}
                {players.length > 3 && (
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title={t.removePlayer}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Color Picker Drawer */}
              {isEditingColor && (
                <div className="mt-3 pt-3 border-t border-neutral-200/80">
                  <p className="text-[11px] text-neutral-500 font-normal mb-2">
                    {t.chooseColor}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PLAYER_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleChangeColor(player.id, c)}
                        style={{ backgroundColor: c.bgHex }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-2xs transition-transform hover:scale-110 ${
                          player.color === c.id
                            ? 'ring-2 ring-offset-2 ring-neutral-900'
                            : ''
                        }`}
                        title={c.name}
                      >
                        {player.color === c.id && (
                          <Check
                            className="w-3.5 h-3.5"
                            style={{ color: c.contrastText }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Footer / Got It Start Action Button */}
      <footer className="w-full max-w-lg pt-2">
        <button
          id="btn-setup-got-it"
          onClick={handleGotIt}
          className="w-full py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <span>{t.gotIt}</span>
        </button>
      </footer>
    </div>
  );
};

