import { useState } from "react";
import { Button } from "./ui/button";

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  hasSavedGame: boolean;
}

export default function MainMenu({
  onNewGame,
  onContinue,
  hasSavedGame,
}: MainMenuProps) {
  const [showMenu, setShowMenu] = useState(true);

  const handleNewGame = () => {
    setShowMenu(false);
    setTimeout(onNewGame, 300);
  };

  const handleContinue = () => {
    setShowMenu(false);
    setTimeout(onContinue, 300);
  };

  if (!showMenu) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative">
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-green-500/20 blur-3xl animate-pulse"></div>

        <div className="relative space-y-8 text-center">
          {/* ASCII Title */}

          <div className="font-mono text-green-400 text-sm leading-tight select-none text-center">
            <pre className="animate-in slide-in-from-top duration-700 inline-block text-left">
              {`██████╗ ███████╗███████╗ ██████╗███████╗███╗   ██╗████████╗
██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║╚══██╔══╝
██║  ██║█████╗  ███████╗██║     █████╗  ██╔██╗ ██║   ██║
██║  ██║██╔══╝  ╚════██║██║     ██╔══╝  ██║╚██╗██║   ██║
██████╔╝███████╗███████║╚██████╗███████╗██║ ╚████║   ██║
╚═════╝ ╚══════╝╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝   ╚═╝

                       INTO DARKNESS`}
            </pre>
          </div>

          {/* Menu Options */}
          <div className="space-y-4 animate-in slide-in-from-bottom duration-700 delay-300">
            <Button
              onClick={handleNewGame}
              className="w-64 h-14 bg-green-900/50 hover:bg-green-800/70 text-green-300 border-2 border-green-500/50 hover:border-green-400 font-mono text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
            >
              <span className="mr-2">▶</span> NEW GAME
            </Button>

            {hasSavedGame && (
              <Button
                onClick={handleContinue}
                className="w-64 h-14 bg-cyan-900/50 hover:bg-cyan-800/70 text-cyan-300 border-2 border-cyan-500/50 hover:border-cyan-400 font-mono text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
              >
                <span className="mr-2">↻</span> CONTINUE
              </Button>
            )}

            <div className="pt-4 text-green-600 font-mono text-xs animate-pulse">
              Press ESC anytime to return to menu
            </div>
          </div>

          {/* Version info */}
          <div className="text-green-700 font-mono text-xs animate-in fade-in duration-1000 delay-500 space-y-1">
            <div>v1.0.0 | Terminal Edition</div>
            <div className="text-green-800">
              <a href="https://github.com/DevDad-Main">Github@DevDad-Main</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
