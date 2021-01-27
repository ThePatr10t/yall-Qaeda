
var showHits;

// Fancier version, fix later
showHits = function(results, container) {
	var container, fragment, imgLoad, pckry;

	fragment = document.createDocumentFragment();

	function addHit(result){
		console.log(result);
		div = document.createElement('div');
		div.className = 'hitDiv';
		img = document.createElement('img');
		img.className = 'hitImg';
		img.width = result.score*result.score*160;
		img.src = result.url;
		console.log(img);
		div.appendChild(img);
		//fragment.appendChild(div);
		fragment.appendChild(img);
	}

	results.forEach(addHit);
	pckry = new Packery(container, {
		itemSelector: '.hitDiv',
		gutter: 20
	});
	container.appendChild(fragment);

};




addHits = function(results) {
	var container, fragment, imgLoad, pckry;

	container = document.getElementById('hitList');

	fragment = document.createDocumentFragment();

	function addHit(result){
		div = document.createElement('div');
		div.className = 'hitDiv';
		img = document.createElement('img');
		img.className = 'hitImg';
		//img.width = result.score*result.score*160;
		//img.width = 160;
		img.addEventListener("click", function(){
			console.log('res : ', result);
			loadVideoAndBB(result.vidURL, result.vid, result.BB, result.time);
			} );
		//http://capitolfiles.s3-website-us-west-2.amazonaws.com/facecf/extractions/JFDVk6DaG1KD_cvt/730_0.jpg
		img.src = result.url;
		div.appendChild(img);
		//fragment.appendChild(div);
		fragment.appendChild(img);
	}

	results.forEach(addHit);
	container.appendChild(fragment);

	return;
}






handleResponseLive = function(file, response) {
	console.log('upload completed - calling live response handler');
	console.log(response);
	if ('error' in response){
		showError(response);
	}
	if ('hits' in response){
		// Pull out data we need, refactor it for the function above
		// TODO : expand resource URLs here to save bandwidth?
		// img URLs to s3, and video URLs to cloudfront?
		$('#uploader').remove();
		$('#resultsTable').show()

		results = processResults(response.hits);
		addHits(results)

		// fucking CSS is a POS
		body = document.getElementById('site');
		rect = body.getBoundingClientRect();
		resultsTable = document.getElementById('resultsTable');
		resultsTable.style.height = rect.height;
		resultsTable.style.height = 0.9*rect.height+'px';

		// lastly, click the first video
		result = results[0];
		loadVideoAndBB(result.vidURL, result.vid, result.BB, result.time);
		setTimeout(function() { setCanvas(); drawBB(); }, 500);
		console.log(response);
	}

};




document.addEventListener('DOMContentLoaded', function(){
	//return; //disable

	resultPage = document.getElementById('resultPage');
	if(resultPage==null){return;}						// Only execute on results page

	console.log('GOOGO');

	$.getJSON('data.json', function(response) {
		console.log(response);
		if (Object.keys(response.hits).length) {
			//return showHits(response.hits, pckry);
			return addHits(response.hits);
		}
	});

},false);





