var state = {
    query: '',
    year: '',
    buy_HD: '',
    buy_SD: '',
    rent: '',
    mediaID: '',
    results: [],
    spiderData: {}
};


var BASE_URL = "http://api-public.guidebox.com/v2/";


// ================================================================================
// Displays movie posters to screen
//
// 1) Work on dynmically adding each row and subsequent columns
// 2) Eventually implement infinite scroll OR carousel horizontal scroll 
// ================================================================================
function displayPosters() {
    var i = 1;
    $('.col-4 div').empty();
    state.results.forEach(function (result) {
        console.log(result.title);
        var $poster = $('<img>');
        $poster.attr('id', result.id);
        $poster.attr('src', result.poster_120x171);
        var $label = $('<label>');
        $label.attr('for', result.id);
        $label.html('<h6>' + result.release_year + '</h6><h3>' + result.title + '</h3>');
        // if(state.buy_HD) {
        //     $label.append('<h6>' + state.buy_HD + '</h6>');
        // }
        //debugger;
        $('#poster-' + (i)).html($poster);
        $('#poster-' + (i)).append($label);
        getSpiderData(result.title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}), result.release_year);
        if (state.buy_HD) {
            $('#poster-' + i).append('<h6>' + state.buy_HD + '</h6>');
        }
        if (state.buy_SD) {
            $('#poster-' + i).append('<h6>' + state.buy_SD + '</h6>');
        }
        if (state.rent) {
            $('#poster-' + i).append('<h6>' + state.rent + '</h6>');
        }
        i++;
    });
    // if (state.buy_HD) {
    //     $('#poster-1').append('<h6>' + state.buy_HD + '</h6>');
    // }
    // if (state.buy_SD) {
    //     $('#poster-1').append('<h6>' + state.buy_SD + '</h6>');
    // }
    // if (state.rent) {
    //     $('#poster-1').append('<h6>' + state.rent + '</h6>');
    // }
}



function getSpiderData(title, year) {
   var buy_HD;
   var buy_SD;
   var rent;
   
   state.spiderData.data.forEach(function(obj) {
        // console.log(obj.title + "   buy_HD: " + obj.buy_HD + "\n");
        // debugger;
        if (obj.title[0].includes(title) && obj.title[0].includes(year)) { //

            buy_HD = obj.buy_HD;
            buy_SD = obj.buy_SD;
            // rent = obj.rent;
        };
   });
   console.log(buy_HD + "     OR     " + buy_SD);
   state.buy_HD = buy_HD;
   state.buy_SD = buy_SD;
   // state.rent = rent;
}
 //http://webservices.amazon.co.uk/onca/xml?Service=AWSECommerceService&Operation=ItemSearch&AWSAccessKeyId=AKIAIOSFODNN7EXAMPLE&Operation=ItemSearch&Actor=Johnny%20Depp&ResponseGroup=ItemAttributes,Offers,Images,Reviews,Variations&Version=2013-08-01&SearchIndex=DVD&Sort=salesrank&AssociateTag=mytag-20
//GET
//webservices.amazon.co.uk
///onca/xml
//AWSAccessKeyId=AKIAIOSFODNN7EXAMPLE&Actor=Johnny%20Depp&AssociateTag=mytag-20&Operation=ItemSearch&Operation=ItemSearch&ResponseGroup=ItemAttributes%2COffers%2CImages%2CReviews%2CVariations&SearchIndex=DVD&Service=AWSECommerceService&Sort=salesrank&Timestamp=2014-08-18T17%3A34%3A34.000Z&Version=2013-08-01

function getAmazonData() {
    var dt = new Date();
    var stamp = dt.toISOString();
    //http://webservices.amazon.com/onca/xml?Service=AWSECommerceService&Operation=ItemSearch&SubscriptionId=AKIAIQJDMYU5M2XBS5BA&AssociateTag=schmerb-20&SearchIndex=All&Keywords=Alien&ResponseGroup=Images,ItemAttributes,Offers
    var stringToEncode = 'GET\nwebservices.amazon.com\n/onca/xml\nAWSAccessKeyId=AKIAIQJDMYU5M2XBS5BA&AssociateTag=schmerb-20&Keywords=Alien&Operation=ItemSearch&ResponseGroup=Images%2CItemAttributes%2COffers&SearchIndex=All&Service=AWSECommerceService&Timestamp=' + stamp;
    console.log("stamp: " + stamp);
    var hash = CryptoJS.HmacSHA256(stringToEncode, "EAlqTDpV+vTH9EqeB1Xw4UtapxbUSrmkvoY19J9j");
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    var signature = encodeURIComponent(hashInBase64);
    console.log("signature:   " + signature);
    $.ajax({
        url: 'https://webservices.amazon.com/onca/xml/',
        data: {
            AWSAccessKeyId: 'AKIAIQJDMYU5M2XBS5BA',
            AssociateTag: 'schmerb-20',
            Keywords: 'Alien',
            Operation: 'ItemSearch',
            ResponseGroup: 'Images,ItemAttributes,Offers', 
            SearchIndex: 'All',
            Service: 'AWSECommerceService',
            Timestamp: stamp,
            Signature: signature
        }, 
        success: function(resp) {console.log(resp)},
        // crossDomain: true,
        dataType: 'xml'
    });
}
//'pv0NvwJc41fK0FM/w3UQUFDDvm8l%2ByPMsF4tBiTOzrI%3D';

