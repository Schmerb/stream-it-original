var state = {
    query: '',
    year: '',
    mediaID: '',
    movie_results: [],
    show_results: [],
    buy_HD: '',
    buy_SD: '',
    rent_HD: '',
    rent_SD: '',
    spiderData: {}
};

// ================================================================================
// Displays movie posters to screen
//
// 1) Work on dynmically adding each row and subsequent columns
// 2) Eventually implement infinite scroll OR carousel horizontal scroll 
// ================================================================================
function displayMoviePosters() {
    $('.inner-container').removeClass('hidden');
    var i = 0;
    var current_row_id = 0;

    state.movie_results.forEach(function (movie) {
        //console.log(movie.title);
        // debugger;
        if ((i % 4) == 0) {
            var $row = $('<div>');
            $row.attr('class', 'row');
            $row.attr('id', 'row_' + i);
            current_row_id = i;
            $('.inner-container').append($row);

        }
        var $col = $('<div>').attr('class', 'col-3');
        var $content = $('<div>').attr({'class': 'poster', 'id': 'content_' + i});
        var posterSize = movie.poster_240x342;  //120x171;
        console.log(screen.width);
        // if(screen.width < 460) {
        //     posterSize = movie.poster_240x342;
        // }
        var $poster = $('<img>').attr({'id': movie.id, 'class': 'movie-poster', 'src': posterSize}); //poster_240x342
        var $label = $('<label>').attr('for', movie.id);

        $label.html('<h6>' + movie.release_year + '</h6><h3>' + movie.title + '</h3>');
        
        $content.html($poster).append($label); 

        $col.html($content);

        $('#row_' + current_row_id).append($col);

        i++;
    });
    var imgs = document.getElementsByTagName("img");
    console.log(imgs[1].clientWidth);
}

function displayMoviePostersMobile() {
    var $ul = $('<ul>');
    $('.inner-container').html($ul);
    state.movie_results.forEach(function(movie) {
        var $li = $('<li>');
        var $poster = $('<img>').attr({'id': movie.id, 'src': movie.poster_120x171});
        var $label = $('<label>').attr('for', movie.id);
        $label.html('<h6>' + movie.release_year + '</h6><h3>' + movie.title + '</h3>');
        $li.html($poster).append($label);
        $('.inner-container ul').append($li);
    });
}


// ================================================================================
// Displays show posters to screen
//
// ================================================================================
function displayTvPosters() {
    $('.inner-container').removeClass('hidden');
    var i = 208;
    var current_row_id = 0;
    // $('.inner-container').empty();
    state.show_results.forEach(function(show) {
        //console.log(show.title);
        if ((i % 4) == 0) {
            var $row = $('<div>');
            $row.attr('class', 'row');
            $row.attr('id', 'row_' + i);
            current_row_id = i;
            $('.inner-container').append($row);

        }
        var $col = $('<div>').attr('class', 'col-3');
        var $content = $('<div>').attr({'class': 'poster', 'id': 'content_' + i});
        var $poster = $('<img>').attr({'id': show.id, 'class': 'tv', 'src': show.artwork_208x117});
        var $label = $('<label>').attr('for', show.id);

        $label.html('<h6>' + show.first_aired + '</h6><h3>' + show.title + '</h3>');
        $content.html($poster).append($label); 
        $col.html($content);

        $('#row_' + current_row_id).append($col);
        i++;
    });
}


// ================================================================================
// Displays episodes to screen
//
// ================================================================================
function displayShowEpisodes(resp) {
    var i = 0;
    var current_row_id = 0;
    $('.inner-container').empty();
    resp.results.forEach(function(episode) {
        if ((i % 4) == 0) {
            var $row = $('<div>');
            $row.attr('class', 'row');
            $row.attr('id', 'row_' + i);
            current_row_id = i;
            $('.inner-container').append($row);

        }
        var $col = $('<div>').attr('class', 'col-3');
        var $content = $('<div>').attr({'class': 'poster', 'id': 'content_' + i});
        var $poster = $('<img>').attr({'id': episode.id, 'src': episode.thumbnail_208x117});
        var $label = $('<label>').attr('for', episode.id);

        $label.html('<h6>' + episode.first_aired + '</h6><h4>season ' + episode.season_number + '</h4><h3>' + episode.original_title + '</h3>');
        $content.html($poster).append($label); 
        $col.html($content);

        $('#row_' + current_row_id).append($col);
        i++;
    });
}


