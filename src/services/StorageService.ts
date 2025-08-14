import * as vscode from "vscode";

const VERBOSE = false;

export class StorageService {
  private static _instance: StorageService;
  private _context: vscode.ExtensionContext;

  // Default production endpoint
  private static readonly DEFAULT_API_ENDPOINT = "https://api.just-juggle.com";

  private constructor(context: vscode.ExtensionContext) {
    this._context = context;
  }

  public static initialize(context: vscode.ExtensionContext) {
    StorageService._instance = new StorageService(context);
  }

  public static get instance(): StorageService {
    if (!StorageService._instance) {
      throw new Error(
        "StorageService not initialized. Call initialize() first.",
      );
    }
    return StorageService._instance;
  }

  private _getWorkspaceKey(): string | null {
    if (
      vscode.workspace.workspaceFolders &&
      vscode.workspace.workspaceFolders.length > 0
    ) {
      return vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
    return null;
  }

  // Project Name Storage (workspace-specific)
  public getProjectName(): string | null {
    const workspaceKey = this._getWorkspaceKey();
    if (!workspaceKey) {
      return null;
    }

    const projectName = this._context.workspaceState.get(
      `projectName_${workspaceKey}`,
    ) as string | undefined;
    return projectName || null;
  }

  public setProjectName(projectName: string): void {
    const workspaceKey = this._getWorkspaceKey();
    if (!workspaceKey) {
      return;
    }

    this._context.workspaceState.update(
      `projectName_${workspaceKey}`,
      projectName,
    );
    if (VERBOSE) {
      console.log(
        `Stored project name "${projectName}" for workspace: ${workspaceKey}`,
      );
    }
  }

  public clearProjectName(): void {
    const workspaceKey = this._getWorkspaceKey();
    if (!workspaceKey) {
      return;
    }

    this._context.workspaceState.update(
      `projectName_${workspaceKey}`,
      undefined,
    );
    if (VERBOSE) {
      console.log(`Cleared project name for workspace: ${workspaceKey}`);
    }
  }

  // API Key Storage (global)
  public getApiKey(): string | null {
    const apiKey = this._context.globalState.get("justJuggle_apiKey") as
      | string
      | undefined;
    return apiKey || null;
  }

  public setApiKey(apiKey: string): void {
    this._context.globalState.update("justJuggle_apiKey", apiKey);
    if (VERBOSE) {
      console.log("API key stored globally");
    }
  }

  public clearApiKey(): void {
    this._context.globalState.update("justJuggle_apiKey", undefined);
    if (VERBOSE) {
      console.log("API key cleared");
    }
  }

  public hasApiKey(): boolean {
    return !!this.getApiKey();
  }

  // API Endpoint Storage (global)
  public getApiEndpoint(): string {
    const customEndpoint = this._context.globalState.get(
      "justJuggle_apiEndpoint",
    ) as string | undefined;
    return customEndpoint || StorageService.DEFAULT_API_ENDPOINT;
  }

  public setApiEndpoint(endpoint: string): void {
    // Clean up endpoint (remove trailing slash)
    const cleanEndpoint = endpoint.replace(/\/$/, "");
    this._context.globalState.update("justJuggle_apiEndpoint", cleanEndpoint);
    if (VERBOSE) {
      console.log("API endpoint stored globally:", cleanEndpoint);
    }
  }

  public clearApiEndpoint(): void {
    this._context.globalState.update("justJuggle_apiEndpoint", undefined);
    if (VERBOSE) {
      console.log("API endpoint cleared, using default");
    }
  }

  public hasCustomApiEndpoint(): boolean {
    const customEndpoint = this._context.globalState.get(
      "justJuggle_apiEndpoint",
    ) as string | undefined;
    return !!customEndpoint;
  }

  public getDefaultApiEndpoint(): string {
    return StorageService.DEFAULT_API_ENDPOINT;
  }

  // Development Mode Toggle
  public isDevelopmentMode(): boolean {
    const devMode = this._context.globalState.get("justJuggle_devMode") as
      | boolean
      | undefined;
    return devMode || false;
  }

  public setDevelopmentMode(enabled: boolean): void {
    this._context.globalState.update("justJuggle_devMode", enabled);
    if (VERBOSE) {
      console.log("Development mode:", enabled ? "enabled" : "disabled");
    }
  }
}
