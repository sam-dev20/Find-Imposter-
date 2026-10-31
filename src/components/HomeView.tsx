import React from 'react';
import { GameDraft, Language } from '../types';
import { getColorById } from '../data/colors';
import { getTranslation, formatPlayerNumber } from '../data/translations';
import { formatTimeAgo } from '../utils/storage';
import { MagnifyingGlassLogo } from './MagnifyingGlassLogo';
import { Play, Trash2, RotateCcw, ArrowRight, Globe } from 'lucide-react';

interface HomeViewProps {
  drafts: GameDraft[];
  language: Language;
  onToggleLanguage: () => void;
  onStartNewGame: () => void;
  onResumeDraft: (draft: GameDraft) => void;
  onDeleteDraft: (draftId: string) => void;
  onPlayOpening?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  drafts,
  language,
  onToggleLanguage,
  onStartNewGame,
  onResumeDraft,
  onDeleteDraft,
  onPlayOpening,
}) => {
  const t = getTranslation(language);

  return (
    <div
      id="home-screen"
      className="min-h-screen min-h-[100dvh] bg-neutral-50 text-neutral-900 flex flex-col items-center justify-between px-4 sm:px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] select-none font-sans"
    >
      {/* Top Header with safe area padding */}
      <header className="w-full max-w-md flex items-center justify-between pt-2 pb-3 border-b border-neutral-200/90">
        <button
          onClick={onPlayOpening}
          className="flex items-center space-x-3 text-left hover:opacity-85 transition-opacity"
          title="Watch Opening Intro Animation"
        >
          <MagnifyingGlassLogo size="sm" />
          <div>
            <h1 className="text-base font-semibold tracking-tight text-neutral-900 leading-tight">
              {t.appTitle}
            </h1>
            <p className="text-xs text-neutral-600 font-normal leading-tight">
              {t.appSubtitle}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Language Switch Button */}
          <button
            id="btn-switch-language"
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition-colors flex items-center gap-1 text-xs font-medium shadow-2xs active:scale-95"
            title="Switch Language / ভাষা পরিবর্তন"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-[11px]">{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center my-6 space-y-6">
        {/* Main Card */}
        <div className="rounded-2xl bg-white border border-neutral-200 p-6 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <MagnifyingGlassLogo size="lg" />
          </div>

          <h2 className="text-xl font-semibold text-neutral-900 mb-1.5">
            {t.whoIsImposter}
          </h2>
          <p className="text-sm text-neutral-700 font-normal max-w-xs mx-auto leading-relaxed">
            {t.gameIntro}
          </p>

          <div className="mt-6">
            <button
              id="btn-start-new-game"
              onClick={onStartNewGame}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-sm active:scale-[0.99] gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t.startNewGame}</span>
            </button>
          </div>
        </div>

        {/* Drafts Section */}
        <div id="drafts-section" className="w-full">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <RotateCcw className="w-3.5 h-3.5 text-neutral-600" />
              <span>{t.savedDrafts}</span>
            </div>
            <span className="text-xs text-neutral-600 font-normal">
              {formatPlayerNumber(drafts.length, language)}
            </span>
          </div>

          {drafts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 p-5 text-center bg-white">
              <p className="text-xs text-neutral-600 font-normal">
                {t.noDrafts}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-0.5">
              {drafts.map((draft) => {
                return (
                  <div
                    key={draft.id}
                    id={`draft-item-${draft.id}`}
                    className="rounded-xl bg-white border border-neutral-200 p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-neutral-300 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-medium text-neutral-900">
                          {formatPlayerNumber(draft.players.length, language)} {t.playersCount}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-normal border border-neutral-200/60">
                          {t.round} {formatPlayerNumber(draft.votingRound, language)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {draft.players.slice(0, 6).map((p) => {
                          const colorTheme = getColorById(p.color);
                          return (
                            <span
                              key={p.id}
                              style={{ backgroundColor: colorTheme.bgHex }}
                              className="inline-block w-2.5 h-2.5 rounded-full"
                              title={p.name}
                            />
                          );
                        })}
                        {draft.players.length > 6 && (
                          <span className="text-[10px] text-neutral-600 font-normal">
                            +{formatPlayerNumber(draft.players.length - 6, language)}
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-500 ml-1 font-normal">
                          • {formatTimeAgo(draft.updatedAt, language)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        id={`btn-resume-draft-${draft.id}`}
                        onClick={() => onResumeDraft(draft)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-medium text-xs transition-colors flex items-center gap-1 border border-neutral-200/80"
                      >
                        <span>{t.resume}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`btn-delete-draft-${draft.id}`}
                        onClick={() => onDeleteDraft(draft.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md text-center py-2 text-xs text-neutral-500 font-medium pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {t.passAndPlayFooter}
      </footer>
    </div>
  );
};
