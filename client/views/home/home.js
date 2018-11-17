
import './home.html';


		var genres = {
				'/m/04rlf': 'Music',
				'/m/05fw6t': ' Childrens music',
				'/m/02mscn ': 'Christian music',
				'/m/0ggq0m': ' Classical music',
				'/m/01lyv': 'Country',
				'/m/02lkt': ' Electronic music',
				'/m/0glt670': ' Hip hop music',
				'/m/05rwpb': ' Independent music',
				'/m/03_d0': ' Jazz',
				'/m/028sqc': ' Music of Asia',
				'/m/0g293': ' Music of Latin America',
				'/m/064t9': ' Pop music',
				'/m/06cqb': ' Reggae',
				'/m/06j6l': ' Rhythm and blues',
				'/m/06by7': ' Rock music',
				'/m/0gywn': ' Soul music',
			}

Template.home.onCreated(function helloOnCreated() {
	
	Meteor.subscribe('users');
	this.selectedClients= new ReactiveVar(false);
	Template.instance().selectedClients.set("");

});

	Template.home.onRendered(function () {
		
		 // ------------------------------------------------------- //
		// Transition Placeholders
		// ------------------------------------------------------ //
		$('.input-material').on('focus', function () {
			$(this).siblings('label').addClass('active');
		});

		$('.input-material').on('blur', function () {
			$(this).siblings('label').removeClass('active');

			if ($(this).val() !== '') {
				$(this).siblings('label').addClass('active');
			} else {
				$(this).siblings('label').removeClass('active');
			}
		});
	
		
		
		if(Meteor.userId() != null)
		{
				  Meteor.call("getChannels","",function(err,res){
					if (!err) {		
						//notify(res);
						
					} else {
						notifyErr(err);
					}});
		}
	 
	
	});


	Template.home.helpers({

	getVideos()
	{
		
		if(Meteor.userId() ==null)
			FlowRouter.go("/");
			
			var vids = [];
			
			for(var i = 0; i < Meteor.user().profile.friends.length;i++)
			{
				var c = Math.floor((Math.random() * 100))%(Videos.find({"uid" : Meteor.user().profile.friends[i]}).count() - 5);
				
				c = c < 0 ? 0 : c;
				
				var curs = Videos.find({"uid" : Meteor.user().profile.friends[i]},{skip:c,limit:5,multi:true,sort: {timestamp: 1}});
				
				curs.forEach(function(cur){
				vids.push(cur);});
			}
		
		
			return vids;
			
			
			
	},
	getGenres()
	{
		var ugenres = Meteor.user().profile.genres;
		var res = [];
		
		ugenres.forEach(function(g){
			if(genres.hasOwnProperty(g))
				res.push(genres[g]);
		});
		
		return res;
	}
	
});

Template.home.events({


 
});
	
