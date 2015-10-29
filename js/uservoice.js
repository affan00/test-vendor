UserVoice=window.UserVoice||[];
(function(){
  var uv=document.createElement('script');
  uv.type='text/javascript';
  uv.async=true;
  uv.src='//widget.uservoice.com/dGFam0nitt3NGK1FXRaDw.js';
  var s=document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(uv,s)
})();

UserVoice.push(['set', {
  // Options can also be set on specific widgets instead of globally
  target: 'self', // 'none' for toaster popups, #id for a specific element on the page
  position: 'top', // Popover position
  height: '325px', // Widget height
  width: '100%', // Widget width
  accent_color: '#458dd6', // Widget accent color
  locale: 'en', // Defaults to your account’s localization
  forum_id: '209871', // Defaults to your account’s default forum
  smartvote_status_ids: [403280,403282], // Defaults to server-side settings
  smartvote_category_ids: [69243], // Defaults to all categories
  ticket_custom_fields: {
    'Product': 'Web App',
    'Type': 'Support Request'
  },
  contact_title: 'Anything we can do to support you?',
  smartvote_title: 'What should we add next?',
  contact_enabled: true,
  screenshot_enabled: true,
  smartvote_enabled: true,
  post_idea_enabled: false
}]);

UserVoice.push(['addTrigger', {
  // Options can also be set globally instead of on specific widgets
  trigger_style: 'icon', // icon or tab
  trigger_position: 'bottom-right',
  trigger_color: 'white',
  trigger_background_color: '#428BCA',
  trigger_prevent_default_enabled: true,
  mode: 'contact', // contact, smartvote, or satisfaction
  menu_enabled: true // Defaults to false for custom triggers, embedded widgets, autoprompts, and the show method
}]);
