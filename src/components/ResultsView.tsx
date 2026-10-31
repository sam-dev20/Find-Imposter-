import React from 'react';
import { Player, WordItem, Language, GameMode, RoundVoteResult, PlayerScoreBreakdown } from '../types';
import { getColorById } from '../data/colors';
import { getTranslation, formatPlayerNumber } from '../data/translations';
import { MagnifyingGlassLogo } from './MagnifyingGlassLogo';
import { RotateCcw, Play, Home, Globe, Trophy, Sparkles } from 'lucide-react';

interface ResultsViewProps {
  players: Player[];
  allPlayers?: Player[];
  secretWord: WordItem;
  imposterId: string;
  imposterIds?: string[];
  gameMode?: GameMode;
  playerAssignedHints?: Record<string, { en: string; bn: string }>;
  currentVotes: Record<string, string>;
  votingRound: number;
  voteHistory: RoundVoteResult[];
  gameCount?: number;
  targetGameCount?: number;
  language: Language;
  onToggleLanguage: () => void;
  onStartTieBreaker: () => void;
  onStartNextRound?: () => void;
  onPlayAgainSamePlayers: () => void;
  onStartNewMatchSeries: () => void;
  onNewGameSetup: () => void;
  onBackToHome: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  players,
  allPlayers,
  secretWord,
  imposterId,
  imposterIds = [],
  gameMode = 'classic',
  playerAssignedHints,
  currentVotes,
  votingRound,
  voteHistory,
  gameCount = 1,
  targetGameCount = 5,
  language,
  onToggleLanguage,
  onStartTieBreaker,
  onStartNextRound,
  onPlayAgainSamePlayers,
  onStartNewMatchSeries,
  onNewGameSetup,
  onBackToHome,
}) => {
  const t = getTranslation(language);
  const isParallelMode = gameMode === 'parallel_heresies';

  const effectiveImposterIds =
    isParallelMode && imposterIds.length > 0 ? imposterIds : [imposterId];

  // The master list of all players in this game
  const gamePlayerList = allPlayers && allPlayers.length > 0 ? allPlayers : players;

  // Latest round result from vote history
  const latestRound = voteHistory && voteHistory.length > 0 ? voteHistory[voteHistory.length - 1] : undefined;
  const isIntermediate = Boolean(latestRound?.isIntermediate);
  const scoreBreakdowns: Record<string, PlayerScoreBreakdown> =
    latestRound?.scoreBreakdowns || {};

  // Exact vote counts calculated for this round
  const voteCounts: Record<string, number> = latestRound?.voteCounts || {};

  // Find max votes from the recorded vote counts
  let maxVotes = 0;
  Object.values(voteCounts).forEach((cnt) => {
    if (cnt > maxVotes) maxVotes = cnt;
  });

  const isTie = latestRound ? Boolean(latestRound.isTie) : maxVotes === 0;

  const topVotedPlayers = latestRound?.tiedPlayerIds && latestRound.tiedPlayerIds.length > 0
    ? gamePlayerList.filter((p) => latestRound.tiedPlayerIds.includes(p.id))
    : gamePlayerList.filter((p) => (voteCounts[p.id] || 0) === maxVotes && maxVotes > 0);

  // Authoritative eliminated player from the round calculation
  const eliminatedPlayer = latestRound?.eliminatedPlayerId
    ? gamePlayerList.find((p) => p.id === latestRound.eliminatedPlayerId) || null
    : (!isTie && topVotedPlayers.length === 1 ? topVotedPlayers[0] : null);

  const imposterCaught = isParallelMode
    ? latestRound?.winner === 'citizens'
    : eliminatedPlayer?.id === imposterId;

  const displayWord = language === 'bn' ? secretWord.wordBn : secretWord.word;
  const displayHint = language === 'bn' ? secretWord.hintBn : secretWord.hint;

  const allImposters = gamePlayerList.filter((p) => effectiveImposterIds.includes(p.id));

  // The active voters who participated in casting votes this round
  const roundVoters = gamePlayerList.filter((p) => currentVotes[p.id] !== undefined);
  const displayVoterList = roundVoters.length > 0 ? roundVoters : gamePlayerList;

  // Sort players by total score descending for the Scoreboard leaderboard
  const sortedPlayersByScore = [...gamePlayerList].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  const isMatchCompleted =
    !isTie && !isIntermediate && targetGameCount > 0 && gameCount >= targetGameCount;
  const highestScore = sortedPlayersByScore[0]?.score || 0;
  const matchChampions = sortedPlayersByScore.filter(
    (p) => (p.score || 0) === highestScore
  );

  return (
    <div id="results-screen" className="min-h-screen min-h-[100dvh] bg-neutral-50 text-neutral-900 flex flex-col items-center justify-between px-4 sm:px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] select-none font-sans">
      {/* Top Header */}
      <header className="w-full max-w-lg flex items-center justify-between py-3 border-b border-neutral-200">
        <button
          id="btn-results-home"
          onClick={onBackToHome}
          className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 text-xs font-medium shadow-sm"
          title="Go to Home / হোমে ফিরে যান"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{t.home}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <MagnifyingGlassLogo size="sm" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <h2 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                {isIntermediate
                  ? t.roundSummary.replace('{round}', String(votingRound))
                  : t.results}
              </h2>
            </div>
            <span className="text-[10px] font-normal text-neutral-500 block">
              {targetGameCount > 0
                ? t.gameProgress
                    .replace('{current}', String(Math.min(gameCount, targetGameCount)))
                    .replace('{total}', String(targetGameCount))
                : t.gameProgressSingle.replace('{current}', String(gameCount))}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleLanguage}
          className="px-2 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-medium flex items-center gap-1"
          title="Switch Language"
        >
          <Globe className="w-3 h-3 text-neutral-500" />
          <span className="text-[10px]">{language === 'en' ? 'বাংলা' : 'EN'}</span>
        </button>
      </header>

      {/* Main Results Content */}
      <main className="w-full max-w-lg flex-1 overflow-y-auto my-4 space-y-4 pr-0.5 max-h-[70vh]">
        {/* Outcome Banner */}
        {isTie ? (
          /* TIE BANNER */
          <div className="rounded-2xl bg-white border-2 border-amber-300 p-6 text-center shadow-sm space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              {t.tieGame}
            </span>
            <h3 className="text-2xl font-semibold text-neutral-900">
              {t.itsATie}
            </h3>
            <p className="text-xs text-neutral-600 font-normal max-w-xs mx-auto">
              {t.tieDesc
                .replace('{count}', String(maxVotes))
                .replace(
                  '{names}',
                  topVotedPlayers.map((p) => p.name).join(', ')
                )}
            </p>
          </div>
        ) : isIntermediate ? (
          /* INTERMEDIATE ROUND OUTCOME (Parallel Heresies) */
          <div className="rounded-2xl bg-white border-2 border-purple-400 p-6 text-center shadow-sm space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
              {t.gameContinues}
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900">
              {eliminatedPlayer?.name}{' '}
              <span className="text-neutral-700 font-normal">
                {latestRound?.eliminatedWasImposter ? t.wasAnImposter : t.wasAnInnocentCitizen}
              </span>
            </h3>
            <p className="text-xs text-neutral-600 font-normal max-w-xs mx-auto">
              {t.survivingStatus
                .replace('{citizens}', String(latestRound?.survivingCitizensCount || 0))
                .replace('{imposters}', String(latestRound?.survivingImpostersCount || 0))}
            </p>
            <p className="text-[11.5px] text-purple-900/80 font-normal mt-1">
              {t.gameContinuesDesc}
            </p>
          </div>
        ) : imposterCaught ? (
          /* CITIZENS WIN */
          <div className="rounded-2xl bg-white border-2 border-green-500 p-6 text-center shadow-sm space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-green-800 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              {t.citizensWin}
            </span>
            <h3 className="text-2xl font-semibold text-neutral-900">
              {t.citizensWin}
            </h3>
            <p className="text-xs text-neutral-600 font-normal max-w-xs mx-auto">
              {isParallelMode
                ? t.allImpostersCaught.replace('{count}', String(effectiveImposterIds.length))
                : t.citizensWinDesc
                    .replace('{name}', allImposters[0]?.name || imposterId)
                    .replace('{count}', String(maxVotes))}
            </p>
          </div>
        ) : (
          /* IMPOSTER(S) WIN */
          <div className="rounded-2xl bg-white border-2 border-red-500 p-6 text-center shadow-sm space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-red-800 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
              {t.imposterWins}
            </span>
            <h3 className="text-2xl font-semibold text-neutral-900">
              {t.imposterWins}
            </h3>
            <p className="text-xs text-neutral-600 font-normal max-w-xs mx-auto">
              {isParallelMode
                ? t.impostersParityWin
                : eliminatedPlayer
                ? t.imposterWinsDesc
                    .replace('{eliminated}', eliminatedPlayer?.name || '')
                    .replace('{imposter}', allImposters[0]?.name || imposterId)
                : t.imposterTieBreakerWinDesc
                    .replace('{imposter}', allImposters[0]?.name || imposterId)}
            </p>
          </div>
        )}

        {/* Match Series Winner Card - Decided after 3, 5, or 10 games based on total points */}
        {isMatchCompleted && (
          <div
            id="series-champion-card"
            className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-5 text-center shadow-sm space-y-3"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500 text-white shadow-sm mx-auto">
              <Trophy className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300">
                {matchChampions.length > 1 ? t.matchChampionsTie : t.matchChampion}
              </span>
              
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                {matchChampions.map((champ) => {
                  const champColor = getColorById(champ.color);
                  return (
                    <div
                      key={champ.id}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 shadow-xs"
                    >
                      <div
                        style={{ backgroundColor: champColor.bgHex }}
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      />
                      <span className="font-semibold text-sm text-neutral-900">
                        {champ.name}
                      </span>
                      <span className="text-xs font-bold text-amber-600 ml-0.5">
                        {highestScore} {t.points}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs font-medium text-neutral-800 mt-2.5">
                {t.matchWinnerCelebration
                  .replace('{total}', String(targetGameCount))
                  .replace('{score}', String(highestScore))}
              </p>
            </div>
          </div>
        )}

        {/* Identity, Secret Word & Imposter/Citizen Clue Reveal Card - ONLY shown when game finishes (not tie, not intermediate) */}
        {!isTie && !isIntermediate && (
          <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-xs">
              <span className="text-neutral-600 font-medium">
                {t.secretWordLabel}
              </span>
              <span className="text-sm font-bold text-neutral-900">{displayWord}</span>
            </div>

            {/* Imposter(s) Identity List */}
            <div className="pb-2 border-b border-neutral-100 text-xs space-y-1.5">
              <span className="text-neutral-600 font-medium block">
                {isParallelMode ? t.theImposters : t.theImposter}
              </span>
              <div className="flex flex-wrap gap-2">
                {allImposters.map((imp) => {
                  const impColor = getColorById(imp.color);
                  return (
                    <div
                      key={imp.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200"
                    >
                      <div
                        style={{ backgroundColor: impColor.bgHex }}
                        className="w-3 h-3 rounded-full"
                      />
                      <span className="text-xs font-bold text-red-700">
                        {imp.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hint / Clues Section */}
            {isParallelMode ? (
              <div className="text-xs space-y-2 pt-0.5">
                <span className="text-[11px] font-semibold text-neutral-700 block">
                  {t.imposterHintsList}
                </span>
                <div className="space-y-1.5">
                  {allImposters.map((imp) => {
                    const impColor = getColorById(imp.color);
                    const assigned = playerAssignedHints?.[imp.id];
                    const hintText = assigned
                      ? language === 'bn'
                        ? assigned.bn
                        : assigned.en
                      : displayHint;

                    return (
                      <div
                        key={imp.id}
                        className="p-2 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-2 text-xs"
                      >
                        <div
                          style={{ backgroundColor: impColor.bgHex }}
                          className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-purple-950 mr-1.5">
                            {imp.name}:
                          </span>
                          <span className="text-neutral-800 font-normal italic">
                            "{hintText}"
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-xs space-y-1 pt-0.5">
                <div className="flex items-center justify-between text-neutral-700 font-medium">
                  <span>{t.imposterHintLabel}</span>
                </div>
                <p className="text-xs font-medium text-neutral-900 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80 leading-relaxed italic">
                  "{displayHint}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Vote Breakdown */}
        <div id="results-vote-breakdown-card" className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
          <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-3">
            {t.voteBreakdown}
          </h4>

          <div className="space-y-2">
            {displayVoterList.map((player) => {
              const targetId = currentVotes[player.id];
              const targetPlayer = gamePlayerList.find((p) => p.id === targetId);
              const votesReceived = voteCounts[player.id] || 0;
              const playerColor = getColorById(player.color);

              return (
                <div
                  key={player.id}
                  className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                    <div
                      style={{ backgroundColor: playerColor.bgHex }}
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0"
                    >
                      <span style={{ color: playerColor.contrastText }}>
                        {formatPlayerNumber(gamePlayerList.indexOf(player) + 1, language)}
                      </span>
                    </div>

                    <span className="font-semibold text-neutral-900">
                      {player.name}
                    </span>

                    <span className="text-neutral-500 font-normal">{t.votedFor}</span>

                    <span className="font-semibold text-neutral-900 truncate">
                      {targetPlayer ? targetPlayer.name : t.nobody}
                    </span>
                  </div>

                  <div className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 font-medium text-neutral-800 flex-shrink-0">
                    {votesReceived} {votesReceived === 1 ? t.voteSingle : t.votePlural}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Scoreboard Card - Real-time points and tournament score tracking (only shown when series length is selected and game has finished) */}
        {targetGameCount > 0 && !isIntermediate && (
          <div id="results-scoreboard-card" className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                  {t.scoreboard}
                </h4>
              </div>
              <span className="text-[11px] font-medium text-neutral-600">
                {targetGameCount > 0 ? `${t.matchLength}: ${targetGameCount}` : t.gamesNone}
              </span>
            </div>

            {/* Player Leaderboard list */}
            <div className="space-y-2">
              {sortedPlayersByScore.map((player, rank) => {
                const playerColor = getColorById(player.color);
                const breakdown = scoreBreakdowns[player.id];
                const roundEarned = breakdown?.roundPoints || 0;
                const isLead = rank === 0 && (player.score || 0) > 0;
                const isImp = effectiveImposterIds.includes(player.id);

                return (
                  <div
                    key={player.id}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isLead
                        ? 'bg-amber-50/70 border-amber-200 shadow-xs'
                        : 'bg-neutral-50 border-neutral-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 text-center font-bold text-xs text-neutral-600">
                          #{formatPlayerNumber(rank + 1, language)}
                        </span>
                        <div
                          style={{ backgroundColor: playerColor.bgHex }}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0"
                        >
                          <span style={{ color: playerColor.contrastText }}>
                            {formatPlayerNumber(gamePlayerList.indexOf(player) + 1, language)}
                          </span>
                        </div>
                        <span className="font-medium text-xs text-neutral-900 truncate">
                          {player.name}
                        </span>
                        {isImp && !isTie && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                            {t.roleImposter}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Points gained this round badge */}
                        {!isTie && roundEarned > 0 && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-md border border-emerald-200">
                            +{roundEarned}
                          </span>
                        )}
                        {!isTie && roundEarned === 0 && (
                          <span className="text-[10px] font-normal text-neutral-500 px-1">
                            +0
                          </span>
                        )}
                        {/* Total accumulated points */}
                        <span className="text-xs font-bold text-neutral-900 min-w-[48px] text-right">
                          {player.score || 0} {t.points}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown details for this round */}
                    {!isTie && breakdown && (
                      <div className="mt-1.5 pt-1.5 border-t border-neutral-200/50 flex flex-wrap gap-1 text-[9.5px]">
                        {breakdown.votedImposterPoints > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium border border-emerald-200/60">
                            {t.scoreReasonVotedImposter}
                          </span>
                        )}
                        {breakdown.citizensWinPoints > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-medium border border-blue-200/60">
                            {t.scoreReasonCitizensWon}
                          </span>
                        )}
                        {breakdown.imposterWinPoints > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-800 font-medium border border-red-200/60">
                            {t.scoreReasonImposterWon}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Collapsible scoring rules guide */}
            <div className="pt-2 border-t border-neutral-100 text-xs">
              <details className="group cursor-pointer">
                <summary className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 flex items-center justify-between list-none">
                  <span>{t.scoringRulesTitle}</span>
                  <span className="text-xs text-neutral-600 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="pt-1.5 space-y-1 text-neutral-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 mt-1">
                  <p className="flex items-start gap-1">
                    <span className="font-semibold text-emerald-700">• {t.rule1Label}:</span>
                    <span className="font-normal">{t.rule1Desc}</span>
                  </p>
                  <p className="flex items-start gap-1">
                    <span className="font-semibold text-blue-700">• {t.rule2Label}:</span>
                    <span className="font-normal">{t.rule2Desc}</span>
                  </p>
                  <p className="flex items-start gap-1">
                    <span className="font-semibold text-purple-700">• {t.rule3Label}:</span>
                    <span className="font-normal">{t.rule3Desc}</span>
                  </p>
                </div>
              </details>
            </div>
          </div>
        )}
      </main>

      {/* Action Buttons Footer */}
      <footer className="w-full max-w-lg pt-2 pb-2">
        {isTie ? (
          /* TIE: Tie-Breaker Revote Button */
          <button
            id="btn-start-tiebreaker"
            onClick={onStartTieBreaker}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.startTieBreaker}</span>
          </button>
        ) : isIntermediate ? (
          /* INTERMEDIATE: Start Next Round Button */
          <button
            id="btn-start-next-round"
            onClick={onStartNextRound}
            className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t.startNextRound.replace('{round}', String(votingRound + 1))}</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {/* LEFT: Play Again / Next Round */}
            <button
              id="btn-results-play-again"
              onClick={isMatchCompleted ? onStartNewMatchSeries : onPlayAgainSamePlayers}
              className="py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
            >
              {isMatchCompleted ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.startNewMatch}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {targetGameCount > 0
                      ? t.nextGameInMatch
                          .replace('{current}', String(gameCount + 1))
                          .replace('{total}', String(targetGameCount))
                      : t.playAgain}
                  </span>
                </>
              )}
            </button>

            {/* RIGHT: New Setup */}
            <button
              id="btn-results-new-setup"
              onClick={onNewGameSetup}
              className="py-3.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 font-medium text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
            >
              <RotateCcw className="w-4 h-4 text-neutral-500" />
              <span>{t.newSetup}</span>
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};
