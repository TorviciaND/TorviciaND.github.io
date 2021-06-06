/* initalize global variables*/

var cardArray = [];
var enemyArray = [];
var usedSlots = [];
var defenderList = [];
var defenderListFoe = [];
var hostileTakeover = [];
var hostileTakeoverFoe = [];
var myCardTotal = 0;
var theirCardTotal = 0;


/*Define Card class */
class Card{
constructor(picture, ul, u, ur, l, r, dl, d, dr, defense, offense, friendly, placed) {
				this.picture = picture;
				this.ul = ul;
				this.u = u;
				this.ur = ur;
				this.l = l;
				this.r = r;
				this.dl = dl;
				this.d = d;
				this.dr = dr;
				this.defense = defense;
				this.offense = offense;
				this.friendly = friendly;
				this.placed = placed;
}
                
}

/*Board Setup */
function createBlockers(){
	var arr = [];
	var numBlockers = Math.floor(Math.random() * 5) + 1;
	while (arr.length < numBlockers) {
					var r = Math.floor(Math.random()* 16) + 1;
					if(arr.indexOf(r) === -1) arr.push(r);
	}
	return(arr);
}

function createBoard(){
	var i;
	var j;
	for(i = 1; i <=4; i++) {
		document.write("<div class = 'rowContainer'>");
		for(j = 1; j <=4; j++){
			document.write("<div class = 'slot' id = 'slot" + i + j + "'>");
			if(blockers.includes((i-1)*4 + j)){
				document.write("<div class = 'blocker' id = 'card" + i + j + "'><p></div>");
				usedSlots.push((i-1)*4 + j);
			}
			document.write("</div>");
		}
		document.write("</div>");
	}
}

function createScore(){
	document.write("<div class = 'score' id = 'score'><h2><div style = 'float:left'>Score:&nbsp &nbsp</div><div style = 'float:left'>Player 1: &nbsp </div><div class = myScore style = 'float:left'>" + myCardTotal + "</div>&nbsp &nbspPlayer 2: &nbsp<div class = theirScore style = 'float:left'></div>" + theirCardTotal + "</h2></div>");
}

function createCards(){
var i;
var j;
for(i = 0; i < 5; i++){
	let temp = new Card(getRandomColor(), Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.floor(Math.random() * 3), Math.floor(Math.random() * 3), true, false);
	cardArray.push(temp);
	let temp1 = new Card(getRandomColor(), Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.random() < 0.7, Math.floor(Math.random() * 3), Math.floor(Math.random() * 3), false, false);
	enemyArray.push(temp1);
	document.write("<div class = 'cardHolder' id = 'cardHolder"+ i + "' style = 'background:" + cardArray[i].picture + "'>");
	document.getElementById("cardHolder"+i).addEventListener("click", cardClicked);
	document.write("<div class = 'stats' style = 'color:white; position:relative; top:75%; left: 40%'>" + cardArray[i].offense + " " + cardArray[i].defense + "</div>");
		if(cardArray[i].ul){document.write("<div class='arrow-ul'></div>");};
		if(cardArray[i].u){document.write("<div class='arrow-up'></div>");};
		if(cardArray[i].ur){document.write("<div class='arrow-ur'></div>");};
		if(cardArray[i].l){document.write("<div class='arrow-left'></div>");};        
		if(cardArray[i].r){document.write("<div class='arrow-right'></div>");};
		if(cardArray[i].dl){document.write("<div class='arrow-dl'></div>");};
		if(cardArray[i].d){document.write("<div class='arrow-down'></div>");};
		if(cardArray[i].dr){document.write("<div class='arrow-dr'></div>");};
		document.write("");
	document.write("</div>");                          
}

for(i = 1; i <=4; i++){
	for(j=1; j <=4; j++){
		if(!usedSlots.includes((i-1)*4 + j)){                                                            
			document.getElementById("slot"+i+j).addEventListener("click", cardMoveTo);
		}
	}
}


}

/*End Board Setup */

function pauseBrowser(millis) {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate-date < millis);
}

/*Select a card to move to the board and a board location for where to move that card */
function cardClicked() {
	isClicked = true;
	toBePlaced = this.id;
}

function cardMoveTo() {
	if(isClicked){
		document.getElementById(this.id).removeEventListener("click",cardMoveTo);
		isClicked = false;
		placeCard(toBePlaced, this.id);
		toBePlaced = null;
	}
}
/*End card select and move to */

/*Create a random color for the cards.  This will later be replaced with card backgrounds */
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
	  for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	  }
  return color;
}

