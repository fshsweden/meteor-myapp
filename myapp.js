Players = new Mongo.Collection("players");
Tasks = new Mongo.Collection("tasks");

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

    tasks: function() {
      return Tasks.find({});
    }

  });

  Template.body.events({
    'click button.xyz': function(event, template) {
      console.log("HEJ!");
      alert("Hej!");
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

    // Global configuration
    Api = new Restivus({
      // version: 'v1',
      // useDefaultAuth: true,
      prettyJson: true
    });

    // Generates: GET/POST on /api/v1/players, and GET/PUT/DELETE on /api/v1/players/:id
    // for Meteor.users collection (works on any Mongo collection)
    Api.addCollection(Players);
    // That's it! Many more options are available if needed...

    // Maps to: POST /api/v1/articles/:id

    Api.addRoute(
      'p/:id',
      {authRequired: false},
      {
        get: function () {

            console.log("id = " + this.urlParams.id);

            var coll = Players.find({"_id":"56545718b160400951111d87"}).fetch();
            // var pl = Players.findOne({_id: "56545718b160400951111d87"});
            console.log("Player=" + coll);

            return Players.findOne(this.urlParams.id);

        }
      }
    );

}
