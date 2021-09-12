(function() {
	function getHashParams() {
		var hashParams = {};
		var e, r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		while (e = r.exec(q)) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		return hashParams;
	}

	var userProfileSource = document.getElementById('user-profile-template').innerHTML,
		userProfileTemplate = Handlebars.compile(userProfileSource),
		userProfilePlaceholder = document.getElementById('user-profile');

	var oauthSource = document.getElementById('oauth-template').innerHTML,
		oauthTemplate = Handlebars.compile(oauthSource),
		oauthPlaceholder = document.getElementById('oauth');

	var params = getHashParams();

	var access_token = params.access_token,
		error = params.error;

	// Variable for top album
	var topAlbum = [];

	// Variable for top genres
	var topGenres = [];

	if (error) {
		alert('There was an error during the authentication');
	} else {
		if (access_token) {
			// render oauth info
			oauthPlaceholder.innerHTML = oauthTemplate({
				access_token: access_token
			});

			// This is for User's Profile
			$.ajax({
				url: 'https://api.spotify.com/v1/me',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					console.log("User's Data");
					console.log(response);
					userProfilePlaceholder.innerHTML = userProfileTemplate(response);

					$('#login').hide();
					$('#loggedin').show();
				}
			});

			// This is for top artist short-term
			$.ajax({
				url: 'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10&offset=0',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					console.log("Top Artist In The Last Month");
					console.log(response);

					$('#login').hide();
					$('#loggedin').show();
				}
			});

			// This is for top artist long-term
			$.ajax({
				url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10&offset=0',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					console.log("Top Artist Several Years");
					console.log(response);

					$('#login').hide();
					$('#loggedin').show();
				}
			});

			// This is for top songs short-term
			$.ajax({
				url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10&offset=0',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					console.log("Top Songs In The Last Month");
					console.log(response);

					$('#login').hide();
					$('#loggedin').show();
				}
			});

			// This is for top songs long-term
			$.ajax({
				url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10&offset=0',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					console.log("Top Songs Several Years");
					console.log(response);

					$('#login').hide();
					$('#loggedin').show();
				}
			});

			// This is for top almbus long-term (50 songs)
			$.ajax({
				url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50&offset=0',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					(response.items).forEach(element => {
						topAlbum.push(element.album.name);
					});
					// Temporal variables
					var count = 0;
					var topAlbumTemp = [];
					var flag = true;
					for (let i = 0; i < topAlbum.length; i++) {
						topAlbumTemp.forEach(element => {
							if (element.name == topAlbum[i])
								flag = false;
						});

						if (flag) {
							for (let j = 0; j < topAlbum.length; j++)
								if (topAlbum[i] == topAlbum[j])
									count++;

							topAlbumTemp.push({
								name: topAlbum[i],
								repeated: count
							});
							count = 0;
						}
						flag = true;
					}

					topAlbum = bubbleSort(topAlbumTemp);
					console.log("Top Album Several Years");
					console.log(topAlbum);

					$('#login').hide();
					$('#loggedin').show();
				}
			});

			// This is for top genres long-term (50 artists)
			$.ajax({
				url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50&offset=0',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					(response.items).forEach(element => {
						element.genres.forEach(genre => {
                            topGenres.push(genre);
                        });
					});

					// Temporal variables
					var count = 0;
					var topGenresTemp = [];
					var flag = true;

					for (let i = 0; i < topGenres.length; i++) {
						topGenresTemp.forEach(element => {
							if (element.name == topGenres[i])
								flag = false;
						});

						if (flag) {
							for (let j = 0; j < topGenres.length; j++)
								if (topGenres[i] == topGenres[j])
									count++;

							topGenresTemp.push({
								name: topGenres[i],
								repeated: count
							});
							count = 0;
						}
						flag = true;
					}

					topGenres = bubbleSort(topGenresTemp);
					console.log("Top Genres");
					console.log(topGenres);

					$('#login').hide();
					$('#loggedin').show();
				}
			});

		} else {
			// render initial screen
			$('#login').show();
			$('#loggedin').hide();
		}
	}
})();


// Sort the array of objects using Bubble Sort
function bubbleSort(array) {
	let temp = 0,
		count = 0;
	while (count != array.length) {
		array.forEach(function(status, i) {
			if (array[i + 1]) {
				if (status.repeated > array[i + 1].repeated) {
					temp = array[i + 1];
					array[i + 1] = status;
					array[i] = temp;
				}
			}
		});
		count++;
	}
	return array.reverse();
}