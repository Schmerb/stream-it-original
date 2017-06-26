'use strict';

var state = {
    mobile: false,
    query: '',
    infinite_scroll: true,
    offset: 0,
    loaded: false,
    year: '',
    mediaID: '',
    trailers: [],
    movie_results: [],
    show_results: [],
    isSlick: {
        banner: false,
        streamer: false
    }
    // spiderData: {}
};

var LANDING = '.landing';
var LANDING_HEADER = '.landing-header';

var CAROUSEL = '.js-carousel-ul';
var CAROUSEL_CONTAINER = '.carousel-container';
var USER_QUERY = '#user-query';
var MOVIE_BANNER_CONTAINER = '#movie-banner';
var MOVIE_BANNER_IMG = '#movie-banner img';

var DETAIL_PAGE = '#detail-page';
var DETAIL_POSTER_CONTAINER = '#detail-poster-container';
var DETAIL_POSTER = '#detail-poster';
var POSTER_LINK = '#poster-link';
var POSTER_TITLE = '#poster-title';
var POSTER_METADATA = '#poster-number-metadata';
var MOVIE_RELEASE_YEAR = '#movie-release-year';
var MOVIE_RATED = '#movie-rated';
var RUNTIME = '#runtime';
var MOVIE_RATINGS = '#movie-ratings';
var IMDB = '#imdb';
var ROTTEN_SCORE = '#rotten_score';

var STREAM_OPTIONS = '#stream-options';
var WEB_PURCH_SRCS = '#web-purch-srcs';
var WEB_SUB_SRCS = '#web-sub-srcs';
var WEB_TV_SRCS = '#web-tv-srcs';
var WEB_FREE_SRCS = '#web-free-srcs';

var PLOT = '#plot';
var MOBILE_PLOT = '#mobile-plot';
var DIRECTOR = '#director';
var WRITERS = '#writers';
var CAST = '#cast';

var TRAILER_CONTAINER = '#trailer-container';
var MODAL_FILTER = '#modal-filter';
var MAIN_TRAILER_THUMB = '#main-trailer-thumbnail';
var IFRAME_CONTAINER = '#iframe-container';
var IFRAME = '#iframe-container #iframe'; // Needs additional selector to overcome specificity from guidebox styling



var HORIZONTAL_SCROLL_WRAPPER = '.horizontal-scroll-wrapper';
// ================================================================================
//   Display query results to screen
// ================================================================================


/*
 *
 * Displays movie posters to screen
 * 
 */
function displayMoviePosters() {
    $(DETAIL_PAGE).addClass('hidden');
    $(LANDING).removeClass('hidden');
    var i = state.offset;
    var current_row_id = 0;

    state.movie_results.forEach(function (movie) {
        //console.log(movie.title);
     
        if ((i % 4) == 0) {
            var $row = $('<div>');
            $row.attr('class', 'row');
            $row.attr('id', 'row_' + i);
            current_row_id = i;
            $(LANDING).append($row);

        }
        var $col = $('<div>').attr('class', 'col-3');
        var $content = $('<div>').attr({'class': 'poster-container', 'id': 'content_' + i});
        var posterSize = movie.poster_240x342;  //120x171;
        // console.log(screen.width);
        // if(screen.width < 460) {
        //     posterSize = movie.poster_240x342;
        // }
        var $poster = $('<img>').attr({'id': movie.id, 'class': 'movie-poster', 
                        'src': posterSize, //poster_240x342
                        'data-imdb': movie.imdb}); 
        var $label = $('<label>').attr('for', movie.id);

        $label.html('<h6>' + movie.release_year + '</h6><h3>' + movie.title + '</h3>');
        
        $content.html($poster).append($label); 

        $col.html($content);

        $('#row_' + current_row_id).append($col);

        i++;
    });
}



