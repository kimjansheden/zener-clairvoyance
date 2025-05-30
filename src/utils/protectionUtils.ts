// Security protection utilities for Clairvoyance ESP Test
// This file contains functions to protect against common web security vulnerabilities

/**
 * Protects against prototype pollution attacks by freezing critical prototypes
 * This prevents malicious code from modifying Array, Object, and other global prototypes
 */
export function protectPrototypes(): void {
  // Freeze Array prototype to prevent manipulation of array methods
  if (typeof Array !== "undefined" && Array.prototype) {
    Object.freeze(Array.prototype);
  }

  // Freeze Object prototype to prevent pollution
  if (typeof Object !== "undefined" && Object.prototype) {
    Object.freeze(Object.prototype);
  }

  // Freeze String prototype
  if (typeof String !== "undefined" && String.prototype) {
    Object.freeze(String.prototype);
  }

  // Freeze Number prototype
  if (typeof Number !== "undefined" && Number.prototype) {
    Object.freeze(Number.prototype);
  }

  // Log protection status in development
  if (import.meta.env.DEV) {
    console.log("🛡️ Prototype pollution protection enabled");
  }
}

/**
 * Additional runtime security checks
 * Validates that critical array operations are still functional
 */
export function validateSecurityIntegrity(): boolean {
  try {
    // Test that array operations work correctly
    const testArray = [1, 2, 3];

    // Verify length property
    if (testArray.length !== 3) {
      console.error("🚨 Array.length compromised!");
      return false;
    }

    // Verify array methods
    if (typeof testArray.find !== "function") {
      console.error("🚨 Array.find compromised!");
      return false;
    }

    if (typeof testArray.map !== "function") {
      console.error("🚨 Array.map compromised!");
      return false;
    }

    // Test basic operations
    const mapped = testArray.map((x) => x * 2);
    if (mapped.length !== 3 || mapped[0] !== 2) {
      console.error("🚨 Array operations compromised!");
      return false;
    }

    return true;
  } catch (error) {
    console.error("🚨 Security integrity check failed:", error);
    return false;
  }
}

/**
 * Initialize all security protections
 * Should be called early in the application lifecycle
 */
export function initializeSecurity(): void {
  // Protect against prototype pollution
  protectPrototypes();

  // Validate security integrity
  const isSecure = validateSecurityIntegrity();

  if (!isSecure) {
    console.error(
      "🚨 Security compromised - application may not function correctly"
    );

    // In production, you might want to redirect to an error page
    if (!import.meta.env.DEV) {
      // Could redirect to error page or disable functionality
      alert("Security error detected. Please refresh the page.");
    }
  }
}
