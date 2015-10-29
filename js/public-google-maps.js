var map;
var myoverlay;
var place;
var camera;
var autocomplete;
var infosList = [];
var markers = [];
var markersList = {};
var userCamerasList = {};
var camerasList = {};
var camera_count;
var userLat = 0;
var userLng = 0;
var userLocation;
var userPosition;
var markerClusterer;
var load_camera = false;
var place_loaded = true;
var place_changed = false;
var zoom_changed = false;
var reload_cameras = true;
var set_bounds = false;
var MODE = "MAP";
var MINIMAL_RIGHTS = "list,snapshot";
var DEFAULT_ZOOM = 15;
var DEFAULT_DISTANCE = 2000;
var DEFAULT_LOCATION = "Dublin, Ireland";
var DEFAULT_POSITION = new google.maps.LatLng(53.3401496, -6.2611343);
var EVERCAM_DASHBOARD = "https://dash.evercam.io/";

function initialize() {
  Notification.init(".bb-alert");
  camera_count = $(".cameras-count");

  var user_id = getQueryStringParam("user_id");
  var api_id = getQueryStringParam("api_id");
  var api_key = getQueryStringParam("api_key");
  
  if (user_id && api_id && api_key) {
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("api_id", api_id);
    localStorage.setItem("api_key", api_key);
    
    if (history.replaceState) {
      window.history.replaceState({}, '', '/public/cameras/');
    }
    
    $.ajax({
      type: 'GET',
      url: "https://api.evercam.io/v1/users/" + user_id + "?api_id=" + api_id + "&api_key=" + api_key,
      success: function(response) {
        localStorage.setItem("user_id", response.users[0].id);
        localStorage.setItem("user_name", response.users[0].username);
        localStorage.setItem("user_firstname", response.users[0].firstname);
        localStorage.setItem("user_lastname", response.users[0].lastname);
        localStorage.setItem("user_email", response.users[0].email);
        
        // sets new user email on login area
        $("#login-user").html(localStorage.getItem("user_email"));

        // load logged in user's all cameras
        loadUserCameras();

        // reload cameras list to show/hide share icon
        clearCameras();
        clearMarkers();

        loadPublicCameras();
      },
      error: function(xhr) {
        Notify("Invalid user information.", "danger");
      }
    });
  }

  initMap();

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var id = getCameraId();
  if (id) {
    camera = getCamera(id);
    if (camera) {
      load_camera = true;
      place_loaded = false;
      MODE = "CAM";
    }
  }

  // try getting user's geo location
  if (navigator.geolocation) {
    function success(position) {
      if (load_camera) {
        userLat = camera.location.lat;
        userLng = camera.location.lng;
      } else {
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
      }
      userPosition = new google.maps.LatLng(userLat, userLng);
      
      reload_cameras = true;
      place_changed = true;
      set_bounds = load_camera;

      var request = { location: userPosition, radius: '1' };
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function(places, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          userLocation = places[0];
          $("#pac-input").val(userLocation.name);

          if (userLocation.name) {
            document.title = "Evercam -  Webcams, Public CCTV cameras in " + $("#pac-input").val();
          }
          
          place_loaded = true;
          map.setCenter(userPosition);
        }
      });
    };
    function error() {
      reload_cameras = true;
      place_changed = false;
      map.setCenter(DEFAULT_POSITION);
      $("#pac-input").val(DEFAULT_LOCATION);
      Notify("Failed to retrieve your Geolocation.", "danger");
      console.log("Failed to retrieve your Geolocation");
    };
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    Notify("Geolocation is not supported by your browser.", "warning");
    console.log("Geolocation is not supported by your browser");
  }

  // load cameras owned by and shared with user (if logged in)
  loadUserCameras();

  // handles map dragstart event and set flag as being dragged
  google.maps.event.addListener(map, 'dragend', function() {
    reload_cameras = true;
    closeInfos();
  });

  // handles map dragstart event and set flag as being dragged
  google.maps.event.addListener(map, 'zoom_changed', function() {
    reload_cameras = true;
    set_bounds = false;
    zoom_changed = true;
    closeInfos();
  });

  // handles map idle event, raised after any chagnes happens in viewport
  google.maps.event.addListener(map, 'idle', function() {
    var bounds = map.getBounds();
    var center = map.getCenter();

    // if id && camera is initialized on page initialize
    if (load_camera && place_loaded) {
      //console.log("load_camera");
      load_camera = false;
      place_loaded = true;
      loadCamera(camera);
      loadPublicCameras();
      return;
    }

    if (set_bounds) {
      //console.log("set_bounds");
      set_bounds = false;
      return;
    }

    if (center) {
      userLat = center.lat();
      userLng = center.lng();
      var pos = new google.maps.LatLng(userLat, userLng);

      if (bounds)
      {
        var pos2 = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
        DEFAULT_DISTANCE = Math.abs(google.maps.geometry.spherical.computeDistanceBetween(pos, pos2) - 300);
      }
      if (!zoom_changed && DEFAULT_DISTANCE > 8000) {
        DEFAULT_DISTANCE = 8000;
        map.setZoom(DEFAULT_ZOOM);
        console.log(DEFAULT_DISTANCE + "-" + DEFAULT_ZOOM);
      }
      
      var request = { location: pos, radius: '1' };
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function(places, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          place = places[0];

          if (!place_changed && reload_cameras) {
            $("#pac-input").val(place.name)

            if (place.name) {
              document.title = "Evercam -  Webcams, Public CCTV cameras in " + $("#pac-input").val();
            }
          }

          if (reload_cameras) {
            reload_cameras = false;

            clearMarkers();
            clearCameras();
            
            //console.log("load_public");
            loadPublicCameras();
          }
        }
      });
    }

    if (zoom_changed) {
      //console.log("zoom_changed");
      zoom_changed = false;
    }
  });

  // binds autocomplete textbox place_changed event
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    map.setZoom(DEFAULT_ZOOM);
    place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    if (place.name) {
      document.title = "Evercam -  Webcams, Public CCTV cameras in " + $("#pac-input").val();
    }

    place_changed = true;
    reload_cameras = true;
    set_bounds = false;

    userLat = place.geometry.location.lat();
    userLng = place.geometry.location.lng();

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
    }

    if (MODE === "CAM") {
      MODE = "MAP";
      $( "#camera-single" ).hide();
      $( "#public-map" ).fadeIn( 'slow' );
    }
  });

  // handles user click on 'show cameras near me' link
  // and try getting user's geo location
  $("#lnkMyLocation").click(function() {
    history.replaceState( {} , '/public/cameras/', '/public/' );

    if (userPosition && userLocation) {
      $("#pac-input").val(userLocation.name);
      reload_cameras = true;
      place_changed = true;
      map.setCenter(userPosition);
    } else {
      $("#pac-input").val(DEFAULT_LOCATION);
      reload_cameras = true;
      place_changed = true;
      map.setCenter(DEFAULT_POSITION);
    }
    
    $( "#camera-single" ).hide();
    $( "#public-map" ).fadeIn( 'slow' );
  });

  // handles user click on Back button on single camera page
  $("#lnkBacktoMap").click(function() {
    MODE = "MAP";
    load_camera = false;
    set_bounds = false;
    reload_cameras = false;
    history.replaceState( {} , '/public/cameras/', '/public/cameras/' );

    document.title = "Evercam -  Webcams, Public CCTV cameras in " + $("#pac-input").val();

    $( "#camera-single" ).hide();
    $( "#public-map" ).fadeIn( 'slow' );

    resetCamera();
  });
  $("#static-map").click(function() {
    MODE = "MAP";
    load_camera = false;
    set_bounds = false;
    reload_cameras = false;
    history.replaceState( {} , '/public/cameras/', '/public/cameras/' );

    document.title = "Evercam -  Webcams, Public CCTV cameras in " + $("#pac-input").val();

    $( "#camera-single" ).hide();
    $( "#public-map" ).fadeIn( 'slow' );

    resetCamera();
  });

  // handles add camera to user account
  $("#lnkAddtoAccount").click(function() {
    if (localStorage.getItem("api_id") && localStorage.getItem("api_key") && localStorage.getItem("user_email")) {
      var result = shareCamera(camera.id, localStorage.getItem("user_email"), MINIMAL_RIGHTS);
      if (result.shares) {
        $("#lnkAddtoAccount").hide();
        Notify("Camera <strong>" + camera.id + "</strong> is now shared with you.", "info");
      }
      else if (result.code === "duplicate_share_error") {
        $("#lnkAddtoAccount").hide();
        Notify("Camera <strong>" + camera.id + "</strong> is already shared with you.", "warning");
      }
      else {
        Notify("Camera <strong>" + camera.id + "</strong> could not be shared with you.", "danger");
      }
    } else {
      $("#myModal").modal('show');
    }
  });

  // handles user signin
  $("#singin").click(function() {
    var login = $("#username").val();
    var password = $("#password").val();
    $("#singin").attr('disabled','disabled');
    $.ajax({
      type: 'GET',
      url: "https://api.evercam.io/v1/users/" + login + "/credentials?password=" + password,
      success: function(response) {
        localStorage.setItem("api_id", response.api_id);
        localStorage.setItem("api_key", response.api_key)
        
        $.ajax({
          type: 'GET',
          url: "https://api.evercam.io/v1/users/" + login + "?api_id=" + response.api_id + "&api_key=" + response.api_key,
          success: function(response) {
            localStorage.setItem("user_id", response.users[0].id);
            localStorage.setItem("user_name", response.users[0].username);
            localStorage.setItem("user_firstname", response.users[0].firstname);
            localStorage.setItem("user_lastname", response.users[0].lastname);
            localStorage.setItem("user_email", response.users[0].email);
            
            // sets new user email on login area
            $("#login-user").html(localStorage.getItem("user_email"));

            $("#singin").removeAttr('disabled');
            // hides login dialog
            $("#myModal").modal('hide');

            var result = shareCamera(camera.id, response.users[0].email, MINIMAL_RIGHTS);
            if (result.shares) {
              $("#lnkAddtoAccount").hide();
              Notify("Camera <strong>" + camera.id + "</strong> is now shared with you.", "info");
            }
            else if (result.code === "duplicate_share_error") {
              $("#lnkAddtoAccount").hide();
              Notify("Camera <strong>" + camera.id + "</strong> is already shared with you.", "warning");
            }
            else {
              Notify("Camera <strong>" + camera.id + "</strong> could not be shared with you.", "danger");
            }

            // load logged in user's all cameras
            loadUserCameras();

            // reload cameras list to show/hide share icon
            clearCameras();
            clearMarkers();

            loadPublicCameras();
          },
          error: function(xhr) {
            $("#singin").removeAttr('disabled');
            Notify("Invalid user information.", "danger");
          },
        });
      },
      error: function(xhr){
        $("#singin").removeAttr('disabled');
        Notify("Invalid username and/or password.", "danger");
      }
    });
  });

  // handles user logout
  $("#lnkLogout").click(function() {
    localStorage.removeItem("api_id");
    localStorage.removeItem("api_key");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_firstname");
    localStorage.removeItem("user_lastname");
    localStorage.removeItem("user_email");

    $( "#camera-single" ).hide();
    $( "#public-map" ).fadeIn( 'slow' );

    $("#user-login").hide();
    $("#user-name").text("");
    $("#lnkGoToEvercam").attr("href", EVERCAM_DASHBOARD);

    clearUserCameras();
    clearCameras();
    clearMarkers();
    resetCamera();

    reload_cameras = true;

    loadPublicCameras();
  });
  
  $('.cameras-containers').css('height', window.innerHeight - 120);
}

