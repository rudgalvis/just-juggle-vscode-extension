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
const webview_1 = require("../webview");
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
        this._panel.webview.html = (0, webview_1.getHtmlContent)();
        this._sendAllInfo();
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
            case 'setApiKey':
                console.log('test 2');
                this._handleSetApiKey(message.apiKey);
                break;
            case 'clearApiKey':
                console.log('test');
                this._handleClearApiKey();
                break;
            case 'setApiEndpoint':
                this._handleSetApiEndpoint(message.endpoint);
                break;
            case 'clearApiEndpoint':
                this._handleClearApiEndpoint();
                break;
            case 'toggleDevelopmentMode':
                this._handleToggleDevelopmentMode(message.enabled);
                break;
            case 'getAllInfo':
                this._sendAllInfo();
                break;
        }
    }
    _handleSetProjectName(projectName) {
        if (projectName && projectName.trim() !== '') {
            this._projectDetector.setProjectName(projectName.trim());
            this._sendAllInfo();
            vscode.window.showInformationMessage(`Project name set to: ${projectName.trim()}`);
        }
    }
    _handleResetProjectName() {
        this._projectDetector.resetProjectName();
        this._sendAllInfo();
        const detectedName = this._projectDetector.getDetectedProjectName();
        vscode.window.showInformationMessage(`Project name reset to: ${detectedName}`);
    }
    _handleSetApiKey(apiKey) {
        if (apiKey && apiKey.trim() !== '') {
            StorageService_1.StorageService.instance.setApiKey(apiKey.trim());
            this._sendAllInfo();
            vscode.window.showInformationMessage('API key saved successfully!');
        }
        else {
            vscode.window.showErrorMessage('Please enter a valid API key');
        }
    }
    _handleClearApiKey() {
        StorageService_1.StorageService.instance.clearApiKey();
        this._sendAllInfo();
        vscode.window.showInformationMessage('API key cleared');
    }
    _handleSetApiEndpoint(endpoint) {
        if (endpoint && endpoint.trim() !== '') {
            const cleanEndpoint = endpoint.trim();
            if (this._isValidUrl(cleanEndpoint)) {
                StorageService_1.StorageService.instance.setApiEndpoint(cleanEndpoint);
                this._sendAllInfo();
                vscode.window.showInformationMessage(`API endpoint set to: ${cleanEndpoint}`);
            }
            else {
                vscode.window.showErrorMessage('Please enter a valid URL (e.g., http://localhost:3000 or https://api.example.com)');
            }
        }
        else {
            vscode.window.showErrorMessage('Please enter a valid API endpoint');
        }
    }
    _handleClearApiEndpoint() {
        StorageService_1.StorageService.instance.clearApiEndpoint();
        this._sendAllInfo();
        const defaultEndpoint = StorageService_1.StorageService.instance.getDefaultApiEndpoint();
        vscode.window.showInformationMessage(`API endpoint reset to default: ${defaultEndpoint}`);
    }
    _handleToggleDevelopmentMode(enabled) {
        StorageService_1.StorageService.instance.setDevelopmentMode(enabled);
        this._sendAllInfo();
        vscode.window.showInformationMessage(`Development mode ${enabled ? 'enabled' : 'disabled'}`);
    }
    _isValidUrl(url) {
        try {
            new URL(url);
            return url.startsWith('http://') || url.startsWith('https://');
        }
        catch {
            return false;
        }
    }
    _sendAllInfo() {
        // Project info
        const current = this._projectDetector.getProjectName();
        const detected = this._projectDetector.getDetectedProjectName();
        const stored = StorageService_1.StorageService.instance.getProjectName();
        // API key info
        const apiKey = StorageService_1.StorageService.instance.getApiKey();
        const hasApiKey = StorageService_1.StorageService.instance.hasApiKey();
        // API endpoint info
        const apiEndpoint = StorageService_1.StorageService.instance.getApiEndpoint();
        const hasCustomEndpoint = StorageService_1.StorageService.instance.hasCustomApiEndpoint();
        const defaultEndpoint = StorageService_1.StorageService.instance.getDefaultApiEndpoint();
        // Development mode
        const isDevelopmentMode = StorageService_1.StorageService.instance.isDevelopmentMode();
        this._panel.webview.postMessage({
            command: 'updateAllInfo',
            data: {
                // Project data
                currentName: current,
                detectedName: detected,
                storedName: stored,
                isProjectOverridden: !!stored,
                // API key data
                hasApiKey: hasApiKey,
                apiKeyMasked: apiKey ? this._maskApiKey(apiKey) : null,
                // API endpoint data
                apiEndpoint: apiEndpoint,
                hasCustomEndpoint: hasCustomEndpoint,
                defaultEndpoint: defaultEndpoint,
                // Development mode
                isDevelopmentMode: isDevelopmentMode
            }
        });
    }
    _maskApiKey(apiKey) {
        if (apiKey.length <= 8) {
            return '***' + apiKey.slice(-2);
        }
        return apiKey.slice(0, 4) + '***' + apiKey.slice(-4);
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
//# sourceMappingURL=MainPanel.js.map