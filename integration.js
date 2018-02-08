let request = require('request');
let async = require('async');

let Logger;
/*
* Given an array of entity objects, performs lookup requests and returns an array of result objects.
*
* @method doLookup
* @param {Array} entities
* @param {Object} options
* @param {Function} callback
*/
function doLookup(entities, options, cb) {

    // Pull config options
    let apiKey = options.apiKey;
    let uri = options.uri;

    // Store results in this array
    let lookupResults = [];

    // Iterate over each IP address

    // TODO: Since we can send addresses in batches, 
    // this should be changed to query for multiple IP's at once if possible.
    async.each(entities, function(entity, next) {

        // Make sure it is IPV4 and not a private address
        if(entity.isIPv4 && !entity.isPrivateIP) {

            // Lookup the address
            _lookupIPv4(entity, apiKey, uri, function(err, result) {

                // Make sure there wasn't any problem with the lookup
                if(!err) {
                    // Add to our results
                    lookupResults.push(result);
                }

                // Processing complete
                next(err);

            });

        // If it's not IPV4 or it is private
        } else {
            // Do nothing
            next(null);
        }
    }, function(err) {
        cb(err, lookupResults);
    });

}

function _lookupIPv4(entity, apiKey, uri, done) {

    // Build the query object
    let myip = {
        "ip": entity.value
    }

    // Build the query
    let req = {
                url: uri + '/reducer/ipinfo', 
                body: JSON.stringify(myip), 
                headers: {
                    'x-api-key': apiKey
                }
            }

    // Send the query
    request.post(req, function(err, response, body){
    
        if(err || response.statusCode !== 200){
            // return either the error object, or the body as an error
            done(err || body);
            return;
        }

        // Need to check for responses    
        let my_body = JSON.parse(body)

        // Make sure we have a response
        if(my_body.ports.length < 1 && my_body.tags.length < 1) {
            // We don't have anything, return nothing
            done(null, {
                entity: entity,
                data: null
            })
            return;
        }

        // there was no error in making the GET request so process the body here
        done(null, {
            entity: entity,
            data:{
                summary: [entity.value],
                details: JSON.parse(body)
            }
        });
    });
}

function validateOptions(userOptions, cb) {
    let validationErrors = [];

    // TODO: Need to add better apikey error handling
    if(typeof userOptions.apiKey.value !== 'string' ||
        (typeof userOptions.apiKey.value === 'string' &&
        userOptions.apiKey.value.length === 0)){
        validationErrors.push({
            key: 'apiKey',
            message: 'You must provide an API key'
        })
    }

    // TODO: Need to add better api endpoint error handling
    if(typeof userOptions.uri.value !== 'string' ||
        (typeof userOptions.uri.value === 'string' &&
        userOptions.uri.value.length === 0)){
        validationErrors.push({
            key: 'uri',
            message: 'You must provide a valid ThreshingFloor API URL.'
        })
    }

    cb(null, validationErrors);
}

function startup(logger) {
    Logger = logger;
}

module.exports = {
    doLookup: doLookup,
    startup: startup,
    validateOptions: validateOptions
};