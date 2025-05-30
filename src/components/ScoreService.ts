/**
 * ScoreService module
 * Handles all the API calls to the backend for score management
 */

// Define the score entry type
export interface ScoreEntry {
  id?: number;
  name: string;
  score: number;
  timestamp?: string;
}

/**
 * Fetches all scores from the backend
 * @returns A Promise resolving to an array of ScoreEntry objects sorted by score (highest first)
 */
export const fetchScores = async (
  postAddress: string
): Promise<ScoreEntry[]> => {
  try {
    // Send GET request to the backend API
    const response = await fetch(postAddress);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Parse and return the response data
    const scores: ScoreEntry[] = await response.json();
    return scores;
  } catch (error) {
    console.error("Failed to fetch scores:", error);
    throw error;
  }
};

/**
 * Saves a new score to the database
 * @param name - Player's name
 * @param score - Player's score
 * @returns A Promise resolving to the saved ScoreEntry with ID
 */
export const saveScore = async (
  postAddress: string,
  name: string,
  score: number
): Promise<ScoreEntry> => {
  try {
    // Send POST request to the backend API with score data
    const response = await fetch(postAddress, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, score }),
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Parse and return the saved score
    return await response.json();
  } catch (error) {
    console.error("Failed to save score:", error);
    throw error;
  }
};
