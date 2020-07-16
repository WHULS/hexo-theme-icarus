/* eslint-disable node/no-unsupported-features/node-builtins */
(function ($, moment, ClipboardJS, config) {

    // 执行匿名函数注册点击事件
    (function (window, document, undefined) { // 传入window，document对象
        var currentWords = [];
        var words = ["武汉大学", "自强", "弘毅", "求是", "拓新", "遥感信息工程学院", "笃志", "敦行", "和协", "拓新"];
        var index = 0;

        // 定义不同浏览器下的requestAnimationFrame函数实现，如果都没有，则用setTimeout实现
        window.requestAnimationFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    setTimeout(callback, 1000 / 60);
                }
        })();

        init(); // 执行初始化函数

        // 定义初始化函数
        function init() {
            css(".float-word{z-index:9999;font-size:0.8em;position:fixed;font-weight:bold;user-select:none;}")
            attachEvent(); // 添加点击事件（爱心生成）
            gameloop(); // 开始循环移除爱心（内含递归）
        }

        // 定义循环函数移除生成的文字
        function gameloop() {
            for (var i = 0; i < currentWords.length; i++) { // 循环hearts数组
                if (currentWords[i].alpha <= 0) { // 如果当前循环的heart对象的透明度为0或小于0
                    document.body.removeChild(currentWords[i].el); // 从body对象中移除当前循环的heart对象（通过指针）
                    currentWords.splice(i, 1); // 从heart数组中移除当前循环的heart对象（通过下标）
                    continue; // 跳过当前循环，进入下一个循环
                }
                currentWords[i].y--; // y轴自减1
                currentWords[i].scale += 0.004; // 缩放增加0.004
                currentWords[i].alpha -= 0.013; // 透明度减少0.013
                currentWords[i].el.style.cssText = "left:" + currentWords[i].x + "px;top:" + currentWords[i].y + "px;opacity:" + currentWords[i].alpha + ";transform:scale(" + currentWords[i].scale + "," + currentWords[i].scale + ");color:" + currentWords[i].color;
            }
            requestAnimationFrame(gameloop); // 定时器定时执行，递归
        }

        // 定义点击事件函数
        function attachEvent() {
            var old = typeof window.onclick === "function" && window.onclick;
            window.onclick = function (event) {
                old && old();
                createHeart(event);
            }
        }

        // 定义创建爱心函数
        function createHeart(event) {
            var d = document.createElement("div"); // 创建一个div对象并赋值给变量d
            d.className = 'float-word';
            d.innerText = words[index++ % words.length]
            currentWords.push({ // 给hearts数组添加heart对象
                el: d, // div对象
                x: event.clientX - 5, // 鼠标当前位置x轴 - 5
                y: event.clientY - 5, // 鼠标当前位置y轴 - 5
                scale: 1, // 缩放
                alpha: 1, // 透明度
                color: randomColor() // 颜色（随机颜色）
            });
            document.body.appendChild(d); // 添加创建的div对象到body对象
        }

        // 定义生成样式函数
        function css(css) {
            var style = document.createElement("style"); // 创建一个style对象并赋值给变量style
            style.type = "text/css"; // 给style对象添加属性并赋属性值
            try {
                style.appendChild(document.createTextNode(css));
            } catch (ex) {
                style.styleSheet.cssText = css;
            }
            document.getElementsByTagName('head')[0].appendChild(style); // 添加创建的style对象到head对象
        }

        // 定义生成随机颜色函数
        function randomColor() {
            return "rgb(" + (~~(Math.random() * 255)) + "," + (~~(Math.random() * 255)) + "," + (~~(Math.random() * 255)) + ")";
        }
    })(window, document);

    $('.article img:not(".not-gallery-item")').each(function () {
        // wrap images with link and add caption if possible
        if ($(this).parent('a').length === 0) {
            $(this).wrap('<a class="gallery-item" href="' + $(this).attr('src') + '"></a>');
            if (this.alt) {
                $(this).after('<p class="has-text-centered is-size-6 caption">' + this.alt + '</p>');
            }
        }
    });

    if (typeof $.fn.lightGallery === 'function') {
        $('.article').lightGallery({ selector: '.gallery-item' });
    }
    if (typeof $.fn.justifiedGallery === 'function') {
        if ($('.justified-gallery > p > .gallery-item').length) {
            $('.justified-gallery > p > .gallery-item').unwrap();
        }
        $('.justified-gallery').justifiedGallery();
    }

    if (!$('.columns .column-right-shadow').children().length) {
        $('.columns .column-right-shadow').append($('.columns .column-right').children().clone());
    }

    if (typeof moment === 'function') {
        $('.article-meta time').each(function () {
            $(this).text(moment($(this).attr('datetime')).fromNow());
        });
    }

    $('.article > .content > table').each(function () {
        if ($(this).width() > $(this).parent().width()) {
            $(this).wrap('<div class="table-overflow"></div>');
        }
    });

    function adjustNavbar() {
        const navbarWidth = $('.navbar-main .navbar-start').outerWidth() + $('.navbar-main .navbar-end').outerWidth();
        if ($(document).outerWidth() < navbarWidth) {
            $('.navbar-main .navbar-menu').addClass('justify-content-start');
        } else {
            $('.navbar-main .navbar-menu').removeClass('justify-content-start');
        }
    }
    adjustNavbar();
    $(window).resize(adjustNavbar);

    function toggleFold(codeBlock, isFolded) {
        const $toggle = $(codeBlock).find('.fold i');
        !isFolded ? $(codeBlock).removeClass('folded') : $(codeBlock).addClass('folded');
        !isFolded ? $toggle.removeClass('fa-angle-right') : $toggle.removeClass('fa-angle-down');
        !isFolded ? $toggle.addClass('fa-angle-down') : $toggle.addClass('fa-angle-right');
    }

    function createFoldButton(fold) {
        return '<span class="fold">' + (fold === 'unfolded' ? '<i class="fas fa-angle-down"></i>' : '<i class="fas fa-angle-right"></i>') + '</span>';
    }

    $('figure.highlight table').wrap('<div class="highlight-body">');
    if (typeof config !== 'undefined'
        && typeof config.article !== 'undefined'
        && typeof config.article.highlight !== 'undefined') {

        $('figure.highlight').addClass('hljs');
        $('figure.highlight .code .line span').each(function () {
            const classes = $(this).attr('class').split(/\s+/);
            if (classes.length === 1) {
                $(this).addClass('hljs-' + classes[0]);
                $(this).removeClass(classes[0]);
            }
        });


        const clipboard = config.article.highlight.clipboard;
        const fold = config.article.highlight.fold.trim();

        $('figure.highlight').each(function () {
            if ($(this).find('figcaption').length) {
                $(this).find('figcaption').addClass('level is-mobile');
                $(this).find('figcaption').append('<div class="level-left">');
                $(this).find('figcaption').append('<div class="level-right">');
                $(this).find('figcaption div.level-left').append($(this).find('figcaption').find('span'));
                $(this).find('figcaption div.level-right').append($(this).find('figcaption').find('a'));
            } else {
                if (clipboard || fold) {
                    $(this).prepend('<figcaption class="level is-mobile"><div class="level-left"></div><div class="level-right"></div></figcaption>');
                }
            }
        });

        if (typeof ClipboardJS !== 'undefined' && clipboard) {
            $('figure.highlight').each(function () {
                const id = 'code-' + Date.now() + (Math.random() * 1000 | 0);
                const button = '<a href="javascript:;" class="copy" title="Copy" data-clipboard-target="#' + id + ' .code"><i class="fas fa-copy"></i></a>';
                $(this).attr('id', id);
                $(this).find('figcaption div.level-right').append(button);
            });
            new ClipboardJS('.highlight .copy'); // eslint-disable-line no-new
        }

        if (fold) {
            $('figure.highlight').each(function () {
                if ($(this).find('figcaption').find('span').length > 0) {
                    const span = $(this).find('figcaption').find('span');
                    if (span[0].innerText.indexOf('>folded') > -1) {
                        span[0].innerText = span[0].innerText.replace('>folded', '');
                        $(this).find('figcaption div.level-left').prepend(createFoldButton('folded'));
                        toggleFold(this, true);
                        return;
                    }
                }
                $(this).find('figcaption div.level-left').prepend(createFoldButton(fold));
                toggleFold(this, fold === 'folded');
            });

            $('figure.highlight figcaption .fold').click(function () {
                const $code = $(this).closest('figure.highlight');
                toggleFold($code.eq(0), !$code.hasClass('folded'));
            });
        }
    }

    const $toc = $('#toc');
    if ($toc.length > 0) {
        const $mask = $('<div>');
        $mask.attr('id', 'toc-mask');

        $('body').append($mask);

        function toggleToc() { // eslint-disable-line no-inner-declarations
            $toc.toggleClass('is-active');
            $mask.toggleClass('is-active');
        }

        $toc.on('click', toggleToc);
        $mask.on('click', toggleToc);
        $('.navbar-main .catalogue').on('click', toggleToc);
    }

    // hexo-util/lib/is_external_link.js
    function isExternalLink(input, sitehost, exclude) {
        try {
            sitehost = new URL(sitehost).hostname;
        } catch (e) { }

        if (!sitehost) return false;

        // handle relative url
        let data;
        try {
            data = new URL(input, 'http://' + sitehost);
        } catch (e) { return false; }

        // handle mailto: javascript: vbscript: and so on
        if (data.origin === 'null') return false;

        const host = data.hostname;

        if (exclude) {
            exclude = Array.isArray(exclude) ? exclude : [exclude];

            if (exclude && exclude.length) {
                for (const i of exclude) {
                    if (host === i) return false;
                }
            }
        }

        if (host !== sitehost) return true;

        return false;
    }

    if (typeof config !== 'undefined'
        && typeof config.site.url !== 'undefined'
        && typeof config.site.external_link !== 'undefined'
        && config.site.external_link.enable) {
        $('.article .content a').filter((i, link) => {
            return link.href
                && !$(link).attr('href').startsWith('#')
                && link.classList.length === 0
                && isExternalLink(link.href,
                    config.site.url,
                    config.site.external_link.exclude);
        }).each((i, link) => {
            link.relList.add('noopener');
            link.target = '_blank';
        });
    }
}(jQuery, window.moment, window.ClipboardJS, window.IcarusThemeSettings));
