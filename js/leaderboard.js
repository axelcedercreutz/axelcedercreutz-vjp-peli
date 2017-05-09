//hides the table for the highscore
$('.game-section').hide();
//adds the firebase-database
var ref = new Firebase("https://vjp-peli-5db4f.firebaseio.com/");
ref = ref.child("leaderboard");
//creates the array to fetch the data
var array = [];
$(document).ready(function(){
    getData();
    $('#highscore-button').click('click', function(e) {
        $('.game-section').toggle();
    });
});
// function that get's the data from the database as a json, maps it an sorts it by its value.
// at the end it writes the new table
function getData() {
    $.getJSON('https://vjp-peli-5db4f.firebaseio.com/.json',function(res){
        var leaderboard = res.leaderboard;
        array = $.map(leaderboard, function(value,index){
            return[value];
        })
        array = array.sort(SortByValue);
        writeTable(array);
    });
}

// sorts the array from largest to smallest
function SortByValue(a, b){
  var aScore = a.score;
  var bScore = b.score; 
  return ((bScore < aScore) ? -1 : ((bScore > aScore) ? 1 : 0));
}
// writes the table based on the sorted array. There are a maximum of 10 being displayed.
function writeTable(array) {
    var count = 0;
    // cache <tbody> element:
    var tbody = $('#tableBody');
    tbody.empty();
    //creates the first row with the headers
    var tr = $('<tr/>').appendTo(tbody);
    tr.append('<th> Place </th>');
    tr.append('<th> Name </th>');
    tr.append('<th> Score </th>');

    //shows the 10 best scores
    if(array.length >= 10) {
        for (var i = 0; i < 10; i++) {
            // create an <tr> element, append it to the <tbody> and cache it as a variable:
            var tr = $('<tr/>').appendTo(tbody);
            // append <td> elements to previously created <tr> element:
            tr.append('<td>' + [i + 1] + '. </td>');
            tr.append('<td>' + array[i].name + '</td>');
            tr.append('<td>' + array[i].score  + '</td>'); 
            count++;
        }
    }
    else {
        for (var i = 0; i < array.length; i++) {
            // create an <tr> element, append it to the <tbody> and cache it as a variable:
            var tr = $('<tr/>').appendTo(tbody);
            // append <td> elements to previously created <tr> element:
            tr.append('<td>' + [i + 1] + '. </td>');
            tr.append('<td>' + array[i].name + '</td>');
            tr.append('<td>' + array[i].score + '</td>');
            count++;
        }
    }
    // reset the count:
    count = 0;
}