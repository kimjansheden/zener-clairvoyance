# Clairvoyance - ESP Zener Card Test

A web-based implementation of the classic Zener card ESP (Extra-Sensory Perception) test, originally designed by perceptual psychologist Karl Zener for experiments conducted by Dr. J.B. Rhine at Duke University in the 1930s.

## 🔮 About

Test your potential psychic abilities with this scientifically-inspired Zener card test. The application presents you with 25 cards, each showing one of five symbols (star, circle, triangle, plus, square). Your task is to predict which symbol will appear before it's revealed.

## ✨ Features

- **Authentic ESP Testing**: Based on the original Zener card methodology
- **Real-time Scoring**: Get immediate feedback on each guess
- **High Score Board**: Track and compare results with other users
- **Statistical Analysis**: View probability statistics for different score ranges
- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Modern, accessible interface built with React and Tailwind CSS

## 🎯 Statistical Background

The test results follow a normal distribution. For a 25-question test with five possible answers:

- **79.3%** of people will score between 3-7 correct (chance level)
- **10.9%** will score 8 or more correct
- **1 in 73,700** will score 15 or more correct
- **1 in 5.16 billion** will score 20 or more correct
- **1 in 298 quadrillion** will get all 25 correct

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/clairvoyance.git
cd clairvoyance
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Technical Implementation

### Frontend

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **shadcn/ui** components for consistent UI

### Backend

- **Express.js** server
- **SQLite** database for score storage
- **Rate limiting** for API protection
- **CORS** configuration for cross-origin requests

### Key Features

- **Fisher-Yates Shuffle Algorithm**: Ensures truly random card distribution
- **Independent Card Generation**: Each card is randomly selected, matching authentic ESP testing methodology
- **Real-time Database**: Scores are saved and retrieved in real-time
- **Responsive Design**: Optimized for all screen sizes

## 📊 Architecture

The application uses a client-server architecture:

- **Frontend**: React SPA that handles the user interface and ESP test logic
- **Backend**: Express server providing REST API for score management
- **Database**: SQLite for persistent score storage
- **Deployment**: Optimized for static hosting with API backend

## 🔬 Scientific Accuracy

This implementation maintains scientific integrity by:

- Using truly random symbol selection (Fisher-Yates algorithm)
- Preventing card counting through independent symbol generation
- Following original Zener card testing protocols
- Providing accurate statistical analysis of results

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Karl Zener for the original Zener card design
- Dr. J.B. Rhine and Duke University for the original Zener card ESP research
- The parapsychology community for continued scientific investigation
- Statistical data sourced from [Wikipedia: Zener cards](https://en.wikipedia.org/wiki/Zener_cards#Statistics)

---

*Test your psychic abilities, but remember: extraordinary claims require extraordinary evidence!* 🔮
