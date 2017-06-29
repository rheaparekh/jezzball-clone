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
app.directive('ngMouseWheelUp',function(){
   return function(scope,element, attrs){
       element.bind("DOMMouseScroll mousewheel onmousewheel",function(event){
              var event=window.event || event;
              var delta=Math.max(-1,Math.min(1,(event.wheelDelta || -event.detail)));
              if(delta>0){
                  scope.$apply(function(){
                      scope.$eval(attrs.ngMouseWheelUp);
                  });
                  event.returnValue=false;
                  if(event.preventDefault){
                     event.preventDefault();
                  }
              }
       });
   };
});
app.directive('ngMouseWheelUp',function(){
   return function(scope,element, attrs){
       element.bind("DOMMouseScroll mousewheel onmousewheel",function(event){
              var event=window.event || event;
              var delta=Math.max(-1,Math.min(1,(event.wheelDelta || -event.detail)));
              if(delta<0){
                  scope.$apply(function(){
                      scope.$eval(attrs.ngMouseWheelDown);
                  });
                  event.returnValue=false;
                  if(event.preventDefault){
                     event.preventDefault();
                  }
              }
       });
   };
});
app.controller('ballCtrl',function($scope,$timeout){
     var isGameOver,timeout;
     var width=840;
     var height=483;
     var speed=2;
     var rows=24;
     var columns=41;
     var wallspeed=4;

     var colors={
        board:'#daebe8',
        buildingwall:'#98a4a2',
        wall:'#414645',
     };
     
     $scope.mode='H';
     
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

     $scope.setStyling=function(col,row){
       if($scope.board[col][row]==true){
           return colors.buildingwall;
       }
       else if($scope.board[col][row]=='wall'){
           return colors.wall;
       }else{   
           return colors.board;
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
               BounceX(b,0);
            } 
            if(b.y<210){
               BounceY(b,0);
            } 
            if(b.x> width){
               BounceX(b,width);
            }
            if(b.y>height+210){
               BounceY(b,height);
            }
         }
         $timeout(Bounce,10);
    }

    function BounceX(b,width){
        b.x=2*width-b.x;
        b.velx*=-1;
    }
    function BounceY(b,height){
         b.y=420-b.y+2*height;
         b.vely*=-1;
    }

    $scope.startLine=function(column,row){
        
        if(isGameOver==false){ 
           console.log(column,row);
           if($scope.mode=='H'){
               $scope.board[column][row]==true;
               $scope.setStyling(column,row);
           }
           else{
              console.log("FINALLY GOD");
           }
        }
    }


    setupBoard();
    $scope.addBall(2);
});
