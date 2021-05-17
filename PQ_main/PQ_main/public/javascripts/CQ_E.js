//_ => ~ => -
class E {
  constructor(isExercise) {
    this._one = "";
    this._all = "";
    this._mode = "isExercise";
    this._oneAndAll = "";
  }
  _start() {
    const randomList = (arr) => {
      return arr.sort(function () {
        return 0.5 - Math.random();
      });
    };
    // total:200 rate 5:5 25%bee
    let questions = [];
    for (let i = 0; i < 75; i++) {
      questions[i] = "1";
    }
    for (let i = 75; i < 150; i++) {
      questions[i] = "2";
    }
    for (let i = 150; i < 175; i++) {
      questions[i] = "3";
    }
    for (let i = 175; i < 200; i++) {
      questions[i] = "4";
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

    // const duration = (level) => {
    //   return 550 - level * 50;
    // };

    //0-450
    const soundDelay = (correctnum, wrongnum) => {
      return 200 + correctnum * 33 - wrongnum * 33;
    };

    const eachduration = (playerRes) => {
      return 500 - playerRes;
    };

    for (let i = 0; i < 200; i++) {
      let cross = {
        type: "html-keyboard-response",
        stimulus:
          "<p style='font-size: 200px; font-weight: bold; color: black'>+</p>",
        choices: jsPsych.NO_KEYS,
        trial_duration: 500,
      };
      timeline.push(cross);
      if (questions[i] == "1") {
        let randomPicNum = Math.ceil(Math.random() * 10);
        let dogs = {
          type: "html-keyboard-response",
          stimulus: `<img id="dog" src="/image/E/d${randomPicNum}.jpg"` + ">",
          choices: ["j", "f"],
          trial_duration: 500,
          post_trial_gap: randomNum(100, 300), //100-300
        };
        timeline.push(dogs);
      }
      if (questions[i] == "2") {
        let randomPicNum = Math.ceil(Math.random() * 10);
        let cats = {
          type: "html-keyboard-response",
          stimulus:
            `<img id="cat" src="/image/E/c${randomPicNum}.jpg"` +
            randomPlaceCSS(500, 0, 1000) +
            ">",
          choices: ["j", "f"],
          trial_duration: 500,
          post_trial_gap: randomNum(100, 300), //100-300
        };
        timeline.push(cats);
      } else {
        let bee_sound = {
          type: "audio-keyboard-response",
          stimulus: "/voice/E/bee.mp3",
          //choices: ["j", "f"],
          //trial_duration: 500,
          //post_trial_gap: randomNum(150, 300),
        };
        timeline.push(bee_sound);
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
          //CorrAns 1[j] 2[f] 0[NR]
          //Press
          //[dog且按j&&cat且按f總次數, dog且按j&&cat且按f的反應時間加總, bee卻按下次數, bee卻按下的反應時間加總, 正確次數(有dog/cat按對, be沒按)]
          let groupSet = [0, 0, 0, 0, 0];
          //使用者按下的資訊
          let data = JSON.parse(jsPsych.data.get().json());
          for (let i = 1; i < 40; i += 2) {
            //資訊
            inner_data += stage + "_" + questions[parseInt(i / 2)] + "_";
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
