/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Player,
  WordItem,
  GameDraft,
  GameStatus,
  RoundVoteResult,
  Language,
  GameMode,
  PlayerScoreBreakdown,
} from './types';
import { getRandomWord, getDistinctHintsForWord } from './data/words';
import { PLAYER_COLORS, getColorById } from './data/colors';
import { getDefaultPlayerName } from './data/translations';
import { selectFairImposter, selectFairMultipleImposters } from './utils/imposterFairness';
import {
  getSavedDrafts,
  saveGameDraft,
  removeGameDraft,
  clearAllDrafts,
} from './utils/storage';

import { HomeView } from './components/HomeView';
import { SetupView } from './components/SetupView';
import { PassDeviceView } from './components/PassDeviceView';
import { SecretRevealView } from './components/SecretRevealView';
import { DiscussionView } from './components/DiscussionView';
import { VotingView } from './components/VotingView';
import { ResultsView } from './components/ResultsView';
import { OpeningAnimation } from './components/OpeningAnimation';

export default function App() {
  const [showOpening, setShowOpening] = useState<boolean>(() => true);
  const [drafts, setDrafts] = useState<GameDraft[]>(() => getSavedDrafts());
  const [currentGame, setCurrentGame] = useState<GameDraft | null>(null);

  // Language state: 'en' (English) or 'bn' (Bangla)
  const [language, setLanguage] = useState<Language>(() => {
    const saved =
      localStorage.getItem('suspicious_game_lang') ||
      localStorage.getItem('find_the_imposter_lang');
    return saved === 'bn' || saved === 'en' ? saved : 'en';
  });

  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'bn' : 'en';
      localStorage.setItem('suspicious_game_lang', next);
      return next;
    });
  };

  const handleClearAllDrafts = () => {
    clearAllDrafts();
    setDrafts([]);
    if (currentGame && currentGame.status === 'setup') {
      setCurrentGame(null);
    }
  };

  // Sync draft state to localStorage whenever currentGame changes
  useEffect(() => {
    if (currentGame) {
      saveGameDraft(currentGame);
      setDrafts(getSavedDrafts());
    }
  }, [currentGame]);

  // Load fresh drafts on mount
  useEffect(() => {
    setDrafts(getSavedDrafts());
  }, []);

  // Calculate active background color for the currently presented screen
  const activeHexColor = (() => {
    if (showOpening) {
      return '#0A0A0A';
    }
    if (!currentGame) {
      return '#FAFAFA';
    }
    if (
      currentGame.status === 'pass_device_reveal' ||
      currentGame.status === 'reveal_card'
    ) {
      const player = currentGame.players[currentGame.currentRevealIndex];
      return player ? getColorById(player.color).bgHex : '#FAFAFA';
    }
    if (
      currentGame.status === 'pass_device_vote' ||
      currentGame.status === 'voting'
    ) {
      const eliminatedIds = currentGame.eliminatedPlayerIds || [];
      const alivePlayers = currentGame.players.filter(
        (p) => !eliminatedIds.includes(p.id)
      );
      const voter =
        alivePlayers[currentGame.currentVoteIndex] || alivePlayers[0];
      return voter ? getColorById(voter.color).bgHex : '#FAFAFA';
    }
    return '#FAFAFA';
  })();

  // Dynamically synchronize the top system status bar, meta theme-color, HTML/body canvas & UI framing
  useEffect(() => {
    // 1. Sync HTML document, body, and root element canvas background
    document.documentElement.style.backgroundColor = activeHexColor;
    document.body.style.backgroundColor = activeHexColor;
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.style.backgroundColor = activeHexColor;
    }

    // Determine if the active color is dark or light based on perceived luminance
    const cleanHex = activeHexColor.replace('#', '');
    let isDark = false;
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      isDark = luminance < 0.6;
    }

    // 2. Set color-scheme meta tag and document color-scheme property
    // Crucial for Chrome on Android: 'only light' prevents Android Dark Theme from forcing the status bar to black
    const scheme = isDark ? 'dark' : 'only light';
    let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
    if (!colorSchemeMeta) {
      colorSchemeMeta = document.createElement('meta');
      colorSchemeMeta.setAttribute('name', 'color-scheme');
      document.head.appendChild(colorSchemeMeta);
    }
    colorSchemeMeta.setAttribute('content', scheme);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

    // 3. Remove any media-specific theme-color meta tags that cause Chrome Android to override the status bar
    document.querySelectorAll('meta[name="theme-color"][media]').forEach((el) => el.remove());

    // 4. Update or create the primary theme-color meta tag
    let themeMeta = document.querySelector('meta[name="theme-color"]:not([media])') as HTMLMetaElement | null;
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', activeHexColor);

    // 5. Microsoft navbutton color
    let navMeta = document.querySelector('meta[name="msapplication-navbutton-color"]') as HTMLMetaElement | null;
    if (!navMeta) {
      navMeta = document.createElement('meta');
      navMeta.setAttribute('name', 'msapplication-navbutton-color');
      document.head.appendChild(navMeta);
    }
    navMeta.setAttribute('content', activeHexColor);

    // 6. Apple mobile status bar style
    let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') as HTMLMetaElement | null;
    if (!appleMeta) {
      appleMeta = document.createElement('meta');
      appleMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(appleMeta);
    }
    appleMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
  }, [activeHexColor]);

  // 1. Navigation: Start new game from Home
  const handleStartNewGame = () => {
    const defaultPlayers: Player[] = [
      {
        id: `p_1_${Date.now()}`,
        name: getDefaultPlayerName(1, language),
        color: PLAYER_COLORS[0].id, // Red
        textColor: PLAYER_COLORS[0].contrastText,
        isImposter: false,
      },
      {
        id: `p_2_${Date.now()}`,
        name: getDefaultPlayerName(2, language),
        color: PLAYER_COLORS[1].id, // Black
        textColor: PLAYER_COLORS[1].contrastText,
        isImposter: false,
      },
      {
        id: `p_3_${Date.now()}`,
        name: getDefaultPlayerName(3, language),
        color: PLAYER_COLORS[2].id, // Yellow
        textColor: PLAYER_COLORS[2].contrastText,
        isImposter: false,
      },
    ];

    const newDraft: GameDraft = {
      id: `game_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players: defaultPlayers,
      imposterId: '',
      imposterIds: [],
      imposterCount: 2,
      eliminatedPlayerIds: [],
      secretWord: getRandomWord(),
      gameMode: 'classic',
      status: 'setup',
      currentRevealIndex: 0,
      currentVoteIndex: 0,
      currentVotes: {},
      votingRound: 1,
      voteHistory: [],
      gameCount: 1,
      targetGameCount: 0,
    };

    setCurrentGame(newDraft);
  };

  // 2. Navigation: Resume draft
  const handleResumeDraft = (draft: GameDraft) => {
    setCurrentGame(draft);
  };

  // 3. Navigation: Delete draft
  const handleDeleteDraft = (draftId: string) => {
    removeGameDraft(draftId);
    setDrafts(getSavedDrafts());
    if (currentGame?.id === draftId) {
      setCurrentGame(null);
    }
  };

  // 4. Start Game from Setup
  const handleStartGameFromSetup = (
    configuredPlayers: Player[],
    targetGameCount: number = 0,
    gameMode: GameMode = 'classic',
    requestedImposterCount: number = 2
  ) => {
    const selectedWord = getRandomWord();

    let imposterId = '';
    let imposterIds: string[] = [];
    let randomizedPlayers: Player[] = [];
    let playerAssignedHints: Record<string, { en: string; bn: string }> | undefined;

    if (gameMode === 'parallel_heresies') {
      // Parallel Heresies Mode: 2 or 3 blind imposters with different hints
      const impCount = Math.max(2, Math.min(requestedImposterCount || 2, 3));
      imposterIds = selectFairMultipleImposters(
        configuredPlayers,
        impCount,
        currentGame?.imposterIds
      );
      imposterId = imposterIds[0] || '';

      randomizedPlayers = configuredPlayers.map((p) => ({
        ...p,
        isImposter: imposterIds.includes(p.id),
      }));

      // Give distinct hints to each imposter
      const distinctHints = getDistinctHintsForWord(selectedWord, imposterIds.length);
      playerAssignedHints = {};
      imposterIds.forEach((impId, idx) => {
        playerAssignedHints![impId] = distinctHints[idx];
      });
    } else {
      // Classic Mode: 1 imposter gets single hint, citizens get word
      imposterId = selectFairImposter(configuredPlayers, currentGame?.imposterId);
      imposterIds = [imposterId];

      randomizedPlayers = configuredPlayers.map((p) => ({
        ...p,
        isImposter: p.id === imposterId,
      }));
    }

    const updatedGame: GameDraft = {
      id: currentGame?.id || `game_${Date.now()}`,
      createdAt: currentGame?.createdAt || Date.now(),
      updatedAt: Date.now(),
      players: randomizedPlayers,
      imposterId,
      imposterIds,
      imposterCount: requestedImposterCount || 2,
      eliminatedPlayerIds: [],
      secretWord: selectedWord,
      gameMode,
      playerAssignedHints,
      status: 'pass_device_reveal',
      currentRevealIndex: 0,
      currentVoteIndex: 0,
      currentVotes: {},
      votingRound: 1,
      voteHistory: [],
      gameCount: currentGame?.gameCount || 1,
      targetGameCount:
        typeof targetGameCount === 'number'
          ? targetGameCount
          : (currentGame?.targetGameCount ?? 0),
    };

    setCurrentGame(updatedGame);
  };

  // 5. Pass Device Confirm (for Reveal)
  const handleReadyToReveal = () => {
    if (!currentGame) return;
    setCurrentGame({
      ...currentGame,
      status: 'reveal_card',
    });
  };

  // 6. Player Got It (after viewing secret card)
  const handlePlayerFinishedReveal = () => {
    if (!currentGame) return;

    const nextIdx = currentGame.currentRevealIndex + 1;

    if (nextIdx < currentGame.players.length) {
      // Move to next player's reveal
      setCurrentGame({
        ...currentGame,
        currentRevealIndex: nextIdx,
        status: 'pass_device_reveal',
      });
    } else {
      // All players have seen their secret role -> Proceed to Discussion round
      setCurrentGame({
        ...currentGame,
        status: 'discussion',
      });
    }
  };

  // Helper to compute results when all active alive votes are cast
  const finishVotingWithAllVotes = (
    baseGame: GameDraft,
    allVotes: Record<string, string>
  ) => {
    const isParallelMode = baseGame.gameMode === 'parallel_heresies';
    const eliminatedIds = baseGame.eliminatedPlayerIds || [];

    // Active voters are only the alive players
    const alivePlayers = baseGame.players.filter((p) => !eliminatedIds.includes(p.id));

    const voteCounts: Record<string, number> = {};
    alivePlayers.forEach((p) => {
      voteCounts[p.id] = 0;
    });

    Object.values(allVotes).forEach((tid: string) => {
      if (voteCounts[tid] !== undefined) {
        voteCounts[tid] += 1;
      }
    });

    let maxVotes = 0;
    Object.values(voteCounts).forEach((cnt) => {
      if (cnt > maxVotes) maxVotes = cnt;
    });

    const topSuspects = alivePlayers.filter(
      (p) => voteCounts[p.id] === maxVotes && maxVotes > 0
    );
    let isTie = topSuspects.length !== 1 || maxVotes === 0;

    let winner: 'imposter' | 'citizens' | 'tie' | null = null;
    let eliminatedPlayerId: string | null = null;
    let isIntermediate = false;
    let eliminatedWasImposter = false;
    let newEliminatedIds = [...eliminatedIds];
    let survivingCitizensCount = 0;
    let survivingImpostersCount = 0;

    const effectiveImposterIds =
      isParallelMode && (baseGame.imposterIds?.length ?? 0) > 0
        ? baseGame.imposterIds!
        : [baseGame.imposterId];

    // In Classic mode, if there is a tie again after the first tie-breaker (votingRound >= 2), the imposter simply wins!
    const isClassicTieBreakerTie = !isParallelMode && isTie && baseGame.votingRound >= 2;

    if (isClassicTieBreakerTie) {
      isTie = false;
      winner = 'imposter';
      eliminatedPlayerId = null;
    } else if (isTie) {
      winner = 'tie';
    } else {
      eliminatedPlayerId = topSuspects[0].id;
      newEliminatedIds.push(eliminatedPlayerId);
      eliminatedWasImposter = effectiveImposterIds.includes(eliminatedPlayerId);

      if (isParallelMode) {
        // Parallel Heresies Mode Multi-round Win Logic:
        const remainingAlivePlayers = baseGame.players.filter(
          (p) => !newEliminatedIds.includes(p.id)
        );
        const survivingImposters = remainingAlivePlayers.filter((p) =>
          effectiveImposterIds.includes(p.id)
        );
        const survivingCitizens = remainingAlivePlayers.filter(
          (p) => !effectiveImposterIds.includes(p.id)
        );

        survivingCitizensCount = survivingCitizens.length;
        survivingImpostersCount = survivingImposters.length;

        if (survivingImposters.length === 0) {
          // All imposters eliminated -> Citizens Win!
          winner = 'citizens';
          isIntermediate = false;
        } else if (survivingImposters.length >= survivingCitizens.length) {
          // Imposters match or exceed citizen numbers -> Imposters Win!
          winner = 'imposter';
          isIntermediate = false;
        } else {
          // Game continues! One citizen or one imposter out, but neither side has won yet
          winner = null;
          isIntermediate = true;
        }
      } else {
        // Classic Mode:
        if (eliminatedPlayerId === baseGame.imposterId) {
          winner = 'citizens';
        } else {
          winner = 'imposter';
        }
      }
    }

    // Calculate score updates
    const scoreBreakdowns: Record<string, PlayerScoreBreakdown> = {};
    const updatedPlayers = baseGame.players.map((p) => {
      let votedImposterPoints = 0;
      let citizensWinPoints = 0;
      let imposterWinPoints = 0;

      if (!isTie) {
        // Voted an imposter points
        const votedForId = allVotes[p.id];
        const isSelfImposter = effectiveImposterIds.includes(p.id);
        if (
          votedForId &&
          effectiveImposterIds.includes(votedForId) &&
          !isSelfImposter
        ) {
          votedImposterPoints = 3;
        }

        // Citizens Won bonus (only at final game conclusion)
        if (winner === 'citizens' && !isSelfImposter) {
          citizensWinPoints = 2;
        }

        // Imposters Won bonus (only at final game conclusion)
        if (winner === 'imposter' && isSelfImposter) {
          imposterWinPoints = 5;
        }
      }

      const roundPoints = votedImposterPoints + citizensWinPoints + imposterWinPoints;
      const currentScore = p.score || 0;
      const newTotalScore = currentScore + roundPoints;

      scoreBreakdowns[p.id] = {
        playerId: p.id,
        votedImposter:
          Boolean(allVotes[p.id]) &&
          effectiveImposterIds.includes(allVotes[p.id]) &&
          !effectiveImposterIds.includes(p.id),
        votedImposterPoints,
        citizensWinPoints,
        imposterWinPoints,
        roundPoints,
        totalScore: newTotalScore,
      };

      return {
        ...p,
        score: newTotalScore,
      };
    });

    const roundResult: RoundVoteResult = {
      roundNumber: baseGame.votingRound,
      votes: allVotes,
      voteCounts,
      isTie,
      tiedPlayerIds: topSuspects.map((p) => p.id),
      eliminatedPlayerId,
      winner,
      scoreBreakdowns,
      isIntermediate,
      eliminatedWasImposter,
      survivingCitizensCount,
      survivingImpostersCount,
    };

    setCurrentGame({
      ...baseGame,
      players: updatedPlayers,
      eliminatedPlayerIds: newEliminatedIds,
      currentVotes: allVotes,
      voteHistory: [...baseGame.voteHistory, roundResult],
      status: 'results',
    });
  };

  // 7. Discussion phase Got It -> start voting among alive players
  const handleProceedToVoting = () => {
    if (!currentGame) return;

    setCurrentGame({
      ...currentGame,
      currentVotes: {},
      currentVoteIndex: 0,
      status: 'pass_device_vote',
    });
  };

  // 8. Pass Device Confirm (for Voting)
  const handleReadyToVote = () => {
    if (!currentGame) return;
    setCurrentGame({
      ...currentGame,
      status: 'voting',
    });
  };

  // 9. Cast Vote (by current active voter)
  const handleCastVote = (voterId: string, targetId: string) => {
    if (!currentGame) return;

    const eliminatedIds = currentGame.eliminatedPlayerIds || [];
    const alivePlayers = currentGame.players.filter((p) => !eliminatedIds.includes(p.id));

    const newVotes = {
      ...currentGame.currentVotes,
      [voterId]: targetId,
    };

    const nextVoteIdx = currentGame.currentVoteIndex + 1;

    if (nextVoteIdx < alivePlayers.length) {
      // Pass device to next alive voter
      setCurrentGame({
        ...currentGame,
        currentVotes: newVotes,
        currentVoteIndex: nextVoteIdx,
        status: 'pass_device_vote',
      });
    } else {
      // All alive players have finished voting!
      finishVotingWithAllVotes(currentGame, newVotes);
    }
  };

  // 10. Tie-breaker handling
  const handleStartTieBreaker = () => {
    if (!currentGame) return;
    setCurrentGame({
      ...currentGame,
      votingRound: currentGame.votingRound + 1,
      currentVotes: {},
      currentVoteIndex: 0,
      status: 'discussion',
    });
  };

  // 11. Start Next Round (for Parallel Heresies intermediate continuation)
  const handleStartNextRound = () => {
    if (!currentGame) return;
    setCurrentGame({
      ...currentGame,
      votingRound: currentGame.votingRound + 1,
      currentVotes: {},
      currentVoteIndex: 0,
      status: 'discussion',
    });
  };

  // 12. Next Game in Current Match Series (keeps accumulated scores)
  const handlePlayAgainSamePlayers = () => {
    if (!currentGame) return;
    const newWord = getRandomWord();
    const gameMode = currentGame.gameMode || 'classic';
    const nextGameCount = (currentGame.gameCount || 1) + 1;

    let imposterId = '';
    let imposterIds: string[] = [];
    let resetPlayers: Player[] = [];
    let playerAssignedHints: Record<string, { en: string; bn: string }> | undefined;

    if (gameMode === 'parallel_heresies') {
      const impCount = currentGame.imposterCount || 2;
      imposterIds = selectFairMultipleImposters(
        currentGame.players,
        impCount,
        currentGame.imposterIds
      );
      imposterId = imposterIds[0] || '';

      resetPlayers = currentGame.players.map((p) => ({
        ...p,
        isImposter: imposterIds.includes(p.id),
      }));

      const distinctHints = getDistinctHintsForWord(newWord, imposterIds.length);
      playerAssignedHints = {};
      imposterIds.forEach((impId, idx) => {
        playerAssignedHints![impId] = distinctHints[idx];
      });
    } else {
      imposterId = selectFairImposter(currentGame.players, currentGame.imposterId);
      imposterIds = [imposterId];

      resetPlayers = currentGame.players.map((p) => ({
        ...p,
        isImposter: p.id === imposterId,
      }));
    }

    const rematchDraft: GameDraft = {
      id: `game_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players: resetPlayers,
      imposterId,
      imposterIds,
      imposterCount: currentGame.imposterCount || 2,
      eliminatedPlayerIds: [],
      secretWord: newWord,
      gameMode,
      playerAssignedHints,
      status: 'pass_device_reveal',
      currentRevealIndex: 0,
      currentVoteIndex: 0,
      currentVotes: {},
      votingRound: 1,
      voteHistory: [],
      gameCount: nextGameCount,
      targetGameCount:
        typeof currentGame.targetGameCount === 'number'
          ? currentGame.targetGameCount
          : 0,
    };

    setCurrentGame(rematchDraft);
  };

  // 13. Start New Match Series (resets scores to 0 for game 1)
  const handleStartNewMatchSeries = () => {
    if (!currentGame) return;
    const newWord = getRandomWord();
    const gameMode = currentGame.gameMode || 'classic';

    let imposterId = '';
    let imposterIds: string[] = [];
    let resetPlayers: Player[] = [];
    let playerAssignedHints: Record<string, { en: string; bn: string }> | undefined;

    if (gameMode === 'parallel_heresies') {
      const impCount = currentGame.imposterCount || 2;
      imposterIds = selectFairMultipleImposters(
        currentGame.players,
        impCount,
        currentGame.imposterIds
      );
      imposterId = imposterIds[0] || '';

      resetPlayers = currentGame.players.map((p) => ({
        ...p,
        score: 0,
        isImposter: imposterIds.includes(p.id),
      }));

      const distinctHints = getDistinctHintsForWord(newWord, imposterIds.length);
      playerAssignedHints = {};
      imposterIds.forEach((impId, idx) => {
        playerAssignedHints![impId] = distinctHints[idx];
      });
    } else {
      imposterId = selectFairImposter(currentGame.players, currentGame.imposterId);
      imposterIds = [imposterId];

      resetPlayers = currentGame.players.map((p) => ({
        ...p,
        score: 0,
        isImposter: p.id === imposterId,
      }));
    }

    const newSeriesDraft: GameDraft = {
      id: `game_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players: resetPlayers,
      imposterId,
      imposterIds,
      imposterCount: currentGame.imposterCount || 2,
      eliminatedPlayerIds: [],
      secretWord: newWord,
      gameMode,
      playerAssignedHints,
      status: 'pass_device_reveal',
      currentRevealIndex: 0,
      currentVoteIndex: 0,
      currentVotes: {},
      votingRound: 1,
      voteHistory: [],
      gameCount: 1,
      targetGameCount:
        typeof currentGame.targetGameCount === 'number'
          ? currentGame.targetGameCount
          : 0,
    };

    setCurrentGame(newSeriesDraft);
  };

  // 14. New Game Setup (resets scores to 0)
  const handleNewGameSetup = () => {
    if (!currentGame) return;
    const newWord = getRandomWord();

    const resetPlayers = currentGame.players.map((p) => ({
      ...p,
      score: 0,
      isImposter: false,
    }));

    const freshSetupDraft: GameDraft = {
      id: `game_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players: resetPlayers,
      imposterId: '',
      imposterIds: [],
      imposterCount: currentGame.imposterCount || 2,
      eliminatedPlayerIds: [],
      secretWord: newWord,
      gameMode: currentGame.gameMode || 'classic',
      status: 'setup',
      currentRevealIndex: 0,
      currentVoteIndex: 0,
      currentVotes: {},
      votingRound: 1,
      voteHistory: [],
      gameCount: 1,
      targetGameCount:
        typeof currentGame.targetGameCount === 'number'
          ? currentGame.targetGameCount
          : 0,
    };

    setCurrentGame(freshSetupDraft);
  };

  // 15. Universal Back to Home from ANY view
  const handleBackToHome = () => {
    setCurrentGame(null);
    setDrafts(getSavedDrafts());
  };

  // If Opening Animation is playing, show it
  if (showOpening) {
    return (
      <OpeningAnimation
        language={language}
        onFinish={() => setShowOpening(false)}
      />
    );
  }

  return (
    <div
      id="app-framing-container"
      style={{
        backgroundColor: activeHexColor,
      }}
      className="min-h-screen min-h-[100dvh] w-full flex flex-col transition-colors duration-300"
    >
      {/* View Router */}
      {(!currentGame || currentGame.status === 'home') && (
        <HomeView
          drafts={drafts}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onStartNewGame={handleStartNewGame}
          onResumeDraft={handleResumeDraft}
          onDeleteDraft={handleDeleteDraft}
          onPlayOpening={() => setShowOpening(true)}
        />
      )}

      {currentGame?.status === 'setup' && (
        <SetupView
          initialPlayers={currentGame.players}
          initialTargetGameCount={
            typeof currentGame.targetGameCount === 'number'
              ? currentGame.targetGameCount
              : 0
          }
          initialGameMode={currentGame.gameMode || 'classic'}
          initialImposterCount={currentGame.imposterCount || 2}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onBackToHome={handleBackToHome}
          onStartGame={handleStartGameFromSetup}
        />
      )}

      {currentGame?.status === 'pass_device_reveal' && (
        <PassDeviceView
          player={currentGame.players[currentGame.currentRevealIndex]}
          playerIndex={currentGame.currentRevealIndex}
          totalPlayers={currentGame.players.length}
          mode="reveal"
          language={language}
          onBackToHome={handleBackToHome}
          onConfirmReady={handleReadyToReveal}
        />
      )}

      {currentGame?.status === 'reveal_card' && (
        <SecretRevealView
          player={currentGame.players[currentGame.currentRevealIndex]}
          playerIndex={currentGame.currentRevealIndex}
          totalPlayers={currentGame.players.length}
          totalImposters={
            currentGame.imposterIds?.length || (currentGame.imposterId ? 1 : 1)
          }
          teammateImposters={currentGame.players.filter(
            (p) =>
              (currentGame.imposterIds || [currentGame.imposterId]).includes(p.id) &&
              p.id !== currentGame.players[currentGame.currentRevealIndex].id
          )}
          wordItem={currentGame.secretWord}
          gameMode={currentGame.gameMode || 'classic'}
          assignedHint={
            currentGame.playerAssignedHints?.[
              currentGame.players[currentGame.currentRevealIndex].id
            ]
          }
          language={language}
          onBackToHome={handleBackToHome}
          onPlayerGotIt={handlePlayerFinishedReveal}
        />
      )}

      {currentGame?.status === 'discussion' && (() => {
        const eliminatedIds = currentGame.eliminatedPlayerIds || [];
        const alivePlayers = currentGame.players.filter(
          (p) => !eliminatedIds.includes(p.id)
        );

        return (
          <DiscussionView
            players={alivePlayers}
            allPlayers={currentGame.players}
            eliminatedPlayerIds={eliminatedIds}
            votingRound={currentGame.votingRound}
            isTieBreaker={
              currentGame.voteHistory.length > 0 &&
              Boolean(
                currentGame.voteHistory[currentGame.voteHistory.length - 1]?.isTie
              )
            }
            gameMode={currentGame.gameMode || 'classic'}
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onBackToHome={handleBackToHome}
            onProceedToVoting={handleProceedToVoting}
          />
        );
      })()}

      {currentGame?.status === 'pass_device_vote' && (() => {
        const eliminatedIds = currentGame.eliminatedPlayerIds || [];
        const alivePlayers = currentGame.players.filter(
          (p) => !eliminatedIds.includes(p.id)
        );
        const activeVoter =
          alivePlayers[currentGame.currentVoteIndex] || alivePlayers[0];

        return (
          <PassDeviceView
            player={activeVoter}
            playerIndex={currentGame.currentVoteIndex}
            totalPlayers={alivePlayers.length}
            mode="vote"
            language={language}
            onBackToHome={handleBackToHome}
            onConfirmReady={handleReadyToVote}
          />
        );
      })()}

      {currentGame?.status === 'voting' && (() => {
        const eliminatedIds = currentGame.eliminatedPlayerIds || [];
        const alivePlayers = currentGame.players.filter(
          (p) => !eliminatedIds.includes(p.id)
        );
        const activeVoter =
          alivePlayers[currentGame.currentVoteIndex] || alivePlayers[0];

        return (
          <VotingView
            currentVoter={activeVoter}
            voterIndex={currentGame.currentVoteIndex}
            totalPlayers={alivePlayers.length}
            allPlayers={alivePlayers}
            language={language}
            onBackToHome={handleBackToHome}
            onCastVote={handleCastVote}
          />
        );
      })()}

      {currentGame?.status === 'results' && (() => {
        const eliminatedIds = currentGame.eliminatedPlayerIds || [];
        const alivePlayers = currentGame.players.filter(
          (p) => !eliminatedIds.includes(p.id)
        );

        return (
          <ResultsView
            players={alivePlayers}
            allPlayers={currentGame.players}
            secretWord={currentGame.secretWord}
            imposterId={currentGame.imposterId}
            imposterIds={currentGame.imposterIds}
            gameMode={currentGame.gameMode || 'classic'}
            playerAssignedHints={currentGame.playerAssignedHints}
            currentVotes={currentGame.currentVotes}
            votingRound={currentGame.votingRound}
            voteHistory={currentGame.voteHistory}
            gameCount={currentGame.gameCount || 1}
            targetGameCount={
              typeof currentGame.targetGameCount === 'number'
                ? currentGame.targetGameCount
                : 0
            }
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onStartTieBreaker={handleStartTieBreaker}
            onStartNextRound={handleStartNextRound}
            onPlayAgainSamePlayers={handlePlayAgainSamePlayers}
            onStartNewMatchSeries={handleStartNewMatchSeries}
            onNewGameSetup={handleNewGameSetup}
            onBackToHome={handleBackToHome}
          />
        );
      })()}
    </div>
  );
}