// * * * * * * * * * * * * * * * * 
// Displays show posters to screen
// * * * * * * * * * * * * * * * * 
function displayTvPosters() {
    $(LANDING).removeClass('hidden');
    var i = 208;
    var current_row_id = 0;

    state.show_results.forEach(function(show) {
        //console.log(show.title);
        if ((i % 4) == 0) {
            var $row = $('<div>');
            $row.attr('class', 'row');
            $row.attr('id', 'row_' + i);
            current_row_id = i;
            $(LANDING).append($row);

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


// * * * * * * * * * * * * * * * * 
// Displays episodes to screen
// * * * * * * * * * * * * * * * * 
function displayShowEpisodes(resp) {
    var i = 0;
    var current_row_id = 0;
    
    resp.results.forEach(function(episode) {
        if ((i % 4) == 0) {
            var $row = $('<div>');
            $row.attr('class', 'row');
            $row.attr('id', 'row_' + i);
            current_row_id = i;
            $(LANDING).append($row);

        }
        var $col = $('<div>').attr('class', 'col-4');
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
//   DETAIL PAGE ~ DISPLAY
// ================================================================================

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Loads carousel with search results or landing page posters
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function loadBannerCarousel(src) {

    state.isSlick.banner ? (unBannerSlick(), state.isSlick.banner = false) : null;
    
 
    if (src == 'search') {
        var $carousel_posters = state.movie_results.map(function(movie, index) {
            return `<li>
                        <img src="${movie.poster_120x171}" data-index="${index}" data-imdb="${movie.imdb}">
                    </li>`;
        });
        $(CAROUSEL).html($carousel_posters.join(''));
    }
    initBannerSlick();
    // infiniteCarousel();
    state.isSlick.banner = true;
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Initializes carousel for streaming links
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function initStreamingSlick() {
    state.isSlick.streamer ? (unStreamerSlick(), state.isSlick.streamer = false) : null;
    initStreamingSlick();
    state.isSlick.streamer = true;
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  Detail page for specific movie. Also tears down streaming
//  links carousel and rebuilds them with the new data.
//  Tears down slick if carousel is currently slicked, and
//  rebuilds after updating carousel with new elements.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function displayDetailPage(movie, images, imdb) {
    $(LANDING).empty();
    $(LANDING).addClass('hidden');
    $(DETAIL_PAGE).removeClass('hidden');
    // unslick if currently slicked
    state.isSlick.streamer ? (unStreamerSlick(), state.isSlick.streamer = false) : null;
    $(CAROUSEL_CONTAINER).hide();
    
    $(POSTER_TITLE).empty();
    $('label[for=imdb]').empty();
    $('label[for=rotten_score]').empty();
    $('label[for=metacritic]').empty();
    $(STREAM_OPTIONS).empty();

    // Set banner for movie if it exists
    // var banners = images.results.banners;
    // $(MOVIE_BANNER_IMG).attr('src', '')
    // if(banners != undefined && banners.length > 0) {
    //     $(MOVIE_BANNER_IMG).removeClass('hidden');
    //     $(MOVIE_BANNER_IMG).attr('src', banners[0].large.url);
    // } else {
    //     $(MOVIE_BANNER_IMG).addClass('hidden');
    // }

    //Set main poster image and attach link to movies' website if exists
    $(DETAIL_POSTER).attr('src', movie.poster_240x342);
    if (imdb.Website != 'N/A')
        $(POSTER_LINK).attr('href', imdb.Website);
    
    // Check if any ratings exist 
    if(imdb.Ratings.length) {
        imdb.Ratings.forEach(function(rating) {
            if(rating.Source == 'Internet Movie Database') {
                $('label[for=imdb]').text(rating.Value);
            } else if (rating.Source == 'Rotten Tomatoes') {
                $('label[for=rotten-score]').text(rating.Value);
            } else if (rating.Source == 'Metacritic') {
                $('label[for=metacritic-score]').text(rating.Value);
            }
        });
    }

    $(USER_QUERY).text(state.query);
    $(POSTER_TITLE).text(movie.title);
    $(MOVIE_RELEASE_YEAR).text(movie.release_year);
    $(MOVIE_RATED).text(imdb.Rated == 'N/A' ? 'NR' : imdb.Rated);
    $(RUNTIME).text(imdb.Runtime);

    
    if (state.mobile) {
        $(MOVIE_BANNER_CONTAINER).hide();
        $(PLOT).hide();
        $(MOBILE_PLOT).text(imdb.Plot);
        // var $mobile_plot = `<p id="mobile-plot">${imdb.Plot}</p>`;
        // $(POSTER_METADATA).append($mobile_plot);
    } else {
        var banners = images.results.banners;
        $(MOVIE_BANNER_CONTAINER).show();
        $(MOVIE_BANNER_IMG).attr('src', '')
        if(banners != undefined && banners.length > 0) {
            $(MOVIE_BANNER_IMG).removeClass('hidden');
            $(MOVIE_BANNER_IMG).attr('src', banners[0].large.url);
        } else {
            $(MOVIE_BANNER_IMG).addClass('hidden');
        }
        $(PLOT).show();
        $(PLOT).text(imdb.Plot);
    }



    $(DIRECTOR).text(imdb.Director);
    $(WRITERS).text(imdb.Writer);
    $(CAST).text(imdb.Actors);

    if(movie.trailers.web.length > 0 && movie.trailers.web[0].embed != undefined) {
        $(IFRAME).attr('data-og-link', movie.trailers.web[0].embed);
        $(IFRAME).attr('data-autoplay-link', movie.trailers.web[0].embed + '&autostart=true');
    }
    
    if (state.trailers.length > 0) {
        $(MAIN_TRAILER_THUMB).attr('src', state.trailers[0].thumbnail_304x171);
    }
        
    

    var $dl_purch = $('<dl id="web-purch-srcs" class="streaming-links-slider"></dl>');
    var $dl_sub = $('<dl id="web-sub-srcs" class="streaming-links-slider"></dl>');
    var $dl_tv = $('<dl id="web-tv-srcs" class="streaming-links-slider"></dl>');
    var $dl_free = $('<dl id="web-free-srcs" class="streaming-links-slider"></dl>');


    // Displays the different sources as definition lists, if any exist for each source type

    if(movie.in_theaters) {
        $(STREAM_OPTIONS).html(`<h1>Still In Theaters</h1>`);
    }
    
    if(movie.purchase_web_sources.length > 0) {
        $(STREAM_OPTIONS).append($dl_purch);
        // $dl_purch.append('<dt>Buy / Rent</dt>');
        $('<label for="web-purch-srcs" id="stream-label">Buy / Rent</label>').insertBefore($dl_purch);
        $dl_purch.append(getSrcList(movie.purchase_web_sources).join(''));
        // $(STREAM_OPTIONS).append('<hr class="shadow-hr">');
    }

    if(movie.subscription_web_sources.length > 0) {
        $(STREAM_OPTIONS).append($dl_sub);
        // $dl_sub.append('<dt>Subscriptions</dt>');
        $('<label for="web-sub-srcs">Subscriptions</label>').insertBefore($dl_sub);
        $dl_sub.append(getSrcList(movie.subscription_web_sources).join(''));
        // $(STREAM_OPTIONS).append('<hr class="shadow-hr">');
    }

    if(movie.tv_everywhere_web_sources.length > 0) {
        $(STREAM_OPTIONS).append($dl_tv);
        // $dl_tv.append('<dt>TV</dt>');
        $('<label for="web-tv-srcs">TV</label>').insertBefore($dl_tv);
        $dl_tv.append(getSrcList(movie.tv_everywhere_web_sources).join(''));
        // $(STREAM_OPTIONS).append('<hr class="shadow-hr">');
    }

    if(movie.free_web_sources.length > 0) {
        $(STREAM_OPTIONS).append($dl_free);
        // $dl_free.append('<dt>Free</dt>');
        $('<label for="web-free-srcs">Free</label>').insertBefore($dl_free);
        $dl_free.append(getSrcList(movie.free_web_sources).join(''));
    }
    $(CAROUSEL_CONTAINER).show();

    if (!state.mobile) {
        initStreamingSlick();
        state.isSlick.streamer = true;
    }
}

    
// ================================================================================
// Helper functions for detail page display
// ================================================================================


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//   Builds options for streaming links
//
//   @return    descriptive list item with source name 
//              and link to source
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function getSrcList(sources) {
    return sources.map(function(src) {
        var src_str = `<dd>
                        <a href="${src.link}" target="__blank">
                            <img src="${icons[src.source]}" class="icon" id="${src.source}">
                            <label for="${src.source}">
                                <dl class="prices">`;
        var buy_hd = null;
        var rent_hd = null;
        var buy_sd = null;
        var rent_sd = null;
        
        if (src.hasOwnProperty('formats')) {
             src.formats.forEach(function(price){
                // console.log('src === ' + src.source);
                if(price.format == 'SD' && price.type == 'rent') {rent_sd = price.price;}
                else if(price.format == 'SD' && price.type == 'purchase') {buy_sd = price.price;}
                else if(price.format == 'HD' && price.type == 'rent') {rent_hd = price.price;}
                else if(price.format == 'HD' && price.type == 'purchase') {buy_hd = price.price;}
                
            });
        }                
        // console.log(src.display_name, buy_hd, rent_hd, buy_sd, rent_sd);
     
        if (buy_hd && rent_hd) {
            src_str += `<dd>HD: ${buy_hd} / ${rent_hd} </dd>`;
        } else if (buy_hd ) {
            src_str += `<dd>HD: ${buy_hd}</dd>`;
        } else if (rent_hd ) {
            src_str += `<dd>HD: ${rent_hd}</dd>`;
        } 

        if (buy_sd && rent_sd ) {
            src_str += `<dd>SD: ${buy_sd} / ${rent_sd} </dd>`;
        } else if (buy_sd) {
            src_str += `<dd>SD: ${buy_sd}</dd>`;
        } else if (rent_sd) {
            src_str += `<dd>SD: ${rent_sd}</dd>`;
        }
        src_str += `</dl></label></a></dd>`;
        
        return src_str;
    })
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//   Gets all available trailers for given movie and 
//   corresponding thumbnail image.
//
//   @return    array of objects consisting of trailers and
//              corresponding thumbnails, beginning with the 
//              main trailer and following with any  
//              alternative trailers 
//              returns -1 if no trailers found
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function storeTrailers(resp) {
    console.log("INSIDE getresp", resp);
    if(resp.results.length > 0) {
        var mainTrailer = resp.results.find(function(trailer) {
            return trailer.video_type == "Main Trailer";
        });
        var altTrailers = resp.results.reduce(function(acc, trailer, index) {
            if (trailer.video_type == "Alternate Trailer") {
                acc.push(trailer);
                return acc;
            } else {
                return acc
            }
        }, []);
        var trailers = [];
        trailers.push(mainTrailer);
        state.trailers = trailers.concat(altTrailers);
    }
   
}

// ================================================================================
// Slick Carousels initialization / tear down
// ================================================================================

// * * * * * * * * * * * * * * * * * * * * * * * * * 
//  Initializes detail page search results banner
// * * * * * * * * * * * * * * * * * * * * * * * * * 
function initBannerSlick() {
    $('.responsive').slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 6,
        responsive: [
            {
            breakpoint: 1025,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 5,
                infinite: false,
                arrows: true,
                dots: false
            }
            },
            {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                arrows: false
            }
            },
            {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false
                
            }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
}

// * * * * * * * * * * * * * * * * * * * * * * * * * 
//  Initializes streaming link icon lists
// * * * * * * * * * * * * * * * * * * * * * * * * * 
function initStreamingSlick() {
    $('.streaming-links-slider').slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 4,
        responsive: [
            {
            breakpoint: 325,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 4,
                infinite: false,
                dots: false
            }
            },
            {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                arrows: false
            }
            },
            {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false
            }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
}
     


// * * * * * * * * * * * * * * * * * * * * * * * * * 
//  Tears down detail page banner
// * * * * * * * * * * * * * * * * * * * * * * * * * 
function unBannerSlick() {
    $('.responsive').slick('unslick');
}

// * * * * * * * * * * * * * * * * * * * * * * * * * 
//  Tears down streaming link icon lists
// * * * * * * * * * * * * * * * * * * * * * * * * * 
function unStreamerSlick() {
    $('.streaming-links-slider').slick('unslick');
}



// ================================================================================
//    Helper functions
// ================================================================================


var MAX_RESULTS = 52;//52; // This number MUST be a multiple of 4 for grid system to function

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Used as generic callback function to print JSON return 
// data to console.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function printRespToConsole(resp) {
    console.log(resp);
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Handles additional calls to api when user scrolls to
// bottom of landing page to load the next batch of
// media posters.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function infiniteScroll() {
    $(document).ready(function() {
        var win = $(window);

        win.scroll(function () {
            if(state.infinite_scroll && ($(document).height() - win.height() == win.scrollTop())) {
                //add loading message
                state.offset += MAX_RESULTS;
                loadLandingPage(MAX_RESULTS, state.offset);
            }
        });
    });
}


//      *********** NEEDS IMPLEMENTATION ***********
//    
//
function infiniteCarousel() {
    if ($(CAROUSEL).slick('slickCurrentSlide') == 4) {
        console.log("ends of slides!");
    }
}

// ================================================================================
//    API Handlers
// ================================================================================


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Handles popular movie api calls for landing / home page.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function loadLandingPage(limit, offset, sources) {
    state.infinite_scroll = true;
    getPopularTitles(limit, offset, sources, function(popular_resp) {
         state.movie_results = popular_resp.results; // stores array of movie results from search
        //  popular_resp.results.forEach(function(movie) {
        //     getMovieMetadata(movie.id, function(metadata_resp) {
        //         // state.movie_results.push(metadata_resp);
        //     });
        // });
        console.log(popular_resp);
        if(state.movie_results.length > 0) {
            // console.log(popular_resp);
            // state.mediaID = popular_resp.results[0].id; 
            displayMoviePosters();
        }
    });
}
// resp.results.forEach(function(movie) {
//     getAllMovieImages(movie.id, function(obj) {
//         Object.values(obj.results.banners).forEach(function(key) {
//             console.log(key);
//         });
//     });
// });


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Handles movie API calls and return data
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function searchMoviesHandler() {
    // searchItunes('movie', state.query, printRespToConsole);
    searchGuideboxByTitle("movie", state.query, function (resp) {
        state.movie_results = [];
        state.movie_results = resp.results; // stores array of movie results from search
        if(state.movie_results.length > 0) {
            state.mediaID = resp.results[0].id; 
            displayMoviePosters();
        }
    });
    $(LANDING).prepend('<h2 class="main-header">movies</h2>');
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Handles tvshow API calls and return data
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function searchTvShowsHandler() {
    // searchItunes('tvShow', state.query, printRespToConsole);
    searchGuideboxByTitle("show", state.query, function (resp) {
        state.show_results = resp.results; // stores array of show results from search
        if (state.show_results.length > 0) {
            displayTvPosters();
        }
    });
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Makes all necessary calls to APIs for movie metadata to 
// display on detail page
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function detailPageHandler(movie_id, loadCarousel) {
    getMovieMetadata(movie_id, function(metadata_resp) {
            searchIMDB(metadata_resp.imdb, function(imdb_resp) {
                getAllMovieTrailers(movie_id, function(trailer_resp) {
                    getAllMovieImages(movie_id, function(images_resp) {
                        console.log(metadata_resp); // PRINT
                        storeTrailers(trailer_resp);
                        displayDetailPage(metadata_resp, images_resp, imdb_resp);
                        loadCarousel ? loadBannerCarousel('search') : null;
                        $('html,body').scrollTop(0); 
                    });
                });
            });
        });
}


// ================================================================================
// API calls. 
// Guidebox / OMDB(IMDB) / iTunes
// ================================================================================
var GBOX_BASE_URL = "https://api-public.guidebox.com/v2/";
var ITUNES_BASE_URL = "https://itunes.apple.com/";

//http://api-public.guidebox.com/v2/movies?api_key=YOUR_API_KEY&limit=10

function getQuota() {
    $.getJSON(GBOX_BASE_URL + 'quota', '', printRespToConsole);
}

function getPopularTitles(limit, offset, sources, callback) {
    (arguments.length == 3) ? callback = printRespToConsole : null;
    var RECENT_MOVIES_URL = GBOX_BASE_URL + 'movies/';
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
        limit: limit,
        offset: offset,
        sources: sources
    };
    $.getJSON(RECENT_MOVIES_URL, query, callback);
}

function searchGuideboxByTitle(type, requestData, callback) {
    (arguments.length == 2) ? callback = printRespToConsole : null;
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
    (arguments.length == 1) ? callback = printRespToConsole : null;
    var MOVIE_GBOX_URL = GBOX_BASE_URL + "movies/" + movieID;
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
    };
    $.getJSON(MOVIE_GBOX_URL, query, callback);
}

function getShowMetadata(showID, callback) {
    (arguments.length == 1) ? callback = printRespToConsole : null;
    var SHOW_GBOX_BASE_URL = GBOX_BASE_URL + "shows/" + showID + "/episodes/";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
        include_links: true
    };
    $.getJSON(SHOW_GBOX_BASE_URL, query, callback);
}



function searchItunes(mediaType, requestData, callback) {
    (arguments.length == 2) ? callback = printRespToConsole : null;
    var ITUNES_URL = ITUNES_BASE_URL + 'search/';
    var query = {
        term: encodeURIComponent(requestData),
        entity: mediaType
    };
    $.getJSON(ITUNES_URL, query, callback);
}

function getAllSources(callback) {
    (arguments.length == 0) ? callback = printRespToConsole : null;
    var SOURCES_GBOX_URL = GBOX_BASE_URL + "sources/";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498"
    };
    $.getJSON(SOURCES_GBOX_URL, query, callback);
}

function getAllMovieImages(mediaID, callback) {
    (arguments.length == 1) ? callback = printRespToConsole : null;
    var MOVIE_IMAGES_URL = GBOX_BASE_URL + "movies/" + mediaID + "/images/";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498"
    };
    $.getJSON(MOVIE_IMAGES_URL, query, callback);
}

function getAllMovieTrailers(mediaID, callback) {
    (arguments.length == 1) ? callback = printRespToConsole : null;
    var MOVIE_TRAILERS_URL = GBOX_BASE_URL + "movies/" + mediaID + "/videos/";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498"
    };
    $.getJSON(MOVIE_TRAILERS_URL, query, callback);
}

function getNewMovies(timestamp, callback) {
    (arguments.length == 1) ? callback = printRespToConsole : null;
    var NEW_MOVIES_URL = GBOX_BASE_URL + "updates/";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
        object: "show",
        type: "new",
        time: timestamp
    };
    $.getJSON(NEW_MOVIES_URL, query, callback);
}

// // * * * * * * * * * * * * * * * * * * * * * * * * * 
// //  OMDB API calls
// // * * * * * * * * * * * * * * * * * * * * * * * * * 
// function searchIMDB(id, callback) {
//     (arguments.length == 1) ? callback = printRespToConsole : null;
//     var IMDB_URL = 'https://www.omdbapi.com/';
//     var query = {
//         i: id,
//         plot: 'short',
//         apikey: '48bffb4a'
//     };
//     $.getJSON(IMDB_URL, query, callback);
// }

// function searchPosterOMDB(id, callback) {
//     (arguments.length == 1) ? callback = printRespToConsole : null;
//     var POSTER_OMDB_URL = 'http://img.omdbapi.com/';
//     var query = {
//         i: 'tt3896198',
//         h: 600,
//         apikey: '48bffb4a',
//     };
//     $.getJSON(POSTER_OMDB_URL, query, callback);
// }

//i=tt3896198&h=600&apikey=48bffb4a

// * * * * * * * * * * * * * * * * * * * * * * * * * 
//  VidSource API calls
// * * * * * * * * * * * * * * * * * * * * * * * * * 
var VIDSOURCE_BASE_URL = 'http://www.vidsourceapi.com/webservice.asmx';

function getStreamUrlByImdbId() {
    var STREAM_URL = VIDSOURCE_BASE_URL + '/GetStreamEmbedUrlByIMDBID';
    var query = {
        apikey: 'ZXuWvgJEKeEw3BPq',
        imdbid: 'tt0078748',
        redirection: true
    };
    // debugger;
    //http://www.vidsourceapi.com/WebService.asmx/GetStreamEmbedUrlByIMDBIDs?apikey=ZXuWvgJEKeEw3BPq&imdbids=0816692,2395427
    $.getJSON('STREAM_URL', query, function(resp) {
        debugger;
        console.log(resp);
    });
}

// * * * * * * * * * * * * * * * * * * * * * * * * * 
//  SpiderVideo API calls
// * * * * * * * * * * * * * * * * * * * * * * * * * 
function getVideoSpider() {
    var VIDSPIDER_URL = 'http://videospider.in/getvideo';
    var query = {
        key: '193447211',
        video_id: 'tt0078748'
    }

    $.getJSON(VIDSPIDER_URL, query, printRespToConsole);
}


// ================================================================================
// Event-listeners 
// ================================================================================

function searchFormSubmit() {
    $('.search-form').submit(function(e) {
        e.preventDefault();
        state.infinite_scroll = false;
        state.query = $(this).find('.js-movie-query').val();
        $(LANDING).addClass('hidden');
        $(LANDING).find('*').not(LANDING_HEADER).remove();
        $('.search-form')[0].reset();
        $(LANDING_HEADER).text(`'${state.query}' results`);
        searchMoviesHandler();
        searchTvShowsHandler();
    });
}

function showPosterClick() {
    $(LANDING).on('click', '.tv', function(e) {
        e.preventDefault();
        getShowMetadata($(this).attr('id'), function (resp) {
            // console.log("\n\n\nepisodes:");
            // console.log(resp);
            $(LANDING).empty();
            displayShowEpisodes(resp);
        });
    });
}

function moviePosterClick() {
    $(LANDING).on('click', '.movie-poster', function(e) {
        e.preventDefault();
        state.infinite_scroll = false;
        var movie_id = $(this).attr('id');
        detailPageHandler(movie_id, true); // loads slick carousel
    });
}

function carouselClick() {
    $(CAROUSEL).on('click', 'img', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var index = $(this).attr('data-index');
        var movie_id = state.movie_results[index].id;
        detailPageHandler(movie_id, false); // Does not reslick carousel
    });
}

