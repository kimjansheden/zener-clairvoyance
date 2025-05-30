import fs from "fs";
import path from "path";

/**
 * Gets the actual backend port from the port.txt file
 * @returns {number} Port number, defaults to 3001 if file doesn't exist
 */
export function getBackendPort() {
  try {
    // Try to read port from the file created by the backend
    const portPath = path.resolve(__dirname, "./backend/port.txt");
    if (fs.existsSync(portPath)) {
      const port = parseInt(fs.readFileSync(portPath, "utf8").trim(), 10);
      console.log(`Using backend port from port.txt: ${port}`);
      return port || 3001; // Use 3001 as fallback if parsing returns NaN
    }
  } catch (err) {
    console.warn("Could not read backend port file:", err);
  }
  return 3001; // Default port
}