// ================================================================================
// Used as generic callback function to print JSON return data to console.
//
// ================================================================================
function printRespToConsole(resp) {
    console.log(resp);
}


// ================================================================================
// Handles movie API calls and return data
//
// ================================================================================
function searchMoviesHandler() {
    searchItunes('movie', state.query, printRespToConsole);
    searchGuideboxByTitle("movie", state.query, function (resp) {
        console.log(resp); 
        state.movie_results = resp.results; // stores array of movie results from search
        if(state.movie_results.length > 0) {
            state.mediaID = resp.results[0].id; 
            displayMoviePosters();
        }
    });
    $('.inner-container').prepend('<h2 class="main-header">movies</h2>');
}


// getMovieMetadata(state.mediaID, function (resp) {
//     // console.log(resp);
//     searchIMDB(resp.imdb, printRespToConsole);
//     state.year = resp.release_year;
//     displayMoviePosters();
// });

// ================================================================================
// Handles tvshow API calls and return data
//
// ================================================================================
function searchTvShowsHandler() {
    searchItunes('tvShow', state.query, printRespToConsole);
    searchGuideboxByTitle("show", state.query, function (resp) {
        state.show_results = resp.results; // stores array of show results from search
        if (state.show_results.length > 0) {
            // console.log(resp); 
            displayTvPosters();
        }
    });
}



// ================================================================================
// Guidebox API 
//
//  **** TO DO ****
//
// Goal: Allow user to enter title of movie or tv show (most likely they will have to be 
//                                                      explicit on which they are searching for)
// 1) DONE ----- Given user input, make call to get ID of movie or show
// 2) DONE ----- Make another call using id to get movie/show metadata
// 3) Display sources for where user can stream movie/show
// 4) display other relavant data: {IMDB, rottentomatoe, overview, release date/first-aired
//                                 rating, runtime, artwork/images, cast, director
//                                  status=running/ended (TV shows)
//                                 
// ================================================================================
var GBOX_BASE_URL = "http://api-public.guidebox.com/v2/";


//http://api-public.guidebox.com/v2/movies?api_key=YOUR_API_KEY&limit=10

function getAllSources() {
    "use strict";
    var SOURCES_GBOX_URL = GBOX_BASE_URL + "sources/";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498"
    };
    $.getJSON(SOURCES_GBOX_URL, query, printRespToConsole);
}

function getAllMovieImages(mediaID) {
    "use strict";
    var MOVIE_IMAGES_URL = GBOX_BASE_URL + "movies/" + mediaID + "/images/";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498"
    };
    $.getJSON(MOVIE_IMAGES_URL, query, printRespToConsole);
}

function getAllMovieTrailers(mediaID) {
    "use strict";
    var MOVIE_TRAILERS_URL = GBOX_BASE_URL + "movies/" + mediaID + "/videos/";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498"
    };
    $.getJSON(MOVIE_TRAILERS_URL, query, printRespToConsole);
}

function getNewMovies(timestamp, callback) {
    "use strict";
    var NEW_MOVIES_URL = GBOX_BASE_URL + "updates/";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
        object: "show",
        type: "new",
        time: timestamp
    };
    $.getJSON(NEW_MOVIES_URL, query, callback);
}

function getPopularTitles(limit) {
    var RECENT_MOVIES_URL = GBOX_BASE_URL + 'movies/';
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
        limit: limit
    };
    $.getJSON(RECENT_MOVIES_URL, query, function(resp) {
        state.movie_results = resp.results; // stores array of movie results from search
        if(state.movie_results.length > 0) {
            console.log(resp);
            state.mediaID = resp.results[0].id; 
            displayMoviePosters();
        }
    });
}

