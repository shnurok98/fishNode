const settings = {
	maxFish: 7,
	maxClicks: 10,
	maxBubble: 10
};

let human;
let arrFishes = [];

let score = 0;
let clicks = 10;

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

class User{
	constructor(obj){
		for(let key in obj){
			this[key] = obj[key];
		}
	}

	// TODO: Исправить error res.json во всех методах
	save(cb){
		let json = JSON.stringify(this);

		fetch(`http://localhost:3000/users`, {method: "POST", body: json, headers: myHeaders})
		.then(res => res.json())
		.then(res => {
			cb(null, res);
		})
		.catch((err) => {
			cb(err);
		});
	}

	saveScore(score, cb){
		let json = {
			'user_id': this.id,
			'score': score
		}
		json = JSON.stringify(json);
		fetch(`http://localhost:3000/scores`, {method: "POST", body: json, headers: myHeaders})
		.then( res => res.json() )
		.then( res => cb(null, res) )
		.catch( err => cb(err) );
	}

	getScore(cb){
		fetch(`http://localhost:3000/scores/${this.id}`, {headers: myHeaders})
		.then( res => res.json() )
		.then( res => cb(null, res) )
		.catch( err => cb(err) );
	}

	static getByName(name, cb){
		fetch(`http://localhost:3000/users/filter/${name}`)
		.then(res => res.json())
		.then(res => {
			cb(null, res);
		})
		.catch((err) => {
			cb(err);
		});
	}
}

class Fish{
	constructor(obj){
		for(let key in obj){
			this[key] = obj[key];
		}
		// init render
		$('.aquarium').append(`
			<p class="fish ${this.name}" style="top: ${this.styleTop}px; left: ${this.styleLeft}px;"></p>
		`);
	}

	moveTo(styleLeft, styleTop){
		let ang = this._getAngle(styleLeft, styleTop);
		// Поворот
		$('.' + this.name).css({ 'transform': 'rotate(' + ang + 'deg)', 'transition-duration': '1s' });
		$('.' + this.name).animate({'top': styleTop, 'left': styleLeft}, 1000);
		
		// Обновляем координаты рыбки
		this.styleTop = styleTop;
		this.styleLeft = styleLeft;
	}
	
	moveRand(){
		let fY = Math.round(Math.random()*((aH-100-2-30)-0)+0);
		let fX = Math.round(Math.random()*((aW-100-2-30)-0)+0);

		this.moveTo(fX, fY);
	}

	_getAngle(x, y){
		let top = this.styleTop;
		let left = this.styleLeft;

		let deg;

		if ((y < top)&&(x < left)){
			deg = 180 - (Math.atan2(Math.abs(left-x), Math.abs(top-y)) * 180) / Math.PI
		}
		if ((y < top)&&(x >= left)){
			deg = (Math.atan2(Math.abs(left-x), Math.abs(top-y)) * 180) / Math.PI - 180
		}
		if ((y >= top)&&(x < left)){
			deg = (Math.atan2(Math.abs(left-x), Math.abs(top-y)) * 180) / Math.PI
		}
		if ((y >= top)&&(x >= left)){
			deg = -(Math.atan2(Math.abs(left-x), Math.abs(top-y)) * 180) / Math.PI
		}
		deg-=90;

		return deg;
	}
}

// Пузырьки
let rX;
let dB;
// Размеры окна
let aH;
let aW;

let timerBubble;
let timerFish;

// Блок аквариума
let aqua;

