//_ => ~ => -
class D {
  constructor(isExercise) {
    this._one = "";
    this._all = "";
    this._score = "";
    this._tmpAll = {
      Level: 0,
      Direct: true,
      CorrAns: 0,
      Press: 0,
      Acc: 0,
      RT: 0,
      SSD: 0,
    };
    //this._clockId = clockId || "clock";
    this._mode = "isExercise";
    this._questionsNum = 40;
    //this._levelOfTotal = 10;
    this._questionType = {
      CROSS: 0,
      RIGHT_ARROW: 1,
      LEFT_ARROW: 2,
      RIGHT_ARROW_WITH_CIRCLE: 3,
      LEFT_ARROW_WITH_CIRCLE: 4,
      EMPTY: 5,
    };
  }
  _start() {
    const { _questionType: TYPE } = this;
    let questions = [];
    let questionsBasis = [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4,
    ];
    questionsBasis.sort(() => 0.5 - Math.random());
    questionsBasis.map((value) => {
      questions = questions.concat([TYPE.CROSS, value, TYPE.EMPTY]);
    });

    return questions;
  }
  _full_trail(level) {
    const {
      _questionType: TYPE,
      //_imgPath: path,
      //_bounder: { x: bounderX, y: bounderY },
    } = this;
    let timeline = [];
    let questions = this._start();

    var test_stimuli = [
      { stimulus: "/image/D/Arrow.jpg", correct_response: "j" },
      { stimulus: "/image/D/Arrow_left.jpg", correct_response: "f" },
    ];

    const randomNum = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };

    const circleDuration = (level) => {
      return (level - 1) * 50;
    };

    let right_arrow = {
      type: "html-keyboard-response",
      stimulus: '<img id="right" src="/image/D/Arrow.jpg" style=""' + ">",
      choices: ["j", "f"],
      trial_duration: 500 - (level - 1) * 50,
    };
    let left_arrow = {
      type: "html-keyboard-response",
      stimulus: '<img id="left" src="/image/D/Arrow_left.jpg" style=""' + ">",
      choices: ["j", "f"],
      trial_duration: 500 - (level - 1) * 50,
    };
    let right_arrow_with_circle = {
      type: "html-keyboard-response",
      stimulus:
        '<img id="right" src="/image/D/Arrow.jpg" style=" border:5px solid red;border-radius:50%;"' +
        ">",
      choices: ["j", "f"],
      trial_duration: circleDuration(level),
      post_trial_gap: randomNum(100, 300),
    };

    let left_arrow_with_circle = {
      type: "html-keyboard-response",
      stimulus:
        '<img id="left" src="/image/D/Arrow_left.jpg" style=" border:5px solid red;border-radius:50%;"' +
        ">",
      choices: ["j", "f"],
      trial_duration: circleDuration(level),
      post_trial_gap: randomNum(100, 300),
    };

    questions.map((value, index) => {
      switch (value) {
        case TYPE.CROSS:
          var cross = {
            type: "html-keyboard-response",
            stimulus:
              "<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 500,
            // data: {
            //   task: "fixation",
            // },
          };
          timeline.push(cross);
          break;
        case TYPE.RIGHT_ARROW:
          timeline.push({
            type: "html-keyboard-response",
            stimulus: '<img id="right" src="/image/D/Arrow.jpg"' + ">",
            choices: ["j", "f"],
            trial_duration: 500,
            post_trial_gap: randomNum(100, 300),
            // data: {
            //   task: "response",
            // },
          });
          break;
        case TYPE.LEFT_ARROW:
          timeline.push({
            type: "html-keyboard-response",
            stimulus: '<img id="left" src="/image/D/Arrow_left.jpg"' + ">",
            choices: ["j", "f"],
            trial_duration: 500,
            post_trial_gap: randomNum(100, 300),
            // data: {
            //   task: "response",
            // },
          });
          break;
        case TYPE.RIGHT_ARROW_WITH_CIRCLE:
          let test_procedure_R = {
            timeline: [right_arrow, right_arrow_with_circle],
            //timeline_variables: test_stimuli,
            //repetitions: 1,
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
        // case TYPE.EMPTY:
        //   timeline.push({
        //     type: "html-keyboard-response",
        //     stimulus: `<label id="score"><label>`,
        //     choices: jsPsych.NO_KEYS,
        //     trial_duration: randomNum(100, 300),
        //   });
        //   break;
      }
    });

    //console.log(timeline);
    return timeline;
  }

