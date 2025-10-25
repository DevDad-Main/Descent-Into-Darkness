import { TerminalLine } from "@/components/Terminal";

/**
 * Helper functions to replace console.log() and prompt() with DOM manipulation
 * These maintain the game flow while working in a web environment
 */

export class TerminalHelpers {
  private outputCallback: (line: TerminalLine) => void;
  private inputCallback: (prompt: string) => Promise<string>;

  constructor(
    outputCallback: (line: TerminalLine) => void,
    inputCallback: (prompt: string) => Promise<string>
  ) {
    this.outputCallback = outputCallback;
    this.inputCallback = inputCallback;
  }

  /**
   * Replacement for console.log() - outputs text to terminal
   */
  log(text: string, type: TerminalLine["type"] = "output") {
    this.outputCallback({
      id: `${Date.now()}-${Math.random()}`,
      text,
      type,
      timestamp: Date.now(),
    });
  }

  /**
   * Replacement for console.error()
   */
  error(text: string) {
    this.log(text, "error");
  }

  /**
   * Replacement for console.info()
   */
  info(text: string) {
    this.log(text, "system");
  }

  /**
   * Success message helper
   */
  success(text: string) {
    this.log(text, "success");
  }

  /**
   * Replacement for prompt() - requests input from user
   */
  async prompt(message: string): Promise<string> {
    this.log(message, "system");
    return await this.inputCallback(message);
  }

  /**
   * Clear the terminal (in practice, adds spacing)
   */
  clear() {
    this.log("\n".repeat(3), "output");
  }

  /**
   * Display a formatted box message
   */
  box(title: string, content: string[]) {
    const width = 60;
    const border = "=".repeat(width);
    
    this.log(border, "system");
    this.log(`  ${title.toUpperCase()}`, "system");
    this.log(border, "system");
    
    content.forEach((line) => {
      this.log(line, "output");
    });
    
    this.log(border, "system");
  }

  /**
   * Display ASCII art or large text
   */
  ascii(art: string) {
    this.log(art, "system");
  }

  /**
   * Simulate a delay (for dramatic effect)
   */
  async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Display a progress indicator
   */
  async progress(message: string, steps: number = 3) {
    for (let i = 0; i < steps; i++) {
      this.log(`${message}${".".repeat(i + 1)}`, "output");
      await this.delay(500);
    }
  }
}

/**
 * Create a global terminal helper instance
 * Usage: const terminal = createTerminalHelpers(outputFn, inputFn);
 */
export function createTerminalHelpers(
  outputCallback: (line: TerminalLine) => void,
  inputCallback: (prompt: string) => Promise<string>
): TerminalHelpers {
  return new TerminalHelpers(outputCallback, inputCallback);
}

/**
 * ASCII Art templates for common game elements
 */
export const ASCII_ART = {
  sword: `
    /\\
   /  \\
  /====\\
 /      \\
|  ====  |
 \\      /
  \\    /
   \\  /
    \\/
  `,
  skull: `
    ___
   /   \\
  | o o |
  |  ^  |
  | \\_/ |
   \\___/
  `,
  chest: `
  ________
 /        \\
|  ______  |
| |      | |
| |______| |
|__________|
  `,
  heart: `
   ♥♥   ♥♥
  ♥  ♥ ♥  ♥
  ♥   ♥   ♥
   ♥     ♥
    ♥   ♥
     ♥ ♥
      ♥
  `,
};

/**
 * Color codes for terminal output (using ANSI-like syntax)
 */
export const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

/**
 * Format text with color (for display purposes)
 */
export function colorize(text: string, color: keyof typeof COLORS): string {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}
