window.addEventListener('load', function() {
    "use strict";
    //Initialize FastClick plugin
    FastClick.attach(document.body);
}, false);

//Declare variables
var myScroll, wrapper, $sectionTitle, $btnLocation, activeLi = 1;

//Set variables
body = document.getElementById("body"),
    wrapper = document.getElementById("wrapper");
$sectionTitle = $('h1.sectionTitle');
$btnLocation = $('a#location');

var xhReq = new XMLHttpRequest();
var heightBody = window.innerHeight-50;

var app = {

    initialize: function() {

        //Creation of the css class
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.cssClass { position:absolute; z-index:2; left:0; top:50px; width:100%; height: '+heightBody+'px; overflow:auto;}';
        document.getElementsByTagName('head')[0].appendChild(style);

        //Add the css class
        wrapper.className = 'cssClass';

        //Load default option
        xhReq.open("GET", "options/option1.html", false);
        xhReq.send(null);
        document.getElementById("sectionContent").innerHTML=xhReq.responseText;

        //Add default active class to the menu
        $( "ul.ulMenu li:nth-child(1)" ).addClass( "active" );

        //Initialize slides in HOME section
        $("#slides").slidesjs({
            width: 940,
            height: 528,
            navigation: {
                active: false
            },
            pagination: {
                active: false
            },
            play: { auto: true}
        });

        //Creation of the scroll using iScroll plugin
        myScroll = new iScroll('wrapper', { hideScrollbar: true });

        //Add default header title
        $sectionTitle.text('Stef MTrack');
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        //Only for iOS 7 in the Phonegap Project
        if (parseFloat(window.device.version) >= 7.0)
        {
            $('div#header').css('padding-top','20px');
            $('div#header .btn').css('margin-top','20px');
            $('div#header .location').css('margin-top','20px');
            $('div#sectionContent').css('margin-top','30px');
            $('div#wrapper').css('top','70px');
        }
    }

};

function menu(option){

    //Remove previous active class
    $( "ul.ulMenu li:nth-child("+activeLi+")" ).removeClass( "active" );

    //Add active class to the current option
    $( "ul.ulMenu li:nth-child("+option+")" ).addClass( "active" );

    //Save active option
    activeLi = option;
    //Read by ajax the page
    xhReq.open("GET", "options/option"+option+".html", false);
    xhReq.send(null);
    document.getElementById("sectionContent").innerHTML=xhReq.responseText;

    if(option == 1){
        setTitle('STEF MTrack');
        $btnLocation.hide();
        //Initialize slides
        $("#slides").slidesjs({
            width: 940,
            height: 528,
            navigation: {
                active: false
            },
            pagination: {
                active: false
            },
            play: { auto: true}
        });
        myScroll.enable();
    }
    else if(option == 2){

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://quiet-refuge-1119.herokuapp.com/api/trip",
            success: function(data){
                if(data.trip==null){

                    setTitle('Point d\'arret ');
                    $('#PA').empty();
                    $('#PA').append("<div class='box'><p class='titleBox'><i class='fa fa-stop'></i>Une erreur est survenue sur le serveur :/</p>");

                }else {
                    //console.log("good "+data.trip.tripCode);
                    setTitle('Point d\'arret ' + data.trip.tripCode);
                    $('#PA').empty();
                    $.each(data.stop, function (key, dataStop) {
                        $('#PA').append("<div class='box'><p class='titleBox'><i class='fa fa-level-up fa-fw'></i>" + dataStop.libel + "</p>" +
                            "<hr>" +
                            "<h4>Street :" + dataStop.street + "</h4>" +
                            "<h5>City   :" + dataStop.city + "</h5>" +
                            "<p>Operation type :" + dataStop.operationType + "</p><br>" +
                            "<p>Arrival stop description " + dataStop.arrivalStopDescription + "</p><br>" +
                            "<b>Date scheduled : " + dataStop.dateScheduled + "</b><br>" +
                            "<b>Scheduled departure Time " + dataStop.scheduledDepartureTime + "</b><br>" +
                            "</div>");
                    })

                    $('#PA').append("<hr><div class='spinner'></div>");
                }
            },
            error: function(data){
                setTitle('Point d\'arret');
                alert('Erreur de connexion');
            }
        });
        $btnLocation.hide();
        //setTitle('Point d\'arret');
        myScroll.enable();
    }
    else if(option == 3){
        $btnLocation.hide();
        setTitle('Point d\'arret livraison');
        myScroll.enable();
    }
    else if(option == 4){
        setTitle('Point d\'arret ramasse');
        myScroll.enable();
        mapObject.init();
        //Initialize PhotoSwipe plugin for gallery
        //var myPhotoSwipe = Code.PhotoSwipe.attach( window.document.querySelectorAll('#Gallery a'), { enableMouseWheel: false , enableKeyboard: false } );
    }
    else if(option == 5){
        setTitle('Annomalies');
        myScroll.disable();
        mapObject.init();
    }
    else if(option == 6){
        setTitle('A propos');
        myScroll.disable();
        //mapObject.init();
    }

    //Refresh of the iScroll plugin
    myScroll.refresh();
    myScroll.scrollTo(0,0);

}

function setTitle(title){
    $sectionTitle.text(title);
}

//Map

var mapObject = {

    init : function(){
        var map, markers = [], openInfoWindow;// bounds = new google.maps.LatLngBounds();
        $('div#mapCanvas').css({'height': heightBody - (heightBody/2) + 10 + 'px'});
        var markers = [];
        var latlng = new google.maps.LatLng(43.978518, 15.383649);
        var myOptions = {
            zoom: 16,
            center: latlng,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        //map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);

        myScroll.enable();
        myScroll.refresh();
        myScroll.scrollTo(0,0);

        this.getMarkers();
    },

    getMarkers: function(){
        //Set a hardcoded marker
        mapObject.addMarker(
            '43.978518',
            '15.383649',
            'Contact',
            '<h3>Contact me</h3><br><p>I am at this heart shaped island.</p>',
            1,
            false);
        $btnLocation.show();
    },

    addMarker: function(lat,lng,title,description,id,position){
        var myLatlng = new google.maps.LatLng(lat, lng);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            animation: google.maps.Animation.DROP,
            title: title
        });

        marker.infowindow = new google.maps.InfoWindow({
            content: description
        });

        marker.id = id;

        google.maps.event.addListener(marker, 'click', function() {

            if(marker.title != '')
            {
                marker.infowindow.open(map, marker);
            }
        });

        markers.push(marker);
    }

};

//When user resize the window in the browser, or in mobile change the position, adjust the height of the content
$( window ).resize(function() {
    $('#wrapper').css('height',window.innerHeight-50);
});
