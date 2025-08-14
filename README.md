# Just Juggle extension for Visual Studio Code

[Just Juggle](https://just-juggle.com) automatically tracks your coding time across projects - no timers, no manual entries, no forgotten hours. Perfect for freelancers billing clients, teams monitoring velocity, or developers curious about their productivity patterns.

## Setup
1. Install from VS Code Marketplace or [build from source](#building-from-source)
2. Run Command Palette: `Cmd/Ctrl + Shift + P` → _"Just Juggle: Configure"_
3. Paste your API key (get it from [just-juggle.com -> dashboard](https://just-juggle.com/auth/login))
4. Done! Just do your thing, insights will be available in the dashboard.

## Features
- **Zero-effort tracking** - Captures time the moment you start typing, stops when you're idle
- **Intelligent project recognition** - Auto-detects project by root folder name
- **Project overrides** - Custom override for specific projects naming
- **Real-time insights** - View daily/weekly/monthly summaries in the [dashboard](https://just-juggle.com)
- **Privacy-first** - Only tracks project names and timestamps of activity, never anything else
- **Open-source** - You don't have to trust our word for privacy statements - validate the code yourself


## Requirements
- [Just Juggle](https://just-juggle.com/auth/login) account (free)
- VS Code 1.74.0 or higher

---

> Local-first is also a thing, but we're not there yet. Stay tuned! You can still build from source.

## Building from Source

To build the extension locally:
1. **Clone the repository**
``` bash
   git clone https://github.com/rudgalvis/just-juggle-vscode-extension
   cd just-juggle-vscode-extension
```
2. **Install dependencies**
``` bash
   npm install
```
3. **Package the extension (optional)**
``` bash
   pnpm install -g @vscode/vsce
   vsce package
```
4. **Install locally**
    - Install the generated `.vsix` file via `Extensions: Install from VSIX...`

### Development Requirements
- Node.js 16+ with pnpm package manager
- TypeScript 5.6.2
- VS Code 1.74.0 or higher