// initialize google map
function initMap() {
  // initialize map
  map = new google.maps.Map(document.getElementById('public-map'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: DEFAULT_ZOOM
  });
  markerClusterer = new MarkerClusterer(map);

  //set markers overlay id to be used in css
  myoverlay = new google.maps.OverlayView();
  myoverlay.draw = function () {
    this.getPanes().markerLayer.id='markerLayer';
  };
  myoverlay.setMap(map);
}

// loads single camera details
function loadCamera(camera) {
  MODE = "CAM";
  resetCamera();
  if (camera) {
    document.title = "Evercam -  Webcams, Public CCTV cameras - " + $("#pac-input").val() + " - " + camera.name;

    $("#camera-image").attr("src", camera.thumbnail_url);
    if (camera.is_online) {
      $("#camera-image-container").html( "<div class='live-view' id='ec-container'></div> <script src='" + EVERCAM_DASHBOARD + "live.view.widget.js?refresh=1&camera=" + camera.id + "&private=false' async></script>" );
    } else {
      $("#camera-image-container").html( "<img id='camera-image' src='" + camera.thumbnail_url + "' />" );
    }

    $("#camera-name").text(camera.name);
    $("#camera-id").text(camera.id);
    $("#camera-owner").text(camera.owner);
    if (camera.vendor_name)
      $("#camera-vendor").text(camera.vendor_name);
    else
      $("#camera-vendor").text("Not available");
    if (camera.model_name)
      $("#camera-model").text(camera.model_name);
    else
      $("#camera-model").text("Not available");
    $("#camera-created").text(timestamp2date(camera.created_at));
    if (camera.is_online)
      $("#camera-status").text("Online");
    else
      $("#camera-status").text("Offline");
    $("#camera-timezone").text(camera.timezone);

    $("#static-map").attr("src", "https://maps.googleapis.com/maps/api/staticmap?zoom=14&size=780x350&maptype=roadmap&markers=label:C|" + camera.location.lat + ",%20" + camera.location.lng);

    if (camera.id in userCamerasList) {
      $("#lnkAddtoAccount").hide();
    } else {
      $("#lnkAddtoAccount").show();
    }

    // if (MODE === "CAM") {
    //   set_bounds = true;
    // }
    // var camera_position = new google.maps.LatLng(camera.location.lat, camera.location.lng);
    // map.setCenter(camera_position);

    $( "#public-map" ).hide();
    $( "#camera-single" ).fadeIn( 'slow' );
  } else {
    console.log("Could not find camera '" + camera.id + "'.");
  }
}

