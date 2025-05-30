import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AppView, symbols } from "@/types";
import { generateDeck, getSymbolById, getResultMessage } from "./CartsUtils";
import ScoreBoard from "./ScoreBoard";
import { saveScore } from "./ScoreService";
import { TOTAL_CARDS } from "./CardsSettings";

export const ESPTestApp: React.FC = () => {
  const [deck, setDeck] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSymbol, setCurrentSymbol] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // State for view management
  const [view, setView] = useState<AppView>("test");

  // State for score submission
  const [playerName, setPlayerName] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [wantToSaveScore, setWantToSaveScore] = useState<boolean | null>(null);

  const isDevEnvironment = import.meta.env.DEV;

  let postAddress = `${import.meta.env.VITE_PROXY_HOST}/${
    import.meta.env.VITE_PROXY_SCORES_ENDPOINT
  }`;

  // If dev environment, use localhost instead of production server for API calls
  if (isDevEnvironment) {
    console.log(
      "Development environment detected. Using localhost for API calls."
    );
    postAddress = `http://localhost:${import.meta.env.VITE_PROXY_PORT}`;
  }

  // Initialize deck when component mounts
  useEffect(() => {
    setDeck(generateDeck());
  }, []);

  /**
   * Handles user's symbol guess
   * @param guess Symbol ID guessed by the user
   */
  const handleGuess = (guess: string) => {
    const correctSymbol = deck[currentIndex];
    if (guess === correctSymbol) setScore((prev) => prev + 1);

    if (currentIndex + 1 >= deck.length) {
      setIsFinished(true);
      setView("result"); // Change view to result when test is finished
    } else {
      setCurrentIndex(currentIndex + 1);

      // Generate a new random symbol for the next card position
      // This regeneration approach matches historical Zener card testing protocols,
      // where each new card was independently and randomly selected rather than
      // pre-determined from a shuffled deck. This ensures true statistical
      // independence between trials and prevents any form of card counting.
      const updatedDeck = [...deck];
      const randomSymbol =
        symbols[Math.floor(Math.random() * symbols.length)].id;
      updatedDeck[currentIndex + 1] = randomSymbol;
      setDeck(updatedDeck);
    }

    setCurrentSymbol(correctSymbol);
    setTimeout(() => setCurrentSymbol(""), 1000);
  };

  /**
   * Resets the test to start over
   */
  const restartTest = useCallback(() => {
    setDeck(generateDeck());
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setCurrentSymbol("");
    setView("test");
    setPlayerName("");
    setSaveError(null);
    setWantToSaveScore(null); // Reset the save score preference
  }, []);

  /**
   * Memoized callback for symbol guessing
   * Avoids creating new functions on each render
   */
  const handleSymbolGuess = useCallback(
    (symbolId: string) => {
      return () => handleGuess(symbolId);
    },
    [currentIndex, deck]
  );

  /**
   * Handles form submission for saving score
   */
  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setSaveError("Please enter a name");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Save score to the database using the ScoreService
      await saveScore(postAddress, playerName.trim(), score);
      setView("high-scores");
    } catch (err) {
      setSaveError("Failed to save your score. Please try again.");
      console.error("Error saving score:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Render different views based on current state
  if (view === "high-scores") {
    return <ScoreBoard onBack={restartTest} />;
  }

  return (
    <div className="p-4 max-w-md mx-auto text-center space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ESP Zener Card Test</h1>
        {/* Button to view high scores */}
        <Button
          variant="ghost"
          onClick={() => setView("high-scores")}
          className="text-sm"
        >
          High Scores
        </Button>
      </div>

      {view === "test" && !isFinished ? (
        <div className="space-y-2">
          <p className="text-lg">Guess the next symbol:</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-1 gap-y-3 sm:gap-y-1">
            {symbols.map((symbol) => (
              <Button
                key={symbol.id}
                onClick={handleSymbolGuess(symbol.id)}
                // Apply card-like styling with fixed dimensions
                // Responsive card styling with min/max constraints
                className="p-2 flex items-center justify-center bg-white hover:bg-gray-100 aspect-[3/4] min-h-[5rem] max-h-32 w-[80%] mx-auto rounded-lg border-2 border-gray-300 shadow-sm"
                variant="outline" // Use outline variant for a more card-like appearance
              >
                {/* SVG container with centered content */}
                <div className="relative flex items-center justify-center w-full h-full">
                  <img
                    src={symbol.image}
                    alt={symbol.id}
                    className="object-contain w-1/2 sm:w-[50px] max-h-full"
                  />
                </div>
              </Button>
            ))}
          </div>
          {currentSymbol && (
            <motion.div
              className="text-xl font-bold mt-4 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span>Correct symbol:</span>
                {/* Display the result as a card too for consistency */}
                <div className="p-2 flex items-center justify-center bg-white aspect-[3/4] h-24 sm:h-32 w-[80%] max-w-[100px] mx-auto rounded-lg border-2 border-gray-300 shadow-sm">
                  <img
                    src={getSymbolById(currentSymbol)?.image ?? ""}
                    alt={currentSymbol}
                    className="object-contain w-3/5 max-h-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
          <p className="text-sm">
            Card {currentIndex + 1} of {TOTAL_CARDS}
          </p>
        </div>
      ) : view === "result" ? (
        <Card>
          <CardContent className="space-y-4 p-4">
            <h2 className="text-xl font-semibold">Results</h2>
            <p>
              You got {score} out of {TOTAL_CARDS} correct.
            </p>
            <p>{getResultMessage(score)}</p>

            {/* Only show save score option if user hasn't made a choice yet */}
            {wantToSaveScore === null ? (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium mb-2">
                  Would you like to save your score?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Your score can be added to the high score list if you'd like.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setWantToSaveScore(true)}>
                    Yes, save my score
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setWantToSaveScore(false)}
                  >
                    No, thanks
                  </Button>
                </div>
              </div>
            ) : wantToSaveScore ? (
              // Show name input form if user wants to save score
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium mb-2">Save Your Score</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Enter your name (real name, nickname, or anything you prefer)
                </p>

                {/* Form for submitting name and score */}
                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      maxLength={30}
                    />
                    {saveError && (
                      <p className="text-red-500 text-sm mt-1">{saveError}</p>
                    )}
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Score"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setWantToSaveScore(null)}
                    >
                      Go Back
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              // Just show restart button if user doesn't want to save score
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-center">
                  <Button onClick={restartTest}>Try Again</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default ESPTestApp;
