function getLastParam()
{
  var href = window.location.pathname.split('/');
  var param = href[href.length - 1];
  if (param.toLowerCase() === "models")
    return "";
  return param;
}

function initModels() {
  var model_id = getLastParam();

  if (model_id) {   // show model details
    $("#loading").show();
    $.ajax({
      type: 'GET',
      url: 'https://api.evercam.io/v1/models/' + model_id,
      success: function(response) {
        $("#lnkBack").attr("href", "/vendors/" + response.models[0].vendor_id);
        $("#heading").html(response.models[0].name);
        $("#sub-heading").html("Vendor: <a href='/vendors/" + response.models[0].vendor_id + "'>" + response.models[0].vendor_id + "</a>");
        
        $("#image").attr("src", "http://evercam-public-assets.s3.amazonaws.com/" + response.models[0].vendor_id + "/" + response.models[0].id + "/thumbnail.jpg");
        $("#image").show();

        if (response.models[0].jpg_url) {
          $("#jpgUrl").text(response.models[0].jpg_url);
        } else if (response.models[0].defaults.snapshots && response.models[0].defaults.snapshots.jpg) {
          $("#jpgUrl").text(response.models[0].defaults.snapshots.jpg);
        }
        if (response.models[0].mjpg_url) {
          $("#mjpgUrl").text(response.models[0].mjpg_url);
        } else if (response.models[0].defaults.snapshots && response.models[0].defaults.snapshots.mjpg) {
          $("#mjpgUrl").text(response.models[0].defaults.snapshots.mjpg);
        }
        if (response.models[0].h264_url) {
          $("#h264Url").text(response.models[0].h264_url);
        } else if (response.models[0].defaults.snapshots && response.models[0].defaults.snapshots.h264) {
          $("#h264Url").text(response.models[0].defaults.snapshots.h264);
        }
        if (response.models[0].shape) {
          $("#shape").text(response.models[0].shape);
        }
        if (response.models[0].resolution) {
          $("#resolution").text(response.models[0].resolution);
        }
        if (response.models[0].official_url) {
          $("#official_url").text(response.models[0].official_url);
        }
        if (response.models[0].audio_url) {
          $("#audio_url").text(response.models[0].audio_url);
        }
        if (response.models[0].more_info) {
          $("#more_info").text(response.models[0].more_info);
        }
        if (response.models[0].poe) {
          $("#poe_no").hide();
          $("#poe_yes").show();
        }
        if (response.models[0].wifi) {
          $("#wifi_no").hide();
          $("#wifi_yes").show();
        }
        if (response.models[0].upnp) {
          $("#upnp_no").hide();
          $("#upnp_yes").show();
        }
        if (response.models[0].ptz) {
          $("#ptz_no").hide();
          $("#ptz_yes").show();
        }
        if (response.models[0].infrared) {
          $("#infrared_no").hide();
          $("#infrared_yes").show();
        }
        if (response.models[0].varifocal) {
          $("#varifocal_no").hide();
          $("#varifocal_yes").show();
        }
        if (response.models[0].sd_card) {
          $("#sd_card_no").hide();
          $("#sd_card_yes").show();
        }
        if (response.models[0].audio_io) {
          $("#audio_io_no").hide();
          $("#audio_io_yes").show();
        }
        if (response.models[0].onvif) {
          $("#onvif_no").hide();
          $("#onvif_yes").show();
        }
        if (response.models[0].psia) {
          $("#psia_no").hide();
          $("#psia_yes").show();
        }
        if (response.models[0].discontinued) {
          $("#discontinued_no").hide();
          $("#discontinued_yes").show();
        }
        if (response.models[0].default_username) {
          $("#username").text(response.models[0].default_username);
        } else if (response.models[0].defaults && response.models[0].defaults.auth && response.models[0].defaults.auth.basic && response.models[0].defaults.auth.basic.username) {
          $("#username").text(response.models[0].defaults.auth.basic.username);
        }
        if (response.models[0].default_password) {
          $("#password").text(response.models[0].default_password);
        } else if (response.models[0].defaults && response.models[0].defaults.auth && response.models[0].defaults.auth.basic && response.models[0].defaults.auth.basic.password) {
          $("#password").text(response.models[0].defaults.auth.basic.password);
        }
        if (response.models[0].original_image) {
          $("#original_image").text(response.models[0].original_image);
        }
        if (response.models[0].thumbnail_image) {
          $("#thumbnail_image").text(response.models[0].thumbnail_image);
        }
        if (response.models[0].icon_image) {
          $("#icon_image").text(response.models[0].icon_image);
        }
        $("#loading").hide();
      },
      error: function(response){
        $("#image").hide();
        $("#loading").hide();
        console.log("LoadModel Err: " + response.message);
      },
    });

    $("#modelDetails").show();
  }
  else    // show all models' list
  {
    $("#heading").html("Models List");
    $("#sub-heading").html("List of camera models supported by Evercam");
    // show all model list
    $("#loading").show();
    $.ajax({
      type: 'GET',
      url: 'https://api.evercam.io/v1/models?limit=5000',
      success: function(response) {
        for (var i = 0; i < response.models.length; i++) {
          tr = $('<tr/>');
          tr.append("<td style='width:100px; text-align:center;'><a href='/models/" + response.models[i].id + "'><img src='http://evercam-public-assets.s3.amazonaws.com/" + response.models[i].vendor_id + "/" + response.models[i].id + "/icon.jpg' style='width:auto; max-height:64px; max-width:150px;' alt='" + response.models[i].id + "' /></a></td>");
          tr.append("<td style='width:auto;'><a href='/models/" + response.models[i].id + "'>" + response.models[i].name + "</a></td>");
          tr.append("<td style='width:auto;'><a href='/vendors/" + response.models[i].vendor_id + "'>" + response.models[i].vendor_id + "</a></td>");
          
          var defaults = "";
          if (response.models[i].jpg_url)
            tr.append("<td>" + response.models[i].jpg_url + "</td>");
          else
            tr.append("<td></td>");
          if (response.models[i].mjpg_url)
            tr.append("<td>" + response.models[i].mjpg_url + "</td>");
          else
            tr.append("<td></td>");
          if (response.models[i].h264_url)
            tr.append("<td>" + response.models[i].h264_url + "</td>");
          else
            tr.append("<td></td>");

          $('#modelsTable').append(tr);
        }
        $('#modelsTable').show();

        $('#modelsTable').DataTable({
          "iDisplayLength": 50,
          "aaSorting": [1, "asc"]
        });

        $("#loading").hide();
        $("#modelList").show();
      },
      error: function(response){
        $("#loading").hide();
        console.log("LoadVendorModels Err: " + response.message);
      },
    });
  }
}