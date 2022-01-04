var vid_bound = $('#streaming-video')[0].getBoundingClientRect();//get coordinates of the video
var m_pos = { x: -1, y: -1 };//cursor coordinates relatively to the video frame
var l_line = $('svg line').length-1;//index of the last line
var a_line = true;//is line follow mouse
var f_point = true;//remember first point to check if distance with last point is close
var regions = new Array();//all regions
var cur_region = new Array();//current region coordinates
$('#streaming-video').mousemove(function(){
    m_pos.x = event.pageX-vid_bound.left;
    m_pos.y = event.pageY-vid_bound.top;
    if(a_line){
        if (!f_point) {
            $('svg line').eq(l_line).attr('x2',m_pos.x).attr('y2',m_pos.y);
        }
        $('#cursor').attr('cx', m_pos.x).attr('cy', m_pos.y);
    }
});
$('#draw-btn').click(function() {
    let mode = $('#draw-btn').text();
    if (mode=='Set Count Region') {
        $('#draw-btn').text('Cancel');
        $('svg').removeClass('hidden');
        $('.panel__video video').css({'cursor': 'crosshair'});
    }else if (mode=='Cancel') {
        $('#draw-btn').text('Set Count Region');
        $('svg').addClass('hidden');
        $('.panel__video video').css({'cursor': 'default'});
    }else if (mode=='Reset' && regions.length == 0) {
        $('#draw-btn').text('Cancel');
        $('svg line:nth-last-of-type(-n+'+cur_region.length+')').remove();
        cur_region = [];
        f_point = true;
    }else if (mode=='Reset' && regions.length > 0) {
        $('#draw-btn').text('Save');
        $('svg line:nth-last-of-type(-n+'+cur_region.length+')').remove();
        cur_region = [];
        f_point = true;
    } else {
        alert('Image Saved');
        $('#draw-btn').text('Set Count Region');
        a_line = true;
    }
});

$('#streaming-video').click(function(){
    let mode = $('#draw-btn').text();
    if(mode!='Set Count Region'){
        m_pos.x = event.pageX-vid_bound.left;
        m_pos.y = event.pageY-vid_bound.top;
        m_pos.x = m_pos.x.toFixed(2);
        m_pos.y = m_pos.y.toFixed(2);
        if(f_point){
            $('#draw-btn').text('Reset');
            f_point = false;
            regions.push(cur_region);//create new region
            regions[regions.length-1].push([m_pos.x,m_pos.y]);
        }else{
            let dist = Math.sqrt(Math.pow((m_pos.x-cur_region[0][0]), 2) + Math.pow((m_pos.y-cur_region[0][1]), 2));
            if (dist<10) {
                $('#draw-btn').text('Save');
                $('svg line').eq(l_line).attr('x2',regions[regions.length-1][0][0]).attr('y2',regions[regions.length-1][0][1]);
                $(document.createElementNS('http://www.w3.org/2000/svg','circle')).attr({cx:regions[regions.length-1][0][0],cy:regions[regions.length-1][0][1],r:2}).appendTo("svg");
                $('svg line').css({'stroke-width': '4'});
                $('svg circle').css({'stroke-width': '5'});
                f_point = true;
                cur_region = [];//empty current region array
                let json_regions = JSON.stringify(regions);
                console.log(json_regions);//shows coordinates of plotted dots
                return false;
            }else{
                regions[regions.length-1].push([m_pos.x,m_pos.y]);
            }
        }
        $(document.createElementNS('http://www.w3.org/2000/svg','line')).attr({x1:m_pos.x,y1:m_pos.y,x2:m_pos.x,y2:m_pos.y}).appendTo("svg");
    }
});