function placeCard(myCard, slot) {
	var row = slot[4];
	var col = slot[5];
	var backgroundContent = document.getElementById(myCard).style.background;
	var moveContent = document.getElementById(myCard).innerHTML;

	/* Put card HTML in selected slot */
	var pasteHTML = "";
	pasteHTML = pasteHTML + "<div class = 'card friend' id = 'card" + row + col + "' style = 'background:" + backgroundContent + "'>" + moveContent + "</div>";
	document.getElementById(slot).innerHTML = pasteHTML;
	
	/* Add the slot to the used slots list */
	usedSlots.push((row-1)*4 + Number(col));
	
	/*Remove the card from the possible cards to place */
	document.getElementById(myCard).style.display = "none";
	
	
	/*See which ways we can attack */
	var newRow;
	var newCol;
	var defender;
	Attacker = "card"+Number(row)+Number(col);
	

	/* Arrow Up Left */
	if(document.getElementById(Attacker).innerHTML.indexOf("arrow-ul") != -1){
		defender = (Number(row)-2)*4+(Number(col)-1); /* board number 1 -16 */
		if(usedSlots.includes(defender) & defender%4 !=0 & defender > 0){
			newRow = Number(row) -1;
			newCol = Number(col) -1;
			upLeft = "card"+newRow + newCol; /* card + row and column numbers */
			upLeftDefender = document.getElementById(upLeft);
			if(upLeftDefender.classList.contains("foe") & upLeftDefender.innerHTML.indexOf("arrow-dr") != -1) {
				upLeftDefender.addEventListener("click", function() {
					battleFriendly(upLeft,Attacker, "moveCardUpLeft", "moveCardDownRight");
				}, useCapture = true, once = true);
				upLeftDefender.classList.add("battler");
				defenderList.push(upLeft);
			}
			else {
				if(upLeftDefender.classList.contains("foe")){
				hostileTakeover.push(upLeft);}
			}
		}
	}

	
	/*Arrow Up */
	if(document.getElementById(Attacker).innerHTML.indexOf("arrow-up") != -1){
		defender = (Number(row)-2)*4+(Number(col));
		if(usedSlots.includes(defender) & defender > 0){
			newRow = Number(row) -1;
			newCol = Number(col);
			Up = "card"+newRow + newCol;
			upDefender = document.getElementById(Up);
			if(upDefender.classList.contains("foe") & document.getElementById(Up).innerHTML.indexOf("arrow-down") != -1) {
				upDefender.addEventListener("click", function() {
					battleFriendly(Up,Attacker, "moveCardUp", "moveCardDown");
				}, useCapture = true, once = true);
				defenderList.push(Up);
				upDefender.classList.add("battler");
			}
			else {
				if(upDefender.classList.contains("foe")){
					hostileTakeover.push(Up);
				}
			}
		}
	}
	
	
	/* Arrow Up Right */
	if(document.getElementById("card"+Number(row)+Number(col)).innerHTML.indexOf("arrow-ur") != -1){
		defender = (Number(row)-2)*4+(Number(col)+1);
		if(usedSlots.includes(defender) & defender%4 !=1 & defender > 0){
			newRow = Number(row) -1;
			newCol = Number(col) +1;
			upRight = "card"+newRow + newCol;
			upRightDefender = document.getElementById(upRight);
			if(upRightDefender.classList.contains("foe") & upRightDefender.innerHTML.indexOf("arrow-dl") != -1) {
				upRightDefender.addEventListener("click", function() {
					battleFriendly(upRight,Attacker, "moveCardUpRight", "moveCardDownLeft");
				}, useCapture = true, once = true);
				upRightDefender.classList.add("battler");
				defenderList.push(upRight);
			}
			else {
				if(upRightDefender.classList.contains("foe")){
				hostileTakeover.push(upRight);}
			}
		}	
	}

	
	
	/*Arrow Left */
	if(document.getElementById("card"+Number(row)+Number(col)).innerHTML.indexOf("arrow-left") != -1){
		defender = (Number(row)-1)*4+(Number(col)-1);
		if(usedSlots.includes(defender) & defender%4 !=0){
			newRow = Number(row);
			newCol = Number(col) - 1;
			Left = "card"+newRow + newCol;
			LeftDefender = document.getElementById(Left);
			if(LeftDefender.classList.contains("foe") & LeftDefender.innerHTML.indexOf("arrow-right") != -1) {
				LeftDefender.addEventListener("click", function() {
					battleFriendly(Left,Attacker, "moveCardLeft", "moveCardRight");
				}, useCapture = true, once = true);
				LeftDefender.classList.add("battler");
				defenderList.push(Left);
			}
			else {
				if(LeftDefender.classList.contains("foe")){
				hostileTakeover.push(Left);}
			}
		}
	}

	
	/* Arrow Right */
	if(document.getElementById("card"+Number(row)+Number(col)).innerHTML.indexOf("arrow-right") != -1){
		defender = (Number(row)-1)*4+Number(col) + 1;
		if(usedSlots.includes(defender) & defender%4 !=1){
			newRow = Number(row);
			newCol = Number(col) +1;
			Right = "card"+newRow + newCol; /* card + row and column numbers */
			RightDefender = document.getElementById(Right);
			if(RightDefender.classList.contains("foe") & RightDefender.innerHTML.indexOf("arrow-left") != -1) {
				RightDefender.addEventListener("click", function() {
					battleFriendly(Right,Attacker, "moveCardRight", "moveCardLeft");
				}, useCapture = true, once = true);
				RightDefender.classList.add("battler");
				defenderList.push(Right);
			}
			else {
				if(RightDefender.classList.contains("foe")){
				hostileTakeover.push(Right);}
			}
		}
	}

	
	
	/* Arrow Down Left */
	if(document.getElementById("card"+Number(row)+Number(col)).innerHTML.indexOf("arrow-dl") != -1){
		defender = (Number(row))*4+(Number(col)-1);
		if(usedSlots.includes(defender) & defender%4 !=0 & defender < 17){
			newRow = Number(row) +1;
			newCol = Number(col) -1;
			downLeft = "card"+newRow + newCol; /* card + row and column numbers */
			downLeftDefender = document.getElementById(downLeft);
			if(downLeftDefender.classList.contains("foe") & downLeftDefender.innerHTML.indexOf("arrow-ur") != -1) {
				downLeftDefender.addEventListener("click", function() {
					battleFriendly(downLeft,Attacker, "moveCardDownLeft", "moveCardUpRight");
				}, useCapture = true, once = true);
				downLeftDefender.classList.add("battler");
				defenderList.push(downLeft);
			}
			else {
				if(downLeftDefender.classList.contains("foe")){
				hostileTakeover.push(downLeft);}
			}
		}	
	}

	
	
	/* Arrow Down */
	if(document.getElementById("card"+Number(row)+Number(col)).innerHTML.indexOf("arrow-down") != -1){
		defender = (Number(row))*4+(Number(col));
		if(usedSlots.includes(defender) & defender < 17){
			newRow = Number(row) +1;
			newCol = Number(col);
			Down = "card"+newRow + newCol; 
			DownDefender = document.getElementById(Down);
			if(DownDefender.classList.contains("foe") & DownDefender.innerHTML.indexOf("arrow-up") != -1) {
				DownDefender.addEventListener("click", function() {
					battleFriendly(Down,Attacker, "moveCardDown", "moveCardUp");
				}, useCapture = true, once = true);
				DownDefender.classList.add("battler");
				defenderList.push(Down);
			}
			else {
				if(DownDefender.classList.contains("foe")){
				hostileTakeover.push(Down);}
			}
		}
	}

	
	
	/* Arrow Down Right */
	if(document.getElementById("card"+Number(row)+Number(col)).innerHTML.indexOf("arrow-dr") != -1){
		defender = (Number(row))*4+(Number(col)+1);
		if(usedSlots.includes(defender) & defender%4 !=1 & defender < 17){
			newRow = Number(row) +1;
			newCol = Number(col) +1;
			downRight = "card"+newRow + newCol; 
			downRightDefender = document.getElementById(downRight);
			if(downRightDefender.classList.contains("foe") & downRightDefender.innerHTML.indexOf("arrow-ul") != -1) {
				downRightDefender.addEventListener("click", function() {
					battleFriendly(downRight,Attacker, "moveCardDownRight", "moveCardUpLeft");
				}, useCapture = true, once = true);
				downRightDefender.classList.add("battler");
				defenderList.push(downRight);
			}
			else {
				if(downRightDefender.classList.contains("foe")){
				hostileTakeover.push(downRight);}
			}
		}	
	}

	myCardTotal = myCardTotal + 1;
	scoreHTML = document.getElementById('score');
	scoreHTML.innerHTML = "<h2><div style = 'float:left'>Score:&nbsp &nbsp</div><div style = 'float:left'>Player 1: &nbsp </div><div class = myScore style = 'float:left'>" + myCardTotal + "</div>&nbsp &nbspPlayer 2: &nbsp<div class = theirScore style = 'float:left'></div>" + theirCardTotal + "</h2>";

	
	if(defenderList.length < 1) {
		if(document.getElementById("card"+Number(row)+Number(col)).classList.contains("friend")) {
			for(i = 0; i < hostileTakeover.length; i++){
				
				document.getElementById(hostileTakeover[i]).classList.remove("foe");
				document.getElementById(hostileTakeover[i]).classList.add("friend");
				scoreChange(true);
			}
		}
		hostileTakeover = []
		
		setTimeout(function(){
			placeEnemyCard();}, 1500);
	}
                
}

