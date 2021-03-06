var Notification = (function() {
  "use strict";

  var elem,
    hideHandler,
    that = {};

  that.init = function(selector) {
    elem = $(selector);
  };

  that.show = function(text) {
    clearTimeout(hideHandler);

    elem.find("div").html(text);
    elem.delay(200).fadeIn().delay(5000).fadeOut();
  };

  return that;
}());
