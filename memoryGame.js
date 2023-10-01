let films, shortFilms, videoGames, attractions;
let matchNumber = 0;
let roundNum = 0;
var startTime, finishTime;
const gridContainer = document.querySelector(".grid-container");
const button = document.querySelector(".start");
let cards = [];
let firstCard, secondCard;
let lock = false;
var saveFirstPageUrl = 'https://api.disneyapi.dev/characters';
var nextPageUrl;


$(document).ready(function() {
	$('.start').click(function() {
		button.classList.add("hidden");
		startNewGame();
	});

	function startNewGame() {
		matchNumber = 0;
		roundNum++;
		startTimeAjux();
		imagesAjax();

	}

	function startTimeAjux() {
		$.ajax({
			type: 'GET',
			url: 'get_current_time.php',
			success: function(result) {
				startTime = new Date(result * 1000).toLocaleTimeString('it-IT');
				$('#div2').text('Time: ' + startTime);
			},
			error1: function(xhr, textStatus, errorThrown) {
				console.log("AJAX Error:", textStatus);
				console.log("Error Thrown:", errorThrown);
			}
		});
	}

	function finishTimeAjux() {
		$.ajax({
			type: 'GET',
			url: 'get_current_time.php',
			success: function(res) {
				finishTime = new Date(res * 1000).toLocaleTimeString('it-IT');
				var time = diff(startTime, finishTime);
				$('#div6').text(time);
			},
			error2: function(xhr, textStatus, errorThrown) {
				console.log("AJAX Error:", textStatus);
				console.log("Error Thrown:", errorThrown);
			}
		});
	}


	function diff(startTime, finishTime) {
		const [hrs1, mins1, secs1] = startTime.split(':');
		const [hrs2, mins2, secs2] = finishTime.split(':');
		time1 = parseInt(hrs1 * 3600) + parseInt(mins1 * 60) + parseInt(secs1);
		time2 = parseInt(hrs2 * 3600) + parseInt(mins2 * 60) + parseInt(secs2);
		secCalc = time2 - time1;
		if (secCalc < 0) {
			secCalc = secCalc + (24 * 3600);
		}
		hours = Math.floor(secCalc / 3600);
		secCalc %= 3600;
		minutes = Math.floor(secCalc / 60);
		seconds = secCalc % 60;
		colon = ":";
		zeroDigit = "0";
		hours = hours.toString();
		if (hours.length == 1) {
			hours = zeroDigit.concat(hours);
		}
		minutes = minutes.toString();
		if (minutes.length == 1) {
			minutes = zeroDigit.concat(minutes);
		}
		seconds = seconds.toString();
		if (seconds.length == 1) {
			seconds = zeroDigit.concat(seconds);
		}
		temp1 = hours.concat(colon);
		temp2 = temp1.concat(minutes);
		temp3 = temp2.concat(colon);
		res = temp3.concat(seconds);
		return res;
	}

	function imagesAjax() {
		if (roundNum == 150 || roundNum == 1) {
			nextPageUrl = saveFirstPageUrl;
			roundNum = 1;
		}
		$.ajax({
			url: nextPageUrl,
			type: 'GET',
			dataType: 'json',
			success: function(res) {
				var characters = res.data;
				if (roundNum != 149) {
					nextPageUrl = res.nextPage;
				}
				var chosenCharacters = chooseRandomCharacters(characters, 10);
				cards = duplicateAndShuffle(chosenCharacters);
				generateCards();
			},
			error3: function(xhr, textStatus, errorThrown) {
				console.log("AJAX Error:", textStatus);
				console.log("Error Thrown:", errorThrown);
			}
		});
	}

	function chooseRandomCharacters(characters, count) {
		var chosenCharacters = [];
		for (var i = 0; i < count; i++) {
			var index = Math.floor(Math.random() * characters.length);
			var character = characters[index];
			chosenCharacters.push(character);
			characters.splice(index, 1);
		}
		return chosenCharacters;
	}

	function duplicateAndShuffle(array) {
		var duplicatedArray = array.concat(array);
		var shuffledArray = [];
		while (duplicatedArray.length > 0) {
			var index = Math.floor(Math.random() * duplicatedArray.length);
			shuffledArray.push(duplicatedArray[index]);
			duplicatedArray.splice(index, 1);
		}
		return shuffledArray;
	}

	function generateCards() {
		gridContainer.innerHTML = "";
		for (let card of cards) {
			const cardElement = document.createElement("div");
			cardElement.classList.add("card");
			cardElement.setAttribute("data-name", card.name);
			cardElement.innerHTML = `
			<div class="front">
			<img class="image" src=${card.imageUrl} />
			<div class="name">${card.name}</div>
			</div>
			<div class="back"></div>`;
			gridContainer.appendChild(cardElement);
			cardElement.addEventListener("click", flip);
		}
	}

	function flip() {
		if (lock) {
			return;
		}
		if (this === firstCard) {
			return;
		}
		this.classList.add("flipped");
		if (!firstCard) {
			firstCard = this;
			return;
		}
		secondCard = this;
		lock = true;
		checkMatch();
	}

	function checkMatch() {
		let isMatch = firstCard.dataset.name === secondCard.dataset.name;
		if (isMatch) {
			matchCard();
		} else {
			notMatchCards();
		}
	}

	function matchCard() {
		matchNumber++;
		for (let i = 0; i < cards.length; i++) {
			if (cards[i].name === firstCard.dataset.name) {
				films = cards[i].films;
				shortFilms = cards[i].shortFilms;
				videoGames = cards[i].videoGames;
				attractions = cards[i].parkAttractions;
				break;
			}
		}
		document.getElementById("div1").style.color = "rgb(36, 223, 11)";
		$('#div1').text('Very nice! You did it!');
		document.getElementById("div3").style.color = "black";
		$('#div3').text('(1)Films: ' + films);
		document.getElementById("div7").style.color = "black";
		$('#div7').text('(2)Short films: ' + shortFilms);
		document.getElementById("div8").style.color = "black";
		$('#div8').text('(3)Video games: ' + videoGames);
		document.getElementById("div9").style.color = "black";
		$('#div9').text('(4)Attractions: ' + attractions);
		setTimeout(() => {
			firstCard.removeEventListener("click", flip);
			secondCard.removeEventListener("click", flip);
			const popup = document.getElementById("popup");
			popup.style.display = "block";
			$('.close').click(function() {
				popup.style.display = "none";
				if (matchNumber == 10) {
					theNextPage();
				} else {
					resetBoard();
				}
			});

		}, 1000);
	}

	function theNextPage() {
		document.getElementById("div4").style.color = "white";
		$('#div4').text('game over!');
		document.getElementById("div5").style.color = "whait";
		$('#div5').text('Well done! You succeeded!');
		finishTimeAjux();
		setTimeout(() => {
			const popup = document.getElementById("finishPopup");
			popup.style.display = "block";
			$('.startAgain').click(function() {
				popup.style.display = "none";
				firstCard.removeEventListener("click", flip);
				secondCard.removeEventListener("click", flip);
				resetBoard();
				startNewGame();
			});
		}, 1000);
	}

	function notMatchCards() {
		document.getElementById("div1").style.color = "red";
		$('#div1').text('You made a mistake! No problem, try again!');
		$('#div3').text('');
		$('#div7').text('');
		$('#div8').text('');
		$('#div9').text('');
		setTimeout(() => {
			firstCard.classList.remove("flipped");
			secondCard.classList.remove("flipped");
			const popup = document.getElementById("popup");
			popup.style.display = "block";
			$('.close').click(function() {
				popup.style.display = "none";
			});
			resetBoard();
		}, 1000);
	}

	function resetBoard() {
		firstCard = null;
		secondCard = null;
		lock = false;
	}
});