function checkWin(){
	if(myCardTotal + theirCardTotal == 10) {
		if(myCardTotal > theirCardTotal){
			window.alert("You win!");
		}
		else if(myCardTotal < theirCardTotal) {
			window.alert("You lose :(");
		}
		else {
			window.alert("It's a tie!");
		}
	}
}

function scoreChange(friendly){
	if(friendly){
		myCardTotal = myCardTotal + 1;
		theirCardTotal = theirCardTotal - 1;
	}
	
	else {
		myCardTotal = myCardTotal - 1;
		theirCardTotal = theirCardTotal + 1;
	}

	setTimeout(function(){
		scoreHTML = document.getElementById('score');
		scoreHTML.innerHTML = "<h2><div style = 'float:left'>Score:&nbsp &nbsp</div><div style = 'float:left'>Player 1: &nbsp </div><div class = myScore style = 'float:left'>" + myCardTotal + "</div>&nbsp &nbspPlayer 2: &nbsp<div class = theirScore style = 'float:left'></div>" + theirCardTotal + "</h2>";
	}, 2000);
	
}

function battleFriendly(cardDefender, cardAttacker, direction1, direction2) {
	var win;
	index = defenderList.indexOf(cardDefender);
	defenderList.splice(index,1);
	document.getElementById(cardDefender).replaceWith(document.getElementById(cardDefender).cloneNode(true)); 
	/* show animation of cards fighting */
	document.getElementById(cardAttacker).classList.add(direction1);
	document.getElementById(cardDefender).classList.add(direction2);
  
	  setTimeout(function(){
		document.getElementById(cardAttacker).classList.remove(direction1);
		document.getElementById(cardDefender).classList.remove(direction2);
	  }, 250);
  
	setTimeout(function(){
		document.getElementById(cardDefender).classList.remove("battler");
		myElement = document.getElementById(cardAttacker);
		theirElement = document.getElementById(cardDefender);

		myPower = myElement.innerHTML[78];
		myDefense = myElement.innerHTML[80];
		theirPower = theirElement.innerHTML[78];
		theirDefense = theirElement.innerHTML[80];

		warScore = (Math.random()*(myPower+1) + Math.random()*(myDefense+1)) - (Math.random()*(theirDefense+1) + Math.random()*(theirPower + 1));
		
		if(warScore > 0) {
			theirElement.classList.remove("foe");
			theirElement.classList.add("friend");
			win = true;
			scoreChange(true);
			
		}
		
		else {
			myElement.classList.remove("friend");
			myElement.classList.add("foe");
			win = false;
			scoreChange(false);
			k = defenderList.length;
			for(i = 0; i < k; i++){
				document.getElementById(defenderList[i]).classList.remove("battler");
			}
			defenderList = [];
		}
	}, 750);
	
	setTimeout(function() {
		if(win){
			cascadeFriendly(cardDefender);
		}
		else {
			cascadeFoe(cardAttacker);
		}
	}, 1500);
	
	setTimeout(function(){
		if(defenderList.length < 1) {
			j = hostileTakeover.length;
			if(myElement.classList.contains("friend") & j > 0) {
				for(i = 0; i < j; i++){
					takenOver = hostileTakeover.pop();
					document.getElementById(takenOver).classList.remove("foe");
					document.getElementById(takenOver).classList.add("friend");
					scoreChange(true);
				}
			}
		
		
		setTimeout(function(){
			placeEnemyCard(); }, 2250);	
		}	
	}, 2250);
}

