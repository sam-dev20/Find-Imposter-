export type Language = 'en' | 'bn';
export type GameMode = 'classic' | 'parallel_heresies';

export interface Player {
  id: string;
  name: string;
  color: string;
  textColor: string;
  isImposter: boolean;
  score?: number;
}

export interface PlayerScoreBreakdown {
  playerId: string;
  votedImposter: boolean;
  votedImposterPoints: number; // +3
  citizensWinPoints: number; // +2
  imposterWinPoints: number; // +5
  roundPoints: number;
  totalScore: number;
}

export interface WordItem {
  id: string;
  word: string;
  wordBn: string;
  category: string;
  hint: string;
  hintBn: string;
  hints?: string[];
  hintsBn?: string[];
}

export interface RoundVoteResult {
  roundNumber: number;
  votes: Record<string, string>; // voterId -> targetId
  voteCounts: Record<string, number>; // playerId -> count
  isTie: boolean;
  tiedPlayerIds: string[];
  eliminatedPlayerId: string | null;
  eliminatedWasImposter?: boolean;
  winner: 'imposter' | 'citizens' | 'tie' | null;
  isIntermediate?: boolean; // In Parallel Heresies, round elimination happened but game continues
  survivingCitizensCount?: number;
  survivingImpostersCount?: number;
  scoreBreakdowns?: Record<string, PlayerScoreBreakdown>;
}

export type GameStatus =
  | 'home'
  | 'setup'
  | 'pass_device_reveal'
  | 'reveal_card'
  | 'discussion'
  | 'pass_device_vote'
  | 'voting'
  | 'results';

export interface GameDraft {
  id: string;
  createdAt: number;
  updatedAt: number;
  players: Player[];
  imposterId: string; // Primary imposter or first imposter
  imposterIds?: string[]; // Multiple imposters in Parallel Heresies mode
  imposterCount?: number; // 2 or 3 in Parallel Heresies mode
  eliminatedPlayerIds?: string[]; // Eliminated players in current game
  secretWord: WordItem;
  gameMode: GameMode; // 'classic' | 'parallel_heresies'
  playerAssignedHints?: Record<string, { en: string; bn: string }>; // imposter hints in parallel_heresies mode
  status: GameStatus;
  currentRevealIndex: number;
  currentVoteIndex: number;
  currentVotes: Record<string, string>;
  votingRound: number;
  voteHistory: RoundVoteResult[];
  gameCount: number; // Current game number in the series (1, 2, 3...)
  targetGameCount: number; // Target number of games (0 for unlimited / no tournament limit, or 3, 5, 10)
}


