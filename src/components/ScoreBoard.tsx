import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchScores, ScoreEntry } from "@/components/ScoreService";
import { formatDateSwedish } from "./ScoreBoardUtils";
import { Info } from "lucide-react";

interface ScoreBoardProps {
  onBack: () => void; // Function to navigate back to the test
}

/**
 * ScoreBoard component displays high scores from the database
 * It fetches scores when mounted and displays them in a table
 */
export const ScoreBoard: React.FC<ScoreBoardProps> = ({ onBack }) => {
  // State to store scores, loading status, and error messages
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to control the visibility of the statistics modal
  const [showStats, setShowStats] = useState(false);

  const isDevEnvironment = import.meta.env.DEV;

  let postAddress = `${import.meta.env.VITE_PROXY_HOST}/${
    import.meta.env.VITE_PROXY_SCORES_ENDPOINT
  }`;

  // If dev environment, use localhost instead of production server for API calls
  if (isDevEnvironment) {
    // const port = getBackendPort();
    console.log(
      "Development environment detected. Using localhost for API calls."
    );
    postAddress = `http://localhost:${import.meta.env.VITE_PROXY_PORT}`;
  }

  // Fetch scores when component mounts
  useEffect(() => {
    const loadScores = async () => {
      setLoading(true);
      try {
        // Get scores from the database
        const data = await fetchScores(postAddress);
        setScores(data);
        setError(null);
      } catch (err) {
        console.error("Error loading scores:", err);
        setError("Failed to load high scores. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadScores();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto text-center space-y-4">
      <Card>
        <CardHeader className="relative">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">High Scores</CardTitle>
            {/* Info button to show statistics */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowStats(true)}
              aria-label="Show score statistics"
            >
              <Info size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display loading state */}
          {loading ? (
            <p>Loading scores...</p>
          ) : error ? (
            // Display error message if something went wrong
            <p className="text-red-500">{error}</p>
          ) : scores.length > 0 ? (
            // Display scores in a table
            <div className="space-y-2">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Rank</th>
                    <th className="text-left py-2">Name</th>
                    <th className="text-right py-2">Score</th>
                    <th className="text-right py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <tr key={score.id || index} className="border-b">
                      <td className="py-2">{index + 1}</td>
                      <td className="py-2 text-left">{score.name}</td>
                      <td className="py-2 text-right">{score.score} / 25</td>
                      <td className="py-2 text-right">
                        {/* Display date in Swedish format (YYYY-MM-DD) */}
                        {score.timestamp
                          ? formatDateSwedish(score.timestamp)
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Display message if no scores exist
            <p>No scores yet. Be the first to complete the test!</p>
          )}

          {/* Back button to return to the test */}
          <Button onClick={onBack} className="mt-4">
            Back to Test
          </Button>
        </CardContent>
      </Card>

      {/* Statistics Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Zener Card Statistics</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStats(false)}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <p>
                The results of many tests using Zener cards fit with a typical
                normal distribution.
              </p>
              <p>
                Probability predicts these test results for a test of 25
                questions with five possible answers if chance is operating:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>79.3% of people will get between 3 and 7 correct.</li>
                <li>10.9% will get 8 or more correct.</li>
                <li>One person in 73,700 will get 15 or more correct.</li>
                <li>One person in 5.16 billion will get 20 or more correct.</li>
                <li>One person in 298 quadrillion will get all 25 correct.</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Source:{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Zener_cards#Statistics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Wikipedia: Zener cards – Statistics
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
