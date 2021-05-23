//_ => ~ => -
//need <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
// <script src="jspsych-6.3.0/plugins/jspsych-html-keyboard-response.js"></script>
{
	//parameter add clockId, build div like this
	/* <body>
<div id="clock"></div>
<div id="jspsych-experiment"></div>
</body>
<script>
$(document).ready(() => {
	let f = new F(true, "clock");
	f.process().then(item => console.log(item));
})
</script> */
}
class F {
	constructor(isExercise, clockId) {
		this._one = '';
		this._all = '';
		this._clockId = clockId;
		this._mode = isExercise;
		this._imgPath = '/image/F/';
		this._questionNum = {
			FIRST: 32,
			OTHERS: 64,
		};
		this._question_TYPE = {
			TEN_FIRST: 0,
			CLUE_NO: 1,
			CLUE_CENTER: 2,
			CLUE_DUAL: 3,
			CLUE_TOP: 4,
			CLUE_BUTTON: 5,
			TEN_MID: 6,
			FISH_DIF_TOP_LEFT: 7,
			FISH_SAME_TOP_LEFT: 8,
			FISH_DIF_TOP_RIGHT: 9,
			FISH_SAME_TOP_RIGHT: 10,
			FISH_DIF_BUTTON_LEFT: 11,
			FISH_SAME_BUTTON_LEFT: 12,
			FISH_DIF_BUTTON_RIGHT: 13,
			FISH_SAME_BUTTON_RIGHT: 14,
			WHITE: 15, //use jsPsych.finishTrial(data) to end it.
		};
		this._TYPE_CLASS = {
			LEFT: [7, 8, 11, 12],
			RIGHT: [9, 10, 13, 14],
		};
		this._score = 0;
		this._tmpAll = {
			Acc: { 1: 0, 2: 0, 3: 0, 4: 0, Count: 0 },
			RT: { 1: 0, 2: 0, 3: 0, 4: 0, Count: 0 },
			NoCue: { 1: 0, 2: 0, 3: 0, 4: 0, Count: 0 },
			Center: { 1: 0, 2: 0, 3: 0, 4: 0, Count: 0 },
			Dual: { 1: 0, 2: 0, 3: 0, 4: 0, Count: 0 },
			Spatial: { 1: 0, 2: 0, 3: 0, 4: 0, Count: 0 },
			Cong: { 1: 0, 2: 0, 3: 0, 4: 0, Count: 0 },
			Ing: { 1: 0, 2: 0, 3: 0, 4: 0, Count: 0 },
			Alert: { 1: 0, 2: 0, 3: 0, 4: 0, Count: 0 },
			Orientation: { 1: 0, 2: 0, 3: 0, 4: 0, Count: 0 },
			Conflict: { 1: 0, 2: 0, 3: 0, 4: 0, Count: 0 },
			Score: 0,
		};
	}

