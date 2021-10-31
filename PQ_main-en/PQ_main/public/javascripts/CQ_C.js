//_ => ~ => -
class C {
	constructor(isExercise, clockId) {
		this._one = '';
		this._all = '';
		this._mode = isExercise;
		this._clockId = clockId;
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
		const border = {
			basis: 500,
			min: 0,
			max: 1000,
		};
		this._imgPath = '/image/C/';
		this._BORDER = border;
		this._questionType = {
			TEN: 0,
			WHITE: 1,
			ORANGE: 2,
			RACKET: 3,
			SPACE: 4,
		};
	}
	_start() {
		const { _questionType: TYPE } = this;
		const generateRandomBallList = () => {
			let li = [];
			for (let i = 0; i < 7; i++)
				li.push(Math.random() > 0.5 ? TYPE.WHITE : TYPE.ORANGE);
			return li;
		};
		const getQuestions = (questionsList) => {
			let questions = [];
			questionsList.map((value) => {
				questions = questions.concat([TYPE.TEN, value, TYPE.SPACE]);
			});
			return questions;
		};
		const questionsListBasis = [TYPE.RACKET, TYPE.RACKET, TYPE.RACKET].concat(
			generateRandomBallList()
		);
		const questionsList = questionsListBasis
			.concat(questionsListBasis)
			.sort(() => 0.5 - Math.random());
		return getQuestions(questionsList);
	}

	_full_trail(stage, questions) {
		const {
			_BORDER: { basis, min, max },
			_imgPath: imgPath,
		} = this;
		const randomNum = (min, max) =>
			Math.floor(Math.random() * (max + 1 - min) + min);
		const randomPlaceCSS = () => {
			return `style="margin-left:${-basis + randomNum(min, max)}px;margin-top:${
				-basis + randomNum(min, max)
			}px"`;
		};
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
		const whiteBall = () => {
			return {
				type: 'html-keyboard-response',
				stimulus:
					`<img id="white_ball" src="${imgPath}White.png"` +
					randomPlaceCSS() +
					'>',
				choices: ['j', 'f'],
				trial_duration: duration(stage),
			};
		};
		const orangeBall = () => {
			return {
				type: 'html-keyboard-response',
				stimulus:
					`<img id="orange_ball" src="${imgPath}Orange.png"` +
					randomPlaceCSS() +
					'>',
				choices: ['j', 'f'],
				trial_duration: duration(stage),
			};
		};
		const racket = () => {
			return {
				type: 'html-keyboard-response',
				stimulus:
					`<img id="racket" src="${imgPath}Racket.png"` +
					randomPlaceCSS() +
					'>',
				choices: ['j', 'f'],
				trial_duration: duration(stage),
			};
		};
		const space = () => {
			return {
				type: 'html-keyboard-response',
				stimulus: '',
				choices: jsPsych.NO_KEYS,
				trial_duration: randomNum(150, 300),
			};
		};
		const timelineObjectTable = [ten, whiteBall, orangeBall, racket, space];

		let timeline = [];
		questions.map((value) => {
			timeline.push(timelineObjectTable[value]());
		});
		return timeline;
	}

	//利用_trail組成很多題目的回合, 回傳整理好的one,all 資料
	_round(stage) {
		const { _questionType: TYPE } = this;
		const isAnsCorrect = (status, response) => {
			return (
				(status == TYPE.WHITE && response == 'j') ||
				(status == TYPE.ORANGE && response == 'f') ||
				(status == TYPE.RACKET && response == null)
			);
		};
		const questions = this._start();
		console.log(questions);
		const timeline = this._full_trail(stage, questions);
		console.log(timeline);
		const clock = document.getElementById(this._clockId);
		if (clock) clock.innerHTML = '<br>';
		let questionsIndex = 0;
		let local_score = 0;
		if (stage > 1) this._one += '-';
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				display_element: 'jspsych-experiment',
				on_trial_finish: () => {
					const response = JSON.parse(jsPsych.data.getLastTrialData().json())[0]
						.response;
					const status = questions[questionsIndex];
					if (isAnsCorrect(status, response)) {
						local_score++;
						this._tmpScore++;
					}
					if (clock) clock.innerHTML = this._tmpScore;
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
							case TYPE.WHITE:
							case TYPE.ORANGE:
							case TYPE.RACKET:
								const status = questions[index];
								const response = value.response;
								const rt = value.rt == null ? 'NS' : Math.floor(value.rt);
								this._one += `${stage}_${status}_${
									isAnsCorrect(status, response) ? 1 : 0
								}_${rt}`;

								if (
									(status == TYPE.WHITE || status == TYPE.ORANGE) &&
									isAnsCorrect(status, response)
								) {
									this._tmpAll.RT.total += rt;
									this._tmpAll.RT.count++;
								}
								if (status == TYPE.RACKET) this._tmpAll.FA.count++;
								if (status == TYPE.RACKET && response != null) {
									this._tmpAll.FA.rt_total += rt;
									this._tmpAll.FA.total++;
								}

								break;
							case TYPE.SPACE:
								break;
						}
					});

					const isNextRound = local_score >= 16;
					resolve(isNextRound);
				},
			});
		});
	}

	async process() {
		let stage;
		for (stage = 1; stage < 8; stage++) {
			const isNext = await this._round(stage);
			if (!isNext) break;
			await waitNextLevel(true);
		}
		const {
			_tmpScore: finalScore,
			_tmpAll: {
				RT: { total: RT_total, count: RT_count },
				FA: { total: FA_total, count: FA_count, rt_total: FA_rt_total },
			},
		} = this;

		this._all = `${Math.floor((finalScore * 100) / (stage * 20))}_${
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
