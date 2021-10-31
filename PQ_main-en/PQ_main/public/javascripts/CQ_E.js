//_ => ~ => -
class statusDiagram {
	constructor(originStatus = 0) {
		const TYPES = {
			CROSS: 0,
			CATS: 1,
			DOGS: 2,
			DOGS_WITH_SOUND: 3,
			CATS_WITH_SOUND: 4,
			WHITE: 5,
		};
		const oneDataStructure = {
			//Class:呈現的是狗(D)還是貓(C)
			//CorrAns: 1(J) 2(F) 0(NR)
			//Press: 1(J) 2(F) 0(NR)
			//------------------------------
			Class: 0,
			CorrAns: 0,
			Press: 0,
			Acc: 0,
			RT: 0,
			SSD: 0,
			SS_Acc: 0,
			//提示音正確率
		};
		const allDataStructure = {
			Acc: 0,
			RT: 0,
			SSD: 0,
			Go_Acc: 0,
			Go_RT: 0,
			NCRate: 0,
			NC_RT: 0,
			mSSD: 0,
			SSRT: 0,
			//SSRT = Go_RT – mSSD
			Score: 0,
		};
		this._types = TYPES;
		this._oneData = oneDataStructure;
		this._allData = allDataStructure;
		this._status = originStatus;
		this._recordList = [];
	}

	pushRecord(obj) {
		this._recordList.push(obj);
	}

	shiftRecord() {
		return this._recordList.shift();
	}

	getClass() {
		const table = {
			D: [this._types.DOGS, this._types.DOGS_WITH_SOUND],
			C: [this._types.CATS, this._types.CATS_WITH_SOUND],
		};
		if (table.D.includes(this.nowStatus)) return 'D';
		else if (table.C.includes(this.nowStatus)) return 'C';
		return null;
	}

	set order(list) {
		this._order = [];
		list.map((value) => {
			this._order.push(value);
		});
	}

	set Status(status) {
		this._status = status;
		return this.nowStatus;
	}

	get nowStatus() {
		return this._status;
	}

	get isCross() {
		return this.nowStatus == this.TYPE.CROSS ? true : false;
	}

	get isNoSound() {
		return this.nowStatus == this.TYPE.CATS || this.nowStatus == this.TYPE.DOGS
			? true
			: false;
	}

	get isSound() {
		return this.nowStatus == this.TYPE.CATS_WITH_SOUND ||
			this.nowStatus == this.TYPE.DOGS_WITH_SOUND
			? true
			: false;
	}

	get shouldPress() {
		if (!this.isNoSound) return null;
		return this.nowStatus == this.TYPE.CATS ? 'f' : 'j';
	}

	nextStatus() {
		this._status = this._order.shift();
		return this.nowStatus;
	}

	get TYPE() {
		return { ...this._types };
	}

	get oneDataStructure() {
		return { ...this._oneData };
	}

	get allDataStructure() {
		return { ...this._allData };
	}
}
class E {
	constructor(isExercise, clockId) {
		this._one = '';
		this._all = '';
		this._mode = isExercise;
		this._clockId = clockId || 'clock';
		this._questionsNum = 200;
		this._statusDiagram = new statusDiagram(0);
		const cssBorder = {
			BASIS: 500,
			MIN: 0,
			MAX: 1000,
		};
		this._border = cssBorder;
	}

	_start() {
		const { _statusDiagram: diagram, _questionsNum: questionsNum } = this;
		const { CATS, DOGS, CATS_WITH_SOUND, DOGS_WITH_SOUND, CROSS, WHITE } =
			diagram.TYPE;
		const questionsBasis = [
			CATS,
			CATS,
			CATS,
			DOGS,
			DOGS,
			DOGS,
			CATS_WITH_SOUND,
			DOGS_WITH_SOUND,
		];
		let questionsList = [];
		while (questionsList.length < questionsNum) {
			questionsList = questionsList.concat(questionsBasis);
		}
		questionsList.sort(() => 0.5 - Math.random());

		let questions = [];
		questionsList.map((value) => {
			const trail = [CROSS, value, WHITE];
			questions = questions.concat(trail);
		});
		return questions;
	}

	_full_trail(questions) {
		const {
			_statusDiagram: diagram,
			_border: { BASIS, MIN, MAX },
		} = this;
		const { CROSS, WHITE, CATS_WITH_SOUND, CATS, DOGS_WITH_SOUND, DOGS } =
			diagram.TYPE;
		let timeline = [];

		const randomNum = (min, max) =>
			Math.floor(Math.random() * (max + 1 - min) + min);

		const randomPlaceCSS = () => {
			return `style="margin-left:${-BASIS + randomNum(MIN, MAX)}px;margin-top:${
				-BASIS + randomNum(MIN, MAX)
			}px"`;
		};

		const randomPic = () => randomNum(1, 9);

		const dog = () => {
			const cssStr = randomPlaceCSS();
			return {
				type: 'html-keyboard-response',
				stimulus:
					`<img id="dog" class="obj" src="/image/E/d0${randomPic()}.png"` +
					cssStr +
					'>',
				choices: ['j', 'f'],
				trial_duration: 500,
			};
		};
		const cat = () => {
			const cssStr = randomPlaceCSS();
			return {
				type: 'html-keyboard-response',
				stimulus:
					`<img id="cat" class="obj" src="/image/E/c0${randomPic()}.png"` +
					cssStr +
					'>',
				choices: ['j', 'f'],
				trial_duration: 500,
			};
		};
		const white = () => {
			return {
				type: 'html-keyboard-response',
				stimulus: '',
				choices: jsPsych.NO_KEYS,
				trial_duration: randomNum(100, 300),
			};
		};
		const cross = {
			type: 'html-keyboard-response',
			stimulus:
				"<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
			choices: jsPsych.NO_KEYS,
			trial_duration: 500,
		};

		questions.map((value, index) => {
			switch (value) {
				case CROSS:
					timeline.push(cross);
					break;
				case DOGS_WITH_SOUND:
				case DOGS:
					timeline.push(dog());
					break;
				case CATS:
				case CATS_WITH_SOUND:
					timeline.push(cat());
					break;
				case WHITE:
					timeline.push(white());
					break;
			}
		});
		return timeline;
	}

