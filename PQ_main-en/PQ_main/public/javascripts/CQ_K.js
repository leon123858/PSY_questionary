//_ => ~ => -
{
	/* <script src="/jspsych-6.3.0/plugins/jspsych-html-keyboard-response.js"></script> */
	// <div id="clock"></div>
	// <div id="jspsych-experiment"></div>
	// let K = new L(true, "clock");
}
class K {
	constructor(isExercise, clockId) {
		this._one = '';
		this._all = '';
		this._tmpAll = {
			Acc: 0,
			RT: 0,
			Score: 0,
		};
		this._clockId = clockId || 'clock';
		this._mode = isExercise;
		this._questionsNum = 100;
		this._imgPath = '/image/L/';
		this._bounder = {
			x: 155,
			y: 70,
		};
		this._questionType = {
			TEN: 0,
			TABLE: 1,
			TABLE_J: 2,
			TABLE_F: 3,
			WHITE: 4,
		};
	}
	_start() {
		const { _questionType: TYPE, _questionsNum: questionsNum } = this;
		const getPlaceList = () => {
			const place_basis = [TYPE.TABLE_J, TYPE.TABLE_F];
			let placeList = [];
			for (let i = 0; i < questionsNum / 2; i++)
				placeList = placeList.concat(place_basis);
			return placeList.sort(() => 0.5 - Math.random());
		};
		let questions = [];
		const placeList = getPlaceList();
		placeList.map((place) => {
			const trail = [TYPE.TEN, TYPE.TABLE, place, TYPE.WHITE];
			questions = questions.concat(trail);
		});
		return questions;
	}

	_level(questions) {
		const {
			_questionType: TYPE,
			_imgPath: path,
			_bounder: { x: bounderX, y: bounderY },
		} = this;
		const generateRandomInt = (min, max) =>
			Math.floor(Math.random() * (max + 1 - min) + min);
		const getStimulus = (isOrange) => {
			const getPlace = () => {
				const x = generateRandomInt(20, bounderX);
				const y =
					Math.random() > 0.5
						? generateRandomInt(0, bounderY)
						: -generateRandomInt(0, bounderY);
				return Math.random() > 0.5 ? { x: -x, y } : { x: +x, y };
			};
			const color = isOrange ? 'orange' : 'white';
			const { x, y } = getPlace();
			return `<img src='${path}table.jpg' class="table"><img src='${path}${color}.png' style='margin-left:${x}px;margin-top:${y}px;'  class="ball">`;
		};
		let timeline = [];
		questions.map((value, index) => {
			switch (value) {
				case TYPE.TEN:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus:
							"<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
						choices: jsPsych.NO_KEYS,
						trial_duration: generateRandomInt(200, 800),
					});
					break;
				case TYPE.TABLE:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: `<img src='${path}table.jpg' class="table">`,
						choices: ['j', 'f'],
						trial_duration: 500,
					});
					break;
				case TYPE.TABLE_J:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: getStimulus(true),
						choices: ['j', 'f'],
						trial_duration: 500,
					});
					break;
				case TYPE.TABLE_F:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: getStimulus(false),
						choices: ['j', 'f'],
						trial_duration: 500,
					});
					break;
				case TYPE.WHITE:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: `<label id="score"><label>`,
						choices: jsPsych.NO_KEYS,
						trial_duration: generateRandomInt(100, 300),
					});
					break;
			}
		});
		return timeline;
	}

	_round() {
		const questions = this._start();
		const timeline = this._level(questions);
		console.log(timeline);
		let questionsIndex = 0;
		const score = document.getElementById(this._clockId);
		score.innerHTML = '<br>';
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				display_element: 'jspsych-experiment',
				on_trial_start: () => {
					score.innerHTML = this._tmpAll.Score;
				},
				on_trial_finish: () => {
					if (
						questions[questionsIndex] == this._questionType.TABLE_J ||
						questions[questionsIndex] == this._questionType.TABLE_F
					) {
						const lastData = JSON.parse(jsPsych.data.getLastTrialData().json());
						const localType =
							questions[questionsIndex] == this._questionType.TABLE_J
								? 'j'
								: 'f';
						this._tmpAll.Score += localType == lastData[0].response ? 1 : 0;
					}
					questionsIndex++;
				},
				on_finish: () => {
					const { _questionType: TYPE } = this;
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					let typeJ = null;
					data.map((value, index) => {
						switch (questions[index]) {
							case TYPE.TEN:
								if (index > 0) this._one += '~';
								break;
							case TYPE.TABLE_J:
								typeJ = 'j';
							case TYPE.TABLE_F:
								const type = typeJ || 'f';
								const clr = type == 'j' ? 1 : 2;
								const press =
									value.response == null ? 'NS' : value.response == 'j' ? 1 : 2;
								const acc = clr == press ? 1 : 0;
								const rt = value.rt == null ? 'NS' : Math.floor(value.rt);
								this._one += `${clr}_${press}_${acc}_${rt}`;

								if (acc == 1) {
									this._tmpAll.Acc++;
									this._tmpAll.RT += rt;
								}
								typeJ = null;
								break;
							case TYPE.WHITE:
								break;
						}
					});
					resolve('end');
				},
			});
		});
	}

	async process() {
		await this._round();
		const { _questionsNum: num } = this;
		const { Acc, RT, Score } = this._tmpAll;
		this._all = `${Math.floor((Acc * 100) / num)}_${Math.floor(
			RT / Acc
		)}_${Score}`;
		if (this._mode) return { one: this._one, all: this._all };
		return { one: this._one, all: this._all };
	}
}
