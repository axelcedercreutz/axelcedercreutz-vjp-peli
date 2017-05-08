var ref = new Firebase("https://vjp-peli-5db4f.firebaseio.com/");
ref = ref.child("leaderboard");
var array = [];
$(document).ready(function(){
    getData();
});
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
function SortByValue(a, b){
  var aScore = a.score;
  var bScore = b.score; 
  return ((bScore < aScore) ? -1 : ((bScore > aScore) ? 1 : 0));
}
function writeTable(array) {
    var count = 0;
    // cache <tbody> element:
    var tbody = $('#tableBody');
    tbody.empty();
    if(array.length >= 10) {
        for (var i = 0; i < 10; i++) {
            // create an <tr> element, append it to the <tbody> and cache it as a variable:
            var tr = $('<tr/>').appendTo(tbody);
            // append <td> elements to previously created <tr> element:
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
                tr.append('<td>' + array[i].name + '</td>');
                tr.append('<td>' + array[i].score + '</td>');
            count++;
        }
    }
    // reset the count:
    count = 0;
}