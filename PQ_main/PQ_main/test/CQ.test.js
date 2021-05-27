const should = require('should');
const expect = require('chai').expect;
const fs = require('fs');

describe.skip('test if A data is right => have level', () => {
	let one =
		'1_2_1_NS~1_1_1_326~1_1_1_420~1_1_1_370~1_1_1_298~1_1_1_340~1_1_1_413~1_1_1_339~1_2_0_290~1_2_1_NS~1_1_1_353~1_2_1_NS~1_1_1_325~1_1_1_367~1_1_1_301~1_2_0_335~1_1_1_323~1_1_1_363~1_1_1_304~1_2_1_NS-2_1_1_380~2_1_1_380~2_2_1_NS~2_1_1_359~2_1_1_370~2_1_1_439~2_1_1_327~2_2_0_320~2_1_1_390~2_2_0_343~2_1_1_364~2_1_1_346~2_2_1_NS~2_1_1_289~2_2_1_NS~2_1_1_350~2_1_0_NS~2_1_1_332~2_2_1_NS~2_1_1_298-3_1_0_NS~3_1_1_291~3_1_1_314~3_1_1_373~3_1_1_272~3_1_1_342~3_2_0_364~3_1_1_324~3_2_1_NS~3_2_1_NS~3_1_1_355~3_2_0_299~3_1_1_324~3_1_1_317~3_2_1_NS~3_1_0_NS~3_1_0_NS~3_2_1_NS~3_1_1_320~3_1_1_328';
	let all = '83_342_33_325_50';

	it('one data situation', () => {
		const levels = one.split('-');
		levels.length.should.lessThan(8);
		let questionList = [];
		levels.map((level) => {
			const questions = level.split('~');
			questions.length.should.equal(20);
			questions.map((trail) => {
				questionList.push(trail);
			});
		});
		questionList.length.should.lessThan(141);
		questionList.map((questions, index) => {
			const question = questions.split('_');
			question.length.should.equal(4);
			question[0].should.equal((parseInt(index / 20) + 1).toString());
			question[1].should.oneOf(['1', '2']);
			question[2].should.oneOf(['0', '1']);
			expect(question[3]).to.satisfy((x) => {
				if (x == 'NS') {
					return true;
				}
				if (parseInt(x).toString() !== 'NaN') {
					return true;
				}
				return false;
			});
		});
	});

	it('all data is right', () => {
		const ans = all.split('_');
		ans.length.should.equal(5);
		const levels = one.split('-');
		let questionList = [];
		levels.map((level) => {
			const questions = level.split('~');
			questions.map((trail) => {
				questionList.push(trail);
			});
		});
		let right = 0;
		let totalCount = 0;

		let sumRt = 0;
		let RtCount = 0;

		let bombPush = 0;
		let bombCount = 0;

		let bombAndPushRtSum = 0;

		let score = 0;
		questionList.map((questions, index) => {
			const question = questions.split('_');
			totalCount++;
			if (question[2] == '1') {
				right++;
			}

			if (question[3] != 'NS' && question[1] == '1') {
				RtCount++;
				sumRt += parseInt(question[3]);
			}

			if (question[1] == '2' && question[2] == '0' && question[3] != 'NS') {
				bombCount++;
				bombPush++;
				bombAndPushRtSum += parseInt(question[3]);
			} else if (question[1] == '2') {
				bombCount++;
			}

			if (question[2] == '1') {
				score++;
			}
		});

		Math.floor(parseFloat(ans[0])).should.equal(
			Math.floor((100 * right) / totalCount)
		);
		Math.floor(parseFloat(ans[1])).should.equal(Math.floor(sumRt / RtCount));
		Math.floor(parseFloat(ans[2])).should.equal(
			Math.floor((100 * bombPush) / bombCount)
		);
		Math.floor(parseFloat(ans[3])).should.equal(
			Math.floor(bombAndPushRtSum / bombPush)
		);
		ans[4].should.equal(score.toString());
	});
});

