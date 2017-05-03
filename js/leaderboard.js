$(document).ready(function(){
    var dbRef = new Firebase("https://vjp-peli-5db4f.firebaseio.com/");
    leaderboardRef = dbRef.child("leaderboard")
    console.log();
    $.getJSON('https://vjp-peli-5db4f.firebaseio.com/.json',function(res){
        console.log(dbRef.child("leaderboard"));
    });
});