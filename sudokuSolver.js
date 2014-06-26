$(function() {
	var solveButton = $('#solve');
	var clearButton = $('#clear');

	solveButton.bind('click', function() {
		solve();
	})

	clearButton.bind('click', function() {
		clearTable();
	})

	$('input.sudoCell').on('keyup', function(e){
		$(this).val($(this).val().replace(/[^1-9]/g, ''));
	});

	$('.sudoCell').on('click', function(){
		if($("#cantsolve").length > 0){
			$("#cantsolve").remove();
		}
	});
});

function convertFromStringToDOM(string) {
	uglyStringOfNumbers = string;
	var uglyArrayOfNumbers = uglyStringOfNumbers.split('\n');

	for(arrayCounter = 0; arrayCounter < 9; arrayCounter++) {
		uglyArrayOfNumbers[arrayCounter] = uglyArrayOfNumbers[arrayCounter].split(',');
	}

	return uglyArrayOfNumbers;
}

function replaceDashesPerRow(array){
	for(j=0;j<array.length;j++){
		if(array[j] == ''){
			array[j] = ['1','2','3','4','5','6','7','8','9'];
		}
	}
}

function replaceDashes(arrays){
	for(i=0;i<arrays.length;i++){
		replaceDashesPerRow(arrays[i]);
	}
}

function checkHorizontalVertical(array){
	takenNumbers = [];
	for(j=0;j<array.length;j++){
		if(typeof array[j] == 'string'){
			takenNumbers.push(array[j]);
		}
	}
	for(j=0;j<array.length;j++){
		if(array[j] instanceof Array){
			for(k=0;k<takenNumbers.length;k++){
				numberLocation = array[j].indexOf(takenNumbers[k]);
				if(numberLocation > -1){
					array[j].splice(numberLocation,1);
				}
			}
		}
	}
}

function checkRowsColumns(arrays){
	for(i=0;i<arrays.length;i++){
		checkHorizontalVertical(arrays[i]);
	}
}

function convertToVertical(arrays){
	verticalArray = [];
 	for (i=0;i<arrays.length;i++) {
    	verticalArray[i] = [];
    	for (j=0;j<arrays[i].length;j++) {
      		verticalArray[i][j] = arrays[j][i]
    	}
  	}
  	return verticalArray;
}

function convertToBoxes(arrays){
	boxArray = [];
	for(i=0;i<arrays.length;i+=3){
		for(j=0;j<arrays[i].length;j+=3){
			box = (((i/3)*3)+(j/3));
			boxArray[box] = [];
			for(k=i;k<(i+3);k++){
				for(l=j;l<(j+3);l++){
					boxArray[box].push(arrays[k][l]);
				}
			}
		}
	}
	return boxArray;
}

function convertBackToHorizontal(arrays){
	horizontalArray = convertToBoxes(arrays);
	horizontalArray = convertToVertical(horizontalArray);
	return horizontalArray;
}

function solveNumbersRows(array){
	for(j=0;j<array.length;j++){
		if(array[j] instanceof Array){
			if(array[j].length == 1){
				array[j] = array[j][0];
			}
		}
	}
}

function solveNumbers(arrays){
	for(i=0;i<arrays.length;i++){
		solveNumbersRows(arrays[i]);
	}
}

function checkSolvedRow(array){
	for(j=0;j<array.length;j++){
		if(array[j] instanceof Array){
			return false;
		}
	}
	return true;
}

function checkSolved(arrays){
	for(i=0;i<arrays.length;i++){
		if(!checkSolvedRow(arrays[i])){
			return false;
		}
	}
	return true;
}

function solve() {
	if($("#cantsolve").length > 0){
		$("#cantsolve").remove();
	}
	var counter = 0;
	var arrays = getArrayfromTable();
	var solved = false;
	while(!solved && counter < 100){
		replaceDashes(arrays);
		checkRowsColumns(arrays);
		arrays = convertToVertical(arrays);
		checkRowsColumns(arrays);
		arrays = convertToBoxes(arrays);
		checkRowsColumns(arrays);
		arrays = convertBackToHorizontal(arrays);
		solveNumbers(arrays);
		solved = checkSolved(arrays);
		counter++;
		console.log(counter);
	}
	if(solved){
		createTheSolvedTable(arrays);
	}else{
		$("#solve").after("<h3 id='cantsolve'>Cannot Solve</h3>");
	}
}

