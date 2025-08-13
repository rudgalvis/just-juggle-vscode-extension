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
exports.StorageService = void 0;
const vscode = __importStar(require("vscode"));
class StorageService {
    constructor(context) {
        this._context = context;
    }
    static initialize(context) {
        StorageService._instance = new StorageService(context);
    }
    static get instance() {
        if (!StorageService._instance) {
            throw new Error('StorageService not initialized. Call initialize() first.');
        }
        return StorageService._instance;
    }
    _getWorkspaceKey() {
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            return vscode.workspace.workspaceFolders[0].uri.fsPath;
        }
        return null;
    }
    // Project Name Storage (workspace-specific)
    getProjectName() {
        const workspaceKey = this._getWorkspaceKey();
        if (!workspaceKey) {
            return null;
        }
        const projectName = this._context.workspaceState.get(`projectName_${workspaceKey}`);
        return projectName || null;
    }
    setProjectName(projectName) {
        const workspaceKey = this._getWorkspaceKey();
        if (!workspaceKey) {
            return;
        }
        this._context.workspaceState.update(`projectName_${workspaceKey}`, projectName);
        console.log(`Stored project name "${projectName}" for workspace: ${workspaceKey}`);
    }
    clearProjectName() {
        const workspaceKey = this._getWorkspaceKey();
        if (!workspaceKey) {
            return;
        }
        this._context.workspaceState.update(`projectName_${workspaceKey}`, undefined);
        console.log(`Cleared project name for workspace: ${workspaceKey}`);
    }
    // API Key Storage (global)
    getApiKey() {
        const apiKey = this._context.globalState.get('justJuggle_apiKey');
        return apiKey || null;
    }
    setApiKey(apiKey) {
        this._context.globalState.update('justJuggle_apiKey', apiKey);
        console.log('API key stored globally');
    }
    clearApiKey() {
        this._context.globalState.update('justJuggle_apiKey', undefined);
        console.log('API key cleared');
    }
    hasApiKey() {
        return !!this.getApiKey();
    }
    // API Endpoint Storage (global)
    getApiEndpoint() {
        const customEndpoint = this._context.globalState.get('justJuggle_apiEndpoint');
        return customEndpoint || StorageService.DEFAULT_API_ENDPOINT;
    }
    setApiEndpoint(endpoint) {
        // Clean up endpoint (remove trailing slash)
        const cleanEndpoint = endpoint.replace(/\/$/, '');
        this._context.globalState.update('justJuggle_apiEndpoint', cleanEndpoint);
        console.log('API endpoint stored globally:', cleanEndpoint);
    }
    clearApiEndpoint() {
        this._context.globalState.update('justJuggle_apiEndpoint', undefined);
        console.log('API endpoint cleared, using default');
    }
    hasCustomApiEndpoint() {
        const customEndpoint = this._context.globalState.get('justJuggle_apiEndpoint');
        return !!customEndpoint;
    }
    getDefaultApiEndpoint() {
        return StorageService.DEFAULT_API_ENDPOINT;
    }
    // Development Mode Toggle
    isDevelopmentMode() {
        const devMode = this._context.globalState.get('justJuggle_devMode');
        return devMode || false;
    }
    setDevelopmentMode(enabled) {
        this._context.globalState.update('justJuggle_devMode', enabled);
        console.log('Development mode:', enabled ? 'enabled' : 'disabled');
    }
}
exports.StorageService = StorageService;
// Default production endpoint
StorageService.DEFAULT_API_ENDPOINT = 'https://api.just-juggle.com';
//# sourceMappingURL=StorageService.js.map