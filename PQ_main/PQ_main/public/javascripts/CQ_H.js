//_ => ~ => -
{
	/* <script src="jspsych-6.3.0/plugins/jspsych-html-button-response.js"></script>
<script src="jspsych-6.3.0/plugins/jspsych-html-keyboard-response.js"></script> */
}
const generateRandomInt = (min, max, outOf) => {
	const getNum = () => {
		while (true) {
			const num = Math.floor(Math.random() * (max + 1 - min) + min);
			if (num != outOf) return num;
		}
	};
	return outOf ? getNum() : Math.floor(Math.random() * (max + 1 - min) + min);
};
const showImgs = (imgList, canvas) => {
	canvas.innerHTML = '';
	imgList.map((value, index) => {
		const img = new Image();
		img.className = 'baby';
		img.src = value.src;
		img.style = `margin-left:${value.x - 25}px;padding-top:${225 + value.y}px;${
			index < 3 ? `z-index:1;` : ''
		};`;
		canvas.appendChild(img);
	});
};

const showBalls = (imgList, canvas, path) => {
	canvas.innerHTML = '';
	imgList.map((value, index) => {
		const img = new Image();
		img.name = value.name;
		img.className = 'baby';
		img.src = path;
		img.style = `margin-left:${value.x - 25}px;padding-top:${225 + value.y}px;${
			index == 0 ? `z-index:1;` : ''
		};`;
		canvas.appendChild(img);
	});
};
class H {
	constructor(isExercise) {
		this._one = '';
		this._all = '';
		this._score = 0;
		this._mode = isExercise;
		this._questionsNum = 5;
		this._ballWidth = 200;
		this._imgPath = '/image/G/';
		this._questionType = {
			TEN: 0,
			GOAL: 1,
			GAME: 2,
		};
		this._gameStatusType = {
			END: 0,
			READY: 1,
			MOVE: 2,
			CLICK: 3,
		};
		this._speed = 0.1;
		this._tmpGoalBaby = [];
		this._tmpStatus = this._questionType.TEN;
		this._gameStatus = this._gameStatusType.END;
		this._gameClickCount = 1;
		this._bounder = { x: 950, y: 450 };
		this.statistic = {
			all: { finalLevel: 0, finalScore: 0, Acc: 0 },
			one: {},
		};
		this._nowLevel = 0;
		this._nowQuestion = 0;
	}
	_start(level) {
		const { _questionsNum: questionsNum, _questionType: TYPE } = this;
		let questions = [];
		const questionsBasis = [TYPE.TEN, TYPE.GOAL, TYPE.GAME];
		for (let i = 0; i < questionsNum; i++)
			questions = questions.concat(questionsBasis);
		return questions;
	}

