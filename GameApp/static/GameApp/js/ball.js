var app= angular.module('ngBall',[])
app.directive('ballPosition',function(){
    return function(scope,element,attrs){
        element.addClass('circle');
        var ball=scope[attrs.ballPosition];
        
        scope.$watch(function(){
           element.css({
                left:(ball.x+5)+'px',
                top:(ball.y+5)+'px',
           });
        });
    };
})
app.controller('ballCtrl',function($scope,$timeout){
     var isGameOver,timeout;
     var width=840;
     var height=483;
     var speed=1;
     var rows=24;
     var columns=41;

     $scope.balls=[];
     $scope.score= 0;

     $scope.startGame=function(){
        $scope.score=1;
        Bounce();
        timeout=new Date().getTime();
        isGameOver= false;
     };

     function gameOver(){
         isGameOver=true;
     };
     
     function setupBoard(){
         $scope.board=[];
         for(var i=0;i<rows;i++){
             $scope.board[i]=[];
             for(var j=0; j<columns; j++){
                $scope.board[i][j]=false;
             }
         }
     }
    
     $scope.addBall=function(count){
         while(count>0){
            $scope.balls.push({
                x:width * Math.random(),
                y:210+height * Math.random(),
                velx: speed*(Math.random()*2-1),
                vely: speed,
            });
            count--;
         }
     }

     function Bounce(){
         balls=$scope.balls;
         var l=balls.length; 
         for(var i=0; i<l;i++){
            var b=balls[i];
            b.x+=b.velx;
            b.y+=b.vely;
            if(b.x<0){
               b.x *= -1;
               b.velx *= -1;
            } 
            if(b.y<210){
               b.y =(210-b.y)+210;
               b.vely *= -1;
            } 
            if(b.x> width){
               b.x = 2*width - b.x;
               b.velx *= -1;
            }
            if(b.y>height+210){
               b.y = 2*height+420 - b.y;
               b.vely *= -1;
            }
         }
         $timeout(Bounce,10);
    } 
    setupBoard();
    $scope.addBall(2);
});
