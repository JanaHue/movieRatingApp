var movieApp = {
	api_key : "15b14981e921515511afd98345386c7c",
	init : function() {
		movieApp.grabConfig();
		movieApp.getSessionId();

		//listen for a click on our star ratings
		$("body").on("change", "[name*=rating]", function(){

			var rating = $(this).val();
			var movieId = $(this).attr('id').split("-")[0].replace("movie","");
			movieApp.ratingHandler(rating,movieId);
			console.log("You rated!");
		});
		$("input[name=genre]").on("change",function(){
			genreId = $(this).attr('data-movieId');
			console.log(genreId);
			movieApp.grabGenre(genreId);
			$(".boxOffice").html(movieWrap);
		});

	}, // end init function 


	//This function will go to the movie db API and get all the config data that we require. 
	// When it finishes, it will put the data it gets onto movieApp.config
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
			} //end second success function
		}); //end CONFIG ajax request
	}, // end grabConfig

	grabGenre : function(genreId){
		var genreURL = "http://api.themoviedb.org/3/genre/" + genreId + "/movies"
		$.ajax(genreURL, {
			type : "GET",
			datatype : "jsonp",
			data : {
				api_key : movieApp.api_key
			},
			success : function(data){
				movieApp.displayMovies(data.results);
			}
		}); //end ajax request for genre grabbing
	},//end grabGenre

	// grabTopRated : function(){
	// 	var topRatedURL = "http://api.themoviedb.org/3/movie/top_rated";
	// 	$.ajax(topRatedURL, {
	// 		type : "GET",
	// 		dataType : "jsonp",
	// 		data : {
	// 			api_key : movieApp.api_key,
	// 		},
	// 		success : function(data) {
	// 			// console.log(data);
	// 			//run the displayMovies method to put them on the page:
	// 			movieApp.displayMovies(data.results);
	// 		}//end success function
	// 	}); //end TOP RATED ajax request
	// }, // end grabTopRated

	displayMovies : function(movies){
		for (var i = 0; i < movies.length; i++) {
			var title = $("<h2>").text(movies[i].title);
			var image = $("<img>").attr("src", movieApp.config.images.base_url + "w500" + movies[i].poster_path);
			var rating = $("fieldset.rateMovie")[0].outerHTML;

			rating = rating.replace(/star/g, "movie" + movies[i].id + "-star");
			rating = rating.replace(/rating/g, "rating-" + movies[i].id); 
			movieWrap = $("<div>").addClass('movie');
			movieWrap.append(title,image,rating);
			$(".boxOffice").append(movieWrap);
		};
	},

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
					alert ("Thanks for the vote!");
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