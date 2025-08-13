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
exports.MainPanel = void 0;
const vscode = __importStar(require("vscode"));
const ProjectDetector_1 = require("../utils/ProjectDetector");
const StorageService_1 = require("../services/StorageService");
class MainPanel {
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (MainPanel.currentPanel) {
            MainPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(MainPanel.viewType, 'Just Juggle', column || vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        MainPanel.currentPanel = new MainPanel(panel, extensionUri);
    }
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._projectDetector = new ProjectDetector_1.ProjectDetector();
        this._setupWebview();
        this._setupEventHandlers();
    }
    _setupWebview() {
        this._panel.webview.html = this._getHtmlContent();
        this._sendProjectInfo();
    }
    _setupEventHandlers() {
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage(message => this._handleMessage(message), null, this._disposables);
    }
    _handleMessage(message) {
        switch (message.command) {
            case 'setProjectName':
                this._handleSetProjectName(message.projectName);
                break;
            case 'resetProjectName':
                this._handleResetProjectName();
                break;
            case 'getProjectInfo':
                this._sendProjectInfo();
                break;
        }
    }
    _handleSetProjectName(projectName) {
        if (projectName && projectName.trim() !== '') {
            this._projectDetector.setProjectName(projectName.trim());
            this._sendProjectInfo();
            vscode.window.showInformationMessage(`Project name set to: ${projectName.trim()}`);
        }
    }
    _handleResetProjectName() {
        this._projectDetector.resetProjectName();
        this._sendProjectInfo();
        const detectedName = this._projectDetector.getDetectedProjectName();
        vscode.window.showInformationMessage(`Project name reset to: ${detectedName}`);
    }
    _sendProjectInfo() {
        const current = this._projectDetector.getProjectName();
        const detected = this._projectDetector.getDetectedProjectName();
        const stored = StorageService_1.StorageService.instance.getProjectName();
        this._panel.webview.postMessage({
            command: 'updateProjectInfo',
            data: {
                currentName: current,
                detectedName: detected,
                storedName: stored,
                isOverridden: !!stored
            }
        });
    }
    _getHtmlContent() {
        // We'll move this to a separate file
        return require('./panel-content').getHtmlContent();
    }
    dispose() {
        MainPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
exports.MainPanel = MainPanel;
MainPanel.viewType = 'justJugglePanel';
//# sourceMappingURL=main.js.map