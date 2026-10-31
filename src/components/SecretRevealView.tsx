import React, { useState } from 'react';
import { Player, WordItem, Language, GameMode } from '../types';
import { getColorById } from '../data/colors';
import { getTranslation, formatPlayerNumber } from '../data/translations';
import { motion } from 'motion/react';
import { ChevronUp, ChevronDown, Check, Home, Sparkles } from 'lucide-react';

interface SecretRevealViewProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  totalImposters?: number;
  teammateImposters?: Player[];
  wordItem: WordItem;
  gameMode?: GameMode;
  assignedHint?: { en: string; bn: string };
  language: Language;
  onBackToHome: () => void;
  onPlayerGotIt: () => void;
}

export const SecretRevealView: React.FC<SecretRevealViewProps> = ({
  player,
  playerIndex,
  totalPlayers,
  totalImposters = 1,
  teammateImposters = [],
  wordItem,
  gameMode = 'classic',
  assignedHint,
  language,
  onBackToHome,
  onPlayerGotIt,
}) => {
  const [isSlidUp, setIsSlidUp] = useState(false);
  const t = getTranslation(language);
  const playerColor = getColorById(player.color);

  const displayWord = language === 'bn' ? wordItem.wordBn : wordItem.word;
  const displayHint = assignedHint
    ? language === 'bn'
      ? assignedHint.bn
      : assignedHint.en
    : language === 'bn'
    ? wordItem.hintBn
    : wordItem.hint;

  const handleToggleSlide = () => {
    setIsSlidUp(!isSlidUp);
  };

  const isParallelMode = gameMode === 'parallel_heresies';

  return (
    <div
      id="secret-reveal-screen"
      style={{
        backgroundColor: playerColor.bgHex,
      }}
      className="min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-between px-4 sm:px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] transition-colors duration-300 select-none overflow-hidden font-sans"
    >
      {/* Top Bar with Home Button and Mode Badge */}
      <header
        style={{ color: playerColor.contrastText }}
        className="w-full max-w-sm flex items-center justify-between text-xs font-medium py-2"
      >
        <button
          onClick={onBackToHome}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: playerColor.contrastText,
          }}
          className="px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-black/30 transition-colors shadow-sm"
          title="Go to Home / হোমে ফিরে যান"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">{t.home}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            className="w-5 h-5 rounded-full flex items-center justify-center font-semibold text-[10px]"
          >
            {formatPlayerNumber(playerIndex + 1, language)}
          </span>
          <span className="font-semibold text-xs">{player.name}</span>
        </div>

        <div className="flex items-center gap-1">
          {isParallelMode && (
            <span
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
              className="text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5"
            >
              <Sparkles className="w-2.5 h-2.5 text-purple-300" />
              <span>{t.modeParallelHeresiesShort}</span>
            </span>
          )}
          <span className="opacity-80 text-[11px] font-medium">
            {formatPlayerNumber(playerIndex + 1, language)} / {formatPlayerNumber(totalPlayers, language)}
          </span>
        </div>
      </header>

      {/* Center Interactive Secret Box */}
      <main className="w-full max-w-xs flex-1 flex flex-col items-center justify-center my-4">
        <p
          style={{ color: playerColor.contrastText }}
          className="text-xs font-normal mb-3 opacity-90 tracking-wide text-center"
        >
          {isSlidUp ? t.slideDownCue : t.slideUpCue}
        </p>

        {/* Card Stage Container */}
        <div className="relative w-full h-[340px] rounded-2xl bg-white border border-neutral-200 shadow-xl overflow-hidden flex flex-col items-center justify-center p-5">
          {/* UNDERNEATH LAYER: The secret role, word or hint */}
          <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-2">
            {/* Logic varies between Classic, Reverse and Parallel Heresies mode */}
            {isParallelMode ? (
              // PARALLEL HERESIES MODE: 2 or 3 imposters who know each other and have distinct hints; citizens have secret word
              player.isImposter ? (
                <>
                  <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200">
                    {t.roleImposter}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                      {t.imposterTitleParallel}
                    </h3>
                    <p className="text-[11px] text-neutral-600 font-normal mt-0.5 leading-snug">
                      {t.imposterSubParallel.replace('{count}', String(totalImposters))}
                    </p>
                  </div>

                  {/* Teammate Imposters Identification Box */}
                  {teammateImposters && teammateImposters.length > 0 && (
                    <div className="w-full rounded-xl bg-purple-50 border border-purple-200 p-2.5 text-left">
                      <p className="text-[10px] uppercase font-semibold text-purple-800 tracking-wider">
                        {teammateImposters.length === 1
                          ? t.teammateImposterLabel
                          : t.teammateImpostersLabel}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {teammateImposters.map((tm) => {
                          const tmColor = getColorById(tm.color);
                          return (
                            <span
                              key={tm.id}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium text-neutral-900 bg-white border border-purple-200 shadow-xs"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                                style={{ backgroundColor: tmColor.bgHex }}
                              />
                              <span className="truncate max-w-[110px]">{tm.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="w-full rounded-xl bg-purple-50/70 border border-purple-200 p-2.5 text-left">
                    <p className="text-[10px] uppercase font-semibold text-purple-700">
                      {t.hintLabel}
                    </p>
                    <p className="text-sm font-medium text-neutral-900 mt-0.5 leading-relaxed">
                      {displayHint}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-semibold text-neutral-700 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200">
                    {t.roleCitizen}
                  </span>
                  <div>
                    <p className="text-xs text-neutral-600 uppercase font-medium tracking-wider">
                      {t.secretWordLabel}
                    </p>
                    <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
                      {displayWord}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-600 font-normal max-w-[210px] leading-relaxed">
                    {t.citizenSubParallel.replace('{count}', String(totalImposters))}
                  </p>
                </>
              )
            ) : (
              // CLASSIC MODE: Citizens get the Secret Word, Imposter gets a Hint
              player.isImposter ? (
                <>
                  <span className="text-[11px] font-semibold text-red-600 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200">
                    {t.roleImposter}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">
                      {t.imposterTitle}
                    </h3>
                    <p className="text-xs text-neutral-600 font-normal mt-0.5">
                      {t.imposterSub}
                    </p>
                  </div>
                  <div className="w-full rounded-xl bg-neutral-50 border border-neutral-200 p-3 mt-1 text-left">
                    <p className="text-[10px] uppercase font-semibold text-neutral-500">
                      {t.hintLabel}
                    </p>
                    <p className="text-sm font-medium text-neutral-900 mt-1 leading-relaxed">
                      {displayHint}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-semibold text-neutral-700 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200">
                    {t.roleCitizen}
                  </span>
                  <div>
                    <p className="text-xs text-neutral-600 uppercase font-medium tracking-wider">
                      {t.secretWordLabel}
                    </p>
                    <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
                      {displayWord}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-600 font-normal max-w-[200px] leading-relaxed">
                    {t.citizenSub}
                  </p>
                </>
              )
            )}
          </div>

          {/* SLIDING CARD OVERLAY WITH QUESTION MARK */}
          <motion.div
            id="sliding-secret-card"
            initial={false}
            animate={{
              y: isSlidUp ? '-88%' : '0%',
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            onClick={handleToggleSlide}
            className="absolute inset-0 bg-neutral-900 cursor-pointer flex flex-col items-center justify-between p-6 shadow-2xl z-20"
          >
            {/* Top cue */}
            <div className="flex items-center gap-1 text-neutral-300 text-xs font-medium">
              {isSlidUp ? (
                <>
                  <ChevronDown className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">{t.slideDownBtn}</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4 text-neutral-200 animate-bounce" />
                  <span className="text-neutral-200 font-medium">{t.slideUpBtn}</span>
                </>
              )}
            </div>

            {/* Question Mark Center */}
            <div className="w-20 h-20 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-inner">
              <span className="text-4xl font-bold text-white">?</span>
            </div>

            {/* Bottom Label */}
            <p className="text-xs text-neutral-300 font-normal text-center">
              {t.tapOrSlide}
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer / Got It Button */}
      <footer className="w-full max-w-sm pb-2">
        <button
          id="btn-reveal-got-it"
          onClick={onPlayerGotIt}
          className="w-full py-3.5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 text-sm font-semibold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{t.gotIt}</span>
        </button>
      </footer>
    </div>
  );
};

