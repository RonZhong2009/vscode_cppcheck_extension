// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cross_spawn from 'cross-spawn';
import * as child_process from 'child_process';
// import * as parseString from 'xml2js';
import * as xpath from 'xpath';
import * as xmldom from 'xmldom';


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
		let oc = vscode.window.createOutputChannel("CppcheckOutput");
   		let cmddisposable = vscode.commands.registerCommand('extension.cppcheck_lint', () => {
	        // The code you place here will be executed every time your command is executed
	        
			oc.clear();
	        oc.appendLine("\nCurrent File's cppcheck report is:");

	        let curdoc = vscode.window.activeTextEditor!.document;
	// 		//TODO: check whether cppcheck has been installed on this machine

	// 		//TODO: check whether this active document is cpp source file

			//TODO: 
			let cppexmlcmd: string [] = new Array("cppcheck","--enable=all", "--xml");
			cppexmlcmd.push(curdoc.fileName);
	        let resultxml = runCmd(cppexmlcmd, "C:\\");
			if(resultxml.error != null){
				 vscode.window.showErrorMessage('cppcheck run failed :!' +  resultxml.error);
			}

			
			let doc = new xmldom.DOMParser().parseFromString(resultxml.stderr.toString());
	        let nodes = xpath.select("//error", doc);
			nodes.forEach(item => {
		        oc.appendLine(item.localName + ": " +item.attributes.getNamedItem("id").value);
		        oc.appendLine(item.localName + ": " +item.attributes.getNamedItem("severity").value);
		        oc.appendLine(item.localName + ": " +item.attributes.getNamedItem("msg").value);
		        oc.appendLine(item.localName + ": " +item.attributes.getNamedItem("verbose").value);
				let locations = xpath.select("//location", item);
				locations.forEach(element => {
						// oc.appendLine("element"+element);
						 oc.appendLine(element.localName + ": " +element.attributes.getNamedItem("file").value);
						 oc.appendLine(element.localName + ": " +element.attributes.getNamedItem("line").value);				
					});
			})

	        console.log("Node: start\n");
	        console.log(nodes[0].localName + ": " +nodes[0].attributes.getNamedItem("id").value);
	        console.log(nodes[0].localName + ": " +nodes[0].attributes.getNamedItem("severity").value);
	        console.log(nodes[0].localName + ": " +nodes[0].attributes.getNamedItem("msg").value);
	        console.log(nodes[0].localName + ": " +nodes[0].attributes.getNamedItem("verbose").value);
	        //detect whether the node exits or not.
	        console.log(nodes[0].childNodes[1].localName + ": " +nodes[0].childNodes[1].attributes.getNamedItem("file").value);
	        console.log(nodes[0].childNodes[1].localName + ": " +nodes[0].childNodes[1].attributes.getNamedItem("line").value);
	        console.log("Node: end\n");
	        console.log("Node: " + nodes[0].toString());


	//         oc.append("cppcheck result is:" + resultxml.stdout+"\n");
	//         oc.append("cppcheck result stderror:\n" + resultxml.stderr);
		
			// Display a message box to the user
			vscode.window.showInformationMessage('cppcheck started!');
	});

	context.subscriptions.push(cmddisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
