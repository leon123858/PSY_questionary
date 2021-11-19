class GQ_SQ {
	constructor(id, password) {
		this.id = id;
		this.password = password;
	}

	saveDataBefore() {
		if (localStorage.getItem('GQone') != null) {
			//check if have local storage
			$.post(
				'/GQ/SQ/saveData',
				{
					ID: this.id,
					password: this.password,
					one: localStorage.getItem('GQone'),
					group: localStorage.getItem('GQgroup'),
					type: localStorage.getItem('GQtype'),
				},
				function (data, textStatus, jqXHR) {
					if (textStatus == 'success') {
						if (data.result == 'success') {
							localStorage.removeItem('GQone');
							localStorage.removeItem('GQgroup');
							alert('上次未上傳資料上傳成功');
						} else {
							alert('Fail to upload data, reason: ' + data.result);
						}
					} else alert('The connection to the server failed.');
				},
				'json'
			).fail(() => {
				alert(
					'Unexpected error. As the data has been save in local, you can leave the system, and the files will be uploaded again next time you enter the program.'
				);
				//location.reload();
			});
		}

		if (localStorage.getItem('pr') != null) {
			$.post(
				'/GQ/PR/savePR',
				{
					ID: this.id,
					password: this.password,
					data: localStorage.getItem('pr'),
					type: localStorage.getItem('GQtype'),
				},
				function (data, textStatus, jqXHR) {
					if (textStatus == 'success') {
						if (data.result == 'success') {
							localStorage.removeItem('pr');
							// localStorage.removeItem('GQtype');
							console.log('上次未上傳資料上傳成功');
						} else {
							console.log('Fail to upload data, reason: ' + data.result);
						}
					} else console.log('The connection to the server failed.');
				},
				'json'
			).fail(() => {
				alert(
					'Unexpected error. As the data has been save in local, you can leave the system, and the files will be uploaded again next time you enter the program.'
				);
				//location.reload();
			});
		}
	}

	saveDataAfter(game, type) {
		$('form').children('input[name="one"]').val(game.one);
		$('form').children('input[name="group"]').val(game.group);
		localStorage.setItem('GQone', game.one);
		localStorage.setItem('GQgroup', game.group);
		localStorage.setItem('pr', game.pr);
		localStorage.setItem('GQtype', type);
		$.post(
			'/GQ/SQ/saveData',
			{
				ID: this.id,
				password: this.password,
				one: game.one,
				group: game.group,
				type: type,
			},
			function (data, textStatus, jqXHR) {
				if (textStatus == 'success') {
					if (data.result == 'success') {
						localStorage.removeItem('GQone');
						localStorage.removeItem('GQgroup');
						$('form').submit();
						alert('Data uploaded successfully.');
					} else {
						alert('Fail to upload data, reason: ' + data.result);
					}
				} else alert('The connection to the server failed.');
			},
			'json'
		).fail(() => {
			alert(
				'Unexpected error. As the data has been save in local, you can leave the system, and the files will be uploaded again next time you enter the program.'
			);
			location.reload();
		});
		//save pr
		$.post(
			'/GQ/PR/savePR',
			{
				ID: this.id,
				password: this.password,
				data: game.pr,
				type: type,
			},
			function (data, textStatus, jqXHR) {
				if (textStatus == 'success') {
					if (data.result == 'success') {
						localStorage.removeItem('pr');
						// localStorage.removeItem('GQtype');
						$('form').submit();
						console.log('Data uploaded successfully.');
					} else {
						console.log('Fail to upload data, reason: ' + data.result);
					}
				} else console.log('The connection to the server failed.');
			},
			'json'
		).fail(() => {
			alert(
				'Unexpected error. As the data has been save in local, you can leave the system, and the files will be uploaded again next time you enter the program.'
			);
		});
	}
}
