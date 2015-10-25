/**
 * SoundManager 2 homepage demo JS
 * -------------------------------
 * Numerous demo CSS minified + combined
 * for optimal performance.
 * For raw source, see individual demo pages.
 * --------------------------------
 * Source files:
 * demo/play-mp3-links/script/inlineplayer.js
 * demo/page-player/script/page-player.js
 * demo/mp3-player-button/script/mp3-player-button.js
 * demo/360-player/script/berniecode-animator.js
 * demo/360-player/script/360player.js
 * demo/index.js
 */

/*

 Animator.js 1.1.9

 This library is released under the BSD license:

 Copyright (c) 2006, Bernard Sumption. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer. Redistributions in binary
 form must reproduce the above copyright notice, this list of conditions and
 the following disclaimer in the documentation and/or other materials
 provided with the distribution. Neither the name BernieCode nor
 the names of its contributors may be used to endorse or promote products
 derived from this software without specific prior written permission. 

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 DAMAGE.


 SoundManager 2: "Turntable UI": Base and API
 Copyright (c) 2015, Scott Schiller. All rights reserved.
 http://www.schillmania.com/projects/soundmanager2/
 Code provided under BSD license.
 http://schillmania.com/projects/soundmanager2/license.txt

 SoundManager 2: "Turntable UI": Demo application
 Copyright (c) 2015, Scott Schiller. All rights reserved.
 http://www.schillmania.com/projects/soundmanager2/
 Code provided under BSD license.
 http://schillmania.com/projects/soundmanager2/license.txt
 */
