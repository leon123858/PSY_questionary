//_ => ~ => -
class E {
  constructor(isExercise) {
    this._one = "";
    this._all = "";
    this._score = "";
    this._mode = "isExercise";
    this._progressDta = {
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
    this._tmpAll = {
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
    this._clockId = clockId || "clock";
    this._questionsNum = 200;
    this._questionType = {
      CROSS: 0,
      CATS: 1,
      DOGS: 2,
      DOGS_WITH_SOUND: 3,
      CATS_ARROW_WITH_SOUND: 4,
    };
  }
  _start() {
    const { _questionType: TYPE, _questionsNum: questionsNum } = this;
    const randomList = (arr) => {
      return arr.sort(function () {
        return 0.5 - Math.random();
      });
    };
    let questionsBasis = [];
    for (let i = 0; i < 75; i++) {
      questionsBasis[i] = "1";
    }
    for (let i = 75; i < 150; i++) {
      questionsBasis[i] = "2";
    }
    for (let i = 150; i < 175; i++) {
      questionsBasis[i] = "3";
    }
    for (let i = 175; i < 200; i++) {
      questionsBasis[i] = "4";
    }
    let questions = randomList(questionsBasis);

    questions.map((questionsBasis) => {
      const trail = [TYPE.CROSS, questionsBasis];
      questions = questions.concat(trail);
    });
    return questions;
  }
  _full_trail() {
    let timeline = [];
    let questions = this._start();

    const randomNum = (min, max) => {
      return Math.floor(Math.random() * (max + 1 - min) + min);
    };

    const randomPlaceCSS = (basis, min, max) => {
      return `style="margin-left:${-basis + randomNum(min, max)}px;margin-top:${
        -basis + randomNum(min, max)
      }px"`;
    };

    let corrAnsCount = 0;
    // let correct = true;
    // const CorrAnsCount= ()=>{
    //   if(correct)
    //   {

    //   }
    // }

    const sound_duration = (CorrAns) => {
      200 + 33 * CorrAns;
    };
    //0~450ms

    let dogs = {
      type: "html-keyboard-response",
      stimulus:
        '<img id="dog" src="/image/E/e01.jpg"' +
        randomPlaceCSS(500, 0, 1000) +
        ">",
      choices: ["j", "f"],
      trial_duration: 500,
      post_trial_gap: randomNum(100, 300),
    };
    let cats = {
      type: "html-keyboard-response",
      stimulus:
        '<img id="cat" src="/image/E/c01.jpg"' +
        randomPlaceCSS(500, 0, 1000) +
        ">",
      choices: ["j", "f"],
      trial_duration: 500,
      post_trial_gap: randomNum(100, 300),
    };
    let sound_trial = {
      type: "audio-keyboard-response",
      stimulus: "voice/bee.mp3",
      choices: ["j", "f"],
      trial_duration: sound_duration(corrAnsCount),
      post_trial_gap: randomNum(150, 300),
    };

    let fixation = {
      type: "html-keyboard-response",
      stimulus:
        "<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
      choices: jsPsych.NO_KEYS,
      trial_duration: 500,
    };
    timeline.push(fixation);

    questions.map((value, index) => {
      switch (value) {
        case TYPE.DOGS:
          timeline.push(dogs);
          break;
        case TYPE.CATS:
          timeline.push(cats);
          break;
        case TYPE.DOGS_WITH_SOUND:
          timeline.push([dogs, sound_trial]);
          break;
        case TYPE.CATS_WITH_SOUND:
          timeline.push([cats, sound_trial]);
          break;
      }
    });
    //console.log(timeline);
    return timeline;
  }

  //利用_trail組成很多題目的回合, 回傳整理好的one,all 資料
  _round() {
    let questions = this._start();
    let timeline = this._full_trail();
    console.log(timeline);
    let questionsIndex = 0;
    const score = document.getElementById(this._clockId);
    return new Promise((resolve) => {
      jsPsych.init({
        timeline: timeline,
        on_trial_start: () => {
          score.innerHTML = this._tmpAll.Score;
        },
        //============
        on_trial_finish: () => {
          if (
            questions[questionsIndex] == this._questionType.DOGS ||
            questions[questionsIndex] == this._questionType.CATS
          ) {
            const lastData = JSON.parse(jsPsych.data.getLastTrialData().json());
            const localType =
              questions[questionsIndex] == this._questionType.DOGS ? "j" : "f";
            this._tmpAll.Score += localType == lastData[0].response ? 1 : 0;
          }
          questionsIndex++;
        },
        //============
        on_finish: () => {
          const { _questionType: TYPE } = this;
          const data = JSON.parse(jsPsych.data.get().json());
          console.log(data);
          let tmpAll = this._tmpAll;
        },
      });
    });
  }

  async process() {
    await this._round();
    const { Acc, RT, SSD, Go_Acc, Go_RT, NCRate, NC_RT, mSSD, SSRT, Score } =
      this._tmpAll;
    this._all = `${Math.floor(Acc * 100) / this._questionsNum}_${Math.floor(
      RT / Acc
    )}_${Math.floor(Go_Acc * 100)}_${Math.floor(
      Go_RT / this.corrAnsCount
    )}_${Math.floor(NCRate * 100)}_${Math.floor(NC_RT)}_${Score}`;
    // let allData = {
    //   Acc: 0,
    //   RT_count: 0,
    //   RT_time: 0,
    //   FA_RT_count: 0,
    //   FA_RT_time: 0,
    //   SSD: 0, //延遲時間(SSD)：記錄題示音出現的延遲時間，單位為毫秒(ms)。如果該題沒有題示音，則延遲時間紀錄為 NS。
    //   SS_Acc: 0, //題示音正確率(SS_Acc)：計算僅題示音出現的題目(200*25% = 50 題)，使用者的反應正確率，單位為百分比(%)。
    // };

    this._oneAndAll = await this._round(allData);
    this._one = this._oneAndAll[0];
    this._all += this._allGenerate(this._oneAndAll);

    if (this._mode) return { one: this._one, all: this._all };
    return { one: this._one, all: this._all };
  }
}
