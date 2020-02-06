// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


import * as cross_spawn from 'cross-spawn';
import * as child_process from 'child_process';
import * as xmldom from "xmldom";
import * as xpath from "xpath";
const path = require('path');
let settings = vscode.workspace.getConfiguration('cppcheck');
let oc =  vscode.window.createOutputChannel("CppcheckReport");
let hightlightstyle = {
	color: "#2196f3",
	backgroundColor: "#F0E68C",
	overviewRulerColor: 'rgba(240,98,146,0.8)',
	overviewRulerLane: vscode.OverviewRulerLane.Right
};


let decorator = vscode.window.createTextEditorDecorationType(hightlightstyle);
let severityMap = new Map([
						   ['error',7],
						   ['warning',6],
						   ['style',5],		
						   ['performance',4],
						   ['portability',3],
						   ['information',2],
						   ['debug',1],
						   ['none',0], 
					]);

 export function runCmd(params: string[]): child_process.SpawnSyncReturns<Buffer> {
	let cmd = params.shift() || "echo";
	console.log('executing: ', cmd, params.join(' '));
	return cross_spawn.sync(cmd, params, { 'windowsHide': true });
}

class CppcheckRecord{
	constructor(file:string, line:number){
		this.line = line;
		this.file = file;
	}
	line: number | undefined;
	file: string | undefined;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cpptestid" is now active!');

	//settings can be stored in ##contributes.configuration(locates in package.json)
	// let settings = vscode.workspace.getConfiguration('cppcheck');
	if(settings.get('isEnable') === true){
		console.log('start cppcheck extension!');
	}else{
		console.log('disable cppcheck extension!');
		return;
	}

	context.subscriptions.push(vscode.commands.registerCommand('cppcheckcmd.cppcheckdir', function () {
		oc.clear();
		oc.appendLine("cppcheck report for a folder:");
		let cmdstring: string [] = new Array("cppcheck","--enable=all","--xml");
		let curdoc = vscode.window.activeTextEditor!.document;
		cmdstring.push(path.dirname(curdoc.fileName));
		let result =  runCmd(cmdstring);
		console.log("dir result is:" + result.stdout);
		console.log("dir result error is:" + result.stderr);
		handleoutput(result.stderr.toString());
		oc.appendLine("cppcheck fininshed!");
		vscode.window.showInformationMessage('cppcheck finished!');
    }));

	context.subscriptions.push( vscode.commands.registerCommand('cppcheckcmd.cppcheck', () => {
		// The code you place here will be executed every time your command is executed
		oc.clear();
		oc.appendLine("perform cppcheck from cmd");
		cppcheckCurrentFile();
	}));

		
	vscode.workspace.onDidChangeTextDocument(function (event) {
			if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor!.document) {
				oc.appendLine("perform cppcheck from change");
				cppcheckCurrentFile();
			}
		}, null, context.subscriptions);
	
}

export function cppcheckCurrentFile(){
	oc.clear();
	oc.appendLine("cppcheck report for a single file above severity:" + settings.get("severity"));

	let cmdstring: string [] = new Array("cppcheck","--enable=all","--xml");

	let curdoc = vscode.window.activeTextEditor!.document;
	cmdstring.push(curdoc.fileName);
	let result =  runCmd(cmdstring);
	console.log("file result is:" + result.stdout);
	console.log("file result error is:" + result.stderr);
	let records = handleoutput(result.stderr.toString());
	let rangeOptions : vscode.Range[] =[];
	records.forEach(record =>{
		rangeOptions.push(new vscode.Range( record.line! - 1, 0 , record.line! - 1 , 200));
	});
	vscode.window.activeTextEditor!.setDecorations(decorator, rangeOptions);
	oc.appendLine("cppcheck fininshed!");
	vscode.window.showInformationMessage('cppcheck finished!');
}

export function handleoutput(xmlreport: string) : CppcheckRecord[]{
		let doc = new xmldom.DOMParser().parseFromString(xmlreport);
		let nodes = xpath.select("//error", doc);
		let records: CppcheckRecord[] = [];
		severityMap.get("severity");
		let criterion:string | undefined= settings.get("severity");
		severityMap.get(criterion || '{}');
		let criNum = severityMap.get(settings.get("severity") || '{}') as number;

		nodes.forEach(item => {
			let rel = 	severityMap.get( item.attributes.getNamedItem("severity").value) as number;
			if(rel >= criNum) {
				// console.log("item:"+item);
				// oc.appendLine("id: 		 " +item.attributes.getNamedItem("id").value);
				// oc.appendLine("severity: " +item.attributes.getNamedItem("severity").value);
				// oc.appendLine("msg: 	 " +item.attributes.getNamedItem("msg").value);
				// oc.appendLine("verbose:  " +item.attributes.getNamedItem("verbose").value);
				let locations = xpath.select("//location", new xmldom.DOMParser().parseFromString(item.toString()));
				locations.forEach(element => {
						//  console.log("element:"+element);
						//  oc.appendLine("file : " +element.attributes.getNamedItem("file").value);
						//  oc.appendLine("line: " +element.attributes.getNamedItem("line").value);
						oc.appendLine(element.attributes.getNamedItem("file").value 
									+ " : " +element.attributes.getNamedItem("line").value 
									+ " : " + item.attributes.getNamedItem("id").value
									+ " : " + item.attributes.getNamedItem("msg").value);
						records.push(new CppcheckRecord(element.attributes.getNamedItem("file").value, Number(element.attributes.getNamedItem("line").value)));
									
				});
			}

		});
		return records;
}
// this method is called when your extension is deactivated
export function deactivate() {}
