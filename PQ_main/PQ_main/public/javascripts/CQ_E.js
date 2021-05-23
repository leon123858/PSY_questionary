//_ => ~ => -
class E {
  constructor(isExercise) {
    this._one = "";
    this._all = "";
    this._score = "";
    this._mode = "isExercise";
    this._oneAndAll = "";
    this._questionsNum = 200;
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
    const randomList = (arr) => {
      return arr.sort(function () {
        return 0.5 - Math.random();
      });
    };
    let questions = [];
    for (let i = 0; i < 7; i++) {
      questions[i] = "1";
    }
    for (let i = 7; i < 14; i++) {
      questions[i] = "2";
    }
    for (let i = 14; i < 20; i++) {
      questions[i] = "3";
    }
    questions = randomList(questions);
    return questions;
  }
  _full_trail(stage) {
    let timeline = [];
    let questions = this._start();

    const randomNum = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };

    const randomPlaceCSS = (basis, min, max) => {
      return `style="margin-left:${-basis + randomNum(min, max)}px;margin-top:${
        -basis + randomNum(min, max)
      }px"`;
    };

    const duration = (level) => {
      return 550 - level * 50;
    };

    for (let i = 0; i < 20; i++) {
      let fixation = {
        type: "html-keyboard-response",
        stimulus:
          "<p style='font-size: 200px; font-weight: bold; color: black'>+</p>",
        choices: jsPsych.NO_KEYS,
        trial_duration: randomNum(200, 800),
      };
      timeline.push(fixation);
      if (questions[i] == "1") {
        let white = {
          type: "html-keyboard-response",
          stimulus:
            '<img id="white_ball" src="/image/C/White.jpg"' +
            randomPlaceCSS(500, 0, 1000) +
            ">",
          choices: ["j", "f"],
          trial_duration: duration(stage),
          post_trial_gap: randomNum(150, 300),
        };
        timeline.push(white);
      }
      if (questions[i] == "2") {
        let orange = {
          type: "html-keyboard-response",
          stimulus:
            '<img id="orange_ball" src="/image/C/Orange.jpg"' +
            randomPlaceCSS(500, 0, 1000) +
            ">",
          choices: ["j", "f"],
          trial_duration: duration(stage),
          post_trial_gap: randomNum(150, 300),
        };
        timeline.push(orange);
      } else {
        let sound_trial = {
          type: "audio-keyboard-response",
          stimulus: "voice/bee.mp3",
          choices: ["j", "f"],
          trial_duration: duration(stage),
          post_trial_gap: randomNum(150, 300),
        };
        timeline.push(sound_trial);
      }
    }
    console.log(timeline);
    return timeline;
  }

  //利用_trail組成很多題目的回合, 回傳整理好的one,all 資料
  _round(allData) {
    let timeline = this._full_trail();
    let questions = this._start();
    return new Promise((resolve) => {
      jsPsych.init({
        timeline: timeline,
        on_finish: function () {
          let resultArray = [0, 0]; //最後結果陣列

          let inner_data = "";
          //[右且按j && 左且按f總次數, 右且按j && 左且按f的反應時間加總, stop卻按下次數, stop卻按下的反應時間加總, 正確次數(有車按對, stop沒按)]
          let groupSet = [0, 0, 0, 0, 0];
          //使用者按下的資訊
          let data = JSON.parse(jsPsych.data.get().json());
          for (let i = 1; i < 40; i += 2) {
            //資訊
            inner_data += stage + "_" + questions[parseInt(i / 2)] + "_";
            if (
              (questions[parseInt(i / 2)] == "1" && data[i].response == "j") ||
              (questions[parseInt(i / 2)] == "2" && data[i].response == "f") ||
              (questions[parseInt(i / 2)] == "3" && data[i].response == null)
            ) {
              inner_data += "1_";
              if (data[i].rt == null) {
                inner_data += "NS";
              } else {
                inner_data += data[i].rt;
              }
              groupSet[4]++;
            } else {
              inner_data += "0_";
              if (data[i].rt == null) {
                inner_data += "NS";
              } else {
                inner_data += data[i].rt;
              }
            }
            if (i != 39) inner_data += "~";

            if (
              (questions[parseInt(i / 2)] == "1" && data[i].response == "j") ||
              (questions[parseInt(i / 2)] == "2" && data[i].response == "f")
            ) {
              groupSet[0]++;
              groupSet[1] += data[i].rt;
            } else if (
              questions[parseInt(i / 2)] == "3" &&
              data[i].response != null
            ) {
              groupSet[2]++;
              groupSet[3] += data[i].rt;
            }
            //stage_1_1_~stage_2_1_~stage_1_0_
          }

          allData.RT_count += groupSet[0];
          allData.RT_time += groupSet[1];
          allData.FA_RT_count += groupSet[2];
          allData.FA_RT_time += groupSet[3];
          allData.Acc += groupSet[4]; //加總每一回合正確題數 同時最後也是 Score

          resultArray[0] = inner_data; //this._one
          resultArray[1] = allData; //this._all

          resolve(resultArray);
        },
      });
    });
  }

  // _allGenerate(oneAndAll) {
  //   let finalAcc = (oneAndAll[1].Acc / (stage * 20)) * 100;
  //   let finalRT = oneAndAll[1].RT_time / oneAndAll[1].RT_count;
  //   let finalFA = (oneAndAll[1].FA_RT_count / (stage * 6)) * 100;
  //   let finalFA_RT = oneAndAll[1].FA_RT_time / oneAndAll[1].FA_RT_count;
  //   let finalScore = oneAndAll[1].Acc;
  //   if (finalFA_RT == 0) {
  //     finalFA_RT = "NS";
  //   }
  //   this._all = `${finalAcc}_${finalRT}_${finalFA}_${finalFA_RT}_${finalScore}`;
  //   return this._all;
  // }

  //Class:呈現的是狗(D)還是貓(C)
  //CorrAns: 1(J) 2(F) 0(NR)
  //Press: 1(J) 2(F) 0(NR)
  //------------------------------
  //Acc
  //RT
  //SSD
  //SS_Acc
  //Go_Acc
  //Go_RT
  //NCRate
  //NC_RT
  //mSSD
  //SSRT  SSRT = Go_RT – mSSD

  async process() {
    let allData = {
      Acc: 0,
      RT_count: 0,
      RT_time: 0,
      FA_RT_count: 0,
      FA_RT_time: 0,
      SSD: 0, //延遲時間(SSD)：記錄題示音出現的延遲時間，單位為毫秒(ms)。如果該題沒有題示音，則延遲時間紀錄為 NS。
      SS_Acc: 0, //題示音正確率(SS_Acc)：計算僅題示音出現的題目(200*25% = 50 題)，使用者的反應正確率，單位為百分比(%)。
    };

    this._oneAndAll = await this._round(allData);
    this._one = this._oneAndAll[0];
    this._all += this._allGenerate(this._oneAndAll);

    if (this._mode == false) {
      console.log(this._mode);
      window.location.reload();
      // return { one: null, all: null };
    } else {
      console.log(this._mode);
      return { one: this._one, all: this._all };
    }
  }
}
