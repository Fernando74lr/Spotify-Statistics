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
			// This is for User's Profile
			$.ajax({
				url: 'https://api.spotify.com/v1/me',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					// console.log("User's Data");
					// console.log(response);
                    
					$('#login').hide();
                    
                    $('#dashboard').removeClass('d-none');
                    $('#username h4').html(response.display_name);
                    $('#profile-picture').attr('src', response.images[0].url);
				}
			});

			// This is for top artist short-term
			$.ajax({
				url: 'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10&offset=0',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					// console.log("Top Artist In The Last Month");
					// console.log(response);

					(response.items).forEach(item => {
                        $('#artists-last-month ul').append(`
                            <li>
                                <div id="item-frame">
                                    <img src="${item.images[0].url}" alt="album-song">
                                    <p
										class="color-link"
                                        id="${item.id}"
                                        onclick="copyToClipboard('#${item.id}')"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="bottom"
                                        title="Click to share it!"
                                        data-link="${item.external_urls.spotify}"
                                    >
                                        ${item.name}
                                    </p>
                                </div>
                            </li>
                        `);
                    });

					$('#login').hide();
				}
			});

			// This is for top artist long-term
			$.ajax({
				url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10&offset=0',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					// console.log("Top Artist Several Years");
					// console.log(response);

					(response.items).forEach(item => {
                        $('#artists-forever ul').append(`
                            <li>
                                <div id="item-frame">
                                    <img src="${item.images[0].url}" alt="album-song">
                                    <p
										class="color-link"
                                        id="${item.id}"
                                        onclick="copyToClipboard('#${item.id}')"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="bottom"
                                        title="Click to share it!"
                                        data-link="${item.external_urls.spotify}"
                                    >
                                        ${item.name}
                                    </p>
                                </div>
                            </li>
                        `);
                    });

					$('#login').hide();
				}
			});

			// This is for top songs short-term
			$.ajax({
				url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10&offset=0',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					// console.log("Top Songs In The Last Month");
					// console.log(response);

					(response.items).forEach(item => {
                        $('#songs-last-month ul').append(`
                            <li>
                                <div id="item-frame">
                                    <img src="${item.album.images[0].url}" alt="album-song">
                                    <p
										class="color-link"
										id="${item.id}"
                                        onclick="copyToClipboard('#${item.id}')"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="bottom"
                                        title="Click to share it!"
                                        data-link="${item.external_urls.spotify}"
                                    >
                                        ${item.name}
                                    </p>
                                </div>
                            </li>
                        `);
                    });

					$('#login').hide();
				}
			});

			// This is for top songs long-term
			$.ajax({
				url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10&offset=0',
				headers: {
					'Authorization': 'Bearer ' + access_token
				},
				success: function(response) {
					// console.log("Top Songs Several Years");
					// console.log(response);

                    (response.items).forEach(item => {
                        $('#songs-forever ul').append(`
                            <li>
                                <div id="item-frame">
                                    <img src="${item.album.images[0].url}" alt="album-song">
                                    <p
										class="color-link"
                                        id="${item.id}"
                                        onclick="copyToClipboard('#${item.id}')"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="bottom"
                                        title="Click to share it!"
                                        data-link="${item.external_urls.spotify}"
                                    >
                                        ${item.name}
                                    </p>
                                </div>
                            </li>
                        `);
                    });


					$('#login').hide();
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
						topAlbum.push({
							name: element.album.name,
							image: element.album.images[0].url,
							id: element.id,
							url: element.album.external_urls.spotify
						});
					});
					// Temporal variables
					var count = 0;
					var topAlbumTemp = [];
					var flag = true;
					for (let i = 0; i < topAlbum.length; i++) {
						topAlbumTemp.forEach(element => {
							if (element.name == topAlbum[i].name)
								flag = false;
						});

						if (flag) {
							for (let j = 0; j < topAlbum.length; j++)
								if (topAlbum[i].name == topAlbum[j].name)
									count++;

							topAlbumTemp.push({
								name: topAlbum[i].name,
								repeated: count,
								image: topAlbum[i].image,
								id: topAlbum[i].id,
								url: topAlbum[i].url
							});
							count = 0;
						}
						flag = true;
					}

					// console.log(topAlbum);
					// console.log(topAlbumTemp);
					topAlbum = bubbleSort(topAlbumTemp);
					// console.log("Top Album Several Years");
					// console.log(topAlbum);

					for (let i = 0; i < 10; i++) {
						$('#albums ul').append(`
								<li>
									<div id="item-frame">
										<img src="${topAlbum[i].image}" alt="album-song">
										<p
											class="color-link"
											id="${topAlbum[i].id}"
											onclick="copyToClipboard('#${topAlbum[i].id}')"
											data-bs-toggle="tooltip"
											data-bs-placement="bottom"
											title="Click to share it!"
											data-link="${topAlbum[i].url}"
										>
											${topAlbum[i].name}
										</p>
									</div>
								</li>
							`);
					}

					$('#login').hide();
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
					// console.log("Top Genres");
					// console.log(topGenres);

					for (let i = 0; i < 10; i++) {
						$('#genres ul').append(`
								<li class="list-group-item list-style">
									<p>
										${topGenres[i].name}
									</p>
								</li>
							`);
					}

					$('#login').hide();
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

// Copy to clipboard
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).attr("data-link")).select();
    document.execCommand("copy");
    $temp.remove();
    toast('success', 'Copied link to clipboard!');
}

// Enable Tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

const toast = (type, msg) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        width: 300,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: type, // success, error, info, warning
        title: msg
      })
}

const submitForm = () => {
    let email = $('#email').val();
    let subject = $('#subject').val();
    let msg = $('#message').val();

    // This is for top genres long-term (50 artists)
    /*$.ajax({
        dataType: "json",
        url: `http://34.125.111.8/sendEmail?email=${email}&subject=${subject}&msg=${msg}`,
        method: 'GET',
        success: function(response) {
            // console.log(response);
            if (response.ok) {
                toast('success', response.message);
                $('#form-contact').trigger("reset");
                $('#modal-contact').modal('hide');
            } else {
                toast('error', 'Sorry, something went wrong :(');
            }
        }});
    */
     $('#form-contact').trigger("reset");
     $('#modal-contact').modal('hide');
    // console.log("Probando");
}
