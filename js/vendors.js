function getLastParam() {
  var href = window.location.pathname.split('/');
  var param = href[href.length - 1];
  if (param.toLowerCase() === "vendors")
    return "";
  return param;
}

function initVendors() {
  var vendor_id = getLastParam();

  if (vendor_id) {
    $("#lnkBack").attr("href", "/vendors");
    $("#loading").show();
    // show vendor details
    $.ajax({
      type: 'GET',
      url: 'https://api.evercam.io/v1/vendors/' + vendor_id,
      success: function(response) {
        $("#lnkBack").show();
        $("#heading").html(response.vendors[0].name);
        if (response.vendors[0].known_macs.length > 0 && response.vendors[0].known_macs[0] != "") {
          $("#sub-heading").html("MAC: " + response.vendors[0].known_macs[0]);
        }
      },
      error: function(response) {
        console.log("LoadVendor Err: " + response);
      },
    });

    // show vendor's model list
    $.ajax({
      type: 'GET',
      url: 'https://api.evercam.io/v1/models?limit=5000&vendor_id=' + vendor_id,
      success: function(response) {

        for (var i = 0; i < response.models.length; i++) {
          tr = $('<tr/>');
          tr.append("<td style='width:100px; text-align:center;'><a href='/models/" + response.models[i].id + "'><img src='http://evercam-public-assets.s3.amazonaws.com/" + response.models[i].vendor_id + "/" + response.models[i].id + "/icon.jpg' style='width:auto; max-height:64px; max-width:150px;' alt='" + response.models[i].id + "' /></a></td>");
          tr.append("<td style='width:100px;'><a href='/models/" + response.models[i].id + "'>" + response.models[i].name + "</a></td>");
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
        $("#logo").attr("src", "http://evercam-public-assets.s3.amazonaws.com/" + vendor_id + "/logo.jpg");
        $("#logo").show();
        $("#vendorDetails").show();
      },
      error: function(response) {
        $("#logo").hide();
        $("#loading").hide();
        console.log("LoadVendorModels Err: " + response.message);
      },
    });

  } else { // show all vendors' list
    $("#heading").html("Vendors List");
    $("#sub-heading").html("List of camera vendors supported by Evercam");
    $("#loading").show();

    $.ajax({
      type: 'GET',
      url: 'https://api.evercam.io/v1/vendors',
      success: function(response) {
        for (var i = 0; i < response.vendors.length; i++) {
          tr = $('<tr/>');
          tr.append("<td style='width:100px; text-align:center;'><a href='/vendors/" + response.vendors[i].id + "'><img src='http://evercam-public-assets.s3.amazonaws.com/" + response.vendors[i].id + "/logo.jpg' style='width:auto; max-height:25px; max-width:150px;' alt='" + response.vendors[i].id + "' /></a></td>");
          tr.append("<td style='width:100px;'><a href='/vendors/" + response.vendors[i].id + "'>" + response.vendors[i].name + "</a></td>");
          tr.append("<td style='width:50px; text-align:center;'><a href='/vendors/" + response.vendors[i].id + "'>" + response.vendors[i].total_models + "</a></td>");
          tr.append("<td style='width:auto; text-wrap:normal;'>" + response.vendors[i].known_macs + "</td>");

          $('#vendorsTable').append(tr);
        }
        $('#vendorsTable').show();

        $('#vendorsTable').DataTable({
          "iDisplayLength": 50,
          "aaSorting": [1, "asc"],
          "columnDefs": [
            {
              "render": function(data, type, row) {
                return "<span style='word-wrap: break-word;'>" + data.replace(RegExp(",", "g"), ", ") + "</span>";
              },
              "targets": 3
            }
          ]
        });

        $("#loading").hide();
        $('#vendorList').show();
      },
      error: function(response) {
        $("#loading").hide();
        console.log("LoadVendors Err: " + response.message);
      },
    });
  }
}
