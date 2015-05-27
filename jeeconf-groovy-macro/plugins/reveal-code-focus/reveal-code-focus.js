/*!
 * reveal-code-focus
 * Copyright 2015 Benjamin Tan <https://d10.github.io/>
 * Available under MIT license <https://github.com/d10/reveal-code-focus/blob/gh-pages/LICENSE.txt>
 */
window.RevealCodeFocus || (window.RevealCodeFocus = function (Reveal) {
    var currentSlide, currentFragments, prevSlideData = null;

    var forEach = function(array, callback) {
        var i = -1, length = array ? array.length : 0;
        while (++i < length) {
            callback(array[i]);
        }
    };

    function init(e) {
        var hljs_nodes = document.querySelectorAll('pre code');

        for (var i = 0, len = hljs_nodes.length; i < len; i++) {
            var element = hljs_nodes[i];

            // Split highlighted code into lines.
            element.innerHTML =
                element.innerHTML
                    .replace(/^(<[^>]+>)?/, function(_, html) {
                        if (html && ~html.indexOf('hljs-comment')) {
                            return html + '<span class=line>';
                        } else {
                            return '<span class=line>' + (html ? html : '');
                        }
                    })
                    .replace(/\n\n/g, function() {
                        return '\n&nbsp;\n';
                    })
                    .replace(/\n/g, '</span><span class=line>') + '</span>';
        }

        Reveal.addEventListener('slidechanged', updateCurrent);

        Reveal.addEventListener('fragmentshown', function(e) {
            highlightFragment(e.fragment);
        });

        Reveal.addEventListener('fragmenthidden', function(e) {
            var i = Array.prototype.indexOf.call(currentFragments, e.fragment);
            if (i == 0) {
                clearPreviousHighlights();
            } else {
                highlightFragment(currentFragments[i - 1]);
            }
        });

        updateCurrent(e);
    }

    function updateCurrent(e) {
        currentSlide = e.currentSlide;
        currentFragments = currentSlide.getElementsByClassName('fragment');
        clearPreviousHighlights();
        if (currentFragments.length) {
            if (prevSlideData && (prevSlideData.indexh > e.indexh || (prevSlideData.indexh == e.indexh && prevSlideData.indexv > e.indexv))) {
                forEach(currentFragments, function(fragment) {
                    fragment.classList.add('visible');
                });
                currentFragments[currentFragments.length - 1].classList.add('current-fragment');
                highlightFragment(currentFragments[currentFragments.length - 1]);
            }
        }
        prevSlideData = {
            'indexh': e.indexh,
            'indexv': e.indexv
        };
    }

    function clearPreviousHighlights() {
        forEach(currentSlide.querySelectorAll('pre code .line.defocus'), function(line) {
            line.classList.remove('defocus');
        });
    }

    function highlightFragment(fragment) {
        var lines = fragment.getAttribute('data-code-focus');

        if (lines) {
            forEach(currentSlide.querySelectorAll('pre code .line:not(.defocus)'), function(line) {
                line.classList.add('defocus');
            });
            var code = currentSlide.querySelectorAll('pre code .line');
            lines = lines.split(',');
            forEach(lines, function(line) {
                lines = line.split('-');
                for(var i = lines[0]; i <= lines[1]; i++) {
                    code[i - 1].classList.remove('defocus');
                }
            })
        } else {
            clearPreviousHighlights();
        }
    }
    
    if (Reveal.isReady()) {
        init({ currentSlide: Reveal.getCurrentSlide() });
        return;
    }

    Reveal.addEventListener('ready', function(e) {
        init(e);
    });

}(Reveal));