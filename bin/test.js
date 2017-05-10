var async = require('async');
 
var i = 0;
var j = 0;
async.whilst(
    function(){
        console.log('check'+i);
        return i<6;
    },
 
    function(whileCb){
        j=0;
        i++;
        console.log('while:'+i)
        async.whilst(
            function(){
                //console.log('check'+j);
                return j<5;
            },
            function(whileCb1){
                j++;
                console.log('whileCb1'+j);
                whileCb1();
            },
            function(err){
                console.log('second');
                whileCb(); // invoke when inner whilst done
            }
        )  
    },
     
    function(err){
        console.log(err);
    }
 
)