let human = {'id': 0, 'name': 'default'};

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

async function onGetUserByName(){
	try{
		let name = $('#nameId').val();
		let res = await fetch(`http://192.168.3.121:3000/users/filter/${name}`);
		let data = await res.json();

		human.id = data.id;
		human.name = data.name;
	}catch(err){
		onCreateUser();
		//console.log(err);
	}
}

async function onCreateUser(){
	try{
		let name = $('#nameId').val();
		let form = new FormData(document.getElementById('userForm'));

			//FormData-->JSON
			var object = {};
			form.forEach(function(value, key){
			    object[key] = value;
			});
			var json = JSON.stringify(object);

		let res = await fetch(`http://192.168.3.121:3000/users`, {method: "POST", body: json, headers: myHeaders});
		let data = await res.json();
		human.id = data.id;
		human.name = data.name;
	}catch(err){
		console.log('User not created');
	}
}

async function onSetScoreUser(){
	try{
		let sc = parseInt($('#score b').text());
		let us = human.id;
		
		let json = {
			'user_id': us,
			'score': sc
		}
		json = JSON.stringify(json);
		let res = await fetch(`http://192.168.3.121:3000/scores`, {method: "POST", body: json, headers: myHeaders});
		let data = await res.json();
	}catch(err){
		console.log(err);
	}
}

async function onGetScoreUser(userId){
	try{
		let res = await fetch(`http://192.168.3.121:3000/scores/${userId}`, {headers: myHeaders});
		let data = await res.json();
		$('.scores table').empty();
		for(let i=0; i<data.length; i++){
			$('.scores table').append(`
				<tr>
					<td>${data[i].score}</td>
				</tr>	
			`);
		}
	}catch(err){
		console.log(err);
	}
}



let maxBubble = 10;
let i = 0;
let j = 0;
let rX;
let dB;
let aH;
let aW;

let startBox;
let timerBubble;
let timerFish;

let score = 0;
let clicks = 10;


let f1;
let f2;
let f3;

window.onload = function(){
	startBox = $('.start');
	f1 = $('.f1');
	f2 = $('.f2');
	f3 = $('.f3');
	f4 = $('.f4');
	f5 = $('.f5');
	f6 = $('.f6');
	f7 = $('.f7');

	let timeoutFish;
	$('.null').click(function(){
		clicks--;
		$('#available_clicks').text('Clicks: ' + clicks);
		if(clicks <= 0){
			clearInterval(timerBubble);
			clearInterval(timerFish);
			clearInterval(timeoutFish);
			the_end = 1;
			onSetScoreUser();
			onGetScoreUser(human.id);
			$('.fish').css({'display': 'none'});
			$('.score_box').css({'display': 'none'});
			$('.end_game').css({'display': 'block'});
			$('#final_score').text('Your score: ' + score);
		}
	});
	$('.fish').click(function(e){
		score++;
		$('#score b').text(score);
		let curFish = e.currentTarget.classList[1];
		$('.' + curFish).css({'display': 'none'});
		timeoutFish = setInterval(function(){

				if(the_end == 0){
					$('.' + curFish).css({'display': 'inline-block'});
				}

		}, 5000);
	});
}
let the_end = 0;

function startGame(r){
	onGetUserByName();
	$('.armor').css({'display': 'none'});
	$('.score_box').css({'display': 'block'});
	the_end = 0;
	

	if(r == 0){
		clicks = 10;
		score = 0;
		$('#available_clicks').text('Clicks: ' + clicks);
		$('#score b').text(score);
	}
	let aqua = $('.aquarium');
	aH = aqua.height();
	aW = aqua.width();
	//console.log(aH);
	$('.start').css({'display': 'none'});
	$('.end_game').css({'display': 'none'});
	timerBubble = setInterval(function(){
		if(i < maxBubble){
			dB = Math.round(Math.random()*(80-10)+10);
			rX = Math.round(Math.random()*((aW-dB)-0)+0);
			//aquarium
			$('.aquarium').append('<p class="bubble b' + i + '" style="top:' + (aH-dB-2) +'; left:' + (rX-3) + ' "></p>');
			$('.b'+i).css({'width': dB, 'height': dB});
			
			$('.b'+i).animate({'top': '0px'}, (1500/(dB*0.01)), function(){
				$(this).css({'display': 'none'});
				$(this).remove();
				if(i == 9){i=0};
			});
			if(i == 9){
				i=0;
			}else{
				i++;
			};
		}

	}, 1000);

	$('.fish').css({'display': 'block'});


	timerFish = setInterval(function(){

		let fY = Math.round(Math.random()*((aH-100-2)-0)+0);
		let fX = Math.round(Math.random()*((aW-100-2)-0)+0);

		let styleTop = fY;
		let styleLeft = fX;

		moveFish(f1, styleTop, styleLeft);
		moveFish(f2, styleTop, styleLeft);
		moveFish(f3, styleTop, styleLeft);
		moveFish(f4, styleTop, styleLeft);
		moveFish(f5, styleTop, styleLeft);
		moveFish(f6, styleTop, styleLeft);
		moveFish(f7, styleTop, styleLeft);

		
		j++;
	}, 2000);
}

function moveFish(fish, styleTop, styleLeft){
	let lineY = Math.round(Math.random()*(styleTop-0)+0);
	let lineX = Math.round(Math.random()*(styleLeft-0)+0);

	let ang = getAngle(fish, lineY, lineX);

	fish.rotate({animateTo: ang, duration: 1000, callback: function(){
		$(this).animate({'top': lineY, 'left': lineX}, 1000);
	}});
}

function getAngle(item, avTop, avLeft){
	let angle = 0;

	let top = item.css('top');
	let left = item.css('left');

	top = top.replace('px', '');
	left = left.replace('px', '');

	top = Number(top);
	left = Number(left);

	let deg;

	if ((avTop < top)&&(avLeft < left)){
		deg = 180 - (Math.atan2(Math.abs(left-avLeft), Math.abs(top-avTop)) * 180) / Math.PI
	}
	if ((avTop < top)&&(avLeft >= left)){
		deg = (Math.atan2(Math.abs(left-avLeft), Math.abs(top-avTop)) * 180) / Math.PI - 180
	}
	if ((avTop >= top)&&(avLeft < left)){
		deg = (Math.atan2(Math.abs(left-avLeft), Math.abs(top-avTop)) * 180) / Math.PI
	}
	if ((avTop >= top)&&(avLeft >= left)){
		deg = -(Math.atan2(Math.abs(left-avLeft), Math.abs(top-avTop)) * 180) / Math.PI
	}
	deg-=90;

	return deg;
}