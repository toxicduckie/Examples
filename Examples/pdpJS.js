!(function (c) {
    (c.pdp = function (e, t) {
        var i = c(e),
            s = c.extend({ product: c.pdp.global.product, sharedTemplates: c.pdp.global.templates, domain: c.pdp.global.domain }, c.pdp.defaults, t),
            d = (s.namespace, "ontouchstart" in window || (window.DocumentTouch && (document, DocumentTouch)), {});
        c.data(e, "pdp", i),
            (d = {
                init: function () {
                    (i.containerSelector = s.selector),
                        (i.container = c(i).findDescendantsAndSelf(i.containerSelector)),
                        d.bindGlobalInteractions(),
                        document.addEventListener("pdpchange", d.change, !0),
                        document.addEventListener("pdpupdate", d.update, !0),
                        document.addEventListener("pdprender", d.render, !0),
                        s.redrawOnResize && document.addEventListener("pdpresize", d.render, !0),
                        s.redrawOnFilter && document.addEventListener("pdpfilter", d.render, !0),
                        d.render({ detail: s.product });
                },
                render: function (e) {
                    var t = null;
                    (t = null == e.detail || null == e.detail ? c.extend({}, s.product) : c.extend({}, e.detail)).time = new Date();
                    var n = null;
                    s.debug && (n = d.timer(i.attr("id"))),
                        "function" == typeof s.renderer
                            ? s.renderer.call(i, i.container, s.templates, t)
                            : ((e = d.applyTemplate(s.templates.main.toString(), t)), (e = d.convertHTMLToJQ(e)), (e = d.buildRepeaters(e, t)), (e = d.bindInteractions(e)), i.container.empty().append(e)),
                        s.logExternal || null == n || ((n = n.stop()), d.logRenderMetric(i.attr("id"), n, t.sku, "automatic", 0)),
                        (s.logExternal = !1),
                        d.restoreContext();
                },
                applyTemplate: function (e, t) {
                    return d.replaceMarkup(t, e);
                },
                buildRepeaters: function (a, l) {
                    return (
                        a instanceof jQuery || (a = d.convertHTMLToJQ(a)),
                        c(a)
                            .find(".repeater[data-source]")
                            .each(function () {
                                var e = c(this).html(),
                                    t = null;
                                if ((t = l[this.dataset.source]) && t.values && 0 < t.values.length)
                                    for (var n = 0; n < t.values.length; n++) {
                                        var o = c.extend({ id: t.group + "-" + n }, t.values[n]),
                                            i = d.replaceMarkup(t, e.toString(), "src"),
                                            i = d.replaceMarkup(o, i, "rpt");
                                        (i = c(i)), (i = d.buildRepeaters(i, t)), c(this).before(i), t.selectedVal == o.value && (c(a).find("#" + o.id)[0].checked = !0);
                                    }
                                c(this).remove();
                            }),
                        c(a)
                    );
                },
                buildOptionListHTML: function (e, t, n) {
                    (t = t || "u"), (n = n || 0);
                    var o = "";
                    if (e && e.options) {
                        for (var i = 0; i < e.options.length; i++) {
                            var a,
                                l = "",
                                r = {},
                                r = c.extend(
                                    {
                                        id: t + e.segment + "-" + (e.options[i].ValueType || "") + "-" + (i + n),
                                        group: t + e.segment,
                                        seg: e.segment,
                                        selected: e.selectedValue && e.selectedValue.value == e.options[i].value ? "checked='checked'" : "",
                                    },
                                    e.options[i]
                                ),
                                l = d.replaceMarkup(r, s.sharedTemplates.option.template, "rpt");
                            o += l = r.image
                                ? ((r.imageURL = s.domain + "/_images/catalog/" + ("FINISH" == e.displayType ? "finish-images" : "fabric-images") + "/" + r.image + "?impolicy=crop"),
                                  "loading" === document.readyState && i + ("desktop" == c.pdp.global.mode ? n : 0) > ("desktop" == c.pdp.global.mode ? 30 : 7)
                                      ? ((r.imageSrc = "/_global/images/transparent.png"), (r.lazy = "lazySwatch"))
                                      : ((r.imageSrc = r.imageURL), (r.lazy = "")),
                                  (a = d.replaceMarkup(r, s.sharedTemplates.optionImage.template, "opt")),
                                  l.replace("{" + s.sharedTemplates.optionImage.key + "}", a))
                                : l.replace("{" + s.sharedTemplates.optionImage.key + "}", "");
                        }
                        o = (o = o.replace(/{rpt.ColorFamily}/g, "")).replace(/{rpt.Favorite}/g, "");
                    }
                    return o;
                },
                buildSelectionCardHTML: function (e, t, n, o) {
                    (t = t || "u"), "boolean" != typeof n && (n = !1), "boolean" != typeof o && (o = !1);
                    var i = e.displayType.toLowerCase(),
                        a = "";
                    return (
                        (a = (a = (a = (a = (a = (a = (a = (a = (a = (a = (a = d.replaceMarkup(e, s.sharedTemplates.selectionCard.template, "opt")).replace(
                            /{opt.selectedName}/g,
                            e.selectedValue.FabricFamily || e.selectedValue.name
                        )).replace(/{opt.selectedValue.value}/g, e.selectedValue.value)).replace(/{opt.anchorLink}/g, (e.selectedValue.skuSetType || "p") + e.segment.toString())).replace(
                            /{opt.fav}/g,
                            e.selectedValue.Favorite ? " checked='checked' " : ""
                        )).replace(/{opt.Color}/g, e.selectedValue.Color)).replace(/{opt.popupClass}/g, "finish" == i ? "popupFinishInfo" : "popupFabricInfo")).replace(
                            /{opt.displayTypeClass}/g,
                            "other" == i ? "redBorder" : "dropShadow"
                        )).replace(/{opt.popupDataType}/g, o ? "empty" : "finish" == i ? "finishdesc" : "fabsku")).replace(/{opt.popupDataValue}/g, "finish" == i ? e.selectedValue.name : e.selectedValue.value)).replace(
                            /{opt.listType}/g,
                            t
                        )),
                        (a = e.selectedValue.image
                            ? (a = (a = a.replace(/{opt.imageSrc}/g, s.domain + "/_images/catalog/" + ("finish" == i ? "finish-images" : "fabric-images") + "/" + e.selectedValue.image + "?impolicy=crop")).replace(
                                  /{opt.imageURL}/g,
                                  ""
                              )).replace(/{opt.lazy}/g, "")
                            : o
                            ? a.replace(/{opt.imageSrc}/g, "/_global/images/transparent.png")
                            : a.replace(/{opt.imageSrc}/g, "")),
                        (a = c(a)),
                        e.selectedValue.image || o || a.find(".jsCardImage").remove(),
                        (e.showOnWeb && n && !o) || a.find(".jsEditOption").remove(),
                        ("other" != i && "finish" != i && "Y" == e.selectedValue.SwatchAvailable) || a.find(".jsOrderSwatch").remove(),
                        (n || o || "other" == i || "finish" == i) && a.find(".jsFavCtrl").remove(),
                        e.selectedValue.Color || a.find(".jsFabColor").remove(),
                        a.get(0).outerHTML
                    );
                },
                replaceMarkup: function (e, t, n) {
                    null == n && (n = "p");
                    for (var o, i = Object.getOwnPropertyNames(e), a = 0; a < i.length; a++) (o = new RegExp("{" + n + "." + i[a] + "}", "g")), (t = t.replace(o, e[i[a]]));
                    return t;
                },
                bindGlobalInteractions: function () {
                    if (0 < s.globalInteractions.length)
                        for (var e = 0; e < s.globalInteractions.length; e++)
                            null != c.fn.on
                                ? c(i).on(s.globalInteractions[e].selector, s.globalInteractions[e].event, null, i, s.globalInteractions[e].callback)
                                : c(i).delegate(s.globalInteractions[e].selector, s.globalInteractions[e].event, i, s.globalInteractions[e].callback);
                },
                bindInteractions: function (e) {
                    if ((e instanceof jQuery || (e = d.convertHTMLToJQ(e)), 0 < s.interactions.length))
                        for (var t = 0; t < s.interactions.length; t++)
                            null != c.fn.on
                                ? e.findDescendantsAndSelf(s.interactions[t].selector).on(s.interactions[t].event, null, i, s.interactions[t].callback)
                                : e.findDescendantsAndSelf(s.interactions[t].selector).bind(s.interactions[t].event, i, s.interactions[t].callback);
                    return e;
                },
                tryFocus: function (e) {
                    var t = !1,
                        n = void 0,
                        o = e.attr("name"),
                        n = e.val();
                    if ((null != o && null != n && (e = c("input[name='" + o + "'][value='" + n + "']")), e.is(":hidden") || e.is(":disabled"))) return !1;
                    (n = +e.attr("tabindex")), (n = isNaN(n) ? -1 : n);
                    return (t = e.is(":input, a[href], area[href], iframe") || -1 < n) && e.focus(), t;
                },
                pdpScroll: function (e) {
                    var t, n;
                    (c("#pdpDrawerToggle")[0].checked = !1),
                        pdpSticky(),
                        0 < c(e).length &&
                            ((n = (n = 0) < c(".ctaMobile").length ? c("#pdpCTA").height() + c("#pdpDrawerKnob").height() : c("#pdpCTA").height() + c("#pdpSocial").height() + c("#pdpDrawerKnob").height()),
                            c(e).is(":visible") ? (t = c(e).offset().top + (0 - n)) : c(e).is(":radio") && ((c(e)[0].checked = !0), (t = c(e).parent().offset().top + (0 - n))),
                            c("html,body").animate({ scrollTop: t }, 800));
                },
                convertHTMLToJQ: function (e) {
                    return null != c.parseHTML ? c(c.parseHTML(e)) : c(e);
                },
                imagesLoaded: function (e, t, n, o) {
                    let i = !0,
                        a = c("img", e);
                    void 0 === o && (o = 1);
                    for (var l = 0; l < a.length && ((i = i && c(a[l])[0].complete), !t); l++);
                    i || 10 <= o
                        ? n()
                        : window.setTimeout(function () {
                              d.imagesLoaded(e, t, n, o);
                          }, 100);
                },
                change: function (e) {
                    if (null == e.detail || null == e.detail) throw "change should be given a product object to disseminate to all instances";
                    (s.product = e.detail), (s.pageLoad = 0);
                },
                promiseUpdate: function () {},
                update: function (e) {
                    var n = "update";
                    c.isEmptyObject(s.product) && (n = "init");
                    var o = null;
                    s.debug && (o = d.timer(i.attr("id"))),
                        c.ajax({
                            type: "POST",
                            url: window.location.href,
                            beforeSend: function (e) {
                                e.setRequestHeader("x-pdp-action", n);
                            },
                            data: JSON.stringify({ product: { sku: s.product.sku, id: s.product.id, selectedOptions: s.product.selectedOptions, kitPieces: s.product.kitPieces || null }, sync: 0 }),
                            contentType: "application/json",
                            dataType: "json",
                            timer: o,
                            success: function (e) {
                                var t;
                                null != this.timer && ((t = o.stop()), d.logRenderMetric("RenderingEngine-WS-Post (" + n + ")", t, s.product.sku, "automatic", 0));
                                e = JSON.parse(e.d);
                                "SUCCESS" == e.result ? (document.dispatchEvent(new CustomEvent("pdpchange", { detail: e.data.product })), document.dispatchEvent(new CustomEvent("pdprender", { detail: e.data.product }))) : d.log("error");
                            },
                            error: function (e) {
                                d.log("error");
                            },
                        });
                },
                logRenderMetric: function (e, t, n, o, i, a, l) {
                    (o = o || null),
                        (i = i || 0),
                        (a = a || s.pageLoad),
                        (l && "" != l) || (l = !1),
                        c.ajax({
                            type: "POST",
                            url: window.location.pathname,
                            beforeSend: function (e) {
                                e.setRequestHeader("x-pdp-action", "metric");
                            },
                            data: JSON.stringify({ section: e, renderTime: t, sku: n, userAgent: navigator.userAgent, mode: o, sync: i, pageLoad: a }),
                            contentType: "application/json",
                            dataType: "json",
                            stressTest: l,
                            success: function (e) {
                                "SUCCESS" == JSON.parse(e.d).result || d.log("logRenderMetric: error");
                            },
                            error: function (e) {
                                d.log("logRenderMetric: error");
                            },
                        });
                },
                sync: function (e) {
                    document.dispatchEvent(new CustomEvent("pdpchange", { detail: s.product })), d.storeContext(e), d.update();
                },
                storeContext: function (e) {
                    if (((s.context = []), "object" == typeof e))
                        if (Array.isArray(e)) for (var t = 0; t < e.length; t++) s.context.push(e[t]);
                        else s.context.push(e);
                    s.context.push(i.container);
                },
                restoreContext: function () {
                    if (Array.isArray(s.context)) for (var e = 0; e < s.context.length && !d.tryFocus(c(s.context[e])); e++);
                    s.context = void 0;
                },
                logExternally: function () {
                    s.logExternal = !0;
                },
                getTearsheetUrl: function (t) {
                    var e = "";
                    1 == c("#hfOutwardImage").length && "" != c("#hfOutwardImage").val() && (e = c("#hfOutwardImage").val()),
                        c.ajax({
                            type: "POST",
                            url: window.location.pathname,
                            beforeSend: function (e) {
                                e.setRequestHeader("x-pdp-action", "tearsheet");
                            },
                            data: JSON.stringify({ product: { sku: s.product.sku, id: s.product.id, selectedOptions: s.product.selectedOptions, kitPieces: s.product.kitPieces || null }, sync: 0, owCartImage: e }),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (e) {
                                e = JSON.parse(e.d);
                                "SUCCESS" == e.result && "https://" == e.data.substring(0, 8) && "function" == typeof t ? t(e.data) : (d.log("getTearsheetUrl: error"), "function" == typeof tearsheetError && tearsheetError());
                            },
                            error: function (e) {
                                d.log("getTearsheetUrl: error"), "function" == typeof tearsheetError && tearsheetError();
                            },
                        });
                },
                timer: function (e) {
                    var t = new Date();
                    return {
                        stop: function () {
                            return new Date().getTime() - t.getTime();
                        },
                    };
                },
                log: function (e) {
                    s.debug && console.log(e);
                },
            }),
            (i.getProduct = function () {
                return c.extend({}, s.product);
            }),
            (i.setProduct = function (e, t) {
                (s.product = c.extend({}, e)), d.sync(t);
            }),
            (i.replaceMarkup = d.replaceMarkup),
            (i.buildRepeaters = d.buildRepeaters),
            (i.buildOptionListHTML = d.buildOptionListHTML),
            (i.buildSelectionCardHTML = d.buildSelectionCardHTML),
            (i.bindInteractions = d.bindInteractions),
            (i.imagesLoaded = d.imagesLoaded),
            (i.pdpScroll = d.pdpScroll),
            (i.getTearsheetUrl = d.getTearsheetUrl),
            (i.logRenderMetric = d.logRenderMetric),
            (i.logExternally = d.logExternally),
            (i.timer = d.timer),
            d.init();
    }),
        (c.pdp.defaults = {
            namespace: "pdp-",
            selector: ".pdp-section",
            debug: !0,
            templates: { main: "", additional: {} },
            renderer: null,
            redrawOnResize: !1,
            redrawOnFilter: !1,
            logExternal: !1,
            pageLoad: 1,
            initDelay: 0,
            randomize: !1,
            interactions: [],
            globalInteractions: [
                {
                    selector: "a.pdpScroll[href^='#']",
                    event: "click keypress",
                    callback: function (e) {
                        ("click" == e.type || ("keypress" == e.type && 13 == e.keyCode)) && (e.preventDefault(), e.data.pdpScroll(c(c(this).attr("href"))));
                    },
                },
            ],
            start: function () {},
            before: function () {},
            after: function () {},
            end: function () {},
            added: function () {},
            removed: function () {},
        }),
        (c.pdp.global = { product: {}, mobileDisplay: 960, mode: "", numberWords: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen"] }),
        (c.pdp.global.mode = window && window.innerWidth && window.innerWidth > c.pdp.global.mobileDisplay ? "desktop" : "mobile"),
        (c.tspSlide = function (e, t) {
            var o = c(e),
                i = c.extend(
                    { carousel: null, carouselContent: null, slides: null, arrayOfSlides: [], carouselDisplaying: 0, screenSize: 0, lengthOfSlide: 0, rightNav: null, moving: !0, leftNav: null, initialX: 0, initialPos: [], initialInd: 1 },
                    c.tspSlide.defaults,
                    t
                ),
                a = (i.scope, "ontouchstart" in window || (window.DocumentTouch && (document, DocumentTouch)), {});
            c.data(e, "tspSlide", o),
                (a = {
                    init: function () {
                        (i.carousel = o[0].querySelector(i.scope + " " + i.carouselSel)),
                            (i.carouselContent = o[0].querySelector(i.scope + " " + i.contentSel)),
                            (i.slides = o[0].querySelectorAll(i.scope + " " + i.slideSel)),
                            (i.arrayOfSlides = Array.prototype.slice.call(i.slides)),
                            (i.carouselDisplaying = 0),
                            (i.screenSize = 0),
                            (i.lengthOfSlide = 0),
                            (i.rightNav = o[0].querySelector(i.scope + " " + i.navRightSel)),
                            (i.leftNav = o[0].querySelector(i.scope + " " + i.navLeftSel)),
                            (i.showNav = !0),
                            (i.moving = !0),
                            (i.initialX = 0),
                            (i.initialPos = []),
                            a.setScreenSize(),
                            i.carousel.classList.remove("init"),
                            a.moveSlidesRight(),
                            window.addEventListener("resize", a.setScreenSize),
                            i.rightNav.addEventListener("click", a.moveLeft),
                            i.leftNav.addEventListener("click", a.moveRight);
                    },
                    addClone: function () {
                        var e = i.carouselContent.lastElementChild.cloneNode(!0);
                        (e.style.left = -i.lengthOfSlide + "px"), i.carouselContent.insertBefore(e, i.carouselContent.firstChild);
                    },
                    removeClone: function () {
                        var e = i.carouselContent.firstElementChild;
                        e.parentNode.removeChild(e);
                    },
                    moveSlidesRight: function () {
                        var e = o[0].querySelectorAll(i.scope + " " + i.slideSel),
                            e = Array.prototype.slice.call(e),
                            n = 0;
                        e.forEach(function (e, t) {
                            (e.style.left = n + "px"), (n += i.lengthOfSlide);
                        }),
                            a.addClone();
                    },
                    moveSlidesLeft: function () {
                        var e = o[0].querySelectorAll(i.scope + " " + i.slideSel),
                            e = Array.prototype.slice.call(e),
                            n = ((e = e.reverse()).length - 1) * i.lengthOfSlide;
                        e.forEach(function (e, t) {
                            (n -= i.lengthOfSlide), (e.style.left = n + "px");
                        });
                    },
                    setScreenSize: function () {
                        i.carouselDisplaying = 1;
                        for (var e = 0; e < i.slideCountResolutions.length; e++)
                            if (window.innerWidth >= i.slideCountResolutions[e].min) {
                                (i.carouselDisplaying = i.slideCountResolutions[e].count), (i.showNav = i.arrayOfSlides.length > i.carouselDisplaying);
                                break;
                            }
                        i.rightNav && i.leftNav && (i.rightNav.style.display = i.leftNav.style.display = i.showNav ? "block" : "none"), a.getScreenSize();
                    },
                    getScreenSize: function () {
                        var e = o[0].querySelectorAll(i.scope + " " + i.slideSel),
                            e = Array.prototype.slice.call(e);
                        i.lengthOfSlide = i.carousel.offsetWidth / i.carouselDisplaying;
                        var t = -i.lengthOfSlide;
                        e.forEach(function (e) {
                            (e.style.width = i.lengthOfSlide + "px"), (e.style.left = t + "px"), (t += i.lengthOfSlide);
                        });
                    },
                    moveRight: function () {
                        var e;
                        i.moving &&
                            i.showNav &&
                            ((i.moving = !1),
                            (e = i.carouselContent.lastElementChild).parentNode.removeChild(e),
                            i.carouselContent.insertBefore(e, i.carouselContent.firstChild),
                            a.removeClone(),
                            i.carouselContent.firstElementChild.addEventListener("transitionend", a.activateAgain),
                            a.moveSlidesRight());
                    },
                    activateAgain: function () {
                        var e = i.carouselContent.firstElementChild;
                        (i.moving = !0), e.removeEventListener("transitionend", a.activateAgain);
                    },
                    moveLeft: function () {
                        i.moving && i.showNav && ((i.moving = !1), a.removeClone(), i.carouselContent.firstElementChild.addEventListener("transitionend", a.replaceToEnd), a.moveSlidesLeft());
                    },
                    replaceToEnd: function () {
                        var e = i.carouselContent.firstElementChild;
                        e.parentNode.removeChild(e),
                            i.carouselContent.appendChild(e),
                            (e.style.left = (i.arrayOfSlides.length - 1) * i.lengthOfSlide + "px"),
                            a.addClone(),
                            (i.moving = !0),
                            e.removeEventListener("transitionend", a.replaceToEnd);
                    },
                }).init();
        }),
        (c.tspSlide.defaults = {
            scope: "",
            carouselSel: ".stepsCarousel",
            contentSel: ".stepsContent",
            slideSel: ".slide",
            navLeftSel: ".nav-left",
            navRightSel: ".nav-right",
            debug: !0,
            initDelay: 0,
            randomize: !1,
            slideCountResolutions: [
                { min: 960, count: 4 },
                { min: 0, count: 6 },
            ],
            start: function () {},
            before: function () {},
            after: function () {},
            end: function () {},
            added: function () {},
            removed: function () {},
        }),
        (c.fn.pdp = function (n) {
            if ((void 0 === n && (n = {}), "object" == typeof n))
                return this.each(function () {
                    var e = c(this),
                        t = n.selector || ".pdp-section",
                        t = e.findDescendantsAndSelf(t);
                    null != n.templates && null != n.templates.main && "" != n.templates.main ? 1 === t.length && new c.pdp(this, n) : console.log("no main template provided!");
                });
        }),
        (c.fn.tspSlide = function (n) {
            if ((void 0 === n && (n = {}), "object" == typeof n))
                return this.each(function () {
                    var e = c(this),
                        t = n.slideSel || ".slide";
                    e.findDescendantsAndSelf(t);
                    new c.tspSlide(this, n);
                });
        }),
        (c.fn.findDescendantsAndSelf = function (e) {
            return null != c.fn.addBack ? this.find(e).addBack(e) : this.find(e).andSelf().filter(e);
        }),
        c(window).resize(function () {
            setTimeout(function () {
                var e = window && window.innerWidth && window.innerWidth > c.pdp.global.mobileDisplay ? "desktop" : "mobile";
                void 0 === c.pdp.global.mode && (c.pdp.global.mode = e), c.pdp.global.mode != e && ((c.pdp.global.mode = e), document.dispatchEvent(new CustomEvent("pdpresize", {})));
            }, 0);
        });
})(jQuery);