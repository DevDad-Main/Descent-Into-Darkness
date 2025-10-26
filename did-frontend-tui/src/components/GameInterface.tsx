import { useReducer, useEffect, useRef, useMemo, useState } from "react";
import CRTDisplay from "./CRTDisplay";
import TypewriterText from "./TypewriterText";
import TerminalInput from "./TerminalInput";
import { gameReducer, initialGameState } from "../game/gameEngine";
import { Message } from "../game/types";
import { UIAdapter } from "../game/uiAdapter";
import { PlayerClass } from "../game/PlayerClass";

export default function GameInterface() {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create UI adapter that your player class can use
  const uiAdapter = useMemo(() => new UIAdapter(dispatch), []);

  // Store player instance with UI methods
  const [playerInstance, setPlayerInstance] = useState<PlayerClass | null>(
    null,
  );

  // Initialize player instance when game starts
  useEffect(() => {
    if (gameState.player && !playerInstance) {
      const newPlayer = new PlayerClass(gameState.player.name, uiAdapter);
      setPlayerInstance(newPlayer);
    }
  }, [gameState.player, playerInstance, uiAdapter]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [gameState.messages]);

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();

    // Handle pending choice
    if (gameState.pendingChoice) {
      const option = gameState.pendingChoice.options.find(
        (opt) => opt.key === cmd || opt.text.toLowerCase() === cmd,
      );
      if (option) {
        dispatch({
          type: "MAKE_CHOICE",
          choiceId: gameState.pendingChoice.id,
          value: option.value,
        });
        return;
      }
    }

    // Add user command to messages
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `> ${command}`,
      type: "normal",
      timestamp: Date.now(),
    };
    dispatch({ type: "ADD_MESSAGE", message: userMessage });

    // Handle different game phases
    if (gameState.gamePhase === "menu") {
      if (cmd === "start" || cmd === "1") {
        dispatch({ type: "START_GAME", playerName: "Adventurer" });
      } else if (cmd === "quit" || cmd === "exit") {
        const msg: Message = {
          id: Date.now().toString(),
          text: "Thanks for playing!",
          type: "system",
          timestamp: Date.now(),
        };
        dispatch({ type: "ADD_MESSAGE", message: msg });
      }
      return;
    }

    if (gameState.gamePhase === "combat") {
      if (cmd === "attack" || cmd === "a") {
        dispatch({ type: "ATTACK" });
      } else if (cmd === "run" || cmd === "r") {
        dispatch({ type: "RUN" });
      } else {
        const msg: Message = {
          id: Date.now().toString(),
          text: "Invalid combat command. Use: attack (a) or run (r)",
          type: "error",
          timestamp: Date.now(),
        };
        dispatch({ type: "ADD_MESSAGE", message: msg });
      }
      return;
    }

    if (gameState.gamePhase === "inventory") {
      if (cmd === "back" || cmd === "b") {
        dispatch({ type: "RETURN_TO_MENU" });
      }
      return;
    }

    // Playing phase commands
    if (cmd.startsWith("go ") || cmd.startsWith("move ")) {
      const direction = cmd.split(" ")[1];
      dispatch({ type: "MOVE", direction });
    } else if (cmd === "look" || cmd === "l") {
      const msg: Message = {
        id: Date.now().toString(),
        text: gameState.currentLocation.description,
        type: "normal",
        timestamp: Date.now(),
      };
      dispatch({ type: "ADD_MESSAGE", message: msg });
    } else if (cmd === "inventory" || cmd === "i") {
      dispatch({ type: "SHOW_INVENTORY" });
    } else if (cmd === "status" || cmd === "stats") {
      if (gameState.player) {
        const msg: Message = {
          id: Date.now().toString(),
          text: `
═══════════════════════════════════
  ${gameState.player.name} - Level ${gameState.player.level}
═══════════════════════════════════
  HP: ${gameState.player.hp}/${gameState.player.maxHp}
  Attack: ${gameState.player.attack}
  Defense: ${gameState.player.defense}
  XP: ${gameState.player.xp}/${gameState.player.xpToNextLevel}
  Gold: ${gameState.player.gold}
═══════════════════════════════════
          `,
          type: "system",
          timestamp: Date.now(),
        };
        dispatch({ type: "ADD_MESSAGE", message: msg });
      }
    } else if (cmd === "help" || cmd === "h") {
      const msg: Message = {
        id: Date.now().toString(),
        text: `
Available Commands:
  go/move [direction] - Move in a direction (north, south, east, west, up, down)
  look (l) - Examine your surroundings
  inventory (i) - View your inventory
  status/stats - View your character stats
  help (h) - Show this help message
  menu - Return to main menu
        `,
        type: "system",
        timestamp: Date.now(),
      };
      dispatch({ type: "ADD_MESSAGE", message: msg });
    } else if (cmd === "menu") {
      dispatch({ type: "RETURN_TO_MENU" });
    } else {
      const msg: Message = {
        id: Date.now().toString(),
        text: `Unknown command: "${command}". Type "help" for available commands.`,
        type: "error",
        timestamp: Date.now(),
      };
      dispatch({ type: "ADD_MESSAGE", message: msg });
    }

    // Example: Call player methods
    if (cmd === "test") {
      playerInstance?.findItem({
        id: "test",
        name: "Test Sword",
        type: "weapon",
        description: "A test",
        value: 10,
      });
      return;
    }
  };

  // Render choice menu
  const renderChoice = () => {
    if (!gameState.pendingChoice) return null;

    return (
      <div className="border border-cyan-500/50 p-4 rounded bg-cyan-950/20 mb-4">
        <p className="text-cyan-400 font-bold mb-3">
          {gameState.pendingChoice.prompt}
        </p>
        <div className="space-y-2">
          {gameState.pendingChoice.options.map((option) => (
            <p key={option.key} className="text-green-400 ml-4">
              {option.key}. {option.text}
            </p>
          ))}
        </div>
        <p className="text-green-500/70 text-sm mt-3">
          Type the number or option name
        </p>
      </div>
    );
  };

  const renderMainMenu = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <TypewriterText
          text="═══════════════════════════════════════════════════════════"
          speed={10}
          className="block text-green-400"
        />
        <h1 className="text-4xl font-bold text-green-400 tracking-wider">
          Decent Into Darkness
        </h1>
        <TypewriterText
          text="A Text-Based RPG Adventure"
          speed={20}
          className="block text-green-500 text-xl"
        />
        <TypewriterText
          text="═══════════════════════════════════════════════════════════"
          speed={10}
          className="block text-green-400"
        />
      </div>

      <div className="mt-8 space-y-3 text-lg">
        <p className="text-green-400">1. Start New Game (type: start)</p>
        <p className="text-green-400">2. Load Game (type: load)</p>
        <p className="text-green-400">3. Settings (type: settings)</p>
        <p className="text-green-400">4. Exit (type: quit)</p>
      </div>

      <div className="mt-8 text-green-500/70 text-sm">
        <p>Type a command and press Enter to begin...</p>
      </div>
    </div>
  );

  const renderGamePlay = () => (
    <div className="space-y-4">
      <div className="border-b border-green-500/30 pb-4">
        <h2 className="text-2xl font-bold text-green-400">
          {gameState.currentLocation.name}
        </h2>
        <p className="text-green-500 mt-2">
          {gameState.currentLocation.description}
        </p>
      </div>

      {gameState.currentLocation.npcs.length > 0 && (
        <div className="text-green-400">
          <p className="font-semibold">NPCs here:</p>
          {gameState.currentLocation.npcs.map((npc, idx) => (
            <p key={idx} className="ml-4">
              - {npc.name}
            </p>
          ))}
        </div>
      )}

      {gameState.currentLocation.items.length > 0 && (
        <div className="text-green-400">
          <p className="font-semibold">Items here:</p>
          {gameState.currentLocation.items.map((item, idx) => (
            <p key={idx} className="ml-4">
              - {item.name}
            </p>
          ))}
        </div>
      )}

      <div className="text-green-500/70">
        <p className="font-semibold">Exits:</p>
        <p className="ml-4">
          {gameState.currentLocation.exits.map((e) => e.direction).join(", ")}
        </p>
      </div>
    </div>
  );

  const renderCombat = () => {
    if (!gameState.combatState || !gameState.player) return null;

    return (
      <div className="space-y-4">
        <div className="border border-red-500/50 p-4 rounded bg-red-950/20">
          <h2 className="text-2xl font-bold text-red-400 mb-4">⚔️ COMBAT ⚔️</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-green-400">
              <p className="font-bold">{gameState.player.name}</p>
              <p>
                HP: {gameState.player.hp}/{gameState.player.maxHp}
              </p>
              <div className="w-full bg-gray-700 h-2 rounded mt-1">
                <div
                  className="bg-green-500 h-2 rounded transition-all"
                  style={{
                    width: `${(gameState.player.hp / gameState.player.maxHp) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-red-400">
              <p className="font-bold">{gameState.combatState.enemy.name}</p>
              <p>
                HP: {gameState.combatState.enemy.hp}/
                {gameState.combatState.enemy.maxHp}
              </p>
              <div className="w-full bg-gray-700 h-2 rounded mt-1">
                <div
                  className="bg-red-500 h-2 rounded transition-all"
                  style={{
                    width: `${(gameState.combatState.enemy.hp / gameState.combatState.enemy.maxHp) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-red-500/30 pt-4 space-y-1">
            {gameState.combatState.combatLog.map((log, idx) => (
              <p key={idx} className="text-yellow-400">
                {log}
              </p>
            ))}
          </div>

          <div className="mt-4 text-green-400">
            <p>Commands: attack (a) | run (r)</p>
          </div>
        </div>
      </div>
    );
  };

  const renderMessages = () => (
    <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
      {gameState.messages.slice(-10).map((msg) => (
        <p
          key={msg.id}
          className={`
            ${msg.type === "error" ? "text-red-400" : ""}
            ${msg.type === "success" ? "text-yellow-400" : ""}
            ${msg.type === "system" ? "text-cyan-400" : ""}
            ${msg.type === "normal" ? "text-green-400" : ""}
            ${msg.type === "combat" ? "text-orange-400" : ""}
          `}
        >
          {msg.text}
        </p>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <div className="w-full h-screen bg-black">
      <CRTDisplay>
        <div className="min-h-full flex flex-col">
          <div className="flex-1">
            {renderChoice()}
            {gameState.gamePhase === "menu" && renderMainMenu()}
            {gameState.gamePhase === "playing" && (
              <>
                {renderGamePlay()}
                {renderMessages()}
              </>
            )}
            {gameState.gamePhase === "combat" && (
              <>
                {renderCombat()}
                {renderMessages()}
              </>
            )}
            {gameState.gamePhase === "gameOver" && (
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-red-400">GAME OVER</h1>
                <p className="text-green-400">
                  Type "menu" to return to main menu
                </p>
              </div>
            )}
          </div>

          <TerminalInput
            onCommand={handleCommand}
            disabled={false}
            placeholder={
              gameState.pendingChoice
                ? "Choose an option..."
                : gameState.gamePhase === "menu"
                  ? "Enter menu choice..."
                  : gameState.gamePhase === "combat"
                    ? "Enter combat command..."
                    : "Enter command..."
            }
          />
        </div>
      </CRTDisplay>
    </div>
  );
}

// Export the UI adapter for use in your player class
export { UIAdapter };
