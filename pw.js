var sly;
var urlparams;
var activate = function(e) {
  $("body").addClass("activated");
  $(".content>ul>li>div").removeClass("expanded");
  sly.set("scrollBy", 1);
  sly.set("scrollSource", $("html"));
};

var expand = function(e) {
  $(e.target).parent().addClass("expanded");
  sly.set("scrollBy", 0);
  sly.set("scrollSource", null);
};
$(document).on('ready', function(e) {
  urlparams = location.search.substr(1).split("&").reduce( function( obj, val ){
    if( !val ) return obj;
    var pair = val.split("=");
    obj[pair[0]] = pair[1];
    return obj;
  }, {} );
  $(".content>ul>li>button").click(expand);

  sly = new Sly($(".content"), {
    slidee: ".content>ul", // Selector, DOM element, or jQuery object with DOM element representing SLIDEE.
    horizontal: true, // Switch to horizontal mode.

    // Item based navigation
    itemNav: 'forceCentered', // Item navigation type. Can be: 'basic', 'centered', 'forceCentered'.
    itemSelector: '.content>ul>li', // Select only items that match this selector.
    smart: true, // Repositions the activated item to help with further navigation.
    activateOn: "click", // Activate an item on this event. Can be: 'click', 'mouseenter', ...
    activateMiddle: true, // Always activate the item in the middle of the FRAME. forceCentered only.

    // Scrolling
    scrollSource: null, // Element for catching the mouse wheel scrolling. Default is FRAME.
    scrollBy: 0 , // Pixels or items to move per one mouse scroll. 0 to disable scrolling.
    scrollHijack: 300, // Milliseconds since last wheel event after which it is acceptable to hijack global scroll.
    scrollTrap: true, // Don't bubble scrolling when hitting scrolling limits.

    // Dragging
    dragSource: ".content", // Selector or DOM element for catching dragging events. Default is FRAME.
    mouseDragging: true, // Enable navigation by dragging the SLIDEE with mouse cursor.
    touchDragging: true, // Enable navigation by dragging the SLIDEE with touch events.
    releaseSwing: true, // Ease out on dragging swing release.
    swingSpeed: 0.2, // Swing synchronization speed, where: 1 = instant, 0 = infinite.
    elasticBounds: true, // Stretch SLIDEE position limits when dragging past FRAME boundaries.
    interactive: null, // Selector for special interactive elements.

    // Scrollbar
    scrollBar: null, // Selector or DOM element for scrollbar container.
    dragHandle: false, // Whether the scrollbar handle should be draggable.
    dynamicHandle: false, // Scrollbar handle represents the ratio between hidden and visible content.
    minHandleSize: 50, // Minimal height or width (depends on sly direction) of a handle in pixels.
    clickBar: false, // Enable navigation by clicking on scrollbar.
    syncSpeed: 0.5, // Handle => SLIDEE synchronization speed, where: 1 = instant, 0 = infinite.

    // Pagesbar
    pagesBar: null, // Selector or DOM element for pages bar container.
    activatePageOn: null, // Event used to activate page. Can be: click, mouseenter, ...
    pageBuilder: // Page item generator.
      function(index) {
      return '<li>' + (index + 1) + '</li>';
    },

    // Navigation buttons
    forward: null, // Selector or DOM element for "forward movement" button.
    backward: null, // Selector or DOM element for "backward movement" button.
    prev: null, // Selector or DOM element for "previous item" button.
    next: null, // Selector or DOM element for "next item" button.
    prevPage: null, // Selector or DOM element for "previous page" button.
    nextPage: null, // Selector or DOM element for "next page" button.

    // Automated cycling
    cycleBy: null, // Enable automatic cycling by 'items' or 'pages'.
    cycleInterval: 5000, // Delay between cycles in milliseconds.
    pauseOnHover: false, // Pause cycling when mouse hovers over the FRAME.
    startPaused: false, // Whether to start in paused sate.

    // Mixed options
    moveBy: 300, // Speed in pixels per second used by forward and backward buttons.
    speed: 300, // Animations speed in milliseconds. 0 to disable animations.
    easing: 'swing', // Easing for duration based (tweening) animations.
    startAt: 0, // Starting offset in pixels or items.
    keyboardNavBy: 1, // Enable keyboard navigation by 'items' or 'pages'.

    // Classes
    draggedClass: 'dragged', // Class for dragged elements (like SLIDEE or scrollbar handle).
    activeClass: 'active', // Class for active items and pages.
    disabledClass: 'disabled' // Class for disabled navigation elements.
  }).init();

  if(urlparams.page && urlparams.page != "intro" ){
    sly.activate($("#"+urlparams.page));
    setTimeout(activate,1000);
  }else{

    $('html').one("keypress click mousewheel DOMMouseScroll MozMousePixelScroll", activate);
  }
  sly.reload();

  $(".btn-contact").on("click", function(e) {
    console.log(sly.getIndex($("#contact")));
    sly.activate($("#contact"));
  });

  sly.on("active",function(e,i) {
    urlparams.page = sly.items[i].el.id;
    try {
      window.history.replaceState(sly.items[i].el.id, document.title, "?"+ $.param( urlparams ));
    } catch (e) {

    }
  });

  $(".content>ul>li>button").on("click", function(e) {
    $(e.delegateTarget).siblings(".process").addClass("expanded");
  });
  $(".content>ul>li>.process>.bg").on("click", function(e) {
    $(e.delegateTarget).parent().removeClass("expanded");
  });
});
$(window).resize(function(e) {
  sly.reload();
});
