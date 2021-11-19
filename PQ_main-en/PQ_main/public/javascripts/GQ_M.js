class M {
	constructor(dataList, ID, password, url) {
		this.dataList = dataList;
		this.player = videojs('MyVideo', {
			width: '600',
			height: '400px',
			controls: true,
			autoplay: false,
			preload: 'auto',
			muted: true,
		});
		this.ID = ID;
		this.password = password;
		this.url = url;
	}

	//method
	Go(round, situation) {
		//事件流程 => 影片加載完成->播放完畢->點擊答案確認成功->加載影片  ( loop end )
		//one:回傳數據, player:播放器,order:隨機順序,round:第幾回合,feedback是否回傳數據(練習模式不回傳)
		var ID;
		var password;
		var origin_round;
		var one;
		var player = this.player;
		var data = this.dataList;
		var feedback;
		var url = this.url;
		var answer = [0, 0, 0, 0];
		ID = this.ID;
		password = this.password;
		function init() {
			origin_round = round;
			if (round <= 5) feedback = false;
			else feedback = true;
			round--;
			var path = url + '?path=video/M/' + data[round].filepath + '.mp4';
			player.src({
				src: path,
				type: 'video/mp4',
			});
			one = '';
			player.controls(false);
			$('#Lplayer').text(data[round].names.split('/')[0]);
			$('#Rplayer').text(data[round].names.split('/')[1]);
			$('.row').show();
			$('#MyVideo').show();
			$('#question').hide();
			$('#warning').text('影片只能播放一次, 請等縮圖出現後再進行播放');
		}
		function originSelect(round) {
			for (var i = 1; i <= 4; i++)
				document.getElementById('Select' + i).selectedIndex = 0;
			$('#warning').text(
				(parseInt(origin_round) - parseInt(round)).toString() +
					'. 請依據影片選出最適合的答案'
			);
		}
		init();
		//播放時關閉控制列
		player.on('play', () => {
			player.controls(false);
		});
		player.on('canplaythrough', function () {
			player.controls(true);
		});
		//播放結束開啟新循環
		player.on('ended', () => {
			$('#MyVideo').hide();
			originSelect(round);
			$('#question').show();
			if (round > 0) {
				round--;
				var path = url + '?path=video/M/' + data[round].filepath + '.mp4';
				player.src({
					src: path,
					type: 'video/mp4',
				});
			} else {
				round--;
			}
		});
		//確認填寫結果
		function noWrite() {
			for (var i = 1; i <= 4; i++)
				if ($('#Select' + i).val() == null) return true;
			return false;
		}
		$('#confirm').click(function () {
			if (noWrite()) alert('有答案沒填寫');
			else {
				let tmp = round + 1;
				const result1 = data[tmp].win == $('#Select' + 1).val() ? 1 : 0;
				const result2 = data[tmp].hand == $('#Select' + 2).val() ? 1 : 0;
				const result3 = data[tmp].ans3 == $('#Select' + 3).val() ? 1 : 0;
				const result4 = data[tmp].ans4 == $('#Select' + 4).val() ? 1 : 0;
				one += data[tmp].filepath + '_';
				one +=
					data[tmp].names +
					'_' +
					data[tmp].win +
					'_' +
					$('#Select' + 1).val() +
					'_' +
					result1 +
					'_';
				one +=
					data[tmp].hand + '_' + $('#Select' + 2).val() + '_' + result2 + '_';
				one +=
					data[tmp].ans3 + '_' + $('#Select' + 3).val() + '_' + result3 + '_';
				one += data[tmp].ans4 + '_' + $('#Select' + 4).val() + '_' + result4;
				answer[0] += result1;
				answer[1] += result2;
				answer[2] += result3;
				answer[3] += result4;
				if (feedback) {
					var videoAns =
						(data[tmp].win == $('#Select' + 1).val() ? 'Corr1' : 'InCorr1') +
						'_' +
						(data[tmp].hand == $('#Select' + 2).val() ? 'Corr2' : 'InCorr2') +
						'_' +
						(data[tmp].ans3 == $('#Select' + 3).val() ? 'Corr3' : 'InCorr3') +
						'_' +
						(data[tmp].ans4 == $('#Select' + 4).val() ? 'Corr4' : 'InCorr4');
					$.post(
						'/GQ/SQ/videoResult',
						{
							ID: ID,
							password: password,
							pathname: data[tmp].filepath,
							ans: videoAns,
						},
						function (result) {
							if (result.result != 'success') alert(result.result);
						}
					);
				}
				//完成填答,進入下一題
				if (round > -1) {
					one += '~';
					$('#Lplayer').text(data[round].names.split('/')[0]);
					$('#Rplayer').text(data[round].names.split('/')[1]);
					$('#MyVideo').show();
					$('#question').hide();
					$('#warning').text('影片只能播放一次, 請等縮圖出現後再進行播放');
				} else {
					$('#question').hide();
					$('#warning').text('');
					for (var i = 1; i <= 4; i++)
						$('#R' + i).text(
							'( ' + answer[i - 1] + ' / ' + origin_round + ' )'
						);
					$('#final_result').show();
					$('#final_confirm').show();
					$('#final_confirm').one('click', function () {
						if (feedback) {
							localStorage.setItem('GQone', one);
							localStorage.setItem('GQtype', 'M');
							let tmpArr = [situation.toString()];
							answer.forEach((element) => {
								tmpArr.push((element / origin_round).toFixed(3).toString());
							});
							$.post(
								'/GQ/SQ/saveData',
								{
									ID: ID,
									password: password,
									one: one,
									group: tmpArr.join('_'),
									type: 'M',
								},
								function (result, textStatus, jqXHR) {
									if (textStatus == 'success') {
										if (result.result == 'success') {
											localStorage.removeItem('GQone');
											// localStorage.removeItem('GQtype');
											$('form').submit();
										} else {
											alert(
												result.result +
													'已紀錄資料在本電腦, 可先關閉程式, 下次開啟本問卷會要求上傳'
											);
											$('form').submit();
										}
									} else {
										alert('伺服器無回應,請稍後再試');
									}
								}
							).fail(() => {
								alert(
									'Unexpected error. As the data has been save in local, you can leave the system, and the files will be uploaded again next time you enter the program.'
								);
							});
						} else {
							location.reload();
						}
					});
				}
			}
		});
	}
}