function battleFoe(cardDefender, cardAttacker, direction1, direction2) {
	var win; 
	var theRemovedElement = defenderListFoe.shift(); /*Removes first element from list */
	if(document.getElementById(cardAttacker).innerHTML.indexOf("friend") == -1){ 
		setTimeout(function(){
			document.getElementById(cardAttacker).classList.add(direction1);
			document.getElementById(cardDefender).classList.add(direction2);
		}, 1000);
		setTimeout(function(){
			document.getElementById(cardAttacker).classList.remove(direction1);
			document.getElementById(cardDefender).classList.remove(direction2);
		}, 1250);
	  
		setTimeout(function(){
			theirElement = document.getElementById(cardAttacker);
			myElement = document.getElementById(cardDefender);

			myPower = myElement.innerHTML[78];
			myDefense = myElement.innerHTML[80];
			theirPower = theirElement.innerHTML[78];
			theirDefense = theirElement.innerHTML[80];

			warScore = (Math.random()*(myPower+1) + Math.random()*(myDefense+1)) - (Math.random()*(theirDefense+1) + Math.random()*(theirPower + 1));
			
			if(warScore < 0) {
				myElement.classList.remove("friend");
				myElement.classList.add("foe");
				win = true;
				scoreChange(false);										
			}
			
			else {
				theirElement.classList.remove("foe");
				theirElement.classList.add("friend");
				win = false;
				scoreChange(true);	
				defenderListFoe = [];
			}
		}, 1500);
		
		setTimeout(function(){
			if(win){
				cascadeFoe(cardDefender);
			}
			else {
				cascadeFriendly(cardAttacker);
			}
		}, 2000);
		
		setTimeout(function(){
			if(defenderListFoe.length < 1) {
				k = hostileTakeoverFoe.length;
				if(theirElement.classList.contains("foe") & k > 0) {
					for(i = 0; i < k; i++){
						takeOver = hostileTakeoverFoe.pop();
						document.getElementById(takeOver).classList.remove("friend");
						document.getElementById(takeOver).classList.add("foe");
						scoreChange(false);
					}
				}
			}
		}, 2500);
	}
}


function cascadeFriendly(slotID){
	var cascadeRow = slotID[4];
	var cascadeCol = slotID[5];
	
	/* Cascade Up Left */
	cascader = (Number(cascadeRow)-2)*4+(Number(cascadeCol)-1);
	if(usedSlots.includes(cascader) & cascader%4 !=0 & cascader > 0){
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-ul") != -1){
			newRow = Number(cascadeRow) -1;
			newCol = Number(cascadeCol) -1;
			upLeft = "card"+newRow + newCol;
			upLeftCard = document.getElementById(upLeft);
			if(upLeftCard.classList.contains("foe")){
				upLeftCard.classList.remove("foe");
				upLeftCard.classList.remove("battler");
				upLeftCard.classList.add("friend");
				index = defenderList.indexOf(upLeft);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeover.indexOf(upLeft);
				if (index > -1){hostileTakeover.splice(index,1);}
				scoreChange(true);
			}
			
		}
	}
	
	/*Cascade Up */
	cascader = (Number(cascadeRow)-2)*4+(Number(cascadeCol));
		if(usedSlots.includes(cascader) & cascader > 0){
			if(document.getElementById(slotID).innerHTML.indexOf("arrow-up") != -1){
				newRow = Number(cascadeRow) -1;
				newCol = Number(cascadeCol);
				Up = "card"+newRow + newCol;
				upCard = document.getElementById(Up);
				if(upCard.classList.contains("foe")){
					upCard.classList.remove("foe");
					upCard.classList.remove("battler");
					upCard.classList.add("friend");
					index = defenderList.indexOf(Up);
					if (index > -1){defenderList.splice(index,1);}
					index = hostileTakeover.indexOf(Up);
					if (index > -1){hostileTakeover.splice(index,1);}
					scoreChange(true);
				}
				
			}
		}
	
	/* Cascade Up Right */
	cascader = (Number(cascadeRow)-2)*4+(Number(cascadeCol)+1);
	if(usedSlots.includes(cascader) & cascader%4 !=1 & cascader > 0){
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-ur") != -1){
			newRow = Number(cascadeRow) -1;
			newCol = Number(cascadeCol) +1;
			upRight = "card"+newRow + newCol;
			upRightCard = document.getElementById(upRight);
			if(upRightCard.classList.contains("foe")){
				upRightCard.classList.remove("foe");
				upRightCard.classList.remove("battler");
				upRightCard.classList.add("friend");
				index = defenderList.indexOf(upRight);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeover.indexOf(upRight);
				if (index > -1){hostileTakeover.splice(index,1);}
				scoreChange(true);
			}
			
		}
	}
	
	/* Cascade left */
	cascader = (Number(cascadeRow)-1)*4+(Number(cascadeCol)-1);
	if(usedSlots.includes(cascader) & cascader%4 !=0){		
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-left") != -1){
			newRow = Number(cascadeRow);
			newCol = Number(cascadeCol) -1;
			Left = "card"+newRow + newCol;
			leftCard = document.getElementById(Left);
			if(leftCard.classList.contains("foe")){
				leftCard.classList.remove("foe");
				leftCard.classList.remove("battler");
				leftCard.classList.add("friend");
				index = defenderList.indexOf(Left);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeover.indexOf(Left);
				if (index > -1){hostileTakeover.splice(index,1);}
				scoreChange(true);
			}
			
		}
	}
	
	/* Cascade Right */
	cascader = (Number(cascadeRow)-1)*4+Number(cascadeCol) + 1;
	if(usedSlots.includes(cascader) & cascader%4 !=1){	
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-right") != -1){
			newRow = Number(cascadeRow);
			newCol = Number(cascadeCol) +1;
			Right = "card"+newRow + newCol;
			rightCard = document.getElementById(Right);
			if(rightCard.classList.contains("foe")){
				rightCard.classList.remove("foe");
				rightCard.classList.remove("battler");
				rightCard.classList.add("friend");
				index = defenderList.indexOf(Right);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeover.indexOf(Right);
				if (index > -1){hostileTakeover.splice(index,1);}
				scoreChange(true);
			}
			
		}
	}
	
	/* Cascade Down Left */
	cascader = (Number(cascadeRow))*4+(Number(cascadeCol)-1);
	if(usedSlots.includes(cascader) & cascader%4 !=0 & cascader < 17){	
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-dl") != -1){
			newRow = Number(cascadeRow) + 1;
			newCol = Number(cascadeCol) - 1;
			downLeft = "card"+newRow + newCol;
			downLeftCard = document.getElementById(downLeft);
			if(downLeftCard.classList.contains("foe")){
				downLeftCard.classList.remove("foe");
				downLeftCard.classList.remove("battler");
				downLeftCard.classList.add("friend");
				index = defenderList.indexOf(downLeft);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeover.indexOf(downLeft);
				if (index > -1){hostileTakeover.splice(index,1);}
				scoreChange(true);
			}
			
		}
	}
	
	/* Cascade Down */
	cascader = (Number(cascadeRow))*4+(Number(cascadeCol));
	if(usedSlots.includes(cascader) & cascader < 17){	
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-down") != -1){
			newRow = Number(cascadeRow) + 1;
			newCol = Number(cascadeCol);
			Down = "card"+newRow + newCol;
			downCard = document.getElementById(Down);
			if(downCard.classList.contains("foe")){
				downCard.classList.remove("foe");
				downCard.classList.remove("battler");
				downCard.classList.add("friend");
				index = defenderList.indexOf(Down);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeover.indexOf(Down);
				if (index > -1){hostileTakeover.splice(index,1);}
				scoreChange(true);
			}
			
		}
	}
	
	/* Cascade Down Right */
	cascader = (Number(cascadeRow))*4+(Number(cascadeCol)+1);
	if(usedSlots.includes(cascader) & cascader%4 !=1 & cascader < 17){	
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-dr") != -1){
			newRow = Number(cascadeRow) + 1;
			newCol = Number(cascadeCol) + 1;
			downRight = "card"+newRow + newCol;
			downRightCard = document.getElementById(downRight);
			if(downRightCard.classList.contains("foe")){
				downRightCard.classList.remove("foe");
				downRightCard.classList.remove("battler");
				downRightCard.classList.add("friend");
				index = defenderList.indexOf(downRight);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeover.indexOf(downRight);
				if (index > -1){hostileTakeover.splice(index,1);}
				scoreChange(true);
			}
			
		}
	}
}

