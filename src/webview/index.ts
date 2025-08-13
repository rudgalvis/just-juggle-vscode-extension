export function getHtmlContent(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Just Juggle</title>
    <style>
        ${getCssStyles()}
    </style>
</head>
<body>
    ${getBodyContent()}
    <script>
        ${getJavaScript()}
    </script>
</body>
</html>`;
}

function getCssStyles(): string {
  return `
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
        }
        .section {
            margin-bottom: 20px;
            padding: 15px;
            max-width: 500px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
        }
        .section h3 {
            margin-top: 0;
            color: var(--vscode-textLink-foreground);
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
        }
        .section h3 span {
          margin-right: auto;
        }
        .section h3:hover {
            opacity: 0.8;
        }
        .section.collapsible h3::after {
            content: '▼';
            transition: transform 0.2s;
            font-size: 12px;
            margin-left: 8px;
        }
        .section.collapsed h3::after {
            transform: rotate(-180deg);
        }
        .section.collapsed .section-content {
            display: none;
        }
        .section.collapsed {
            padding-bottom: 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            align-items: center;
        }
        .label {
            font-weight: bold;
            color: var(--vscode-descriptionForeground);
        }
        .value {
            color: var(--vscode-foreground);
        }
        .status-badge {
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 8px;
        }
        .status-badge.required {
            background-color: #d73a49;
            color: white;
        }
        .status-badge.active, .status-badge.approved {
            background-color: #28a745;
            color: white;
        }
        .status-badge.override, .status-badge.custom {
            background-color: #007acc;
            color: white;
        }
        .status-badge.dev {
            background-color: #007acc;
            color: white;
        }
        .global-info {
            background-color: var(--vscode-editorWidget-background);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 12px;
            border-left: 3px solid var(--vscode-editorInfo-foreground);
        }
        .project-name-highlight {
            background-color: var(--vscode-editor-selectionBackground);
            padding: 12px;
            border-radius: 6px;
            border: 2px solid var(--vscode-textLink-foreground);
            margin: 12px 0;
        }
        .project-name-value {
            font-size: 18px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
            margin-bottom: 4px;
        }
        .project-name-subtitle {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            font-style: italic;
        }
        input[type="text"], input[type="password"], input[type="url"] {
            width: 100%;
            padding: 8px;
            margin: 8px 0;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 2px;
            box-sizing: border-box;
        }
        input[type="text"]:focus, input[type="password"]:focus, input[type="url"]:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 15px;
            border-radius: 2px;
            cursor: pointer;
            margin-right: 8px;
            margin-top: 8px;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        button.secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        button.secondary:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        button.danger {
            background-color: var(--vscode-errorForeground);
            color: white;
        }
        button.danger:hover {
            background-color: var(--vscode-errorForeground);
            opacity: 0.8;
        }
        .description {
            font-size: 14px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 12px;
        }
        .api-key-display, .endpoint-display {
            font-family: monospace;
            background-color: var(--vscode-textBlockQuote-background);
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            word-break: break-all;
        }
        .dev-section {
            border-color: var(--vscode-editorInfo-foreground);
            background-color: var(--vscode-editorInfo-background);
            opacity: 0.9;
        }
        .toggle-container {
            display: flex;
            align-items: center;
            margin: 12px 0;
        }
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
            margin-right: 12px;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--vscode-input-background);
            transition: .4s;
            border-radius: 24px;
            border: 1px solid var(--vscode-input-border);
        }
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 2px;
            bottom: 2px;
            background-color: var(--vscode-foreground);
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .toggle-slider {
            background-color: var(--vscode-button-background);
        }
        input:checked + .toggle-slider:before {
            transform: translateX(26px);
        }
    `;
}

function getBodyContent(): string {
  return `
        <div class="section collapsible" id="apiConfigSection">
            <h3 onclick="toggleSection('apiConfigSection')">
                API Configuration
                <span class="status-badge" id="apiConfigBadge">Loading...</span>
            </h3>
            
            <div class="section-content">       
                <div class="info-row" id="apiKeyDisplayRow" style="display: none;">
                    <span class="label">Current Key:</span>
                    <span class="value api-key-display" id="apiKeyDisplay"></span>
                </div>
                
                <div class="description">
                    Your API key is stored globally and will be used across all projects. 
                    Get your API key from <a href="https://just-juggle.com" target="_blank">just-juggle.com</a>.
                </div>
                
                <input type="password" id="apiKeyInput" placeholder="Enter your API key...">
                <div>
                    <button onclick="setApiKey()">Save API Key</button>
                    <button class="danger" onclick="clearApiKey()" id="clearApiKeyBtn" style="display: none;">Clear API Key</button>
                </div>
            </div>
        </div>

        <div class="section">
            <h3>
              Project Tracking 
              <span class="status-badge override"  id="currentProjectBadge">
                <span id="currentProjectName">Loading...</span>
              </span>
            </h3>
            
            <div class="info-row">
                <span class="label">Auto-Detected Name:</span>
                <span class="value" id="detectedName">Loading...</span>
            </div>
            
             <div class="description">
                Set a custom name for this project. This will override the auto-detected name and persist for this workspace only.
            </div>
            <input type="text" id="projectNameInput" placeholder="Enter custom project name...">
            <div>
                <button onclick="setProjectName()">Set Custom Name</button>
                <button class="secondary" onclick="resetProjectName()">Reset to Auto-Detect</button>
            </div>
        </div>
        
        <div class="toggle-container">
            <label class="toggle-switch">
                <input type="checkbox" id="devModeToggle" onchange="toggleDevelopmentMode()">
                <span class="toggle-slider"></span>
            </label>
            <span class="label">Development Mode</span>
        </div>
        
        
        <div class="section dev-section" id="endpointSection" style="display: none;">
            <h3>API Endpoint Configuration <span class="status-badge dev">DEV</span></h3>
            <div class="info-row">
                <span class="label">Current Endpoint:</span>
                <span class="value endpoint-display" id="currentEndpoint">Loading...</span>
            </div>
            <div class="info-row">
                <span class="label">Status:</span>
                <span class="value" id="endpointStatus">Loading...</span>
            </div>
            
            <div class="description">
                Override the default API endpoint for development purposes. Use localhost for local development or custom endpoints for self-hosted instances.
            </div>
            
            <input type="url" id="endpointInput" placeholder="e.g., http://localhost:3000 or https://api.example.com">
            <div>
                <button onclick="setEndpoint()">Save Endpoint</button>
                <button class="secondary" onclick="clearEndpoint()" id="clearEndpointBtn" style="display: none;">Reset to Default</button>
            </div>
        </div>
    `;
}

function getJavaScript(): string {
  return `
        const vscode = acquireVsCodeApi();

        vscode.postMessage({ command: 'getAllInfo' });

        window.addEventListener('message', event => {
            const message = event.data;
            
            if (message.command === 'updateAllInfo') {
                updateAllInfo(message.data);
            }
        });

        function toggleSection(sectionId) {
            const section = document.getElementById(sectionId);
            section.classList.toggle('collapsed');
        }

        function updateAllInfo(data) {
            // Update development mode
            updateDevelopmentMode(data);
            
            // Update API key info
            updateApiKeyInfo(data);
            
            // Update API endpoint info
            updateEndpointInfo(data);
            
            // Update project info
            updateProjectInfo(data);
        }

        function updateDevelopmentMode(data) {
            const devToggle = document.getElementById('devModeToggle');
            const endpointSection = document.getElementById('endpointSection');
            
            devToggle.checked = data.isDevelopmentMode;
            endpointSection.style.display = data.isDevelopmentMode ? 'block' : 'none';
        }

        function updateApiKeyInfo(data) {
            const configBadge = document.getElementById('apiConfigBadge');
            const displayRow = document.getElementById('apiKeyDisplayRow');
            const displayElement = document.getElementById('apiKeyDisplay');
            const clearBtn = document.getElementById('clearApiKeyBtn');
            const apiSection = document.getElementById('apiConfigSection');
            
            if (data.hasApiKey) {
                configBadge.textContent = 'CONNECTED';
                configBadge.className = 'status-badge active';
                displayRow.style.display = 'flex';
                displayElement.textContent = data.apiKeyMasked;
                clearBtn.style.display = 'inline-block';
                // Collapse section if API key is configured
                apiSection.classList.add('collapsed');
            } else {
                configBadge.textContent = 'REQUIRED';
                configBadge.className = 'status-badge required';
                displayRow.style.display = 'none';
                clearBtn.style.display = 'none';
                // Keep section open if API key is not configured
                apiSection.classList.remove('collapsed');
            }
        }

        function updateEndpointInfo(data) {
            const currentEndpoint = document.getElementById('currentEndpoint');
            const endpointStatus = document.getElementById('endpointStatus');
            const clearBtn = document.getElementById('clearEndpointBtn');
            const endpointInput = document.getElementById('endpointInput');
            
            currentEndpoint.textContent = data.apiEndpoint;
            
            if (data.hasCustomEndpoint) {
                endpointStatus.innerHTML = 'Custom <span class="status-badge override">OVERRIDE</span>';
                clearBtn.style.display = 'inline-block';
                endpointInput.placeholder = 'Enter custom API endpoint...';
            } else {
                endpointStatus.innerHTML = 'Default <span class="status-badge active">ACTIVE</span>';
                clearBtn.style.display = 'none';
                endpointInput.placeholder = 'e.g., http://localhost:3000 or https://api.example.com';
            }
        }

        function updateProjectInfo(data) {
            const projectBadge = document.getElementById('currentProjectBadge');
            
            document.getElementById('currentProjectName').textContent = data.currentName;
            document.getElementById('detectedName').textContent = data.detectedName;
            
            if (data.isProjectOverridden) {
                document.getElementById('projectNameInput').value = data.storedName;
            } else {
                document.getElementById('projectNameInput').value = '';
            }
        }

        function toggleDevelopmentMode() {
            const isEnabled = document.getElementById('devModeToggle').checked;
            vscode.postMessage({
                command: 'toggleDevelopmentMode',
                enabled: isEnabled
            });
        }

        function setApiKey() {
            const input = document.getElementById('apiKeyInput');
            const apiKey = input.value.trim();
            
            if (apiKey) {
                vscode.postMessage({
                    command: 'setApiKey',
                    apiKey: apiKey
                });
                input.value = ''; // Clear input for security
            } else {
                alert('Please enter an API key');
            }
        }

        function clearApiKey() {
            vscode.postMessage({ command: 'clearApiKey' });
        }

        function setEndpoint() {
            const input = document.getElementById('endpointInput');
            const endpoint = input.value.trim();
            
            if (endpoint) {
                vscode.postMessage({
                    command: 'setApiEndpoint',
                    endpoint: endpoint
                });
                input.value = '';
            } else {
                alert('Please enter an API endpoint');
            }
        }

        function clearEndpoint() {
            vscode.postMessage({ command: 'clearApiEndpoint' });
        }

        function setProjectName() {
            const input = document.getElementById('projectNameInput');
            const projectName = input.value.trim();
            
            if (projectName) {
                vscode.postMessage({
                    command: 'setProjectName',
                    projectName: projectName
                });
            } else {
                alert('Please enter a project name');
            }
        }

        function resetProjectName() {
            vscode.postMessage({ command: 'resetProjectName' });
        }

        // Allow Enter key to save API key
        document.getElementById('apiKeyInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                setApiKey();
            }
        });

        // Allow Enter key to save endpoint
        document.getElementById('endpointInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                setEndpoint();
            }
        });

        // Allow Enter key to set project name
        document.getElementById('projectNameInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                setProjectName();
            }
        });
    `;
}
