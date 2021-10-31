const Arduino_MODES = {
	WASD: 'WASD',
	FJ: '_F_J',
	SFJL: 'SFLJ',
};

const setArduinoMode = (mode) => {
	$.get('http://127.0.0.1:1688/' + Arduino_MODES[mode], function (result) {
		console.log(result);
	});
};
