import * as vscode from "vscode";
import { ProjectDetector } from "./utils/ProjectDetector";
import { StorageService } from "./services/StorageService";
import { ActivityTracker } from "./utils/ActivityTracker";
import { MainPanel } from "./panels/MainPanel";

export function activate(context: vscode.ExtensionContext) {
  console.log("Just Juggle extension is now active!");

  // Initialize storage service
  StorageService.initialize(context);

  // Debug ProjectDetector immediately on activation
  const projectDetector = new ProjectDetector();
  const projectName = projectDetector.getProjectName();

  console.log("Current project name:", projectName);

  // Register commands
  const helloWorldCommand = vscode.commands.registerCommand(
    "just-juggle.helloWorld",
    () => {
      vscode.window.showInformationMessage(`Hello from ${projectName}!`);
    },
  );

  const openPanelCommand = vscode.commands.registerCommand(
    "just-juggle.openPanel",
    () => {
      MainPanel.createOrShow(context.extensionUri);
    },
  );

  const setProjectNameCommand = vscode.commands.registerCommand(
    "just-juggle.setProjectName",
    async () => {
      const currentName = projectDetector.getProjectName();
      const detectedName = projectDetector.getDetectedProjectName();

      const newName = await vscode.window.showInputBox({
        prompt: "Enter project name",
        value: currentName,
        placeHolder: `Detected: ${detectedName}`,
      });

      if (newName !== undefined && newName.trim() !== "") {
        projectDetector.setProjectName(newName.trim());
        vscode.window.showInformationMessage(
          `Project name set to: ${newName.trim()}`,
        );
      }
    },
  );

  const resetProjectNameCommand = vscode.commands.registerCommand(
    "just-juggle.resetProjectName",
    () => {
      projectDetector.resetProjectName();
      const detectedName = projectDetector.getDetectedProjectName();
      vscode.window.showInformationMessage(
        `Project name reset to: ${detectedName}`,
      );
    },
  );

  const getProjectNameCommand = vscode.commands.registerCommand(
    "just-juggle.getProjectName",
    () => {
      const current = projectDetector.getProjectName();
      const detected = projectDetector.getDetectedProjectName();
      const stored = StorageService.instance.getProjectName();

      vscode.window.showInformationMessage(
        `Current: ${current} | Detected: ${detected} | Stored: ${stored || "None"}`,
      );
    },
  );

  // Activity tracking commands
  ActivityTracker.instance.startTracking();

  // Auto-start tracking if API key is configured
  if (StorageService.instance.hasApiKey()) {
    console.log("API key found, auto-starting activity tracking...");
    ActivityTracker.instance.startTracking();
  }

  context.subscriptions.push(
    helloWorldCommand,
    openPanelCommand,
    setProjectNameCommand,
    resetProjectNameCommand,
    getProjectNameCommand,
  );
}

export function deactivate() {
  console.log("Deactivating Just Juggle extension...");
  ActivityTracker.instance.dispose();
}
