//_ => ~ => -
class D {
  constructor(isExercise) {
    this._one = "";
    this._all = "";
    this._mode = "isExercise";
  }
  _start() {
    const randomList = (arr) => {
      return arr.sort(function () {
        return 0.5 - Math.random();
      });
    };

    let questions = [];
    for (let i = 0; i < 16; i++) {
      questions[i] = "1";
    }
    for (let i = 16; i < 32; i++) {
      questions[i] = "2";
    }
    for (let i = 32; i < 34; i++) {
      questions[i] = "3";
    }
    for (let i = 36; i < 40; i++) {
      questions[i] = "4";
    }
    questions = randomList(questions);
    return questions;

    // this._questionsList.map((questions) => {
    //   return randomList(questions);
    // });
  }

  _full_trail(stage) {
    let timeline = [];
    let questions = this._start();

    const randomNum = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };

    // const randomPlaceCSS = (basis, min, max) => {
    //   return `style="margin-left:${-basis + randomNum(min, max)}px;margin-top:${
    //     -basis + randomNum(min, max)
    //   }px"`;
    // };

    const circleDuration = (level) => {
      return (level - 1) * 50;
    };

    for (let i = 0; i < 40; i++) {
      let cross = {
        type: "html-keyboard-response",
        stimulus:
          "<p style='font-size: 200px; font-weight: bold; color: black'>+</p>",
        choices: jsPsych.NO_KEYS,
        trial_duration: 500,
      };
      timeline.push(cross);

      if (questions[i] == "1") {
        let right_arrow = {
          type: "html-keyboard-response",
          stimulus: '<img id="right" src="/image/D/Arrow.jpg"' + ">",
          choices: ["j", "f"],
          trial_duration: 500,
          post_trial_gap: randomNum(100, 300),
        };
        timeline.push(right_arrow);
      }
      if (questions[i] == "2") {
        let left_arrow = {
          type: "html-keyboard-response",
          stimulus: '<img id="left" src="/image/D/Arrow.jpg"' + ">",
          choices: ["j", "f"],
          trial_duration: 500,
          post_trial_gap: randomNum(100, 300),
        };
        timeline.push(left_arrow);
      }
      if (questions[i] == "3") {
        let circle = {
          type: "html-keyboard-response",
          stimulus:
            '<img src="" style="border:1px solid red;border-radius:0.5;"' + ">",
          choices: ["j", "f"],
          trial_duration: circleDuration(stage),
          post_trial_gap: randomNum(100, 300),
        };
        let right_arrow = {
          type: "html-keyboard-response",
          stimulus: '<img id="right" src="/image/D/Arrow.jpg"' + ">",
          choices: ["j", "f"],
          trial_duration: 500,
          post_trial_gap: randomNum(100, 300),
        };
        //timeline.push(right_arrow);
        timeline.push(circle);
      } else {
        let circle = {
          type: "html-keyboard-response",
          stimulus:
            '<img src="" style="border:1px solid red;border-radius:0.5;"' + ">",
          choices: ["j", "f"],
          trial_duration: circleDuration(stage),
          post_trial_gap: randomNum(100, 300),
        };
        let left_arrow = {
          type: "html-keyboard-response",
          stimulus:
            '<img id="left" src="/image/D/Arrow.jpg" style="transform:rotate(-180deg);"' +
            ">",
          choices: ["j", "f"],
          trial_duration: 500,
          post_trial_gap: randomNum(100, 300),
        };
        //timeline.push(left_arrow);
        timeline.push(circle);
      }
    }
    console.log(timeline);
    return timeline;
  }

  _round(stage, allData) {
    let timeline = this._full_trail(stage);
    let questions = this._start();
    return new Promise((resolve) => {
      jsPsych.init({
        timeline: timeline,
        on_finish: function () {
          let resultArray = [0, 0, 0]; //最後結果陣列
          let eachLevelAccRate; //判斷該不該進到下一個level
          let inner_data = ""; //要塞進去 resultArray 也就是對應 this._one
          //[水果且按下次數, 水果且按下的反應時間加總, 炸彈卻按下次數, 炸彈卻按下的反應時間加總, 正確次數(有水果有按, 有炸彈沒按)]
          let groupSet = [0, 0, 0, 0, 0];
          //使用者按下的資訊
          let data = JSON.parse(jsPsych.data.get().json());
          //只抓有圖案的也就是陣列裡的奇數
          for (let i = 1; i < 80; i += 2) {
            // 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41不做
            // 0, 1, 2, 3, 4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
            inner_data += stage + "_" + questions[parseInt(i / 2)] + "_";

            //判斷是不是做對了 只針對圖片出現時有沒有按對，不管十字"+"
            if (
              (questions[parseInt(i / 2)] == "1" && data[i].response == "j") ||
              (questions[parseInt(i / 2)] == "2" && data[i].response == "f") ||
              (questions[parseInt(i / 2)] == "3" && data[i].response == null) ||
              (questions[parseInt(i / 2)] == "4" && data[i].response == null)
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

            //統計水果出現有按對 和 炸彈出現按錯
            if (questions[parseInt(i / 2)] == "1" && data[i].response == "j") {
              groupSet[0]++;
              groupSet[1] += data[i].rt;
            } else if (
              questions[parseInt(i / 2)] == "2" &&
              data[i].response != null
            ) {
              groupSet[2]++;
              groupSet[3] += data[i].rt;
            }
            //stage_1_1_~stage_2_1_~stage_1_0_
          }
          // console.log(inner_data); //所以有兩輪 第一輪 20 個 第二輪 20 個
          // console.log(groupSet);

          eachLevelAccRate = (groupSet[4] / 20) * 100; //算每一level正確率

          allData.RT_count += groupSet[0];
          allData.RT_time += groupSet[1];
          allData.FA_RT_count += groupSet[2];
          allData.FA_RT_time += groupSet[3];
          allData.Acc += groupSet[4]; //加總每一回合正確題數 同時最後也是 Score

          resultArray[0] = inner_data; //this._one
          resultArray[1] = allData; //this._all
          resultArray[2] = eachLevelAccRate; //judge go to next level or not

          resolve(resultArray);
          // let inner_data = "";
          // let data = JSON.parse(jsPsych.data.get().json());
          // for (let i = 1; i < 80; i += 2) {
          //   inner_data += stage + "_" + questions[parseInt(i / 2)] + "_";
          //   if (
          //     (questions[parseInt(i / 2)] == "1" && data[i].response == "j") ||
          //     (questions[parseInt(i / 2)] == "2" && data[i].response == "f") ||
          //     (questions[parseInt(i / 2)] == "3" && data[i].response == null) ||
          //     (questions[parseInt(i / 2)] == "4" && data[i].response == null)
          //   )
          //     inner_data += "1_";
          //   else inner_data += "0_";
          //   inner_data += data[i].rt;
          //   if (i != 39) inner_data += "~";
          // }
          // console.log(data);
          // resolve(inner_data);
        },
      });
    });
  }
  //帶修改
  _allGenerate(oneAndAll, stage) {
    let finalAcc = (oneAndAll[1].Acc / (stage * 20)) * 100;
    let finalRT = oneAndAll[1].RT_time / oneAndAll[1].RT_count;
    let finalFA = (oneAndAll[1].FA_RT_count / (stage * 6)) * 100;
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
    let stage = 1; //從level 1開始
    let allData = {
      Acc: 0,
      RT_count: 0, //加總所有水果出現有按的次數
      RT_time: 0, //加總所有水果出現有按的反應時間
      FA_RT_count: 0, //加總所有炸彈有出現卻按了的次數
      FA_RT_time: 0, //加總所有炸彈有出現卻按了的反應時間
    };
    while (stage < 10) {
      this._oneAndAll = await this._round(stage, allData);
      this._one += this._oneAndAll[0];
      if (this._oneAndAll[2] < 80) {
        break;
      } else if (stage < 9) {
        this._one += "_";
      }
      ++stage;
    }

    this._all = this._allGenerate(this._oneAndAll, stage);

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
