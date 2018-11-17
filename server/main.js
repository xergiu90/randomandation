import { Meteor } from 'meteor/meteor';
import { AccountsCommon } from 'meteor/accounts-base'
//import { Email } from 'meteor/email'
//import { FilesCollection } from 'meteor/ostrio:files';

var q;

Meteor.startup(() => {
	
		Requests = new Mongo.Collection('requests');
		Notifications = new Mongo.Collection('notifications');
		Videos = new Mongo.Collection('videos');
		
	    //Meteor.absoluteUrl.defaultOptions.rootUrl = 'http://localhost.com:3000';

		// first, remove configuration entry in case service is already configured
	
		Accounts.loginServiceConfiguration.remove({
		  service: "google"
		});
		Accounts.loginServiceConfiguration.insert({
		  service: "google",
		  loginStyle: "popup",
		  clientId: "620414528304-joo75d4m58bkuc4sbss83eud7m8kojum.apps.googleusercontent.com",
		  secret: "NnfORyajHMG3E7olsHcMuyjJ"
		});
		



});

Meteor.methods(
{
	 searchVideo: function(search) {
		 
		YoutubeApi.authenticate({
			type: 'key',
			key: 'AIzaSyBxT8BgAOthM-KpGWTqjMoSWEeMj-veqe8'
		});
		
		 
        YoutubeApi.search.list({
            part: "id",
            type: "video",
            maxResults: 5,
            q: search,
        }, function (err, data) {
            console.log(err, data);
        });
    }
	,getChannels: function(search) {
		
			var res = false;
		if(this.userId != null)
		{
			
			var uid = this.userId;
			 
			YoutubeApi.authenticate({
				type: "oauth",
				token: Meteor.users.findOne({_id:this.userId}).services.google.accessToken
			});

			
			YoutubeApi.videos.list({
				"myRating": "like",
				"maxResults":50,
				"part": 'snippet,statistics,topicDetails',
			}, Meteor.bindEnvironment(function (err, data) {
				
				if(err == null)
				{
					var items = data.items;
					
					Videos.remove({uid:uid});
					
					var fgenres = {};
					items.forEach(function(item)
					{
								
								var rids;
								if(item.topicDetails != null)
									rids=item.topicDetails.relevantTopicIds;
								
								var url;
								if(item.snippet.thumbnails != null)
									url = item.snippet.thumbnails.high.url;
								
								if(item.snippet.categoryId == 10)
								{
									
									form = {
										  uid: uid,
										  uids:Meteor.users.findOne({_id:uid}).profile.friends,
										  id: item.id,
										  genres:rids,
										  url:"https://www.youtube.com/watch?v="+item.id,
										  title:item.snippet.title,
										  categoryId:item.snippet.categoryId,
										  picture:url,
										  uname:Meteor.users.findOne({_id:uid}).profile.name,
										  timestamp:Date.now(),
									  };
								  
									Videos.insert(form);
									
									
									if(rids != null)
									{
										item.topicDetails.relevantTopicIds.forEach(function(genre){
											
											//if(Meteor.users.find({_id:uid,"profile.genres":{$regex : ".*" +genre+ ".*"}}).count()==0 && item.snippet.categoryId == "10")
												if(item.snippet.categoryId == "10")
													fgenres[genre] = fgenres[genre] == null ? 0: fgenres[genre] + 1;
											
										});
										

										
									}
								}
								
						
					});
										//console.log(sortByValue(fgenres));
										Meteor.users.update({_id:uid},{ $set: { "profile.genres": sortByValue(fgenres)}});
					
					res = true;
				}
				else
					Meteor.users.update({}, {$set : { "services.resume.loginTokens" : [] }}, {multi:true}); //Force logout on token expiry
				
			}));
		}
		
			return res;
    }
	,
	addFriend: function(fid)
	{
		if(!this.userId)
		{
			throw new Meteor.Error("logged out","the user must be logged in");
		}
		
		form = {
		  fid:fid,
		  uid: this.userId,
		  status: 0,
		  timestamp:Date.now(),
		  };
	  
		Notifications.insert({uid:fid,seen:0,msg:"You've got a new friend request",timestamp:Date.now()});
	  
		return Requests.insert(form);
	}
	,
	acceptFriend: function(id) 
	{
		Requests.update({uid:id,fid:this.userId}, {$set: {status:1}}, {multi: true});
		
		Meteor.users.update({_id:this.userId},{ $push: { "profile.friends": id }});
		Meteor.users.update({_id:id},{ $push: { "profile.friends": this.userId }});
		Videos.update({uid:id},{ $push: { "uids": this.userId }},{multi:true});
		Videos.update({uid:this.userId},{ $push: { "uids": id }},{multi:true});
		
		Notifications.insert({uid:id,seen:0,msg:"Your friend accepted your request",timestamp:Date.now()});
		
		//Items.find({}).forEach(function(item){ Items.update({_id:item._id},{$set: {"priceKWD":item.price * curr.quotes.USDKWD,"priceOMR":item.price * curr.quotes.USDOMR,"priceSAR":item.price * curr.quotes.USDSAR,"priceQAR":item.price * curr.quotes.USDQAR,"priceAED":item.price * curr.quotes.USDAED,"priceBHD":item.price * curr.quotes.USDBHD}}, {multi: true})});	
	}
	,
	removeFriend: function(id) 
	{
		Meteor.users.update({_id:this.userId},{ $pull: { "profile.friends": id }});
		Meteor.users.update({_id:id},{ $pull: { "profile.friends": this.userId }});
		Videos.update({uid:id},{ $pull: { "uids": this.userId }},{multi:true});
		Videos.update({uid:this.userId},{ $pull: { "uids": id }},{multi:true});
	}
	,
	deleteRequest: function(fid) 
	{
		Requests.remove({uid:this.userId,fid:fid});	
		
		
		Notifications.insert({uid:fid,seen:0,msg:"Friend cancelled his request",timestamp:Date.now()});
	}
	,
	rejectFriend: function(id) 
	{
		Requests.update({uid:id,fid:this.userId}, {$set: {status:2}}, {multi: true});	
	}
	,
	clearNotify: function(cid) 
	{
		Notifications.update({uid:this.userId}, {$set: {seen:1}}, {multi: true});	
	}
	,
	updateStatus: function(id,status) 
	{
		Orders.update({_id:id}, {$set: {status:status}});	
	}
}
);

function sortByValue(jsObj){
  	var sortedArray = [];
	var kvp = {};
	
  	for(var i in jsObj)
  	{
		sortedArray.push([jsObj[i]]);
		kvp[jsObj[i]] = i;
	}
	var sarr = sortedArray.sort(function(a, b)
	{
		return b - a;
	});
	
	var res = [];
	for( var i = 0; i < 3;i++)
	{
		if(sarr.length > i)
				res.push(kvp[sarr[i]]);
	}
	
	return res;
}