describe.skip('test if B data is right => no level', () => {
	let one =
		'2_1_472~1_1_337~1_1_358~2_1_354~1_1_313~1_1_407~1_1_393~2_1_430~1_1_336~1_0_318~2_1_471~1_1_486~1_1_393~2_1_357~2_0_349~2_1_466~1_1_399~1_0_313~1_1_420~2_1_357~2_1_445~2_1_400~1_1_346~1_1_312~2_1_311~1_1_346~1_1_483~3_0_305~1_1_429~2_0_328~1_1_360~2_0_363~3_1_NS~1_1_477~2_1_319~2_1_468~1_1_402~2_1_340~2_0_372~1_1_439~3_0_508~3_0_445~1_1_302~1_1_393~3_0_384~3_0_362~2_1_386~1_1_378~2_1_400~1_1_367~1_1_405~1_0_NS~1_1_374~3_0_486~3_1_NS~2_1_358~2_1_378~1_1_410~3_0_368~2_1_499~3_1_NS~2_1_362~2_0_NS~3_1_NS~2_0_NS~3_1_NS~3_1_NS~3_1_NS~2_0_NS~1_0_NS~1_0_NS~2_0_NS~2_0_NS~3_1_NS~3_1_NS~1_0_NS~1_0_NS~3_1_NS~1_0_NS~1_0_NS~2_0_NS~3_1_NS~3_1_NS~2_0_NS~3_1_NS~3_1_NS~2_0_NS~3_1_NS~2_0_NS~3_1_NS~3_1_NS~3_1_NS~2_0_NS~3_1_NS~3_1_NS~3_1_NS~2_0_NS~3_1_NS~3_1_NS~2_0_NS';
	let all = '68_391_23_408_68';

	it('if one is right', () => {
		let questionList = one.split('~');
		questionList.length.should.equal(100);
		questionList.map((questions, index) => {
			const question = questions.split('_');
			question.length.should.equal(3);
			question[0].should.oneOf(['1', '2', '3']);
			question[1].should.oneOf(['0', '1']);
			expect(question[2]).to.satisfy((x) => {
				if (x == 'NS') {
					return true;
				}
				if (parseInt(x).toString() !== 'NaN') {
					return true;
				}
				return false;
			});
		});
	});

	it('if all data is right', () => {
		const ans = all.split('_');
		ans.length.should.equal(5);
		let questionList = one.split('~');

		let right = 0;
		let totalCount = 0;

		let sumRt = 0;
		let RtCount = 0;

		let bombPush = 0;
		let bombCount = 0;

		let bombAndPushRtSum = 0;

		let score = 0;
		questionList.map((questions, index) => {
			const question = questions.split('_');
			totalCount++;
			if (question[1] == '1') {
				right++;
			}

			if (question[2] != 'NS' && question[1] == '1' && question[0] !== '3') {
				RtCount++;
				sumRt += parseInt(question[2]);
			}

			if (question[0] == '3' && question[1] == '0' && question[2] != 'NS') {
				bombCount++;
				bombPush++;
				bombAndPushRtSum += parseInt(question[2]);
			} else if (question[0] == '3') {
				bombCount++;
			}

			if (question[1] == '1') {
				score++;
			}
		});

		Math.floor(parseFloat(ans[0])).should.equal(
			Math.floor((100 * right) / totalCount)
		);
		Math.floor(parseFloat(ans[1])).should.equal(
			Math.floor((1 * sumRt) / RtCount)
		);
		Math.floor(parseFloat(ans[2])).should.equal(
			Math.floor((100 * bombPush) / bombCount)
		);
		(Math.floor(parseFloat(ans[3])) || 'NS').should.equal(
			Math.floor((1 * bombAndPushRtSum) / bombPush) || 'NS'
		);
		ans[4].should.equal(score.toString());
	});
});

