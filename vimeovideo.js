
function onTimeUpdate(e) {
	var delta = Math.max(0.5, 0.5 * this.playbackRate);
	if ( this.currentTime >= this.duration - delta ) {
		this.currentTime = 0;
	}
}

function createXButton($box, onClick) {
	var $button = $box.querySelector('button');
	$button.onclick = onClick;

	$button.onmouseover = function() {
		with ( this.previousElementSibling.classList ) {
			remove('hidden');
			remove('invisible');
			add('visible');
		}
	};
	$button.onmouseout = function() {
		with ( this.previousElementSibling.classList ) {
			add('hidden');
			add('invisible');
			remove('visible');
		}
	};

	return $button;
}

function createRepeatButton(video) {
	var $box = document.createElement('div');
	$box.className = 'box';

	var html = '';
	html += '<style>';
	html += 'html .player .repeat-button { color: white; font-weight: bold; }\n';
	html += 'html .player .repeat-button.on { background-color: rgb(0, 173, 239); }\n';
	html += 'html .player .repeat-button.on:active { background-color: rgb(0, 147, 203); }\n';
	html += '</style>';
	html += '<label class="rounded-box repeat-label invisible hidden" role="presentation"><span>TEKRAR ET</label>';
	html += '<button title="Videoyu tekrar izlemek için tıklayın." tabindex="50" class="repeat-button rounded-box" aria-label="Repeat">Tekrar</button>';
	$box.innerHTML = html;

	var $button = createXButton($box, function(e) {
		var repeating = this.classList.toggle('on');
		if ( repeating ) {
			video.addEventListener('timeupdate', onTimeUpdate);
		}
		else {
			video.removeEventListener('timeupdate', onTimeUpdate);
		}
	});

	return $box;
}


function addSpeedButtons() {
	var html = '';
	html += '<style>';
	html += 'html .player .speed-buttons { color: white; font-weight: bold; display:none; } \n';
	html += 'html .player .speed-buttons.on { background-color: rgb(0, 173, 239); } \n';
	html += 'html .player .speed-buttons.on:active { background-color: rgb(0, 147, 203); } \n';
	html += '</style>';	
	html += '<button id="speedbuttontwohalf" tabindex="50" class="speed-buttons rounded-box">2,5x</button>';	
	html += '<button id="speedbuttontwo" tabindex="50" class="speed-buttons rounded-box">2x</button>';
	html += '<button id="speedbuttononehalf" tabindex="50" class="speed-buttons rounded-box">1,5x</button>';
	html += '<button id="speedbuttonone" tabindex="50" class="speed-buttons rounded-box">1x</button>';	

	$("#speedbutton").parent().prepend(html);
}


function addBackwardButton() {
	var html = '';
	html += '<style>';
	html += 'html .player .backward-button { color: white; font-weight: bold; } \n';
	html += 'html .player .backward-button.on { background-color: rgb(0, 173, 239); } \n';
	html += 'html .player .backward-button.on:active { background-color: rgb(0, 147, 203); } \n';
	html += '</style>';	
	html += '<div class="box">';
	html += '<label class="rounded-box backward-label hidden invisible" role="presentation"><span>GERİ AL</span></label>';
	html += '<button id="backwardbutton" title="Videoyu 30 saniye geri al." tabindex="50" class="backward-button rounded-box" aria-label="Backward">-30sn</button>';
	html += '</div>';

	$("#speedbutton").parent().parent().append(html);
}


function addForwardButton() {
	var html = '';
	html += '<style>';
	html += 'html .player .forward-button { color: white; font-weight: bold; } \n';
	html += 'html .player .forward-button.on { background-color: rgb(0, 173, 239); } \n';
	html += 'html .player .forward-button.on:active { background-color: rgb(0, 147, 203); } \n';
	html += '</style>';		
	html += '<div class="box">';
	html += '<label class="rounded-box forward-label hidden invisible" role="presentation"><span>İLERİ AL</span></label>';
	html += '<button id="forwardbutton" title="Videoyu 30 saniye geri al." tabindex="50" class="forward-button rounded-box" aria-label="Forward">+30sn</button>';
	html += '</div>';	

	$("#speedbutton").parent().parent().append(html);
}

