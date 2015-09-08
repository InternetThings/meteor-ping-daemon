/**
 * Created by Niels on 13/08/15.
 */
var remote = undefined;
var interval = undefined;
var sensors = [];
var pingCount = 0;

function pingServer() {
    try {
        console.log('Ping count: ' + pingCount);
        pingCount++;
        if (remote.status().status === 'connected') {
            for (var sensorIndex = 0; sensorIndex < sensors.length; sensorIndex++) {
                console.log(sensorIndex);
                var date = Date.now();
                var data = Math.random();
                if (sensors[sensorIndex].data === undefined) {
                    if (sensors[sensorIndex].type === "Temperature") {
                        sensors[sensorIndex].data = data * 35 - 5;
                    }
                    else {
                        sensors[sensorIndex].data = Math.floor(data);
                    }
                }
                else {
                    if (sensors[sensorIndex].type === "Temperature") {
                        sensors[sensorIndex].data += data * 2 - 1;
                    }
                    else {
                        if (sensors[sensorIndex].data === 0) {
                            sensors[sensorIndex].data = 1;
                        }
                        else {
                            sensors[sensorIndex].data = 0;
                        }
                    }
                }
                remote.call('addData', {
                    date: date,
                    sensorId: sensors[sensorIndex]._id,
                    data: sensors[sensorIndex].data
                });
            }
        }
        else {
            remote.disconnect()
        }
    }
    catch(error) {
        console.log(error);
    }
}

connectTo = function(url, frequency) {
    check(url, String);
    check(frequency, Number);
    console.log('Function called');
    remote = DDP.connect(url);
    console.log('connected');
    remote.call('getIds', function(error, result) {
        var ids = result;
        console.log('ids fetched');
        for (var i = 0; i < ids.length; i++) {
            sensors.push({_id: ids[i]._id, type: ids[i].type, data: undefined});
        }
        try {
            interval = Meteor.setInterval(pingServer, frequency);
        }
        catch(error) {
            console.log(error);
        }
        console.log('interval started');
    });
};

stopConnection = function() {
    Meteor.clearInterval(interval);
    sensors = [];
    remote.disconnect();
};