// loads single camera details
function loadCameraId(id) {
  MODE = "CAM";
  history.replaceState( {} , '/public/cameras/', '/public/cameras/' + id );
  resetCamera();

  camera = camerasList[id];
  if (camera) {
    document.title = "Evercam -  Webcams, Public CCTV cameras - " + $("#pac-input").val() + " - " + camera.name;

    $("#camera-image").attr("src", camera.thumbnail_url);
    if (camera.is_online) {
      $("#camera-image-container").html( "<div class='live-view' id='ec-container'></div> <script src='" + EVERCAM_DASHBOARD + "live.view.widget.js?refresh=1&camera=" + camera.id + "&private=false' async></script>" );
    } else {
      $("#camera-image-container").html( "<img id='camera-image' src='" + camera.thumbnail_url + "' />" );
    }

    $("#camera-name").text(camera.name);
    $("#camera-id").text(camera.id);
    $("#camera-owner").text(camera.owner);
    if (camera.vendor_name)
      $("#camera-vendor").text(camera.vendor_name);
    else
      $("#camera-vendor").text("Not available");
    if (camera.model_name)
      $("#camera-model").text(camera.model_name);
    else
      $("#camera-model").text("Not available");
    $("#camera-created").text(timestamp2date(camera.created_at));
    if (camera.is_online)
      $("#camera-status").text("Online");
    else
      $("#camera-status").text("Offline");
    $("#camera-timezone").text(camera.timezone);

    $("#static-map").attr("src", "https://maps.googleapis.com/maps/api/staticmap?zoom=14&size=780x350&maptype=roadmap&markers=label:C|" + camera.location.lat + ",%20" + camera.location.lng);

    if (camera.id in userCamerasList) {
      $("#lnkAddtoAccount").hide();
    } else {
      $("#lnkAddtoAccount").show();
    }

    // if (MODE === "CAM") {
    //   set_bounds = true;
    // }
    // var camera_position = new google.maps.LatLng(camera.location.lat, camera.location.lng);
    // map.setCenter(camera_position);

    $( "#public-map" ).hide();
    $( "#camera-single" ).fadeIn( 'slow' );
  } else {
    console.log("Could not find camera '" + id + "'.");
  }
}

