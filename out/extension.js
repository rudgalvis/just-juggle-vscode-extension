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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const ProjectDetector_1 = require("./utils/ProjectDetector");
const StorageService_1 = require("./services/StorageService");
const ActivityTracker_1 = require("./utils/ActivityTracker");
const MainPanel_1 = require("./panels/MainPanel");
function activate(context) {
    console.log("Just Juggle extension is now active!");
    // Initialize storage service
    StorageService_1.StorageService.initialize(context);
    // Debug ProjectDetector immediately on activation
    const projectDetector = new ProjectDetector_1.ProjectDetector();
    const projectName = projectDetector.getProjectName();
    console.log("Current project name:", projectName);
    // Register commands
    const helloWorldCommand = vscode.commands.registerCommand("just-juggle.helloWorld", () => {
        vscode.window.showInformationMessage(`Hello from ${projectName}!`);
    });
    const openPanelCommand = vscode.commands.registerCommand("just-juggle.openPanel", () => {
        MainPanel_1.MainPanel.createOrShow(context.extensionUri);
    });
    const setProjectNameCommand = vscode.commands.registerCommand("just-juggle.setProjectName", async () => {
        const currentName = projectDetector.getProjectName();
        const detectedName = projectDetector.getDetectedProjectName();
        const newName = await vscode.window.showInputBox({
            prompt: "Enter project name",
            value: currentName,
            placeHolder: `Detected: ${detectedName}`,
        });
        if (newName !== undefined && newName.trim() !== "") {
            projectDetector.setProjectName(newName.trim());
            vscode.window.showInformationMessage(`Project name set to: ${newName.trim()}`);
        }
    });
    const resetProjectNameCommand = vscode.commands.registerCommand("just-juggle.resetProjectName", () => {
        projectDetector.resetProjectName();
        const detectedName = projectDetector.getDetectedProjectName();
        vscode.window.showInformationMessage(`Project name reset to: ${detectedName}`);
    });
    const getProjectNameCommand = vscode.commands.registerCommand("just-juggle.getProjectName", () => {
        const current = projectDetector.getProjectName();
        const detected = projectDetector.getDetectedProjectName();
        const stored = StorageService_1.StorageService.instance.getProjectName();
        vscode.window.showInformationMessage(`Current: ${current} | Detected: ${detected} | Stored: ${stored || "None"}`);
    });
    // Activity tracking commands
    ActivityTracker_1.ActivityTracker.instance.startTracking();
    // Auto-start tracking if API key is configured
    if (StorageService_1.StorageService.instance.hasApiKey()) {
        console.log("API key found, auto-starting activity tracking...");
        ActivityTracker_1.ActivityTracker.instance.startTracking();
    }
    context.subscriptions.push(helloWorldCommand, openPanelCommand, setProjectNameCommand, resetProjectNameCommand, getProjectNameCommand);
}
function deactivate() {
    console.log("Deactivating Just Juggle extension...");
    ActivityTracker_1.ActivityTracker.instance.dispose();
}
//# sourceMappingURL=extension.js.map