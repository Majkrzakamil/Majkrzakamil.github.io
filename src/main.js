let selected = [];
let score = 0;
let mistakes = 0;
let isOpen = false;
let flow = [
		'head',
		'neck',
		'body',
		'left-arm',
		'right-arm',
		'left-hand',
		'right-hand',
		'right-leg',
		'left-leg',
		'right-foot',
		'left-foot'
];

function hang() {
	const className = flow[mistakes - 1];
	const bodyPart = document.getElementsByClassName(className);
	bodyPart[0].classList.remove('hide');
}
 
function fetchWord() {
	const url = 'https://wordsapiv1.p.mashape.com/words?random=true';
 	const params = {
			headers: {
					'X-Mashape-Key': 'RAcMNbfAzbmshmWkzf5JiybvoAX0p1YDkqYjsnmdYylvhP8xjR'
			},
			method: 'GET'
	};
 
	fetch(url, params)
		.then(data => {
			return data.json()
		})
		.then(res => {
			word = res.word;
			console.log('The hidden word is: ' + word)
			createPlaceholder(word);
		})
		.catch(error =>
			console.log(error)
		);
}
 
window.onload = () => {
	fetchWord();
}
 
function restart() {
	fetchWord();
	hideHangman();
	isOpen = false;
	death();
}
 
function createPlaceholder() {
	let container = document.getElementById('word');
	
    if (container.childNodes.length > 0){
        container.removeChild(container.firstChild);
    }
 
    for (let i = 0; i < word.length; i++) {
		let div = document.createElement('div');
		
		if(word[i] === '-') {
			div.innerHTML = '-';
		} else if(word[i] === ' '){
			div.innerHTML = '_';
			score++;
		} else {
			div.innerHTML = '';
		}

		container.appendChild(div);
    }
}

function result() {
	const modal = document.getElementById('modal');
	const result = document.getElementById('result');

  	if(mistakes > 10) {
		death();
		modal.style.display = 'block';
		isOpen = true;
		result.innerHTML = 'Game over';
	} else if(score === word.length) {
		modal.style.display = 'block';
		isOpen = true;
		result.innerHTML = 'Victory!';
	}
}

function checkLetter(e){
    let letter;
    let placeholder = document.getElementById('word').childNodes;
    let container = document.getElementById('wrong');
 
    if(window.event) {                  
        letter = String.fromCharCode(e.keyCode).toLowerCase();
    } else if(e.which){                
        letter = String.fromCharCode(e.which).toLowerCase();
    }
 
    if(word.includes(letter) && letter !== '-' && !selected.includes(letter)) {
		for(let i = 0; i < word.length; i++){
			if(word[i] === letter){
				placeholder[i].textContent = letter;
				score++
			}
		}
		selected.push(letter);
		
    } else if(!selected.includes(letter)) {
        let span = document.createElement('span');
        span.innerHTML = letter;
        container.appendChild(span);
        selected.push(letter);
		mistakes++;
		hang();
    }
	
	result();
}

function death() {
	let eyes = document.getElementsByClassName('death');
	for(let i = 0; i < eyes.length; i++){
		eyes[i].classList.toggle('hide');
	}
}
 
function gameControl(){
    selected = [];
    score = 0;
	mistakes = 0;
	
    let letters = document.getElementById("word");
	let wrong = document.getElementById("wrong");
	const modal = document.getElementById('modal');
	modal.style.display = 'none';

    while (letters.firstChild) {
        letters.removeChild(letters.firstChild);
    }
    while (wrong.firstChild) {
        wrong.removeChild(wrong.firstChild);
	}
    restart();
}

function hideHangman() {
	flow.forEach((el) =>{
		const bodyPart = document.getElementsByClassName(el);
		if(bodyPart[0].classList[1] !== 'hide'){
			bodyPart[0].classList.add('hide');
		}
	});
}
 
window.onkeypress = function(event) {
	if(!isOpen){
		checkLetter(event);
	}
}