// load all cameras owned by and shared with user (if logged in)
function loadUserCameras() {
  if (localStorage.getItem("api_id") && localStorage.getItem("api_key") && localStorage.getItem("user_email")) {
    $("#user-name").text(localStorage.getItem("user_name"));
    $("#lnkGoToEvercam").attr("href", EVERCAM_DASHBOARD + "v1/cameras/?api_id=" + localStorage.getItem("api_id") + "&api_key=" + localStorage.getItem("api_key"));
    $("#user-login").show();

    var userCameras = $.ajax({
      async: false,
      type: 'GET',
      url: "https://api.evercam.io/v1/cameras?api_id=" + localStorage.getItem("api_id") + "&api_key=" + localStorage.getItem("api_key"),
    }).responseJSON.cameras;

    for (var i=0; i<Object.keys(userCameras).length ; i++) {
      userCamerasList[userCameras[i].id] = userCameras[i].name;
    }
  } else {
    clearUserCameras();
    $("#user-name").text("");
    $("#lnkGoToEvercam").attr("href", EVERCAM_DASHBOARD);
    $("#user-login").hide();
  }
}

// load public cameras from evercam api, near given location 
// and place markers on map for each camera
function loadPublicCameras() {
  $(".cameras-containers").html('');
  camera_count.html("<span><small>Looking for public cameras</small></span>");

  $.ajax({
    type: 'GET',
    url: "https://api.evercam.io/v1/public/cameras?within_distance=" + DEFAULT_DISTANCE + "&is_near_to=" + userLat + "," + userLng,
    success: function(response) {
      if (response.cameras.length > 0) {
        mapCameras(response.cameras);
      } else {
        $.ajax({
          type: 'GET',
          url: "https://api.evercam.io/v1/public/cameras?within_distance=" + (DEFAULT_DISTANCE * 2) + "&is_near_to=" + userLat + "," + userLng,
          success: function(response) {
            if (response.cameras.length > 0) {
              mapCameras(response.cameras);
            } else {
              $.ajax({
                type: 'GET',
                url: "https://api.evercam.io/v1/public/cameras?within_distance=" + (DEFAULT_DISTANCE * 4) + "&is_near_to=" + userLat + "," + userLng,
                success: function(response) {
                  if (response.cameras.length > 0) {
                    mapCameras(response.cameras);
                  } else {
                    camera_count.html("<span><small><strong>0</strong> cameras showing</small></span>");
                  }
                },
                error: function(response){
                  $(".cameras-wrapper").html('');
                  clearMarkers();
                  console.log("LoadCameras Err#3: " + response.message);
                },
              });
            }
          },
          error: function(response){
            $(".cameras-wrapper").html('');
            clearMarkers();
            console.log("LoadCameras Err#2: " + response.message);
          },
        });
      }
    },
    error: function(response){
      $(".cameras-wrapper").html('');
      clearMarkers();
      console.log("LoadCameras Err#1: " + response.message);
    },
  });
}

