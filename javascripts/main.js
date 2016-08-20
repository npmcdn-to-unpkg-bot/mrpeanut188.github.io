// Global variables
var $fb = $('a[data-fluidbox');
vpRatio; // To store viewport aspect ratio
// Add class to all Fluidboxes
$fb.addClass('fluidbox');
// Create fluidbox modal background
$('body').append('<div id="fluidbox-overlay"></div>');
// Functions:
// 1. to close any opened Fluidbox
// 2. to position Fluidbox dynamically
var closeFb = function() {
        $('a[data-fluidbox].fluidbox-opened').trigger('click');
    },
    positionFb = function($activeFb) {
        // Get elements
        var $img = $activeFb.find('img'),
            $ghost = $activeFb.find('.fluidbox-ghost');

        // Calculate offset and scale
        var offsetY = $(window).scrollTop() - $img.offset().top + 0.5 * ($img.data('imgHeight') * ($img.data('imgScale') - 1)) + 0.5 * ($(window).height() - $img.data('imgHeight') * $img.data('imgScale')),
            offsetX = 0.5 * ($img.data('imgWidth') * ($img.data('imgScale') - 1)) + 0.5 * ($(window).width() - $img.data('imgWidth') * $img.data('imgScale')) - $img.offset().left,
            scale = $img.data('imgScale');

        // Animate wrapped elements
        // Parse integers:
        // 1. Offsets can be integers
        // 2. Scale is rounded to nearest 2 decimal places     
        $ghost.css({
            'transform': 'translate(' + parseInt(offsetX * 10) / 10 + 'px,' + parseInt(offsetY * 10) / 10 + 'px) scale(' + parseInt(scale * 1000) / 1000 + ')'
        });
    }
    // The following events will force FB to close
    // ... when the opqaue overlay is clicked upon
$('#fluidbox-bg').click(closeFb);

$fb
    .wrapInner('<div class="fluidbox-wrap" />')
    .find('img')
    .css({
        opacity: 1
    })
    .after('<div class="fluidbox-ghost" />');

// Listen to resize event for calculations
$(window).resize(function() {

    // Get viewport aspect ratio (#1)
    vpRatio = $(window).width() / $(window).height();

    // Get dimensions and aspect ratios
    $fb.each(function() {
        var $img = $(this).find('img'),
            $ghost = $(this).find('.fluidbox-ghost'),
            $wrap = $(this).find('.fluidbox-wrap'),
            data = $img.data();

        // Save image dimensions as jQuery object (#2)
        data.imgWidth = $img.width();
        data.imgHeight = $img.height();
        data.imgRatio = $img.width() / $img.height();

        // Resize ghost element (#3)
        $ghost.css({
            width: $img.width(),
            height: $img.height(),
            top: $img.offset().top - $wrap.offset().top,
            left: $img.offset().left - $wrap.offset().left
        });

        // Calculate scale based on orientation (#4)
        if (vpRatio > data.imgRatio) {
            data.imgScale = $(window).height() * .95 / $img.height();
        } else {
            data.imgScale = $(window).width() * .95 / $img.width();
        }
    });
}).resize();

// Bind click event
$fb.click(function(e) {

    // Variables
    var $img = $(this).find('img'),
        $ghost = $(this).find('.fluidbox-ghost'),
        $wrap = $(this).find('.fluidbox-wrap');

    if ($(this).data('fluidbox-state') == 0 || !$(this).data('fluidbox-state')) {
        $(this)
            .data('fluidbox-state', 1)
            .removeClass('fluidbox-closed')
            .addClass('fluidbox-opened');
        // Show overlay
        $('#fluidbox-overlay').fadeIn();
        // Set thumbnail image source as background image first.
        // We also show the ghost element
        $ghost.css({
            'background-image': 'url(' + $img.attr('src') + ')',
            opacity: 1
        });
        // Hide original image
        $img.css({
            opacity: 0
        });

        // Preload ghost image
        var ghostImg = new Image();
        ghostImg.onload = function() {
            $ghost.css({
                'background-image': 'url(' + $activeFb.attr('href') + ')'
            });
        };
        ghostImg.src = $(this).attr('href');

        // Position Fluidbox
        positionFb($(this));
    } else {
        // Switch state
        $(this)
            .data('fluidbox-state', 0)
            .removeClass('fluidbox-opened')
            .addClass('fluidbox-closed');

        // Hide overlay
        $('#fluidbox-overlay').fadeOut();

        // Show original image
        $img.css({
            opacity: 1
        });

        // Hide ghost image
        $ghost.css({
            opacity: 0
        });

        // Reverse animation on wrapped elements
        $ghost
            .css({
                'transform': 'translate(0,0) scale(1)'
            })
            .one('webkitTransitionEnd MSTransitionEnd oTransitionEnd transitionend', function() {
                // Wait for transntion to run its course first
                $ghost.css({
                    opacity: 0
                });
            });
    }
});