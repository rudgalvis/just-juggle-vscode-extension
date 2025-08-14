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
exports.ProjectDetector = exports.DEFAULT_PROJECT_NAME = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const StorageService_1 = require("../services/StorageService");
const VERBOSE = false;
exports.DEFAULT_PROJECT_NAME = "vscode-code-no-folder-open";
class ProjectDetector {
    getProjectName() {
        // First, check if user has overridden the project name
        const storedProjectName = StorageService_1.StorageService.instance.getProjectName();
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
    _detectProjectName() {
        // Try to get project name from workspace
        if (vscode.workspace.workspaceFolders &&
            vscode.workspace.workspaceFolders.length > 0) {
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
        return exports.DEFAULT_PROJECT_NAME;
    }
    setProjectName(projectName) {
        StorageService_1.StorageService.instance.setProjectName(projectName);
        if (VERBOSE) {
            console.log("Project name updated to:", projectName);
        }
    }
    resetProjectName() {
        StorageService_1.StorageService.instance.clearProjectName();
        if (VERBOSE) {
            console.log("Project name reset to auto-detection");
        }
    }
    getDetectedProjectName() {
        return this._detectProjectName();
    }
    _isCommonSubFolder(folderName) {
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
exports.ProjectDetector = ProjectDetector;
//# sourceMappingURL=ProjectDetector.js.map