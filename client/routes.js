

FlowRouter.route('/',{

			name:'login',
			action(){		
				BlazeLayout.render('layout',{ main:'login'});
			}
	   
});


FlowRouter.route('/home',{

			name:'home',
			action(){		
				BlazeLayout.render('layout',{ main:'home'});
			}
	   
});


FlowRouter.route('/friends',{

			name:'friends',
			action(){		
				BlazeLayout.render('layout',{ main:'friends'});
			}
	   
});

FlowRouter.route('/profile',{

    name:'profile',
    action(){
        BlazeLayout.render('layout',{ main:'friends'});
    }

});