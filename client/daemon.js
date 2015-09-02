/**
 * Created by Niels on 13/08/15.
 */
var remote = undefined;
var interval = undefined;
var sensors = [];
var pingCount = 0;

function pingServer() {
    console.log('Ping count: ' + pingCount);
    pingCount++;
    if(remote.status().status === 'connected') {
        for (var sensorIndex = 0; sensorIndex < sensors.length; sensorIndex++) {
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
                    sensors[sensorIndex].data += data*2-1;
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
            remote.call('addData', {date: date, sensorId: sensors[sensorIndex]._id, data: sensors[sensorIndex].data});
        }
    }
    else {
        remote.disconnect()
    }
}

function connectTo(url, frequency) {
    check(url, String);
    check(frequency, Number);
    console.log('Function called');
    remote = DDP.connect(url);
    console.log('connected');
    var ids = remote.call('getIds');
    console.log('ids fetched');
    for(var i = 0; i < ids.length; i++) {
        sensors.push({_id:ids[i]._id, type:ids[i].type, data:undefined});
    }
    interval = setInterval(Meteor.bindEnvironment(function() {pingServer()}), frequency);
    console.log('interval started');
}

function stopConnection() {
    clearInterval(interval);
    remote.disconnect();
}