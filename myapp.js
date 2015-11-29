Players = new Mongo.Collection("players");
Tasks = new Mongo.Collection("tasks");

Bookings = new Mongo.Collection("bookings");

if (Meteor.isClient) {

/*
  Object.prototype.getName = function() {
     var funcNameRegex = /function (.{1,})\(/;
     var results = (funcNameRegex).exec((this).constructor.toString());
     return (results && results.length > 1) ? results[1] : "";
  };
*/

  /*
      B O D Y

  */
  Template.body.helpers({

    /* get all users */
    players: function() {
      return Players.find({});
    },

    bookings_for_selected_week: function() {
      return Bookings.find({});
    },

    tasks: function() {
      return Tasks.find({});
    },

    selweek: function() {
      return Session.get("SelectedWeek");
    }

  });

  Template.body.events({
    'click button.xyz': function(event, template) {
      console.log("HEJ!");
      alert("Hej!");
    },

    'change .dropdown' : function(e) { 
      Session.set("SelectedWeek", e.value);
    }
  });


  /*
    P L A Y E R  D E T A I L S
  */

  Template.player_details.helpers({
    selectedClass: function() {
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');

      console.log("Selected player is : <" + selectedPlayer + "> and playerId = <" + playerId + ">");
      console.log("Type is : <" + typeof selectedPlayer + "> and = <" + typeof playerId + ">");

      if(playerId.toString() == selectedPlayer.toString()) {
        console.log("xxcxcxcxcxcxascxacsxcxcx")
        return "selected";
      }
      else {
        return "notselected";
      }
    }
  });

  Template.player_details.events({
    'click .player': function() {

      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
      var selectedPlayer = Session.get('selectedPlayer');

      console.log("Selecting player:" + selectedPlayer);

      var pl = Players.findOne({_id: playerId});

      Players.update({_id: pl._id}, {$inc: {clickcount:1}});

    }
  });
}



if (Meteor.isServer) {

    Meteor.methods({
      getBookingsCount: function () {
          return Bookings.find().count();
      }
    });

    Meteor.startup(function() {
      console.log("Meteor.startup... count is " + Bookings.findOne({}).count);
      if (Bookings.findOne({}).count == 0) {
        console.log("Inserting initial Bookings");
        Bookings.insert({datum:"2015-11-30", starttid:"08:00", sluttid:"09:00", aktivitet:"Isvård"});
        Bookings.insert({datum:"2015-11-30", starttid:"09:10", sluttid:"10:10", aktivitet:""});
        Bookings.insert({datum:"2015-11-30", starttid:"10:20", sluttid:"11:20", aktivitet:"Isvård"});
        Bookings.insert({datum:"2015-11-30", starttid:"11:30", sluttid:"12:30", aktivitet:"Isvård"});
        Bookings.insert({datum:"2015-11-30", starttid:"12:40", sluttid:"13:40", aktivitet:"Isvård"});
      }
    }); 

    // Global configuration
    Api = new Restivus({
      useDefaultAuth: true,
      prettyJson: true
    });

    // Generates: GET/POST on /api/v1/players, and GET/PUT/DELETE on /api/v1/players/:id
    // for Meteor.users collection (works on any Mongo collection)
    Api.addCollection(Players);
    // That's it! Many more options are available if needed...
}
