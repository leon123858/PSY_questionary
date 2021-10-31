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
							alert('資料上傳失敗,失敗原因 : ' + data.result);
						}
					} else alert('與伺服器斷訊');
				},
				'json'
			).fail(() => {
				alert(
					'未預期錯誤.已紀錄資料在本電腦, 可先關閉程式, 下次開啟同系統問卷會要求上傳'
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
							console.log('資料上傳失敗,失敗原因 : ' + data.result);
						}
					} else console.log('與伺服器斷訊');
				},
				'json'
			).fail(() => {
				alert(
					'未預期錯誤.已紀錄資料在本電腦, 可先關閉程式, 下次開啟同系統問卷會要求上傳'
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
						alert('資料上傳成功');
					} else {
						alert('資料上傳失敗,失敗原因 : ' + data.result);
					}
				} else alert('與伺服器斷訊');
			},
			'json'
		).fail(() => {
			alert(
				'未預期錯誤.已紀錄資料在本電腦, 可先關閉程式, 下次開啟同系統問卷會要求上傳'
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
						console.log('資料上傳成功');
					} else {
						console.log('資料上傳失敗,失敗原因 : ' + data.result);
					}
				} else console.log('與伺服器斷訊');
			},
			'json'
		).fail(() => {
			alert(
				'未預期錯誤.已紀錄資料在本電腦, 可先關閉程式, 下次開啟同系統問卷會要求上傳'
			);
		});
	}
}