// show given cameras on map
function mapCameras(cameras) {
  $(".cameras-containers").html('');
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < cameras.length; i++) {
    if (cameras[i].is_online && cameras[i].location && cameras[i].location.lat != "0" && cameras[i].location.lng != "0") {
      camera_container = $("<div class='camera-container' />");
      var marker;
      if (cameras[i].thumbnail_url) {
        camera_container.append("<div id='wrap-" + cameras[i].id + "' class='camera-wrap'><div id='" + cameras[i].id + "' class='camera'><img id='img-" + cameras[i].id + "' class='camera-snapshot' src='" + cameras[i].thumbnail_url + "'></div></div>");

        if (!(cameras[i].id in userCamerasList)) {
          camera_container.append("<a class='add-to-account' id='add-" + cameras[i].id + "' camera='" + cameras[i].id + "' title='Add to my account'><i class='fa fa-plus add-top-right'></i></a>");
        }

        camera_container.on('click', "#" + cameras[i].id, function(e) {
          google.maps.event.trigger(markersList["marker_" + this.id], 'click');
        });
        camera_container.on('mouseover', "#" + cameras[i].id, function(e) {
          if (MODE === "MAP") {
            google.maps.event.trigger(markersList["marker_" + this.id], 'mouseover');
          }
        });
        camera_container.on('mouseout', "#" + cameras[i].id, function(e) {
          if (MODE === "MAP") {
            google.maps.event.trigger(markersList["marker_" + this.id], 'mouseout');
          }
        });

        camera_container.on('click', "#add-" + cameras[i].id, function(e) {
          camera = camerasList[this.getAttribute("camera")];
          if (camera) { 
            if (localStorage.getItem("api_id") && localStorage.getItem("api_key") && localStorage.getItem("user_email")) {
              var result = shareCamera(camera.id, localStorage.getItem("user_email"), MINIMAL_RIGHTS);
              if (result.shares) {
                $("#lnkAddtoAccount").hide();
                userCamerasList[camera.id] = camera.name;
                $("#add-" + camera.id).remove();
                Notify("Camera <strong>" + camera.id + "</strong> is now shared with you.", "info");
              }
              else if (result.code === "duplicate_share_error") {
                Notify("Camera <strong>" + camera.id + "</strong> is already shared with you.", "warning");
              }
              else {
                Notify("Camera <strong>" + camera.id + "</strong> could not be shared with you.", "danger");
              }
            } else {
              $("#myModal").modal('show');
            }
          }
        });

        marker = new google.maps.Marker({
          position: new google.maps.LatLng(cameras[i].location.lat, cameras[i].location.lng),
          map: map,
          title: cameras[i].name,
          icon: {
            size: new google.maps.Size(220,220),
            scaledSize: new google.maps.Size(32,32),
            origin: new google.maps.Point(0,0),
            url: cameras[i].thumbnail_url,
            anchor: new google.maps.Point(16,16),
          },
          optimized:false
        });
      } else {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(cameras[i].location.lat, cameras[i].location.lng),
          map: map,
          title: cameras[i].name,
          optimized:false
        });
      }

      // process multiple info windows
      addInfoWindow(marker, cameras[i].id, cameras[i].name, cameras[i].thumbnail_url);

      markers.push(marker);
      markersList["marker_" + cameras[i].id] = marker;
      markerClusterer.addMarker(marker);

      bounds.extend(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));

      if (cameras[i].is_online)
        camera_container.append("<div class='camera-name'>" + cameras[i].name + "</div>");
      else
        camera_container.append("<div class='camera-name off'><i class='red fa fa-chain-broken'/> " + cameras[i].name + "</div>");
      
      $(".cameras-containers").append(camera_container);
      camerasList[cameras[i].id] = cameras[i];
    }
  }

  var count = Object.keys(camerasList).length > 0 ? Object.keys(camerasList).length - 1 : 0;
  camera_count.html("<span><small><strong>" + count + "</strong> cameras showing</small></span>");

  set_bounds = true;

  if (place_changed) {
    //console.log("place_changed");
    place_changed = false;
  }
}

