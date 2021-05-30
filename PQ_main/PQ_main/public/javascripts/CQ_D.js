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
    this._mode = 'isExercise';
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
    let questionsBasis = [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4,
    ];
    questionsBasis.sort(() => 0.5 - Math.random());
    questionsBasis.map((value) => {
      questions = questions.concat([TYPE.CROSS, value]);
    });
    if (level == 1) return questionsLv1;
    else return questions;
  }
  _full_trail(level, questions) {
    const { _questionType: TYPE } = this;
    let timeline = [];
    const randomNum = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };
    const circleDuration = (level) => {
      return (level - 1) * 50;
    };
    let right_arrow = {
      type: 'html-keyboard-response',
      stimulus: '<img id="right" src="/image/D/Arrow.jpg" style=""' + '>',
      concat: ['j', 'f'],
      trial_duration: 500 - (level - 1) * 50,
    };
    let left_arrow = {
      type: 'html-keyboard-response',
      stimulus: '<img id="left" src="/image/D/Arrow_left.jpg" style=""' + '>',
      choices: ['j', 'f'],
      trial_duration: 500 - (level - 1) * 50,
    };
    let right_arrow_with_circle = {
      type: 'html-keyboard-response',
      stimulus: '<img id="right-border" src="/image/D/Arrow.jpg"' + '>',
      choices: ['j', 'f'],
      trial_duration: circleDuration(level),
      post_trial_gap: randomNum(100, 300),
    };

    let left_arrow_with_circle = {
      type: 'html-keyboard-response',
      stimulus: '<img id="left-border" src="/image/D/Arrow_left.jpg"' + '>',
      choices: ['j', 'f'],
      trial_duration: circleDuration(level),
      post_trial_gap: randomNum(100, 300),
    };

    questions.map((value, index) => {
      switch (value) {
        case TYPE.CROSS:
          var cross = {
            type: 'html-keyboard-response',
            stimulus:
              "<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 500,
          };
          timeline.push(cross);
          break;
        case TYPE.RIGHT_ARROW:
          timeline.push({
            type: 'html-keyboard-response',
            stimulus: '<img id="right" src="/image/D/Arrow.jpg"' + '>',
            choices: ['j', 'f'],
            trial_duration: 500,
            post_trial_gap: randomNum(100, 300),
            correct_response: 'j',
          });
          break;
        case TYPE.LEFT_ARROW:
          timeline.push({
            type: 'html-keyboard-response',
            stimulus: '<img id="left" src="/image/D/Arrow_left.jpg"' + '>',
            choices: ['j', 'f'],
            trial_duration: 500,
            post_trial_gap: randomNum(100, 300),
            correct_response: 'f',
          });
          break;
        case TYPE.RIGHT_ARROW_WITH_CIRCLE:
          let test_procedure_R = {
            timeline: [right_arrow, right_arrow_with_circle],
            //timeline_variables: test_stimuli,
            //repetitions: 1,
            correct_response: '',
          };
          timeline.push(test_procedure_R);
          break;
        case TYPE.LEFT_ARROW_WITH_CIRCLE:
          let test_procedure_L = {
            timeline: [left_arrow, left_arrow_with_circle],
            //timeline_variables: test_stimuli,
            //repetitions: 1,
          };
          timeline.push(test_procedure_L);
          break;
      }
    });
    return timeline;
  }

  _round(level, allData) {
    const questions = this._start();
    const timeline = this._full_trail(level, questions);
    let questionsIndex = 0;
    let { _tmpAll: tmpAll } = this;
    const levelnow = this._tmpAll.Level;
    console.log(levelnow);
    const score = document.getElementById(this._clockId);
    let timer;
    return new Promise((resolve) => {
      jsPsych.init({
        timeline: timeline,
        display_element: 'jspsych-experiment',
        on_trial_start: () => {
          score.innerHTML = this._tmpAll.Score;
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
          }
          if (
            status == this._questionType.RIGHT_ARROW_WITH_CIRCLE ||
            status == this._questionType.LEFT_ARROW_WITH_CIRCLE
          ) {
            timer = setTimeout(() => {
              const imgR = document.getElementById('right-border');
              imgR.setAttribute('class', 'red-circle');
              const imgL = document.getElementById('left-border');
              imgL.setAttribute('class', 'red-circle');
            }, 200);
          }
          questionsIndex++;
        },
        on_finish: () => {
          const { _questionType: TYPE } = this;
          const data = JSON.parse(jsPsych.data.get().json());
          console.log(data);
          let tmpAll = this._tmpAll;
          let typeJ = null;
          if (
            questions[questionsIndex] == this._questionType.RIGHT_ARROW ||
            questions[questionsIndex] == this._questionType.LEFT_ARROW
          ) {
          }
          // data.map((value, index) => {
          //   switch (
          //     //questions[index]
          //     //   case TYPE.CROSS:
          //     //     if (index > 0) this._one += '~';
          //     //     this._one += `${level}_`;
          //     //     break;
          //     //   case TYPE.RIGHT_ARROW:
          //     //     typeJ = 'j';
          //     //   case TYPE.LEFT_ARROW:
          //     //     const type = typeJ || 'f';
          //     //     const CorrAns = type == 'j' ? 1 : 2;
          //     //     const press =
          //     //       value.response == null ? 'NS' : value.response == 'j' ? 1 : 2;
          //     //     const acc = CorrAns == press ? 1 : 0;
          //     //     const rt = value.rt == null ? 'NS' : Math.floor(value.rt);
          //     //     this._one += `${CorrAns}_${press}_${acc}_${rt}`;

          //     //     if (acc == 1) {
          //     //       tmpAll.Acc++;
          //     //       tmpAll.RT += rt;
          //     //       if (questions[index - 1] == TYPE.CLUE_PLACE) {
          //     //         tmpAll.Pos_Acc++;
          //     //         tmpAll.Pos_RT += rt;
          //     //       } else if (questions[index - 1] == TYPE.CLUE_COLOR) {
          //     //         tmpAll.Col_Acc++;
          //     //         tmpAll.Col_RT += rt;
          //     //       }
          //     //     }
          //     //     typeJ = null;
          //     //     break;
          //     //   case TYPE.EMPTY:
          //     //     break;
          //   ) {
          //   }
          // });
          resolve('end');
        },
      });
    });
  }

  async process() {
    let level = 1; //從level 1開始
    let allData = {
      Level: 1,
      Level_Acc: 0,
      Go_Acc: 0, //each level count seperately
      Go_RT: 0,
      NCRate: 0,
      NC_RT: 0,
      //Score:0,
      //Acc: 0,
      //RT_count: 0,
      //RT_time: 0,
      //FA_RT_count: 0,
      //FA_RT_time: 0,
    };
    while (level < 10) {
      await this._round(level, allData);
      const { Acc, RT, Level, Direct, CorrAns, Press, SSD, Score } =
        this._tmpAll;
      if (this.level < 80) {
        break; //如果答對率小於80%會改
      } else if (level < 9) {
        this._one += '_';
      }
      ++level;
    }

    //this._all = this._allGenerate(this._oneAndAll, level);

    if (this._mode) return { one: this._one, all: this._all };
    return { one: this._one, all: this._all };
  }
}

//總共有52項，沒有的話直接設為NA
