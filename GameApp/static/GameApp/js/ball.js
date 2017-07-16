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

app.config(function($httpProvider){
      $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});

app.controller('ballCtrl',function($scope,$timeout,$http){
     var timeout;
     var width=840;
     var height=483;
     var speed=6;
     var rows=24;
     var columns=41;
     var filled_cells=0;

     var colors={
        board:'#daebe8',
        buildingwall:'#b7d7e8',
        wall:'#a4c1d0',
        markwall:'#999999',
     };
     $scope.life=3; 
     $scope.mode='H';
     $scope.isGameOver=false;
     $scope.check=false;
     $scope.balls=[];
     $scope.score= 0;
     $scope.percent=0;
     $scope.nextlevel=false;
      
     $scope.startGame=function(){
        setupBoard();
        $scope.balls=[];
        $scope.addBall(2);
        $scope.level=1;
        $scope.score=0;
        $scope.percent=0;
        $scope.life=3;
        Bounce();
        timeout=new Date().getTime();
        $scope.isGameOver= false;
        $scope.check=true;
     };

     function gameOver(){
         $scope.check=false;
         $scope.isGameOver=true;
         var userdata={'score':$scope.score,
                       'date':new Date().getTime(),
                       }
         $.ajax({
             method:'POST',
             url:"/save_scores",
             data:userdata,
             error:function(e){
               console.log(e);
             },
         });
     };

     $scope.nextLevel=function(){
        $scope.nextlevel=false;
        setupBoard();
        $scope.percent=0;
        $scope.level=$scope.level+1;
        $scope.score=$scope.score+200;
        $scope.addBall(1);
     }

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
             $scope.board[0][0]='markwall';
             $scope.board[0][40]='markwall';
             $scope.board[23][0]='markwall';
             $scope.board[23][40]='markwall';
         
     }

     $scope.setStyling=function(col,row){
       if($scope.board[col][row]==true){
           return colors.buildingwall;
       }
       else if($scope.board[col][row]=='wall'){
           return colors.wall;
       }
       else if($scope.board[col][row]=='markwall'){
          return colors.markwall;
       }
       return colors.board; 
     }

     $scope.addBall=function(count){
         while(count>0){
            $scope.balls.push({
                x:21+(width-42) * Math.random(),
                y:181+(height-42) * Math.random(),
              //  velx: speed*(Math.random()*2-1),
                //vely: speed*(Math.random()*2-1),
                velx:3,
                vely:4,
            });
            count--;
         }
     }

     function Bounce(){
       if($scope.life>0){
         balls=$scope.balls;
         var l=balls.length; 
         for(var i=0; i<l;i++){
            var b=balls[i];
            var r=Math.floor(b.x/21);
            var c=Math.floor((b.y-160)/21);
          //  if($scope.board[c][r]=='wall'){
            //    console.log("not cool");
              //  if(($scope.board[c][r-1]!='wall' && $scope.board[c][r+1]!='wall')){
                 //  if(b.velx<0){               
                   //  BounceX(b,r*21+21);
                   //  console.log("Dgh");

                   //}
                //}else{
                  //  if(b.vely<0){
                    // BounceY(b,21*c+21);
                     //console.log("dhus");
                    //}
                //}
           // }
           if($scope.board[c][r+1]=='wall' || $scope.board[c][r+1]=='markwall'){
                if(b.velx>0){
                   BounceX(b,r*21);
                }
            }
            else if($scope.board[c+1][r]=='wall' || $scope.board[c+1][r]=='markwall'){
               if(b.vely>0){
                 BounceY(b,c*21);
               }
            }
            else if($scope.board[c][r-1]=='wall'|| $scope.board[c][r-1]=='markwall'){
                if(b.velx<0){
                   BounceX(b,r*21+21);
                }
            }
            else if($scope.board[c-1][r]=='wall'|| $scope.board[c-1][r]=='markwall'){
               if(b.vely<0){
                 BounceY(b,c*21+21);
               }
            }
            b.x+=b.velx;
            b.y+=b.vely;
         }$timeout(Bounce,50);
      }
    }

    function BounceX(b,width){
        b.x=2*width-b.x;
        b.velx*=-1;
    }
    function BounceY(b,height){
         b.y=320-b.y+2*height;
         b.vely*=-1;
    }
    
    $scope.startLine=function(column,row){  
        if($scope.isGameOver==false && $scope.board[column][row]==false && $scope.check==true){ 
           counter=0;
           if($scope.mode=='H'){
               drawline(column,row,-1,0,0,true);
               drawline(column,row,1,0,0,true);
           }
           else{
               drawline(column,row,0,1,0,true);
               drawline(column,row,0,-1,0,true);
           }
        }
    }

    function drawline(column,row,hor,ver,count,check){
     if($scope.life>0){
      if(check==true){
        if($scope.board[column][row]=='wall' || $scope.board[column][row]=='markwall'){
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
   }
    var counter=0;
    var savecolumn,saverow;
    function makewall(column,row,count,hor,ver){
          counter++;
          filled_cells=0;
          if(ver==0){
              for(var i=0;i<=count;i++){
                 if($scope.board[column][row+i*hor]=='wall'|| $scope.board[column][row+i*hor]=='markwall'){
                    $scope.board[column][row+i*hor]='markwall';
                    filled_cells+=1;
                 }
                 else{
                     $scope.board[column][row+i*hor]='wall';
                     filled_cells+=1;
                 }
              }
              $scope.percent=(($scope.percent*863/100+filled_cells)/863)*100;
          }
          else{
              for(var i=0;i<=count;i++){
               if($scope.board[column+i*ver][row]=='wall'|| $scope.board[column+i*ver][row]=='markwall'){
                  $scope.board[column+i*ver][row]='markwall';
                  filled_cells+=1;
               }
               else{
                 $scope.board[column+i*ver][row]='wall';
                 filled_cells+=1;
               }
              }
             $scope.percent=(($scope.percent*863/100+filled_cells)/863)*100;
          }
          coverBoard(column,row,hor,ver,counter);
          if(counter==2){
            counter=0;
          } 
          if($scope.percent>=75){
             $scope.nextlevel=true;
          }
    } 

    function coverBoard(column,row,hor,ver,counter){
        balls=$scope.balls;
        var l=balls.length;
        var checkball,checkcolumn1,checkcolumn2,checkrow1,checkrow2;
        var countball1=0,countball2=0;
        if(counter==1){
           saverow=row;
           savecolumn=column;
        }
        if(counter==2){
            if(ver==0){
              for(var i=1;i<=column;i++){
                  if($scope.board[column-i][row]=='markwall' && $scope.board[column-i][saverow]=='markwall'){
                     checkcolumn1=column-i;
                     break;
                  }
              }
              for(var i=column+1;i<=23;i++){
                   if($scope.board[i][row]=='markwall' && $scope.board[i][saverow]=='markwall'){
                      checkcolumn2=i;
                      break;
                   }
              }
            }
            else if(hor==0){
               for(var i=1; i<=row; i++){
                  if($scope.board[column][row-i]=='markwall' && $scope.board[savecolumn][row-i]=='markwall'){
                     checkrow1=row-i;
                     break;
                  }
               }
               for(var i=row+1; i<=40; i++){
                  if($scope.board[column][i]=='markwall' && $scope.board[savecolumn][i]=='markwall'){
                      checkrow2=i;
                      break;
                  }
               }
            }
        }
        if(saverow>row){
          var k=saverow;
          saverow=row;
          row=k;
        }
        if(savecolumn>column){
          var k=savecolumn;
          savecolumn=column;
          column=k;
        }
        console.log(savecolumn,column,saverow,row);
        for(var i=0;i<l;i++){
             var b=balls[i];
             var r=Math.floor(b.x/21);
             var c=Math.floor((b.y-210)/21);
             if(ver==0 && counter==2){
                if((c<checkcolumn1)|| (c>column)){
                   countball1+=1;
                   console.log(countball1);
                   if(countball1>=l){
                       Fillcell(row,saverow,column,checkcolumn1,1,0);
                   }
                }
                else if((c>checkcolumn1)||c<column){
                  if(r<saverow||r>row){
                     countball1+=1;
                     console.log(countball1);
                     if(countball1>=l){
                         Fillcell(row,saverow,column,checkcolumn1,1,0);
                     }
                  }
                }
                if((c<column)|| (c>checkcolumn2)){
                   countball2+=1;
                   console.log(countball2);
                   if(countball2>=l){
                      Fillcell(row,saverow,column,checkcolumn2,1,0);
                   }
                }
                else if(c>column||c<checkcolumn2){
                   if(r<saverow||r>row){
                     countball2+=1;
                     console.log(countball2);
                     if(countball2>=l){
                       Fillcell(row,saverow,column,checkcolumn2,1,0);
                     }
                   }
                }
             }else if(hor==0 && counter==2){
                if((r<checkrow1)||(r>row)){
                   countball1+=1;
                   console.log(countball1);
                   if(countball1>=l){
                       Fillcell(row,checkrow1,column,savecolumn,0,1);
                   }
                }
                else if(r>checkrow1||r<row){
                  if(c<savecolumn||c>column){
                     countball1+=1;
                     console.log(countball1);
                     if(countball1>=l){
                          Fillcell(row,checkrow1,column,savecolumn,0,1);
                     }
                  }
                }
                if((r<row)||(r>checkrow2)){
                   countball2+=1;
                   console.log(countball2);
                   if(countball2>=l){
                      Fillcell(row,checkrow2,column,savecolumn,0,1);
                   }
                }
                else if(r>row||r<checkrow2){
                   if(c<savecolumn||c>column){
                     countball2+=1;
                     console.log(countball2);
                     if(countball2>=l){
                        Fillcell(row,checkrow2,column,savecolumn,0,1);
                     }
                   }
                }
           }
        }    
    }
    
    function Fillcell(row1,row2,column1,column2,hor,ver){
       var c1,c2,r1,r2;
       if(column1<column2){
          var k=column1;
          column1=column2;
          column2=k;
       }
      if(row1<row2){
          var k=row1;
          row1=row2;
          row2=k;
      }
      filled_cells=0;
      if(ver==0){
        for(var i=row2+1; i<row1; i++){
           for(var j=column2+1; j<column1; j++){
              $scope.board[j][i]='wall';
              if(j!=column2||j!=column1){
                 filled_cells+=1;
              }
           }
        }
        $scope.percent=(($scope.percent*863/100+filled_cells)/863)*100;
      }else{
        for(var i=row2+1; i<row1; i++){
            for(var j=column2+1; j<column1; j++){
               $scope.board[j][i]='wall';
               if(i!=row1||i!=row2){
                 filled_cells+=1;
               }
            }
        }
        $scope.percent=(($scope.percent*863/100+filled_cells)/863)*100;
      }
      if($scope.percent>=75){
         $scope.nextlevel=true;
      }
    }

    function checkcollision(column,row,count,hor,ver,check){
       balls=$scope.balls;
       var l=balls.length; 
       for(var i=0; i<l;i++){
          var b=balls[i];
          var r=Math.floor(b.x/21)
          var c=Math.floor((b.y-160)/21);
          if((c!=0 && $scope.board[c-1][r]==true && b.vely<0)||
             (c!=40 && $scope.board[c+1][r]==true && b.vely>0)||
             (r!=0 && $scope.board[c][r-1]==true && b.velx<0)||
             (r!=23 && $scope.board[c][r+1]==true && b.velx>0)){
              destroyWall(column,row,count,hor,ver);
              check=false;
          }
       }
       return check;
    }

    function destroyWall(column,row,count,hor,ver){
          $scope.life-=1;
          if($scope.life==0){
            gameOver();
          }
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
});
