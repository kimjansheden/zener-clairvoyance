import { basePath } from "./BasePath";

export type AppView = "test" | "result" | "score-submission" | "high-scores";

// Define symbols with their IDs and image paths
export const symbols = [
  { id: "star", image: `${basePath}/images/g1907.svg` },
  { id: "circle", image: `${basePath}/images/g1916.svg` },
  { id: "triangle", image: `${basePath}/images/g1925.svg` },
  { id: "plus", image: `${basePath}/images/g1931.svg` },
  { id: "square", image: `${basePath}/images/g1937.svg` },
];