	_start(level) {
		const {
			_questionNum: { FIRST, OTHERS },
			_question_TYPE: TYPE,
		} = this;
		let questions = [];
		const statusListBasis =
			level == 1
				? [
						[TYPE.CLUE_BUTTON, TYPE.FISH_DIF_BUTTON_RIGHT],
						[TYPE.CLUE_BUTTON, TYPE.FISH_DIF_BUTTON_LEFT],
						[TYPE.CLUE_TOP, TYPE.FISH_DIF_TOP_RIGHT],
						[TYPE.CLUE_TOP, TYPE.FISH_DIF_TOP_LEFT],
						[TYPE.CLUE_CENTER, TYPE.FISH_DIF_BUTTON_RIGHT],
						[TYPE.CLUE_CENTER, TYPE.FISH_DIF_BUTTON_LEFT],
						[TYPE.CLUE_CENTER, TYPE.FISH_DIF_TOP_RIGHT],
						[TYPE.CLUE_CENTER, TYPE.FISH_DIF_TOP_LEFT],
						[TYPE.CLUE_DUAL, TYPE.FISH_DIF_BUTTON_RIGHT],
						[TYPE.CLUE_DUAL, TYPE.FISH_DIF_BUTTON_LEFT],
						[TYPE.CLUE_DUAL, TYPE.FISH_DIF_TOP_RIGHT],
						[TYPE.CLUE_DUAL, TYPE.FISH_DIF_TOP_LEFT],
						[TYPE.CLUE_NO, TYPE.FISH_DIF_BUTTON_RIGHT],
						[TYPE.CLUE_NO, TYPE.FISH_DIF_BUTTON_LEFT],
						[TYPE.CLUE_NO, TYPE.FISH_DIF_TOP_RIGHT],
						[TYPE.CLUE_NO, TYPE.FISH_DIF_TOP_LEFT],
				  ]
				: [
						[TYPE.CLUE_BUTTON, TYPE.FISH_DIF_BUTTON_RIGHT],
						[TYPE.CLUE_BUTTON, TYPE.FISH_DIF_BUTTON_LEFT],
						[TYPE.CLUE_TOP, TYPE.FISH_DIF_TOP_RIGHT],
						[TYPE.CLUE_TOP, TYPE.FISH_DIF_TOP_LEFT],
						[TYPE.CLUE_CENTER, TYPE.FISH_DIF_BUTTON_RIGHT],
						[TYPE.CLUE_CENTER, TYPE.FISH_DIF_BUTTON_LEFT],
						[TYPE.CLUE_CENTER, TYPE.FISH_DIF_TOP_RIGHT],
						[TYPE.CLUE_CENTER, TYPE.FISH_DIF_TOP_LEFT],
						[TYPE.CLUE_DUAL, TYPE.FISH_DIF_BUTTON_RIGHT],
						[TYPE.CLUE_DUAL, TYPE.FISH_DIF_BUTTON_LEFT],
						[TYPE.CLUE_DUAL, TYPE.FISH_DIF_TOP_RIGHT],
						[TYPE.CLUE_DUAL, TYPE.FISH_DIF_TOP_LEFT],
						[TYPE.CLUE_NO, TYPE.FISH_DIF_BUTTON_RIGHT],
						[TYPE.CLUE_NO, TYPE.FISH_DIF_BUTTON_LEFT],
						[TYPE.CLUE_NO, TYPE.FISH_DIF_TOP_RIGHT],
						[TYPE.CLUE_NO, TYPE.FISH_DIF_TOP_LEFT],
						[TYPE.CLUE_BUTTON, TYPE.FISH_SAME_BUTTON_RIGHT],
						[TYPE.CLUE_BUTTON, TYPE.FISH_SAME_BUTTON_LEFT],
						[TYPE.CLUE_TOP, TYPE.FISH_SAME_TOP_RIGHT],
						[TYPE.CLUE_TOP, TYPE.FISH_SAME_TOP_LEFT],
						[TYPE.CLUE_CENTER, TYPE.FISH_SAME_BUTTON_RIGHT],
						[TYPE.CLUE_CENTER, TYPE.FISH_SAME_BUTTON_LEFT],
						[TYPE.CLUE_CENTER, TYPE.FISH_SAME_TOP_RIGHT],
						[TYPE.CLUE_CENTER, TYPE.FISH_SAME_TOP_LEFT],
						[TYPE.CLUE_DUAL, TYPE.FISH_SAME_BUTTON_RIGHT],
						[TYPE.CLUE_DUAL, TYPE.FISH_SAME_BUTTON_LEFT],
						[TYPE.CLUE_DUAL, TYPE.FISH_SAME_TOP_RIGHT],
						[TYPE.CLUE_DUAL, TYPE.FISH_SAME_TOP_LEFT],
						[TYPE.CLUE_NO, TYPE.FISH_SAME_BUTTON_RIGHT],
						[TYPE.CLUE_NO, TYPE.FISH_SAME_BUTTON_LEFT],
						[TYPE.CLUE_NO, TYPE.FISH_SAME_TOP_RIGHT],
						[TYPE.CLUE_NO, TYPE.FISH_SAME_TOP_LEFT],
				  ];
		const statusList = statusListBasis
			.concat(statusListBasis)
			.sort(() => 0.5 - Math.random());
		const length = level == 1 ? FIRST : OTHERS;
		for (let i = 0; i < length; i++) {
			questions = questions.concat([
				TYPE.TEN_FIRST,
				statusList[i][0],
				TYPE.TEN_MID,
				statusList[i][1],
				TYPE.WHITE,
			]);
		}
		return questions;
	}

