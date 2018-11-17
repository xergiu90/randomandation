  
    Meteor.publish("users", function (limit) {
	
		return Meteor.users.find({},{
			limit: limit|| 5 ,
			sort: {timestamp: -1}
		});
	
	
  });
  
    
    Meteor.publish("notifications", function (limit,uid) {
	
		return Notifications.find({uid:uid},{
			limit: limit|| 5 ,
			sort: {timestamp: -1}
		});
	
	
  });
  
      
    Meteor.publish("videos", function (limit,uid) {
	
		return Videos.find({"uids" : {$regex : ".*" +uid+ ".*"}},{
			multi:true,
			limit: limit|| 5 ,
			sort: {timestamp: -1}
		});
	
	
  });
  
  
  
  
  Meteor.publish("myUser", function (uid) {
	  
		return Meteor.users.find({_id:uid});

  });
  
    Meteor.publish("requests", function (limit,uid) {
	 
	 return Requests.find({$or: [{uid: uid},{fid: uid}]},{
			limit: limit|| 5 ,
			sort: {timestamp: -1}
			});

  });
  
  /*
  const Images = new FilesCollection({
	storagePath: '/var/www/html/',
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
});
export default Images; // To be imported in other files
 Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
  */