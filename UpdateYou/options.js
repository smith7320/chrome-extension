var channelName = 'UC31lFyyLeJURY9SFLL6JOGg';
var youtubeAPIKey = 'AIzaSyCOgGxUYRV6WF4q9aFhwdHFDmGG9L6PdZ8';
var subArray = [];
var selectedSubs = [];
var array = [];

$(document).ready(

/* get the titles of each channel and store their associated id */
	function getSubscriptions() {
		$.get(
			"https://www.googleapis.com/youtube/v3/subscriptions", {
			part: 'snippet',
			maxResults: 50,
			channelId: channelName,
			key: youtubeAPIKey },
			function(data) {
			$.each(data.items, function(i, item) {
				title = item.snippet.title;
				channel = item.snippet.resourceId.channelId;

				subArray.push([channel, title]);
				if ($.inArray(channel, selectedSubs) >= 0) {
					array.push(channel);
				}
			})
			nextPage = data['nextPageToken'];
			if (nextPage !== undefined) {
				getMoreSubscriptions(nextPage);
			}
		}
	);
	
	function getMoreSubscriptions(nextPage) {
		$.get(
			"https://www.googleapis.com/youtube/v3/subscriptions", {
			part: 'snippet',
			maxResults: 50,
			pageToken: nextPage,
			channelId: channelName,
			key: youtubeAPIKey },
			function(data) {
			$.each(data.items, function(i, item) {
				title = item.snippet.title;
				channel = item.snippet.resourceId.channelId;
					
				subArray.push([channel, title]);
				if ($.inArray(channel, selectedSubs) >= 0) {
					array.push(channel);
				}
			})
			nextPage = data['nextPageToken'];
			if (nextPage !== undefined) {
				getMoreSubscriptions(nextPage);
			} else {
				displaySubscriptionMultiselect();
			}
		}
	);}
	
	/* subArray[i][0] = id subArray[i][1] = title */
	
	function displaySubscriptionMultiselect() {
		for (var i = 0; i < subArray.length; i++ ) {
			var check = subArray[i][0];
			if ($.inArray(check, array) < 0) {
				$('#left').append("<option val=" + subArray[i][0] + ">" + subArray[i][1] + "</option>");
			} else {
				$('#right').append("<option val=" + subArray[i][0] + ">" + subArray[i][1] + "</option>");
			}
		}
	}
	
	/* Save subscriber preferences to storage */
	function savePreferences() {
		chrome.storage.local.set( {"subs" : selectedSubs}, function() {
			console.log(selectedSubs);
		});
	}	
	
	chrome.storage.local.get( {"subs": []}, function(result) {
			selectedSubs = result.subs;
			console.log(selectedSubs);
		});
	
	$('#apply').click(
		function() {
			savePreferences();
		});
		
	$('#leftbutton').click(
		function() {
			var selectedItem = $('#left option:selected');
			var itemVal = $('#left option:selected').attr('val');
			selectedSubs.push(itemVal.toString());
			$('#right').append(selectedItem);
		});
		
	$('#rightbutton').click(
		function() {
			var selectedItem = $('#right option:selected');
			var itemVal = $('#right option:selected').attr('val');
			var removal = selectedSubs.indexOf(itemVal);
			selectedSubs.splice(removal, 1);
			$('#left').append(selectedItem);
		});

});