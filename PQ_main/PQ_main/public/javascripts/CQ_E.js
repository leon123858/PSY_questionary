//_ => ~ => -
class E {
  constructor(isExercise, clockId) {
    this._one = '';
    this._all = '';
    this._score = '';
    this._mode = 'isExercise';
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
    this._clockId = clockId || 'clock';
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
      questionsBasis[i] = 1;
    }
    for (let i = 75; i < 150; i++) {
      questionsBasis[i] = 2;
    }
    for (let i = 150; i < 175; i++) {
      questionsBasis[i] = 3;
    }
    for (let i = 175; i < 200; i++) {
      questionsBasis[i] = 4;
    }
    let questions = randomList(questionsBasis);
    questions.map((rdnQ) => {
      const trail = [TYPE.CROSS, rdnQ];
      questions = questions.concat(trail);
    });
    console.log(questions);
    return questions;
  }

  _full_trail(questions) {
    const { _questionType: TYPE } = this;
    let timeline = [];

    const randomNum = (min, max) => {
      return Math.floor(Math.random() * (max + 1 - min) + min);
    };

    const randomPlaceCSS = (basis, min, max) => {
      return `style="margin-left:${-basis + randomNum(min, max)}px;margin-top:${
        -basis + randomNum(min, max)
      }px"`;
    };
    const rdnpic = randomNum(0, 10);
    let corrAnsCount = 0;
    // let correct = true;
    // const CorrAnsCount= ()=>{
    //   if(correct)
    //   {

    //   }
    // }
    const gap = 200;
    if (gap >= 0 && gap <= 450) {
      const sound_duration = (STG, CorrAns) => {
        return STG + 33 * CorrAns;
      };
    }

    let dogs = (cssStr) => {
      return {
        type: 'html-keyboard-response',
        stimulus: '<img id="dog" src="/image/E/d01.jpg"' + cssStr + '>',
        choices: ['j', 'f'],
        trial_duration: 500,
      };
    };
    let cats = (cssStr) => {
      return {
        type: 'html-keyboard-response',
        stimulus: '<img id="cat" src="/image/E/c01.jpg"' + cssStr + '>',
        choices: ['j', 'f'],
        trial_duration: 500,
      };
    };
    let sound_trial = (cssStr) => {
      return {
        type: 'html-keyboard-response',
        stimulus:
          '<img id="cat" src="/image/E/c01.jpg"' +
          cssStr +
          '>' +
          '<audio id="E_sound"><source src="/voice/bee.mp3"></audio>',
        choices: ['j', 'f'],
        trial_duration: 50000,
        post_trial_gap: randomNum(100, 300),
      };
    };

    const fixation = {
      type: 'html-keyboard-response',
      stimulus:
        "<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
      choices: jsPsych.NO_KEYS,
      trial_duration: 500,
    };

    questions.map((value, index) => {
      switch (value) {
        case TYPE.CROSS:
          timeline.push(fixation);
          break;
        case TYPE.DOGS:
          timeline.push({
            type: 'html-keyboard-response',
            stimulus:
              '<img id="dog" src="/image/E/d01.jpg"' +
              randomPlaceCSS(500, 0, 1000) +
              '>',
            choices: ['j', 'f'],
            trial_duration: 500,
            post_trial_gap: randomNum(100, 300),
          });
          break;
        case TYPE.CATS:
          timeline.push({
            type: 'html-keyboard-response',
            stimulus:
              '<img id="cat" src="/image/E/c01.jpg"' +
              randomPlaceCSS(500, 0, 1000) +
              '>',
            choices: ['j', 'f'],
            trial_duration: 500,
            post_trial_gap: randomNum(100, 300),
          });
          break;
        case TYPE.DOGS_WITH_SOUND:
          const cssStrDogs = randomPlaceCSS(500, 0, 1000);
          let dogsWithSound = {
            timeline: [dogs(cssStrDogs), sound_trial(cssStrDogs)],
          };
          timeline.push(dogsWithSound);
          break;
        case TYPE.CATS_WITH_SOUND:
          const cssStrCats = randomPlaceCSS(500, 0, 1000);
          let catsWithSound = {
            timeline: [cats(cssStrCats), sound_trial(cssStrCats)],
          };
          timeline.push(catsWithSound);
          break;
      }
    });
    return timeline;
  }

  _round() {
    const questions = this._start();
    const timeline = this._full_trail(questions);
    console.log(timeline);
    let questionsIndex = 0;
    const score = document.getElementById(this._clockId);
    score.innerHTML = '<br>';
    return new Promise((resolve) => {
      jsPsych.init({
        timeline: timeline,
        display_element: 'jspsych-experiment',
        on_trial_start: () => {
          score.innerHTML = this._tmpAll.Score;
          setTimeout(() => {
            const sound = document.getElementById('E_sound');
            if (sound) {
              sound.play();
            }
          }, 1);
        },
        on_trial_finish: () => {
          //if (
          //   questions[questionsIndex] == this._questionType.DOGS ||
          //   questions[questionsIndex] == this._questionType.CATS
          // ) {
          //   const lastData = JSON.parse(jsPsych.data.getLastTrialData().json());
          //   const localType =
          //     questions[questionsIndex] == this._questionType.DOGS ? 'j' : 'f';
          //   this._tmpAll.Score += localType == lastData[0].response ? 1 : 0;
          // }
          // questionsIndex++;
        },
        //============
        on_finish: () => {
          //     const { _questionType: TYPE } = this;
          //     const data = JSON.parse(jsPsych.data.get().json());
          //     console.log(data);
          //     //let tmpAll = this._tmpAll;
          //     let typeJ = null;
          //     data.map((value, index) => {
          //       switch (questions[index]) {
          //         case TYPE.CROSS:
          //           if (index > 0) this._one += '~';
          //           break;
          //         case TYPE.DOGS:
          //           typeJ = 'j';
          //         case TYPE.CATS:
          //           const type = typeJ || 'f';
          //           const clr = type == 'j' ? 1 : 2;
          //           const press =
          //             value.response == null ? 'NS' : value.response == 'j' ? 1 : 2;
          //           const acc = clr == press ? 1 : 0;
          //           const rt = value.rt == null ? 'NS' : Math.floor(value.rt);
          //           this._one += `${clr}_${press}_${acc}_${rt}`;

          //           if (acc == 1) {
          //             this._tmpAll.Acc++;
          //             this._tmpAll.RT += rt;
          //           }
          //           typeJ = null;
          //           break;
          //       }
          //     });
          resolve('end');
        },
      });
    });
  }

  async process() {
    await this._round();
    const { _questionsNum: num } = this;
    const { Acc, RT, Score } = this._tmpAll;
    // const { Acc, RT, SSD, Go_Acc, Go_RT, NCRate, NC_RT, mSSD, SSRT, Score } =
    //   this._tmpAll;
    //====================
    // this._all = `${Math.floor(Acc * 100) / num}_${Math.floor(
    //   RT / Acc
    // )}_${Math.floor(Go_Acc * 100)}_${Math.floor(
    //   Go_RT / this.corrAnsCount
    // )}_${Math.floor(NCRate * 100)}_${Math.floor(NC_RT)}_${Score}`;
    //===================
    // let allData = {
    //   Acc: 0,
    //   RT_count: 0,
    //   RT_time: 0,
    //   FA_RT_count: 0,
    //   FA_RT_time: 0,
    //   SSD: 0, //延遲時間(SSD)：記錄題示音出現的延遲時間，單位為毫秒(ms)。如果該題沒有題示音，則延遲時間紀錄為 NS。
    //   SS_Acc: 0, //題示音正確率(SS_Acc)：計算僅題示音出現的題目(200*25% = 50 題)，使用者的反應正確率，單位為百分比(%)。
    // };

    if (this._mode) return { one: this._one, all: this._all };
    return { one: this._one, all: this._all };
  }
}
