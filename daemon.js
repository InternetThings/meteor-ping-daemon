/**
 * Created by Niels on 13/08/15.
 */
var remote = DDP.connect('10.10.226.48:3000');
var numOfSensors = 4;
var localIds = [];
var interval = null;
var locations = ['Køkkenet', 'Stuen', 'Altanen', 'Soveværelset'];

function pingServer() {
    if(remote.status().status === 'connected') {
        var data = [];
        for (var i = 0; i < localIds.length; i++) {
            data.push({id: localIds[i]._id, change: Math.floor(Math.random() * 3 - 3)});
        }
        remote.call('incrementData', data);
    }
    else {
        remote.disconnect()
    }
}

if(Meteor.isServer) {
    Meteor.startup(function() {
        var numOfData = remote.call('numOfData');
        console.log('Data received');
        if(numOfData < numOfSensors) {
            var newData = [];
            console.log('Generating starting data');
            for(var i = numOfData; i < numOfSensors; i++) {
                newData.push({temperature:Math.floor(Math.random()*37 +1), location:locations[i]});
            }
            remote.call('insertTemp', newData);
            console.log('Starting data inserted')
        }
        localIds = remote.call('getIds');
        console.log(localIds.length + ' Ids received');
        interval = setInterval(Meteor.bindEnvironment(pingServer), 1000);
    });
}