function logoClick() {
    $('#logo').click(function(e) {
        e.preventDefault();
        state.offset = 0;
        $(LANDING).find('*').not(LANDING_HEADER).remove();
        $(LANDING_HEADER).text('Browse Popular Titles');
        loadLandingPage(MAX_RESULTS, 0, all);
    });
}

function navBtnClick() {
    $('#popular-movies-nav').click(function(e) {
        e.preventDefault();
        $(DETAIL_PAGE).addClass('hidden');
        $(LANDING).removeClass('hidden');
    });
}

function playTrailerClick() {
    $(MAIN_TRAILER_THUMB).click(function(e) {
        e.preventDefault();
        $(MODAL_FILTER).removeClass('hidden');
        $(IFRAME).attr('src', $(IFRAME).attr('data-autoplay-link'));
        $(IFRAME).removeClass('hidden');
    });
}

function closeTrailerModal() {
    $(MODAL_FILTER).click(function(e) {
        e.preventDefault();
        if(e.target ==  $(MODAL_FILTER).get()[0]) {  
            $(IFRAME).attr('src', ''); // resets video.
            $(MODAL_FILTER).addClass('hidden');
            $(IFRAME).addClass('hidden');
        }
    });
}

// ================================================================================
// Check screen size to determine Mobile Vs. Desktop
// ================================================================================
function checkSizeHandler() {
    $(document).ready(function() {
        checkSize();

        $(window).resize(checkSize);
    });
}