	_round() {
		const { _statusDiagram: diagram } = this;
		const questions = this._start();
		const timeline = this._full_trail(questions);
		console.log(timeline);
		const score = document.getElementById(this._clockId);
		const sound = document.getElementById('sound');
		diagram.order = questions;
		diagram.nextStatus();
		this._score = 0;
		this._delay = 200;
		let timer;
		score.innerHTML = this._score;
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				display_element: 'jspsych-experiment',
				on_trial_start: () => {
					score.innerHTML = this._score;
					if (diagram.isSound) {
						timer = setTimeout(() => {
							sound.play();
						}, this._delay);
						diagram.pushRecord(this._delay.toString());
					} else if (diagram.isNoSound) {
						diagram.pushRecord('NS');
					}
				},
				on_trial_finish: () => {
					const lastData = JSON.parse(
						jsPsych.data.getLastTrialData().json()
					)[0];
					if (
						(diagram.isSound || diagram.isNoSound) &&
						diagram.shouldPress == lastData.response
					) {
						this._score++;
					}
					if (diagram.isSound) {
						this._delay += diagram.shouldPress == lastData.response ? 33 : -33;
						this._delay < 0 ? (this._delay = 0) : null;
						this._delay > 450 ? (this._delay = 450) : null;
					}
					clearTimeout(timer);
					diagram.nextStatus();
				},
				on_finish: () => {
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					let allDataPkgList = [];
					diagram.order = questions;
					diagram.nextStatus();
					data.forEach((element) => {
						const { rt, response } = element;
						if (diagram.isCross && this._one != '') {
							this._one += '~';
						}
						if (diagram.isSound || diagram.isNoSound) {
							const Class = diagram.getClass();
							const CorrAns =
								diagram.shouldPress == null
									? 0
									: diagram.shouldPress == 'j'
									? 1
									: 2;
							const Press = response == null ? 0 : response == 'j' ? 1 : 2;
							const Acc = diagram.shouldPress == response ? 1 : 0;
							const RT = rt == null ? 'NS' : Math.floor(rt);
							const delay = diagram.shiftRecord();
							this._one += `${Class}_${CorrAns}_${Press}_${Acc}_${RT}_${delay}`;
							allDataPkgList.push({
								Acc,
								RT,
								delay,
							});
						}
						diagram.nextStatus();
					});
					resolve(allDataPkgList);
				},
			});
		});
	}

	getAll(dataList) {
		const AccCount = dataList.filter((element) => element.Acc == 1).length;
		const length = dataList.length;
		const noSoundAccCount = dataList.filter(
			(element) => element.Acc == 1 && element.delay == 'NS'
		).length;
		const noSoundCount = dataList.filter(
			(element) => element.delay == 'NS'
		).length;
		const noSoundRtSum = dataList
			.filter((element) => element.Acc == 1 && element.delay == 'NS')
			.map((value) => parseInt(value.RT))
			.reduce((pre, cur) => pre + cur, 0);
		const soundErrorCount = dataList.filter(
			(element) => element.delay !== 'NS' && element.Acc == 0
		).length;
		const soundCount = dataList.filter(
			(element) => element.delay !== 'NS'
		).length;
		const soundErrorRtSum = dataList
			.filter((element) => element.Acc == 0 && element.delay !== 'NS')
			.map((value) => parseInt(value.RT))
			.reduce((pre, cur) => pre + cur, 0);
		const delaySum = dataList
			.filter((element) => element.delay !== 'NS')
			.map((value) => parseInt(value.delay))
			.reduce((pre, cur) => pre + cur, 0);
		return `${Math.floor((AccCount * 100) / length)}_${Math.floor(
			(noSoundAccCount * 100) / noSoundCount
		)}_${Math.floor(noSoundRtSum / noSoundCount)}_${Math.floor(
			(soundErrorCount * 100) / soundCount
		)}_${Math.floor(soundErrorRtSum / soundCount)}_${Math.floor(
			delaySum / soundCount
		)}_${
			Math.floor(noSoundRtSum / noSoundCount) -
			Math.floor(delaySum / soundCount)
		}`;
	}

	async process() {
		const allDataPkgList = await this._round();
		this._all = this.getAll(allDataPkgList);
		if (this._mode) return { one: this._one, all: this._all };
		return { one: this._one, all: this._all };
	}
}
