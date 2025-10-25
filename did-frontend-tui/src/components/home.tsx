import { useEffect, useState, useRef } from "react";
import Terminal from "./Terminal";
import MainMenu from "./MainMenu";
import { GameEngine } from "@/lib/gameEngine";

export default function Home() {
  const [showMenu, setShowMenu] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState<string | undefined>();
  const gameRef = useRef<GameEngine | null>(null);
  const [lines, setLines] = useState<any[]>([]);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    setHasSavedGame(GameEngine.hasSavedGame());

    // ESC key to return to menu
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showMenu) {
        setShowMenu(true);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showMenu]);

  const startNewGame = async () => {
    const game = new GameEngine();
    gameRef.current = game;
    await game.initialize();
    setLines([...game.getLines()]);
    setShowMenu(false);
  };

  const continueGame = async () => {
    const savedState = GameEngine.loadGame();
    if (savedState) {
      const game = new GameEngine(savedState);
      gameRef.current = game;
      await game.addLine("=".repeat(60), "system");
      await game.addLine("    GAME LOADED", "system");
      await game.addLine("=".repeat(60), "system");
      await game.addLine("");
      await game.look();
      setLines([...game.getLines()]);
    }
    setShowMenu(false);
  };

  const handleCommand = async (command: string) => {
    if (!gameRef.current || isProcessing) return;
    const game = gameRef.current;

    // 1️⃣ Check if the game is waiting for input
    if (game.awaitingInput) {
      game.awaitingInput(command); // resume the async io.input() in backend
      game.awaitingInput = null;
      return;
    }

    // 2️⃣ Otherwise, handle as a normal command
    setIsProcessing(true);

    const effects = await game.processCommand(command);
    setLines([...game.getLines()]);

    if (effects.shake) {
      setShake(true);
      setTimeout(() => setShake(false), 200);
    }

    if (effects.flash) {
      setFlash(effects.flash);
      setTimeout(() => setFlash(undefined), 100);
    }

    setIsProcessing(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Enhanced atmospheric particles - 30 particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 8}s`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      {showMenu ? (
        <MainMenu
          onNewGame={startNewGame}
          onContinue={continueGame}
          hasSavedGame={hasSavedGame}
        />
      ) : (
        <Terminal
          lines={lines}
          onCommand={handleCommand}
          prompt=">"
          isProcessing={isProcessing}
          shake={shake}
          flash={flash}
        />
      )}
    </div>
  );
}