describe('test if C data is right => have level', () => {
	let one =
		'1_3_1_NS~1_3_1_NS~1_3_0_373~1_2_0_408~1_3_1_NS~1_2_0_NS~1_2_1_354~1_3_1_NS~1_1_0_354~1_2_0_NS~1_3_1_NS~1_1_0_NS~1_2_0_441~1_2_1_351~1_1_1_434~1_1_1_359~1_2_0_340~1_2_1_452~1_2_0_442~1_2_1_307';
	all = '55_376_16_373_11';

	it('one data situation', () => {
		const levels = one.split('-');
		levels.length.should.lessThan(8);
		let questionList = [];
		levels.map((level) => {
			const questions = level.split('~');
			questions.length.should.equal(20);
			questions.map((trail) => {
				questionList.push(trail);
			});
		});

		questionList.map((questions, index) => {
			const question = questions.split('_');
			question.length.should.equal(4);
			question[0].should.equal((parseInt(index / 20) + 1).toString());
			question[1].should.oneOf(['1', '2', '3']);
			question[2].should.oneOf(['0', '1']);
			expect(question[3]).to.satisfy((x) => {
				if (x == 'NS') {
					return true;
				}
				if (parseInt(x).toString() !== 'NaN') {
					return true;
				}
				return false;
			});
		});
	});

	it('all data is right', () => {
		const ans = all.split('_');
		ans.length.should.equal(5);
		const levels = one.split('-');
		let questionList = [];
		levels.map((level) => {
			const questions = level.split('~');
			questions.map((trail) => {
				questionList.push(trail);
			});
		});
		let right = 0;
		let totalCount = 0;

		let sumRt = 0;
		let RtCount = 0;

		let bombPush = 0;
		let bombCount = 0;

		let bombAndPushRtSum = 0;

		let score = 0;
		questionList.map((questions, index) => {
			const question = questions.split('_');
			totalCount++;
			if (question[2] == '1') {
				right++;
			}

			if (question[1] != '3' && question[2] == '1' && question[3] !== 'NS') {
				RtCount++;
				sumRt += parseInt(question[3]);
			}

			if (question[1] == '3' && question[2] == '0' && question[3] != 'NS') {
				bombCount++;
				bombPush++;
				bombAndPushRtSum += parseInt(question[3]);
			} else if (question[1] == '3') {
				bombCount++;
			}

			if (question[2] == '1') {
				score++;
			}
		});

		Math.floor(parseFloat(ans[0])).should.equal(
			Math.floor((100 * right) / totalCount)
		);
		Math.floor(parseFloat(ans[1])).should.equal(
			Math.floor((1 * sumRt) / RtCount) || 0
		);
		Math.floor(parseFloat(ans[2])).should.equal(
			Math.floor((100 * bombPush) / bombCount)
		);
		Math.floor(parseFloat(ans[3])).should.equal(
			Math.floor((1 * bombAndPushRtSum) / bombPush) || 'NS'
		);
		ans[4].should.equal(score.toString());
	});
});

describe.skip('test if D data is right => have level', () => {
	let one = '',
		all = '';
	before(() => {
		fs.readFile('data/oneD.txt', function (err, buf) {
			one = buf.toString();
		});
		fs.readFile('data/allD.txt', function (err, buf) {
			all = buf.toString();
		});
	});

	it('one data situation', () => {
		const levels = one.split('-');
		levels.length.should.lessThan(11);
		let questionList = [];
		levels.map((level) => {
			const questions = level.split('~');
			questions.length.should.equal(40);
			questions.map((trail) => {
				questionList.push(trail);
			});
		});

		questionList.map((questions, index) => {
			const question = questions.split('_');
			question.length.should.equal(4);
			question[0].should.equal(parseInt(index / 40) + 1);
			question[1].should.oneOf(['R', 'L']);
			question[2].should.oneOf(['0', '1', '2']);
			question[3].should.oneOf(['0', '1', '2']);
			question[4].should.oneOf(['0', '1']);
			expect(question[5]).to.satisfy((x) => {
				if (x == 'NS') {
					return true;
				}
				if (parseInt(x).toString() !== 'NaN') {
					return true;
				}
				return false;
			});
			expect(question[6]).to.satisfy((x) => {
				if (x == 'NS') {
					return true;
				}
				if (parseInt(x).toString() !== 'NaN') {
					return true;
				}
				return false;
			});
		});
	});

	it('all data is right', () => {
		const ans = all.split('_');
		ans.length.should.equal(52);
		const levels = one.split('-');
		const maxLevel = levels.length;
		const delta = 10 - maxLevel;
		ans[0].should.equal(maxLevel.toString());
		ans[51].should.is.satisfy((x) => {
			if (parseInt(x).toString() != 'NaN') return true;
			return false;
		});
		let countNA = 0;
		for (let i of ans) {
			if (i == 'NA') countNA++;
		}
		countNA.should.equal(5 * delta);
	});
});
