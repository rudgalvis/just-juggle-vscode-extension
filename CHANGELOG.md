# Change Log

All notable changes to the "just-juggle" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.0] - 2025-08-14

### Added
- **Initial Release** - Just Juggle time tracking extension for VS Code
- **Automatic Project Detection** - Smart project name detection based on workspace folder, Git repository, or package.json
- **Project Override System** - Set custom project names that override automatic detection on a per-project basis
- **Activity Timestamp Tracking** - Tracks user activity in VS Code and sends timestamps to Just Juggle platform
- **Configuration Panel** - Dedicated webview interface for easy extension setup and management
- **API Integration** - Connect to Just Juggle platform with secure API key authentication
- **Development Mode** - Toggle development mode for testing with local API endpoints
- **Custom API Endpoints** - Configure custom API endpoints for self-hosted instances
- **Persistent Settings** - API keys stored per VS Code installation, project overrides stored per project

### Commands - `⌘⇧P` (macOS) / `Ctrl+Shift+P` (Windows/Linux)
- `Just Juggle Configuration` - Open the main configuration panel

### Features
- **Privacy-First Design** - Only activity timestamps are sent to the server
- **Seamless Integration** - Works with Just Juggle web platform (https://just-juggle.com)
- **Intelligent Project Detection** - Automatically identifies projects without manual setup
- **Per-Project Customization** - Override project names independently for different workspaces
- **Auto-Start Capability** - Automatically begins tracking when API key is configured

### Technical Details
- **Minimal Data Transfer** - Only timestamps of VS Code activity are transmitted to Just Juggle servers
- **Event-Driven Tracking** - Activity timestamps sent on user interactions within VS Code
- **Dual Storage System** - Global settings (API key) and per-project settings (name overrides)
- **Clean Resource Management** - Proper cleanup and disposal of resources on deactivation
- **TypeScript Support** - Full TypeScript integration with type-safe activity data structures
