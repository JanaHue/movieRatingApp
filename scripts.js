var movieApp = {
	api_key : "15b14981e921515511afd98345386c7c",
	
	init : function() {
		movieApp.grabConfig();
		movieApp.getSessionId();
		movieApp.grabUserSearch();

		//listen for a click on our star ratings
		$("body").on("change", "input[name*=rating]", function(){
			var rating = $(this).val();
			var movieId = $(this).attr('id').split("-")[0].replace("movie","");
			movieApp.ratingHandler(rating,movieId);
			console.log("You rated!");
		});
		$("body").on("click", ".movieImg", function(){
			var movieId = $(this).data("movieid");
			movieApp.grabDesc(movieId);
			$(".overlay").fadeIn();
		}); // end listen for click on .movie

		$(".overlay, .close").on("click", function(){
			$(".overlay").fadeOut();
		});

		$('form.search').on('submit',function(e) {
			e.preventDefault();
			var query = $('input[name=search]').val();
			var q = encodeURI(query);
			movieApp.grabUserSearch(q);
		});
	}, // end init function 

	//This function will go to the movie db API and get all the config data that we require. 
	// When it finishes, it will put the data it gets onto movieApp.config
	grabDesc : function(movieId){
		var configURL = "http://api.themoviedb.org/3/movie/" + movieId;
		$.ajax(configURL, {
			type : "GET",
			dataType : "jsonp",
			data : {
				api_key : movieApp.api_key
			},
			success : function(movie) {
				if ( movie.overview ){
					$(".overlay .overview p").text(movie.overview)
				};
				$(".overlay .overview h2").text(movie.title);
			} //end success function
		}); //end CONFIG ajax request
	},

	grabConfig : function(){
		var configURL = "http://api.themoviedb.org/3/configuration";
		$.ajax(configURL, {
			type : "GET",
			dataType : "jsonp",
			data : {
				api_key : movieApp.api_key
			},
			success : function(config) {
				movieApp.config = config;
			} //end success function
		}); //end CONFIG ajax request
	}, // end grabConfig

	grabUserSearch : function(q){
			var searchURL = "http://api.themoviedb.org/3/search/movie";
			$.ajax(searchURL, {
				type : "GET",
				dataType : "jsonp",
				data : {
					api_key : movieApp.api_key,
					query : q
				},
				success : function(data) {
					movieApp.displayMovies(data.results);
					$(".arrow").fadeIn();
					}
			});//end ajax
	}, // end grabUserSearch

	//this function displays the movies and star rating form in .boxOffice
	displayMovies : function(movies){
		//.empty() will clear .boxOffice before .append adds new information to the div
		$(".boxOffice").empty();
		for (var i = 0; i < movies.length; i++) {
			var title = $("<h2>").text(movies[i].title);
			if(movies[i].poster_path){
				var image = $("<img>").attr("src", movieApp.config.images.base_url + "w500" + movies[i].poster_path)
			} else{
				var image = $("<img>").attr("src", "i/ajax-loader.gif")
			};
			var rating = $("fieldset.rateMovie")[0].outerHTML;
			rating = rating.replace(/star/g, "movie" + movies[i].id + "-star");
			rating = rating.replace(/rating/g, "rating-" + movies[i].id); 
			movieImg = $("<div>").addClass("movieImg").attr('data-movieid',movies[i].id);
			movieImg.append(image);
			movieWrap = $("<div>").addClass('movie');
			movieWrap.append(movieImg,rating);
			$(".boxOffice").append(movieWrap);
		};
	},

	//this function sends the user's rating back to themoviedb
	ratingHandler : function(rating,movieId) {
		$.ajax("http://api.themoviedb.org/3/movie/" + movieId + "/rating",{
			type : "POST",
			data : {
				api_key : movieApp.api_key,
				guest_session_id : movieApp.session_id,
				value : rating*2
			},
			success : function(response){
				if(response.status_code) {
					return;
				}
				else {
					alert (response.status_message);
				}
			}
		});
	},

	getSessionId : function() {
		var getSessionURL = "http://api.themoviedb.org/3/authentication/guest_session/new"
		$.ajax(getSessionURL,{
			data : {
				api_key : movieApp.api_key
			},
			type : "GET",
			dataType : "jsonp",
			success : function(session){
				//store the session id for later use
				movieApp.session_id = session.guest_session_id;
				// console.log(movieApp.session_id);
			}
		});
	}
}; // end namespace



//begin doc ready...
$(function() {
	movieApp.init();
}); //end doc ready