	_level(level, questions) {
		const { _question_TYPE: TYPE, _imgPath: imgPath } = this;
		const generateRandomInt = (min, max) =>
			Math.floor(Math.random() * (max + 1 - min) + min);
		const getClueTable = () => {
			let CLUE_TABLE = {};
			CLUE_TABLE[TYPE.CLUE_CENTER] = '<p>*</p>';
			CLUE_TABLE[TYPE.CLUE_DUAL] = '<p>*</p><br><br><p>+</p><br><br><p>*</p>';
			CLUE_TABLE[TYPE.CLUE_NO] = '<p>+</p>';
			CLUE_TABLE[TYPE.CLUE_TOP] = '<p>*</p><br><br><p>+</p><br><br><p><br></p>';
			CLUE_TABLE[TYPE.CLUE_BUTTON] =
				'<p><br></p><br><br><p>+</p><br><br><p>*</p>';
			return CLUE_TABLE;
		};
		const buildFishList = (isSame, isLeft, count) => {
			//&ensp;半形空白
			let LStr = '';
			let RStr = '';
			//(isSame && isLeft)||!(isSame || isLeft)
			if (isSame == isLeft) {
				for (let i = 0; i < count; i++) {
					LStr += `<img src="${imgPath}F_fishL.jpg">&ensp;&ensp;`;
					RStr += `&ensp;&ensp;<img src="${imgPath}F_fishL.jpg">`;
				}
			} else if (isSame != isLeft) {
				for (let i = 0; i < count; i++) {
					LStr += `<img src="${imgPath}F_fishR.jpg">&ensp;&ensp;`;
					RStr += `&ensp;&ensp;<img src="${imgPath}F_fishR.jpg">`;
				}
			}
			return isLeft
				? `${LStr}<img src="${imgPath}F_fishL.jpg">${RStr}`
				: `${LStr}<img src="${imgPath}F_fishR.jpg">${RStr}`;
		};
		const buildFishStimulus = ({ isTop, isSame, isLeft, count }) => {
			return isTop
				? `<p>${buildFishList(
						isSame,
						isLeft,
						count - 1
				  )}</p><br><br><p>+</p><br><br><p><img src="${imgPath}F_fishL.jpg" style="visibility:hidden"></p>`
				: `<p><img src="${imgPath}F_fishL.jpg" style="visibility:hidden"></p><br><br><p>+</p><br><br><p>${buildFishList(
						isSame,
						isLeft,
						count - 1
				  )}</p>`;
		};
		let timeline = [];
		questions.map((question) => {
			switch (question) {
				case TYPE.TEN_FIRST:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: '<p>+</p>',
						choices: jsPsych.NO_KEYS,
						trial_duration: generateRandomInt(400, 1600),
					});
					break;
				case TYPE.CLUE_CENTER:
				case TYPE.CLUE_DUAL:
				case TYPE.CLUE_NO:
				case TYPE.CLUE_TOP:
				case TYPE.CLUE_BUTTON:
					const CLUE_TABLE = getClueTable();
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: CLUE_TABLE[question],
						choices: jsPsych.NO_KEYS,
						trial_duration: 100,
					});
					break;
				case TYPE.TEN_MID:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: '<p>+</p>',
						choices: jsPsych.NO_KEYS,
						trial_duration: 400,
					});
					break;
				case TYPE.FISH_DIF_BUTTON_LEFT:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: buildFishStimulus({
							isTop: false,
							isSame: false,
							isLeft: true,
							count: level,
						}),
						choices: ['j', 'f'],
						trial_duration: 1700,
					});
					break;
				case TYPE.FISH_DIF_BUTTON_RIGHT:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: buildFishStimulus({
							isTop: false,
							isSame: false,
							isLeft: false,
							count: level,
						}),
						choices: ['j', 'f'],
						trial_duration: 1700,
					});
					break;
				case TYPE.FISH_DIF_TOP_LEFT:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: buildFishStimulus({
							isTop: true,
							isSame: false,
							isLeft: true,
							count: level,
						}),
						choices: ['j', 'f'],
						trial_duration: 1700,
					});
					break;
				case TYPE.FISH_DIF_TOP_RIGHT:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: buildFishStimulus({
							isTop: true,
							isSame: false,
							isLeft: false,
							count: level,
						}),
						choices: ['j', 'f'],
						trial_duration: 1700,
					});
					break;
				case TYPE.FISH_SAME_BUTTON_LEFT:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: buildFishStimulus({
							isTop: false,
							isSame: true,
							isLeft: true,
							count: level,
						}),
						choices: ['j', 'f'],
						trial_duration: 1700,
					});
					break;
				case TYPE.FISH_SAME_BUTTON_RIGHT:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: buildFishStimulus({
							isTop: false,
							isSame: true,
							isLeft: false,
							count: level,
						}),
						choices: ['j', 'f'],
						trial_duration: 1700,
					});
					break;
				case TYPE.FISH_SAME_TOP_LEFT:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: buildFishStimulus({
							isTop: true,
							isSame: true,
							isLeft: true,
							count: level,
						}),
						choices: ['j', 'f'],
						trial_duration: 1700,
					});
					break;
				case TYPE.FISH_SAME_TOP_RIGHT:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: buildFishStimulus({
							isTop: true,
							isSame: true,
							isLeft: false,
							count: level,
						}),
						choices: ['j', 'f'],
						trial_duration: 1700,
					});
					break;
				case TYPE.WHITE:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: '',
						choices: jsPsych.NO_KEYS,
					});
					break;
			}
		});
		return timeline;
	}

	_round(level) {
		const {
			_question_TYPE: TYPE,
			_TYPE_CLASS: { LEFT },
		} = this;
		let { _tmpAll: tmpAll } = this;
		let cue = 0;
		const levelStr = level.toString();
		const questions = this._start(level);
		const timeline = this._level(level, questions);
		const getOneInfo = ({ isSame, isTop, isRight }, value) => {
			const Congruent = isSame ? 1 : 2;
			const Position = isTop ? 1 : 2;
			const Orientation = isRight ? 1 : 2;
			//(1/2(SAME/DIF),1/2(UP/DOWN),1/2(RIGHT/LEFT))
			const ori = Orientation == 1 ? 'j' : 'f';
			const response =
				value.response != null ? (value.response == 'j' ? 1 : 2) : 0;
			const right = value.response == ori ? 1 : 0;
			const rt = value.rt == null ? 1700 : Math.floor(value.rt);
			//all
			tmpAll.Acc.Count++;
			if (right == 1) {
				tmpAll.Acc[levelStr] += right;
				tmpAll.RT[levelStr] += rt;
				tmpAll.RT.Count++;
				switch (cue) {
					case 1:
						tmpAll.NoCue[levelStr] += rt;
						tmpAll.NoCue.Count++;
						break;
					case 2:
						tmpAll.Center[levelStr] += rt;
						tmpAll.Center.Count++;
						break;
					case 3:
						tmpAll.Dual[levelStr] += rt;
						tmpAll.Dual.Count++;
						break;
					case 4:
						tmpAll.Spatial[levelStr] += rt;
						tmpAll.Spatial.Count++;
						break;
				}
			}
			if (level > 1 && right == 1) {
				tmpAll.Cong[levelStr] += isSame ? rt : 0;
				tmpAll.Cong.Count++;
				tmpAll.Ing[levelStr] += !isSame ? rt : 0;
				tmpAll.Ing.Count++;
			}
			return level == 1
				? `0_${Position}_${Orientation}_${response}_${right}_${rt}`
				: `${Congruent}_${Position}_${Orientation}_${response}_${right}_${rt}`;
		};
		console.log(timeline);
		if (level > 1) this._one += '-';
		let questionsIndex = 0;
		let A = 0;
		const scoreBoard = document.getElementById(this._clockId);
		scoreBoard.innerHTML = '<br>';
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				display_element: 'jspsych-experiment',
				on_trial_start: () => {
					if (questions[questionsIndex] == TYPE.WHITE) {
						const RT =
							JSON.parse(jsPsych.data.getLastTrialData().json())[0].rt || 1700;
						setTimeout(() => {
							jsPsych.finishTrial({});
						}, 3500 - A - RT);
						const response = JSON.parse(
							jsPsych.data.getLastTrialData().json()
						)[0].response;
						const fishSide = LEFT.includes(questions[questionsIndex - 1])
							? 'f'
							: 'j';
						this._score += response == fishSide ? 1 : 0;
						scoreBoard.innerHTML = this._score;
					}
				},
				on_trial_finish: () => {
					if (questions[questionsIndex] == TYPE.TEN_FIRST) {
						A = jsPsych.currentTrial().trial_duration;
					}
					questionsIndex++;
				},
				on_finish: () => {
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					data.map((value, index) => {
						switch (questions[index]) {
							case TYPE.TEN_FIRST:
								if (index > 0) this._one += '~';
								this._one += `${level}_`;
								break;
							case TYPE.CLUE_CENTER:
								this._one += `2_`;
								cue = 2;
								break;
							case TYPE.CLUE_DUAL:
								this._one += `3_`;
								cue = 3;
								break;
							case TYPE.CLUE_NO:
								this._one += `1_`;
								cue = 1;
								break;
							case TYPE.CLUE_TOP:
							case TYPE.CLUE_BUTTON:
								this._one += `4_`;
								cue = 4;
								break;
							case TYPE.TEN_MID:
								break;
							case TYPE.FISH_DIF_BUTTON_LEFT:
								this._one += getOneInfo(
									{
										isSame: false,
										isTop: false,
										isRight: false,
									},
									value
								);
								break;
							case TYPE.FISH_DIF_BUTTON_RIGHT:
								this._one += getOneInfo(
									{
										isSame: false,
										isTop: false,
										isRight: true,
									},
									value
								);
								break;
							case TYPE.FISH_DIF_TOP_LEFT:
								this._one += getOneInfo(
									{
										isSame: false,
										isTop: true,
										isRight: false,
									},
									value
								);
								break;
							case TYPE.FISH_DIF_TOP_RIGHT:
								this._one += getOneInfo(
									{
										isSame: false,
										isTop: true,
										isRight: true,
									},
									value
								);
								break;
							case TYPE.FISH_SAME_BUTTON_LEFT:
								this._one += getOneInfo(
									{
										isSame: true,
										isTop: false,
										isRight: false,
									},
									value
								);
								break;
							case TYPE.FISH_SAME_BUTTON_RIGHT:
								this._one += getOneInfo(
									{
										isSame: true,
										isTop: false,
										isRight: true,
									},
									value
								);
								break;
							case TYPE.FISH_SAME_TOP_LEFT:
								this._one += getOneInfo(
									{
										isSame: true,
										isTop: true,
										isRight: false,
									},
									value
								);
								break;
							case TYPE.FISH_SAME_TOP_RIGHT:
								this._one += getOneInfo(
									{
										isSame: true,
										isTop: true,
										isRight: true,
									},
									value
								);
								break;
							case TYPE.WHITE:
								break;
						}
					});
					//all
					tmpAll.Acc[levelStr] =
						Math.floor((tmpAll.Acc[levelStr] * 100) / tmpAll.Acc.Count) || 0;
					tmpAll.Acc.Count = 0;
					tmpAll.RT[levelStr] =
						Math.floor(tmpAll.RT[levelStr] / tmpAll.RT.Count) || 'NS';
					tmpAll.RT.Count = 0;
					tmpAll.NoCue[levelStr] =
						Math.floor(tmpAll.NoCue[levelStr] / tmpAll.NoCue.Count) || 'NS';
					tmpAll.NoCue.Count = 0;
					tmpAll.Center[levelStr] =
						Math.floor(tmpAll.Center[levelStr] / tmpAll.Center.Count) || 'NS';
					tmpAll.Center.Count = 0;
					tmpAll.Dual[levelStr] =
						Math.floor(tmpAll.Dual[levelStr] / tmpAll.Dual.Count) || 'NS';
					tmpAll.Dual.Count = 0;
					tmpAll.Spatial[levelStr] =
						Math.floor(tmpAll.Spatial[levelStr] / tmpAll.Spatial.Count) || 'NS';
					tmpAll.Spatial.Count = 0;
					tmpAll.Alert[levelStr] =
						tmpAll.NoCue[levelStr] == 'NS' || tmpAll.Dual[levelStr] == 'NS'
							? 'NS'
							: tmpAll.NoCue[levelStr] - tmpAll.Dual[levelStr];
					tmpAll.Orientation[levelStr] =
						tmpAll.Center[levelStr] == 'NS' || tmpAll.Spatial[levelStr] == 'NS'
							? 'NS'
							: tmpAll.Center[levelStr] - tmpAll.Spatial[levelStr];
					if (level > 1) {
						tmpAll.Cong[levelStr] =
							Math.floor(tmpAll.Cong[levelStr] / tmpAll.Cong.Count) || 'NS';
						tmpAll.Cong.Count = 0;
						tmpAll.Ing[levelStr] =
							Math.floor(tmpAll.Ing[levelStr] / tmpAll.Ing.Count) || 'NS';
						tmpAll.Ing.Count = 0;
						tmpAll.Conflict[levelStr] =
							tmpAll.Ing[levelStr] == 'NS' || tmpAll.Cong[levelStr] == 'NS'
								? 'NS'
								: tmpAll.Ing[levelStr] - tmpAll.Cong[levelStr];
					}
					tmpAll.Score = this._score;
					resolve('end');
				},
			});
		});
	}

	_waitNextRound() {
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: [
					{
						type: 'html-keyboard-response',
						stimulus: '<h1>本回合結束, 點擊"enter"進入下一回合</h1>',
						choices: ['Enter'],
					},
				],
				display_element: 'jspsych-experiment',
				on_finish: () => {
					resolve('end');
				},
			});
		});
	}

	async process() {
		const buildAllCmp = (start, json) => {
			let str = '';
			for (let i = start; i <= 4; i++) str += json[i] + '_';
			return str;
		};
		for (let i = 1; ; i++) {
			await this._round(i);
			if (i == 4) break;
			await this._waitNextRound();
		}
		const {
			Acc,
			RT,
			NoCue,
			Center,
			Dual,
			Spatial,
			Cong,
			Ing,
			Alert,
			Orientation,
			Conflict,
			Score,
		} = this._tmpAll;
		this._all = `${buildAllCmp(1, Acc)}${buildAllCmp(1, RT)}${buildAllCmp(
			1,
			NoCue
		)}${buildAllCmp(1, Center)}${buildAllCmp(1, Dual)}${buildAllCmp(
			1,
			Spatial
		)}${buildAllCmp(2, Cong)}${buildAllCmp(2, Ing)}${buildAllCmp(
			1,
			Alert
		)}${buildAllCmp(1, Orientation)}${buildAllCmp(2, Conflict)}_${Score}`;
		return this._mode
			? { one: this._one, all: this._all }
			: { one: this._one, all: this._all };
	}
}
