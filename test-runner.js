'use strict';

let myIntegration = require('./integration');

let options = {
    apiKey: 'dsMPFPKd683IONNRgOhtk2qNBDemXRFhaET7uwOH',
    uri: 'https://api.threshingfloor.io'
};

let entities = [
    {
        value: '1.0.120.144',
        isIPv4: true
    },
    {
        value: '8.8.8.8',
        isIPv4: true
    }
];

myIntegration.doLookup(entities, options, function(err, result){
    if(err) {
        console.info("ERRORS:");
        console.info(JSON.stringify(err, null, 4));
    } else {
        console.info("RESULTS:");
        console.info(JSON.stringify(result, null, 4));
    }
});