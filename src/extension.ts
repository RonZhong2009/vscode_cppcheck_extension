// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cross_spawn from 'cross-spawn';
import * as child_process from 'child_process';

export function runCmd(params: string[], workspaceDir: string): child_process.SpawnSyncReturns<Buffer> {
	    let cmd = params.shift() || "echo";
	    
	    console.log('executing: ', cmd, params.join(' '));
	    return cross_spawn.sync(cmd, params, { 'cwd': workspaceDir });
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "cppcheck_lint" is now active!');

    let cmddisposable = vscode.commands.registerCommand('extension.cppcheck_lint', () => {
	        // The code you place here will be executed every time your command is executed
	        let oc = vscode.window.createOutputChannel("CppcheckOutput");
	        oc.appendLine("\nCurrent File's cppcheck report is:");

	//         let testarg: string [] = new Array("cppcheck","--enable=all");
			let testarg: string [] = new Array("echo");
	        
	        let curdoc = vscode.window.activeTextEditor!.document;
	        testarg.push(curdoc.fileName);
	        let result = runCmd(testarg, "");
			//TODO: check whether cppcheck has been installed on this machine

			//TODO: check whether this active document is cpp source file

			//
	        oc.append("ls result is:" + result.stdout+"\n");
	        oc.append("ls result stderror:\n" + result.stderr);

			// Display a message box to the user
			vscode.window.showInformationMessage('cppcheck started!');
	});

	context.subscriptions.push(cmddisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