function createSpeedButton(video) {
	var $box = document.createElement('div');
	$box.className = 'box';

	var html = '';
	html += '<style>';
	html += 'html .player .speed-button { color: white; font-weight: bold; } \n';
	html += 'html .player .speed-button.on { background-color: rgb(0, 173, 239); } \n';
	html += 'html .player .speed-button.on:active { background-color: rgb(0, 147, 203); } \n';
	html += '</style>';
	html += '<button id="speedbutton" title="Tıkla ve Hız Ayarı Seç." tabindex="50" class="speed-button rounded-box">' + video.playbackRate + 'x</button>';
	$box.innerHTML = html;

	function setSpeed(speed) {
		video.playbackRate = speed;
		$button.textContent = (Math.round(speed * 100) / 100) + 'x';

		if ( video.playbackRate == 1 ) {
			$button.classList.remove('on');
		}
		else {
			$button.classList.add('on');
		}
	}

	var $button = createXButton($box, function(e) {
		if($(".speed-buttons").css("display") == "none"){
			$(".speed-buttons").css("display","block");
		} else {
			$(".speed-buttons").css("display","none");
		}
		
	});
	$button.onmousewheel = function(e) {
		var speeds = [0.2, 0.3333, 0.5, 0.6666, 1, 1.25, 1.5, 2, 2.5, 3, 4];

		e.preventDefault();

		var direction = e.wheelDelta / Math.abs(e.wheelDelta); // up = 1, down = -1
		var curSpeed = video.playbackRate,
			curSpeedIndex = speeds.indexOf(curSpeed);

		// On the scale, so find next by index
		if ( curSpeedIndex != -1 ) {
			if ( speeds[curSpeedIndex + direction] ) {
				setSpeed(speeds[curSpeedIndex + direction]);
			}
		}
		else {
			var candidates = speeds.filter(function(speed) {
				return direction > 0 ? (speed > curSpeed) : (speed < curSpeed);
			});
			if ( candidates.length ) {
				var newSpeed = direction > 0 ? candidates[0] : candidates[candidates.length-1];
				setSpeed(newSpeed);
			}
		}
	};

	return $box;
}



var $player = document.querySelector('div.player');
if ( $player ) {
	var mo = new MutationObserver(function(muts) {
		// Must do only once
		if ( !$player.classList.contains('did-vimeo-repeat') ) {
			var $buttons = $player.querySelector('.controls-wrapper .sidedock');
			var $video = $player.querySelector('video');

			// Need buttons menu & video element
			if ( $buttons && $video ) {
				// Must really do only once!
				mo.disconnect();

				$player.classList.add('did-vimeo-repeat');

				// Add REPEAT button
				var $box = createRepeatButton($video);
				$buttons.appendChild($box);

				// Add SPEED button
				var $box = createSpeedButton($video);
				$buttons.appendChild($box);

				addSpeedButtons();

				addBackwardButton();

				addForwardButton();
			}
		}
	});
	mo.observe($player, {"childList": 1})
}



$(function() {

	$(document).on( "click", ".speed-buttons", function() {

		var $playerj = document.querySelector('div.player');
		if ( $playerj ) {
					var $videoj = $playerj.querySelector('video');

					// Need buttons menu & video element
					if ( $videoj ) {

						if($(this).attr('id') == "speedbuttontwohalf"){
							$videoj.playbackRate = 2.5;
							$("#speedbutton").html("2.5x");
						}

						if($(this).attr('id') == "speedbuttontwo"){
							$videoj.playbackRate = 2;
							$("#speedbutton").html("2x");
						}	

						if($(this).attr('id') == "speedbuttononehalf"){
							$videoj.playbackRate = 1.5;
							$("#speedbutton").html("1.5x");
						}

						if($(this).attr('id') == "speedbuttonone"){
							$videoj.playbackRate = 1;
							$("#speedbutton").html("1x");
						}																		

					}

		}

		$(".speed-buttons").css("display","none");


	});



	$(document).on( "click", "#backwardbutton", function() {

		var $playerj = document.querySelector('div.player');
		if ( $playerj ) {
					var $videoj = $playerj.querySelector('video');

					// Need buttons menu & video element
					if ( $videoj ) {

						$videoj.currentTime = $videoj.currentTime - 30;																	

					}

		}

	});	



	$(document).on( "click", "#forwardbutton", function() {

		var $playerj = document.querySelector('div.player');
		if ( $playerj ) {
					var $videoj = $playerj.querySelector('video');

					// Need buttons menu & video element
					if ( $videoj ) {

						$videoj.currentTime = $videoj.currentTime + 30;																	

					}

		}

	});	




});