function checkSize() {
    // debugger;
    ($("body").css('width') <= '700px') ? state.mobile = true : state.mobile = false;
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Collapses and expands nav bar upon scroll
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function checkScrollPosition() {
    $(window).scroll(function(e) {
        var scroll = $(window).scrollTop();
        
        var heightStart = 100;
        var heightEnd = 48;
        var scrollStart = 10;
        var scrollEnd = 100;

        if (scroll > scrollStart && scroll <= scrollEnd) {
            console.log('first: ', scroll);
            var newHeight = (scroll - scrollStart) / (scrollEnd - scrollStart) * (heightEnd - heightStart) + heightStart;
            console.log(newHeight);
            collapseNav(newHeight + 'px');
        }

        if (scroll > scrollEnd) {
            collapseNav('48px');
        }

        if (scroll <= scrollStart) {
            console.log('last: ', scroll);
            var newHeight = (scroll - scrollStart) / (scrollEnd - scrollStart) * (heightEnd - heightStart) + heightStart;
            console.log(newHeight);
            uncollapseNav(newHeight + 'px');
        }
    });
}

function collapseNav(newHeight) {
    $('.logo').fadeOut(200);
    $('.monitor').fadeOut(200);
    $('.banner').stop().animate({height: newHeight}, { // 48px
                                duration: 100,
                                easing: 'linear',
                                step: function(currentHeight) {
                                    // console.log("height: ", currentHeight);
                                }
    });
}

function uncollapseNav(newHeight) {
    $('.logo').fadeIn(200)
    $('.monitor').fadeIn(200);
    $('.banner').stop().animate({height: newHeight}, { // 100px
                                duration: 100,
                                easing: 'linear',
                                step: function(currentHeight) {
                                    // console.log("height: ", currentHeight);
                                }
    });
}


// ================================================================================
// Writing JSON reponse to file
// ================================================================================

var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
  };

