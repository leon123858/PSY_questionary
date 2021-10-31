//_ => ~ => -
class D {
	constructor(isExercise, clockId) {
		this._one = '';
		this._all = '';
		this._score = '';
		//過程紀錄指標
		this._tmpAll = {
			Acc: 0,
			RT: 0,
			Level: 1,
			Direct: '',
			CorrAns: 0,
			Press: 0,
			SSD: 0,
			Score: 0,
		};
		this._clockId = clockId || 'clock';
		this._mode = isExercise;
		this._questionsNum = 40;
		this._questionType = {
			CROSS: 0,
			RIGHT_ARROW: 1,
			LEFT_ARROW: 2,
			RIGHT_ARROW_WITH_CIRCLE: 3,
			LEFT_ARROW_WITH_CIRCLE: 4,
			EMPTY: 5,
		};
	}
	_start(level) {
		const { _questionType: TYPE } = this;

		const getLv1Questions = () => {
			let questions = [];
			const getDirectLv1 = () => {
				const direct_basic = [TYPE.RIGHT_ARROW, TYPE.LEFT_ARROW];
				let direct_listLv1 = [];
				for (let i = 0; i < 20; i++) {
					direct_listLv1 = direct_listLv1.concat(direct_basic);
				}
				return direct_listLv1.sort(() => 0.5 - Math.random());
			};
			const questionsLv1 = getDirectLv1();
			questionsLv1.map((value) => {
				questions = questions.concat([TYPE.CROSS, value]);
			});
			return questions;
		};

		const getOtherLvQuestions = () => {
			let questions = [];
			const questionsBasis = [
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4,
			].sort(() => 0.5 - Math.random());
			questionsBasis.map((value) => {
				questions = questions.concat([TYPE.CROSS, value]);
			});
			return questions;
		};

		if (level == 1) return getLv1Questions();
		return getOtherLvQuestions();
	}
	_full_trail(level, questions) {
		const { _questionType: TYPE } = this;
		let timeline = [];
		const randomNum = (min, max) => {
			return Math.floor(Math.random() * (max + 1 - min) + min);
		};

		questions.map((value, index) => {
			switch (value) {
				case TYPE.CROSS:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus:
							"<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
						choices: jsPsych.NO_KEYS,
						trial_duration: 500,
					});
					break;
				case TYPE.RIGHT_ARROW:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: '<img id="right" src="/image/D/Arrow.png"' + '>',
						choices: ['j', 'f'],
						response_ends_trial: false,
						trial_duration: 500,
						post_trial_gap: randomNum(100, 300),
						correct_response: 'j',
					});
					break;
				case TYPE.LEFT_ARROW:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: '<img id="left" src="/image/D/Arrow_left.png"' + '>',
						choices: ['j', 'f'],
						response_ends_trial: false,
						trial_duration: 500,
						post_trial_gap: randomNum(100, 300),
						correct_response: 'f',
					});
					break;
				case TYPE.RIGHT_ARROW_WITH_CIRCLE:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: '<img id="right-border" src="/image/D/Arrow.png"' + '>',
						choices: ['j', 'f'],
						response_ends_trial: false,
						trial_duration: 500,
						post_trial_gap: randomNum(100, 300),
					});
					break;
				case TYPE.LEFT_ARROW_WITH_CIRCLE:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: '<img id="left-border" src="/image/D/Arrow.png"' + '>',
						choices: ['j', 'f'],
						response_ends_trial: false,
						trial_duration: 500,
						post_trial_gap: randomNum(100, 300),
					});
					break;
			}
		});
		return timeline;
	}

	_round(level) {
		const questions = this._start(level);
		console.log(questions);
		const timeline = this._full_trail(level, questions);
		let questionsIndex = 0;
		const score = document.getElementById(this._clockId);
		const circleDuration = (level) => {
			return (level - 1) * 50;
		};
		let timer;
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				display_element: 'jspsych-experiment',
				on_trial_start: () => {
					score.innerHTML = this._tmpAll.Score;
					const status = questions[questionsIndex];
					if (
						status == this._questionType.RIGHT_ARROW_WITH_CIRCLE ||
						status == this._questionType.LEFT_ARROW_WITH_CIRCLE
					) {
						timer = setTimeout(() => {
							const imgR = document.getElementById('right-border');
							if (imgR) imgR.setAttribute('class', 'red-circle');
							const imgL = document.getElementById('left-border');
							if (imgL) imgL.setAttribute('class', 'red-circle');
						}, circleDuration(level));
					}
				},
				on_trial_finish: () => {
					const status = questions[questionsIndex];
					if (
						status == this._questionType.RIGHT_ARROW ||
						status == this._questionType.LEFT_ARROW
					) {
						const lastData = JSON.parse(jsPsych.data.getLastTrialData().json());
						const localType =
							status == this._questionType.RIGHT_ARROW ? 'j' : 'f';
						this._tmpAll.Score += localType == lastData[0].response ? 1 : 0;
					} else if (
						status == this._questionType.RIGHT_ARROW_WITH_CIRCLE ||
						status == this._questionType.LEFT_ARROW_WITH_CIRCLE
					) {
						const lastData = JSON.parse(jsPsych.data.getLastTrialData().json());
						if (lastData[0].response == null) {
							this._tmpAll.Score++;
						}
					}
					clearTimeout(timer);
					questionsIndex++;
				},
				on_finish: () => {
					const data = JSON.parse(jsPsych.data.get().json());
					//console.log(data);
					if (level > 1) {
						this._one += '-';
					}
					const allDatalist = [];
					for (let trailIndex in data) {
						const status = questions[trailIndex];
						const value = data[trailIndex];
						const QuestionLevel = level;
						if (
							status == this._questionType.RIGHT_ARROW ||
							status == this._questionType.LEFT_ARROW
						) {
							//const value = data[trailIndex];
							//const QuestionLevel = level;
							const Direct =
								status == this._questionType.RIGHT_ARROW ? 'R' : 'L';
							const CorrAns = status == this._questionType.RIGHT_ARROW ? 1 : 2;
							const Press =
								value.response == null ? 0 : value.response == 'j' ? 1 : 2;
							const Acc = CorrAns == Press ? 1 : 0;
							const RT = value.rt == null ? 'NS' : Math.floor(value.rt);
							const SSD = 'NS';
							this._one += `${QuestionLevel}_${Direct}_${CorrAns}_${Press}_${Acc}_${RT}_${SSD}`;
							allDatalist.push({
								CorrAns,
								Acc,
								RT,
							});
						} else if (
							status == this._questionType.RIGHT_ARROW_WITH_CIRCLE ||
							status == this._questionType.LEFT_ARROW_WITH_CIRCLE
						) {
							const Direct =
								status == this._questionType.RIGHT_ARROW_WITH_CIRCLE
									? 'R'
									: 'L';
							const CorrAns = 0;
							const Press =
								value.response == null ? 0 : value.response == 'j' ? 1 : 2;
							const Acc = CorrAns == Press ? 1 : 0;
							const RT = value.rt == null ? 'NS' : Math.floor(value.rt);
							const SSD = circleDuration(level);
							this._one += `${QuestionLevel}_${Direct}_${CorrAns}_${Press}_${Acc}_${RT}_${SSD}`;
							allDatalist.push({
								CorrAns,
								Acc,
								RT,
							});
						} else if (status == this._questionType.CROSS && trailIndex != 0) {
							this._one += `~`;
						}
					}
					resolve(allDatalist);
					// CorrAns,Acc, RT
					//const oneLvJson = { CorrAns: "", Acc: "", RT: "" };
				},
			});
		});
	}
	_GetOne(dataList) {
		//wait to edit
		//return oneLvJson;
		console.log(dataList);
		//最後結果
		const Level_Acc =
			Math.floor((dataList.filter((x) => x.Acc == 1).length * 100) / 40) ||
			'NS';
		const Go_Acc =
			Math.floor(
				(dataList.filter((x) => x.CorrAns != 0 && x.Acc == 1).length * 100) / 30
			) || 'NS';
		const Go_RT =
			Math.floor(
				dataList
					.filter((x) => x.CorrAns != 0 && x.Acc == 1)
					.map((y) => y.RT)
					.reduce((prev, curr) => prev + curr, 0) /
					dataList.filter((x) => x.CorrAns != 0 && x.Acc == 1).length
			) || 'NS';
		const NCRate =
			Math.floor(
				(dataList.filter((x) => x.CorrAns == 0 && x.RT != 'NS').length * 100) /
					10
			) || 'NS';

		const circleWrongNum = dataList.filter(
			(x) => x.CorrAns == 0 && x.RT != 'NS'
		).length;

		const NC_RT =
			Math.floor(
				dataList
					.filter((x) => x.CorrAns == 0 && x.RT != 'NS')
					.map((y) => y.RT)
					.reduce((prev, curr) => prev + curr, 0) / circleWrongNum
			) || 'NS';

		return { Level_Acc, Go_Acc, Go_RT, NCRate, NC_RT };
	}
	async process() {
		let allDataList = [];
		let finalLevel = 0;
		for (let i = 1; i <= 10; i++) {
			const dataList = await this._round(i);
			const oneLvAllData = this._GetOne(dataList);
			finalLevel = i;
			allDataList.push(oneLvAllData);
			if (oneLvAllData.Level_Acc >= 80) {
				await waitNextLevel(true);
				continue;
			}
			break;
		}

		const getAll = (allDataList, level) => {
			while (allDataList.length < 10) {
				allDataList.push({
					Level_Acc: 'NA',
					Go_Acc: 'NA',
					Go_RT: 'NA',
					NCRate: 'NA',
					NC_RT: 'NA',
				});
			}
			const Level_Acc = allDataList
				.map((value) => value.Level_Acc)
				.reduce((pre, cur) => pre + '_' + cur, '');
			const Go_Acc = allDataList
				.map((value) => value.Go_Acc)
				.reduce((pre, cur) => pre + '_' + cur, '');
			const Go_RT = allDataList
				.map((value) => value.Go_RT)
				.reduce((pre, cur) => pre + '_' + cur, '');
			const NCRate = allDataList
				.map((value) => value.NCRate)
				.reduce((pre, cur) => pre + '_' + cur, '');
			const NC_RT = allDataList
				.map((value) => value.NC_RT)
				.reduce((pre, cur) => pre + '_' + cur, '');
			return `${level}${Level_Acc}${Go_Acc}${Go_RT}${NCRate}${NC_RT}_${this._tmpAll.Score}`;
		};

		this._all = getAll(allDataList, finalLevel);

		if (this._mode) return { one: this._one, all: this._all };
		return { one: this._one, all: this._all };
	}
}
