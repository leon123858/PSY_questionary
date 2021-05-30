class Handler {
	constructor(type, ID, password) {
		this._type = type;
		this._ID = ID;
		this._password = password;
		this._history = ['NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA'];
		this._whichScore = {
			A: 4,
			B: 4,
			C: 4,
			D: 51,
			E: 0,
			F: 41,
			G: 1,
			H: 1,
			I: null,
			J: 2,
			K: 2,
			L: 6,
			M: 3,
			N: 3,
			O: 0,
			P: 0,
			Q: 3,
			R: 1,
			S: 1,
			T: 3,
		};
		this._charHeight = 250;
		this._chartWidth = 500;
	}

	async saveLocalData() {
		if (localStorage.getItem('one') != null) {
			//check if have local storage
			const { _type: type, _ID: id, _password: password } = this;
			$.post(
				'/CQ/SQ/saveData',
				{
					ID: id,
					password: password,
					one: localStorage.getItem('one'),
					group: localStorage.getItem('group'),
					type: type,
				},
				function (data, textStatus, jqXHR) {
					if (textStatus == 'success') {
						if (data.result == 'success') {
							localStorage.removeItem('one');
							localStorage.removeItem('group');
							alert('上次未上傳資料上傳成功');
							return 'success';
						} else {
							alert('資料上傳失敗,失敗原因 : ' + data.result);
							return 'error';
						}
					} else {
						alert('與伺服器斷訊');
						return 'error';
					}
				},
				'json'
			);
		}
		return 'success';
	}

	_saveData(item, which) {
		const { _type: type, _ID: id, _password: password } = this;
		console.log(item);
		return new Promise((resolve, reject) => {
			$.post(
				'/CQ/SQ/saveData',
				{
					ID: id,
					password: password,
					one: item.one,
					group: item.all,
					type: type,
				},
				function (data, textStatus, jqXHR) {
					if (textStatus == 'success') {
						if (data.result == 'success') {
							which != null
								? resolve(item.all.split('_')[which])
								: resolve(null);
							return;
						} else {
							localStorage.setItem('one', item.one);
							localStorage.setItem('group', item.all);
							alert('資料上傳失敗,失敗原因 : ' + data.result);
							reject('error');
							return;
						}
					} else {
						localStorage.setItem('one', item.one);
						localStorage.setItem('group', item.all);
						alert('與伺服器斷訊');
						reject('error');
						return;
					}
				},
				'json'
			);
		});
	}

	_getHistory() {
		const { _type: type, _ID: id, _password: password } = this;
		return new Promise((resolve, reject) => {
			$.post(
				'/CQ/getHistory/' + type,
				{
					ID: id,
					password: password,
				},
				function (data, textStatus, jqXHR) {
					if (textStatus == 'success') {
						if (data.result == 'success') {
							resolve(data.data);
						} else {
							console.log('資料取得失敗,失敗原因 : ' + data.result);
							resolve(['NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA']);
						}
					} else {
						console.log('與伺服器斷訊');
						resolve(['NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA']);
					}
				},
				'json'
			);
		});
	}

	async _drawChart(item) {
		const getNA = (arr) => {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i] == 'NA') {
					return i;
				}
			}
			return arr.length;
		};
		if (item == null) {
			$('form').submit();
			return;
		}
		await this._getHistory().then((result) => {
			this._history = result.slice(0, getNA(result));
			this._history.unshift(item);
		});
		$('#jspsych-content').html(
			`<h1 style="background-color:white;">測驗結束</h1><canvas id='chartJs' style='width:${this._chartWidth}px;height:${this._chartHeight}px;background-color:white;'></canvas><form method="POST" action="/CQ/EQ" style="background-color:white;">
			<input name="ID" value="${this._ID}" style="display:none;">
			<input name="password" value="${this._password}" style="display:none;">
			<input type="submit" value="回首頁" style="font-size:20px">
		</form>`
		);
		let ctx = document.getElementById('chartJs').getContext('2d');
		let index = 0;
		const lineChartData = {
			labels: this._history.reduce((pre, cur) => {
				return pre.concat([`前${++index}次`]);
			}, []), //顯示區間名稱
			datasets: [
				{
					label: `近${this._history.length}次成績`, // tootip 出現的名稱
					lineTension: 0, // 曲線的彎度，設0 表示直線
					backgroundColor: '#e32636',
					borderColor: '#e32636',
					borderWidth: 10,
					data: this._history, // 資料
					fill: false, // 是否填滿色彩
				},
			],
		};
		const chart = new Chart(ctx, {
			//先建立一個 chart
			type: 'line', // 型態
			data: lineChartData,
			options: {
				responsive: true,
				legend: {
					//是否要顯示圖示
					display: true,
				},
				tooltips: {
					//是否要顯示 tooltip
					enabled: true,
				},
				scales: {
					//是否要顯示 x、y 軸
					xAxes: [
						{
							display: true,
						},
					],
					yAxes: [
						{
							display: true,
						},
					],
				},
			},
		});
	}

	async startTest({ questionary, isExercise = false }) {
		if (!isExercise) {
			questionary
				.process()
				.then((item) => this._saveData(item, this._whichScore[this._type]))
				.then((item) => this._drawChart(item))
				.catch((err) => $('form').submit());
		} else questionary.process().then((tmp) => location.reload());
	}
}

function waitNextLevel(isDisplay) {
	return isDisplay
		? new Promise((resolve) => {
				jsPsych.init({
					timeline: [
						{
							type: 'html-keyboard-response',
							stimulus:
								'<h1>正確率達標</h1><h2>按下鍵盤"enter"進入下一輪測試</h2>',
							choices: ['Enter'],
						},
					],
					display_element: 'jspsych-experiment',
					on_finish: () => {
						resolve('end');
					},
				});
		  })
		: new Promise((resolve) => {
				jsPsych.init({
					timeline: [
						{
							type: 'html-keyboard-response',
							stimulus:
								'<h1>正確率達標</h1><h2>按下鍵盤"enter"進入下一輪測試</h2>',
							choices: ['Enter'],
						},
					],
					on_finish: () => {
						resolve('end');
					},
				});
		  });
}
