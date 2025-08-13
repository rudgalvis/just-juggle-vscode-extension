import * as vscode from "vscode";
import * as path from "path";
import { StorageService } from "../services/StorageService";

const VERBOSE = false;

export class ProjectDetector {
  public getProjectName(): string {
    if (VERBOSE) {
      console.log("ProjectDetector.getProjectName() called");
    }

    // First, check if user has overridden the project name
    const storedProjectName = StorageService.instance.getProjectName();
    if (storedProjectName) {
      if (VERBOSE) {
        console.log("Using stored project name:", storedProjectName);
      }
      return storedProjectName;
    }

    // If no override, detect from workspace
    const detectedName = this._detectProjectName();
    if (VERBOSE) {
      console.log("Detected project name:", detectedName);
    }
    return detectedName;
  }

  private _detectProjectName(): string {
    if (VERBOSE) {
      console.log(
        "workspace.workspaceFolders:",
        vscode.workspace.workspaceFolders,
      );
    }
    if (VERBOSE) {
      console.log("workspace.name:", vscode.workspace.name);
    }

    // Try to get project name from workspace
    if (
      vscode.workspace.workspaceFolders &&
      vscode.workspace.workspaceFolders.length > 0
    ) {
      // If there's a workspace file, use its name
      if (vscode.workspace.name) {
        if (VERBOSE) {
          console.log("Using workspace name:", vscode.workspace.name);
        }
        return vscode.workspace.name;
      }

      // Otherwise, use the root folder name
      const workspaceFolder = vscode.workspace.workspaceFolders[0];
      const folderName = path.basename(workspaceFolder.uri.fsPath);

      if (VERBOSE) {
        console.log("workspaceFolder.uri.fsPath:", workspaceFolder.uri.fsPath);
      }
      if (VERBOSE) {
        console.log("folderName:", folderName);
      }

      return folderName;
    }

    // Fallback: try to get from active editor's file path
    if (vscode.window.activeTextEditor) {
      const filePath = vscode.window.activeTextEditor.document.uri.fsPath;
      const segments = filePath.split(path.sep);

      if (VERBOSE) {
        console.log("Using active editor fallback");
        console.log("filePath:", filePath);
        console.log("segments:", segments);
      }

      // Look for common project indicators
      for (let i = segments.length - 1; i >= 0; i--) {
        const segment = segments[i];
        // Skip common non-project folders
        if (!this._isCommonSubFolder(segment)) {
          if (VERBOSE) {
            console.log("Found project segment:", segment);
          }
          return segment;
        }
      }
    }

    if (VERBOSE) {
      console.log("Falling back to default project name");
    }
    return "Current Project";
  }

  public setProjectName(projectName: string): void {
    StorageService.instance.setProjectName(projectName);
    if (VERBOSE) {
      console.log("Project name updated to:", projectName);
    }
  }

  public resetProjectName(): void {
    StorageService.instance.clearProjectName();
    if (VERBOSE) {
      console.log("Project name reset to auto-detection");
    }
  }

  public getDetectedProjectName(): string {
    return this._detectProjectName();
  }

  private _isCommonSubFolder(folderName: string): boolean {
    const commonSubFolders = [
      "src",
      "lib",
      "components",
      "pages",
      "utils",
      "types",
      "assets",
      "public",
      "dist",
      "build",
      "node_modules",
      "styles",
      "css",
      "js",
      "ts",
      "images",
      "img",
    ];

    return commonSubFolders.includes(folderName.toLowerCase());
  }
}
