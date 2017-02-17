import CSV from 'csv';
require('whatwg-fetch');
//let _ = require('lodash');
//let $ = require('jquery');


//import Faker from 'faker';
const urls = {
    //departuresCVS: 'http://developer.mbta.com/lib/gtrtfs/Departures.csv'
    departuresCVS: '/Departures.csv'
};

function csvParser(csvData, callback) {
    let names = [];
    let departures = [];
    CSV.parse(csvData, function (err, data) {
       /* let transformer = CSV.transform(data, function (data, index) {
            return data.map(function (value) {
                return value.toUpperCase()
            });
        }, function (err, data) {
            CSV.stringify(data, function (err, data) {
                process.stdout.write(data);
            });
        }); */
        names = data.slice(0, 1)[0];
        departures = data.slice(1);
        callback({names: names, departures: departures});
    });
}

function csvError(error) {
    // console.log('Parsing failed', error);
}

function getDepartures(callback) {
    function fetchCallback(response) {
        if (!response.ok) {
            return;
        }

        if (response.bodyUsed) {
            var reader = response.body.getReader();
            var partialCell = '';
            var decoder = new TextDecoder();

            function concat() {
                return reader.read().then(function (result) {
                    partialCell += decoder.decode(result.value || new Uint8Array, {
                        stream: !result.done
                    });

                    if (result.done) {
                        //throw Error("Could not find value after " + returnCellAfter);
                    }

                    return concat();
                })
            }

            concat();
        } else {
            let promiseObj = response.blob();
            promiseObj.then(function (blob) {
                let reader = new FileReader();
                reader.onloadend = function () {
                    csvParser(reader.result, function(parsed) {
                        callback(parsed);
                    });
                }

                reader.readAsBinaryString(blob);
            });
        }
    }

    fetch(urls.departuresCVS, {
        //mode: 'no-cors',
        //mode: 'cors',
        //credentials: 'include'
    }).then(fetchCallback)
    .catch(csvError);
}

module.exports = { getDepartures: getDepartures };
