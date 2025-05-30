import { symbols } from "@/types";
import { CARDS_PER_SYMBOL, TOTAL_CARDS } from "./CardsSettings";

/**
 * Generates a shuffled deck of cards based on predefined symbols.
 * Each symbol appears in the deck a fixed number of times determined by CARDS_PER_SYMBOL.
 *
 * @returns {string[]} A randomly shuffled array of symbol IDs representing the deck
 *
 * @example
 * const shuffledDeck = generateDeck();
 * // Returns something like ['heart', 'club', 'diamond', 'heart', 'spade', ...]
 */
export const generateDeck = () => {
  const deck: string[] = [];
  symbols.forEach((symbol) => {
    for (let i = 0; i < CARDS_PER_SYMBOL; i++) {
      deck.push(symbol.id); // Store the symbol ID in the deck
    }
  });

  // Use the Fisher-Yates algorithm instead of sort() for true randomness
  return shuffleDeck(deck);
};

// A better way to shuffle a deck using the Fisher-Yates algorithm
// Making it exported so it can be reused elsewhere if needed
export function shuffleDeck(deck: string[]) {
  // Create a copy of the deck to avoid mutating the original
  const newDeck = [...deck];

  // Fisher-Yates shuffle implementation
  for (let i = newDeck.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at indices i and j
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }

  return newDeck;
}

// Helper function to get symbol object by ID
export const getSymbolById = (id: string) => {
  return symbols.find((symbol) => symbol.id === id);
};

export const getResultMessage = (score: number) => {
  if (score >= TOTAL_CARDS)
    return "Incredible! One in 298 quadrillion odds. You might be truly clairvoyant!";
  if (score >= 20)
    return "Amazing! One in 5.16 billion odds. You may be psychic!";
  if (score >= 15) return "Exceptional! One in 73,700 odds. Very rare result.";
  if (score >= 8) return "Above average! One in 9 odds. Possible ESP detected.";
  if (score >= 3)
    return "Within normal range. One in 1.26 odds. Likely chance.";
  return "Below chance. No ESP detected.";
};