var initialArrays = [[' ',' ',' ',' ',' ',' ',' ',' ',' '],
					 [' ',' ',' ',' ',' ',' ',' ',' ',' '],
					 [' ',' ',' ',' ',' ',' ',' ',' ',' '],
					 [' ',' ',' ',' ',' ',' ',' ',' ',' '],
					 [' ',' ',' ',' ',' ',' ',' ',' ',' '],
					 [' ',' ',' ',' ',' ',' ',' ',' ',' '],
					 [' ',' ',' ',' ',' ',' ',' ',' ',' '],
					 [' ',' ',' ',' ',' ',' ',' ',' ',' '],
					 [' ',' ',' ',' ',' ',' ',' ',' ',' ']]

function createTheTable(arrays) {
	var $table = $('#sudoTable');

	for(var rowCount = 0; rowCount < arrays.length; rowCount++) {
		$('#row'+rowCount).remove();
		$table.append('<tr id=row'+rowCount+'></tr>');
		for(var columnCount = 0; columnCount < arrays[rowCount].length; columnCount++) {
			$('#row'+rowCount).append('<td id=column'+columnCount+'><input class="sudoCell" type="text" maxlength="1" value='+arrays[rowCount][columnCount]+'></td>');
		}
	}
}

function createTheSolvedTable(arrays) {
	if($("#cantsolve").length > 0){
		$("#cantsolve").remove();
	}
	var $table = $('#sudoTable');

	for(var rowCount = 0; rowCount < arrays.length; rowCount++) {
		$('#row'+rowCount).remove();
		$table.append('<tr id=row'+rowCount+'></tr>');
		for(var columnCount = 0; columnCount < arrays[rowCount].length; columnCount++) {
			$('#row'+rowCount).append('<td id=column'+columnCount+' class="correct"><input class="sudoCell" type="text" maxlength="1" value='+arrays[rowCount][columnCount]+' disabled="disabled"></td>');
		}
	}
}

function createTheGeneratedTable(arrays) {
	if($("#cantsolve").length > 0){
		$("#cantsolve").remove();
	}
	var $table = $('#sudoTable');

	for(var rowCount = 0; rowCount < arrays.length; rowCount++) {
		$('#row'+rowCount).remove();
		$table.append('<tr id=row'+rowCount+'></tr>');
		for(var columnCount = 0; columnCount < arrays[rowCount].length; columnCount++) {
			if(arrays[rowCount][columnCount] != ''){
				$('#row'+rowCount).append('<td id=column'+columnCount+' class="correct"><input class="sudoCell" type="text" maxlength="1" value='+arrays[rowCount][columnCount]+' disabled="disabled"></td>');
			}else{
				$('#row'+rowCount).append('<td id=column'+columnCount+'><input class="sudoCell" type="text" maxlength="1" value='+arrays[rowCount][columnCount]+'></td>');
			}
		}
	}
}

function clearTable() {
	if($("#cantsolve").length > 0){
		$("#cantsolve").remove();
	}
	createTheTable(initialArrays);
	$('input.sudoCell').on('keyup', function(e){
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
	});
}

function getArrayfromTable() {
	var numRows = document.getElementById('sudoTable').rows.length;
	var newArray = []

	for(i=0;i<numRows;i++){
		newArray[i] = [];
		var numColumns = document.getElementById('sudoTable').rows[i].cells.length
		for(j=0;j<numColumns;j++){
			newArray[i][j] = $('#sudoTable #row'+i+' #column'+j+' input').val();
		}
	}
	return newArray;
}

createTheTable(initialArrays);
//Taken from https://github.com/callumacrae/sudoku-creator

var button = document.getElementsByTagName('button')[0];
		
function refresh() {
	button.innerHTML = 'Generating';

	setTimeout(function () {
		var arrays = convertFromStringToDOM(formatSudoku(getSudoku()))
		createTheGeneratedTable(arrays);
		$('input.sudoCell').on('keyup', function(e){
			$(this).val($(this).val().replace(/[^0-9]/g, ''));
		});
		button.innerHTML = 'Generate';
	}, 10);

}
button.addEventListener('click', refresh);