//* * * * * * * * * * * * * * * * * * * * * * * * * 
//  OMDB API calls
// * * * * * * * * * * * * * * * * * * * * * * * * * 
var IMDB_URL = 'https://www.omdbapi.com/';

function searchByIdOMDB(id, callback) {
    (arguments.length == 1) ? callback = printRespToConsole : null;
    var query = {
        i: id,
        plot: 'short',
        apikey: '48bffb4a'
    };
    $.getJSON(IMDB_URL, query, callback);
}

function searchCustomOMDB(params, callback) {
    (arguments.length == 1) ? callback = printRespToConsole : null;
    var query = {
        apikey: '48bffb4a'
    };
    Object.keys(params).forEach(function(key) {
        // query[key] = params[key];
    });

    Object.assign(query, params);
    console.log(query);
}

function searchPosterOMDB(id, callback) {
    (arguments.length == 1) ? callback = printRespToConsole : null;
    var POSTER_OMDB_URL = 'http://img.omdbapi.com/';
    var query = {
        i: 'tt3896198',
        h: 600,
        apikey: '48bffb4a',
    };
    $.getJSON(POSTER_OMDB_URL, query, callback);
}


// ================================================================================
// Entry point
// ================================================================================
var all = 'purchase,tv_everywhere,subscription,free';

