<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Evercam - Webcams, Public CCTV Cameras</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="keywords" content="cameras, public, cameras, apps, integration, recording, remote storage, sharing, api, developer platform">
    <meta name="description" content="Add remote storage, sharing, time-lapses, notifications, logs, access from any mobile device. ERP Integration - for Construction Site monitoring, Manufacturing, Weighbridge and more.">
    <meta name="author" content="Evercam">
    <!-- Bootstrap -->
    <link href="/css/main.css" rel="stylesheet">
    <link href="/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/public-google-map.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" async></script>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places,geometry"></script>
    <script src="/js/bootstrap.min.js" async></script>
    <script src="/js/custom.min.js" async></script>
    <script src="/js/notification.js"></script>
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
  <body id="public">
  <div id="wrapper">
    <!-- Sidebar -->
    <div id="sidebar-wrapper">
      <div class="sidebar-nav">
        <div class="search-container">
          <input id="pac-input" class="controls" type="text" placeholder="Search the map for Cameras">
        </div>
      </div>

      <div class="cameras-wrapper">
        <div id='cameras-count'><div class='cameras-count'></div></div>
        <div class='cameras-containers'></div>
      </div>

      <div class="sidebar-links">
        <div id="user-login" style="display:none">
          <span id="user-name"></span> | <a id="lnkLogout" href="javascript:void(0);">Logout</a>
          <span class="pull-right">
           <a id="lnkGoToEvercam" href="https://dash.evercam.io" target='_blank'>Camera Dashboard</a>
            <i class="fa fa-sign-in"></i>
          </span>
        </div>
      </div>
    </div>
    <!-- /#sidebar-wrapper -->

    <!-- Page Content -->
    <div id="page-content-wrapper">
      <div class="container-fluid">
        <div id="main-contents" class="row">

          <div id="public-map"></div>

          <div id="camera-single" style="display:none;">
            <a id="lnkBacktoMap" href="javascript:void(0);" title="Back to Map"><i class="fa fa-arrow-left"></i> Map</a>
            <a id="lnkAddtoAccount" class="add-to-account large" href="javascript:void(0);" title="Add to my account"><i class='fa fa-plus add-top-right large'></i></a>
            <div id="camera-image-container" class="row" style="background-image:url('/img/puff.svg'); background-position:center center; background-repeat:no-repeat;">
              <img id="camera-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
            </div>

            <div id="camera-details-container">
              <div class="col-md-6">
                <table class="details">
                  <tr>
                    <td>Name</td>
                    <td><span id="camera-name"></span></td>
                  </tr>
                  <tr>
                    <td>ID</td>
                    <td><span id="camera-id"></span></td>
                  </tr>
                  <tr>
                    <td>Owner</td>
                    <td><span id="camera-owner"></span></td>
                  </tr>
                  <tr>
                    <td>Vendor</td>
                    <td><span id="camera-vendor"></span></td>
                  </tr>
                  <tr>
                    <td>Model</td>
                    <td><span id="camera-model"></span></td>
                  </tr>
                  <tr>
                    <td>Created</td>
                    <td><span id="camera-created"></span></td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td><span id="camera-status"></span></td>
                  </tr>
                  <tr>
                    <td>Timezone</td>
                    <td><span id="camera-timezone"></span></td>
                  </tr>
                </table>
              </div>
              <div id="static-map-container" class="col-md-5 pull-right" >
                <img id="static-map" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>
              </div>
            </div>
          </div>

          <div id="myModal" class="modal fade">
            <div class="modal-dialog">
              <div id="sign-in" class="modal-content col-md-8">
                <div id="sign-in" class="col-md-4 col-md-offset-4" style="margin-top:30px;">
                  <h3 class="text-center">Sign in</h3>
                </div>
                <br/>
                <div class="modal-body">
                  <form role="form">
                    <div class="form-group">
                      <div class="grey col-md-8 col-md-offset-2 text-center">
                        <label for="username" class="control-label">Email or Username</label>
                        <div class="input-icon right">
                          <i class="icon-user"></i>
                          <input type="text" class="form-control" id="username">
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-md-8 col-md-offset-2 text-center">
                        <label for="password" class="margin-top-15 control-label">Password</label>
                        <div class="input-icon right">
                          <i class="icon-key"></i>
                          <input type="password" class="form-control" id="password">
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer" style="border-top:0; margin-top:60px;">
                      <div class="row">
                        <div class="col-md-8 col-md-offset-2">
                          <div class="sign-in">
                            <button type="button" id="singin" class="btn btn-grey-outline btn--inverted">Sign in</button>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-12 text-center">
                        <div class="grey margin-top-20">
                          <small>I've <a href="https://dash.evercam.io/v1/users/password-reset" target="_blank">forgotten my password</a></small>
                        </div>
                      </div>
                      <div class="col-md-12 text-center">
                        <div class="grey margin-top-20">
                          <small>Or <a href="https://dash.evercam.io/v1/users/signup" target="_blank">Create an account</a></small>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="home-link" style="position:absolute;right:46px;bottom:10px;"><!-- only temporary inline style-->
        <a class="navbar-brand" href="/"><img alt="evercam.io" src="/img/evercam-logo.svg"></a>
      </div>
    </div>
    <!-- /#page-content-wrapper -->
    <div class="alert alert-info bb-alert" style="display:none">
      <div></div>
    </div>
  </div>
  <!-- /#wrapper -->
  <script type="text/javascript" src="/min/?b=js&amp;f=public-google-maps.js,markerclusterer.js"></script>
  </body>
</html>