function cascadeFoe(slotID){
	var cascadeRow = slotID[4];
	var cascadeCol = slotID[5];
	
	/* Cascade Up Left */
	cascader = (Number(cascadeRow)-2)*4+(Number(cascadeCol)-1);
	if(usedSlots.includes(cascader) & cascader%4 !=0 & cascader > 0){
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-ul") != -1){
			newRow = Number(cascadeRow) -1;
			newCol = Number(cascadeCol) -1;
			upLeft = "card"+newRow + newCol;
			upLeftCard = document.getElementById(upLeft);
			if(upLeftCard.classList.contains("friend")){
				upLeftCard.classList.remove("friend");
				upLeftCard.classList.add("foe");
				index = defenderList.indexOf(upLeftCard);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeoverFoe.indexOf(upLeftCard);
				if (index > -1){hostileTakeoverFoe.splice(index,1);}
				scoreChange(false);
			}
			
		}
	}
	
	/*Cascade Up */
	cascader = (Number(cascadeRow)-2)*4+(Number(cascadeCol));
		if(usedSlots.includes(cascader) & cascader > 0){
			if(document.getElementById(slotID).innerHTML.indexOf("arrow-up") != -1){
				newRow = Number(cascadeRow) -1;
				newCol = Number(cascadeCol);
				Up = "card"+newRow + newCol;
				upCard = document.getElementById(Up);
				if(upCard.classList.contains("friend")){
					upCard.classList.remove("friend");
					upCard.classList.add("foe");
					index = defenderList.indexOf(upCard);
					if (index > -1){defenderList.splice(index,1);}
					index = hostileTakeoverFoe.indexOf(upCard);
					if (index > -1){hostileTakeoverFoe.splice(index,1);}
					scoreChange(false);
				}
				
			}
		}
	
	/* Cascade Up Right */
	cascader = (Number(cascadeRow)-2)*4+(Number(cascadeCol)+1);
	if(usedSlots.includes(cascader) & cascader%4 !=1 & cascader > 0){
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-ur") != -1){
			newRow = Number(cascadeRow) -1;
			newCol = Number(cascadeCol) +1;
			upRight = "card"+newRow + newCol;
			upRightCard = document.getElementById(upRight);
			if(upRightCard.classList.contains("friend")){
				upRightCard.classList.remove("friend");
				upRightCard.classList.add("foe");
				index = defenderList.indexOf(upRightCard);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeoverFoe.indexOf(upRightCard);
				if (index > -1){hostileTakeoverFoe.splice(index,1);}
				scoreChange(false);
			}
			
		}
	}
	
	/* Cascade left */
	cascader = (Number(cascadeRow)-1)*4+(Number(cascadeCol)-1);
	if(usedSlots.includes(cascader) & cascader%4 !=0){		
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-left") != -1){
			newRow = Number(cascadeRow);
			newCol = Number(cascadeCol) -1;
			Left = "card"+newRow + newCol;
			leftCard = document.getElementById(Left);
			if(leftCard.classList.contains("friend")){
				leftCard.classList.remove("friend");
				leftCard.classList.add("foe");
				index = defenderList.indexOf(leftCard);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeoverFoe.indexOf(leftCard);
				if (index > -1){hostileTakeoverFoe.splice(index,1);}
				scoreChange(false);
			}
			
		}
	}
	
	/* Cascade Right */
	cascader = (Number(cascadeRow)-1)*4+Number(cascadeCol) + 1;
	if(usedSlots.includes(cascader) & cascader%4 !=1){	
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-right") != -1){
			newRow = Number(cascadeRow);
			newCol = Number(cascadeCol) +1;
			Right = "card"+newRow + newCol;
			rightCard = document.getElementById(Right);
			if(rightCard.classList.contains("friend")){
				rightCard.classList.remove("friend");
				rightCard.classList.add("foe");
				index = defenderList.indexOf(rightCard);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeoverFoe.indexOf(rightCard);
				if (index > -1){hostileTakeoverFoe.splice(index,1);}
				scoreChange(false);
			}
			
		}
	}
	
	/* Cascade Down Left */
	cascader = (Number(cascadeRow))*4+(Number(cascadeCol)-1);
	if(usedSlots.includes(cascader) & cascader%4 !=0 & cascader < 17){	
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-dl") != -1){
			newRow = Number(cascadeRow) + 1;
			newCol = Number(cascadeCol) - 1;
			downLeft = "card"+newRow + newCol;
			downLeftCard = document.getElementById(downLeft);
			if(downLeftCard.classList.contains("friend")){
				downLeftCard.classList.remove("friend");
				downLeftCard.classList.add("foe");
				index = defenderList.indexOf(downLeftCard);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeoverFoe.indexOf(downLeftCard);
				if (index > -1){hostileTakeoverFoe.splice(index,1);}
				scoreChange(false);
			}
			
		}
	}
	
	/* Cascade Down */
	cascader = (Number(cascadeRow))*4+(Number(cascadeCol));
	if(usedSlots.includes(cascader) & cascader < 17){	
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-down") != -1){
			newRow = Number(cascadeRow) + 1;
			newCol = Number(cascadeCol);
			Down = "card"+newRow + newCol;
			downCard = document.getElementById(Down);
			if(downCard.classList.contains("friend")){
				downCard.classList.remove("friend");
				downCard.classList.add("foe");
				index = defenderList.indexOf(downCard);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeoverFoe.indexOf(downCard);
				if (index > -1){hostileTakeoverFoe.splice(index,1);}
				scoreChange(false);
			}
			
		}
	}
	
	/* Cascade Down Right */
	cascader = (Number(cascadeRow))*4+(Number(cascadeCol)+1);
	if(usedSlots.includes(cascader) & cascader%4 !=1 & cascader < 17){	
		if(document.getElementById(slotID).innerHTML.indexOf("arrow-dr") != -1){
			newRow = Number(cascadeRow) + 1;
			newCol = Number(cascadeCol) + 1;
			downRight = "card"+newRow + newCol;
			downRightCard = document.getElementById(downRight);
			if(downRightCard.classList.contains("friend")){
				downRightCard.classList.remove("friend");
				downRightCard.classList.add("foe");
				index = defenderList.indexOf(downRightCard);
				if (index > -1){defenderList.splice(index,1);}
				index = hostileTakeoverFoe.indexOf(downRightCard);
				if (index > -1){hostileTakeoverFoe.splice(index,1);}
				scoreChange(false);
			}
			
		}
	}
}

