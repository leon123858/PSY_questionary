// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

/**********
 * color
 ***********/
const changeColor = (id, target) => {
	const length = $('#' + id).prop('files').length;
	if (length == 0) {
		$('#' + target).css('background-color', '#FFFFFF');
		return;
	}
	$('#' + target).css('background-color', '#777777');
};
changeColor('files-source', 'source');
changeColor('files-target', 'target');
$('#files-source').change(() => {
	changeColor('files-source', 'source');
});
$('#files-target').change(() => {
	changeColor('files-target', 'target');
});

/************************
 * click btn
 ***********************/

$('#source').click(() => {
	$('#files-source').click();
});
$('#target').click(() => {
	$('#files-target').click();
});
