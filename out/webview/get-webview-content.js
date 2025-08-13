"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewContent = getWebviewContent;
function getWebviewContent(webview) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Just Juggle Panel</title>
        <style>
            ${getStyles()}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Just Juggle Time Tracking</h1>
            
            <div class="input-group">
                <label for="projectInput">
                    Project Name:
                    <button class="refresh-btn" id="refreshProjectBtn" title="Refresh project name">↻</button>
                </label>
                <input type="text" id="projectInput" placeholder="Loading project name..." />
                <div class="project-info" id="projectInfo">Auto-detected from workspace</div>
            </div>
            
            <div class="input-group">
                <label for="taskInput">Task Description:</label>
                <input type="text" id="taskInput" placeholder="Enter task description..." />
            </div>
            
            <button id="submitBtn">Submit</button>
            <button id="clearBtn">Clear</button>
            
            <div class="output" id="output">
                Output will appear here...
            </div>
        </div>

        <script>
            ${getScript()}
        </script>
    </body>
    </html>`;
}
function getStyles() {
    return `
        body {
            font-family: var(--vscode-font-family);
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
        }
        .input-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"] {
            width: 100%;
            padding: 8px 12px;
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            color: var(--vscode-input-foreground);
            border-radius: 2px;
            font-size: 14px;
            box-sizing: border-box;
        }
        input[type="text"]:focus {
            outline: none;
            border: 1px solid var(--vscode-focusBorder);
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .refresh-btn {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            font-size: 12px;
            padding: 4px 8px;
            margin-left: 8px;
        }
        .refresh-btn:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        .project-info {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-top: 4px;
        }
        .output {
            margin-top: 20px;
            padding: 10px;
            background-color: var(--vscode-textCodeBlock-background);
            border-radius: 4px;
            font-family: var(--vscode-editor-font-family);
            white-space: pre-wrap;
            min-height: 100px;
        }
    `;
}
function getScript() {
    return `
        const vscode = acquireVsCodeApi();
        
        const projectInput = document.getElementById('projectInput');
        const taskInput = document.getElementById('taskInput');
        const submitBtn = document.getElementById('submitBtn');
        const clearBtn = document.getElementById('clearBtn');
        const refreshProjectBtn = document.getElementById('refreshProjectBtn');
        const projectInfo = document.getElementById('projectInfo');
        const output = document.getElementById('output');

        // Request initial project name
        vscode.postMessage({ command: 'requestProjectName' });

        // Handle messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'setProjectName':
                    projectInput.value = message.projectName;
                    projectInput.placeholder = message.projectName;
                    projectInfo.textContent = \`Auto-detected: \${message.projectName}\`;
                    break;
            }
        });

        // Refresh project name
        refreshProjectBtn.addEventListener('click', () => {
            projectInput.placeholder = "Refreshing...";
            projectInfo.textContent = "Refreshing project name...";
            vscode.postMessage({ command: 'requestProjectName' });
        });

        // Send input changes to extension
        projectInput.addEventListener('input', () => {
            vscode.postMessage({
                command: 'inputChanged',
                text: projectInput.value,
                type: 'project'
            });
        });

        taskInput.addEventListener('input', () => {
            vscode.postMessage({
                command: 'inputChanged',
                text: taskInput.value,
                type: 'task'
            });
        });

        // Handle submit button
        submitBtn.addEventListener('click', () => {
            const projectValue = projectInput.value.trim();
            const taskValue = taskInput.value.trim();
            
            if (projectValue || taskValue) {
                vscode.postMessage({
                    command: 'submitInput',
                    text: \`Project: \${projectValue}\\nTask: \${taskValue}\`,
                    project: projectValue,
                    task: taskValue
                });
                
                // Update output
                const timestamp = new Date().toLocaleTimeString();
                output.textContent = \`[\${timestamp}] Submitted:\\nProject: \${projectValue}\\nTask: \${taskValue}\`;
                
                // Clear task input but keep project name
                taskInput.value = '';
                taskInput.focus();
            } else {
                output.textContent = 'Please enter a project name or task description.';
            }
        });

        // Handle clear button
        clearBtn.addEventListener('click', () => {
            taskInput.value = '';
            output.textContent = 'Task cleared. Project name preserved.';
            taskInput.focus();
        });

        // Handle Enter key
        function handleEnterKey(event) {
            if (event.key === 'Enter') {
                submitBtn.click();
            }
        }
        
        projectInput.addEventListener('keypress', handleEnterKey);
        taskInput.addEventListener('keypress', handleEnterKey);

        // Focus on task input initially since project is pre-filled
        setTimeout(() => {
            if (taskInput.value === '') {
                taskInput.focus();
            }
        }, 100);
    `;
}
//# sourceMappingURL=get-webview-content.js.map