jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}


$(document).ready(function() {
	console.log("main.js document ready!");
	$('#errors').hide();
});


showError = function(response) {
	$('#uploader').remove();
	$('#errors').show();
	$('#errorMsg').html(response.error);
}


processResults = function(results) {
	function add(result){
		if(result.vid.endsWith('_cvt')){

			//result.vidURL = 'https://d2hxwnssq7ss7g.cloudfront.net/'+result.vid+'.mp4';
			//result.url = 'http://capitolfiles.s3-website-us-west-2.amazonaws.com/facecf/extractions/'+result.vid+'/'+result.jpeg
			result.vidURL = 'https://d2hxwnssq7ss7g.cloudfront.net/'+result.vid+'.mp4';
			result.url = 'http://d2amdhggrspxsl.cloudfront.net/facecf/extractions/'+result.vid+'/'+result.jpeg
		}else{
			//result.vidURL = 'http://capitolfiles.s3-website-us-west-2.amazonaws.com/s3vids/'+result.vid+'.converted.mp4'
			//result.url = 'http://capitolfiles.s3-website-us-west-2.amazonaws.com/facecf/extractions2/'+result.vid+'/'+result.jpeg
			result.vidURL = 'http://d2amdhggrspxsl.cloudfront.net/s3vids/'+result.vid+'.converted.mp4'
			result.url = 'http://d2amdhggrspxsl.cloudfront.net/facecf/extractions2/'+result.vid+'/'+result.jpeg
		}
		m = {
			symbol : 'url('+result.url+')',
			width : 40,
			height : 40
		}
		result.marker = m
	}

	results.forEach(add);
	return(results);
}




handleResponse = function(file, response) {
	console.log('upload completed');
	console.log(response);
	if ('error' in response){
		alert(response.error);
	}
	if ('jobID' in response){
		n = window.location+'result/'+response.jobID
		window.location.replace(n);
	}

};



