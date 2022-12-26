const vscode = require('vscode');


/**
* @param {string} text
*/
function getAscii(text){
	return String.fromCharCode(parseInt(text))
}

/**
* @param {string} text
*/
function getType(text){
	const quote = ['34', '39', '96']
	const parenthesis = ['40', '91', '123', '60']
	return (quote.includes(`${text}`) ? 'QUOTE' :
	parenthesis.includes(`${text}`) ? 'PARENTHESIS' : 'TEXT')
}

/**
* @param {vscode.Uri} uri
* @param {vscode.Position} start
* @param {vscode.Position} end
* @param {string} asciiSymbol
* @param {vscode.WorkspaceEdit} edit
*/
function addQuote(uri, start, end, asciiSymbol, edit){
	edit.insert(
		uri,
		start,
		asciiSymbol
	)
	edit.insert(
		uri,
		end,
		asciiSymbol
	)
	vscode.workspace.applyEdit(edit)
}

/**
* @param {vscode.Uri} uri
* @param {vscode.Position} start
* @param {vscode.Position} end
* @param {string} asciiSymbol
* @param {vscode.WorkspaceEdit} edit
*/
function addParenthesis(uri, start, end, asciiSymbol, edit){
	const otherSide = [
		{
			key: '{',
			value: '}'
		},
		{
			key: '[',
			value: ']'
		},
		{
			key: '(',
			value: ')'
		},
		{
			key: '<',
			value: '>'
		},
	]
	edit.insert(
		uri,
		start,
		asciiSymbol
	)
	const other = otherSide.find(complement=>complement.key === asciiSymbol).value
	edit.insert(
		uri,
		end,
		other
	)
	vscode.workspace.applyEdit(edit)
}

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
			
			const selection = editor.selection
			if(selection.isEmpty){
				const cursorPosition = selection.active;
				if(cursorPosition === undefined) return false
				const asciiSymbol = getAscii(text)
				editor.edit(editBuilder=>{
					editBuilder.insert(cursorPosition, asciiSymbol)
				})
			}else{
				const edit = new vscode.WorkspaceEdit()
				if(edit === undefined) return false
				const asciiSymbol = getAscii(text)
				switch (getType(text)) {
					case 'QUOTE':
						addQuote(editor.document.uri, selection.start, selection.end, asciiSymbol, edit)
					  break;
					case 'PARENTHESIS':
						addParenthesis(editor.document.uri, selection.start, selection.end, asciiSymbol, edit)
					  break;
					default:
					  edit.replace(
						editor.document.uri,
						selection,
						asciiSymbol
					  )
					  vscode.workspace.applyEdit(edit)
				  }
			}
		})
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
