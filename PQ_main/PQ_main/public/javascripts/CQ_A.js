//_ => ~ => -
//  <script src="/jspsych-6.3.0/plugins/jspsych-html-keyboard-response.js"></script>
//<script src="/jspsych-6.3.0/plugins/jspsych-image-keyboard-response.js"></script>
class A {
	constructor(isExercise, clockId) {
		this._one = '';
		this._all = '';
		this._mode = isExercise;
		this._clockId = clockId || 'clock';
		this._tmpScore = 0;
		this._tmpAll = {
			RT: {
				total: 0,
				count: 0,
			},
			FA: {
				total: 0,
				count: 0,
				rt_total: 0,
			},
		};
		this._randomPlaceCSSParameter = {
			BASIS: 500,
			MIN: 0,
			MAX: 1000,
		};
		const questionType = {
			TEN: 0,
			FRUIT: 1,
			BOMB: 2,
			WHITE: 3,
		};
		this._questionType = questionType;
		const questionNum = 20;
		this._questionNum = questionNum;
		const imgPath = '/image/A/';
		this._imgPath = imgPath;
	}
	_start() {
		const { _questionType: TYPE, _questionNum: questionNum } = this;
		// question[14 個 1, 6 個 2 ]   rule 7 : 3
		const questionListBasis = [
			TYPE.FRUIT,
			TYPE.FRUIT,
			TYPE.FRUIT,
			TYPE.FRUIT,
			TYPE.FRUIT,
			TYPE.FRUIT,
			TYPE.FRUIT,
			TYPE.BOMB,
			TYPE.BOMB,
			TYPE.BOMB,
		];
		let questionsList = [];
		while (questionsList.length < questionNum)
			questionsList = questionsList.concat(questionListBasis);
		questionsList.sort(() => 0.5 - Math.random());
		let questions = [];
		questionsList.map((value) => {
			questions = questions.concat([TYPE.TEN, value, TYPE.WHITE]);
		});
		return questions;
	}
	_full_trail(stage) {
		const {
			_imgPath: imgPath,
			_questionType: TYPE,
			_randomPlaceCSSParameter: BORDER,
		} = this;
		//generate random number
		const randomNum = (min, max) =>
			Math.floor(Math.random() * (max + 1 - min) + min);
		//use random number to set random place
		const randomPlaceCSS = () =>
			`style="margin-left:${
				-BORDER.BASIS + randomNum(BORDER.MIN, BORDER.MAX)
			}px;margin-top:${-BORDER.BASIS + randomNum(BORDER.MIN, BORDER.MAX)}px"`;
		// higher level shorter time
		const duration = (level) => 550 - level * 50;

		const ten = () => {
			return {
				type: 'html-keyboard-response',
				stimulus:
					"<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
				choices: jsPsych.NO_KEYS,
				trial_duration: randomNum(200, 800),
			};
		};
		const fruit = () => {
			return {
				type: 'html-keyboard-response',
				stimulus: `<img src="${imgPath}${Math.ceil(
					Math.random() * 7
				)}.jpg" ${randomPlaceCSS()}>`,
				choices: ['j'],
				trial_duration: duration(stage),
			};
		};
		const bomb = () => {
			return {
				type: 'html-keyboard-response',
				stimulus: `<img src="${imgPath}A_Bomb.jpg" ${randomPlaceCSS()}>`,
				choices: ['j'],
				trial_duration: duration(stage),
			};
		};
		const white = () => {
			return {
				type: 'html-keyboard-response',
				stimulus: '',
				choices: jsPsych.NO_KEYS,
				trial_duration: randomNum(150, 300),
			};
		};

		let timeline = [];
		let questions = this._start();
		questions.map((value) => {
			switch (value) {
				case TYPE.TEN:
					timeline.push(ten());
					break;
				case TYPE.FRUIT:
					timeline.push(fruit());
					break;
				case TYPE.BOMB:
					timeline.push(bomb());
					break;
				case TYPE.WHITE:
					timeline.push(white());
					break;
			}
		});

		return { timeline, questions };
	}
	_round(stage) {
		const {
			_questionType: TYPE,
			_questionNum: questionNum,
			_tmpAll: { RT, FA },
		} = this;
		const { timeline, questions } = this._full_trail(stage);
		console.log({ timeline, questions });

		let local_score = 0;
		let questionsIndex = 0;
		const score = document.getElementById(this._clockId);
		if (stage > 1) this._one += '-';
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				display_element: 'jspsych-experiment',
				on_trial_start: () => {
					score.innerHTML = this._tmpScore;
				},
				on_trial_finish: () => {
					const lastStatus = questions[questionsIndex];
					if (lastStatus != TYPE.FRUIT && lastStatus != TYPE.BOMB) {
						questionsIndex++;
						return;
					}
					const lastData = JSON.parse(jsPsych.data.getLastTrialData().json());
					if (
						(lastData[0].response == 'j' && lastStatus == TYPE.FRUIT) ||
						(lastData[0].response == null && lastStatus == TYPE.BOMB)
					) {
						this._tmpScore++;
						local_score++;
					}
					questionsIndex++;
				},
				on_finish: () => {
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					data.map((value, index) => {
						switch (questions[index]) {
							case TYPE.TEN:
								if (index > 0) this._one += '~';
								break;
							case TYPE.FRUIT:
								this._one += `${stage}_${TYPE.FRUIT}_${
									value.response == 'j' ? 1 : 0
								}_${value.rt == null ? 'NS' : Math.floor(value.rt)}`;
								if (value.response == 'j') {
									RT.total += Math.floor(value.rt);
									RT.count++;
								}
								break;
							case TYPE.BOMB:
								this._one += `${stage}_${TYPE.BOMB}_${
									value.response == 'j' ? 0 : 1
								}_${value.rt == null ? 'NS' : Math.floor(value.rt)}`;
								FA.count++;
								if (value.response == 'j') {
									FA.total++;
									FA.rt_total += Math.floor(value.rt);
								}
								break;
							case TYPE.WHITE:
								break;
						}
					});
					const nextLevel = (local_score * 100) / questionNum > 80;
					resolve(nextLevel);
				},
			});
		});
	}

	async process() {
		let stage = 0; //從level 1開始

		while (++stage < 8) {
			const isNext = await this._round(stage);
			if (!isNext) break;
			await waitNextLevel(true);
		}

		const {
			_questionNum: num,
			_tmpScore: finalScore,
			_tmpAll: {
				RT: { total: RT_total, count: RT_count },
				FA: { total: FA_total, count: FA_count, rt_total: FA_rt_total },
			},
		} = this;
		this._all = `${Math.floor((finalScore * 100) / (stage * num))}_${
			Math.floor(RT_total / RT_count) || 0
		}_${Math.floor((FA_total * 100) / FA_count) || 0}_${
			Math.floor(FA_rt_total / FA_total) || 'NS'
		}_${finalScore}`;
		if (this._mode == false) {
			return { one: this._one, all: this._all };
		}
		return { one: this._one, all: this._all };
	}
}
