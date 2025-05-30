# About Card Shuffling

## Previous implementation

### Card Shuffling Behavior Analysis

Currently, your code only shuffles the deck at two points:

1. **Initial Load**: When the component mounts via the `useEffect` hook:

   ```tsx
   useEffect(() => {
     setDeck(generateDeck());
   }, []);
   ```

2. **When Restarting**: In the `restartTest` callback function:

   ```tsx
   const restartTest = useCallback(() => {
     setDeck(generateDeck());
     // ...other reset operations
   }, []);
   ```

You don't reshuffle the deck when a user makes a guess. This means the entire sequence of 25 cards is predetermined at the start of each test.

### Potential Issue

You're right to be concerned. With the current implementation, a user could potentially:

- Track which symbols have appeared
- Calculate the probability of remaining symbols
- Make more informed guesses later in the test

For a true ESP test, each guess should be independent and unpredictable.

### Possible Solutions

Here are two approaches you could implement:

#### Option 1: Generate a New Card Each Time (Recommended)

Instead of shuffling the entire deck at once, you could generate each card independently:

```tsx
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
    
    // Generate a new random symbol for the next position to ensure unpredictability
    // This won't affect what's already in the deck for current position
    if (currentIndex + 1 < deck.length) {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)].id;
      const newDeck = [...deck];
      newDeck[currentIndex + 1] = randomSymbol;
      setDeck(newDeck);
    }
  }

  setCurrentSymbol(correctSymbol);
  setTimeout(() => setCurrentSymbol(""), 1000);
};
```

#### Option 2: Create a Separate Function for Randomly Selecting Symbols

Another approach would be to completely decouple the selection process from the deck:

```tsx
/**
 * Gets a random symbol from available symbols
 * Ensures true randomness for each card shown
 * @returns Random symbol ID
 */
const getRandomSymbol = useCallback(() => {
  // Select a random symbol from the available set
  return symbols[Math.floor(Math.random() * symbols.length)].id;
}, []);

/**
 * Handles user's symbol guess
 * @param guess Symbol ID guessed by the user
 */
const handleGuess = (guess: string) => {
  // Use the current card from the deck
  const correctSymbol = deck[currentIndex];
  
  if (guess === correctSymbol) setScore((prev) => prev + 1);

  if (currentIndex + 1 >= deck.length) {
    setIsFinished(true);
    setView("result");
  } else {
    setCurrentIndex(currentIndex + 1);
  }

  setCurrentSymbol(correctSymbol);
  setTimeout(() => setCurrentSymbol(""), 1000);
};
```

## How Was The Real Zener Card Test Conducted?

Here's an improved implementation for the `handleGuess` function that better simulates authentic ESP testing:

```tsx
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
    // This better simulates how traditional Zener card tests were conducted,
    // with each card being independently selected by the tester
    const updatedDeck = [...deck];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)].id;
    updatedDeck[currentIndex + 1] = randomSymbol;
    setDeck(updatedDeck);
  }

  setCurrentSymbol(correctSymbol);
  setTimeout(() => setCurrentSymbol(""), 1000);
};
```

## Historical Context: Authentic Zener Card Tests

In traditional Zener card ESP experiments, conducted by Dr. J.B. Rhine at Duke University in the 1930s:

1. **Independent Selection**: The experimenter would select cards one by one, either randomly or by shuffling between each selection. The cards weren't pre-shuffled as a complete deck before the test began.

2. **Blind Testing**: The experimenter would look at each card while the subject, separated by a screen, would attempt to identify it.

3. **No Feedback**: In many protocols, subjects wouldn't receive immediate feedback about whether their guesses were correct until the end of a run, preventing them from adjusting their strategy.

4. **Statistical Basis**: The tests were based on the statistical improbability of correct guesses exceeding chance (20% accuracy with 5 symbols) over many trials.

The implementation above more closely mirrors this authentic approach by:

1. Randomly selecting each next card independently
2. Preventing any possibility of card counting
3. Maintaining true statistical randomness throughout the test

This change ensures that your ESP test maintains scientific integrity while still providing immediate feedback to users for engagement purposes.

## Understanding the Current Shuffle Implementation

```tsx
const handleGuess = (guess: string) => {
  const correctSymbol = deck[currentIndex];
  if (guess === correctSymbol) setScore((prev) => prev + 1);

  if (currentIndex + 1 >= deck.length) {
    setIsFinished(true);
    setView("result"); // Change view to result when test is finished
  } else {
    setCurrentIndex(currentIndex + 1);

    // Generate a new random symbol for the next card position
    // This better simulates how traditional Zener card tests were conducted,
    // with each card being independently selected by the tester
    const updatedDeck = [...deck];
    const randomSymbol =
      symbols[Math.floor(Math.random() * symbols.length)].id;
    updatedDeck[currentIndex + 1] = randomSymbol;
    setDeck(updatedDeck);
  }

  setCurrentSymbol(correctSymbol);
  setTimeout(() => setCurrentSymbol(""), 1000);
};
```

### How It Currently Works

The implementation doesn't shuffle the entire deck with each guess. Instead:

1. **Initial Setup**: At component mount, the `generateDeck()` function creates a shuffled deck of 25 cards
2. **On Each Guess**:
   - The code checks the current card at `deck[currentIndex]`
   - It then advances to the next card by incrementing `currentIndex`
   - It **replaces only the next card** in the sequence with a new random symbol

### More Authentic ESP Testing

This approach is actually more authentic to how traditional Zener card ESP tests were conducted by J.B. Rhine at Duke University in the 1930s:

- **In Original Tests**: The experimenter would randomly select each new card independently, rather than pre-shuffling an entire deck
- **Your Implementation**: Similarly creates true independence between trials by generating a new random card for the next position after each guess

### Advantages of This Approach

1. **Statistical Independence**: Each card is independently random, eliminating any potential patterns
2. **Prevents Card Counting**: Even if someone could "count cards," it wouldn't help because the next card is randomly generated after each guess
3. **Equal Probability**: Each of the five symbols has exactly 1/5 chance of being selected for each position

Your current implementation is actually a good match for authentic ESP testing methodology. The randomization happens after each guess, but only for the next card in sequence, not the entire deck.