function placeEnemyCard(){
	/*Select a board location (1 - 16), that has not already been used, to place the enemy card.  
	This will be replaced later when some form of AI has been created */
	var placed = false;
	while(placed == false){
		var slotToBePlaced = Math.floor(Math.random()* 16) + 1;
		if(usedSlots.includes(slotToBePlaced)){
			slotToBePlaced = Math.floor(Math.random()* 16) + 1;
		}
		else {
			placed = true;
		}
	}
	
	/*Select a card in hand (1 - 5), that has not already been used, to place the enemy card.  
	This will be replaced later when some form of AI has been created */
	var selected = false;
	while(selected == false){
		var selectedCard = Math.floor(Math.random()*5);
		if(enemyArray[selectedCard].placed){
			selectedCard = Math.floor(Math.random()*5);
		}
		else {
			selected = true;
		}		
	}              

	/*Place the selected card in the selected slot.*/
	var enemyRow = Math.floor((slotToBePlaced-1)/4) + 1;
	var enemyCol = (slotToBePlaced -1)%4 + 1;
	var slot = "slot" + enemyRow + enemyCol;
	
	var pasteContent = document.getElementById(slot);
	var pasteHTML = "";

	pasteHTML = pasteHTML + "<div class = 'card foe' id = 'card" +enemyRow+enemyCol+ "' style = 'background:" + enemyArray[selectedCard].picture + "'>";
		pasteHTML = pasteHTML + "<div class = 'stats' style = 'color:white; position:relative; top:75%; left: 40%'>" + enemyArray[selectedCard].offense + " " + enemyArray[selectedCard].defense + "</div>";		
		if(enemyArray[selectedCard].ul){pasteHTML = pasteHTML + "<div class='arrow-ul'></div>"};
		if(enemyArray[selectedCard].u){pasteHTML = pasteHTML + "<div class='arrow-up'></div>"};
		if(enemyArray[selectedCard].ur){pasteHTML = pasteHTML + "<div class='arrow-ur'></div>"};
		if(enemyArray[selectedCard].l){pasteHTML = pasteHTML + "<div class='arrow-left'></div>"};            
		if(enemyArray[selectedCard].r){pasteHTML = pasteHTML + "<div class='arrow-right'></div>"};
		if(enemyArray[selectedCard].dl){pasteHTML = pasteHTML + "<div class='arrow-dl'></div>"};
		if(enemyArray[selectedCard].d){pasteHTML = pasteHTML + "<div class='arrow-down'></div>"};
		if(enemyArray[selectedCard].dr){pasteHTML = pasteHTML + "<div class='arrow-dr'></div>"};
	pasteHTML = pasteHTML + "</div>";
	
	usedSlots.push((enemyRow-1)*4 + enemyCol);
	enemyArray[selectedCard].placed = true;
	
	pasteContent.innerHTML = pasteHTML;
	
	theirCardTotal = theirCardTotal + 1;
	scoreHTML = document.getElementById('score');
	scoreHTML.innerHTML = "<h2><div style = 'float:left'>Score:&nbsp &nbsp</div><div style = 'float:left'>Player 1: &nbsp </div><div class = myScore style = 'float:left'>" + myCardTotal + "</div>&nbsp &nbspPlayer 2: &nbsp<div class = theirScore style = 'float:left'></div>" + theirCardTotal + "</h2>";
	

	/*See which ways we can attack */
	var newRowFoe;
	var newColFoe;
	var defenderFoe;
	var waitTime = 0;
	AttackerFoe = "card"+Number(enemyRow)+Number(enemyCol);

	/* Arrow Up Left */
	setTimeout(function(){
		waitTime = 0;
		if(document.getElementById(AttackerFoe).innerHTML.indexOf("arrow-ul") != -1 & document.getElementById(AttackerFoe).classList.contains("foe")){
			defenderFoe = (Number(enemyRow)-2)*4+(Number(enemyCol)-1); /* board number 1 -16 */
			if(usedSlots.includes(defenderFoe) & defenderFoe%4 !=0 & defenderFoe > 0){
				newRowFoe = Number(enemyRow) -1;
				newColFoe = Number(enemyCol) -1;
				upLeft = "card"+newRowFoe + newColFoe; /* card + row and column numbers */
				upLeftDefender = document.getElementById(upLeft);
				if(upLeftDefender.classList.contains("friend") & upLeftDefender.innerHTML.indexOf("arrow-dr") != -1) {
					battleFoe(upLeft, AttackerFoe, 'moveCardUpLeft', 'moveCardDownRight');
					defenderListFoe.push(upLeft);
					waitTime = 2000;
				}
				else {
					if(!upLeftDefender.classList.contains("blocker") & upLeftDefender.classList.contains("friend") & upLeftDefender.innerHTML.indexOf("arrow-dr") == -1){
					hostileTakeoverFoe.push(upLeft);
					}
				}
			}
		}
	
	
	/*Arrow Up */
	setTimeout(function(){
		waitTime = 0;
		if(document.getElementById(AttackerFoe).innerHTML.indexOf("arrow-up") != -1 & document.getElementById(AttackerFoe).classList.contains("foe")){
			defenderFoe = (Number(enemyRow)-2)*4+(Number(enemyCol));
			if(usedSlots.includes(defenderFoe) & defenderFoe > 0){
				newRowFoe = Number(enemyRow) -1;
				newColFoe = Number(enemyCol);
				Up = "card"+newRowFoe + newColFoe;
				upDefender = document.getElementById(Up);
				if(upDefender.classList.contains("friend") & document.getElementById(Up).innerHTML.indexOf("arrow-down") != -1) {
					battleFoe(Up, AttackerFoe, 'moveCardUp', 'moveCardDown');
					defenderListFoe.push(Up);
					waitTime = 2000;
				}
				else {
					if(!upDefender.classList.contains("blocker") & upDefender.classList.contains("friend") & upDefender.innerHTML.indexOf("arrow-down") == -1){
						hostileTakeoverFoe.push(Up);
					}
				}
			}
		}

	
	/* Arrow Up Right */
	setTimeout(function(){
		waitTime = 0;
		if(document.getElementById(AttackerFoe).innerHTML.indexOf("arrow-ur") != -1 & document.getElementById(AttackerFoe).classList.contains("foe")){
			defenderFoe = (Number(enemyRow)-2)*4+(Number(enemyCol)+1);
			if(usedSlots.includes(defenderFoe) & defenderFoe%4 !=1 & defenderFoe > 0){
				newRowFoe = Number(enemyRow) -1;
				newColFoe = Number(enemyCol) +1;
				upRight = "card"+newRowFoe + newColFoe;
				upRightDefender = document.getElementById(upRight);
				if(upRightDefender.classList.contains("friend") & upRightDefender.innerHTML.indexOf("arrow-dl") != -1) {
					battleFoe(upRight, AttackerFoe, 'moveCardUpRight', 'moveCardDownLeft');
					defenderListFoe.push(upRight);
					waitTime = 2000;
				}
				else {
					if(!upRightDefender.classList.contains("blocker") & upRightDefender.classList.contains("friend") & upRightDefender.innerHTML.indexOf("arrow-dl") == -1){
					hostileTakeoverFoe.push(upRight);
					}
				}
			}	
		}

	
	/*Arrow Left */
	setTimeout(function(){
		waitTime = 0;
		if(document.getElementById(AttackerFoe).innerHTML.indexOf("arrow-left") != -1 & document.getElementById(AttackerFoe).classList.contains("foe")){
			defenderFoe = (Number(enemyRow)-1)*4+(Number(enemyCol)-1);
			if(usedSlots.includes(defenderFoe) & defenderFoe%4 !=0){
				newRowFoe = Number(enemyRow);
				newColFoe = Number(enemyCol) - 1;
				Left = "card"+newRowFoe + newColFoe;
				LeftDefender = document.getElementById(Left);
				if(LeftDefender.classList.contains("friend") & LeftDefender.innerHTML.indexOf("arrow-right") != -1) {
					battleFoe(Left, AttackerFoe, 'moveCardLeft', 'moveCardRight');
					defenderListFoe.push(Left);
					waitTime = 2000;
				}
				else {
					if(!LeftDefender.classList.contains("blocker") & LeftDefender.classList.contains("friend") & LeftDefender.innerHTML.indexOf("arrow-right") == -1){
					hostileTakeoverFoe.push(Left);
					}
				}
			}
		}
	
	/* Arrow Right */
	setTimeout(function(){
		waitTime = 0;
		if(document.getElementById(AttackerFoe).innerHTML.indexOf("arrow-right") != -1 & document.getElementById(AttackerFoe).classList.contains("foe")){
			defenderFoe = (Number(enemyRow)-1)*4+Number(enemyCol) + 1;
			if(usedSlots.includes(defenderFoe) & defenderFoe%4 !=1){
				newRowFoe = Number(enemyRow);
				newColFoe = Number(enemyCol) +1;
				Right = "card"+newRowFoe + newColFoe; /* card + row and column numbers */
				RightDefender = document.getElementById(Right);
				if(RightDefender.classList.contains("friend") & RightDefender.innerHTML.indexOf("arrow-left") != -1) {
					battleFoe(Right, AttackerFoe, 'moveCardRight', 'moveCardLeft');
					defenderListFoe.push(Right);
					waitTime = 2000;
				}
				else {
					if(!RightDefender.classList.contains("blocker") & RightDefender.classList.contains("friend") & RightDefender.innerHTML.indexOf("arrow-left") == -1){
					hostileTakeoverFoe.push(Right);
					}
				}
			}
		}
	
	
	/* Arrow Down Left */
	setTimeout(function(){
		waitTime = 0;
		if(document.getElementById(AttackerFoe).innerHTML.indexOf("arrow-dl") != -1 & document.getElementById(AttackerFoe).classList.contains("foe")){
			defenderFoe = (Number(enemyRow))*4+(Number(enemyCol)-1);
			if(usedSlots.includes(defenderFoe) & defenderFoe%4 !=0 & defenderFoe < 17){
				newRowFoe = Number(enemyRow) +1;
				newColFoe = Number(enemyCol) -1;
				downLeft = "card"+newRowFoe + newColFoe; /* card + row and column numbers */
				downLeftDefender = document.getElementById(downLeft);
				if(downLeftDefender.classList.contains("friend") & downLeftDefender.innerHTML.indexOf("arrow-ur") != -1) {
					battleFoe(downLeft , AttackerFoe , 'moveCardDownLeft', 'moveCardUpRight');
					defenderListFoe.push(downLeft);
					waitTime = 2000;
				}
				else {
					if(!downLeftDefender.classList.contains("blocker") & downLeftDefender.classList.contains("friend") & downLeftDefender.innerHTML.indexOf("arrow-ur") == -1){
					hostileTakeoverFoe.push(downLeft);
					}
				}
			}	
		}
	
	
	/* Arrow Down */
	setTimeout(function(){
		waitTime = 0;
		if(document.getElementById(AttackerFoe).innerHTML.indexOf("arrow-down") != -1 & document.getElementById(AttackerFoe).classList.contains("foe")){
			defenderFoe = (Number(enemyRow))*4+(Number(enemyCol));
			if(usedSlots.includes(defenderFoe) & defenderFoe < 17){
				newRowFoe = Number(enemyRow) +1;
				newColFoe = Number(enemyCol);
				Down = "card"+newRowFoe + newColFoe; 
				DownDefender = document.getElementById(Down);
				if(DownDefender.classList.contains("friend") & DownDefender.innerHTML.indexOf("arrow-up") != -1) {
					battleFoe(Down , AttackerFoe , 'moveCardDown', 'moveCardUp');
					defenderListFoe.push(Down);
					waitTime = 2000;
				}
				else {
					if(!DownDefender.classList.contains("blocker") & DownDefender.classList.contains("friend") & DownDefender.innerHTML.indexOf("arrow-up") == -1){
					hostileTakeoverFoe.push(Down);
					}
				}
			}
		}
	
	
	/* Arrow Down Right */
	setTimeout(function(){
		waitTime = 0;
		if(document.getElementById(AttackerFoe).innerHTML.indexOf("arrow-dr") != -1 & document.getElementById(AttackerFoe).classList.contains("foe")){
			defenderFoe = (Number(enemyRow))*4+(Number(enemyCol)+1);
			if(usedSlots.includes(defenderFoe) & defenderFoe%4 !=1 & defenderFoe < 17){
				newRowFoe = Number(enemyRow) +1;
				newColFoe = Number(enemyCol) +1;
				downRight = "card"+newRowFoe + newColFoe; 
				downRightDefender = document.getElementById(downRight);
				if(downRightDefender.classList.contains("friend") & downRightDefender.innerHTML.indexOf("arrow-ul") != -1) {
					battleFoe(downRight, AttackerFoe, 'moveCardDownRight', 'moveCardUpLeft');
					defenderListFoe.push(downRight);
					waitTime = 2000;
				}
				else {
					if(!downRightDefender.classList.contains("blocker") & downRightDefender.classList.contains("friend") & downRightDefender.innerHTML.indexOf("arrow-ul") == -1){
					hostileTakeoverFoe.push(downRight);
					}
				}
			}	
		}
		
		if(hostileTakeoverFoe.length > 0) {
			waitTime = 500;
		}

	setTimeout(function(){
		if(document.getElementById("card"+Number(enemyRow)+Number(enemyCol)).classList.contains("foe")) {
			j = hostileTakeoverFoe.length;
			for(k = 0; k < j; k++){
				var takeOver = hostileTakeoverFoe.pop();
				document.getElementById(takeOver).classList.remove("friend");
				document.getElementById(takeOver).classList.add("foe");
				scoreChange(false);
			}
		}
		setTimeout(function(){checkWin();}, 2000);
		
	}, waitTime); /* hostile takeovers */
	}, waitTime); /* Down Right */
	}, waitTime); /* Down */
	}, waitTime); /* Down Left */
	}, waitTime); /* Right */
	}, waitTime); /* Left */
	}, waitTime); /* Up Right */
	}, waitTime); /* Up */
	}, waitTime); /* Up Left */
}


