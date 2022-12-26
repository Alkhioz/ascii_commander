const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('ascii-commander.getAsciiSymbol', function () {
		vscode.window.showInputBox({
			prompt:"Type ascii code", 
			title:"Ascii Commander",
			validateInput: text => {
				return (/^[0-9]*$/g.test(text) && (parseInt(text)>=0 && parseInt(text)<=255)) ? null : "Add valid ascii code" 
			}
		}).then(text=>{
			if(text === undefined) return false
			const editor = vscode.window.activeTextEditor
			if(editor === undefined) return false
			const cursorPosition = vscode.window.activeTextEditor.selection.active;
			if(cursorPosition === undefined) return false
			const asciiSymbol = String.fromCharCode(parseInt(text))
			editor.edit(editBuilder=>{
				editBuilder.insert(cursorPosition, asciiSymbol)
			})

		})
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
