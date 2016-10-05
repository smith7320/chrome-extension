var channelName = 'UC31lFyyLeJURY9SFLL6JOGg';
var youtubeAPIKey = 'AIzaSyCOgGxUYRV6WF4q9aFhwdHFDmGG9L6PdZ8';
var selectedSubs = [];

$(document).ready(
	
	/* maybe see if you can store the api call in local storage instead of making new calls every open */
	
	/* Get first page of subscriptions */
	function getSubscriptions() {
		$.get(
			"https://www.googleapis.com/youtube/v3/subscriptions", {
			part: 'snippet',
			maxResults: 50,
			channelId: channelName,
			key: youtubeAPIKey },
			function(data) {
			$.each(data.items, function(i, item) {
				channel = item.snippet.resourceId.channelId;
				title = item.snippet.title;
							
				if ($.inArray(channel, selectedSubs) >= 0) {
					getSubbedChannelUploads(channel, title);
				}	
			})
			nextPage = data['nextPageToken'];
			if (nextPage !== undefined) {
				getMoreSubscriptions(nextPage);
			}
		}
	);

	/* Keep getting pages of subscriptions until there are no more pages */
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
				channel = item.snippet.resourceId.channelId;
				title = item.snippet.title;
				
				if ($.inArray(channel, selectedSubs) >= 0) {
					getSubbedChannelUploads(channel, title);
				}
			})
			nextPage = data['nextPageToken'];
			if (nextPage !== undefined) {
				getMoreSubscriptions(nextPage);
			}
		}
	);}
		
	/* Get uploads playlist of subscribed channel */
	function getSubbedChannelUploads(channel, title) {
		$.get(
			"https://www.googleapis.com/youtube/v3/channels", {
			part: 'contentDetails',
			id: channel,
			key: youtubeAPIKey },
			function(data) {
				if (data.items[0] !== undefined) {
					uploads = data.items[0].contentDetails.relatedPlaylists.uploads;
					findMostRecentlyUploaded(uploads, title);
				}
			}
		);}
	
	/* Get videos from uploads */
	function findMostRecentlyUploaded(uploads, title) {
		$.get(
			"https://www.googleapis.com/youtube/v3/playlistItems", {
			part: 'snippet',
			playlistId: uploads,
			maxResults: 1,
			key: youtubeAPIKey },
			function(data) {
			$.each(data.items, function(i, item) {
				upload = item.snippet.title;
				id = item.snippet.resourceId.videoId;
				
				var url = "http://www.youtube.com/watch?v=" + id.toString();
				
				$('#results').append('<div><div>' + title + '</div><button class="upload" val=' + url + '>' + upload + '</button></div>');
			})
		}
	);}
	
	$('#options').click(
		function() {
			chrome.tabs.create( {url: "options.html"} );
		});
		
	$('.upload').click(
		function() {
			chrome.tabs.create( {url: $(this).attr('val')} );
		});
		
	/* $('#results').on("click", ".upload",
		function() {
			chrome.tabs.create( {url: $(".upload").attr('val')} );
		}); */
		
	chrome.storage.local.get( {"subs": []}, function(result) {
		selectedSubs = result.subs;
		console.log(selectedSubs);
		}
	);
	
});
