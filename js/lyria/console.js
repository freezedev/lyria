;(function(Lyria, $, undefined) {
  
  Lyria.Console = Lyria.Base.extend({
    /**
     *
     */
    init: function() {
      
      $('body').append('<div id="console" style="display: none;"><div class="message-container"></div><div class="close-btn-24"></div></div>');
  
      $('#console').on('click', '.close-btn-24', function(event) {
        Lyria.Console.hide();
      });
    },
    /**
     *
     * @param {string} msg
     */
    log: function(msg, className) {
      if($('#console').length === 0) {
        Lyria.Console.init();
      }
  
      if(!$('#console').is(':visible')) {
        Lyria.Console.show();
      }
  
      if(!className) {
        className = "";
      }
  
      $('#console .message-container').append('<span class="message">' + msg + ' ' + className + '</span>');
    },
    /**
     *
     */
    show: function() {
      $('#console').fadeIn(Lyria.Constants.animSpeed);
    },
    /**
     *
     */
    hide: function() {
      $('#console').fadeOut(Lyria.Constants.animSpeed);
    }
  });
  
})(this.Lyria = this.Lyria || {}, this.jQuery)
