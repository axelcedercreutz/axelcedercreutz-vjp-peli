$(document).ready(function(){
    $.getJSON('https://project-8145367811882739054.firebaseio.com/.json',function(res){
        console.log(res);
    });
});