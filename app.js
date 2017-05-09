var state = {
    query: ''
};



// ****************************************
// Code     : NetflixRoulette JavaScript API Wrapper
// Author   : Alex Camilleri
// ****************************************
// Created  : 25/04/2014
// ****************************************

(function (namespace) {
    'use strict'
    var API_URL = "http://netflixroulette.net/api/api.php?";
    


    namespace.createRequest = function (requestData, callback, parseAsXml) {
        parseAsXml = !! parseAsXml;
        if (typeof callback !== 'function') {
            throw new Error("The callback parameter was not a function");
        }
        var queryString = "type=" + (parseAsXml ? "xml" : "json");
        if (typeof requestData === 'string') {
            queryString += "&title=" + requestData;
        } else if (typeof requestData === 'object' && requestData.hasOwnProperty("title")) {
            queryString += "&title=" + requestData.title;

            if (requestData.hasOwnProperty("year")) {
                queryString += "&year=" + requestData.year;
            }
        } else {
            throw new Error("I don't know how to handle " + requestData);
        }

        var httpReq = new XMLHttpRequest();
        httpReq.open("GET", API_URL + queryString.replace(/\s/ig, "%20"), true);
        httpReq.onreadystatechange = function () {
            if (httpReq.readyState !== 4) {
                return;
            }

            if (httpReq.status !== 200) {
                console.log("Could not find title");
                throw new Error("Unexpected HTTP Status Code (" + httpReq.status + ")");
            } 

            callback(parseAsXml ? new DOMParser()
                .parseFromString(httpReq.responseText, "text/xml") : JSON.parse(httpReq.responseText));
        };
        httpReq.send();
    };

})(window.netflixroulette || (window.netflixroulette = {}));




// ================================================================================
// API calls
// ================================================================================

function getDataFromApi(query) {

}


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


// ================================================================================
// Entry point event-listeners 
// ================================================================================

function formSubmit() {
    $('.query-form').submit(function(e) {
        e.preventDefault();
        state.query = $(this).find('.js-query').val();
        netflixroulette.createRequest(state.query, function (resp) {
                console.log(resp);
        });
    });
}

$(function() {
    formSubmit();
})