function searchGuideboxByTitle(type, requestData, callback) {
    "use strict";
    var SEARCH_GBOX_URL = GBOX_BASE_URL + "search/";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
        type: type,
        field: "title",
        query: requestData
    };
    $.getJSON(SEARCH_GBOX_URL, query, callback);
}

function getMovieMetadata(movieID, callback) {
    "use strict";
    var MOVIE_GBOX_URL = GBOX_BASE_URL + "movies/" + movieID;
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
    };
    $.getJSON(MOVIE_GBOX_URL, query, callback);
}

function getShowMetadata(showID, callback) {
    "use strict";
    var SHOW_GBOX_BASE_URL = GBOX_BASE_URL + "shows/" + showID + "/episodes/";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
        include_links: true
    };
    $.getJSON(SHOW_GBOX_BASE_URL, query, callback);
}

function searchIMDB(id, callback) {
    var IMDB_URL = 'http://www.omdbapi.com/';
    var query = {
        i: id,
        plot: 'short'
    };
    $.getJSON(IMDB_URL, query, callback);
}


function searchItunes(mediaType, requestData, callback) {
    var ITUNES_URL = 'https://itunes.apple.com/search/';
    var query = {
        term: encodeURIComponent(requestData),
        entity: mediaType
    };
    $.getJSON(ITUNES_URL, query, callback);
}


// ================================================================================
// Event-listeners 
// ================================================================================

function searchFormSubmit() {
    $('.movie-form').submit(function(e) {
        e.preventDefault();
        state.query = $(this).find('.js-movie-query').val();
        $('.inner-container').addClass('hidden');
        $('.inner-container').empty();

        searchMoviesHandler();
        searchTvShowsHandler();
    });
}

function showPosterClick() {
    $('.inner-container').on('click', '.tv', function(e) {
        e.preventDefault();
        getShowMetadata($(this).attr('id'), function (resp) {
            console.log("\n\n\nepisodes:");
            console.log(resp);
            displayShowEpisodes(resp);
        });
    });
}


// ================================================================================
// Entry point
// ================================================================================
$(function() {
    // getAllSources();
    getAllMovieImages(112659);
    getAllMovieTrailers(112659);
    getNewMovies(1493940909, function(resp) {
        resp.results.forEach(function(movie) {
            getMovieMetadata(movie.id, printRespToConsole);
        });
    });
    getPopularTitles(50);
    searchFormSubmit();
    // showFormSubmit();
    showPosterClick();
    state.spiderData = data;
    // getAmazonData();
});








// function showFormSubmit(){
//     $('.show-form').submit(function(e) {
//         e.preventDefault();
//         state.query = $(this).find('.js-show-query').val();
//         searchItunes('tvShow', state.query, printRespToConsole);
//         searchGuideboxByTitle("show", state.query, function (resp) {
//             console.log(resp); 
//             state.results = resp.results; // stores array of show results from search
//             displayTvPosters();
//         });
//     })
// }









//Guidebox

// search?api_key=db85b00dc1a54c2a02ed61575609802bb3d8c498&type=show&field=title&query=Weeds
//  This searches for a show based on title, includes id for show
//
// shows/2622?api_key=db85b00dc1a54c2a02ed61575609802bb3d8c498
//
// search?api_key=db85b00dc1a54c2a02ed61575609802bb3d8c498&type=movie&field=title&query=Terminator
//  This searches for a movie based on its title, includes the id of that movie
//
// movies/{128834}?api_key=db85b00dc1a54c2a02ed61575609802bb3d8c498"
//  Using the id fetched above, meta data is fetched for movie including sources where it can be found
//
// sources?api_key=db85b00dc1a54c2a02ed61575609802bb3d8c498&filter=movie";

//Search for tv episodes metadata

//var mediaID = resp.results[0].id;
            // getShowMetadata(mediaID, function (resp) {
            //     console.log("episodes:");
            //     console.log(resp);
            // }); 


