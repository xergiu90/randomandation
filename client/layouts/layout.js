import './layout.html';

		Meteor.subscribe('myUser', Meteor.userId());
		Meteor.subscribe('requests',20,Meteor.userId());
		Meteor.subscribe('users',20);
		Meteor.subscribe('notifications',10,Meteor.userId());
		Meteor.subscribe('videos',100,Meteor.userId());
		Requests = new Mongo.Collection('requests',Meteor.userId());
		Notifications = new Mongo.Collection('notifications',Meteor.userId());
		Videos = new Mongo.Collection('videos',Meteor.userId());
	    //Meteor.absoluteUrl.defaultOptions.rootUrl = 'http://localhost.com:3000';
		

		Template.layout.onCreated(function helloOnCreated() {
	
		import '/imports/stylesheets/css/animate.css';
		import '/imports/stylesheets/css/animsition.min.css';
		import '/imports/stylesheets/css/bootstrap.css';
		import '/imports/stylesheets/css/bootstrap-select.min.css';
		import '/imports/stylesheets/css/dashboard.css';
		import '/imports/stylesheets/css/datepicker.css';
		import '/imports/stylesheets/css/intlTelInput.css';
		import '/imports/stylesheets/css/owl.carousel.min.css';
		import '/imports/stylesheets/css/YouTubePopUp.css';
		import '/imports/stylesheets/css/style.css';
		import { $ } from 'meteor/jquery';
		import '/imports/js/bootstrap.min.js';
		import '/imports/js/owl.carousel.min.js';
		import '/imports/js/easyscroll.min.js';
		import '/imports/js/wow.min.js';
		import '/imports/js/animsition.min.js';
		import '/imports/js/bootstrap-select.min.js';
		import '/imports/js/intlTelInput.min.js';
		import '/imports/js/jquery.validate.min.js';
		import '/imports/js/YouTubePopUp.jquery.js';
		import '/imports/js/datepicker.js';
		import '/imports/js/jquery-counter.min.js';
		

});

		
	Template.layout.onRendered(function () {

		
					    // ------------------------------------------------------- //
    // Free Feature Section Hover Effect
    // ------------------------------------------------------- //
    $('.free-features .item').on('mouseenter', function () {
        $(this).css('z-index', '999');
        $(this).siblings().css('z-index', '99');
    });

	
	
    // ------------------------------------------------------- //
    // Bootstrap Select
    // ------------------------------------------------------- //
    $('.bs-select').selectpicker();

    // ------------------------------------------------------- //
    // Adding fade effect to dropdowns
    // ------------------------------------------------------ //
    $('.dropdown').on('show.bs.dropdown', function () {
        $(this).find('.dropdown-menu').first().stop(true, true).fadeIn(150).addClass('active');
    });
    $('.dropdown').on('hide.bs.dropdown', function () {
        $(this).find('.dropdown-menu').first().stop(true, true).fadeOut(150).removeClass('active');
    });

    // ------------------------------------------------------- //
    // Add Text Background from HTML [data-text] attribute
    // ------------------------------------------------------- //
    $('.has-background-text').each(function () {
        $('<span class="text-bg"></span>').prependTo(this);
        var textBackground = $(this).attr('data-text');
        $(this).find('.text-bg').text(textBackground);
    });

    $('.has-background-text-gray').each(function () {
        $('<span class="text-bg-gray"></span>').prependTo(this);
        var textBackground = $(this).attr('data-text');
        $(this).find('.text-bg-gray').text(textBackground);
    });

    $('.with-bg-text').each(function () {
        $('<span class="heading-bg-text"></span>').prependTo(this);
        var textBackground = $(this).attr('data-text');
        $(this).find('.heading-bg-text').text(textBackground);
    });


   

    // ------------------------------------------------------- //
    // Phone Country Picker
    // ------------------------------------------------------- //
    $("#phone").intlTelInput();

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



    // ------------------------------------------------------- //
    // Testimonials Slider
    // ------------------------------------------------------ //
    $('.testimonials-slider').owlCarousel({
        loop: true,
        margin: 20,
        dots: false,
        nav: true,
        smartSpeed: 700,
        navText: [
            "<i class='fa fa-long-arrow-left'></i>",
            "<i class='fa fa-long-arrow-right'></i>"
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                dots: true
            },
            600: {
                items: 1,
                nav: true
            },
            1000: {
                items: 1,
                nav: true,
                loop: false
            }
        }
    });


    // ------------------------------------------------------- //
    // Team Slider
    // ------------------------------------------------------ //
    $('.team-slider').owlCarousel({
        loop: true,
        margin: 20,
        dots: true,
        nav: false,
        smartSpeed: 400,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 2,
                nav: false
            },
            1000: {
                items: 3,
                nav: true,
                loop: false
            }
        }
    });
	


    // ------------------------------------------------------- //
    // Navbar Toggler Button
    // ------------------------------------------------------- //
    $('.navbar .navbar-toggler').on('click', function () {
        $(this).toggleClass('active');
    });



    // ------------------------------------------------------- //
    // Scroll Top Button
    // ------------------------------------------------------- //
    $('#scrollTop').on('click', function () {
        $('html, body').animate({ scrollTop: 0}, 1000);
    });

    var c, currentScrollTop = 0,
        navbar = $('.navbar');
    $(window).on('scroll', function () {

        // Navbar functionality
        var a = $(window).scrollTop(), b = navbar.height();

        currentScrollTop = a;
        if (c < currentScrollTop && a > b + b) {
            navbar.addClass("scrollUp");
        } else if (c > currentScrollTop && !(a <= b)) {
            navbar.removeClass("scrollUp");
        }
        c = currentScrollTop;


        if ($(window).scrollTop() >= 2000) {
            $('#scrollTop').addClass('active');
        } else {
            $('#scrollTop').removeClass('active');
        }
    });


 

	
	
	
	});


Template.layout.helpers({

	getUserPhoto()
	{
		if(Meteor.user() != null)
		{
			if(Meteor.user().services.google.picture != null)
				return Meteor.user().services.google.picture;
		}
		
		return "img/avatar-1.png";
	},
	mescount()
	{
		return Notifications.find({uid:Meteor.userId(),seen:0}).count();
	},
	notify()
	{
		return Notifications.find({uid:Meteor.userId()},{
			limit: 5 ,
			sort: {timestamp: -1}
		});
	}
});

Template.layout.events({
  
  'click #logout': function (event) {
	   event.preventDefault();
	   
	   Meteor.logout(function () {
			   FlowRouter.go("/");
			   notify("See You Soon!!");}
			);
	   
    },  'click #notdropdown': function (event) {
	   event.preventDefault();
	   
	   Meteor.call("clearNotify",function(err,res){
        if (!err) {		
			
        } else {
            notifyErr(err);
        }});
	   
    },
	
	

  
 
});
