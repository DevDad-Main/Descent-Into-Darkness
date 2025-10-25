# Console-Style Text RPG Web Interface

A web-based text RPG that preserves the console/terminal aesthetic while leveraging web capabilities for enhanced visuals and interactions.

## Features

### ✨ Terminal-Like UI
- Fixed-width font with dark background
- Authentic terminal window with traffic light controls
- Scrolling text output area that simulates console logs
- Command input field at the bottom mimicking terminal prompts

### ⌨️ Command System
- Full command history navigation (up/down arrows)
- Command processing with feedback
- Multiple game commands: `help`, `look`, `inventory`, `status`, `go`, `take`, `attack`, `use`, `talk`

### 🎬 Visual Effects
- **Typing Effect**: Text appears character-by-character for immersive storytelling
- **Screen Shake**: Triggered during combat actions
- **Color Flashes**: Environmental feedback for combat events
- **Atmospheric Particles**: Subtle floating particles for ambiance

### 🎮 Game Features
- Character health and inventory system
- Multiple locations to explore
- Combat system with enemies
- NPCs to interact with
- Item collection and usage
- Turn-based combat with visual feedback

## Architecture

### Components

#### `Terminal.tsx`
Main terminal UI component that handles:
- Line rendering with typing effects
- Command input and history
- Visual effects (shake, flash)
- Scrolling and auto-focus

#### `home.tsx`
Game container that:
- Initializes the game engine
- Manages game state
- Handles command processing
- Coordinates visual effects

### Core Systems

#### `gameEngine.ts`
Game logic engine featuring:
- Command parsing and execution
- Game state management
- Location system
- Combat mechanics
- Inventory management
- NPC interactions

#### `terminalHelpers.ts`
Helper utilities that replace console methods:
- `log()` - Replacement for console.log()
- `error()` - Error messages
- `success()` - Success messages
- `prompt()` - Async input requests
- `box()` - Formatted message boxes
- `ascii()` - ASCII art display
- `progress()` - Loading indicators

## Usage

### Playing the Game

1. Type `help` to see available commands
2. Use `look` to examine your surroundings
3. Navigate with `go [location]`
4. Pick up items with `take [item]`
5. Check your status with `inventory` and `status`
6. Engage in combat with `attack [enemy]`
7. Use items with `use [item]`
8. Talk to NPCs with `talk [person]`

### Command History

- Press **↑** (Up Arrow) to navigate to previous commands
- Press **↓** (Down Arrow) to navigate to next commands
- History persists during the game session

### Extending the Game

#### Adding New Locations

Edit `gameEngine.ts` and add to the `locations` object in the `look()` method:

```typescript
new_location: {
  description: "Your location description",
  items: ["item1", "item2"],
  exits: ["location1", "location2"],
  npcs: ["npc_name"],
  enemies: ["enemy_name"]
}
```

#### Adding New Commands

Add a new case in the `processCommand()` method:

```typescript
case "yourcmd":
  await this.yourMethod(parts.slice(1).join(" "));
  break;
```

#### Using Terminal Helpers

```typescript
import { createTerminalHelpers } from "@/lib/terminalHelpers";

const terminal = createTerminalHelpers(outputFn, inputFn);

terminal.log("Normal message");
terminal.error("Error message");
terminal.success("Success message");
terminal.box("Title", ["Line 1", "Line 2"]);
await terminal.prompt("Enter your name:");
```

## Styling

The terminal uses:
- **Font**: Monospace (system default)
- **Colors**: Green terminal theme (#4ade80)
- **Background**: Pure black (#000000)
- **Animations**: CSS keyframes for shake, flash, and float effects

### Color Coding

- **Green**: Normal output
- **Yellow**: User input
- **Red**: Errors and combat
- **Cyan**: System messages
- **Light Green**: Success messages

## Technical Details

### Technologies
- React 18
- TypeScript
- Tailwind CSS
- Vite
- shadcn/ui components

### Performance
- Typing effect uses requestAnimationFrame for smooth rendering
- Command history stored in component state
- Auto-scrolling to latest output
- Efficient re-rendering with React hooks

## Future Enhancements

- [ ] Ambient background sounds
- [ ] Save/load game state
- [ ] More complex combat system
- [ ] Quest system
- [ ] Character customization
- [ ] Multiplayer support
- [ ] Achievement system
- [ ] Map visualization

## License

MIT