// add infowindow to given marker
function addInfoWindow(marker, cameraId, cameraName, cameraThumbnail) {
  (function (marker) {
    var infowindow = new google.maps.InfoWindow({
      content: "<div id='camera-info-" + cameraId + "' class='camera-info'><img class='camera-thumbnail' src='" + cameraThumbnail + "'><span class='camera-info-name'>" + cameraName + "</span></div>"
    });
    google.maps.event.addListener(marker, 'mouseover', function () {
      set_bounds = true;
      google.maps.event.addListener(infowindow, 'domready', function() {
        var iwOuter = $('.camera-info').parent().parent().parent();
        iwOuter.prev().css({'display' : 'none'});
        iwOuter.next().css({'display' : 'none'});
        iwOuter.parent().parent().css({left: '-75px', top: '25px'});
      });
      closeInfos();
      infowindow.open(map, marker);
      $("#wrap-" + cameraId).css("border-color", "#333");
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close();
      $("#wrap-" + cameraId).css("border-color", "#fff");
    });

    google.maps.event.addListener(marker, 'click', function() {
      closeInfos();
      loadCameraId(cameraId);
    });

    infosList.push(infowindow);
  })(marker);
}

// shares given public camera with given user id
function shareCamera(camera_id, user_email, user_rights) {
  return $.ajax({
    async: false,
    type: 'POST',
    dataType: 'json',
    data: { email: user_email, rights: user_rights },
    ContentType: 'application/json',
    url: "https://api.evercam.io/v1/cameras/" + camera_id + "/shares?api_id=" + localStorage.getItem("api_id") + "&api_key=" + localStorage.getItem("api_key"),
  }).responseJSON;
}

