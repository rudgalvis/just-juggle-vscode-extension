import * as vscode from 'vscode';
import { ProjectDetector } from '../utils/ProjectDetector';
import { StorageService } from '../services/StorageService';
import { getHtmlContent } from '../webview';

export class MainPanel {
	public static currentPanel: MainPanel | undefined;
	public static readonly viewType = 'justJugglePanel';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];
	private _projectDetector: ProjectDetector;

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		if (MainPanel.currentPanel) {
			MainPanel.currentPanel._panel.reveal(column);
			return;
		}

		const panel = vscode.window.createWebviewPanel(
			MainPanel.viewType,
			'Just Juggle',
			column || vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
			}
		);

		MainPanel.currentPanel = new MainPanel(panel, extensionUri);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;
		this._projectDetector = new ProjectDetector();

		this._setupWebview();
		this._setupEventHandlers();
	}

	private _setupWebview() {
		this._panel.webview.html = getHtmlContent();
		this._sendAllInfo();
	}

	private _setupEventHandlers() {
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		this._panel.webview.onDidReceiveMessage(
			message => this._handleMessage(message),
			null,
			this._disposables
		);
	}

	private _handleMessage(message: any) {
		switch (message.command) {
			case 'setProjectName':
				this._handleSetProjectName(message.projectName);
				break;
			case 'resetProjectName':
				this._handleResetProjectName();
				break;
			case 'setApiKey':
				this._handleSetApiKey(message.apiKey);
				break;
			case 'clearApiKey':
				this._handleClearApiKey();
				break;
			case 'setApiEndpoint':
				this._handleSetApiEndpoint(message.endpoint);
				break;
			case 'clearApiEndpoint':
				this._handleClearApiEndpoint();
				break;
			case 'toggleDevelopmentMode':
				this._handleToggleDevelopmentMode(message.enabled);
				break;
			case 'getAllInfo':
				this._sendAllInfo();
				break;
		}
	}

	private _handleSetProjectName(projectName: string) {
		if (projectName && projectName.trim() !== '') {
			this._projectDetector.setProjectName(projectName.trim());
			this._sendAllInfo();
			vscode.window.showInformationMessage(`Project name set to: ${projectName.trim()}`);
		}
	}

	private _handleResetProjectName() {
		this._projectDetector.resetProjectName();
		this._sendAllInfo();
		const detectedName = this._projectDetector.getDetectedProjectName();
		vscode.window.showInformationMessage(`Project name reset to: ${detectedName}`);
	}

	private _handleSetApiKey(apiKey: string) {
		if (apiKey && apiKey.trim() !== '') {
			StorageService.instance.setApiKey(apiKey.trim());
			this._sendAllInfo();
			vscode.window.showInformationMessage('API key saved successfully!');
		} else {
			vscode.window.showErrorMessage('Please enter a valid API key');
		}
	}

	private _handleClearApiKey() {
		StorageService.instance.clearApiKey();
		this._sendAllInfo();
		vscode.window.showInformationMessage('API key cleared');
	}

	private _handleSetApiEndpoint(endpoint: string) {
		if (endpoint && endpoint.trim() !== '') {
			const cleanEndpoint = endpoint.trim();
			if (this._isValidUrl(cleanEndpoint)) {
				StorageService.instance.setApiEndpoint(cleanEndpoint);
				this._sendAllInfo();
				vscode.window.showInformationMessage(`API endpoint set to: ${cleanEndpoint}`);
			} else {
				vscode.window.showErrorMessage('Please enter a valid URL (e.g., http://localhost:3000 or https://api.example.com)');
			}
		} else {
			vscode.window.showErrorMessage('Please enter a valid API endpoint');
		}
	}

	private _handleClearApiEndpoint() {
		StorageService.instance.clearApiEndpoint();
		this._sendAllInfo();
		const defaultEndpoint = StorageService.instance.getDefaultApiEndpoint();
		vscode.window.showInformationMessage(`API endpoint reset to default: ${defaultEndpoint}`);
	}

	private _handleToggleDevelopmentMode(enabled: boolean) {
		StorageService.instance.setDevelopmentMode(enabled);
		this._sendAllInfo();
		vscode.window.showInformationMessage(`Development mode ${enabled ? 'enabled' : 'disabled'}`);
	}

	private _isValidUrl(url: string): boolean {
		try {
			new URL(url);
			return url.startsWith('http://') || url.startsWith('https://');
		} catch {
			return false;
		}
	}

	private _sendAllInfo() {
		// Project info
		const current = this._projectDetector.getProjectName();
		const detected = this._projectDetector.getDetectedProjectName();
		const stored = StorageService.instance.getProjectName();

		// API key info
		const apiKey = StorageService.instance.getApiKey();
		const hasApiKey = StorageService.instance.hasApiKey();

		// API endpoint info
		const apiEndpoint = StorageService.instance.getApiEndpoint();
		const hasCustomEndpoint = StorageService.instance.hasCustomApiEndpoint();
		const defaultEndpoint = StorageService.instance.getDefaultApiEndpoint();

		// Development mode
		const isDevelopmentMode = StorageService.instance.isDevelopmentMode();

		this._panel.webview.postMessage({
			command: 'updateAllInfo',
			data: {
				// Project data
				currentName: current,
				detectedName: detected,
				storedName: stored,
				isProjectOverridden: !!stored,
				// API key data
				hasApiKey: hasApiKey,
				apiKeyMasked: apiKey ? this._maskApiKey(apiKey) : null,
				// API endpoint data
				apiEndpoint: apiEndpoint,
				hasCustomEndpoint: hasCustomEndpoint,
				defaultEndpoint: defaultEndpoint,
				// Development mode
				isDevelopmentMode: isDevelopmentMode
			}
		});
	}

	private _maskApiKey(apiKey: string): string {
		if (apiKey.length <= 8) {
			return '***' + apiKey.slice(-2);
		}
		return apiKey.slice(0, 4) + '***' + apiKey.slice(-4);
	}

	public dispose() {
		MainPanel.currentPanel = undefined;
		this._panel.dispose();

		while (this._disposables.length) {
			const disposable = this._disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}
	}
}