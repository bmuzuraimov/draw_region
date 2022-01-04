var video_boundaries = $("#streaming-video")[0].getBoundingClientRect();//get coordinates of the video
var cursor_pos = { x: -1, y: -1 };//cursor coordinates relatively to the video frame
var last_line = $('svg line').length-1;//length of the last line in svg
var active_line = true;//line follow cursor
var first_point = true;//remember first coordinates to check if distance with last point is close
// Size of browser viewport.
var width = window.screen.height;//width of browser's viewport
var height = window.screen.width;//height of browser's viewport
var region_coordinates = [];//region coordinates
$('#streaming-video').mousemove(function(){
    cursor_pos.x = event.pageX-video_boundaries.left;
    cursor_pos.y = event.pageY-video_boundaries.top;
    if(active_line){
        $("svg line").eq(last_line).attr('x2',cursor_pos.x).attr('y2',cursor_pos.y);
        $("svg circle").attr('cx', cursor_pos.x).attr('cy', cursor_pos.y);
    }
});

$("#draw-region").change(function() {
    if(this.checked) {
        $("video").trigger('pause');
        $('svg').removeClass('hidden');
    }else{
        $("video").trigger('play');
        $('svg').addClass('hidden');
    }
});

$("video").click(function() {
    cursor_pos.x = event.pageX-video_boundaries.left;
    cursor_pos.y = event.pageY-video_boundaries.top;
    if(first_point){
        first_point = false;
        region_coordinates.push([cursor_pos.x,cursor_pos.y]);
    }else{
        let dist = Math.sqrt( Math.pow((cursor_pos.x-region_coordinates[0][0]), 2) + Math.pow((cursor_pos.y-region_coordinates[0][1]), 2) );
        if (dist<10) {
            active_line = false;
            cursor_pos.x = init_cor.x;
            cursor_pos.y = init_cor.y;
        }else{
            region_coordinates.push([cursor_pos.x,cursor_pos.y]);
        }
    }
    console.log(region_coordinates);//shows coordinates of plotted dots
    $(document.createElementNS('http://www.w3.org/2000/svg','line')).attr({x1:cursor_pos.x,y1:cursor_pos.y,x2:cursor_pos.x,y2:cursor_pos.y}).appendTo("svg");
});
