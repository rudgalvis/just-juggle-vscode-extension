import * as vscode from "vscode";
import { StorageService } from "../services/StorageService";
import { ProjectDetector } from "./ProjectDetector";

const VERBOSE = false;

export class ActivityTracker {
  private static _instance: ActivityTracker;
  private _isActive: boolean = false;
  private _disposables: vscode.Disposable[] = [];
  private _projectDetector: ProjectDetector;
  private _debounceTimer: NodeJS.Timeout | undefined;
  private readonly _debounceDelay = 5000; // 5 seconds

  private constructor() {
    this._logActivity = this._logActivity.bind(this);

    this._projectDetector = new ProjectDetector();
  }

  public static get instance(): ActivityTracker {
    if (!ActivityTracker._instance) {
      ActivityTracker._instance = new ActivityTracker();
    }
    return ActivityTracker._instance;
  }

  public startTracking(): void {
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

  public stopTracking(): void {
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

  private _setupEventListeners(): void {
    // Listen to text document changes (typing)
    const textChangeListener = vscode.workspace.onDidChangeTextDocument(
      (event) => {
        if (event.contentChanges.length > 0) {
          this._logActivity();
        }
      },
    );

    // Listen to active editor changes (switching files)
    const editorChangeListener = vscode.window.onDidChangeActiveTextEditor(
      (editor) => {
        if (editor) {
          this._logActivity();
        }
      },
    );

    // Listen to selection changes (cursor movement)
    const selectionChangeListener =
      vscode.window.onDidChangeTextEditorSelection(this._logActivity);

    // Listen to visible range changes (scrolling)
    const visibleRangeListener =
      vscode.window.onDidChangeTextEditorVisibleRanges(this._logActivity);

    // Listen to workspace folder changes
    const workspaceChangeListener =
      vscode.workspace.onDidChangeWorkspaceFolders(this._logActivity);

    // Listen to configuration changes
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(
      this._logActivity,
    );

    this._disposables.push(
      textChangeListener,
      editorChangeListener,
      selectionChangeListener,
      visibleRangeListener,
      workspaceChangeListener,
      configChangeListener,
    );

    if (VERBOSE) {
      console.log("Activity event listeners registered");
    }
  }

  private _cleanupEventListeners(): void {
    this._disposables.forEach((disposable) => disposable.dispose());
    this._disposables = [];
    if (VERBOSE) {
      console.log("Activity event listeners cleaned up");
    }
  }

  private _logActivity(): void {
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
  private async _sendTrackingData(): Promise<void> {
    const apiKey = StorageService.instance.getApiKey();
    const apiEndpoint = StorageService.instance.getApiEndpoint();
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
      } catch (e) {}
      return;
    }

    if (VERBOSE) {
      console.log("Log accepted");
    }
  }

  // Future: Actual API call implementation
  private async _makeApiRequest(endpoint: string, payload: any): Promise<void> {
    try {
      // This would be the actual implementation
      if (VERBOSE) {
        console.log(`Making API request to ${endpoint}`, payload);
      }
    } catch (error) {
      console.error("Failed to send tracking data:", error);
    }
  }

  public dispose(): void {
    this.stopTracking();
    ActivityTracker._instance = undefined as any;
  }
}
