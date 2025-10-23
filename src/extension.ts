import * as vscode from "vscode";
import z from "zod";

const ConfigSchema = z.object({
	numLeftTabs: z.number(),
	numMaxTabs: z.number(),
	delayMs: z.number(),
});
type Config = z.infer<typeof ConfigSchema>;

const getConfig = (): Config => {
	const config = vscode.workspace.getConfiguration("auto-tab-closer");
	return ConfigSchema.parse({
		numLeftTabs: config.get<number>("numLeftTabs", 3),
		numMaxTabs: config.get<number>("numMaxTabs", 10),
		delayMs: config.get<number>("delayMs", 1000),
	});
};

const debounce = (func: () => void, delayMs: number) => {
	let timeout: NodeJS.Timeout;
	return () => {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			func();
		}, delayMs);
	};
};

const findNormalTabStartIndex = () => {
	const activeTabGroup = vscode.window.tabGroups.activeTabGroup;
	return activeTabGroup.tabs.findIndex((t) => !t.isPinned);
};

const findActiveTabIndex = () => {
	const activeTabGroup = vscode.window.tabGroups.activeTabGroup;
	return activeTabGroup.tabs.findIndex((t) => t.isActive);
};

const moveTabToNormalFirstIfNecessary = async () => {
	const { numLeftTabs } = getConfig();

	// find active editor index excluding pinned and preview tabs
	const normalTabStartIndex = findNormalTabStartIndex();
	const activeTabIndex = findActiveTabIndex();
	if (activeTabIndex - normalTabStartIndex < numLeftTabs) {
		return;
	}

	await vscode.commands.executeCommand("moveActiveEditor", {
		to: "position",
		value: normalTabStartIndex + 1, // 1-indexed
	});
};

const removeExcessTabs = async () => {
	const { numMaxTabs } = getConfig();

	const activeTabGroup = vscode.window.tabGroups.activeTabGroup;
	const normalTabs = activeTabGroup.tabs.filter((t) => !t.isPinned);
	if (normalTabs.length <= numMaxTabs) {
		return;
	}

	const tabsToClose = normalTabs.filter(
		(t, index) => !t.isPinned && !t.isDirty && index >= numMaxTabs,
	);

	for (const tab of tabsToClose) {
		await vscode.window.tabGroups.close(tab);
	}
};

const organizeTabs = async () => {
	await moveTabToNormalFirstIfNecessary();
	await removeExcessTabs();
};

export function activate(context: vscode.ExtensionContext) {
	const { delayMs } = getConfig();

	const debouncedOrganizeTabs = debounce(organizeTabs, delayMs);
	const disposable = vscode.window.tabGroups.onDidChangeTabs((_) => {
		debouncedOrganizeTabs();
	});

	// Initial organization on activation
	void organizeTabs();

	context.subscriptions.push(disposable);
}

export function deactivate() {}
