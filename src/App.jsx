import { useState, useEffect } from "react";
import Home from "./components/views/Home.jsx";
import Game from "./components/views/Game.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Handle Space key press
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        setGameStarted(true);
      }
    };

    // Handle Left Mouse Button (LMB) click
    const handleMouseDown = (e) => {
      if (e.button === 0) {  // 0 is the LMB
        setGameStarted(true);
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div className="app">
      {gameStarted ? <Game /> : <Home />}
    </div>
  );
}

export default App;