var $$ = $.fn;

$$.extend({
  SplitID : function()
  {
    return this.attr('id').split('-').pop();
  },

  Slideshow : {
    Ready : function()
    {
      $('div.tmpSlideshowControl')
        .hover(
          function() {
            $(this).addClass('tmpSlideshowControlOn');
          },
          function() {
            $(this).removeClass('tmpSlideshowControlOn');
          }
        )
        .click(
          function() {
            $$.Slideshow.Interrupted = false;
			$$.Slideshow.Counter = parseInt(this.id.substring(this.id.length-1));
            $('div.tmpSlide').hide();
            $('div.tmpSlideshowControl').removeClass('tmpSlideshowControlActive');
            $('div#tmpSlide-' + $(this).SplitID()).show()
            $(this).addClass('tmpSlideshowControlActive');
            clearTimeout(m);
            $$.Slideshow.Transition();
          }
        );

      this.Counter = 1;
      this.Interrupted = false;

      this.Transition();
    },

    Transition : function()
    {
      if (this.Interrupted) {
        return;
      }

      this.Last = this.Counter - 1;

      if (this.Last < 1) {
        this.Last = 4;
      }

      $('div#tmpSlide-' + this.Last).fadeOut(
        'slow',
        function() {
          $('div#tmpSlideshowControl-' + $$.Slideshow.Last).removeClass('tmpSlideshowControlActive');
          $('div#tmpSlideshowControl-' + $$.Slideshow.Counter).addClass('tmpSlideshowControlActive');
          $('div#tmpSlide-' + $$.Slideshow.Counter).fadeIn('slow');

          $$.Slideshow.Counter++;

          if ($$.Slideshow.Counter > 4) {
            $$.Slideshow.Counter = 1;
          }

          m =setTimeout('$$.Slideshow.Transition();', 4000);
        }
      );
    }
  }
});

$(document).ready(
  function() {
    $$.Slideshow.Ready();
  }
);