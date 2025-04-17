import { useState, useEffect } from "react";
import Home from "./components/views/Home.jsx";
import Game from "./components/views/Game.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        setGameStarted(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app">
      {gameStarted ? <Game /> : <Home />}
    </div>
  );
}

export default App;