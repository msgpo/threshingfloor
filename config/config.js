// Generic REST Config File
module.exports = {
    "name": "ThreshingFloor IP Query",
    "acronym": "TF",
    "description": "This integration finds IP addresses and returns information about if they have been used to scan the internet.",
    "entityTypes": ['IPv4'],
    "options": [
        {
            "key": "apiKey",
            "name": "API Key",
            "description": "Your ThreshingFloor API key.",
            "adminOnly": true
        },
        {
            "key": "uri",
            "name": "ThreshingFloor Endpoint",
            "description": "The location of the ThreshingFloor API used by your organization.",
            "adminOnly": true
        }
    ],
    "block": {
        "component": {
            "file": "./component/threshingfloor.js"
        },
        "template": {
            "file": "./template/ipinfo.hbs"
        }
    },
    "styles": [
        "./styles/style.less"
    ]
};