// //getSpiderData(movie.title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}), movie.release_year);

        // if (state.buy_HD) {
        //     $($label).append('<h6>' + state.buy_HD + '</h6>');
        // }
        // if (state.buy_SD) {
        //     $($label).append('<h6>' + state.buy_SD + '</h6>');
        // }
        // if (state.rent_HD) {
        //     $($label).append('<h6>' + state.rent_HD + '</h6>');
        // }
        // if (state.rent_SD) {
        //     $($label).append('<h6>' + state.rent_SD + '</h6>');
        // }


// function getSpiderData(title, year) {
//    state.spiderData.data.forEach(function(obj) {
//         // console.log(obj.title + "   buy_HD: " + obj.buy_HD + "\n");
//         // debugger;
//         if (obj.title[0].includes(title) && obj.title[0].includes(year)) { //

//             state.buy_HD = obj.buy_HD;
//             state.buy_SD = obj.buy_SD;
//             state.rent_HD = obj.rent_HD;
//             state.rent_SD = obj.rent_SD;
//             return;
//         };
//    });
//    console.log(state.buy_HD + "     OR     " + state.buy_SD);
//    // state.rent = rent;
// }
//  //http://webservices.amazon.co.uk/onca/xml?Service=AWSECommerceService&Operation=ItemSearch&AWSAccessKeyId=AKIAIOSFODNN7EXAMPLE&Operation=ItemSearch&Actor=Johnny%20Depp&ResponseGroup=ItemAttributes,Offers,Images,Reviews,Variations&Version=2013-08-01&SearchIndex=DVD&Sort=salesrank&AssociateTag=mytag-20
// //GET
// //webservices.amazon.co.uk
// ///onca/xml
// //AWSAccessKeyId=AKIAIOSFODNN7EXAMPLE&Actor=Johnny%20Depp&AssociateTag=mytag-20&Operation=ItemSearch&Operation=ItemSearch&ResponseGroup=ItemAttributes%2COffers%2CImages%2CReviews%2CVariations&SearchIndex=DVD&Service=AWSECommerceService&Sort=salesrank&Timestamp=2014-08-18T17%3A34%3A34.000Z&Version=2013-08-01

// function getAmazonData() {
//     var dt = new Date();
//     var stamp = dt.toISOString();
//     //http://webservices.amazon.com/onca/xml?Service=AWSECommerceService&Operation=ItemSearch&SubscriptionId=AKIAIQJDMYU5M2XBS5BA&AssociateTag=schmerb-20&SearchIndex=All&Keywords=Alien&ResponseGroup=Images,ItemAttributes,Offers
//     var stringToEncode = 'GET\nwebservices.amazon.com\n/onca/xml\nAWSAccessKeyId=AKIAIQJDMYU5M2XBS5BA&AssociateTag=schmerb-20&Keywords=Alien&Operation=ItemSearch&ResponseGroup=Images%2CItemAttributes%2COffers&SearchIndex=All&Service=AWSECommerceService&Timestamp=' + stamp;
//     console.log("stamp: " + stamp);
//     var hash = CryptoJS.HmacSHA256(stringToEncode, "+3OE7ikTFZafRKrGXcAP841LO9J8Ti74KcdLKy4p");
//     var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
//     // var signature = encodeURIComponent(hashInBase64);
//     console.log("hashInBase64:   " + hashInBase64);
//     // console.log("signature:   " + signature);
//     $.ajax({
//         url: 'https://webservices.amazon.com/onca/xml/',
//         data: {
//             AWSAccessKeyId: 'AKIAIQ32QIIPJN7VQYGA',
//             AssociateTag: 'schmerb-20',
//             Keywords: 'Alien',
//             Operation: 'ItemSearch',
//             ResponseGroup: 'Images,ItemAttributes,Offers', 
//             SearchIndex: 'All',
//             Service: 'AWSECommerceService',
//             Timestamp: stamp,
//             Signature: hashInBase64
//         }, 
//         success: function(resp) {console.log(resp)},
//         // crossDomain: true,
//         dataType: 'xml'
//     });
// }
//'pv0NvwJc41fK0FM/w3UQUFDDvm8l%2ByPMsF4tBiTOzrI%3D';