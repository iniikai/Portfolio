(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(require());
    } else {
        root.stickMe = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
  
  /**
   * Variables
   */
  
  var stickMe = {};
  var supports = !!document.querySelector && !!root.addEventListener;
  var settings;
  
  // Default settings
  var defaults = {
    element              : "js-sticky",
    wrapper              : "js-stickyWrapper",
    classNameSticky      : "is-sticky",
    classNameSunk        : "is-sunk",
    classNameSunkWrapper : "is-sunk-wrapper",
    offset               : 48
  };
  
  
  //
  // Methods
  //
  
  /**
   * Handle events
   * @private
   * @param {event} Event
   */
  var eventHandler = function ( event ) {
    
    // On scroll
    if ( event.type === "scroll" ) {
      
      // Debounce scroll and trigger stickyness
      handleScrollEvents();
      
    }
    
  };
  
  /**
   * Handle scroll events efficiently
   * @private
   */
  var handleScrollEvents = function () {
    
    var latestKnownScrollY = 0,
        ticking = false;

    function onScroll() {
      latestKnownScrollY = window.scrollY;
      requestTick();
    }

    function requestTick() {
      if ( !ticking ) {
        requestAnimationFrame( update );
      }
      ticking = true;
    }

    function update() {
      // reset the tick so we can
      // capture the next onScroll
      ticking = false;

      var currentScrollY = latestKnownScrollY;
      
      // Activate the stickyness
      activate( currentScrollY );
    }
    
    onScroll();
   
  };
  
  /**
   * Extend defaults with user options
   * @private
   * @param {object} source
   * @param {object} properties
   */
  var extendDefaults = function ( source, properties ) {
    var property;

    for ( property in properties ) {

      if ( properties.hasOwnProperty( property ) ) {
        source[property] = properties[property];
      }

    }

    return source;
  };
  
  /**
   * Get top and left position of element
   * @private
   * @param {node} element
   */
  var getOffset = function ( element ) {

    element = element.getBoundingClientRect();

    return {
      left: element.left + window.scrollX,
      top: element.top + window.scrollY
    }
  }
  
  /**
   * Stick element in place
   * @private
   * @param {node} element
   */
  var stick = function ( element ) {
    var width = element.offsetWidth;
    //var width = getRectangle( element ).width;
    
    element.classList.add( settings.classNameSticky );
    
    css( element, {
      top: settings.offset + "px",
      width: width + "px"
    });
  }
  
  /**
   * Unstick our stuck element
   * @private
   * @param {node} element
   */
  var unStick = function ( element ) {
    element.classList.remove( settings.classNameSticky );
    element.style.top = "";
    element.style.width = "";
  }
  
  /**
   * Sink element to bottom of wrapper
   * @private
   * @param {node} element
   * @param {node} wrapper
   */
  var sink = function ( element, wrapper ) {
    element.classList.add( settings.classNameSunk );
    wrapper.classList.add( settings.classNameSunkWrapper );
  }
  
  /**
   * Unsink our sunk element
   * @private
   * @param {node} element
   * @param {node} wrapper
   */
  var unSink = function ( element, wrapper ) {
    element.classList.remove( settings.classNameSunk );
    wrapper.classList.remove( settings.classNameSunkWrapper );
  }
  
  /**
   * Activate stickyness
   * @private
   * @param {string} position Scroll position
   */
  var activate = function ( position ) {
    
    var wrappers = document.getElementsByClassName( settings.wrapper );

    for ( var i = 0; i < wrappers.length; i++ ) {
      var wrapper = wrappers[i];
      var element = wrapper.querySelector( '.' + settings.element );

      if ( !element ) continue;

      var height  = wrapper.offsetHeight - element.offsetHeight,
          top     = getOffset( wrapper ).top,
          bottom  = ( top + height ) - settings.offset,
          start   = top - settings.offset; 

      if ( position >= start ) {

        if ( position >= bottom ) {
          
          unStick( element );
          sink( element, wrapper );

        } else {
          
          stick( element );
          unSink( element, wrapper );
          
        }

      } else {

        unStick( element );
        unSink( element, wrapper );

      }
    }
    
  }
  
  /**
   * A helper function for adding/remove CSS properties
   * @private
   * @param {node} element
   * @param {object} properties
   */
  var css = function ( element, properties ) {
    
    for ( var property in properties ) {
      
      if ( properties.hasOwnProperty( property ) ) {
        
        element.style[ property ] = properties[ property ];
        
      }
      
    }
    
  };
  
  /**
   * A function that returns element width, height, top, and left
   * @private
   * @param {node} element
   * @return {object}
   */
  var getRectangle = function ( element ) {
    
    css( element, { position: '', width: '', top: '', left: '' } );

    var width = Math.max( element.offsetWidth, element.clientWidth, element.scrollWidth );
    var height = Math.max( element.offsetHeight, element.clientHeight, element.scrollHeight );

    var top = 0;
    var left = 0;

    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while ( element );

    return { top: top, left: left, width: width, height: height };
  };
  
  /**
   * Destroy current initialisation
   * @public
   */
  stickMe.destroy = function () {
    
    // If sticky isn't already initialised, stop
    if ( !settings ) return;
    
    // @todo Undo any other init functions...
    
    // Remove event listeners
    window.removeEventListener( "scroll", eventHandler, false );
    
    // Reset variables
    settings = null;
    
  };
  
  /**
   * Initialise plugin
   * @public
   * @param {Object} options User settings
   */
  stickMe.init = function ( options ) {
    
    // feature test
    if ( !supports ) return;
    
    // Destroy any existing initialisations
    stickMe.destroy();
    
    // Extend defaults with user options
    settings = extendDefaults( defaults, options || {} );
    
    // @todo Do stuff...
    
    // Listen for scroll events
    window.addEventListener( "scroll", eventHandler, false );
    
  };
  
  
  //
  // Public APIs
  //
  
  return stickMe;
  
});



/**
 * Example Usage
 */

stickMe.init({ 
  offset: 48
});