$(function() {
    // getAllSources();
    // getAllMovieImages(112659);
    // getAllMovieTrailers(112659);
    // getNewMovies(new Date(), function(resp) {
    //     resp.results.forEach(function(movie) {
    //         getMovieMetadata(movie.id, printRespToConsole);
    //     });
    // });
    // getAmazonData();
    // state.spiderData = data;

    // loadLandingPage(MAX_RESULTS, 0, all); //purchase,tv_everywhere,subscription,free
    // infiniteScroll();
    
    checkScrollPosition()
    checkSizeHandler(); // 
    logoClick();
    searchFormSubmit();
    navBtnClick();
    moviePosterClick();
    showPosterClick();
    carouselClick();
    playTrailerClick();
    closeTrailerModal();
    // getAllMovieImages(48055);

    initBannerSlick();
    initStreamingSlick();

    // searchIMDB('tt0078748', function(resp) {
    //     var textStr = JSON.stringify(resp);
    //     console.log(textStr);
    //     var link = makeTextFile(textStr);
    //     $('#download').attr('href', link);
    // });

    // readTextFile('file:///Users/schmerb/Desktop/Projects/Thinkful/front-end-flex/capstone/assets/imdb-json.txt');

    // getQuota();
    // getAllMovieTrailers(48055);
    // getAllMovieTrailers(48055);

    // getStreamUrlByImdbId();
    // getVideoSpider();

    // searchPosterOMDB('tt0078748', function(resp) {
    //     debugger;
    //     console.log(resp);
    // });

    // searchIMDB('tt0078748');

    searchCustomOMDB({
        id: 888,
        s: 'yeeee'
    });
});








