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

describe.skip('test if C data is right => have level', () => {
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

describe('test if D data is right => have level', () => {
	const one =
		'1_R_1_1_1_366_NS~1_L_2_2_1_321_NS~1_R_1_1_1_305_NS~1_L_2_2_1_272_NS~1_R_1_1_1_295_NS~1_L_2_2_1_300_NS~1_L_2_2_1_330_NS~1_R_1_2_0_262_NS~1_R_1_1_1_339_NS~1_R_1_2_0_254_NS~1_R_1_1_1_301_NS~1_R_1_1_1_286_NS~1_R_1_1_1_282_NS~1_L_2_2_1_359_NS~1_R_1_1_1_308_NS~1_L_2_2_1_234_NS~1_R_1_1_1_321_NS~1_R_1_2_0_201_NS~1_R_1_1_1_231_NS~1_L_2_2_1_321_NS~1_L_2_2_1_364_NS~1_L_2_2_1_305_NS~1_L_2_1_0_284_NS~1_L_2_1_0_230_NS~1_L_2_2_1_211_NS~1_L_2_2_1_331_NS~1_L_2_2_1_291_NS~1_L_2_2_1_256_NS~1_L_2_2_1_322_NS~1_L_2_2_1_327_NS~1_R_1_2_0_209_NS~1_R_1_1_1_300_NS~1_L_2_2_1_276_NS~1_R_1_2_0_289_NS~1_R_1_1_1_336_NS~1_L_2_2_1_360_NS~1_R_1_1_1_241_NS~1_R_1_2_0_254_NS~1_L_2_2_1_334_NS~1_R_1_1_1_291_NS-2_R_1_0_0_NS_NS~2_L_2_2_1_336_NS~2_R_1_1_1_270_NS~2_R_1_1_1_336_NS~2_R_1_1_1_259_NS~2_R_1_1_1_283_NS~2_L_2_2_1_319_NS~2_L_2_2_1_340_NS~2_L_2_2_1_397_NS~2_L_2_2_1_289_NS~2_R_0_1_0_368_50~2_L_2_2_1_336_NS~2_L_2_2_1_324_NS~2_L_2_2_1_237_NS~2_L_0_0_1_NS_50~2_R_0_1_0_308_50~2_L_0_0_1_NS_50~2_R_1_1_1_381_NS~2_L_2_2_1_332_NS~2_R_0_0_1_NS_50~2_R_0_0_1_NS_50~2_L_2_2_1_335_NS~2_L_2_2_1_335_NS~2_L_2_2_1_452_NS~2_L_0_0_1_NS_50~2_R_1_1_1_360_NS~2_R_1_1_1_330_NS~2_R_0_0_1_NS_50~2_L_2_2_1_366_NS~2_R_1_1_1_404_NS~2_L_2_1_0_473_NS~2_R_1_1_1_352_NS~2_R_1_2_0_279_NS~2_L_2_2_1_369_NS~2_R_1_1_1_330_NS~2_R_1_1_1_372_NS~2_L_0_0_1_NS_50~2_L_0_0_1_NS_50~2_R_1_1_1_359_NS~2_R_1_1_1_316_NS-3_R_1_1_1_344_NS~3_L_2_2_1_338_NS~3_L_0_1_0_267_100~3_R_0_0_1_NS_100~3_L_0_1_0_374_100~3_L_2_2_1_331_NS~3_L_2_2_1_358_NS~3_R_0_0_1_NS_100~3_L_2_2_1_405_NS~3_R_1_1_1_396_NS~3_R_1_1_1_359_NS~3_R_0_0_1_NS_100~3_L_2_2_1_413_NS~3_R_0_0_1_NS_100~3_L_0_1_0_385_100~3_R_1_1_1_364_NS~3_R_1_0_0_NS_NS~3_R_1_1_1_302_NS~3_R_1_1_1_361_NS~3_R_1_1_1_293_NS~3_R_1_0_0_NS_NS~3_L_2_2_1_343_NS~3_L_2_2_1_361_NS~3_R_1_1_1_354_NS~3_R_1_1_1_422_NS~3_L_2_2_1_385_NS~3_R_1_1_1_383_NS~3_L_2_2_1_351_NS~3_L_0_1_0_353_100~3_L_2_0_0_NS_NS~3_R_1_1_1_385_NS~3_R_1_1_1_469_NS~3_L_0_0_1_NS_100~3_R_1_1_1_337_NS~3_L_2_2_1_395_NS~3_L_2_2_1_459_NS~3_L_2_2_1_376_NS~3_L_2_2_1_353_NS~3_R_0_1_0_402_100~3_L_2_2_1_349_NS-4_L_2_2_1_400_NS~4_R_1_1_1_400_NS~4_R_1_1_1_409_NS~4_R_0_0_1_NS_150~4_L_2_0_0_NS_NS~4_L_2_2_1_316_NS~4_R_1_1_1_361_NS~4_L_2_2_1_354_NS~4_R_1_1_1_452_NS~4_L_2_2_1_343_NS~4_L_0_0_1_NS_150~4_R_1_1_1_363_NS~4_R_0_1_0_334_150~4_L_2_1_0_110_NS~4_L_2_1_0_22_NS~4_L_0_0_1_NS_150~4_R_0_0_1_NS_150~4_R_0_0_1_NS_150~4_L_2_0_0_NS_NS~4_L_0_0_1_NS_150~4_R_1_0_0_NS_NS~4_L_2_0_0_NS_NS~4_R_1_0_0_NS_NS~4_R_1_0_0_NS_NS~4_L_2_0_0_NS_NS~4_L_2_0_0_NS_NS~4_R_1_0_0_NS_NS~4_L_2_0_0_NS_NS~4_R_1_0_0_NS_NS~4_L_0_0_1_NS_150~4_R_1_0_0_NS_NS~4_R_1_0_0_NS_NS~4_R_0_0_1_NS_150~4_R_1_0_0_NS_NS~4_L_2_0_0_NS_NS~4_R_1_0_0_NS_NS~4_L_2_0_0_NS_NS~4_R_1_0_0_NS_NS~4_L_0_0_1_NS_150~4_L_2_0_0_NS_NS';
	const all =
		'4_80_87_80_45_NA_NA_NA_NA_NA_NA_106_90_90_30_NA_NA_NA_NA_NA_NA_303_337_369_377_NA_NA_NA_NA_NA_NA_NS_20_50_10_NA_NA_NA_NA_NA_NA_NS_338_356_334_NA_NA_NA_NA_NA_NA_117';

	it('one data situation', () => {
		const levels = one.split('-');
		console.log(levels.length);
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
			question.length.should.equal(7);
			question[0].should.equal((parseInt(index / 40) + 1).toString());
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
		expect(ans[51]).to.satisfy((x) => {
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

describe.skip('test if E data is right => no level', () => {
	const one = '';
	const all = '';

	it('if one is right', () => {
		let questionList = one.split('~');
		questionList.length.should.equal(200);
		questionList.map((questions, index) => {
			const question = questions.split('_');
			question.length.should.equal(7);
			question[0].should.oneOf(['D', 'C']);
			question[1].should.oneOf(['0', '1', '2']);
			question[2].should.oneOf(['0', '1', '2']);
			question[3].should.oneOf(['0', '1']);
			expect(question[4]).to.satisfy((x) => {
				if (x == 'NS') {
					return true;
				}
				if (parseInt(x).toString() !== 'NaN') {
					return true;
				}
				return false;
			});
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

	it('if all data is right', () => {
		const ans = all.split('_');
		ans.length.should.equal(8);
	});
});
