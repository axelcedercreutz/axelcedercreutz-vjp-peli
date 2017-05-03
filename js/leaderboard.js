$(document).ready(function(){
    $.getJSON('https://vjp-peli-5db4f.firebaseio.com/.json',function(res){
        console.log(res.leaderboard.length);
    });
    var results = [];
});