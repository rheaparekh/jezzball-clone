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

     var colors={
        board:'#daebe8',
        buildingwall:'#b7d7e8',
        wall:'#a4c1d0',
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
                if(i==0||j==0||i==rows-1||j==columns-1){
                  $scope.board[i][j]='wall';
                }else{
                 $scope.board[i][j]=false;
                }
             }
         }
     }

     $scope.setStyling=function(col,row){
       if($scope.board[col][row]==true){
           return colors.buildingwall;
       }
       else if($scope.board[col][row]=='wall'){
           return colors.wall;
       } 
       return colors.board; 
     }

     $scope.addBall=function(count){
         while(count>0){
            $scope.balls.push({
                x:21+(width-21) * Math.random(),
                y:231+(height-21) * Math.random(),
                velx: speed*(Math.random()*2-1),
                vely: speed*(Math.random()*2-1),
            });
            count--;
         }
     }

     function Bounce(){
         balls=$scope.balls;
         var l=balls.length; 
         for(var i=0; i<l;i++){
            var b=balls[i];
            var r=Math.floor(b.x/21)
            var c=Math.floor((b.y-210)/21);
            if($scope.board[c][r]=='wall'){
                if($scope.board[c][r-1]!='wall' && $scope.board[c][r+1]!='wall'){
                   if(b.velx<0){               
                     BounceX(b,r*21+21);
                   }
                }else{
                    if(b.vely<0){
                     BounceY(b,21*c+21);

                    }
                }
            }
            else if($scope.board[c][r+1]=='wall'){
                if(b.velx>0){
                   BounceX(b,r*21);
                }
            }
            else if($scope.board[c+1][r]=='wall'){
               if(b.vely>0){
                 BounceY(b,c*21);
               }
            }
         //   if(b.y>height+210-21){
           //    BounceY(b,height-21);
           // }
            b.x+=b.velx;
            b.y+=b.vely;
         }$timeout(Bounce,50);
    }

    function BounceX(b,width){
        b.x=2*width-b.x;
        b.velx*=-1;
    }
    function BounceY(b,height){
         b.y=420-b.y+2*height;
         b.vely*=-1;
    }
    var countwall=0;
    $scope.startLine=function(column,row){  
        if(isGameOver==false){ 
           if($scope.mode=='H'){
               drawline(column,row,1,0,0,true);
               drawline(column,row,-1,0,0,true);
           }
           else{
               drawline(column,row,0,1,0,true);
               drawline(column,row,0,-1,0,true);
           }
        }
    }

    function drawline(column,row,hor,ver,count,check){
     if(check==true){
        if($scope.board[column][row]=='wall'){
            makewall(column,row,count,hor,ver);
        }
        else if(count>0 && (column==0||column==23)){
           count+=1;  
           $scope.board[column][row]=true;
           makewall(column,row,count,hor,ver);
        }
        else{
            count+=1;
            $scope.board[column][row]=true;
            row=row-hor;
            column=column-ver;
            var random=checkcollision(column,row,count,hor,ver,check);
            $timeout(function(){drawline(column,row,hor,ver,count,random);},160);
        }
     }
    }
    
    function makewall(column,row,count,hor,ver){
          if(ver==0){
              for(var i=0;i<=count;i++){
                 $scope.board[column][row+i*hor]='wall';
              }
          }
          else{
              for(var i=0;i<=count;i++){
                 $scope.board[column+i*ver][row]='wall';
              }
          }
    }

    function checkcollision(column,row,count,hor,ver,check){
       balls=$scope.balls;
       var l=balls.length; 
       for(var i=0; i<l;i++){
          var b=balls[i];
          var r=Math.floor(b.x/21)
          var c=Math.floor((b.y-210)/21);
          if(c!=0 && $scope.board[c-1][r]==true && b.vely<0){
              destroyWall(column,row,count,hor,ver);
              check=false;
          }
          else if(c!=40 && $scope.board[c+1][r]==true && b.vely>0){
             destroyWall(column,row,count,hor,ver);
             check=false;
          }
          else if(r!=0 && $scope.board[c][r-1]==true && b.velx<0){
             destroyWall(column,row,count,hor,ver);
             check=false;
          }
          else if(r!=23 && $scope.board[c][r+1]==true && b.velx>0){
             destroyWall(column,row,count,hor,ver);
             check=false;
          }
       }
       return check;
    }

    function destroyWall(column,row,count,hor,ver){
          if(ver==0){
               for(var i=0;i<=count;i++){
                 if($scope.board[column][row+i*hor]!='wall'){
                   $scope.board[column][row+i*hor]=false;
                 }
               } 
          }
          else{
               for(var i=0;i<=count; i++){
                 if($scope.board[column+i*ver][row]!='wall'){
                   $scope.board[column+i*ver][row]=false;
                 }
               }
          }
    }
    setupBoard();
    $scope.addBall(2);
});
