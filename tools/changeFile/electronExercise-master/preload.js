// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer } = require('electron');
const changeColor = (id, target) => {
	const length = $('#' + id).prop('files').length;
	if (length == 0) {
		$('#' + target).css('background-color', '#FFFFFF');
		return;
	}
	$('#' + target).css('background-color', '#777777');
};
const clearFile = (shouldAlert) => {
	$('#' + 'files-source').val(null);
	$('#' + 'files-target').val(null);
	changeColor('files-source', 'source');
	changeColor('files-target', 'target');
	shouldAlert ? alert('檔案數目有誤!') : null;
};
window.onload = () => {
	window.$ = window.jQuery = require('jquery');

	$('#exe').click(() => {
		const source = $('#' + 'files-source').prop('files');
		const target = $('#' + 'files-target').prop('files');
		if (source.length != target.length || source.length == 0) {
			clearFile(true);
			return;
		}
		const result = ipcRenderer.sendSync('exe', {
			source: Array.from(source).map((value) => value.path),
			target: Array.from(target).map((value) => value.path),
		});
		if (result == 'success') {
			clearFile(false);
		}
		alert(result);
	});
};