function InlinePlayer() {
    var a = this, c = this, b = soundManager, d = navigator.userAgent.match(/msie/i);
    this.playableClass = "inline-playable";
    this.excludeClass = "inline-exclude";
    this.links = [];
    this.sounds = [];
    this.soundsByURL = [];
    this.indexByURL = [];
    this.lastSound = null;
    this.soundCount = 0;
    this.config = {playNext: !1, autoPlay: !1};
    this.css = {sDefault: "sm2_link", sLoading: "sm2_loading", sPlaying: "sm2_playing", sPaused: "sm2_paused"};
    this.addEventHandler = "undefined" !== typeof window.addEventListener ? function (a, b, c) {
        return a.addEventListener(b,
            c, !1)
    } : function (a, b, c) {
        a.attachEvent("on" + b, c)
    };
    this.removeEventHandler = "undefined" !== typeof window.removeEventListener ? function (a, b, c) {
        return a.removeEventListener(b, c, !1)
    } : function (a, b, c) {
        return a.detachEvent("on" + b, c)
    };
    this.classContains = function (a, b) {
        return "undefined" != typeof a.className ? a.className.match(new RegExp("(\\s|^)" + b + "(\\s|$)")) : !1
    };
    this.addClass = function (b, c) {
        if (!b || !c || a.classContains(b, c))return !1;
        b.className = (b.className ? b.className + " " : "") + c
    };
    this.removeClass = function (b, c) {
        if (!b || !c || !a.classContains(b, c))return !1;
        b.className = b.className.replace(new RegExp("( " + c + ")|(" + c + ")", "g"), "")
    };
    this.getSoundByURL = function (b) {
        return "undefined" != typeof a.soundsByURL[b] ? a.soundsByURL[b] : null
    };
    this.isChildOfNode = function (a, b) {
        if (!a || !a.parentNode)return !1;
        b = b.toLowerCase();
        do a = a.parentNode; while (a && a.parentNode && a.nodeName.toLowerCase() != b);
        return a.nodeName.toLowerCase() == b ? a : null
    };
    this.events = {
        play: function () {
            c.removeClass(this._data.oLink, this._data.className);
            this._data.className =
                c.css.sPlaying;
            c.addClass(this._data.oLink, this._data.className)
        }, stop: function () {
            c.removeClass(this._data.oLink, this._data.className);
            this._data.className = ""
        }, pause: function () {
            c.removeClass(this._data.oLink, this._data.className);
            this._data.className = c.css.sPaused;
            c.addClass(this._data.oLink, this._data.className)
        }, resume: function () {
            c.removeClass(this._data.oLink, this._data.className);
            this._data.className = c.css.sPlaying;
            c.addClass(this._data.oLink, this._data.className)
        }, finish: function () {
            c.removeClass(this._data.oLink,
                this._data.className);
            this._data.className = "";
            if (c.config.playNext) {
                var a = c.indexByURL[this._data.oLink.href] + 1;
                a < c.links.length && c.handleClick({target: c.links[a]})
            }
        }
    };
    this.stopEvent = function (a) {
        "undefined" != typeof a && "undefined" != typeof a.preventDefault ? a.preventDefault() : "undefined" != typeof event && "undefined" != typeof event.returnValue && (event.returnValue = !1);
        return !1
    };
    this.getTheDamnLink = d ? function (a) {
        return a && a.target ? a.target : window.event.srcElement
    } : function (a) {
        return a.target
    };
    this.handleClick =
        function (c) {
            if ("undefined" != typeof c.button && 1 < c.button)return !0;
            var f = a.getTheDamnLink(c);
            if ("a" != f.nodeName.toLowerCase() && (f = a.isChildOfNode(f, "a"), !f))return !0;
            f.getAttribute("href");
            if (!f.href || !b.canPlayLink(f) && !a.classContains(f, a.playableClass) || a.classContains(f, a.excludeClass))return !0;
            var d = f.href, e = a.getSoundByURL(d);
            e ? (e != a.lastSound && (b._writeDebug("sound different than last sound: " + a.lastSound.id), a.lastSound && a.stopSound(a.lastSound)), e.togglePause()) : (a.lastSound && a.stopSound(a.lastSound),
                e = b.createSound({
                    id: "inlineMP3Sound" + a.soundCount++,
                    url: d,
                    onplay: a.events.play,
                    onstop: a.events.stop,
                    onpause: a.events.pause,
                    onresume: a.events.resume,
                    onfinish: a.events.finish,
                    type: f.type || null
                }), e._data = {oLink: f, className: a.css.sPlaying}, a.soundsByURL[d] = e, a.sounds.push(e), e.play());
            a.lastSound = e;
            "undefined" != typeof c && "undefined" != typeof c.preventDefault ? c.preventDefault() : event.returnValue = !1;
            return !1
        };
    this.stopSound = function (a) {
        soundManager.stop(a.id);
        soundManager.unload(a.id)
    };
    this.init = function () {
        b._writeDebug("inlinePlayer.init()");
        for (var c = document.getElementsByTagName("a"), f = 0, d = 0, e = c.length; d < e; d++)!b.canPlayLink(c[d]) && !a.classContains(c[d], a.playableClass) || a.classContains(c[d], a.excludeClass) || (a.addClass(c[d], a.css.sDefault), a.links[f] = c[d], a.indexByURL[c[d].href] = f, f++);
        0 < f && (a.addEventHandler(document, "click", a.handleClick), a.config.autoPlay && a.handleClick({
            target: a.links[0],
            preventDefault: function () {
            }
        }));
        b._writeDebug("inlinePlayer.init(): Found " + f + " relevant items.")
    };
    this.init()
}
var inlinePlayer = null;
soundManager.setup({debugMode: !0, preferFlash: !1, useFlashBlock: !0, url: "../../swf/", flashVersion: 9});
soundManager.onready(function () {
    inlinePlayer = new InlinePlayer
});
var pagePlayer = null;
function PagePlayer() {
    var a = this, c = this, b = soundManager, d, g = null, f = null, h = document.getElementsByTagName("head")[0], e = null, k = navigator.userAgent, m = k.match(/(opera|firefox)/i), q = k.match(/ipad|ipod|iphone/i), r;
    this.config = {
        usePeakData: !1,
        useWaveformData: !1,
        useEQData: !1,
        fillGraph: !1,
        allowRightClick: !0,
        useThrottling: !0,
        autoStart: !1,
        playNext: !0,
        updatePageTitle: !0,
        emptyTime: "-:--",
        useFavIcon: !1
    };
    this.css = {sDefault: "sm2_link", sLoading: "sm2_loading", sPlaying: "sm2_playing", sPaused: "sm2_paused"};
    this.sounds =
        [];
    this.soundsByObject = [];
    this.lastSound = null;
    this.soundCount = 0;
    this.strings = [];
    this.dragActive = !1;
    this.dragExec = new Date;
    this.dragTimer = null;
    this.pageTitle = document.title;
    this.lastWPExec = new Date;
    this.lastWLExec = new Date;
    this.vuMeterData = [];
    this.oControls = null;
    this._mergeObjects = function (a, b) {
        var l = {}, c, e;
        for (c in a)a.hasOwnProperty(c) && (l[c] = a[c]);
        c = "undefined" === typeof b ? {} : b;
        for (e in c)"undefined" === typeof l[e] && (l[e] = c[e]);
        return l
    };
    d = function () {
        function a(b) {
            b = p.call(b);
            var n = b.length;
            c ? (b[1] =
                "on" + b[1], 3 < n && b.pop()) : 3 === n && b.push(!1);
            return b
        }

        function b(a, n) {
            var p = a.shift(), t = [e[n]];
            if (c)p[t](a[0], a[1]); else p[t].apply(p, a)
        }

        var c = window.attachEvent && !window.addEventListener, p = Array.prototype.slice, e = {
            add: c ? "attachEvent" : "addEventListener",
            remove: c ? "detachEvent" : "removeEventListener"
        };
        return {
            add: function () {
                b(a(arguments), "add")
            }, remove: function () {
                b(a(arguments), "remove")
            }
        }
    }();
    this.hasClass = function (a, b) {
        return "undefined" !== typeof a.className ? (new RegExp("(^|\\s)" + b + "(\\s|$)")).test(a.className) :
            !1
    };
    this.addClass = function (b, c) {
        if (!b || !c || a.hasClass(b, c))return !1;
        b.className = (b.className ? b.className + " " : "") + c
    };
    this.removeClass = function (b, c) {
        if (!b || !c || !a.hasClass(b, c))return !1;
        b.className = b.className.replace(new RegExp("( " + c + ")|(" + c + ")", "g"), "")
    };
    this.select = function (b, c) {
        var l = a.getByClassName(b, "div", c || null);
        return l ? l[0] : null
    };
    this.getByClassName = document.querySelectorAll ? function (a, b, c) {
        a = "." + a;
        b && (b = b.split(" "));
        b = 1 < b.length ? b.join(a + ", ") : b[0] + a;
        return (c ? c : document).querySelectorAll(b)
    } :
        function (b, c, l) {
            var p = l ? l : document;
            l = [];
            var e, d = [];
            c && (c = c.split(" "));
            if (c instanceof Array) {
                for (e = c.length; e--;)d && d[c[e]] || (d[c[e]] = p.getElementsByTagName(c[e]));
                for (e = c.length; e--;)for (p = d[c[e]].length; p--;)a.hasClass(d[c[e]][p], b) && l.push(d[c[e]][p])
            } else for (d = p.all || p.getElementsByTagName("*"), e = 0, p = d.length; e < p; e++)a.hasClass(d[e], b) && l.push(d[e]);
            return l
        };
    this.isChildOfClass = function (b, c) {
        if (!b || !c)return !1;
        for (; b.parentNode && !a.hasClass(b, c);)b = b.parentNode;
        return a.hasClass(b, c)
    };
    this.getParentByNodeName =
        function (a, b) {
            if (!a || !b)return !1;
            for (b = b.toLowerCase(); a.parentNode && b !== a.parentNode.nodeName.toLowerCase();)a = a.parentNode;
            return a.parentNode && b === a.parentNode.nodeName.toLowerCase() ? a.parentNode : null
        };
    this.getOffX = function (a) {
        var b = 0;
        if (a.offsetParent)for (; a.offsetParent;)b += a.offsetLeft, a = a.offsetParent; else a.x && (b += a.x);
        return b
    };
    this.getTime = function (a, b) {
        var c = Math.floor(a / 1E3), p = Math.floor(c / 60), c = c - 60 * p;
        return b ? p + ":" + (10 > c ? "0" + c : c) : {min: p, sec: c}
    };
    this.getSoundByObject = function (b) {
        return "undefined" !== typeof a.soundsByObject[b.id] ? a.soundsByObject[b.id] : null
    };
    this.getPreviousItem = function (a) {
        if (a.previousElementSibling)a = a.previousElementSibling; else for (a = a.previousSibling; a && a.previousSibling && 1 !== a.previousSibling.nodeType;)a = a.previousSibling;
        return "li" !== a.nodeName.toLowerCase() ? null : a.getElementsByTagName("a")[0]
    };
    this.playPrevious = function (b) {
        b || (b = a.lastSound);
        if (!b)return !1;
        (b = a.getPreviousItem(b._data.oLI)) && c.handleClick({target: b});
        return b
    };
    this.getNextItem = function (a) {
        if (a.nextElementSibling)a =
            a.nextElementSibling; else for (a = a.nextSibling; a && a.nextSibling && 1 !== a.nextSibling.nodeType;)a = a.nextSibling;
        return "li" !== a.nodeName.toLowerCase() ? null : a.getElementsByTagName("a")[0]
    };
    this.playNext = function (b) {
        b || (b = a.lastSound);
        if (!b)return !1;
        (b = a.getNextItem(b._data.oLI)) && c.handleClick({target: b});
        return b
    };
    this.setPageTitle = function (b) {
        if (!a.config.updatePageTitle)return !1;
        try {
            document.title = (b ? b + " - " : "") + a.pageTitle
        } catch (c) {
            a.setPageTitle = function () {
                return !1
            }
        }
    };
    this.events = {
        play: function () {
            c.removeClass(this._data.oLI,
                this._data.className);
            this._data.className = c.css.sPlaying;
            c.addClass(this._data.oLI, this._data.className);
            a.setPageTitle(this._data.originalTitle)
        }, stop: function () {
            c.removeClass(this._data.oLI, this._data.className);
            this._data.className = "";
            this._data.oPosition.style.width = "0px";
            a.setPageTitle();
            a.resetPageIcon()
        }, pause: function () {
            if (c.dragActive)return !1;
            c.removeClass(this._data.oLI, this._data.className);
            this._data.className = c.css.sPaused;
            c.addClass(this._data.oLI, this._data.className);
            a.setPageTitle();
            a.resetPageIcon()
        }, resume: function () {
            if (c.dragActive)return !1;
            c.removeClass(this._data.oLI, this._data.className);
            this._data.className = c.css.sPlaying;
            c.addClass(this._data.oLI, this._data.className)
        }, finish: function () {
            c.removeClass(this._data.oLI, this._data.className);
            this._data.className = "";
            this._data.oPosition.style.width = "0px";
            a.config.playNext ? c.playNext(this) : (a.setPageTitle(), a.resetPageIcon())
        }, whileloading: function () {
            function b() {
                this._data.oLoading.style.width = this.bytesLoaded / this.bytesTotal *
                    100 + "%";
                !this._data.didRefresh && this._data.metadata && (this._data.didRefresh = !0, this._data.metadata.refresh())
            }

            if (c.config.useThrottling) {
                var e = new Date;
                if (e && 50 < e - a.lastWLExec || this.bytesLoaded === this.bytesTotal)b.apply(this), a.lastWLExec = e
            } else b.apply(this)
        }, onload: function () {
            if (this.loaded)this._data.metadata && this._data.metadata.refresh(); else {
                var a = this._data.oLI.getElementsByTagName("a")[0], c = a.innerHTML;
                a.innerHTML = c + ' <span style="font-size:0.5em"> | Load failed, d\'oh! ' + (b.sandbox.noRemote ?
                        " Possible cause: Flash sandbox is denying remote URL access." : b.sandbox.noLocal ? "Flash denying local filesystem access" : "404?") + "</span>";
                setTimeout(function () {
                    a.innerHTML = c
                }, 5E3)
            }
        }, whileplaying: function () {
            var e = null;
            c.dragActive || !c.config.useThrottling ? (a.updateTime.apply(this), 9 <= b.flashVersion && (c.config.usePeakData && this.instanceOptions.usePeakData && a.updatePeaks.apply(this), (c.config.useWaveformData && this.instanceOptions.useWaveformData || c.config.useEQData && this.instanceOptions.useEQData) &&
            a.updateGraph.apply(this)), this._data.metadata && (e = new Date) && 500 < e - a.lastWPExec && (this._data.metadata.refreshMetadata(this), a.lastWPExec = e), this._data.oPosition.style.width = this.position / a.getDurationEstimate(this) * 100 + "%") : (e = new Date, 30 < e - a.lastWPExec && (a.updateTime.apply(this), 9 <= b.flashVersion && (c.config.usePeakData && this.instanceOptions.usePeakData && a.updatePeaks.apply(this), (c.config.useWaveformData && this.instanceOptions.useWaveformData || c.config.useEQData && this.instanceOptions.useEQData) &&
            a.updateGraph.apply(this)), this._data.metadata && this._data.metadata.refreshMetadata(this), this._data.oPosition.style.width = this.position / a.getDurationEstimate(this) * 100 + "%", a.lastWPExec = e))
        }
    };
    this.setPageIcon = function (b) {
        if (!a.config.useFavIcon || !a.config.usePeakData || !b)return !1;
        var c = document.getElementById("sm2-favicon");
        c && (h.removeChild(c), c = null);
        c || (c = document.createElement("link"), c.id = "sm2-favicon", c.rel = "shortcut icon", c.type = "image/png", c.href = b, document.getElementsByTagName("head")[0].appendChild(c))
    };
    this.resetPageIcon = function () {
        if (!a.config.useFavIcon)return !1;
        var b = document.getElementById("favicon");
        b && (b.href = "/favicon.ico")
    };
    this.updatePeaks = function () {
        var c = this._data.oPeak.getElementsByTagName("span");
        c[0].style.marginTop = 13 - Math.floor(15 * this.peakData.left) + "px";
        c[1].style.marginTop = 13 - Math.floor(15 * this.peakData.right) + "px";
        8 < b.flashVersion && a.config.useFavIcon && a.config.usePeakData && a.setPageIcon(a.vuMeterData[parseInt(16 * this.peakData.left, 10)][parseInt(16 * this.peakData.right, 10)])
    };
    this.updateGraph = function () {
        if (9 > c.config.flashVersion || !c.config.useWaveformData && !c.config.useEQData)return !1;
        var a = this._data.oGraph.getElementsByTagName("div"), b;
        if (c.config.useWaveformData)for (b = 255; b--;)a[255 - b].style.marginTop = 9 + Math.ceil(-8 * this.waveformData.left[b]) + "px"; else for (b = 255; b--;)a[255 - b].style.marginTop = 17 + Math.ceil(-9 * this.eqData[b]) + "px"
    };
    this.resetGraph = function () {
        if (!c.config.useEQData || 9 > c.config.flashVersion)return !1;
        var a = this._data.oGraph.getElementsByTagName("div"), b =
            c.config.useEQData ? "17px" : "9px", l = c.config.fillGraph ? "32px" : "1px", p;
        for (p = 255; p--;)a[255 - p].style.marginTop = b, a[255 - p].style.height = l
    };
    this.updateTime = function () {
        var b = a.strings.timing.replace("%s1", a.getTime(this.position, !0)), b = b.replace("%s2", a.getTime(a.getDurationEstimate(this), !0));
        this._data.oTiming.innerHTML = b
    };
    this.getTheDamnTarget = function (a) {
        return a.target || (window.event ? window.event.srcElement : null)
    };
    this.withinStatusBar = function (b) {
        return a.isChildOfClass(b, "playlist") && a.isChildOfClass(b,
                "controls")
    };
    this.handleClick = function (d) {
        if (2 === d.button)return c.config.allowRightClick || c.stopEvent(d), c.config.allowRightClick;
        var f = a.getTheDamnTarget(d), l, p, h;
        if (!f)return !0;
        a.dragActive && a.stopDrag();
        if (a.withinStatusBar(f))return !1;
        "a" !== f.nodeName.toLowerCase() && (f = a.getParentByNodeName(f, "a"));
        if (!f)return !0;
        f.getAttribute("href");
        if (!f.href || !b.canPlayLink(f) && !a.hasClass(f, "playable") || a.hasClass(f, "exclude"))return !0;
        a.initUL(a.getParentByNodeName(f, "ul"));
        a.initItem(f);
        l = f.href;
        (p = a.getSoundByObject(f)) ?
            (a.setPageTitle(p._data.originalTitle), p === a.lastSound ? 2 !== p.readyState ? 1 !== p.playState ? p.play() : p.togglePause() : b._writeDebug("Warning: sound failed to load (security restrictions, 404 or bad format)", 2) : (a.lastSound && a.stopSound(a.lastSound), e && p._data.oTimingBox.appendChild(e), p.togglePause())) : (p = b.createSound({
            id: f.id,
            url: decodeURI(l),
            onplay: a.events.play,
            onstop: a.events.stop,
            onpause: a.events.pause,
            onresume: a.events.resume,
            onfinish: a.events.finish,
            type: f.type || null,
            whileloading: a.events.whileloading,
            whileplaying: a.events.whileplaying,
            onmetadata: a.events.metadata,
            onload: a.events.onload
        }), l = a.oControls.cloneNode(!0), h = f.parentNode, h.appendChild(l), e && h.appendChild(e), a.soundsByObject[f.id] = p, p._data = {
            oLink: f,
            oLI: h,
            oControls: a.select("controls", h),
            oStatus: a.select("statusbar", h),
            oLoading: a.select("loading", h),
            oPosition: a.select("position", h),
            oTimingBox: a.select("timing", h),
            oTiming: a.select("timing", h).getElementsByTagName("div")[0],
            oPeak: a.select("peak", h),
            oGraph: a.select("spectrum-box", h),
            className: a.css.sPlaying,
            originalTitle: f.innerHTML,
            metadata: null
        }, e && p._data.oTimingBox.appendChild(e), p._data.oLI.getElementsByTagName("ul").length && (p._data.metadata = new Metadata(p)), f = a.strings.timing.replace("%s1", a.config.emptyTime), f = f.replace("%s2", a.config.emptyTime), p._data.oTiming.innerHTML = f, a.sounds.push(p), a.lastSound && a.stopSound(a.lastSound), a.resetGraph.apply(p), p.play());
        a.lastSound = p;
        return a.stopEvent(d)
    };
    this.handleMouseDown = function (b) {
        q && b.touches && (b = b.touches[0]);
        if (2 === b.button)return c.config.allowRightClick ||
        c.stopEvent(b), c.config.allowRightClick;
        var e = a.getTheDamnTarget(b);
        if (!e || !a.withinStatusBar(e))return !0;
        a.dragActive = !0;
        a.lastSound.pause();
        a.setPosition(b);
        q ? d.add(document, "touchmove", a.handleMouseMove) : d.add(document, "mousemove", a.handleMouseMove);
        a.addClass(a.lastSound._data.oControls, "dragging");
        return a.stopEvent(b)
    };
    this.handleMouseMove = function (b) {
        q && b.touches && (b = b.touches[0]);
        if (a.dragActive)if (a.config.useThrottling) {
            var c = new Date;
            20 < c - a.dragExec ? a.setPosition(b) : (window.clearTimeout(a.dragTimer),
                a.dragTimer = window.setTimeout(function () {
                    a.setPosition(b)
                }, 20));
            a.dragExec = c
        } else a.setPosition(b); else a.stopDrag();
        b.stopPropagation = !0;
        return !1
    };
    this.stopDrag = function (b) {
        if (a.dragActive)return a.removeClass(a.lastSound._data.oControls, "dragging"), q ? d.remove(document, "touchmove", a.handleMouseMove) : d.remove(document, "mousemove", a.handleMouseMove), c.hasClass(a.lastSound._data.oLI, a.css.sPaused) || a.lastSound.resume(), a.dragActive = !1, a.stopEvent(b)
    };
    this.handleStatusClick = function (b) {
        a.setPosition(b);
        c.hasClass(a.lastSound._data.oLI, a.css.sPaused) || a.resume();
        return a.stopEvent(b)
    };
    this.stopEvent = function (a) {
        "undefined" !== typeof a && ("undefined" !== typeof a.preventDefault ? a.preventDefault() : (a.stopPropagation = !0, a.returnValue = !1));
        return !1
    };
    this.setPosition = function (b) {
        var c = a.getTheDamnTarget(b), l;
        if (!c)return !0;
        for (l = c; !a.hasClass(l, "controls") && l.parentNode;)l = l.parentNode;
        c = a.lastSound;
        b = parseInt(b.clientX, 10);
        b = Math.floor((b - a.getOffX(l) - 4) / l.offsetWidth * a.getDurationEstimate(c));
        isNaN(b) ||
        (b = Math.min(b, c.duration));
        isNaN(b) || c.setPosition(b)
    };
    this.stopSound = function (a) {
        b._writeDebug("stopping sound: " + a.id);
        b.stop(a.id);
        q || b.unload(a.id)
    };
    this.getDurationEstimate = function (a) {
        return a.instanceOptions.isMovieStar ? a.duration : a._data.metadata && a._data.metadata.data.givenDuration ? a._data.metadata.data.givenDuration : a.durationEstimate || 0
    };
    this.createVUData = function () {
        var b = 0, c = 0, l = g.getContext("2d"), e = l.createLinearGradient(0, 16, 0, 0), f;
        e.addColorStop(0, "rgb(0,192,0)");
        e.addColorStop(.3,
            "rgb(0,255,0)");
        e.addColorStop(.625, "rgb(255,255,0)");
        e.addColorStop(.85, "rgb(255,0,0)");
        f = l.createLinearGradient(0, 16, 0, 0);
        f.addColorStop(0, "rgba(0,0,0,0.2)");
        f.addColorStop(1, "rgba(0,0,0,0.5)");
        for (b = 0; 16 > b; b++)a.vuMeterData[b] = [];
        for (b = 0; 16 > b; b++)for (c = 0; 16 > c; c++)g.setAttribute("width", 16), g.setAttribute("height", 16), l.fillStyle = f, l.fillRect(0, 0, 7, 15), l.fillRect(8, 0, 7, 15), l.fillStyle = e, l.fillRect(0, 15 - b, 7, 16 - (16 - b)), l.fillRect(8, 15 - c, 7, 16 - (16 - c)), l.clearRect(0, 3, 16, 1), l.clearRect(0, 7, 16, 1), l.clearRect(0,
            11, 16, 1), a.vuMeterData[b][c] = g.toDataURL("image/png")
    };
    this.testCanvas = function () {
        var a = document.createElement("canvas"), b = null;
        if (!a || "undefined" === typeof a.getContext)return null;
        b = a.getContext("2d");
        if (!b || "function" !== typeof a.toDataURL)return null;
        try {
            a.toDataURL("image/png")
        } catch (c) {
            return null
        }
        return a
    };
    this.initItem = function (b) {
        b.id || (b.id = "pagePlayerMP3Sound" + a.soundCount++);
        a.addClass(b, a.css.sDefault)
    };
    this.initUL = function (c) {
        9 <= b.flashVersion && a.addClass(c, a.cssBase)
    };
    this.init = function (h) {
        function k(b) {
            d[b](document,
                "click", a.handleClick);
            q ? (d[b](document, "touchstart", a.handleMouseDown), d[b](document, "touchend", a.stopDrag)) : (d[b](document, "mousedown", a.handleMouseDown), d[b](document, "mouseup", a.stopDrag));
            d[b](window, "unload", r)
        }

        h ? (b._writeDebug("pagePlayer.init(): Using custom configuration"), this.config = this._mergeObjects(h, this.config)) : b._writeDebug("pagePlayer.init(): Using default configuration");
        var l, p, u, x;
        this.cssBase = [];
        b.useFlashBlock = !0;
        9 <= b.flashVersion ? (b.defaultOptions.usePeakData = this.config.usePeakData,
            b.defaultOptions.useWaveformData = this.config.useWaveformData, b.defaultOptions.useEQData = this.config.useEQData, this.config.usePeakData && this.cssBase.push("use-peak"), (this.config.useWaveformData || this.config.useEQData) && this.cssBase.push("use-spectrum"), this.cssBase = this.cssBase.join(" "), this.config.useFavIcon && ((g = a.testCanvas()) && m ? a.createVUData() : this.config.useFavIcon = !1)) : (this.config.usePeakData || this.config.useWaveformData || this.config.useEQData) && b._writeDebug("Page player: Note: soundManager.flashVersion = 9 is required for peak/waveform/EQ features.");
        f = document.createElement("div");
        f.innerHTML = '  <div class="controls">\n   <div class="statusbar">\n    <div class="loading"></div>\n    <div class="position"></div>\n   </div>\n  </div>\n  <div class="timing">\n   <div id="sm2_timing" class="timing-data">\n    <span class="sm2_position">%s1</span> / <span class="sm2_total">%s2</span>\n   </div>\n  </div>\n  <div class="peak">\n   <div class="peak-box"><span class="l"></span><span class="r"></span></div>\n  </div>\n <div class="spectrum-container">\n  <div class="spectrum-box">\n   <div class="spectrum"></div>\n  </div>\n </div>';
        if (9 <= b.flashVersion) {
            e = a.select("spectrum-container", f);
            e = f.removeChild(e);
            l = a.select("spectrum-box", e);
            p = l.getElementsByTagName("div")[0];
            u = document.createDocumentFragment();
            x = null;
            for (h = 256; h--;)x = p.cloneNode(!1), x.style.left = h + "px", u.appendChild(x);
            l.removeChild(p);
            l.appendChild(u)
        } else f.removeChild(a.select("spectrum-container", f)), f.removeChild(a.select("peak", f));
        a.oControls = f.cloneNode(!0);
        h = a.select("timing-data", f);
        a.strings.timing = h.innerHTML;
        h.innerHTML = "";
        h.id = "";
        r = function () {
            k("remove")
        };
        k("add");
        b._writeDebug("pagePlayer.init(): Ready", 1);
        a.config.autoStart && c.handleClick({target: c.getByClassName("playlist", "ul")[0].getElementsByTagName("a")[0]})
    }
}
soundManager.useFlashBlock = !0;
soundManager.onready(function () {
    pagePlayer = new PagePlayer;
    pagePlayer.init("undefined" !== typeof PP_CONFIG ? PP_CONFIG : null)
});
function BasicMP3Player() {
    var a = this, c = this, b = soundManager, d = navigator.userAgent.match(/ipad|iphone/i), g = navigator.userAgent.match(/msie/i);
    this.excludeClass = "button-exclude";
    this.links = [];
    this.sounds = [];
    this.soundsByURL = {};
    this.indexByURL = {};
    this.lastSound = null;
    this.soundCount = 0;
    this.config = {playNext: !1, autoPlay: !1};
    this.css = {sDefault: "sm2_button", sLoading: "sm2_loading", sPlaying: "sm2_playing", sPaused: "sm2_paused"};
    this.includeClass = this.css.sDefault;
    this.addEventHandler = "undefined" !== typeof window.addEventListener ?
        function (a, b, c) {
            return a.addEventListener(b, c, !1)
        } : function (a, b, c) {
        a.attachEvent("on" + b, c)
    };
    this.removeEventHandler = "undefined" !== typeof window.removeEventListener ? function (a, b, c) {
        return a.removeEventListener(b, c, !1)
    } : function (a, b, c) {
        return a.detachEvent("on" + b, c)
    };
    this.classContains = function (a, b) {
        return "undefined" !== typeof a.className ? a.className.match(new RegExp("(\\s|^)" + b + "(\\s|$)")) : !1
    };
    this.addClass = function (b, c) {
        if (!b || !c || a.classContains(b, c))return !1;
        b.className = (b.className ? b.className +
            " " : "") + c
    };
    this.removeClass = function (b, c) {
        if (!b || !c || !a.classContains(b, c))return !1;
        b.className = b.className.replace(new RegExp("( " + c + ")|(" + c + ")", "g"), "")
    };
    this.getSoundByURL = function (b) {
        return "undefined" !== typeof a.soundsByURL[b] ? a.soundsByURL[b] : null
    };
    this.isChildOfNode = function (a, b) {
        if (!a || !a.parentNode)return !1;
        b = b.toLowerCase();
        do a = a.parentNode; while (a && a.parentNode && a.nodeName.toLowerCase() !== b);
        return a.nodeName.toLowerCase() === b ? a : null
    };
    this.events = {
        play: function () {
            c.removeClass(this._data.oLink,
                this._data.className);
            this._data.className = c.css.sPlaying;
            c.addClass(this._data.oLink, this._data.className)
        }, stop: function () {
            c.removeClass(this._data.oLink, this._data.className);
            this._data.className = ""
        }, pause: function () {
            c.removeClass(this._data.oLink, this._data.className);
            this._data.className = c.css.sPaused;
            c.addClass(this._data.oLink, this._data.className)
        }, resume: function () {
            c.removeClass(this._data.oLink, this._data.className);
            this._data.className = c.css.sPlaying;
            c.addClass(this._data.oLink, this._data.className)
        },
        finish: function () {
            c.removeClass(this._data.oLink, this._data.className);
            this._data.className = "";
            if (c.config.playNext) {
                var a = c.indexByURL[this._data.oLink.href] + 1;
                a < c.links.length && c.handleClick({target: c.links[a]})
            }
        }
    };
    this.stopEvent = function (a) {
        "undefined" !== typeof a && "undefined" !== typeof a.preventDefault ? a.preventDefault() : "undefined" !== typeof window.event && (window.event.returnValue = !1);
        return !1
    };
    this.getTheDamnLink = g ? function (a) {
        return a && a.target ? a.target : window.event.srcElement
    } : function (a) {
        return a.target
    };
    this.handleClick = function (c) {
        if ("undefined" !== typeof c.button && 1 < c.button)return !0;
        var d = a.getTheDamnLink(c), e, k;
        if ("a" !== d.nodeName.toLowerCase() && (d = a.isChildOfNode(d, "a"), !d))return !0;
        d.getAttribute("href");
        if (!d.href || !soundManager.canPlayLink(d) || a.classContains(d, a.excludeClass) || !a.classContains(d, a.includeClass))return !0;
        b._writeDebug("handleClick()");
        e = d.href;
        (k = a.getSoundByURL(e)) ? k === a.lastSound ? k.togglePause() : (k.togglePause(), b._writeDebug("sound different than last sound: " + a.lastSound.id),
        a.lastSound && a.stopSound(a.lastSound)) : (k = b.createSound({
            id: "basicMP3Sound" + a.soundCount++,
            url: e,
            onplay: a.events.play,
            onstop: a.events.stop,
            onpause: a.events.pause,
            onresume: a.events.resume,
            onfinish: a.events.finish,
            type: d.type || null
        }), k._data = {
            oLink: d,
            className: a.css.sPlaying
        }, a.soundsByURL[e] = k, a.sounds.push(k), a.lastSound && a.stopSound(a.lastSound), k.play());
        a.lastSound = k;
        return a.stopEvent(c)
    };
    this.stopSound = function (a) {
        soundManager.stop(a.id);
        d || soundManager.unload(a.id)
    };
    this.init = function () {
        b._writeDebug("basicMP3Player.init()");
        var c, d, e = 0, k = document.getElementsByTagName("a");
        c = 0;
        for (d = k.length; c < d; c++)a.classContains(k[c], a.css.sDefault) && !a.classContains(k[c], a.excludeClass) && (a.links[e] = k[c], a.indexByURL[k[c].href] = e, e++);
        0 < e && (a.addEventHandler(document, "click", a.handleClick), a.config.autoPlay && a.handleClick({
            target: a.links[0],
            preventDefault: function () {
            }
        }));
        b._writeDebug("basicMP3Player.init(): Found " + e + " relevant items.")
    };
    this.init()
}
var basicMP3Player = null;
soundManager.setup({
    preferFlash: !1, onready: function () {
        basicMP3Player = new BasicMP3Player
    }
});
function Animator(a) {
    this.setOptions(a);
    var c = this;
    this.timerDelegate = function () {
        c.onTimerEvent()
    };
    this.subjects = [];
    this.subjectScopes = [];
    this.state = this.target = 0;
    this.lastTime = null
}
Animator.prototype = {
    setOptions: function (a) {
        this.options = Animator.applyDefaults({
            interval: 20, duration: 400, onComplete: function () {
            }, onStep: function () {
            }, transition: Animator.tx.easeInOut
        }, a)
    }, seekTo: function (a) {
        this.seekFromTo(this.state, a)
    }, seekFromTo: function (a, c) {
        this.target = Math.max(0, Math.min(1, c));
        this.state = Math.max(0, Math.min(1, a));
        this.lastTime = (new Date).getTime();
        this.intervalId || (this.intervalId = window.setInterval(this.timerDelegate, this.options.interval))
    }, jumpTo: function (a) {
        this.target = this.state =
            Math.max(0, Math.min(1, a));
        this.propagate()
    }, toggle: function () {
        this.seekTo(1 - this.target)
    }, addSubject: function (a, c) {
        this.subjects[this.subjects.length] = a;
        this.subjectScopes[this.subjectScopes.length] = c;
        return this
    }, clearSubjects: function () {
        this.subjects = [];
        this.subjectScopes = []
    }, propagate: function () {
        for (var a = this.options.transition(this.state), c = 0; c < this.subjects.length; c++)this.subjects[c].setState ? this.subjects[c].setState(a) : this.subjects[c].apply(this.subjectScopes[c], [a])
    }, onTimerEvent: function () {
        var a =
            (new Date).getTime(), c = a - this.lastTime;
        this.lastTime = a;
        a = c / this.options.duration * (this.state < this.target ? 1 : -1);
        Math.abs(a) >= Math.abs(this.state - this.target) ? this.state = this.target : this.state += a;
        try {
            this.propagate()
        } finally {
            this.options.onStep.call(this), this.target == this.state && (window.clearInterval(this.intervalId), this.intervalId = null, this.options.onComplete.call(this))
        }
    }, play: function () {
        this.seekFromTo(0, 1)
    }, reverse: function () {
        this.seekFromTo(1, 0)
    }, inspect: function () {
        for (var a = "#<Animator:\n",
                 c = 0; c < this.subjects.length; c++)a += this.subjects[c].inspect();
        return a + ">"
    }
};
Animator.applyDefaults = function (a, c) {
    c = c || {};
    var b, d = {};
    for (b in a)d[b] = void 0 !== c[b] ? c[b] : a[b];
    return d
};
Animator.makeArray = function (a) {
    if (null == a)return [];
    if (!a.length)return [a];
    for (var c = [], b = 0; b < a.length; b++)c[b] = a[b];
    return c
};
Animator.camelize = function (a) {
    var c = a.split("-");
    if (1 == c.length)return c[0];
    a = 0 == a.indexOf("-") ? c[0].charAt(0).toUpperCase() + c[0].substring(1) : c[0];
    for (var b = 1, d = c.length; b < d; b++) {
        var g = c[b];
        a += g.charAt(0).toUpperCase() + g.substring(1)
    }
    return a
};
Animator.apply = function (a, c, b) {
    return c instanceof Array ? (new Animator(b)).addSubject(new CSSStyleSubject(a, c[0], c[1])) : (new Animator(b)).addSubject(new CSSStyleSubject(a, c))
};
Animator.makeEaseIn = function (a) {
    return function (c) {
        return Math.pow(c, 2 * a)
    }
};
Animator.makeEaseOut = function (a) {
    return function (c) {
        return 1 - Math.pow(1 - c, 2 * a)
    }
};
Animator.makeElastic = function (a) {
    return function (c) {
        c = Animator.tx.easeInOut(c);
        return (1 - Math.cos(c * Math.PI * a)) * (1 - c) + c
    }
};
Animator.makeADSR = function (a, c, b, d) {
    null == d && (d = .5);
    return function (g) {
        return g < a ? g / a : g < c ? 1 - (g - a) / (c - a) * (1 - d) : g < b ? d : d * (1 - (g - b) / (1 - b))
    }
};
Animator.makeBounce = function (a) {
    var c = Animator.makeElastic(a);
    return function (a) {
        a = c(a);
        return 1 >= a ? a : 2 - a
    }
};
Animator.tx = {
    easeInOut: function (a) {
        return -Math.cos(a * Math.PI) / 2 + .5
    },
    linear: function (a) {
        return a
    },
    easeIn: Animator.makeEaseIn(1.5),
    easeOut: Animator.makeEaseOut(1.5),
    strongEaseIn: Animator.makeEaseIn(2.5),
    strongEaseOut: Animator.makeEaseOut(2.5),
    elastic: Animator.makeElastic(1),
    veryElastic: Animator.makeElastic(3),
    bouncy: Animator.makeBounce(1),
    veryBouncy: Animator.makeBounce(3)
};
function NumericalStyleSubject(a, c, b, d, g) {
    this.els = Animator.makeArray(a);
    this.property = "opacity" == c && window.ActiveXObject ? "filter" : Animator.camelize(c);
    this.from = parseFloat(b);
    this.to = parseFloat(d);
    this.units = null != g ? g : "px"
}
NumericalStyleSubject.prototype = {
    setState: function (a) {
        a = this.getStyle(a);
        for (var c = 0, b = 0; b < this.els.length; b++) {
            try {
                this.els[b].style[this.property] = a
            } catch (d) {
                if ("fontWeight" != this.property)throw d;
            }
            if (20 < c++)break
        }
    }, getStyle: function (a) {
        a = this.from + (this.to - this.from) * a;
        return "filter" == this.property ? "alpha(opacity=" + Math.round(100 * a) + ")" : "opacity" == this.property ? a : Math.round(a) + this.units
    }, inspect: function () {
        return "\t" + this.property + "(" + this.from + this.units + " to " + this.to + this.units + ")\n"
    }
};
function ColorStyleSubject(a, c, b, d) {
    this.els = Animator.makeArray(a);
    this.property = Animator.camelize(c);
    this.to = this.expandColor(d);
    this.from = this.expandColor(b);
    this.origFrom = b;
    this.origTo = d
}
ColorStyleSubject.prototype = {
    expandColor: function (a) {
        var c, b;
        if (c = ColorStyleSubject.parseColor(a))return a = parseInt(c.slice(1, 3), 16), b = parseInt(c.slice(3, 5), 16), c = parseInt(c.slice(5, 7), 16), [a, b, c];
        window.DEBUG && alert("Invalid colour: '" + a + "'")
    }, getValueForState: function (a, c) {
        return Math.round(this.from[a] + (this.to[a] - this.from[a]) * c)
    }, setState: function (a) {
        a = "#" + ColorStyleSubject.toColorPart(this.getValueForState(0, a)) + ColorStyleSubject.toColorPart(this.getValueForState(1, a)) + ColorStyleSubject.toColorPart(this.getValueForState(2,
                a));
        for (var c = 0; c < this.els.length; c++)this.els[c].style[this.property] = a
    }, inspect: function () {
        return "\t" + this.property + "(" + this.origFrom + " to " + this.origTo + ")\n"
    }
};
ColorStyleSubject.parseColor = function (a) {
    var c = "#", b;
    if (b = ColorStyleSubject.parseColor.rgbRe.exec(a)) {
        for (var d = 1; 3 >= d; d++)a = Math.max(0, Math.min(255, parseInt(b[d]))), c += ColorStyleSubject.toColorPart(a);
        return c
    }
    if (b = ColorStyleSubject.parseColor.hexRe.exec(a)) {
        if (3 == b[1].length) {
            for (d = 0; 3 > d; d++)c += b[1].charAt(d) + b[1].charAt(d);
            return c
        }
        return "#" + b[1]
    }
    return !1
};
ColorStyleSubject.toColorPart = function (a) {
    255 < a && (a = 255);
    var c = a.toString(16);
    return 16 > a ? "0" + c : c
};
ColorStyleSubject.parseColor.rgbRe = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
ColorStyleSubject.parseColor.hexRe = /^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
function DiscreteStyleSubject(a, c, b, d, g) {
    this.els = Animator.makeArray(a);
    this.property = Animator.camelize(c);
    this.from = b;
    this.to = d;
    this.threshold = g || .5
}
DiscreteStyleSubject.prototype = {
    setState: function (a) {
        for (var c = 0; c < this.els.length; c++)this.els[c].style[this.property] = a <= this.threshold ? this.from : this.to
    }, inspect: function () {
        return "\t" + this.property + "(" + this.from + " to " + this.to + " @ " + this.threshold + ")\n"
    }
};
function CSSStyleSubject(a, c, b) {
    a = Animator.makeArray(a);
    this.subjects = [];
    if (0 != a.length) {
        var d;
        if (b)c = this.parseStyle(c, a[0]), b = this.parseStyle(b, a[0]); else for (d in b = this.parseStyle(c, a[0]), c = {}, b)c[d] = CSSStyleSubject.getStyle(a[0], d);
        for (d in c)c[d] == b[d] && (delete c[d], delete b[d]);
        var g, f, h, e;
        for (d in c) {
            var k = String(c[d]), m = String(b[d]);
            if (null == b[d])window.DEBUG && alert("No to style provided for '" + d + '"'); else {
                if (h = ColorStyleSubject.parseColor(k))e = ColorStyleSubject.parseColor(m), f = ColorStyleSubject;
                else if (k.match(CSSStyleSubject.numericalRe) && m.match(CSSStyleSubject.numericalRe))h = parseFloat(k), e = parseFloat(m), f = NumericalStyleSubject, g = CSSStyleSubject.numericalRe.exec(k), m = CSSStyleSubject.numericalRe.exec(m), g = null != g[1] ? g[1] : null != m[1] ? m[1] : m; else if (k.match(CSSStyleSubject.discreteRe) && m.match(CSSStyleSubject.discreteRe))h = k, e = m, f = DiscreteStyleSubject, g = 0; else {
                    window.DEBUG && alert("Unrecognised format for value of " + d + ": '" + c[d] + "'");
                    continue
                }
                this.subjects[this.subjects.length] = new f(a, d,
                    h, e, g)
            }
        }
    }
}
CSSStyleSubject.prototype = {
    parseStyle: function (a, c) {
        var b = {};
        if (-1 != a.indexOf(":"))for (var d = a.split(";"), g = 0; g < d.length; g++) {
            var f = CSSStyleSubject.ruleRe.exec(d[g]);
            f && (b[f[1]] = f[2])
        } else {
            var h;
            h = c.className;
            c.className = a;
            for (g = 0; g < CSSStyleSubject.cssProperties.length; g++)d = CSSStyleSubject.cssProperties[g], f = CSSStyleSubject.getStyle(c, d), null != f && (b[d] = f);
            c.className = h
        }
        return b
    }, setState: function (a) {
        for (var c = 0; c < this.subjects.length; c++)this.subjects[c].setState(a)
    }, inspect: function () {
        for (var a = "",
                 c = 0; c < this.subjects.length; c++)a += this.subjects[c].inspect();
        return a
    }
};
CSSStyleSubject.getStyle = function (a, c) {
    var b;
    if (document.defaultView && document.defaultView.getComputedStyle && (b = document.defaultView.getComputedStyle(a, "").getPropertyValue(c)))return b;
    c = Animator.camelize(c);
    a.currentStyle && (b = a.currentStyle[c]);
    return b || a.style[c]
};
CSSStyleSubject.ruleRe = /^\s*([a-zA-Z\-]+)\s*:\s*(\S(.+\S)?)\s*$/;
CSSStyleSubject.numericalRe = /^-?\d+(?:\.\d+)?(%|[a-zA-Z]{2})?$/;
CSSStyleSubject.discreteRe = /^\w+$/;
CSSStyleSubject.cssProperties = "azimuth background background-attachment background-color background-image background-position background-repeat border-collapse border-color border-spacing border-style border-top border-top-color border-right-color border-bottom-color border-left-color border-top-style border-right-style border-bottom-style border-left-style border-top-width border-right-width border-bottom-width border-left-width border-width bottom clear clip color content cursor direction display elevation empty-cells css-float font font-family font-size font-size-adjust font-stretch font-style font-variant font-weight height left letter-spacing line-height list-style list-style-image list-style-position list-style-type margin margin-top margin-right margin-bottom margin-left max-height max-width min-height min-width orphans outline outline-color outline-style outline-width overflow padding padding-top padding-right padding-bottom padding-left pause position right size table-layout text-align text-decoration text-indent text-shadow text-transform top vertical-align visibility white-space width word-spacing z-index opacity outline-offset overflow-x overflow-y".split(" ");
function AnimatorChain(a, c) {
    this.animators = a;
    this.setOptions(c);
    for (var b = 0; b < this.animators.length; b++)this.listenTo(this.animators[b]);
    this.forwards = !1;
    this.current = 0
}
AnimatorChain.prototype = {
    setOptions: function (a) {
        this.options = Animator.applyDefaults({resetOnPlay: !0}, a)
    }, play: function () {
        this.forwards = !0;
        this.current = -1;
        if (this.options.resetOnPlay)for (var a = 0; a < this.animators.length; a++)this.animators[a].jumpTo(0);
        this.advance()
    }, reverse: function () {
        this.forwards = !1;
        this.current = this.animators.length;
        if (this.options.resetOnPlay)for (var a = 0; a < this.animators.length; a++)this.animators[a].jumpTo(1);
        this.advance()
    }, toggle: function () {
        this.forwards ? this.seekTo(0) : this.seekTo(1)
    },
    listenTo: function (a) {
        var c = a.options.onComplete, b = this;
        a.options.onComplete = function () {
            c && c.call(a);
            b.advance()
        }
    }, advance: function () {
        this.forwards ? null != this.animators[this.current + 1] && (this.current++, this.animators[this.current].play()) : null != this.animators[this.current - 1] && (this.current--, this.animators[this.current].reverse())
    }, seekTo: function (a) {
        0 >= a ? (this.forwards = !1, this.animators[this.current].seekTo(0)) : (this.forwards = !0, this.animators[this.current].seekTo(1))
    }
};
function Accordion(a) {
    this.setOptions(a);
    a = this.options.initialSection;
    var c;
    this.options.rememberance && (c = document.location.hash.substring(1));
    this.rememberanceTexts = [];
    this.ans = [];
    for (var b = this, d = 0; d < this.options.sections.length; d++) {
        var g = this.options.sections[d], f = new Animator(this.options.animatorOptions);
        f.addSubject(new NumericalStyleSubject(g, this.options.property, this.options.from + this.options.shift * d, this.options.to + this.options.shift * d, this.options.units));
        f.jumpTo(0);
        g = this.options.getActivator(g);
        g.index = d;
        g.onclick = function () {
            b.show(this.index)
        };
        this.ans[this.ans.length] = f;
        this.rememberanceTexts[d] = g.innerHTML.replace(/\s/g, "");
        this.rememberanceTexts[d] === c && (a = d)
    }
    this.show(a)
}
Accordion.prototype = {
    setOptions: function (a) {
        this.options = Object.extend({
            sections: null, getActivator: function (a) {
                return document.getElementById(a.getAttribute("activator"))
            }, shift: 0, initialSection: 0, rememberance: !0, animatorOptions: {}
        }, a || {})
    }, show: function (a) {
        for (var c = 0; c < this.ans.length; c++)this.ans[c].seekTo(c > a ? 1 : 0);
        this.options.rememberance && (document.location.hash = this.rememberanceTexts[a])
    }
};
var threeSixtyPlayer, ThreeSixtyPlayer;
(function (a) {
    function c() {
        var b = this, c = this, g = soundManager, f = navigator.userAgent, h = f.match(/msie/i), e = f.match(/opera/i), k = f.match(/safari/i), m = f.match(/chrome/i);
        f.match(/firefox/i);
        var q = f.match(/ipad|iphone/i), r = "undefined" === typeof a.G_vmlCanvasManager && "undefined" !== typeof document.createElement("canvas").getContext("2d"), n = e || m ? 359.9 : 360, t = navigator.userAgent.match(/msie [678]/i) ? 1 : 2;
        this.excludeClass = "threesixty-exclude";
        this.links = [];
        this.sounds = [];
        this.soundsByURL = [];
        this.indexByURL = [];
        this.lastTouchedSound =
            this.lastSound = null;
        this.soundCount = 0;
        this.vuMeter = this.oUIImageMap = this.oUITemplate = null;
        this.callbackCount = 0;
        this.peakDataHistory = [];
        this.config = {
            playNext: !1,
            autoPlay: !1,
            allowMultiple: !1,
            loadRingColor: "#ccc",
            playRingColor: "#000",
            backgroundRingColor: "#eee",
            segmentRingColor: "rgba(255,255,255,0.33)",
            segmentRingColorAlt: "rgba(0,0,0,0.1)",
            loadRingColorMetadata: "#ddd",
            playRingColorMetadata: "rgba(128,192,256,0.9)",
            circleDiameter: null,
            circleRadius: null,
            animDuration: 500,
            animTransition: a.Animator.tx.bouncy,
            showHMSTime: !1,
            scaleFont: !0,
            useWaveformData: !1,
            waveformDataColor: "#0099ff",
            waveformDataDownsample: 3,
            waveformDataOutside: !1,
            waveformDataConstrain: !1,
            waveformDataLineRatio: .64,
            useEQData: !1,
            eqDataColor: "#339933",
            eqDataDownsample: 4,
            eqDataOutside: !0,
            eqDataLineRatio: .54,
            usePeakData: !0,
            peakDataColor: "#ff33ff",
            peakDataOutside: !0,
            peakDataLineRatio: .5,
            useAmplifier: !0,
            fontSizeMax: null,
            scaleArcWidth: 1,
            useFavIcon: !1
        };
        this.css = {sDefault: "sm2_link", sBuffering: "sm2_buffering", sPlaying: "sm2_playing", sPaused: "sm2_paused"};
        this.addEventHandler = "undefined" !== typeof a.addEventListener ? function (a, b, c) {
            return a.addEventListener(b, c, !1)
        } : function (a, b, c) {
            a.attachEvent("on" + b, c)
        };
        this.removeEventHandler = "undefined" !== typeof a.removeEventListener ? function (a, b, c) {
            return a.removeEventListener(b, c, !1)
        } : function (a, b, c) {
            return a.detachEvent("on" + b, c)
        };
        this.hasClass = function (a, b) {
            return "undefined" !== typeof a.className ? a.className.match(new RegExp("(\\s|^)" + b + "(\\s|$)")) : !1
        };
        this.addClass = function (a, c) {
            if (!a || !c || b.hasClass(a, c))return !1;
            a.className = (a.className ? a.className + " " : "") + c
        };
        this.removeClass = function (a, c) {
            if (!a || !c || !b.hasClass(a, c))return !1;
            a.className = a.className.replace(new RegExp("( " + c + ")|(" + c + ")", "g"), "")
        };
        this.getElementsByClassName = function (a, c, e) {
            var d = e || document;
            e = [];
            var f, k = [];
            if ("undefined" !== typeof c && "string" !== typeof c)for (f = c.length; f--;)k && k[c[f]] || (k[c[f]] = d.getElementsByTagName(c[f])); else k = c ? d.getElementsByTagName(c) : d.all || d.getElementsByTagName("*");
            if ("string" !== typeof c)for (f = c.length; f--;)for (d =
                                                                       k[c[f]].length; d--;)b.hasClass(k[c[f]][d], a) && e.push(k[c[f]][d]); else for (f = 0; f < k.length; f++)b.hasClass(k[f], a) && e.push(k[f]);
            return e
        };
        this.getParentByNodeName = function (a, b) {
            if (!a || !b)return !1;
            for (b = b.toLowerCase(); a.parentNode && b !== a.parentNode.nodeName.toLowerCase();)a = a.parentNode;
            return a.parentNode && b === a.parentNode.nodeName.toLowerCase() ? a.parentNode : null
        };
        this.getParentByClassName = function (a, c) {
            if (!a || !c)return !1;
            for (; a.parentNode && !b.hasClass(a.parentNode, c);)a = a.parentNode;
            return a.parentNode &&
            b.hasClass(a.parentNode, c) ? a.parentNode : null
        };
        this.getSoundByURL = function (a) {
            return "undefined" !== typeof b.soundsByURL[a] ? b.soundsByURL[a] : null
        };
        this.isChildOfNode = function (a, b) {
            if (!a || !a.parentNode)return !1;
            b = b.toLowerCase();
            do a = a.parentNode; while (a && a.parentNode && a.nodeName.toLowerCase() !== b);
            return a && a.nodeName.toLowerCase() === b ? a : null
        };
        this.isChildOfClass = function (a, c) {
            if (!a || !c)return !1;
            for (; a.parentNode && !b.hasClass(a, c);)a = b.findParent(a);
            return b.hasClass(a, c)
        };
        this.findParent = function (a) {
            if (!a || !a.parentNode)return !1;
            a = a.parentNode;
            if (2 === a.nodeType)for (; a && a.parentNode && 2 === a.parentNode.nodeType;)a = a.parentNode;
            return a
        };
        this.getStyle = function (b, c) {
            try {
                if (b.currentStyle)return b.currentStyle[c];
                if (a.getComputedStyle)return document.defaultView.getComputedStyle(b, null).getPropertyValue(c)
            } catch (e) {
            }
            return null
        };
        this.findXY = function (a) {
            var b = 0, c = 0;
            do b += a.offsetLeft, c += a.offsetTop; while (a = a.offsetParent);
            return [b, c]
        };
        this.getMouseXY = function (c) {
            c = c ? c : a.event;
            q && c.touches && (c = c.touches[0]);
            if (c.pageX || c.pageY)return [c.pageX, c.pageY];
            if (c.clientX || c.clientY)return [c.clientX + b.getScrollLeft(), c.clientY + b.getScrollTop()]
        };
        this.getScrollLeft = function () {
            return document.body.scrollLeft + document.documentElement.scrollLeft
        };
        this.getScrollTop = function () {
            return document.body.scrollTop + document.documentElement.scrollTop
        };
        this.events = {
            play: function () {
                c.removeClass(this._360data.oUIBox, this._360data.className);
                this._360data.className = c.css.sPlaying;
                c.addClass(this._360data.oUIBox, this._360data.className);
                b.fanOut(this)
            }, stop: function () {
                c.removeClass(this._360data.oUIBox, this._360data.className);
                this._360data.className = "";
                b.fanIn(this)
            }, pause: function () {
                c.removeClass(this._360data.oUIBox, this._360data.className);
                this._360data.className = c.css.sPaused;
                c.addClass(this._360data.oUIBox, this._360data.className)
            }, resume: function () {
                c.removeClass(this._360data.oUIBox, this._360data.className);
                this._360data.className = c.css.sPlaying;
                c.addClass(this._360data.oUIBox, this._360data.className)
            }, finish: function () {
                var a;
                c.removeClass(this._360data.oUIBox, this._360data.className);
                this._360data.className = "";
                this._360data.didFinish = !0;
                b.fanIn(this);
                c.config.playNext && (a = c.indexByURL[this._360data.oLink.href] + 1, a < c.links.length && c.handleClick({target: c.links[a]}))
            }, whileloading: function () {
                this.paused && b.updatePlaying.apply(this)
            }, whileplaying: function () {
                b.updatePlaying.apply(this);
                this._360data.fps++
            }, bufferchange: function () {
                this.isBuffering ? c.addClass(this._360data.oUIBox, c.css.sBuffering) : c.removeClass(this._360data.oUIBox,
                    c.css.sBuffering)
            }
        };
        this.stopEvent = function (b) {
            "undefined" !== typeof b && "undefined" !== typeof b.preventDefault ? b.preventDefault() : "undefined" !== typeof a.event && "undefined" !== typeof a.event.returnValue && (a.event.returnValue = !1);
            return !1
        };
        this.getTheDamnLink = h ? function (b) {
            return b && b.target ? b.target : a.event.srcElement
        } : function (a) {
            return a.target
        };
        this.handleClick = function (c) {
            if (1 < c.button)return !0;
            var e = b.getTheDamnLink(c), d, f, k, h, m, n;
            if ("a" !== e.nodeName.toLowerCase() && (e = b.isChildOfNode(e, "a"), !e) || !b.isChildOfClass(e, "ui360"))return !0;
            e.getAttribute("href");
            if (!e.href || !g.canPlayLink(e) || b.hasClass(e, b.excludeClass))return !0;
            g._writeDebug("handleClick()");
            f = e.href;
            (k = b.getSoundByURL(f)) ? k === b.lastSound ? k.togglePause() : (k.togglePause(), g._writeDebug("sound different than last sound: " + b.lastSound.id), !b.config.allowMultiple && b.lastSound && b.stopSound(b.lastSound)) : (h = e.parentNode, m = b.getElementsByClassName("ui360-vis", "div", h.parentNode).length, k = g.createSound({
                id: "ui360Sound" + b.soundCount++,
                url: f,
                onplay: b.events.play,
                onstop: b.events.stop,
                onpause: b.events.pause,
                onresume: b.events.resume,
                onfinish: b.events.finish,
                onbufferchange: b.events.bufferchange,
                type: e.type || null,
                whileloading: b.events.whileloading,
                whileplaying: b.events.whileplaying,
                useWaveformData: m && b.config.useWaveformData,
                useEQData: m && b.config.useEQData,
                usePeakData: m && b.config.usePeakData
            }), n = parseInt(b.getElementsByClassName("sm2-360ui", "div", h)[0].offsetWidth * t, 10), d = b.getElementsByClassName("sm2-canvas", "canvas", h), k._360data =
            {
                oUI360: b.getParentByClassName(e, "ui360"),
                oLink: e,
                className: b.css.sPlaying,
                oUIBox: b.getElementsByClassName("sm2-360ui", "div", h)[0],
                oCanvas: d[d.length - 1],
                oButton: b.getElementsByClassName("sm2-360btn", "span", h)[0],
                oTiming: b.getElementsByClassName("sm2-timing", "div", h)[0],
                oCover: b.getElementsByClassName("sm2-cover", "div", h)[0],
                circleDiameter: n,
                circleRadius: n / 2,
                lastTime: null,
                didFinish: null,
                pauseCount: 0,
                radius: 0,
                fontSize: 1,
                fontSizeMax: b.config.fontSizeMax,
                scaleFont: m && b.config.scaleFont,
                showHMSTime: m,
                amplifier: m && b.config.usePeakData ? .9 : 1,
                radiusMax: .175 * n,
                width: 0,
                widthMax: .4 * n,
                lastValues: {bytesLoaded: 0, bytesTotal: 0, position: 0, durationEstimate: 0},
                animating: !1,
                oAnim: new a.Animator({
                    duration: b.config.animDuration,
                    transition: b.config.animTransition,
                    onComplete: function () {
                    }
                }),
                oAnimProgress: function (a) {
                    this._360data.radius = parseInt(this._360data.radiusMax * this._360data.amplifier * a, 10);
                    this._360data.width = parseInt(this._360data.widthMax * this._360data.amplifier * a, 10);
                    this._360data.scaleFont && null !== this._360data.fontSizeMax &&
                    (this._360data.oTiming.style.fontSize = parseInt(Math.max(1, this._360data.fontSizeMax * a), 10) + "px", this._360data.oTiming.style.opacity = a);
                    (this.paused || 0 === this.playState || 0 === this._360data.lastValues.bytesLoaded || 0 === this._360data.lastValues.position) && b.updatePlaying.apply(this)
                },
                fps: 0
            }, "undefined" !== typeof b.Metadata && b.getElementsByClassName("metadata", "div", k._360data.oUI360).length && (k._360data.metadata = new b.Metadata(k, b)), k._360data.scaleFont && null !== k._360data.fontSizeMax && (k._360data.oTiming.style.fontSize =
                "1px"), k._360data.oAnim.addSubject(k._360data.oAnimProgress, k), b.refreshCoords(k), b.updatePlaying.apply(k), b.soundsByURL[f] = k, b.sounds.push(k), !b.config.allowMultiple && b.lastSound && b.stopSound(b.lastSound), k.play());
            b.lastSound = k;
            "undefined" !== typeof c && "undefined" !== typeof c.preventDefault ? c.preventDefault() : "undefined" !== typeof a.event && (a.event.returnValue = !1);
            return !1
        };
        this.fanOut = function (c) {
            if (1 === c._360data.animating)return !1;
            c._360data.animating = 0;
            soundManager._writeDebug("fanOut: " + c.id +
                ": " + c._360data.oLink.href);
            c._360data.oAnim.seekTo(1);
            a.setTimeout(function () {
                c._360data.animating = 0
            }, b.config.animDuration + 20)
        };
        this.fanIn = function (c) {
            if (-1 === c._360data.animating)return !1;
            c._360data.animating = -1;
            soundManager._writeDebug("fanIn: " + c.id + ": " + c._360data.oLink.href);
            c._360data.oAnim.seekTo(0);
            a.setTimeout(function () {
                c._360data.didFinish = !1;
                c._360data.animating = 0;
                b.resetLastValues(c)
            }, b.config.animDuration + 20)
        };
        this.resetLastValues = function (a) {
            a._360data.lastValues.position = 0
        };
        this.refreshCoords =
            function (a) {
                a._360data.canvasXY = b.findXY(a._360data.oCanvas);
                a._360data.canvasMid = [a._360data.circleRadius, a._360data.circleRadius];
                a._360data.canvasMidXY = [a._360data.canvasXY[0] + a._360data.canvasMid[0], a._360data.canvasXY[1] + a._360data.canvasMid[1]]
            };
        this.stopSound = function (a) {
            soundManager._writeDebug("stopSound: " + a.id);
            soundManager.stop(a.id);
            q || soundManager.unload(a.id)
        };
        this.buttonClick = function (c) {
            b.handleClick({
                target: b.getParentByClassName(c ? c.target ? c.target : c.srcElement : a.event.srcElement,
                    "sm2-360ui").nextSibling
            });
            return !1
        };
        this.buttonMouseDown = function (a) {
            q ? b.addEventHandler(document, "touchmove", b.mouseDown) : document.onmousemove = function (a) {
                b.mouseDown(a)
            };
            b.stopEvent(a);
            return !1
        };
        this.mouseDown = function (c) {
            if (!q && 1 < c.button)return !0;
            if (!b.lastSound)return b.stopEvent(c), !1;
            var e = c ? c : a.event;
            q && e.touches && (e = e.touches[0]);
            e = b.getSoundByURL(b.getElementsByClassName("sm2_link", "a", b.getParentByClassName(e.target || e.srcElement, "ui360"))[0].href);
            b.lastTouchedSound = e;
            b.refreshCoords(e);
            e = e._360data;
            b.addClass(e.oUIBox, "sm2_dragging");
            e.pauseCount = b.lastTouchedSound.paused ? 1 : 0;
            b.mmh(c ? c : a.event);
            q ? (b.removeEventHandler(document, "touchmove", b.mouseDown), b.addEventHandler(document, "touchmove", b.mmh), b.addEventHandler(document, "touchend", b.mouseUp)) : (document.onmousemove = b.mmh, document.onmouseup = b.mouseUp);
            b.stopEvent(c);
            return !1
        };
        this.mouseUp = function (a) {
            a = b.lastTouchedSound._360data;
            b.removeClass(a.oUIBox, "sm2_dragging");
            0 === a.pauseCount && b.lastTouchedSound.resume();
            q ? (b.removeEventHandler(document,
                "touchmove", b.mmh), b.removeEventHandler(document, "touchend", b.mouseUP)) : (document.onmousemove = null, document.onmouseup = null)
        };
        this.mmh = function (c) {
            "undefined" === typeof c && (c = a.event);
            var e = b.lastTouchedSound, d = b.getMouseXY(c), d = Math.floor(n - (b.rad2deg(Math.atan2(d[0] - e._360data.canvasMidXY[0], d[1] - e._360data.canvasMidXY[1])) + 180));
            e.setPosition(d / n * e.durationEstimate);
            b.stopEvent(c);
            return !1
        };
        this.drawSolidArc = function (a, c, d, f, h, g, m) {
            var n = a, q;
            n.getContext && (q = n.getContext("2d"));
            a = q;
            m || b.clearCanvas(n);
            c && (q.fillStyle = c);
            a.beginPath();
            isNaN(h) && (h = 0);
            c = d - f;
            f = e || k;
            if (!f || f && 0 < d)a.arc(0, 0, d, g, h, !1), d = b.getArcEndpointCoords(c, h), a.lineTo(d.x, d.y), a.arc(0, 0, c, h, g, !0), a.closePath(), a.fill()
        };
        this.getArcEndpointCoords = function (a, b) {
            return {x: a * Math.cos(b), y: a * Math.sin(b)}
        };
        this.deg2rad = function (a) {
            return a * Math.PI / 180
        };
        this.rad2deg = function (a) {
            return 180 * a / Math.PI
        };
        this.getTime = function (a, b) {
            var c = Math.floor(a / 1E3), e = Math.floor(c / 60), c = c - 60 * e;
            return b ? e + ":" + (10 > c ? "0" + c : c) : {min: e, sec: c}
        };
        this.clearCanvas =
            function (a) {
                var b = null, c;
                a.getContext && (b = a.getContext("2d"));
                b && (c = a.offsetWidth, a = a.offsetHeight, b.clearRect(-(c / 2), -(a / 2), c, a))
            };
        this.updatePlaying = function () {
            var a = this._360data.showHMSTime ? b.getTime(this.position, !0) : parseInt(this.position / 1E3, 10), c = b.config.scaleArcWidth;
            this.bytesLoaded && (this._360data.lastValues.bytesLoaded = this.bytesLoaded, this._360data.lastValues.bytesTotal = this.bytesTotal);
            this.position && (this._360data.lastValues.position = this.position);
            this.durationEstimate && (this._360data.lastValues.durationEstimate =
                this.durationEstimate);
            b.drawSolidArc(this._360data.oCanvas, b.config.backgroundRingColor, this._360data.width, this._360data.radius * c, b.deg2rad(n), !1);
            b.drawSolidArc(this._360data.oCanvas, this._360data.metadata ? b.config.loadRingColorMetadata : b.config.loadRingColor, this._360data.width, this._360data.radius * c, b.deg2rad(this._360data.lastValues.bytesLoaded / this._360data.lastValues.bytesTotal * n), 0, !0);
            0 !== this._360data.lastValues.position && b.drawSolidArc(this._360data.oCanvas, this._360data.metadata ? b.config.playRingColorMetadata :
                b.config.playRingColor, this._360data.width, this._360data.radius * c, b.deg2rad(1 === this._360data.didFinish ? n : this._360data.lastValues.position / this._360data.lastValues.durationEstimate * n), 0, !0);
            this._360data.metadata && this._360data.metadata.events.whileplaying();
            a !== this._360data.lastTime && (this._360data.lastTime = a, this._360data.oTiming.innerHTML = a);
            (this.instanceOptions.useWaveformData || this.instanceOptions.useEQData) && r && b.updateWaveform(this);
            b.config.useFavIcon && b.vuMeter && b.vuMeter.updateVU(this)
        };
        this.updateWaveform = function (a) {
            if (!b.config.useWaveformData && !b.config.useEQData || !g.features.waveformData && !g.features.eqData || !a.waveformData.left.length && !a.eqData.length && !a.peakData.left)return !1;
            a._360data.oCanvas.getContext("2d");
            var c = parseInt(a._360data.circleDiameter / 2, 10) / 2, e, d, f, k, h, m, n, q, t;
            if (b.config.useWaveformData)for (f = b.config.waveformDataDownsample, f = Math.max(1, f), k = 256 / f, n = b.config.waveformDataOutside ? 1 : b.config.waveformDataConstrain ? .5 : .565, c = b.config.waveformDataOutside ? .7 :
                .75, q = b.deg2rad(360 / k * b.config.waveformDataLineRatio), e = 0; 256 > e; e += f)h = b.deg2rad(e / k * 1 / f * 360), m = h + q, d = a.waveformData.left[e], 0 > d && b.config.waveformDataConstrain && (d = Math.abs(d)), b.drawSolidArc(a._360data.oCanvas, b.config.waveformDataColor, a._360data.width * n * (2 - b.config.scaleArcWidth), a._360data.radius * c * 1.25 * d, m, h, !0);
            if (b.config.useEQData)for (f = b.config.eqDataDownsample, f = Math.max(1, f), k = 192, n = b.config.eqDataOutside ? 1 : .565, d = b.config.eqDataOutside ? -1 : 1, c = b.config.eqDataOutside ? .5 : .75, q = b.deg2rad(360 /
                (k / f) * b.config.eqDataLineRatio), t = b.deg2rad(1 === a._360data.didFinish ? 360 : a._360data.lastValues.position / a._360data.lastValues.durationEstimate * 360), e = 0; e < k; e += f)h = b.deg2rad(e / k * 360), m = h + q, b.drawSolidArc(a._360data.oCanvas, m > t ? b.config.eqDataColor : b.config.playRingColor, a._360data.width * n, a._360data.radius * c * a.eqData.left[e] * d, m, h, !0);
            if (b.config.usePeakData && !a._360data.animating) {
                c = a.peakData.left || a.peakData.right;
                k = 3;
                for (e = 0; e < k; e++)c = c || a.eqData[e];
                a._360data.amplifier = b.config.useAmplifier ? .9 +
                .1 * c : 1;
                a._360data.radiusMax = .175 * a._360data.circleDiameter * a._360data.amplifier;
                a._360data.widthMax = .4 * a._360data.circleDiameter * a._360data.amplifier;
                a._360data.radius = parseInt(a._360data.radiusMax * a._360data.amplifier, 10);
                a._360data.width = parseInt(a._360data.widthMax * a._360data.amplifier, 10)
            }
        };
        this.getUIHTML = function (a) {
            return ['<canvas class="sm2-canvas" width="' + a + '" height="' + a + '"></canvas>', ' <span class="sm2-360btn sm2-360btn-default"></span>', ' <div class="sm2-timing' + (navigator.userAgent.match(/safari/i) ?
                " alignTweak" : "") + '"></div>', ' <div class="sm2-cover"></div>']
        };
        this.uiTest = function (a) {
            var c = document.createElement("div"), e, d, f;
            c.className = "sm2-360ui";
            e = document.createElement("div");
            e.className = "ui360" + (a ? " " + a : "");
            c = e.appendChild(c.cloneNode(!0));
            e.style.position = "absolute";
            e.style.left = "-9999px";
            a = document.body.appendChild(e);
            d = c.offsetWidth * t;
            f = b.getUIHTML(d);
            c.innerHTML = f[1] + f[2] + f[3];
            c = parseInt(d, 10);
            d = parseInt(c / 2, 10);
            a = b.getElementsByClassName("sm2-timing", "div", a)[0];
            a = parseInt(b.getStyle(a,
                "font-size"), 10);
            isNaN(a) && (a = null);
            e.parentNode.removeChild(e);
            return {circleDiameter: c, circleRadius: d, fontSizeMax: a}
        };
        this.init = function () {
            g._writeDebug("threeSixtyPlayer.init()");
            var c = b.getElementsByClassName("ui360", "div"), e, d, f = [], k = !1, m = 0, n, r, w, v, z;
            e = 0;
            for (d = c.length; e < d; e++)f.push(c[e].getElementsByTagName("a")[0]), c[e].style.backgroundImage = "none";
            b.oUITemplate = document.createElement("div");
            b.oUITemplate.className = "sm2-360ui";
            b.oUITemplateVis = document.createElement("div");
            b.oUITemplateVis.className =
                "sm2-360ui";
            r = b.uiTest();
            b.config.circleDiameter = r.circleDiameter;
            b.config.circleRadius = r.circleRadius;
            w = b.uiTest("ui360-vis");
            b.config.fontSizeMax = w.fontSizeMax;
            b.oUITemplate.innerHTML = b.getUIHTML(b.config.circleDiameter).join("");
            b.oUITemplateVis.innerHTML = b.getUIHTML(w.circleDiameter).join("");
            e = 0;
            for (d = f.length; e < d; e++)!g.canPlayLink(f[e]) || b.hasClass(f[e], b.excludeClass) || b.hasClass(f[e], b.css.sDefault) || (b.addClass(f[e], b.css.sDefault), b.links[m] = f[e], b.indexByURL[f[e].href] = m, m++, k = b.hasClass(f[e].parentNode,
                "ui360-vis"), n = (k ? w : r).circleDiameter, c = (k ? w : r).circleRadius, k = f[e].parentNode.insertBefore((k ? b.oUITemplateVis : b.oUITemplate).cloneNode(!0), f[e]), h && "undefined" !== typeof a.G_vmlCanvasManager ? (v = document.createElement("canvas"), v.className = "sm2-canvas", z = "sm2_canvas_" + e + (new Date).getTime(), v.id = z, v.width = n, v.height = n, k.appendChild(v), a.G_vmlCanvasManager.initElement(v), n = document.getElementById(z), k = n.parentNode.getElementsByTagName("canvas"), 1 < k.length && (n = k[k.length - 1])) : n = f[e].parentNode.getElementsByTagName("canvas")[0],
            1 < t && b.addClass(n, "hi-dpi"), k = b.getElementsByClassName("sm2-cover", "div", f[e].parentNode)[0], v = f[e].parentNode.getElementsByTagName("span")[0], b.addEventHandler(v, "click", b.buttonClick), q ? b.addEventHandler(k, "touchstart", b.mouseDown) : b.addEventHandler(k, "mousedown", b.mouseDown), n = n.getContext("2d"), n.translate(c, c), n.rotate(b.deg2rad(-90)));
            0 < m && (b.addEventHandler(document, "click", b.handleClick), b.config.autoPlay && b.handleClick({
                target: b.links[0],
                preventDefault: function () {
                }
            }));
            g._writeDebug("threeSixtyPlayer.init(): Found " +
                m + " relevant items.");
            b.config.useFavIcon && "undefined" !== typeof this.VUMeter && (this.vuMeter = new this.VUMeter(this))
        }
    }

    c.prototype.VUMeter = function (a) {
        var c = this, g = document.getElementsByTagName("head")[0], f = navigator.userAgent.match(/opera/i), h = navigator.userAgent.match(/firefox/i);
        this.vuMeterData = [];
        this.vuDataCanvas = null;
        this.setPageIcon = function (c) {
            if (!a.config.useFavIcon || !a.config.usePeakData || !c)return !1;
            var d = document.getElementById("sm2-favicon");
            d && (g.removeChild(d), d = null);
            d || (d = document.createElement("link"),
                d.id = "sm2-favicon", d.rel = "shortcut icon", d.type = "image/png", d.href = c, document.getElementsByTagName("head")[0].appendChild(d))
        };
        this.resetPageIcon = function () {
            if (!a.config.useFavIcon)return !1;
            var c = document.getElementById("favicon");
            c && (c.href = "/favicon.ico")
        };
        this.updateVU = function (e) {
            9 <= soundManager.flashVersion && a.config.useFavIcon && a.config.usePeakData && c.setPageIcon(c.vuMeterData[parseInt(16 * e.peakData.left, 10)][parseInt(16 * e.peakData.right, 10)])
        };
        this.createVUData = function () {
            var a = 0, b = 0, f = c.vuDataCanvas.getContext("2d"),
                h = f.createLinearGradient(0, 16, 0, 0), g = f.createLinearGradient(0, 16, 0, 0);
            h.addColorStop(0, "rgb(0,192,0)");
            h.addColorStop(.3, "rgb(0,255,0)");
            h.addColorStop(.625, "rgb(255,255,0)");
            h.addColorStop(.85, "rgb(255,0,0)");
            g.addColorStop(0, "rgba(0,0,0,0.2)");
            g.addColorStop(1, "rgba(0,0,0,0.5)");
            for (a = 0; 16 > a; a++)c.vuMeterData[a] = [];
            for (a = 0; 16 > a; a++)for (b = 0; 16 > b; b++)c.vuDataCanvas.setAttribute("width", 16), c.vuDataCanvas.setAttribute("height", 16), f.fillStyle = g, f.fillRect(0, 0, 7, 15), f.fillRect(8, 0, 7, 15), f.fillStyle =
                h, f.fillRect(0, 15 - a, 7, 16 - (16 - a)), f.fillRect(8, 15 - b, 7, 16 - (16 - b)), f.clearRect(0, 3, 16, 1), f.clearRect(0, 7, 16, 1), f.clearRect(0, 11, 16, 1), c.vuMeterData[a][b] = c.vuDataCanvas.toDataURL("image/png")
        };
        this.testCanvas = function () {
            var a = document.createElement("canvas"), b = null;
            if (!a || "undefined" === typeof a.getContext)return null;
            b = a.getContext("2d");
            if (!b || "function" !== typeof a.toDataURL)return null;
            try {
                a.toDataURL("image/png")
            } catch (c) {
                return null
            }
            return a
        };
        this.init = function () {
            a.config.useFavIcon && (c.vuDataCanvas =
                c.testCanvas(), c.vuDataCanvas && (h || f) ? c.createVUData() : a.config.useFavIcon = !1)
        };
        this.init()
    };
    c.prototype.Metadata = function (a, c) {
        soundManager._wD("Metadata()");
        var g = this, f = a._360data.oUI360, h = f.getElementsByTagName("ul")[0].getElementsByTagName("li");
        navigator.userAgent.match(/firefox/i);
        var e;
        this.lastWPExec = 0;
        this.refreshInterval = 250;
        this.totalTime = 0;
        this.events = {
            whileplaying: function () {
                var e = a._360data.width, f = a._360data.radius, h = a.durationEstimate || 1E3 * g.totalTime, r = null, n, t;
                n = 0;
                for (t = g.data.length; n <
                t; n++)r = 0 === n % 2, c.drawSolidArc(a._360data.oCanvas, r ? c.config.segmentRingColorAlt : c.config.segmentRingColor, e, f / 2, c.deg2rad(g.data[n].endTimeMS / h * 360), c.deg2rad((g.data[n].startTimeMS || 1) / h * 360), !0);
                e = new Date;
                e - g.lastWPExec > g.refreshInterval && (g.refresh(), g.lastWPExec = e)
            }
        };
        this.refresh = function () {
            var c, e, d = null, f = a.position, h = a._360data.metadata.data;
            c = 0;
            for (e = h.length; c < e; c++)if (f >= h[c].startTimeMS && f <= h[c].endTimeMS) {
                d = c;
                break
            }
            d !== h.currentItem && d < h.length && (a._360data.oLink.innerHTML = h.mainTitle +
                ' <span class="metadata"><span class="sm2_divider"> | </span><span class="sm2_metadata">' + h[d].title + "</span></span>", h.currentItem = d)
        };
        this.strToTime = function (a) {
            a = a.split(":");
            var b = 0, c;
            for (c = a.length; c--;)b += parseInt(a[c], 10) * Math.pow(60, a.length - 1 - c);
            return b
        };
        this.data = [];
        this.data.givenDuration = null;
        this.data.currentItem = null;
        this.data.mainTitle = a._360data.oLink.innerHTML;
        for (e = 0; e < h.length; e++)this.data[e] = {
            o: null,
            title: h[e].getElementsByTagName("p")[0].innerHTML,
            startTime: h[e].getElementsByTagName("span")[0].innerHTML,
            startSeconds: g.strToTime(h[e].getElementsByTagName("span")[0].innerHTML.replace(/[()]/g, "")),
            duration: 0,
            durationMS: null,
            startTimeMS: null,
            endTimeMS: null,
            oNote: null
        };
        f = c.getElementsByClassName("duration", "div", f);
        this.data.givenDuration = f.length ? 1E3 * g.strToTime(f[0].innerHTML) : 0;
        for (e = 0; e < this.data.length; e++)this.data[e].duration = parseInt(this.data[e + 1] ? this.data[e + 1].startSeconds : (g.data.givenDuration ? g.data.givenDuration : a.durationEstimate) / 1E3, 10) - this.data[e].startSeconds, this.data[e].startTimeMS =
            1E3 * this.data[e].startSeconds, this.data[e].durationMS = 1E3 * this.data[e].duration, this.data[e].endTimeMS = this.data[e].startTimeMS + this.data[e].durationMS, this.totalTime += this.data[e].duration
    };
    navigator.userAgent.match(/webkit/i) && navigator.userAgent.match(/mobile/i) && soundManager.setup({useHTML5Audio: !0});
    soundManager.setup({
        html5PollingInterval: 50,
        debugMode: a.location.href.match(/debug=1/i),
        consoleOnly: !0,
        flashVersion: 9,
        useHighPerformance: !0
    });
    soundManager.debugMode && a.setInterval(function () {
        var b =
            a.threeSixtyPlayer;
        b && b.lastSound && b.lastSound._360data.fps && "undefined" === typeof a.isHome && (soundManager._writeDebug("fps: ~" + b.lastSound._360data.fps), b.lastSound._360data.fps = 0)
    }, 1E3);
    a.ThreeSixtyPlayer = c
})(window);
threeSixtyPlayer = new ThreeSixtyPlayer;
soundManager.onready(threeSixtyPlayer.init);
(function (a) {
    function c(c, e) {
        function d(a) {
            f.css.add(t.o, a)
        }

        function m(a) {
            f.css.remove(t.o, a)
        }

        function q(a) {
            if (a)if (n.on && n.on[a])n.on[a](n); else if (b.on[a])b.on[a](n)
        }

        function r() {
            0 <= l.tonearm.angle && (t.tonearm.style[f.features.transform.prop] = "rotate(" + l.tonearm.angle + "deg)")
        }

        var n, t, l, p, u;
        p = "tt_" + g;
        g++;
        e = e || {};
        void 0 === e.hideLabelWithArtwork && (e.hideLabelWithArtwork = !0);
        l = {
            power: {turntable: !1, motor: !1, motorVelocity: 0},
            tonearm: {angle: 0, maxAngle: 42, minAngle: 0},
            record: {hasArtwork: !1}
        };
        u = {
            start: function () {
                l.power.turntable && !l.power.motor && (l.power.motor = !0, d("motor-on"), q("start"))
            }, stop: function () {
                l.power.motor && (l.power.motor = !1, m("motor-on"), q("stop"))
            }, toggle: function () {
                l.power.motor ? u.stop() : u.start()
            }, powerOn: function () {
                l.power.turntable || (l.power.turntable = !0, d("power-on"), q("powerOn"))
            }, powerOff: function () {
                l.power.turntable && (l.power.turntable = !1, m("power-on"), q("powerOff"));
                u.stop()
            }, powerToggle: function () {
                l.power.turntable ? u.powerOff() : u.powerOn()
            }, setTonearmAngle: function (a) {
                isNaN(a) || (l.tonearm.angle = Math.max(l.tonearm.minAngle,
                    Math.min(l.tonearm.maxAngle, a)), f.features.transform.prop && (f.features.getAnimationFrame ? f.features.getAnimationFrame(r) : r()))
            }, addSlipmat: function () {
                d("has-slipmat")
            }, removeSlipmat: function () {
                m("has-slipmat")
            }, toggleSlipmat: function () {
                f.css.toggle(t.o, "has-slipmat")
            }, addRecord: function () {
                d("has-record")
            }, removeRecord: function () {
                m("has-record")
            }, toggleRecord: function () {
                f.css.toggle(t.o, "has-record")
            }, setArtwork: function (a) {
                a ? (t.record.style.backgroundImage = "url(" + a + ")", l.record.hasArtwork || (d("has-artwork"),
                    l.record.hasArtwork = !0)) : l.record.hasArtwork && (t.record.style.backgroundImage = "none", m("has-artwork"), l.record.hasArtwork = !1);
                e.hideLabelWithArtwork ? d("hide-label-with-artwork") : m("hide-label-with-artwork")
            }
        };
        t = {
            o: c,
            platter: f.dom.get(c, ".platter"),
            record: f.dom.get(c, ".record"),
            slipmat: f.dom.get(c, ".slipmat"),
            tonearm: f.dom.get(c, ".tonearm")
        };
        t.o.id ? p = t.o.id : t.o.id = p;
        f.events.add(t.o, "mousedown", function (a) {
            var b;
            if ((b = a.target) && (b = b.getAttribute("data-method")) && u[b])u[b](a)
        });
        f.events.add(t.o, "click",
            function (a) {
                if (a.target && "A" === a.target.nodeName)return f.events.preventDefault(a), !1
            });
        a.setTimeout(u.powerToggle, 500);
        return n = {id: p, data: l, methods: u, on: {}}
    }

    var b = [], d = {}, g = 0, f;
    b.on = {};
    f = {
        array: function () {
            return {
                compare: function (a) {
                    var b;
                    return function (c, d) {
                        return b = c[a] < d[a] ? -1 : c[a] > d[a] ? 1 : 0
                    }
                }, shuffle: function (a) {
                    var b, c, d;
                    for (b = a.length - 1; 0 < b; b--)c = Math.floor(Math.random() * (b + 1)), d = a[b], a[b] = a[c], a[c] = d;
                    return a
                }
            }
        }(), css: function () {
            function a(b, c) {
                return void 0 !== b.className ? (new RegExp("(^|\\s)" +
                    c + "(\\s|$)")).test(b.className) : !1
            }

            function b(c, e) {
                if (!c || !e || a(c, e))return !1;
                c.className = (c.className ? c.className + " " : "") + e
            }

            function c(b, e) {
                if (!b || !e || !a(b, e))return !1;
                b.className = b.className.replace(new RegExp("( " + e + ")|(" + e + ")", "g"), "")
            }

            return {
                has: a, add: b, remove: c, swap: function (a, d, f) {
                    var h = {className: a.className};
                    c(h, d);
                    b(h, f);
                    a.className = h.className
                }, toggle: function (d, f) {
                    var g;
                    g = a(d, f);
                    (g ? c : b)(d, f);
                    return !g
                }
            }
        }(), dom: function () {
            function a(b, c) {
                var d, f, h;
                1 === arguments.length ? (d = document.documentElement,
                    f = b) : (d = b, f = c);
                d && d.querySelectorAll && (h = d.querySelectorAll(f));
                return h
            }

            return {
                get: function () {
                    var b = a.apply(this, arguments);
                    return b && b.length ? b[b.length - 1] : b && 0 === b.length ? null : b
                }, getAll: a
            }
        }(), position: function () {
            return {
                getOffX: function (a) {
                    var b = 0;
                    if (a.offsetParent)for (; a.offsetParent;)b += a.offsetLeft, a = a.offsetParent; else a.x && (b += a.x);
                    return b
                }, getOffY: function (a) {
                    var b = 0;
                    if (a.offsetParent)for (; a.offsetParent;)b += a.offsetTop, a = a.offsetParent; else a.y && (b += a.y);
                    return b
                }
            }
        }(), style: function () {
            return {
                get: function (b,
                               c) {
                    var d;
                    b.currentStyle ? d = b.currentStyle[c] : a.getComputedStyle && (d = document.defaultView.getComputedStyle(b, null).getPropertyValue(c));
                    return d
                }
            }
        }(), events: function () {
            var b;
            b = void 0 !== a.removeEventListener ? function (a, b, c) {
                return a.removeEventListener(b, c, !1)
            } : function (a, b, c) {
                return a.detachEvent("on" + b, c)
            };
            return {
                add: function (c, d, f) {
                    a.addEventListener ? c.addEventListener(d, f, !1) : c.attachEvent("on" + d, f);
                    return {
                        detach: function () {
                            return b(c, d, f)
                        }
                    }
                }, preventDefault: function (a) {
                    a.preventDefault ? a.preventDefault() :
                        (a.returnValue = !1, a.cancelBubble = !0);
                    return !1
                }, remove: b
            }
        }(), features: function () {
            function b(a) {
                return void 0 !== r.style[a] ? a : null
            }

            function c(a) {
                try {
                    r.style[n] = a
                } catch (b) {
                    return !1
                }
                return !!r.style[n]
            }

            var d, f, g, r, n;
            r = document.createElement("div");
            d = (f = a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || a.oRequestAnimationFrame || a.msRequestAnimationFrame || null) ? function () {
                return f.apply(a, arguments)
            } : null;
            d = {
                transform: {
                    ie: b("-ms-transform"), moz: b("MozTransform"), opera: b("OTransform"),
                    webkit: b("webkitTransform"), w3: b("transform"), prop: null
                }, rotate: {has3D: !1, prop: null}, getAnimationFrame: d
            };
            d.transform.prop = d.transform.w3 || d.transform.moz || d.transform.webkit || d.transform.ie || d.transform.opera;
            d.transform.prop && (n = d.transform.prop, c("rotate3d(0,0,0,0deg)") ? (d.rotate.has3D = !0, g = "rotate3d") : c("rotate(0deg)") && (g = "rotate"), d.rotate.prop = g);
            r = null;
            return d
        }()
    };
    soundManager.setup({html5PollingInterval: 50, flashVersion: 9});
    soundManager.onready(function () {
        var a, e, g, m;
        if ((a = f.dom.getAll(".turntable")) &&
            a.length)for (e = 0, g = a.length; e < g; e++)m = new c(a[e]), b.push(m), d[m.id] = m
    });
    a.turntables = b;
    a.turntablesById = d;
    a.turntables.utils = f
})(window);
(function (a) {
    var c;

    function b(a) {
        return a && soundManager.canPlayLink(a) && (!e.requireCSS || h.css.has(a, e.requireCSS)) && (!e.excludeCSS || !h.css.has(a, e.excludeCSS))
    }

    function d() {
        var a, b;
        g.on.start = function (a) {
            soundManager.play(a.id, e.soundOptions)
        };
        g.on.stop = function (a) {
            soundManager.pause(a.id);
            k.endOfRecordNoise && k.endOfRecordNoise.stop()
        };
        if (q.load.bind)for (a = 0, b = g.length; a < b; a++)g[a].methods.load = q.load.bind(g[a]);
        g.config = e
    }

    var g, f, h, e, k, m, q, r;
    e = {
        requireCSS: null,
        excludeCSS: "turntable-exclude",
        playNext: !0,
        hasRecordAtStart: !1,
        useEndOfRecordNoise: !0,
        endOfRecordNoise: ["audio/record-noise-1.mp3", "audio/record-noise-2.mp3"],
        htmlAttribute: "data-turntable",
        turntable: {tonearm: {angleToRecord: 16, recordAngleSpan: 26}},
        soundOptions: {
            multiShot: !1, onload: function (a) {
                a || this.duration || f.sound.error.apply(this, arguments)
            }, whileplaying: function () {
                f.sound.whileplaying.apply(this, arguments)
            }, onfinish: function () {
                f.sound.finish.apply(this, arguments)
            }
        }
    };
    c = [];
    k = {endOfRecordNoise: null, soundFinished: !1, lastLink: null};
    m = navigator.userAgent.match(/iphone|ipad|android|tablet|mobile/i);
    f = {
        mouse: {
            click: function (a) {
                var c, d;
                c = a.target;
                if ((!c || "A" !== c.nodeName) && c && c.parentNode) {
                    do c = c.parentNode; while (c && "A" !== c.nodeName && c.parentNode)
                }
                if (b(c))return d = c.getAttribute("data-turntable"), d = turntablesById[d] || g[0], k.lastLink = c, r(d, c.href), d.methods.setArtwork(c.getAttribute("data-artwork") || ""), h.events.preventDefault(a)
            }
        }, sound: {
            whileplaying: function () {
                var a = this.position / this.durationEstimate;
                0 <= a && this._turntable && this._turntable.methods.setTonearmAngle(e.turntable.tonearm.angleToRecord +
                    e.turntable.tonearm.recordAngleSpan * a)
            }, error: function () {
                a.console && console.warn && console.warn("Turntable failed to load " + this.url);
                f.sound.finish.apply(this)
            }, finish: function () {
                var a;
                k.finished = !0;
                if (e.playNext) {
                    a = k.lastLink;
                    var d, g, h, m, q, r, y;
                    y = a.getAttribute(e.htmlAttribute);
                    m = document.getElementsByTagName("a");
                    q = [];
                    g = 0;
                    for (h = m.length; g < h; g++)if (b(m[g]) && (!y || m[g].getAttribute(e.htmlAttribute) === y)) {
                        q.push(m[g]);
                        if (d) {
                            r = m[g];
                            break
                        }
                        a === m[g] && (d = !0)
                    }
                    d || (r = q[0]);
                    r === a && (r = null);
                    (a = r) && f.mouse.click({target: a})
                }
                !a &&
                this._turntable && (e.useEndOfRecordNoise && c.length ? (this._turntable.methods.setTonearmAngle(e.turntable.tonearm.angleToRecord + e.turntable.tonearm.recordAngleSpan), k.endOfRecordNoise = c[parseInt(Math.random() * c.length, 10)], k.endOfRecordNoise.play({loops: 999})) : this._turntable.methods.stop())
            }
        }
    };
    r = function (a, b, c) {
        var d, h;
        d = a || g[0];
        d.id && (h = soundManager.getSoundById(d.id, !0));
        h ? h.url !== b && h.stop() : h = soundManager.createSound({id: d.id, url: b});
        k.finished = !1;
        h._turntable = a;
        e.soundOptions.url = b;
        k.endOfRecordNoise &&
        (k.endOfRecordNoise.stop(), k.endOfRecordNoise = null);
        !d.data.power.motor || h.playState || c || h.play(e.soundOptions);
        d.methods.addSlipmat();
        d.methods.addRecord();
        c || (d.methods.powerOn(), d.methods.start(), f.sound.whileplaying.apply(h))
    };
    q = {
        load: function (a, b) {
            r(this, a, !0);
            b && this.methods.setArtwork(b)
        }
    };
    soundManager.onready(function () {
        var b, k;
        if (!m && e.useEndOfRecordNoise && e.endOfRecordNoise.length)for (b = 0, k = e.endOfRecordNoise.length; b < k; b++)c.push(soundManager.createSound({url: e.endOfRecordNoise[b]}));
        if (e.hasRecordAtStart)for (b =
                                        0, k = g.length; b < k; b++)g[b].methods.addRecord();
        g = a.turntables;
        d();
        h = g.utils;
        h.events.add(document, "click", f.mouse.click)
    })
})(window);
var IS_CHRISTMAS = document.domain.match(/schillmania.com/i) && 11 == (new Date).getMonth() || window.location.toString().match(/christmas/i);
function _id(a) {
    return document.getElementById(a)
}
getSoundByURL = function (a) {
    return "undefined" != typeof self.soundsByURL[a] ? self.soundsByURL[a] : null
};
function init() {
    for (var a = document.getElementById("main"), c = a.getElementsByTagName("dt"), b = c.length; b--;)0 == (b + 1) % 2 && utils.addClass(c[b], "alt");
    c = a.getElementsByTagName("dl");
    for (b = c.length; b--;)0 == (b + 1) % 2 && utils.addClass(c[b], "alt");
    IS_CHRISTMAS && (a = document.body.className.split(" "), a.push("has-lights"), document.body.className = a.join(" "))
}
function Utils() {
    var a = this;
    this.hasClass = function (a, b) {
        return "undefined" != typeof a.className ? (new RegExp("(^|\\s)" + b + "(\\s|$)")).test(a.className) : !1
    };
    this.addClass = function (c, b) {
        if (!c || !b || a.hasClass(c, b))return !1;
        c.className = (c.className ? c.className + " " : "") + b
    };
    this.removeClass = function (c, b) {
        if (!c || !b || !a.hasClass(c, b))return !1;
        c.className = c.className.replace(new RegExp("( " + b + ")|(" + b + ")", "g"), "")
    };
    this.toggleClass = function (c, b) {
        (a.hasClass(c, b) ? a.removeClass : a.addClass)(c, b)
    };
    this.getElementsByClassName =
        function (c, b, d) {
            var g = d || document;
            d = [];
            var f, h = [];
            if ("undefined" != typeof b && "string" != typeof b)for (f = b.length; f--;)h && h[b[f]] || (h[b[f]] = g.getElementsByTagName(b[f])); else h = b ? g.getElementsByTagName(b) : g.all || g.getElementsByTagName("*");
            if ("string" != typeof b)for (f = b.length; f--;)for (g = h[b[f]].length; g--;)a.hasClass(h[b[f]][g], c) && (d[d.length] = h[b[f]][g]); else for (f = 0; f < h.length; f++)a.hasClass(h[f], c) && (d[d.length] = h[f]);
            return d
        };
    this.findParent = function (a) {
        if (!a || !a.parentNode)return !1;
        a = a.parentNode;
        if (2 == a.nodeType)for (; a && a.parentNode && 2 == a.parentNode.nodeType;)a = a.parentNode;
        return a
    };
    this.getOffY = function (a) {
        var b = 0;
        if (a.offsetParent)for (; a.offsetParent;)b += a.offsetTop, a = a.offsetParent; else a.y && (b += a.y);
        return b
    };
    this.isChildOfClass = function (c, b) {
        if (!c || !b)return !1;
        for (; c.parentNode && !a.hasClass(c, b);)c = a.findParent(c);
        return a.hasClass(c, b)
    };
    this.getParentByClassName = function (c, b) {
        if (!c || !b)return !1;
        for (b = b.toLowerCase(); c.parentNode && !a.hasClass(c.parentNode, b);)c = a.findParent(c);
        return c.parentNode &&
        a.hasClass(c.parentNode, b) ? c.parentNode : null
    }
}
var utils = new Utils, lastSelected = null;
function resetFilter(a) {
    var c = null;
    _id("filter-box").style.display = "none";
    utils.removeClass(_id("main"), "filtered");
    for (var b = utils.getElementsByClassName("f-block", ["div", "dl"], _id("main")), d = b.length; d--;)if (b[d].style.display = "block", c = utils.getParentByClassName(b[d], "columnar", _id("main")))c.style.display = "block";
    lastSelected && utils.removeClass(lastSelected, "active");
    a && (lastSelected = a);
    return !1
}
function setFilter(a, c) {
    var b = a ? a.target || a.srcElement : event.srcElement;
    utils.addClass(_id("main"), "filtered");
    var d = b.nodeName.toLowerCase();
    if ("a" == d) {
        var g = utils.findParent(b);
        g && "li" == g.nodeName.toLowerCase() && (b = g, d = b.nodeName.toLowerCase())
    }
    var f = "", g = utils.getElementsByClassName("f-block", ["div", "dl"], _id("main")), h = utils.getElementsByClassName("columnar", "div", _id("main")), e = null, k = [];
    if ("li" != d || "ignore" == b.className)return !0;
    var m = lastSelected && lastSelected == b && utils.hasClass(lastSelected,
            "active");
    if ("li" == d && m)return "undefined" !== typeof a.preventDefault && a.preventDefault(), resetFilter();
    if ("li" == d) {
        f = b.getElementsByTagName("a").length ? b.getElementsByTagName("a")[0].innerHTML : b.innerHTML;
        f = c + f.substr(0, -1 != f.indexOf("(") ? f.indexOf("(") : 999).toLowerCase().replace(/\s+/i, "-");
        d = f.substr(f.length - 1);
        if ("-" == d || " " == d)f = f.substr(0, f.length - 1);
        for (d = g.length; d--;)e = utils.getParentByClassName(g[d], "columnar", _id("main")), utils.hasClass(g[d], f) ? (g[d].style.display = "block", e && k.push(e)) :
            g[d].style.display = "none";
        for (d = h.length; d--;)h[d].style.display = "none";
        for (d = k.length; d--;)k[d].style.display = "block";
        _id("search-results").innerHTML = '<h3><span class="option"><a href="#" title="Restore full content" onclick="resetFilter();return false" style="text-decoration:none"> clear filter </a></span>Content filter: ' + ("f-" == c ? "soundManager." : "s-" == c ? "[SMSound object]." : "") + '<b style="font-weight:bold">' + b.innerHTML + "</b></h3>";
        _id("search-results").style.display = "block";
        _id("filter-box").style.display =
            "block";
        m ? (_id("filter-box").style.paddingBottom = "0px", _id("filter-box").style.display = "none") : (_id("filter-box").style.paddingBottom = "0px", navigator.userAgent.match(/msie/i) || (_id("filter-box").style.paddingBottom = Math.max(0, (document.documentElement.scrollTop || window.scrollY) - utils.getOffY(_id("filter-box")) - parseInt(_id("filter-box").offsetHeight) - 20) + "px"), _id("filter-box").style.display = "block");
        lastSelected ? lastSelected == b ? utils.toggleClass(lastSelected, "active") : (utils.removeClass(lastSelected,
            "active"), utils.addClass(b, "active")) : utils.addClass(b, "active");
        lastSelected = b;
        "undefined" !== typeof a.preventDefault && a.preventDefault();
        return !1
    }
}
function getLiveData() {
    getDynamicData()
}
function getDynamicData() {
    loadScript("http://www.schillmania.com/services/soundmanager2/info/?version=" + soundManager.versionNumber + "&rnd=" + parseInt(1048576 * Math.random()))
}
function loadScript(a, c) {
    function b() {
        this.onload = this.onreadystatechange = null;
        window.setTimeout(c, 20)
    }

    var d = function () {
        var a = this.readyState;
        if ("loaded" == a || "complete" == a)this.onload = this.onreadystatechange = null, window.setTimeout(c, 20)
    }, g = document.createElement("script");
    g.type = "text/javascript";
    c && (g.onreadystatechange = d, g.onload = b);
    g.src = a;
    document.getElementsByTagName("head")[0].appendChild(g)
}
function doAltShortcuts() {
}
function fixLinks() {
    if (document.location.protocol.match(/http/i))return !1;
    for (var a = document.getElementsByTagName("a"), c = null, b = null, d = a.length; d--;)c = a[d].href.toString(), c.match(/http/i) || utils.hasClass(a[d], "norewrite") || !(c.match(/doc/i) || c.match(/demo/i) || c.match(/../)) || (b = Math.max(c.lastIndexOf("?"), -1), b = Math.max(c.lastIndexOf("#"), b), b = Math.max(c.lastIndexOf("/") + 1, b), -1 == b && (b = c.length), c.match(/\.html/i) || a[d].setAttribute("href", c.substr(0, b) + "index.html" + c.substr(b)))
}
function ie6Sucks() {
    if (!navigator.userAgent.match(/msie 6/i))return !1;
    var a = _id("nav").getElementsByTagName("li")[1], c = a.getElementsByTagName("a")[0], b = a.getElementsByTagName("ul")[0];
    c.onclick = function () {
        b.style.display = "block";
        setTimeout(function () {
            document.onclick = function () {
                b.style.display = "none";
                document.onclick = null
            }
        }, 20);
        return !1
    }
}
function doVersion() {
    var a = _id("version");
    if (!a)return !1;
    a.innerHTML = soundManager.versionNumber
}
function doChristmasLights() {
    IS_CHRISTMAS && (window.XLSF_URL_BASE = "demo/christmas-lights/", window.XLSF_LIGHT_CLASS = "pico", loadScript("demo/christmas-lights/christmaslights.js", function () {
        "undefined" != typeof smashInit && setTimeout(function () {
            smashInit()
        }, 20)
    }))
}
if (window.is_home) {
    var checkBadSafari = function () {
        var a = navigator.userAgent;
        document.location.href.match(/sm2-usehtml5audio/i) || window.location.toString().match(/sm2\-ignorebadua/i) || !a.match(/safari/i) || a.match(/chrome/i) || !a.match(/OS X 10_6_([3-7])/i) || (a = document.createElement("li"), a.innerHTML = '<b>Note</b>: Partial HTML5 in effect. Using Flash for MP3/MP4 formats (if available) for this browser/OS due to HTML5 audio load/play failures in Safari 4 + 5 on Snow Leopard 10.6.3 - 10.6.7 (purportedly fixed in OS X 10.6.8 and 10.7 "Lion.") Issue caused by bugs in QuickTime X and/or underlying frameworks. See <a href="https://bugs.webkit.org/show_bug.cgi?id=32159#c9">bugs.webkit.org #32519</a>. (Safari on iOS, Leopard and Windows OK, however.) <p style="margin:0.5em 0px 0.5em 0px">Try <a href="?sm2-ignorebadua&sm2-usehtml5audio=1">HTML5 anyway?</a> (some MP3 playback may intermittently fail.)',
            _id("html5-audio-notes").appendChild(a))
    };
    soundManager.useHTML5Audio = !0;
    document.location.href.match(/sm2-usehtml5audio=1/i) ? soundManager.useHTML5Audio = !0 : document.location.href.match(/sm2-usehtml5audio=0/i) && (soundManager.useHTML5Audio = !1);
    soundManager.setup({
        preferFlash: !1,
        useFlashBlock: !0,
        useHighPerformance: !0,
        bgColor: "#ffffff",
        debugMode: !1,
        url: "swf/",
        wmode: "transparent"
    });
    var PP_CONFIG = {
        autoStart: !1,
        playNext: !0,
        useThrottling: !1,
        usePeakData: !0,
        useWaveformData: !1,
        useEQData: !1,
        useFavIcon: !1
    };
    threeSixtyPlayer.config =
    {
        playNext: !1,
        autoPlay: !1,
        allowMultiple: !0,
        loadRingColor: "#ccc",
        playRingColor: "#000",
        backgroundRingColor: "#eee",
        circleDiameter: 256,
        circleRadius: 128,
        scaleArcWidth: 1,
        animDuration: 500,
        animTransition: Animator.tx.bouncy,
        showHMSTime: !0,
        useWaveformData: !0,
        waveformDataColor: "#0099ff",
        waveformDataDownsample: 2,
        waveformDataOutside: !1,
        waveformDataConstrain: !1,
        waveformDataLineRatio: .73,
        useEQData: !0,
        eqDataColor: "#339933",
        eqDataDownsample: 2,
        eqDataOutside: !0,
        eqDataLineRatio: .69,
        usePeakData: !0,
        peakDataColor: "#ff33ff",
        peakDataOutside: !0,
        peakDataLineRatio: .5,
        useAmplifier: !0
    };
    navigator.platform.match(/win32/i) && navigator.userAgent.match(/firefox/i) && (soundManager.useHighPerformance = !1);
    soundManager.onready(function () {
        _id("sm2-support").style.display = "none";
        _id("sm2-support-warning").style.display = "none";
        soundManager.didFlashBlock && soundManager.createSound({id: "success", url: "demo/_mp3/mouseover.mp3"}).play();
        doChristmasLights();
        var a, c = !1;
        a = navigator;
        var b = a.plugins, d, g = window.ActiveXObject;
        if (b && b.length)(a = a.mimeTypes) &&
        a["application/x-shockwave-flash"] && a["application/x-shockwave-flash"].enabledPlugin && a["application/x-shockwave-flash"].enabledPlugin.description && (c = !0); else if ("undefined" !== typeof g) {
            try {
                d = new g("ShockwaveFlash.ShockwaveFlash")
            } catch (f) {
            }
            c = !!d
        }
        a = c;
        b = soundManager;
        if (b.useHTML5Audio && b.hasHTML5) {
            (c = document.getElementById("html5-support-li")) && c.parentNode.removeChild(c);
            d = document.createElement("div");
            d.id = "html5-support-li";
            d.className = "html5support";
            c = [];
            g = !1;
            for (item in b.audioFormats)b.audioFormats.hasOwnProperty(item) &&
            (g = soundManager.filePattern.test("." + item), c.push('<span class="' + (b.html5[item] ? "true" : "false") + (!b.html5[item] && g ? " partial" : "") + '" title="' + (b.html5[item] ? "Native HTML5 support found" : "No HTML5 support found" + (g ? ", using Flash fallback if present" : ", no Flash support either")) + '">' + (b.html5[item] ? "&lt;" : "") + item + (b.html5[item] ? "&gt;" : "") + "</span>"));
            d.innerHTML = ['<b>This browser\'s <em class="true">&lt;HTML5&gt;</em> vs. <em class="partial">Flash</em> support:<p style="margin:0.5em 0px 0.5em 0px"></b>',
                c.join(""), '<br /><b class="note">', soundManager.html5.mp3 || soundManager.html5.mp4 ? a && soundManager.preferFlash ? 'Preferring flash for MP3/MP4; try <a href="?sm2-preferFlash=0" title="Try using soundManager.preferFlash=false to have HTML5 actually play MP3/MP4 formats and depending on support, run SM2 entirely without flash." class="cta">preferFlash=false</a> for HTML5-only mode.' : soundManager.html5Only ? "HTML5-only mode." + (soundManager.canPlayMIME("audio/aac") ? "" : ' Try <a href="?sm2-preferFlash=1,flash9" title="Try using soundManager.preferFlash=true to have Flash play MP3/MP4 formats." class="cta">preferFlash=true</a> for MP4 support as needed.') :
                    "&nbsp; Some flash required; allowing HTML5 to play MP3/MP4, as supported.</p>" : "Flash is required for this browser to play MP3/MP4.", "</b>"].join("");
            _id("html5-audio-notes").appendChild(d);
            _id("without-html5").style.display = "inline"
        } else _id("without-html5").style.display = "none";
        checkBadSafari();
        c = utils.getElementsByClassName("button-exclude", "a", _id("inline-playlist")).concat(utils.getElementsByClassName("exclude", "a", _id("graphic-playlist")));
        a = 0;
        for (b = c.length; a < b; a++)soundManager.canPlayLink(c[a]) ||
        (c[a].className += " not-supported", c[a].title += ". \n\nNOTE: " + (soundManager.useHTML5Audio ? "Format apparently not supported under this configuration or browser." : "SoundManager 2's HTML5 feature is not currently enabled. (Try turning it on, see +html5 link.)"))
    });
    soundManager.ontimeout(function () {
        if (navigator.userAgent.match(/msie 6/i))return !1;
        var a = _id("sm2-support"), c = _id("sm2-support-warning"), b = '<div style="margin:0.5em;margin-top:-0.25em"><h3>Oh snap!</h3><p>' + (soundManager.hasHTML5 ? "The flash portion of " :
                "") + "SoundManager 2 was unable to start. " + (soundManager.useHTML5Audio ? soundManager.hasHTML5 ? "</p><p>Some HTML5 audio support is present, but flash is needed for MP3/MP4 support on this page." : "</p><p>No HTML5 support was found, so flash is required." : "") + '</p><p>All links to audio will degrade gracefully.</p><p id="flashblocker">If you have a flash blocker, try allowing the SWF to run - it may be visible below.</p><p id="flash-offline">' + (soundManager.useAltURL ? "<b>Viewing offline</b>? You may need to change a Flash security setting." :
                "Other possible causes: Missing .SWF, or no Flash?") + ' Not to worry, as guided help is provided.</p><p><a href="doc/getstarted/index.html#troubleshooting" class="feature-hot" style="display:inline-block;margin-left:0px">Troubleshooting</a></p></div>', d = navigator.userAgent.match(/(ipad|iphone|ipod)/i);
        if (soundManager.html5.mp3 && soundManager.html5.mp4)return soundManager._wD("Special homepage case: Flash appears to blocked, HTML5 support for MP3/MP4 exists; trying HTML5-only mode..."), soundManager.useHTML5Audio = !0, soundManager.preferFlash = !1, setTimeout(function () {
            soundManager.reboot();
            soundManager.onready(function () {
                a.innerHTML = '<div style="margin:0.5em;margin-top:-0.25em"><h3>Support note</h3><p>SoundManager 2 tried to start using HTML5 + Flash, but rebooted in HTML5-only mode as flash was blocked. Visualization demo features will not be shown in this mode. To enable flash, whitelist the blocked movie and reload this page.</p>' + (soundManager.useAltURL ? '<p><b>Running offline?</b> Flash may be blocked due to security restrictions; see <a href="doc/getstarted/index.html#troubleshooting">troubleshooting</a> for more.' :
                        "") + "</div>";
                a.style.marginBottom = "1.5em";
                a.style.display = "block"
            })
        }, 1), !1;
        a.innerHTML = b;
        c.innerHTML = '<p style="margin:0px">SoundManager 2 could not start. <a href="#sm2-support">See below</a> for details.</p>';
        if (d || soundManager.getMoviePercent())_id("flashblocker").style.display = "none", d && (_id("flash-offline").style.display = "none");
        a.style.marginBottom = "1.5em";
        a.style.display = "block";
        c.style.display = "inline-block"
    })
}
function startStuff() {
    navigator.userAgent.match(/safari/i) && (document.getElementsByTagName("html")[0].className = "isSafari");
    doVersion();
    ie6Sucks();
    fixLinks();
    getLiveData();
    doAltShortcuts();
    soundManager.onready(function () {
        window.turntables && (turntables.config.requireCSS = "turntable-include")
    })
}
document.addEventListener ? document.addEventListener("DOMContentLoaded", startStuff, !1) : window.onload = startStuff;