// ================================================================================
// Guidebox API 
//
//  **** TO DO ****
//
// Goal: Allow user to enter title of movie or tv show (most likely they will have to be 
//                                                      explicit on which they are searching for)
// 1) DONE ----- Given user input, make call to get ID of movie or show
// 2) Make another call using id to get movie/show metadata
// 3) Display sources for where user can stream movie/show
// 4) display other relavant data: {IMDB, rottentomatoe, overview, release date/first-aired
//                                 rating, runtime, artwork/images, cast, director
//                                  status=running/ended (TV shows)
//
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
//                                 
// ================================================================================

function searchByTitle(type, requestData, callback) {
    "use strict";
    var SEARCH_BASE_URL = BASE_URL + "search";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
        type: type,
        field: "title",
        query: requestData
    };
    $.getJSON(SEARCH_BASE_URL, query, callback);
}

function getMovieMetadata(movieID, callback) {
    "use strict";
    var MOVIE_BASE_URL = BASE_URL + "movies/" + movieID;
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
    };
    $.getJSON(MOVIE_BASE_URL, query, callback);
}

function getShowMetadata(showID, callback) {
    "use strict";
    var SHOW_BASE_URL = BASE_URL + "shows/" + showID + "/episodes";
    var query = {
        api_key: "db85b00dc1a54c2a02ed61575609802bb3d8c498",
        include_links: true
    };
    $.getJSON(SHOW_BASE_URL, query, callback);
}

function searchIMDB(id) {
    var IMDB_URL = 'http://www.omdbapi.com/';
    var query = {
        i: id,
        plot: 'short'
    };
    $.getJSON(IMDB_URL, query, function(resp){
        console.log(resp);
    });
}


// ================================================================================
// Event-listeners 
// ================================================================================

function movieFormSubmit() {
    $('.movie-form').submit(function(e) {
        e.preventDefault();
        state.query = $(this).find('.js-movie-query').val();
        searchByTitle("movie", state.query, function (resp) {
            console.log(resp);  
            state.results = resp.results; // stores array of movie results from search
            
            state.mediaID = resp.results[0].id; 
            getMovieMetadata(state.mediaID, function (resp) {
                console.log(resp);
                searchIMDB(resp.imdb);
                state.year = resp.release_year;
                // debugger;
                // getSpiderData(state.query.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}), resp.release_year);
                displayPosters();
            });
        });
        // debugger;
        // getSpiderData(state.query, state.year);
    });
}


function showFormSubmit(){
    $('.show-form').submit(function(e) {
        e.preventDefault();
        state.query = $(this).find('.js-show-query').val();
        searchByTitle("show", state.query, function (resp) {
            console.log(resp); 
            var mediaID = resp.results[0].id;
            getShowMetadata(mediaID, function (resp) {
                console.log(resp);
            }); 
        });
    })
}


// ================================================================================
// Entry point
// ================================================================================
$(function() {
    movieFormSubmit();
    showFormSubmit();
    state.spiderData = data;
    getAmazonData();
});





// ****************************************
// Code     : NetflixRoulette JavaScript API Wrapper
// Author   : Alex Camilleri
// ****************************************
// Created  : 25/04/2014
// ****************************************

// (function (namespace) {
//     'use strict'
//     var API_URL = "http://netflixroulette.net/api/api.php?";
    


//     namespace.createRequest = function (requestData, callback, parseAsXml) {
//         parseAsXml = !! parseAsXml;
//         if (typeof callback !== 'function') {
//             throw new Error("The callback parameter was not a function");
//         }
//         var queryString = "type=" + (parseAsXml ? "xml" : "json");
//         if (typeof requestData === 'string') {
//             queryString += "&title=" + requestData;
//         } else if (typeof requestData === 'object' && requestData.hasOwnProperty("title")) {
//             queryString += "&title=" + requestData.title;

//             if (requestData.hasOwnProperty("year")) {
//                 queryString += "&year=" + requestData.year;
//             }
//         } else {
//             throw new Error("I don't know how to handle " + requestData);
//         }

//         var httpReq = new XMLHttpRequest();
//         httpReq.open("GET", API_URL + queryString.replace(/\s/ig, "%20"), true);
//         httpReq.onreadystatechange = function () {
//             if (httpReq.readyState !== 4) {
//                 return;
//             }

//             if (httpReq.status !== 200) {
//                 console.log("Could not find title");
//                 throw new Error("Unexpected HTTP Status Code (" + httpReq.status + ")");
//             } 

//             callback(parseAsXml ? new DOMParser()
//                 .parseFromString(httpReq.responseText, "text/xml") : JSON.parse(httpReq.responseText));
//         };
//         httpReq.send();
//     };

// })(window.netflixroulette || (window.netflixroulette = {}));



// //Requesting by title only
// netflixroulette.createRequest("Breaking Bad", function (resp) {
//     console.log("Breaking Bad's Summary = " + resp.summary);
// });



// // JSON Response, resp is a JSON object
// netflixroulette.createRequest({
//     title: "The Boondocks",
//     year: 2005
// }, function (resp) {
//     console.log("The Boondocks' Summary = " + resp.summary);
// });