// fetch camera with given id from Evercam
function getCamera(camera_id) {
  return $.ajax({
    async: false,
    type: 'GET',
    url: "https://api.evercam.io/v1/public/cameras?id_starts_with=" + camera_id,
  }).responseJSON.cameras[0];
}

// clear all user cameras
function clearUserCameras() {
  if (userCamerasList) {
    userCamerasList = {};
    userCamerasList.length = 0;
  }
}

// clear all cameras
function clearCameras() {
  if (camerasList) {
    camerasList = {};
    camerasList.length = 0;
  }
}

// clear all markers from map
function clearMarkers() {
  closeInfos();
  if (markers) {
    for (var m in markers) {
      markers[m].setMap(null);
    }
    markers = [];
    markers.length = 0;
    markersList = {};
    markersList.length = 0;
    markerClusterer.clearMarkers();
  }
}

// close all open infowidows
function closeInfos() {
  for (i = 0; i < infosList.length; i++) {
    infosList[i].close();
  }
}

// get url part after '/public/cameras/'
function getCameraId() {
  var pathArray = window.location.pathname.split( '/' );
  if (pathArray.length && pathArray[3])
    return pathArray[3];
}


function getQueryStringParam(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results == null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
};

// clearup single camera details
function resetCamera() {
  $("#camera-name").text("");
  $("#camera-id").text("");
  $("#camera-owner").text("");
  $("#camera-vendor").text("");
  $("#camera-model").text("");
  $("#camera-created").text("");
  $("#camera-status").text("");
  $("#camera-timezone").text("");
}

// converts a unix timestamp datetime
function timestamp2date(timestamp) {
  var a = new Date(timestamp * 1000);
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = month + ' ' + date + ', ' + year + ' ' + hour + ':' + min;
  return time;
}

function Notify(message, type) {
  $(".bb-alert").removeClass("alert-warning").removeClass("alert-danger").removeClass("alert-warning").addClass("alert-" + type);
  Notification.show(message);
}

// bind initialize event with page load
google.maps.event.addDomListener(window, 'load', initialize);

// bind resize event
google.maps.event.addDomListener(window, 'resize', function() {
  $('.cameras-containers').css('height', window.innerHeight - 120);
});