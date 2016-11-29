var canvasWidth = Math.min( 800 , $(window).width() - 20 ),//最大800，宽度自适应
    canvasHeight = canvasWidth,
    strokeColor = "black",//绘制色彩记录
    isMouseDown = false,//是否在绘制
    lastLoc = {x:0,y:0},
    lastTimestamp = 0,
    lastLineWidth = -1,
    canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    maxLineWidth = 30,
    minLineWidth = 1,
    maxStrokeV = 10,
    minStrokeV = 0.1;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
$("#controller").css("width",canvasWidth+"px");
drawGrid();
//清除写的字
$("#clear_btn").click(
    function(e){
        context.clearRect( 0 , 0 , canvasWidth, canvasHeight );
        lastLineWidth = -1;//清除字之后上一次置为初始的值
        drawGrid();
    }
);
//换颜色
$(".color_btn").click(
    function(e){
        $(".color_btn").removeClass("color_btn_selected");
        $(this).addClass("color_btn_selected");
        strokeColor = $(this).css("background-color");
    }
);
function beginStroke(point){
    isMouseDown = true;
    lastLoc = windowToCanvas(point.x, point.y);
    lastTimestamp = new Date().getTime();
}
function endStroke(){
    isMouseDown = false;
}
function moveStroke(point){
    var curLoc = windowToCanvas( point.x , point.y );
    var curTimestamp = new Date().getTime();
    var s = calcDistance( curLoc , lastLoc );
    var t = curTimestamp - lastTimestamp;//得出上一次函数调用和这一次的时间差
    //利用时间触发的时间差来决定绘制的线条的粗细
    var lineWidth = calcLineWidth( t , s );
    context.beginPath();
    context.moveTo( lastLoc.x , lastLoc.y );
    context.lineTo( curLoc.x , curLoc.y );
    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    lastLoc = curLoc;
    lastTimestamp = curTimestamp;
    lastLineWidth = lineWidth;//记录下此次绘制完之后的宽度
}
canvas.onmousedown = function(e){
    e.preventDefault();
    beginStroke( {x: e.clientX , y: e.clientY} );
};
canvas.onmouseup = function(e){
    e.preventDefault();
    endStroke();
};
canvas.onmouseout = function(e){
    e.preventDefault();
    endStroke();
};
canvas.onmousemove = function(e){
    e.preventDefault();
    if( isMouseDown ){
        moveStroke({x: e.clientX , y: e.clientY});
    }
};
canvas.addEventListener('touchstart',function(e){
    e.preventDefault();
    touch = e.touches[0];
    beginStroke( {x: touch.pageX , y: touch.pageY} );
});
canvas.addEventListener('touchmove',function(e){
    e.preventDefault();
    if( isMouseDown ){
        touch = e.touches[0];//由于触控事件可能存在多点触控，所以只用第0个元素做为开始位置
        moveStroke({x: touch.pageX , y: touch.pageY});
    }
});
canvas.addEventListener('touchend',function(e){
    e.preventDefault();
    endStroke();
});
//算出笔画的宽度
function calcLineWidth( t , s ){
    var v = s / t;//速度
    var resultLineWidth;
    if( v <= minStrokeV )//速度慢于0.1
        resultLineWidth = maxLineWidth;
    else if ( v >= maxStrokeV )//速度快于10
        resultLineWidth = minLineWidth;
    else{
        resultLineWidth = maxLineWidth - (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
    }
    if( lastLineWidth == -1 ) return resultLineWidth;//开始一次新的绘制
    return resultLineWidth*1/3 + lastLineWidth*2/3;
}
//算出两点之间的直线距离
function calcDistance( loc1 , loc2 ){
    return Math.sqrt( (loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y) );
}
//x，y点在canvas中的坐标
function windowToCanvas( x , y ){
    var bbox = canvas.getBoundingClientRect();
    return {x:Math.round(x-bbox.left) , y:Math.round(y-bbox.top)};
}
//画米字格
function drawGrid(){
    context.save();
    context.strokeStyle = "rgb(230,11,9)";
    context.beginPath();
    context.moveTo( 3 , 3 );
    context.lineTo( canvasWidth - 3 , 3 );
    context.lineTo( canvasWidth - 3 , canvasHeight - 3 );
    context.lineTo( 3 , canvasHeight - 3 );
    context.closePath();
    context.lineWidth = 6;
    context.stroke();
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(canvasWidth,canvasHeight);
    context.moveTo(canvasWidth,0);
    context.lineTo(0,canvasHeight);
    context.moveTo(canvasWidth/2,0);
    context.lineTo(canvasWidth/2,canvasHeight);
    context.moveTo(0,canvasHeight/2);
    context.lineTo(canvasWidth,canvasHeight/2);
    context.lineWidth = 1;
    context.stroke();
    context.restore();
}