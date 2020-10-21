﻿'use strict';
var express = require('express');
var router = express.Router();
var SQ = require('./SQ');
var PR = require('./PR');

/**********************
定const
 ***********************/

const Questionary_licence = ['Q1', 'Q2', 'Q3', 'Q4', "Q5", "Q6", "Q7", "Q8"];
const csv_title = {};
//csv_title[0] = "姓名,性別,年齡,生日,身份證字號,身高(cm),體重(kg),聯絡電話,聯絡地址?,常用Email,就讀學校,系級,接觸桌球之球齡,近兩年最佳成績表現,平時慣用手,打桌球時慣用手,教練,一對一練習時數,團練時數,";
csv_title[Questionary_licence[0]] = "1. 在每一天或每一週的練習，我都會設立一個特別的目標來引導自己練習。,2. 我會把自己最大的天份及技能表現出來。 ,3. 當教練告訴我如何改正錯誤時，我傾向於獨自承受並且 感到煩惱。,4. 當我在從事運動時，我能夠集中注意力而不會分心。,5. 在比賽時無論情況如何糟糕，我會保持積極及熱忱的態度。,6. 在有壓力下我傾向於會表現的更好，因為腦筋會更清楚。,7. 我相當擔心別人對於我的表現的看法。,8. 為了達到自己的目標，我會傾向於做一些計劃。,9. 我對於自己即將會表現的很好相當有信心。,10. 當教練批評我時，我會感到煩惱而不是得到幫助。,11. 當我聽到或看到什麼時，並不會產生分離思考而造成干擾，這對我來說是容易的。,12. 我會擔心自己的表現，因此給自己很多壓力。,13. 在每一次的練習中，我會設定自己的表現目標。,14. 我不必別人催我努力練習，也會 100%的付出。,15. 假如教練對我有所批評或大叫時，我會改正錯誤而不會覺得很難過。,16. 在我的運動領域中，對於一些突發的狀況我能夠處理的很好。,17. 當事情變糟時，我通常會告訴自己冷靜下來，而且非常有效。,18. 比赛中的壓力越大時，我越能夠享受它。,19. 在比赛時，我會害怕犯錯或無法成功。,20. 比賽開始之前，在我的腦海中已經蘊釀了一套自己的比賽計劃。,21. 當我覺得自己太緊張時，我能夠很快的放鬆身體並且鎮定下來。,22. 有壓力的情境對我而言是一種挑戰，我樂於接受。,23. 我會想像如果自己失敗或放棄了會發生什麼事。,24. 無論發生什麼事情，我都能控制自己的情緒。,25. 我能夠很容易的引導自己的注意力焦點在單一的人或物體上。,26. 當我沒有達到目標時，會激勵我更加的努力。 ,27. 我會仔細的聆聽教練的指示及建議，並以此來改善自己的技術。,28. 當壓來臨時我很少犯錯，因為我會更專注。";
csv_title[Questionary_licence[1]] = "1. 每次一練習，我會設定自己想達成的目標。,2. 練習時，不用教練督促，我會自動自發的練習。,3. 我可以將注意力集中在比賽上而不分心。,4. 我會仔細聆聽教練的忠告和指示而獲得技巧的進步。,5. 當我設定的目標未達成時，我會更努力的練習。,6. 比賽或練習我總是全力以赴，不需要被別人強迫表現。,7. 比賽中我很容易受到一些因素的干擾而分心。,8. 對教練的指示我會虛心接受與遵照行事。,9. 對於平常的訓練，我會有很高的自我要求。,10. 當比賽氣氛越緊張時，我越能感受比賽的樂趣。,11. 比賽中遇到不滿意的情況時，我會激勵自己振作。,12. 比賽中我會一直想到剛才的失誤，而無法集中注意力在比賽上。,13. 我常懷疑自己的運動實力。,14. 我會做許多規劃以達到自己的目標。,15. 在比賽中，我會因為觀眾的干擾而分心。,16. 我覺得自己的各方面條件都比對手好。,17. 教練或別人對我的批評，我會參考反省改進。,18. 在平常的訓練外，我會再另外找時間練習。,19. 我喜歡把有壓力感覺的比賽視為一種挑戰。,20. 當感覺到自己太緊張時，我能夠很快的放鬆身體並且鎮定下來。,21. 我會虛心接受教練的指導與糾正。,22. 我對自己的運動技術很有信心。,23. 我會以每天或每週為單元，設定訓練的目標來引導自己練習。,24. 外界的壓力不會影響到我的表現。,25. 比賽中我可以運用放鬆技巧以紓解壓力。,26. 當比賽場上情況變糟時，我會告訴自己要保持冷靜。,27. 當教練告訴我要如何改正錯誤動作時，我會認為他是在找我麻煩。,28. 面對失誤與挫折時，我會運用正面思考的策略穩定自己情緒。,29. 失誤時我能冷靜思考、自我調整，避免再失誤。,30. 我會要求自己比別人多花一些時間練習。,31. 我有信心在比賽中會表現的很好。";
csv_title[Questionary_licence[2]] = "1. 我感到輕鬆自在。,2. 我覺得神經過敏。,3. 我感到舒適。,4. 我擔心自己無法在比賽中發揮應有的實力。,5. 我覺得有自信。,6. 我擔心輸掉比賽。,7．我覺得胃部緊縮。,8．我感到安心。 ,9．我有信心克服挑戰。,10. 我擔心表現不佳。,11. 我心跳急速。,12. 我有信心表現良好。,13. 我擔心是否能達成自己的目標。,14. 我感到胃下垂。,15. 我心情覺得輕鬆。,16. 我擔心其他人對我的表現感到失望。,17．我的手心出汗。,18．我有自信，因為我預計能達到自己的目標。,19．我擔心自己無法專注比賽。,20. 我感到全身緊繃。,21．我有信心突破壓力。 ";
csv_title[Questionary_licence[3]] = "1. 我想像自己能修正發球技術上的缺點。,2. 我想像自己修正發球動作的技巧。,3. 我想像成功地執行發球技巧。,4. 我在腦中想像發球的戰術。,5. 為了預防戰而失效，我可以想像替代的策略。,6. 我想像擬定未來的比賽計畫。, 7. 我想像比賽計畫的每個細節（例如進攻與守、快慢節奏等）。,8. 我想像自己赢得一面獎牌。, 9. 我想像自己上臺領獎。,10. 我想像在比賽中贏得勝利。,11. 我想像其他運動員因為我的好表現而鼓勵我。,12. 我想像從事自己擅長的運動時，會產生正面的情緒。,13. 我想像從事擅長的運動時，會感覺到期待與興奮。,14. 我想像在運動表現時感覺到興奮。,15. 我想像即使比賽進行得不順利，仍舊付出 100%的努力。,16. 我想像自己在遭遇挫折後，依然能保持正面態度。,17. 我想像在艱難的情境中保持自信。,18. 我想像自己是堅強的。";
csv_title[Questionary_licence[4]] = "1. 我相信我的能力足以面對桌球訓練中的挑戰。,2. 我的能力與我所面對的桌球動作大致相符合。,3. 我認為我有足夠的能力勝任更高層次的挑戰。,4. 我不需太多思考就能做出正確的動作。,5. 從事桌球運動時，我感覺我動作、呼吸順暢。,6. 我總是知道接下來要做什麼動作。,7. 我總是能很快就進入狀況，沈浸在快樂之中。,8. 我總是能很快找到我想要的感覺。 ,9. 從事桌球運動時，我會將注意力集中正在進行的動作上。,10. 從事桌球運動時，我能夠完全專注。 ,11. 我對正在進行的動作能操控自如。,12. 從事桌球運動時，我能完全控制我的身體。,13. 我感覺我能控制正在做的動作。,14. 從事桌球運動時，我總是覺得時間過得特別快。,15. 以我的專項運動項目來看，我的身材勻稱合宜。,16. 從事桌球運動時，控制好自己的身體動作對我而言是簡單的。,17. 我覺得從事桌球運動是一件非常快樂的事情。,18. 我不會在意別人如何看待我。,19. 我不必擔心我的桌球表現。,20. 從事桌球運動時，若沒其他事物提醒，我不會注意時間。,21. 從事桌球運動時，時間似乎停止了。,22. 我會專注在動作上面忘了自我。,23. 我喜歡從事桌球運動的感覺，並且想要再次獲得此感覺。,24. 從事完桌球運動後，讓我感覺很好。,25．從事桌球運動時，我樂在其中。";
csv_title[Questionary_licence[5]] = "1．和別人比賽是一件很愉快的事。,2．在比賽前，我會感到不安。 ,3．在比賽前，我會擔心表現欠佳。 ,4．在比賽時，我是一位好的運動員。 ,5．在比賽時，我擔心失誤。 ,6．在比賽前，我是冷静的。,7．在比賽時，設定一項目標是重要的。,8．在比賽前，我會覺得反胃。 ,9．比賽前一刻，我感覺我的心跳比平常快。,10．我喜歡在耗體力的競賽中比賽。,11．在比賽前，我覺得心情輕鬆。 ,12．在比賽前，我覺得神經緊張。 ,12．在比賽前，我覺得神經緊張。 ,14．在比賽前，我感覺神經緊張，肌肉僵硬。";
csv_title[Questionary_licence[6]] = "1. 通常我能知道自己會有某些感受的原因。,2. 我很了解自己的情緒。,3. 我真的能明白自己的感受。,4. 我常常知道自己為什麼覺得開心或不高興。,5. 遇到困難時，我能控制自己的脾氣。 ,6. 我很能控制自己的情緒。,7. 當我憤怒時，我通常能在很短的時間內冷靜下來。,8. 我對自己的情緒有很強的控制能力。,9. 我通常能為自己制定目標並盡量完成這些目標。 ,10. 我經常告訴自己是一個有能力的人。 ,11. 我是一個能鼓勵自己的人。 ,12. 我經常鼓勵自己要做到最好。,13. 我通常能從朋友的行為中猜到他們的情緒。 ,14. 我觀察別人情緒的能力很強。,15. 我能很敏銳地洞悉別人的感受和情绪。 ,16. 我很了解身邊的人的情緒。 ";
csv_title[Questionary_licence[7]] = "A 能和別人相處融洽_B 對自己沒有信心_C 能徹底執行任何一項工作_D容易有點情緒化~A 不喜歡和別人在一起_B 不會焦慮或緊張_C 一位很不可信賴的人_D 在團體討論中，居領導的地位~A 行事有點緊張兮兮的_B 能強烈的影響別人_C 不喜歡社交性的聚會_D 一位很堅毅而穩健的工作者~A 容易結交新朋友_B 不能長久堅守相同的工作_C 容易受到別人支配_D 即使遭遇挫折，也能自我控制~A 能獨自做重要的決斷_B 不容易和陌生人交往_C 容易緊張或敏感激動_D 儘管有困難，還是會完成工作~A 不太有興趣於人際交往_B 不能認真地負起責任_C 時常保持穩健而鎮靜_D 在團體活動中常居於領導地位~A 可以信賴的人_B 事情不順利時，容易心情煩躁_C 對自己的意見不太有把握_D 比較喜歡有人作伴~A 覺得影響別人是容易的_B 遇到任何阻礙，都要把工作做完_C 社交關係僅限於少數幾個人_D 是一位比較神經過敏的人~A 不太容易結交朋友_B 能積極參與團體事務_C 能履行例行職責至完成為止_D 情緒不太穩定平衡~A 確信和別人的關係_B 情感頗易受到傷害_C 具有很好的工作習慣_D 只願和少數朋友來往~A 有點容易激動_B 能夠應付任何情況_C 不喜歡和陌生人交談_D 對任何從事的工作能貫徹始終~A 不喜歡和別人爭論_B 不能照預定的計畫表行事_C 一位鎮靜而不易激動的人_D 非常喜好社交活動~A 不會煩惱或憂慮_B 缺乏責任感_C 對認識各種人不感興趣_D 善於管理他人~A 容易和別人友善相處_B 在團體活動中，寧願讓別人領導_C 似有一種容易憂慮的本性_D 能不顧任何困難終於一項任務~A 能左右他人的意見_B 缺乏參加團體活動的興趣_C 一位相當神經質的人_D 對所擔任的工作，能堅持到底~A 態度鎮定而悠閒_B 不能堅守手邊的工作_C 喜歡周圍有許多人_D 對自己能力不太有信心~A 可以讓人充分信賴_B 不關心身邊多數人的情況_C 覺得很難放鬆心情_D 在團體討論中擔負積極角色~A 對一個問題，不輕易的放棄_B 顯得有點緊張的樣子_C 缺乏自信_D 喜歡和其他伙伴消磨時間~A 一位很有創意的思考者_B 一位有點遲鈍而懶散的人_C 喜歡批評別人_D 做決定總覺經過多方考慮~A 相信每個人在本質上是誠實的_B 在工作或娛樂時喜歡輕鬆以赴_C 具有很愛追根究柢的態度_D 做事很容易衝動~A 一位精力很充沛的人_B 不太會跟人發脾氣_C 不喜歡研究複雜而困難的問題_D 較喜歡熱鬧而輕鬆的聚會~A 喜歡討論各種想法_B 有點容易對從事的事物厭倦_C 經常三思而後行_D 不大信任別人~A 喜歡主要具有構想的工作_B 做事的步調比較緩慢_C 每當要做決定總是很謹慎_D 覺得很多人不易相處~A 喜歡投機或冒風險_B 很容易被人激怒_C 在短時間內能做完很多事情_D 花費很多時間思考新點子~A 一位很有耐性的人_B 喜歡找刺激和快感_C 能長時間不停的工作_D 寧願執行計畫而不願研擬計畫~A 一天終了總覺得很疲倦_B 常做匆促或草率的判斷_C 不怨恨別人_D 有強烈的求知慾~A 不會因一時衝動而行事_B 因別人的錯誤而動怒_C 沒有興趣去做批判性思考_D 寧願迅速地工作~A 常因別人而變得很苦惱_B 喜歡整天忙個不停_C 寧願不投機或冒風險_D 寧願做不太需要原創思考的工~A 一位小心謹慎的人_B 比較喜歡慢慢地工作_C 很圓滑而又有外交手腕_D 寧願不做深奧的思考~A 對人容易失去耐心_B 比大多數人略少些持久力_C 容易表現獨創性特質_D 不太喜歡興奮刺激的事~A 易於憑預感行事_B 具有旺盛的精力和驅策力_C 除非有事實證明，不輕信別人_D 喜歡富有思考性的問題~A 不喜歡以快步調地工作_B 對別人深具信心_C 行事易流於一廂情願_D 喜歡解決複雜的問題~A 一位精力充沛的工作者_B 欣然接受別人的批評_C 不喜歡含有大量推理的問題_D 喜歡先行動而後思考~A 只談論別人的長處_B 行動之前非常謹慎_C 對需要動腦筋思考的討論不感興趣_D 不會趕著到處辦事~A 沒有尋根究底的精神_B 不會憑一時衝動行事_C 經常充滿活力_D 由於別人的缺點而發怒~A 能比別人做更多的事_B 只為找刺激而去碰運氣_C 當受到批評時會動怒_D 寧願做勞心的工作~A 非常相信別人_B 比較喜歡例行和簡單的工作_C 憑著一時的衝動而行事_D 有充沛的精力和活力~A 常常突然做決定_B 對每個人都有好感_C 在工作或娛樂時都保持快活的步調_D 對於求知缺乏濃厚的興趣";

/**********************
use sub route
 ***********************/
router.use('/SQ', SQ);
router.use('/PR', PR);

/**********************
 ./QQ/EQ
 ***********************/
router.post('/EQ', function (req, res) {
    res.render('QQ/EQ', { ID: req.body.ID, password: req.body.password });
});

/**********************
./GQ/Questionary/: which
 ***********************/

router.post('/Questionary/:which', function (req, res) {
    if (Questionary_licence.indexOf(req.params.which) > -1)
        res.render('QQ/questionary/' + req.params.which, { ID: req.body.ID, password: req.body.password, title: csv_title[req.params.which] });
    else
        res.render("warming", { message: "該操作不合法" });
});

module.exports = router;