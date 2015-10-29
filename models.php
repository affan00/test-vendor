<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Evercam -  Apps for IP Cameras. Get more from your camera.</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="keywords" content="cameras, apps, integration, recording, remote storage, sharing, api, developer platform">
    <meta name="description" content="Add remote storage, sharing, time-lapses, notifications, logs, access from any mobile device. ERP Integration - for Construction Site monitoring, Manufacturing, Weighbridge and more.">
    <meta name="author" content="Evercam">
    <title>Evercam.io</title>
    <link href="/css/main.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.6/css/jquery.dataTables.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" async></script>
    <script src="https://cdn.datatables.net/1.10.6/js/jquery.dataTables.min.js"></script>
    <script src="/js/bootstrap.min.js" async></script>
    <script src="/js/custom.min.js" async></script>
    <link rel="apple-touch-icon" sizes="57x57" href="https://dash.evercam.io/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="https://dash.evercam.io/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="https://dash.evercam.io/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="https://dash.evercam.io/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="https://dash.evercam.io/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="https://dash.evercam.io/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="https://dash.evercam.io/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="https://dash.evercam.io/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="https://dash.evercam.io/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="https://dash.evercam.io/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="https://dash.evercam.io/android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="https://dash.evercam.io/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="https://dash.evercam.io/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="https://dash.evercam.io/manifest.json">
    <meta name="msapplication-TileColor" content="#dc4c3f">
    <meta name="msapplication-TileImage" content="https://dash.evercam.io/mstile-144x144.png">
    <meta name="theme-color" content="#ffffff">
  </head>
  <body>
    <?php include 'nav.php'; ?>
    <div class="alt-color">
      <header>
        <div class="banner">
          <h1><img id="image" style="display:none; width:200px; height:auto; margin-right:20px; margin-top:-20px;"><span id="heading"></span></h1>
          <h2><span id="sub-heading" style='word-wrap: break-word; '></span></h2>
          <a id="lnkBack" href="/public"><i class="fa fa-arrow-left"></i> Back</a>
        </div>
      </header>
    </div>
    <div id="public-models">
      <section style="padding-top:0px;">
        <div id="loading" style="display:none">Loading...<br /><br /></div>
        <div id="modelDetails" style="display:none">
          <table class="display table table-bordered dataTable">
            <tr id="tr_jpg">
              <td style="width:20%;">Jpg Url</td>
              <td><span id="jpgUrl" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_mjpg">
              <td>MJpeg Url</td>
              <td><span id="mjpgUrl" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_h264">
              <td>H264 Url</td>
              <td><span id="h264Url" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_shape">
              <td>Shape</td>
              <td><span id="shape" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_resolution">
              <td>Resolution</td>
              <td><span id="resolution" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_official_url">
              <td>Official Url</td>
              <td><span id="official_url" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_audio_url">
              <td>Audio Url</td>
              <td><span id="audio_url" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_more_info">
              <td>More Info</td>
              <td><span id="more_info" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_poe">
              <td>POE</td>
              <td><img id="poe_yes" src="/img/yes.png" style="display:none; width:26px;"><img id="poe_no" src="/img/no.png" style=" width:26px;"></td>
            </tr>
            <tr id="tr_wifi">
              <td>Wifi</td>
              <td><img id="wifi_yes" src="/img/yes.png" style="display:none; width:26px;"><img id="wifi_no" src="/img/no.png" style=" width:26px;"></td>
            </tr>
            <tr id="tr_upnp">
              <td>UPNP</td>
              <td><img id="upnp_yes" src="/img/yes.png" style="display:none; width:26px;"><img id="upnp_no" src="/img/no.png" style=" width:26px;"></td>
            </tr>
            <tr id="tr_ptz">
              <td>PTZ</td>
              <td><img id="ptz_yes" src="/img/yes.png" style="display:none; width:26px;"><img id="ptz_no" src="/img/no.png" style=" width:26px;"></td>
            </tr>
            <tr id="tr_infrared">
              <td>Infrared</td>
              <td><img id="infrared_yes" src="/img/yes.png" style="display:none; width:26px;"><img id="infrared_no" src="/img/no.png" style=" width:26px;"></td>
            </tr>
            <tr id="tr_varifocal">
              <td>Varifocal</td>
              <td><img id="varifocal_yes" src="/img/yes.png" style="display:none; width:26px;"><img id="varifocal_no" src="/img/no.png" style=" width:26px;"></td>
            </tr>
            <tr id="tr_sd_card">
              <td>SD Card:</td>
              <td><img id="sd_card_yes" src="/img/yes.png" style="display:none; width:26px;"><img id="sd_card_no" src="/img/no.png" style=" width:26px;"></td>
            </tr>
            <tr id="tr_audio_io">
              <td>Audio I/O</td>
              <td><img id="audio_io_yes" src="/img/yes.png" style="display:none; width:26px;"><img id="audio_io_no" src="/img/no.png" style=" width:26px;"></td>
            </tr>
            <tr id="tr_onvif">
              <td>OnVif</td>
              <td><img id="onvif_yes" src="/img/yes.png" style="display:none; width:26px;"><img id="onvif_no" src="/img/no.png" style=" width:26px;"></td>
            </tr>
            <tr id="tr_psia">
              <td>PSIA</td>
              <td><img id="psia_yes" src="/img/yes.png" style="display:none; width:26px;"><img id="psia_no" src="/img/no.png" style=" width:26px;"></td>
            </tr>
            <tr id="tr_discontinued">
              <td>Discontinued</td>
              <td><img id="discontinued_yes" src="/img/yes.png" style="display:none; width:26px;"><img id="discontinued_no" src="/img/no.png" style=" width:26px;"></td>
            </tr>
            <tr id="tr_username">
              <td>Default Username</td>
              <td><span id="username" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_password">
              <td>Default Password</td>
              <td><span id="password" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_original">
              <td>Original Image</td>
              <td><span id="original_image" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_thumbnail">
              <td>Original Image</td>
              <td><span id="thumbnail_image" style="color:black;">-</span></td>
            </tr>
            <tr id="tr_original">
              <td>Icon Image</td>
              <td><span id="icon_image" style="color:black;">-</span></td>
            </tr>
          </table>
        </div>
        <div id="loading" style="display:none">Loading...</div>
        <div id="modelList" style="display:none">
          <table id="modelsTable" class="display table table-bordered" cellspacing="0" width="100%" style="display:none">
            <thead>
              <tr>
                <th>Model</th>
                <th>Name</th>
                <th>Vendor</th>
                <th>Jpg Url</th>
                <th>Mjpg Url</th>
                <th>H264 Url</th>
              </tr>
            </thead>
          </table>
        </div>
      </section>
    </div>
    <?php include 'footer.php'; ?>
    <script src="/js/models.js"></script>
    <script>
      $(document).ready(function() {
        initModels();
      });
    </script>
  </body>
</html>
