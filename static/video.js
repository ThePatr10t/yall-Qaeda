
activeVidURL = null;
activeBB = null;

video = document.getElementById('v');
canvas = document.getElementById('canvas');

console.log(video);
console.log(canvas);

context = canvas.getContext('2d');


function setCanvas() {
	rect = video.getBoundingClientRect();
	//rect.x,y,width,height

	canvas.style.position='absolute';
	canvas.style.left=rect.x+'px';
	canvas.style.width=rect.width+'px';
	canvas.style.height=Math.ceil(rect.height*1.00)+'px';
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
}


function drawBB() {
	var BB = activeBB;

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.lineWidth = 5;
	context.beginPath();
	context.strokeStyle = "#FF0000";
	//context.rect(20, 20, 200, 720);
	//context.rect( BB[0],BB[1],BB[2],BB[3] );
	var marg = 0.15;
	context.rect( canvas.width*BB[0]-marg,canvas.height*BB[1]-marg,canvas.width*BB[2]+2*marg,canvas.height*BB[3]+2*marg );
	//context.strokeRect(50, 50, 50, 50);
	context.stroke();
}



function loadVideoAndBB(videoURL, vid, BB, time) {
	activeBB = BB;

	//$('#vidID').html(vid.replace('_cvt',''));
	//$('#time').html( parseInt(time/1000)+' seconds');


    var cw = Math.floor(canvas.clientWidth / 100);
    var ch = Math.floor(canvas.clientHeight / 100);

	console.log(cw,ch);
	//draw(v,context,cw,ch);

	//context.drawImage(v, 0, 0, cw, ch);


    video.addEventListener('play', function(){
        //draw(this,context,cw,ch);
    },false);


	v.onloadeddata = function() {
		rect = video.getBoundingClientRect();
		//if(rect.height > window.innerHeight){
			// motherfucking POS CSS
			//v.style.height = 0.8*window.innerHeight+'px';
		//}

		if(v.videoHeight>v.videoWidth){
			console.log('portrait mode!');
			v.style.height = 0.75*window.innerHeight+'px';
			v.style.width='auto';
		}else{
			console.log('landscape');
			v.style.width = 0.5*window.innerWidth+'px';
			v.style.height='auto';
		}

		setCanvas();
		drawBB();
		video.currentTime = time/1000;
	};
	v.onseeked = function() {
		drawBB();
	};

	if(videoURL==activeVidURL){
		// no need to change the video, but we still need to change position and draw new bounding box
		video.currentTime = time/1000;
		//drawBB();
	}
	else{
		video.src = videoURL;
		activeVidURL = videoURL;
	}

}


function handleResize() {
	console.log('resize handler called')
	setCanvas();
	drawBB();
}

vid2 = 'https://d2hxwnssq7ss7g.cloudfront.net/xracYRRZyQ66_cvt.mp4';


document.addEventListener('DOMContentLoaded', function(){
	window.onresize = handleResize;

	$('#resultsTable').hide()


	return;

	if(video==null){return;}		// only set this up if a video element is included


	vid = 'https://d2hxwnssq7ss7g.cloudfront.net/BQQyPL9LxpLz_cvt.mp4';

	BB = [20, 20, 200, 420];

	loadVideoAndBB(vid, 60, BB);

},false);







