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
const StorageService_1 = require("../services/StorageService");
const ProjectDetector_1 = require("./ProjectDetector");
const VERBOSE = false;
class ActivityTracker {
    constructor() {
        this._isActive = false;
        this._disposables = [];
        this._debounceDelay = 5000; // 5 seconds
        this._logActivity = this._logActivity.bind(this);
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
            if (VERBOSE) {
                console.log("Activity tracking is already active");
            }
            return;
        }
        if (VERBOSE) {
            console.log("Starting activity tracking...");
        }
        this._isActive = true;
        this._setupEventListeners();
    }
    stopTracking() {
        if (!this._isActive) {
            if (VERBOSE) {
                console.log("Activity tracking is already stopped");
            }
            return;
        }
        if (VERBOSE) {
            console.log("Stopping activity tracking...");
        }
        this._isActive = false;
        this._cleanupEventListeners();
    }
    _setupEventListeners() {
        // Listen to text document changes (typing)
        const textChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
            if (event.contentChanges.length > 0) {
                this._logActivity();
            }
        });
        // Listen to active editor changes (switching files)
        const editorChangeListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                this._logActivity();
            }
        });
        // Listen to selection changes (cursor movement)
        const selectionChangeListener = vscode.window.onDidChangeTextEditorSelection(this._logActivity);
        // Listen to visible range changes (scrolling)
        const visibleRangeListener = vscode.window.onDidChangeTextEditorVisibleRanges(this._logActivity);
        // Listen to workspace folder changes
        const workspaceChangeListener = vscode.workspace.onDidChangeWorkspaceFolders(this._logActivity);
        // Listen to configuration changes
        const configChangeListener = vscode.workspace.onDidChangeConfiguration(this._logActivity);
        this._disposables.push(textChangeListener, editorChangeListener, selectionChangeListener, visibleRangeListener, workspaceChangeListener, configChangeListener);
        if (VERBOSE) {
            console.log("Activity event listeners registered");
        }
    }
    _cleanupEventListeners() {
        this._disposables.forEach((disposable) => disposable.dispose());
        this._disposables = [];
        if (VERBOSE) {
            console.log("Activity event listeners cleaned up");
        }
    }
    _logActivity() {
        // Clear existing timer if there is one
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
        }
        // Set new timer to send data after few seconds of the last activity
        this._debounceTimer = setTimeout(() => {
            this._sendTrackingData();
        }, this._debounceDelay);
    }
    // Mock function - replace with actual API call later
    async _sendTrackingData() {
        const apiKey = StorageService_1.StorageService.instance.getApiKey();
        const apiEndpoint = StorageService_1.StorageService.instance.getApiEndpoint();
        const project = this._projectDetector.getProjectName() || null;
        const createdAtIso = new Date().toISOString();
        if (!apiEndpoint) {
            console.error("Missing apiEndpoint to log");
            return;
        }
        if (!project) {
            console.error("Missing project to log");
            return;
        }
        if (!apiKey) {
            console.error("Missing apiKey to log");
            return;
        }
        if (VERBOSE) {
            console.log("🎯 API CALL - Activity Tracked:", {
                apiKey,
                apiEndpoint,
                project,
                createdAtIso,
            });
        }
        const cleanEndpoint = apiEndpoint.replace(/\/$/, "");
        const apiVersion = "v1";
        const url = `${cleanEndpoint}/api/${apiVersion}/logs/store-chunk`;
        const r = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey || "",
            },
            body: JSON.stringify([
                {
                    project,
                    created_at_iso: createdAtIso,
                },
            ]),
        });
        if (!r.ok) {
            try {
                const text = await r.text();
                console.error("Failed to accept log", text);
            }
            catch (e) { }
            return;
        }
        if (VERBOSE) {
            console.log("Log accepted");
        }
    }
    // Future: Actual API call implementation
    async _makeApiRequest(endpoint, payload) {
        try {
            // This would be the actual implementation
            if (VERBOSE) {
                console.log(`Making API request to ${endpoint}`, payload);
            }
        }
        catch (error) {
            console.error("Failed to send tracking data:", error);
        }
    }
    dispose() {
        this.stopTracking();
        ActivityTracker._instance = undefined;
    }
}
exports.ActivityTracker = ActivityTracker;
//# sourceMappingURL=ActivityTracker.js.map