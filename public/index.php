<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Evercam -  Public cameras, vendors and models</title>
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
    <?php include '../nav.php'; ?>
    <div class="alt-color">
      <header>
        <div class="banner">
          <h1>Evercam Public Assets</h1>
          <h2><span style='word-wrap: break-word; '>Currently on Evercam, there are:</span></h2>
        </div>
      </header>
    </div>
    <div id="public-assets">
      <section style="padding-top:0px;">
        <div id="assetDetails">
          <h2>Public Cameras: <a href="/public/cameras"><span id="totalCameras">counting...</span></a></h2>
          <h2>Vendors: <a href="../vendors"><span id="totalVendors">counting...</span></a></h2>
          <h2>Models: <a href="../models"><span id="totalModels">counting...</span></a></h2>
        </div>
      </section>
    </div>
    <?php include '../footer.php'; ?>
    <script src="/js/assets.js"></script>
    <script>
      $(document).ready(function() {
        initAssets();
      });
    </script>
  </body>
</html>