  _round(level, allData) {
    const { _questionTYPE: TYPE } = this;
    let { _tmpAll: tmpAll } = this;
    const levelStr = level.toString();
    let questions = this._start();
    let timeline = this._full_trail(level);
    //const timeline = this._level(level,questions);
    console.log(timeline);
    let questionsIndex = 0;
    //const score = document.getElementById(this._clockId);
    return new Promise((resolve) => {
      jsPsych.init({
        timeline: timeline,
        on_trial_start: () => {
          //score.innerHTML = this._score;
        },
        on_trial_finish: () => {
          if (
            questions[questionsIndex] == this._questionType.RIGHT_ARROW ||
            questions[questionsIndex] == this._questionType.LEFT_ARROW
          ) {
            const lastData = JSON.parse(jsPsych.data.getLastTrialData().json());
            const localType =
              questions[questionsIndex] == this._questionType.RIGHT_ARROW
                ? "j"
                : "f";
            this._tmpAll.Score += localType == lastData[0].response ? 1 : 0;
          }
          questionsIndex++;
        },
        on_finish: () => {
          //jsPsych.data.displayData();
          const { _questionType: TYPE } = this;
          const data = JSON.parse(jsPsych.data.get().json());
          console.log(data);
          let tmpAll = this._tmpAll;
          let typeJ = null;

          //eachLevelAccRate = (groupSet[4] / 20) * 100; //算每一level正確率

          //allData.RT_count += groupSet[0];
          // allData.RT_time += groupSet[1];
          // allData.FA_RT_count += groupSet[2];
          // allData.FA_RT_time += groupSet[3];
          // allData.Acc += groupSet[4]; //加總每一回合正確題數 同時最後也是 Score

          //resultArray[0] = inner_data; //this._one
          //  resultArray[1] = allData; //this._all
          // resultArray[2] = eachLevelAccRate; //judge go to next level or not

          data.map((value, index) => {
            switch (questions[index]) {
              case TYPE.CROSS:
                if (index > 0) this._one += "~";
                this._one += `${level}_`;
                break;
              case TYPE.RIGHT_ARROW:
                typeJ = "j";
              case TYPE.LEFT_ARROW:
                const type = typeJ || "f";
                const CorrAns = type == "j" ? 1 : 2;
                const press =
                  value.response == null ? "NS" : value.response == "j" ? 1 : 2;
                const acc = CorrAns == press ? 1 : 0;
                const rt = value.rt == null ? "NS" : Math.floor(value.rt);
                this._one += `${CorrAns}_${press}_${acc}_${rt}`;

                if (acc == 1) {
                  tmpAll.Acc++;
                  tmpAll.RT += rt;
                  if (questions[index - 1] == TYPE.CLUE_PLACE) {
                    tmpAll.Pos_Acc++;
                    tmpAll.Pos_RT += rt;
                  } else if (questions[index - 1] == TYPE.CLUE_COLOR) {
                    tmpAll.Col_Acc++;
                    tmpAll.Col_RT += rt;
                  }
                }
                typeJ = null;
                break;
              case TYPE.EMPTY:
                break;
            }
          });
          resolve("end");
        },
      });
    });
  }
  //帶修改
  _allGenerate(oneAndAll, level) {
    let finalAcc = (oneAndAll[1].Acc / (level * 20)) * 100;
    let finalRT = oneAndAll[1].RT_time / oneAndAll[1].RT_count;
    let finalFA = (oneAndAll[1].FA_RT_count / (level * 6)) * 100;
    let finalFA_RT = oneAndAll[1].FA_RT_time / oneAndAll[1].FA_RT_count;
    let finalScore = oneAndAll[1].Acc;
    if (finalFA_RT == 0) {
      finalFA_RT = "NS";
    }
    this._all = `${finalAcc}_${finalRT}_${finalFA}_${finalFA_RT}_${finalScore}`;
    return this._all;
  }

  async process() {
    // console.log(this._mode);
    let level = 8; //從level 1開始
    let allData = {
      Level: 1,
      Level_Acc: 0,
      Go_Acc: 0, //each level count seperately
      Go_RT: 0,
      NCRate: 0,
      NC_RT: 0,
      //Score:0,
      //Acc: 0,
      //RT_count: 0, //加總所有水果出現有按的次數
      //RT_time: 0, //加總所有水果出現有按的反應時間
      //FA_RT_count: 0, //加總所有炸彈有出現卻按了的次數
      //FA_RT_time: 0, //加總所有炸彈有出現卻按了的反應時間
    };
    while (level < 10) {
      this._oneAndAll = await this._round(level, allData);
      this._one += this._oneAndAll[0];
      if (this._oneAndAll[2] < 80) {
        break;
      } else if (level < 9) {
        this._one += "_";
      }
      ++level;
    }

    this._all = this._allGenerate(this._oneAndAll, level);

    if (this._mode == false) {
      console.log(this._mode);
      window.location.reload(); //now I'm using reload to handle practice mode temporary
      // return { one: null, all: null };
    } else {
      console.log(this._mode);
      return { one: this._one, all: this._all };
    }
  }
}

//總共有52項，沒有的話直接設為NA
