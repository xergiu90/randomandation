
import './login.html';

Template.login.onCreated(function helloOnCreated() {
		
		if(Meteor.userId() != null)
			FlowRouter.go("/home");

});

	Template.login.onRendered(function () {
		
		
	
	});


	Template.login.helpers({

	getUser()
	{
		return Meteor.user().username;
	}
});

Template.login.events({
  
	'click #google-login': function(event) {
    Meteor.loginWithGoogle({ requestPermissions: ['email','https://www.googleapis.com/auth/youtube','https://www.googleapis.com/auth/youtubepartner']}, function(err){
        if (err) {
			notifyErr(err);
            throw new Meteor.Error("Google login failed");
        }
		

        FlowRouter.go( '/home' );	

		
		Meteor.subscribe('myUser', Meteor.userId());
		Meteor.subscribe('requests',20,Meteor.userId());
		Meteor.subscribe('users',20);
		Meteor.subscribe('notifications',10,Meteor.userId());
		Meteor.subscribe('videos',100,Meteor.userId());		
		});
	},

	

 
});
	
