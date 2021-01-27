
var showHits;
chart = null;
map = null


moveToLoc = function(lat, lng){
  const center = new google.maps.LatLng(lat, lng);
  // using global variable:
  map.panTo(center);
}


initChart = function() {
	document.getElementById('container').height = document.getElementById('site').getBoundingClientRect().height*0.9

	chart = Highcharts.chart('container', {
		chart: {
			type: 'scatter',
			zoomType: 'xy',
			height: document.getElementById('site').getBoundingClientRect().height*0.9
		},
		tooltip: { enabled: false },
		title: {
			text: 'Face clusterings - Click on a face to view the video. Drag to zoom in'
		},
		subtitle: {
			text: ''
		},
		rangeSelector: {
			selected: 1
		},

		series: [{
			//data: MSFT,
			name: 'faces'
		}],

		plotOptions: {
			series: {
				point: {
					events: {
						mouseOver: function () {
							var chart = this.series.chart;
							console.log(this.x, this.y, this.vid);
							document.getElementById('preview').src=this.url;
						},
						click: function () {
							var chart = this.series.chart;
							console.log('clicked!', this);
							if('lat' in this){
								console.log('moving');
								moveToLoc(this.lat, this.lng);
							}
							loadVideoAndBB(this.vidURL, this.vid, this.BB, this.time);

						}
					}
				}
			}
		}


	});

	//chart.series[0].setData(ADBE);
	//e.target.disabled = true;
	return chart;

}


initMap = function() {

        var location = new google.maps.LatLng(38.889805, -77.009056)

        var mapOptions = {
          mapTypeId: 'satellite',
          zoom: 15,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          },
          center: location

        }
        var mapElement = document.getElementById('map')
        map = new google.maps.Map(mapElement, mapOptions)
        //var src = 'https://thepatr10t.github.io/yall-Qaeda/cftest.kml'


	//return map;
}



handleResponseTsneLoaded = function(file, response) {
	console.log('upload completed - calling live response handler');
	console.log(response);
	if ('error' in response){
		showError(response);
		//alert(response.error);
	}
	if ('hits' in response){
		// Pull out data we need, refactor it for the function above
		// TODO : expand resource URLs here to save bandwidth?
		// img URLs to s3, and video URLs to cloudfront?
		$('#uploader').remove();
		$('#resultsTable').show()


			//Stuff to do after someScript has loaded
		initMap();


		addMarker = function(result){
			if('lat' in result){
				marker = new google.maps.Marker({
					position: { lat: result.lat, lng: result.lng },
					map,
					title: "Hello World!",
					vidURL: result.vidURL,
					vid: result.vid,
					time: result.time,
					BB: result.BB
				});
				/*
				google.maps.event.addListener(
					marker,
					"click",
					function (e) {
						console.log('click', e, marker)
						loadVideoAndBB(marker.vidURL, marker.vid, marker.BB, marker.time)
					}
				);
				*/

			}
		}


		results = processResults(response.hits);
		results.forEach(addMarker);
		console.log('results are', results)

		chart = initChart();

		chart.series[0].setData(results);
		//addHits(results)

		// fucking CSS is a POS
		//body = document.getElementById('site');
		//rect = body.getBoundingClientRect();
		//resultsTable = document.getElementById('resultsTable');
		//resultsTable.style.height = rect.height;
		//resultsTable.style.height = 0.9*rect.height+'px';

		// lastly, click the first video
		result = results[0];
		loadVideoAndBB(result.vidURL, result.vid, result.BB, result.time);
		setTimeout(function() { setCanvas(); drawBB(); }, 500);
	}

};


handleResponseTsne = function(file, response) {
		$.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAAFYwkWgVLa5lKgfh0OHqWS8PiXGTfJf8', function(){
			handleResponseTsneLoaded(file, response);
		});
}






document.addEventListener('DOMContentLoaded', function(){
	//return; //disable

	//initMap();



},false);