window.onload = function(){
	// Размеры окна
	aqua = $('.aquarium');
	aH = aqua.height();
	aW = aqua.width();

	let timeoutFish;

	$('.null').click(function(){
		clicks--;
		$('#available_clicks').text('Clicks: ' + clicks);

		if(clicks <= 0){

			clearInterval(timerBubble);
			clearInterval(timerFish);
			clearInterval(timeoutFish);

			// Сохраняем счет игрока
			let sc = parseInt($('#score b').text());
			human.saveScore(sc, (err, res) => {
				if (err) console.error(err);
			});

			// Получаем его статистику
			human.getScore((err, res) => {
				if (err) console.error(err);

				$('.scores table').empty();
				for(let i = 0; i < res.length; i++){
					$('.scores table').append(`
						<tr>
							<td>${res[i].score}</td>
						</tr>	
					`);
				}
			});

			// Скрываем интерфейс
			$('.fish').css({'display': 'none'});
			$('.score_box').css({'display': 'none'});
			$('.end_game').css({'display': 'block'});
			$('#final_score').text('Your score: ' + score);

			// Удаляем рыбок
			$('.fish').remove();
			arrFishes = [];
		}
	});

}

// TODO: Вывести кнопку настроек на end_game
// TODO: Улучшить интерфейс

function startGame(){

	// Получаем юзера
	let name = $('#nameId').val();
	User.getByName(name, (err, user) => {
		if (err) {
			user = new User( {'name': name} );
			user.save( (err, user) => {
				if (err) console.error(err);
				human = new User(user);
			});
		}
		if (user) {
			human = new User(user);
		}
	});

	// Игровой интерфейс вкл
	$('.armor').css({'display': 'none'});
	$('.score_box').css({'display': 'block'});


	clicks = settings.maxClicks;
	score = 0;
	$('#available_clicks').text('Clicks: ' + clicks);
	$('#score b').text(score);


	$('.start').css({'display': 'none'});
	$('.end_game').css({'display': 'none'});


	// Создаем массив с рыбками
	for(let i = 0; i < settings.maxFish; i++){
		arrFishes.push(new Fish({name: `f${i}`, styleLeft: 10 * i, styleTop: 10 * i}));
	}

	// Вешаем клики на рыбок
	$('.fish').click(function(e){
		score++;
		$('#score b').text(score);
		let curFish = e.currentTarget.classList[1];
		$('.' + curFish).css({'display': 'none'});

		// Обозначаем возвращение рыбки
		timeoutFish = setInterval(function(){
			$('.' + curFish).css({'display': 'inline-block'});
		}, 5000);
	});

	let i = 0;
	timerBubble = setInterval(function(){
		if($('.bubble').length < settings.maxBubble){
			dB = Math.round(Math.random()*(80-10)+10);
			rX = Math.round(Math.random()*((aW-dB)-0)+0);
			//aquarium
			$('.aquarium').append('<p class="bubble b' + i + '" style="top:' + (aH-dB-2) +'; left:' + (rX-3) + ' "></p>');
			$('.b'+i).css({'width': dB, 'height': dB});
			
			$('.b'+i).animate({'top': '0px'}, (1500/(dB*0.01)), function(){
				$(this).css({'display': 'none'});
				$(this).remove();
			});

			i++;
		}

	}, 1000);

	$('.fish').css({'display': 'block'});

	// Таймер для рыбок
	timerFish = setInterval(function(){
		for (let i = 0; i < arrFishes.length; i++) {
			arrFishes[i].moveRand();
		}
	}, 2000);
}


function onShowSettings(){
	aqua.append(`<div id="settings">
			<form name="formSettings">
				<label>Кол-во рыбок: <input type="number" min="0" value="${settings.maxFish}" name="maxFish"></br></label>
				<label>Кол-во пузырей: <input type="number" min="0" value="${settings.maxBubble}" name="maxBubble"></br></label>
				<label>Кол-во кликов: <input type="number" min="0" value="${settings.maxClicks}" name="maxClicks"></br></label>
			</form>
			<button onclick="onAcceptSettings()">OK</button>
		</div>`);
}

function onAcceptSettings(){
	settings.maxFish = Number(document.forms.formSettings.maxFish.value);
	settings.maxBubble = Number(document.forms.formSettings.maxBubble.value);
	settings.maxClicks = Number(document.forms.formSettings.maxClicks.value);
	onHideSettings();
}

function onHideSettings(){
	$('#settings').remove();
}