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
exports.ActivityTracker = void 0;
const vscode = __importStar(require("vscode"));
const StorageService_1 = require("./StorageService");
const ProjectDetector_1 = require("../utils/ProjectDetector");
class ActivityTracker {
    constructor() {
        this._isActive = false;
        this._disposables = [];
        this._lastActivityTime = 0;
        // Configuration
        this.ACTIVITY_TIMEOUT = 5000; // 5 seconds of inactivity before stopping
        this.HEARTBEAT_INTERVAL = 30000; // Send heartbeat every 30 seconds
        this._projectDetector = new ProjectDetector_1.ProjectDetector();
    }
    static get instance() {
        if (!ActivityTracker._instance) {
            ActivityTracker._instance = new ActivityTracker();
        }
        return ActivityTracker._instance;
    }
    startTracking() {
        if (this._isActive) {
            console.log('Activity tracking is already active');
            return;
        }
        console.log('Starting activity tracking...');
        this._isActive = true;
        this._setupEventListeners();
        this._startHeartbeat();
    }
    stopTracking() {
        if (!this._isActive) {
            console.log('Activity tracking is already stopped');
            return;
        }
        console.log('Stopping activity tracking...');
        this._isActive = false;
        this._cleanupEventListeners();
        this._stopHeartbeat();
    }
    isActive() {
        return this._isActive;
    }
    _setupEventListeners() {
        // Listen to text document changes (typing)
        const textChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
            if (event.contentChanges.length > 0) {
                this._onActivity('typing', {
                    document: event.document.fileName,
                    changes: event.contentChanges.length
                });
            }
        });
        // Listen to active editor changes (switching files)
        const editorChangeListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                this._onActivity('file_switch', {
                    file: editor.document.fileName,
                    language: editor.document.languageId
                });
            }
        });
        // Listen to selection changes (cursor movement)
        const selectionChangeListener = vscode.window.onDidChangeTextEditorSelection((event) => {
            this._onActivity('selection_change', {
                file: event.textEditor.document.fileName,
                selections: event.selections.length
            });
        });
        // Listen to visible range changes (scrolling)
        const visibleRangeListener = vscode.window.onDidChangeTextEditorVisibleRanges((event) => {
            this._onActivity('scroll', {
                file: event.textEditor.document.fileName,
                ranges: event.visibleRanges.length
            });
        });
        // Listen to workspace folder changes
        const workspaceChangeListener = vscode.workspace.onDidChangeWorkspaceFolders((event) => {
            this._onActivity('workspace_change', {
                added: event.added.length,
                removed: event.removed.length
            });
        });
        // Listen to configuration changes
        const configChangeListener = vscode.workspace.onDidChangeConfiguration((event) => {
            this._onActivity('config_change', {
                affectsJustJuggle: event.affectsConfiguration('just-juggle')
            });
        });
        this._disposables.push(textChangeListener, editorChangeListener, selectionChangeListener, visibleRangeListener, workspaceChangeListener, configChangeListener);
        console.log('Activity event listeners registered');
    }
    _cleanupEventListeners() {
        this._disposables.forEach(disposable => disposable.dispose());
        this._disposables = [];
        console.log('Activity event listeners cleaned up');
    }
    _onActivity(type, data = {}) {
        const now = Date.now();
        this._lastActivityTime = now;
        // Reset inactivity timer
        if (this._activityTimer) {
            clearTimeout(this._activityTimer);
        }
        // Set new inactivity timer
        this._activityTimer = setTimeout(() => {
            console.log('User inactive for too long, pausing tracking...');
            this._sendTrackingData('pause', { reason: 'inactivity' });
        }, this.ACTIVITY_TIMEOUT);
        // Call mock function with activity data
        this._sendTrackingData(type, {
            ...data,
            timestamp: now,
            project: this._projectDetector.getProjectName(),
            workspace: this._getWorkspaceName()
        });
    }
    _getWorkspaceName() {
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            return vscode.workspace.workspaceFolders[0].name;
        }
        return null;
    }
    _startHeartbeat() {
        if (this._activityTimer) {
            clearInterval(this._activityTimer);
        }
        // Send periodic heartbeat to keep session alive
        this._activityTimer = setInterval(() => {
            if (this._isActive) {
                const timeSinceLastActivity = Date.now() - this._lastActivityTime;
                if (timeSinceLastActivity < this.ACTIVITY_TIMEOUT) {
                    this._sendTrackingData('heartbeat', {
                        project: this._projectDetector.getProjectName(),
                        workspace: this._getWorkspaceName(),
                        lastActivity: timeSinceLastActivity
                    });
                }
            }
        }, this.HEARTBEAT_INTERVAL);
    }
    _stopHeartbeat() {
        if (this._activityTimer) {
            clearInterval(this._activityTimer);
            this._activityTimer = undefined;
        }
    }
    // Mock function - replace with actual API call later
    _sendTrackingData(activityType, data) {
        const apiKey = StorageService_1.StorageService.instance.getApiKey();
        const apiEndpoint = StorageService_1.StorageService.instance.getApiEndpoint();
        const payload = {
            activityType,
            data,
            apiKey: apiKey ? 'configured' : 'missing',
            endpoint: apiEndpoint,
            timestamp: new Date().toISOString()
        };
        console.log('🎯 MOCK API CALL - Activity Tracked:', {
            type: activityType,
            project: data.project,
            workspace: data.workspace,
            timestamp: payload.timestamp,
            hasApiKey: !!apiKey,
            endpoint: apiEndpoint,
            fullPayload: payload
        });
        // TODO: Replace with actual HTTP request
        // this._makeApiRequest(apiEndpoint, payload);
    }
    // Future: Actual API call implementation
    async _makeApiRequest(endpoint, payload) {
        try {
            // This would be the actual implementation
            console.log(`Making API request to ${endpoint}`, payload);
        }
        catch (error) {
            console.error('Failed to send tracking data:', error);
        }
    }
    dispose() {
        this.stopTracking();
        ActivityTracker._instance = undefined;
    }
}
exports.ActivityTracker = ActivityTracker;
//# sourceMappingURL=activity_tracker.js.map