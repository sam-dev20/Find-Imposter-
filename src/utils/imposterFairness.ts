import { Player } from '../types';

/**
 * Random Imposter Selection:
 * - Guarantees fair, unpredictable and randomized imposter selection across all players.
 * - If there are multiple players and a previous imposter ID is provided, avoids picking the exact same player twice in a row when possible.
 */
export function selectFairImposter(
  players: Player[],
  previousImposterId?: string
): string {
  if (!players || players.length === 0) return '';
  if (players.length === 1) return players[0].id;

  // Filter candidates to avoid consecutive duplicate when there are 3 or more players
  let candidates = [...players];
  if (previousImposterId && players.length >= 3) {
    const withoutPrevious = players.filter((p) => p.id !== previousImposterId);
    if (withoutPrevious.length > 0) {
      candidates = withoutPrevious;
    }
  }

  // Pure random selection
  const chosenIndex = Math.floor(Math.random() * candidates.length);
  return candidates[chosenIndex].id;
}

/**
 * Multiple Imposter Random Selection for Parallel Heresies:
 * - Selects `count` (2 or 3) distinct imposters purely at random using unbiased Fisher-Yates shuffle.
 */
export function selectFairMultipleImposters(
  players: Player[],
  count: number,
  _previousImposterIds?: string[]
): string[] {
  if (!players || players.length === 0) return [];
  const targetCount = Math.min(count, players.length - 1);
  if (targetCount <= 0) return [];

  // Shuffle copy of players using Fisher-Yates
  const shuffled = [...players];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, targetCount).map((p) => p.id);
}

