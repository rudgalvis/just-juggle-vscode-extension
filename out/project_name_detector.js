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
exports.ProjectDetector = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
class ProjectDetector {
    getProjectName() {
        // Try to get project name from workspace
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            // If there's a workspace file, use its name
            if (vscode.workspace.name) {
                return vscode.workspace.name;
            }
            // Otherwise, use the root folder name
            const workspaceFolder = vscode.workspace.workspaceFolders[0];
            const folderName = path.basename(workspaceFolder.uri.fsPath);
            return folderName;
        }
        // Fallback: try to get from active editor's file path
        if (vscode.window.activeTextEditor) {
            const filePath = vscode.window.activeTextEditor.document.uri.fsPath;
            const segments = filePath.split(path.sep);
            // Look for common project indicators
            for (let i = segments.length - 1; i >= 0; i--) {
                const segment = segments[i];
                // Skip common non-project folders
                if (!this._isCommonSubFolder(segment)) {
                    return segment;
                }
            }
        }
        return 'Current Project';
    }
    _isCommonSubFolder(folderName) {
        const commonSubFolders = [
            'src', 'lib', 'components', 'pages', 'utils', 'types',
            'assets', 'public', 'dist', 'build', 'node_modules',
            'styles', 'css', 'js', 'ts', 'images', 'img'
        ];
        return commonSubFolders.includes(folderName.toLowerCase());
    }
}
exports.ProjectDetector = ProjectDetector;
//# sourceMappingURL=project_name_detector.js.map