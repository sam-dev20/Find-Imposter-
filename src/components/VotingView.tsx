import React, { useState } from 'react';
import { Player, Language } from '../types';
import { getColorById } from '../data/colors';
import { getTranslation, formatPlayerNumber } from '../data/translations';
import { Check, Home } from 'lucide-react';

interface VotingViewProps {
  currentVoter: Player;
  voterIndex: number;
  totalPlayers: number;
  allPlayers: Player[];
  language: Language;
  onBackToHome: () => void;
  onCastVote: (voterId: string, targetId: string) => void;
}

export const VotingView: React.FC<VotingViewProps> = ({
  currentVoter,
  voterIndex,
  totalPlayers,
  allPlayers,
  language,
  onBackToHome,
  onCastVote,
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const t = getTranslation(language);
  const voterColor = getColorById(currentVoter.color);

  const handleVoteSubmit = () => {
    if (!selectedTargetId) return;
    onCastVote(currentVoter.id, selectedTargetId);
  };

  return (
    <div
      id="voting-screen"
      style={{
        backgroundColor: voterColor.bgHex,
      }}
      className="min-h-screen min-h-[100dvh] text-white flex flex-col items-center justify-between px-4 sm:px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] select-none relative font-sans transition-colors duration-300"
    >
      {/* Top Header with Home Button */}
      <header
        style={{ color: voterColor.contrastText }}
        className="w-full max-w-md flex items-center justify-between text-xs font-medium py-2"
      >
        <button
          onClick={onBackToHome}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: voterColor.contrastText,
          }}
          className="px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-black/30 transition-colors shadow-sm"
          title="Go to Home / হোমে ফিরে যান"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">{t.home}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
            className="w-5 h-5 rounded-full flex items-center justify-center font-semibold text-[10px]"
          >
            {formatPlayerNumber(voterIndex + 1, language)}
          </span>
          <span className="font-semibold text-xs">
            {currentVoter.name}{t.turnSuffix}
          </span>
        </div>

        <span className="font-medium text-[11px]">
          {formatPlayerNumber(voterIndex + 1, language)} / {formatPlayerNumber(totalPlayers, language)}
        </span>
      </header>

      {/* Main suspect list */}
      <main className="w-full max-w-md flex-1 overflow-y-auto my-4 space-y-3 pr-0.5 max-h-[65vh]">
        <div className="text-center mb-4">
          <h3
            style={{ color: voterColor.contrastText }}
            className="text-xl font-semibold tracking-tight"
          >
            {t.whoToVote}
          </h3>
          <p
            style={{ color: voterColor.contrastText }}
            className="text-xs font-normal mt-0.5"
          >
            {t.selectAndVote}
          </p>
        </div>

        {/* List of every player to vote for */}
        <div className="space-y-2">
          {allPlayers.map((player, idx) => {
            const playerColor = getColorById(player.color);
            const isSelected = selectedTargetId === player.id;
            const isSelf = player.id === currentVoter.id;

            return (
              <button
                key={player.id}
                id={`btn-vote-target-${player.id}`}
                onClick={() => setSelectedTargetId(player.id)}
                className={`w-full rounded-xl p-3 border text-left transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.01]'
                    : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: playerColor.bgHex }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm flex-shrink-0"
                  >
                    <span style={{ color: playerColor.contrastText }}>
                      {formatPlayerNumber(idx + 1, language)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">
                      {player.name}
                    </span>
                    {isSelf && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                          isSelected
                            ? 'bg-neutral-800 text-neutral-300'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {t.you}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${
                    isSelected
                      ? 'border-white bg-white text-neutral-900'
                      : 'border-neutral-300 bg-neutral-50'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Action Submit Button */}
      <footer className="w-full max-w-md pb-2">
        <button
          id="btn-confirm-vote-action"
          disabled={!selectedTargetId}
          onClick={handleVoteSubmit}
          className="w-full py-3.5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-white text-sm font-semibold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{t.confirmVote}</span>
        </button>
      </footer>
    </div>
  );
};

