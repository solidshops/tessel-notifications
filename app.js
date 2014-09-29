var webclient = require('https');
var fs = require('fs');
//var tessel = require('tessel');
// var audio = require('audio-vs1053b').use(tessel.port['A']);


var fileContents = fs.readFileSync("config.json");
var obj_config = JSON.parse(fileContents);


var int_timer = 5000;


//overwrite or live environment
/*if(overwrite == true) {
 console.log = function () {};
 }*/

//get data over http
function fnGetData() {
    console.log("the fuck");
    try {
        var options = {
            host: 'api.solidshops.com',
            port: 443,
            path: '/v1/orders.json',
            headers: {
                'Authorization': 'Basic '
                    + new Buffer(obj_config.api.key + ':' + obj_config.api.secret).toString('base64'),
                'User-Agent': 'SolidShops/Tessel'
            }
        };


        var request = webclient.get(options, function (res) {
            var body = "";
            res.on('data', function (data) {
                body += data;
                //res.resume();
            });
            res.on('end', function () {
                // here we have the full response, html or json object
                // console.log(body);
                try {
                    var obj_response = JSON.parse(body);
                    fnHandleOrder(obj_response.data[0]);
                } catch (e) {
                    console.log('error in fnGetData parse data');
                }
            })
            res.on('error', function (e) {
                console.log("Got error: " + e.message);
            });
        });
        request.on("error", function (error) {
            console.log("an error occured during the request");
        });

        request.end();
    } catch (e) {
        console.log('error in fnGetData http connection');
    }


}

//handle data
var id_order_latest = 0;
function fnHandleOrder(obj_order) {
    //check order data
    console.log(obj_order.id,id_order_latest )
    if (parseInt(obj_order.id) > id_order_latest) {
        id_order_latest = parseInt(obj_order.id);
        console.log("a new order was found: " + id_order_latest);
        fnPlayNotification("sound/neworder.mp3");
    }
};

//play sound
function fnPlayNotification(str_filename) {
    var song = fs.readFileSync(str_filename);
    /*audio.play(song, function(err) {
     if (err) {
     console.log(err);
     } else {
     console.log("Start playing: " +str_filename);
     }
     });*/
}


/*
 audio.on('ready', function() {
 audio.setVolume(10, function(err) {
 console.log("Volumse set");
 //just play something so you know the app has started
 fnPlayNotification("sound/neworder.mp3");
 });
 });
 */





//run after 10 seconds so audio is set
setTimeout(function () {
    setInterval(fnGetData, int_timer);
}, 10);



















