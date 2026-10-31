import React from 'react';
import { Player, Language, GameMode } from '../types';
import { getColorById } from '../data/colors';
import { getTranslation, formatPlayerNumber } from '../data/translations';
import { playPopSound } from '../utils/audio';
import { Check, Home, Globe, Search, User } from 'lucide-react';

interface DiscussionViewProps {
  players: Player[];
  allPlayers?: Player[];
  eliminatedPlayerIds?: string[];
  votingRound: number;
  isTieBreaker?: boolean;
  gameMode?: GameMode;
  language: Language;
  onToggleLanguage: () => void;
  onBackToHome: () => void;
  onProceedToVoting: () => void;
}

export const DiscussionView: React.FC<DiscussionViewProps> = ({
  players,
  allPlayers,
  eliminatedPlayerIds = [],
  votingRound,
  isTieBreaker = false,
  gameMode = 'classic',
  language,
  onToggleLanguage,
  onBackToHome,
  onProceedToVoting,
}) => {
  const t = getTranslation(language);
  const isParallelMode = gameMode === 'parallel_heresies';
  const displayPlayers = allPlayers && allPlayers.length > 0 ? allPlayers : players;

  const handleProceed = () => {
    playPopSound(true);
    onProceedToVoting();
  };

  const getCleanQuote = (text: string) => {
    return text.replace(/^["'“”]/, '').replace(/["'“”]$/, '');
  };

  return (
    <div
      id="discussion-screen"
      className="min-h-screen min-h-[100dvh] bg-neutral-50 text-neutral-900 flex flex-col items-center justify-between px-4 sm:px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] select-none font-sans"
    >
      {/* Top Header Bar matching Screenshot 1 */}
      <header className="w-full max-w-lg flex items-center justify-between gap-1.5 py-2.5">
        <button
          id="btn-discussion-home"
          onClick={onBackToHome}
          className="px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 text-xs font-medium shadow-2xs"
          title="Go to Home / হোমে ফিরে যান"
        >
          <Home className="w-3.5 h-3.5 text-neutral-700" />
          <span>{t.home}</span>
        </button>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <span className="text-xs font-semibold text-neutral-800 px-1">
            {isTieBreaker ? t.tieBreakerTitle : t.discussionTitle}
          </span>

          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 text-xs font-medium flex items-center gap-1 shadow-2xs hover:bg-neutral-50"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-xs font-medium">{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          <span className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 text-xs font-medium shadow-2xs">
            {formatPlayerNumber(players.length, language)} {language === 'bn' ? 'জন খেলোয়াড়' : 'Players'}
          </span>
        </div>
      </header>

      {/* Main Discussion Content */}
      <main className="w-full max-w-lg flex-1 flex flex-col items-center justify-center my-3 sm:my-4 space-y-3.5">
        {/* Banner Card with Magnifying Glass */}
        <div
          id="discussion-banner-card"
          className="w-full rounded-2xl bg-white border border-neutral-200 p-6 sm:p-7 text-center shadow-2xs space-y-3.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center mx-auto text-neutral-900">
            <Search className="w-5 h-5 stroke-[2.3]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug px-2">
              &quot;{isTieBreaker ? t.discussionSubTieBreaker : getCleanQuote(t.discussionBanner)}&quot;
            </h3>

            <p className="text-xs sm:text-sm text-neutral-600 font-normal max-w-md mx-auto leading-relaxed">
              {t.discussionSub}
            </p>
          </div>
        </div>

        {/* Players in Game List Card */}
        <div className="w-full rounded-2xl bg-white border border-neutral-200 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-800 px-0.5">
            <span className="font-semibold text-neutral-800">{t.playersCount}</span>
            <span className="text-neutral-500 font-medium">
              {formatPlayerNumber(displayPlayers.length, language)} {language === 'bn' ? 'জন খেলোয়াড়' : 'Players'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[36vh] overflow-y-auto pr-0.5">
            {displayPlayers.map((player, idx) => {
              const playerColor = getColorById(player.color);
              const isEliminated = eliminatedPlayerIds.includes(player.id);

              return (
                <div
                  key={player.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    isEliminated
                      ? 'bg-neutral-100/70 border-neutral-200 opacity-60'
                      : 'bg-white border-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      style={{ backgroundColor: playerColor.bgHex }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    >
                      <span style={{ color: playerColor.contrastText }}>
                        {formatPlayerNumber(idx + 1, language)}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-medium truncate ${
                        isEliminated
                          ? 'line-through text-neutral-500'
                          : 'text-neutral-900'
                      }`}
                    >
                      {player.name}
                    </span>
                  </div>

                  <User className="w-4 h-4 text-neutral-400 flex-shrink-0 ml-1.5" />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer / Proceed to Voting Button */}
      <footer className="w-full max-w-lg pt-2">
        <button
          id="btn-proceed-to-voting"
          onClick={handleProceed}
          className="w-full py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{t.gotIt}</span>
        </button>
      </footer>
    </div>
  );
};
