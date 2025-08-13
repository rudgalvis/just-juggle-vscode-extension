"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JustJugglePanel = void 0;
const vscode = __importStar(require("vscode"));
const ProjectDetector_1 = require("../utils/ProjectDetector");
const webviewContent_1 = require("./webviewContent");
class JustJugglePanel {
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it
        if (JustJugglePanel.currentPanel) {
            JustJugglePanel.currentPanel._panel.reveal(column);
            return;
        }
        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(JustJugglePanel.viewType, 'Just Juggle Panel', column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, 'media')
            ]
        });
        JustJugglePanel.currentPanel = new JustJugglePanel(panel, extensionUri);
    }
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._projectDetector = new ProjectDetector_1.ProjectDetector();
        this._update();
        this._setupEventListeners();
    }
    _setupEventListeners() {
        // Listen for when the panel is disposed
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage((message) => this._handleWebviewMessage(message), null, this._disposables);
    }
    _handleWebviewMessage(message) {
        switch (message.command) {
            case 'inputChanged':
                vscode.window.showInformationMessage(`Input value: ${message.text}`);
                break;
            case 'submitInput':
                this._handleSubmitInput(message);
                break;
            case 'requestProjectName':
                this._sendProjectName();
                break;
        }
    }
    _handleSubmitInput(message) {
        vscode.window.showInformationMessage(`Submitted: ${message.text}`);
        // Here you could add logic to save the time tracking data
        // For example, call an API or save to a local file
    }
    _sendProjectName() {
        const projectName = this._projectDetector.getProjectName();
        this._panel.webview.postMessage({
            command: 'setProjectName',
            projectName: projectName
        });
    }
    dispose() {
        JustJugglePanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _update() {
        this._panel.webview.html = (0, webviewContent_1.getWebviewContent)(this._panel.webview);
    }
}
exports.JustJugglePanel = JustJugglePanel;
JustJugglePanel.viewType = 'justJugglePanel';
//# sourceMappingURL=just_juggle_panel.js.map