	_level(level, questions) {
		const { _questionType: TYPE, _imgPath: imgPath } = this;

		let timeline = [];
		this._tmpGoalBaby = [];
		questions.map((value, index) => {
			switch (value) {
				case TYPE.TEN:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus:
							"<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
						choices: jsPsych.NO_KEYS,
						trial_duration: 1000,
					});
					break;
				case TYPE.GOAL:
					const goalBaby = generateRandomInt(1, 9);
					this._tmpGoalBaby.push(goalBaby);
					timeline.push({
						type: 'html-button-response',
						stimulus: `<img class="obj" src="${imgPath}${goalBaby}.png">`,
						choices: ['success'],
					});
					break;
				case TYPE.GAME:
					timeline.push({
						type: 'html-button-response',
						stimulus: '<div id="canvas"></div>',
						choices: ['success'],
					});
					break;
			}
		});
		return timeline;
	}

	_round(level) {
		const {
			_questionType: TYPE,
			_imgPath: imgPath,
			_bounder: { x: xBound, y: yBound },
			_gameStatusType: gameType,
		} = this;
		const generateImgsList = () => {
			const goalBaby = this._tmpGoalBaby.shift();
			this._tmpGoalBaby.push(goalBaby);
			const count = Math.floor((level - 1) / 3) + 3;
			const bonus = ((level - 1) % 3) / 4;
			const delta = generateRandomInt(0, 365) / 57.29;
			let imgList = [];
			for (let i = 0; i < count; i++) {
				const name = i == 0 ? goalBaby : generateRandomInt(1, 9, goalBaby);
				const src = `${imgPath}${name}.png`;
				const angle = (360 / count / 57.29) * i + delta;
				const r = (this._ballWidth / 2) * (1 / Math.tan(180 / count / 57.29));
				imgList.push({
					src: src,
					name: name,
					angle: angle,
					bonus: bonus,
					r: r,
					x: r * Math.cos(angle),
					y: r * Math.sin(angle),
				});
			}
			return imgList;
		};

		const questions = this._start(level);
		const timeline = this._level(level, questions);
		console.log(timeline);
		this._nowLevel = level;
		this._nowQuestion = 0;
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				on_trial_start: () => {
					if (this._tmpStatus == TYPE.GAME) {
						setTimeout(() => {
							const canvas = document.getElementById('canvas');
							this._imgList = generateImgsList();
							showImgs(this._imgList, canvas);
							this._gameStatus = gameType.READY;
							this._nowQuestion++;
						}, 1);
					}
				},
				on_trial_finish: () => {
					if (this._tmpStatus == TYPE.TEN || this._tmpStatus == TYPE.GOAL)
						this._tmpStatus++;
					else if (this._tmpStatus == TYPE.GAME) {
						this._tmpStatus = TYPE.TEN;
					}
				},
				on_finish: () => {
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					this.statistic.all.finalLevel = this._nowLevel;
					this.statistic.all.finalScore += this._score;
					const nextLevel = this._score >= 4;
					this._score = 0;
					resolve(nextLevel);
				},
			});
		});
	}
	_listener() {
		const clickBtn = () => {
			const buttons = document.getElementsByClassName('jspsych-btn');
			if (buttons[0]) buttons[0].click();
		};
		//left click
		const clickHandlerLeft = (e) => {
			if (!e.button == 0) return;
			const { _questionType: TYPE, _tmpStatus: status } = this;

			//e.target.id
			switch (status) {
				case TYPE.TEN:
					return;
				case TYPE.GOAL:
					clickBtn();
					return;
				case TYPE.GAME:
					if (this._gameStatus == this._gameStatusType.CLICK) {
						this._gameClickCount--;
						const goalBaby = this._tmpGoalBaby[this._tmpGoalBaby.length - 1];
						if (!this.statistic.one[this._nowLevel])
							this.statistic.one[this._nowLevel] = {};
						if (!this.statistic.one[this._nowLevel][this._nowQuestion])
							this.statistic.one[this._nowLevel][this._nowQuestion] = 0;
						if (e.target.name == goalBaby.toString()) {
							e.target.name = '';
							this._score++;
							this.statistic.one[this._nowLevel][this._nowQuestion]++;
						}
						if (this._gameClickCount == 0) {
							clickBtn();
							this._gameStatus = this._gameStatusType.END;
						}
					}
					return;
			}
			return;
		};
		document.addEventListener('click', clickHandlerLeft);
		//enter
		let timer;
		document.addEventListener('keydown', (e) => {
			if (
				e.keyCode != 13 ||
				this._gameStatus != this._gameStatusType.READY ||
				this._tmpStatus != this._questionType.GAME
			)
				return;
			const canvas = document.getElementById('canvas');
			this._gameStatus = this._gameStatusType.MOVE;
			showBalls(this._imgList, canvas, this._imgPath + 'ball.png');
			timer = setInterval(() => {
				this._imgList.map((value, index) => {
					this._imgList[index].angle += (1 + value.bonus) * this._speed;
					this._imgList[index].x =
						value.r * Math.cos(this._imgList[index].angle);
					this._imgList[index].y =
						value.r * Math.sin(this._imgList[index].angle);
				});
				showBalls(this._imgList, canvas, this._imgPath + 'ball.png');
			}, 15);
			setTimeout(() => {
				this._gameClickCount = 1;
				this._gameStatus = this._gameStatusType.CLICK;
				clearInterval(timer);
			}, generateRandomInt(2500, 5500));
			//}, 30);
		});
	}
	async process() {
		this._listener();
		let level = 1; //從level 1開始
		while (true) {
			const isNext = await this._round(level++);
			if (!isNext) break;
			//await waitNextLevel(false);
		}
		const {
			all: { finalLevel, finalScore },
			one,
		} = this.statistic;
		Object.keys(one).map((level, index) => {
			if (index > 0) this._one += '-';
			Object.values(one[level]).map((point, innerIndex) => {
				if (innerIndex > 0) this._one += '~';
				this._one += `${level}_${Math.floor((level - 1) / 3) + 3}_${point}`;
			});
		});
		this._all = `${finalLevel}_${finalScore}_${Math.floor(
			(finalScore * 100) / (finalLevel * 5)
		)}`;
		if (this._mode) {
			return { one: this._one, all: this._all };
		}
		return { one: this._one, all: this._all };
	}
}
