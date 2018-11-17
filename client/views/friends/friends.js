
import './friends.html';

Template.friends.onCreated(function helloOnCreated() {
	
	this.selectedClients= new ReactiveVar(false);
	Template.instance().selectedClients.set("");
	this.selectedClient= new ReactiveVar(false);
	Template.instance().selectedClient.set("");
	this.selectedRequests= new ReactiveVar(false);
	Template.instance().selectedRequests.set("");

});

	Template.friends.onRendered(function () {
		
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
	
	});


	Template.friends.helpers({

	getUser()
	{
		return Meteor.user().username;
	},
	isRequest()
	{
		if(Requests.find({status:0,uid:Meteor.userId(),fid: String(Template.instance().selectedClient.get())}).count() > 0)
			return true;
		
		return false;
	},
	isOldRequest()
	{	
		if(Requests.find({status:2,uid:Meteor.userId(),fid: String(Template.instance().selectedClient.get())}).count() > 0)
			return true;
		
		if(Meteor.users.find({_id:Meteor.userId(),"profile.friends" : {$regex : ".*" + String(Template.instance().selectedClient.get())+ ".*"}},{multi:true}).count() > 0)
			return true;
		
		if(Meteor.userId() == String(Template.instance().selectedClient.get()))
			return true;
		
		
		return false;
	},
	getUserImage()
	{
		if(Template.instance().selectedClient.get()!= "")
		{
			var user= Meteor.users.findOne({"_id": String(Template.instance().selectedClient.get())});
			
			if(user !=null)
				return user.services.google.picture;
			
			return null;
		}
		else
			return null;
	}
	,
	getClients()
	{
		if(Template.instance().selectedClients.get()!= "")
			return Meteor.users.find({"profile.name" : {$regex : ".*" +Template.instance().selectedClients.get()+ ".*"}},{multi:true});
		else
			return null;
	},
	getFriends()
	{	
		var friends = Meteor.user().profile.friends;
		var ret=[];
		
		friends.forEach(function(req){
				
				var fr = Meteor.users.findOne({"_id":req});
				ret.push(fr);
			});
			
			return ret;
	
	},
	getMyRequests()
	{	
			return Requests.find({uid:Meteor.userId()},{sort: {timestamp: -1},limit:10});
	
	},
	getOthersRequests()
	{	
			var reqs = Requests.find({fid:Meteor.userId(),status:0},{sort: {timestamp: -1},limit:10}).fetch();
			
			var ret=[];
					
			reqs.forEach(function(req){
				
				var fr = Meteor.users.findOne({"_id":req.uid});
				ret.push(fr);
			});
			
			
			return ret;
	
	},
	
});

Template.friends.events({
	
   	"input #searchbtn": function(evt) {
		
		var selval = $(evt.target).val();
		
		Template.instance().selectedClients.set(selval);
		
  
  },
  
  "click .acceptbtn": function(evt) {
		
		var selval = $(evt.target).attr('id');
		
	   Meteor.call("acceptFriend",selval,function(err,res){
        if (!err) {		
			notify("Friend is added to your list");
			
        } else {
            notifyErr(err);
        }});
		
  
  },
  "click .rejectbtn": function(evt) {
		
		var selval = $(evt.target).attr('id');
		
		
	   Meteor.call("rejectFriend",selval,function(err,res){
        if (!err) {		
			notify("Friend is rejected");
			
        } else {
            notifyErr(err);
        }});
		
		
  
  },
  "change #clients": function(evt) {
		
		var selval = $(evt.target).val();
		
		Template.instance().selectedClient.set(selval);
		
  
  }
  ,
  "input #searchbtn2": function(evt) {
		
		var selval = $(evt.target).val();
		
		Template.instance().selectedRequests.set(selval);
		
  
  }, 
  "click #cancelrequest": function(evt) {
		
	   Meteor.call("deleteRequest",String(Template.instance().selectedClient.get()),function(err,res){
        if (!err) {		
			notify("Request Cancelled");
			
        } else {
            notifyErr(err);
        }});
		
		
  
  }
  ,
  "click #addfriend": function(evt) {
		
	   var client = $("#clients").val();
	
	   if(client[0] == null)
	   {
		   notifyErr("Please Select an Account");
		   return;
	   }
	   
	   Meteor.call("addFriend",client[0],function(err,res){
        if (!err) {		
			notify("Friend Request Sent");
			
        } else {
            notifyErr(err);
        }});
		
		
  
  },
  "click .removefriend": function(evt) {
		
	   var selval = $(evt.target).attr('id');
		
	   
	   Meteor.call("removeFriend",selval,function(err,res){
        if (!err) {		
			notify("Friend Removed From Your List");
			
        } else {
            notifyErr(err);
        }});
		
		
  
  },
	

 
});
	
