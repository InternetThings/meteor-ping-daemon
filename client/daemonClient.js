/**
 * Created by Niels on 31/08/15.
 */
Template.connection.onCreated(function() {
    Session.setDefault('currentUrl', undefined);
});

Template.connection.helpers({
    isConnected:function() {
        return Session.get('currentUrl') !== undefined;
    },
    connectionString:function() {
        return 'Currently connected to ' + Session.get('currentUrl');
    }
});

Template.connection.events({
    'submit .connectionForm':function(event) {
        event.preventDefault();
        var frequency = parseInt(event.target.frequencyInput.value);
        console.log(frequency + " is a number: " + !isNaN(frequency));
        if(event.target.urlInput.value !== "" && !isNaN(frequency)) {
            Session.set('currentUrl', event.target.urlInput.value);
            connectTo(event.target.urlInput.value, frequency);
        }
    },

    'click .stopButton':function() {
        Session.set('currentUrl', undefined);
        stopConnection();
    }
});