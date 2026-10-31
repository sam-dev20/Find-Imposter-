import React from 'react';
import { Player, Language } from '../types';
import { getColorById } from '../data/colors';
import { getTranslation, formatPlayerNumber } from '../data/translations';
import { ArrowRight, Home } from 'lucide-react';

interface PassDeviceViewProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  mode: 'reveal' | 'vote';
  language: Language;
  onBackToHome: () => void;
  onConfirmReady: () => void;
}

export const PassDeviceView: React.FC<PassDeviceViewProps> = ({
  player,
  playerIndex,
  totalPlayers,
  mode,
  language,
  onBackToHome,
  onConfirmReady,
}) => {
  const t = getTranslation(language);
  const playerColor = getColorById(player.color);

  return (
    <div
      id="pass-device-screen"
      style={{
        backgroundColor: playerColor.bgHex,
      }}
      className="min-h-screen min-h-[100dvh] text-white flex flex-col items-center justify-between px-4 sm:px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] select-none relative font-sans transition-colors duration-300"
    >
      {/* Top Header with Home button */}
      <header className="w-full max-w-sm flex items-center justify-between text-xs font-medium py-2">
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

        <span
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: playerColor.contrastText,
          }}
          className="px-3 py-1 rounded-full uppercase tracking-wider text-[11px] font-medium"
        >
          {mode === 'reveal' ? t.secretCard : t.voting}
        </span>

        <span style={{ color: playerColor.contrastText }} className="font-medium">
          {formatPlayerNumber(playerIndex + 1, language)} {t.of} {formatPlayerNumber(totalPlayers, language)}
        </span>
      </header>

      {/* Main card */}
      <main className="w-full max-w-sm flex-1 flex flex-col items-center justify-center my-6 text-center space-y-5">
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: playerColor.contrastText,
          }}
          className="w-20 h-20 rounded-2xl border border-white/30 flex items-center justify-center text-3xl font-bold shadow-sm"
        >
          {formatPlayerNumber(playerIndex + 1, language)}
        </div>

        <div className="space-y-2">
          <p
            style={{ color: playerColor.contrastText }}
            className="text-xs uppercase font-medium tracking-widest"
          >
            {t.passDeviceTo}
          </p>
          <h2
            style={{ color: playerColor.contrastText }}
            className="text-3xl font-bold tracking-tight"
          >
            {player.name}
          </h2>
          <p
            style={{ color: playerColor.contrastText }}
            className="text-xs font-normal max-w-xs mx-auto leading-relaxed pt-1"
          >
            {mode === 'reveal'
              ? t.passDeviceRevealSub
              : t.passDeviceVoteSub}
          </p>
        </div>
      </main>

      {/* Action button */}
      <footer className="w-full max-w-sm pb-2">
        <button
          id="btn-pass-confirm-ready"
          onClick={onConfirmReady}
          className="w-full py-3.5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 text-sm font-semibold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>{t.iAm} {player.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
