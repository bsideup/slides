(function (e, t) {
    var n = e;
    n.version = "0.9.0", n.protocol = 1, n.transports = [], n.j = [], n.sockets = {}, n.connect = function (e, r) {
        var i = n.util.parseUri(e), s, o;
        t && t.location && (i.protocol = i.protocol || t.location.protocol.slice(0, -1), i.host = i.host || (t.document ? t.document.domain : t.location.hostname), i.port = i.port || t.location.port), s = n.util.uniqueUri(i);
        var u = {
            host: i.host,
            secure: "https" == i.protocol,
            port: 80, //i.port || ("https" == i.protocol ? 443 : 80),
            query: i.query || ""
        };
        n.util.merge(u, r);
        if (u["force new connection"] || !n.sockets[s])o = new n.Socket(u);
        return !u["force new connection"] && o && (n.sockets[s] = o), o = o || n.sockets[s], o.of(i.path.length > 1 ? i.path : "")
    }
})("object" == typeof module ? module.exports : this.io = {}, this), function (e, t) {
    var n = e.util = {}, r = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, i = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
    n.parseUri = function (e) {
        var t = r.exec(e || ""), n = {}, s = 14;
        while (s--)n[i[s]] = t[s] || "";
        return n
    }, n.uniqueUri = function (e) {
        var n = e.protocol, r = e.host, i = e.port;
        return "document"in t ? (r = r || document.domain, i = i || (n == "https" && document.location.protocol !== "https:" ? 443 : document.location.port)) : (r = r || "localhost", !i && n == "https" && (i = 443)), (n || "http") + "://" + r + ":" + (i || 80)
    }, n.query = function (e, t) {
        var r = n.chunkQuery(e || ""), i = [];
        n.merge(r, n.chunkQuery(t || ""));
        for (var s in r)r.hasOwnProperty(s) && i.push(s + "=" + r[s]);
        return i.length ? "?" + i.join("&") : ""
    }, n.chunkQuery = function (e) {
        var t = {}, n = e.split("&"), r = 0, i = n.length, s;
        for (; r < i; ++r)s = n[r].split("="), s[0] && (t[s[0]] = s[1]);
        return t
    };
    var s = !1;
    n.load = function (e) {
        if ("document"in t && document.readyState === "complete" || s)return e();
        n.on(t, "load", e, !1)
    }, n.on = function (e, t, n, r) {
        e.attachEvent ? e.attachEvent("on" + t, n) : e.addEventListener && e.addEventListener(t, n, r)
    }, n.request = function (e) {
        if (e && "undefined" != typeof XDomainRequest)return new XDomainRequest;
        if ("undefined" != typeof XMLHttpRequest && (!e || n.ua.hasCORS))return new XMLHttpRequest;
        if (!e)try {
            return new ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {
        }
        return null
    }, "undefined" != typeof window && n.load(function () {
        s = !0
    }), n.defer = function (e) {
        if (!n.ua.webkit || "undefined" != typeof importScripts)return e();
        n.load(function () {
            setTimeout(e, 100)
        })
    }, n.merge = function (t, r, i, s) {
        var o = s || [], u = typeof i == "undefined" ? 2 : i, a;
        for (a in r)r.hasOwnProperty(a) && n.indexOf(o, a) < 0 && (typeof t[a] != "object" || !u ? (t[a] = r[a], o.push(r[a])) : n.merge(t[a], r[a], u - 1, o));
        return t
    }, n.mixin = function (e, t) {
        n.merge(e.prototype, t.prototype)
    }, n.inherit = function (e, t) {
        function n() {
        }

        n.prototype = t.prototype, e.prototype = new n
    }, n.isArray = Array.isArray || function (e) {
            return Object.prototype.toString.call(e) === "[object Array]"
        }, n.intersect = function (e, t) {
        var r = [], i = e.length > t.length ? e : t, s = e.length > t.length ? t : e;
        for (var o = 0, u = s.length; o < u; o++)~n.indexOf(i, s[o]) && r.push(s[o]);
        return r
    }, n.indexOf = function (e, t, n) {
        for (var r = e.length, n = n < 0 ? n + r < 0 ? 0 : n + r : n || 0; n < r && e[n] !== t; n++);
        return r <= n ? -1 : n
    }, n.toArray = function (e) {
        var t = [];
        for (var n = 0, r = e.length; n < r; n++)t.push(e[n]);
        return t
    }, n.ua = {}, n.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function () {
            try {
                var e = new XMLHttpRequest
            } catch (t) {
                return !1
            }
            return e.withCredentials != undefined
        }(), n.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent)
}("undefined" != typeof io ? io : module.exports, this), function (e, t) {
    function n() {
    }

    e.EventEmitter = n, n.prototype.on = function (e, n) {
        return this.$events || (this.$events = {}), this.$events[e] ? t.util.isArray(this.$events[e]) ? this.$events[e].push(n) : this.$events[e] = [this.$events[e], n] : this.$events[e] = n, this
    }, n.prototype.addListener = n.prototype.on, n.prototype.once = function (e, t) {
        function r() {
            n.removeListener(e, r), t.apply(this, arguments)
        }

        var n = this;
        return r.listener = t, this.on(e, r), this
    }, n.prototype.removeListener = function (e, n) {
        if (this.$events && this.$events[e]) {
            var r = this.$events[e];
            if (t.util.isArray(r)) {
                var i = -1;
                for (var s = 0, o = r.length; s < o; s++)if (r[s] === n || r[s].listener && r[s].listener === n) {
                    i = s;
                    break
                }
                if (i < 0)return this;
                r.splice(i, 1), r.length || delete this.$events[e]
            } else(r === n || r.listener && r.listener === n) && delete this.$events[e]
        }
        return this
    }, n.prototype.removeAllListeners = function (e) {
        return this.$events && this.$events[e] && (this.$events[e] = null), this
    }, n.prototype.listeners = function (e) {
        return this.$events || (this.$events = {}), this.$events[e] || (this.$events[e] = []), t.util.isArray(this.$events[e]) || (this.$events[e] = [this.$events[e]]), this.$events[e]
    }, n.prototype.emit = function (e) {
        if (!this.$events)return !1;
        var n = this.$events[e];
        if (!n)return !1;
        var r = Array.prototype.slice.call(arguments, 1);
        if ("function" == typeof n)n.apply(this, r); else {
            if (!t.util.isArray(n))return !1;
            var i = n.slice();
            for (var s = 0, o = i.length; s < o; s++)i[s].apply(this, r)
        }
        return !0
    }
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (exports, nativeJSON) {
    "use strict";
    function f(e) {
        return e < 10 ? "0" + e : e
    }

    function date(e, t) {
        return isFinite(e.valueOf()) ? e.getUTCFullYear() + "-" + f(e.getUTCMonth() + 1) + "-" + f(e.getUTCDate()) + "T" + f(e.getUTCHours()) + ":" + f(e.getUTCMinutes()) + ":" + f(e.getUTCSeconds()) + "Z" : null
    }

    function quote(e) {
        return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function (e) {
            var t = meta[e];
            return typeof t == "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + e + '"'
    }

    function str(e, t) {
        var n, r, i, s, o = gap, u, a = t[e];
        a instanceof Date && (a = date(e)), typeof rep == "function" && (a = rep.call(t, e, a));
        switch (typeof a) {
            case"string":
                return quote(a);
            case"number":
                return isFinite(a) ? String(a) : "null";
            case"boolean":
            case"null":
                return String(a);
            case"object":
                if (!a)return "null";
                gap += indent, u = [];
                if (Object.prototype.toString.apply(a) === "[object Array]") {
                    s = a.length;
                    for (n = 0; n < s; n += 1)u[n] = str(n, a) || "null";
                    return i = u.length === 0 ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]" : "[" + u.join(",") + "]", gap = o, i
                }
                if (rep && typeof rep == "object") {
                    s = rep.length;
                    for (n = 0; n < s; n += 1)typeof rep[n] == "string" && (r = rep[n], i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i))
                } else for (r in a)Object.prototype.hasOwnProperty.call(a, r) && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i));
                return i = u.length === 0 ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}" : "{" + u.join(",") + "}", gap = o, i
        }
    }

    if (nativeJSON && nativeJSON.parse)return exports.JSON = {parse: nativeJSON.parse, stringify: nativeJSON.stringify};
    var JSON = exports.JSON = {}, cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    }, rep;
    JSON.stringify = function (e, t, n) {
        var r;
        gap = "", indent = "";
        if (typeof n == "number")for (r = 0; r < n; r += 1)indent += " "; else typeof n == "string" && (indent = n);
        rep = t;
        if (!t || typeof t == "function" || typeof t == "object" && typeof t.length == "number")return str("", {"": e});
        throw new Error("JSON.stringify")
    }, JSON.parse = function (text, reviver) {
        function walk(e, t) {
            var n, r, i = e[t];
            if (i && typeof i == "object")for (n in i)Object.prototype.hasOwnProperty.call(i, n) && (r = walk(i, n), r !== undefined ? i[n] = r : delete i[n]);
            return reviver.call(e, t, i)
        }

        var j;
        text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (e) {
            return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({"": j}, "") : j;
        throw new SyntaxError("JSON.parse")
    }
}("undefined" != typeof io ? io : module.exports, typeof JSON != "undefined" ? JSON : undefined), function (e, t) {
    var n = e.parser = {}, r = n.packets = ["disconnect", "connect", "heartbeat", "message", "json", "event", "ack", "error", "noop"], i = n.reasons = ["transport not supported", "client not handshaken", "unauthorized"], s = n.advice = ["reconnect"], o = t.JSON, u = t.util.indexOf;
    n.encodePacket = function (e) {
        var t = u(r, e.type), n = e.id || "", a = e.endpoint || "", f = e.ack, l = null;
        switch (e.type) {
            case"error":
                var c = e.reason ? u(i, e.reason) : "", h = e.advice ? u(s, e.advice) : "";
                if (c !== "" || h !== "")l = c + (h !== "" ? "+" + h : "");
                break;
            case"message":
                e.data !== "" && (l = e.data);
                break;
            case"event":
                var p = {name: e.name};
                e.args && e.args.length && (p.args = e.args), l = o.stringify(p);
                break;
            case"json":
                l = o.stringify(e.data);
                break;
            case"connect":
                e.qs && (l = e.qs);
                break;
            case"ack":
                l = e.ackId + (e.args && e.args.length ? "+" + o.stringify(e.args) : "")
        }
        var d = [t, n + (f == "data" ? "+" : ""), a];
        return l !== null && l !== undefined && d.push(l), d.join(":")
    }, n.encodePayload = function (e) {
        var t = "";
        if (e.length == 1)return e[0];
        for (var n = 0, r = e.length; n < r; n++) {
            var i = e[n];
            t += "�" + i.length + "�" + e[n]
        }
        return t
    };
    var a = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
    n.decodePacket = function (e) {
        var t = e.match(a);
        if (!t)return {};
        var n = t[2] || "", e = t[5] || "", u = {type: r[t[1]], endpoint: t[4] || ""};
        n && (u.id = n, t[3] ? u.ack = "data" : u.ack = !0);
        switch (u.type) {
            case"error":
                var t = e.split("+");
                u.reason = i[t[0]] || "", u.advice = s[t[1]] || "";
                break;
            case"message":
                u.data = e || "";
                break;
            case"event":
                try {
                    var f = o.parse(e);
                    u.name = f.name, u.args = f.args
                } catch (l) {
                }
                u.args = u.args || [];
                break;
            case"json":
                try {
                    u.data = o.parse(e)
                } catch (l) {
                }
                break;
            case"connect":
                u.qs = e || "";
                break;
            case"ack":
                var t = e.match(/^([0-9]+)(\+)?(.*)/);
                if (t) {
                    u.ackId = t[1], u.args = [];
                    if (t[3])try {
                        u.args = t[3] ? o.parse(t[3]) : []
                    } catch (l) {
                    }
                }
                break;
            case"disconnect":
            case"heartbeat":
        }
        return u
    }, n.decodePayload = function (e) {
        if (e.charAt(0) == "�") {
            var t = [];
            for (var r = 1, i = ""; r < e.length; r++)e.charAt(r) == "�" ? (t.push(n.decodePacket(e.substr(r + 1).substr(0, i))), r += Number(i) + 1, i = "") : i += e.charAt(r);
            return t
        }
        return [n.decodePacket(e)]
    }
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (e, t) {
    function n(e, t) {
        this.socket = e, this.sessid = t
    }

    e.Transport = n, t.util.mixin(n, t.EventEmitter), n.prototype.onData = function (e) {
        this.clearCloseTimeout(), (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout();
        if (e !== "") {
            var n = t.parser.decodePayload(e);
            if (n && n.length)for (var r = 0, i = n.length; r < i; r++)this.onPacket(n[r])
        }
        return this
    }, n.prototype.onPacket = function (e) {
        return e.type == "heartbeat" ? this.onHeartbeat() : (e.type == "connect" && e.endpoint == "" && this.onConnect(), this.socket.onPacket(e), this)
    }, n.prototype.setCloseTimeout = function () {
        if (!this.closeTimeout) {
            var e = this;
            this.closeTimeout = setTimeout(function () {
                e.onDisconnect()
            }, this.socket.closeTimeout)
        }
    }, n.prototype.onDisconnect = function () {
        return this.close && this.open && this.close(), this.clearTimeouts(), this.socket.onDisconnect(), this
    }, n.prototype.onConnect = function () {
        return this.socket.onConnect(), this
    }, n.prototype.clearCloseTimeout = function () {
        this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null)
    }, n.prototype.clearTimeouts = function () {
        this.clearCloseTimeout(), this.reopenTimeout && clearTimeout(this.reopenTimeout)
    }, n.prototype.packet = function (e) {
        this.send(t.parser.encodePacket(e))
    }, n.prototype.onHeartbeat = function (e) {
        this.packet({type: "heartbeat"})
    }, n.prototype.onOpen = function () {
        this.open = !0, this.clearCloseTimeout(), this.socket.onOpen()
    }, n.prototype.onClose = function () {
        var e = this;
        this.open = !1, this.socket.onClose(), this.onDisconnect()
    }, n.prototype.prepareUrl = function () {
        var e = this.socket.options;
        return this.scheme() + "://" + e.host + ":" + e.port + "/" + e.resource + "/" + t.protocol + "/" + this.name + "/" + this.sessid
    }, n.prototype.ready = function (e, t) {
        t.call(this)
    }
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (e, t, n) {
    function r(e) {
        this.options = {
            port: 80,
            secure: !1,
            document: "document"in n ? document : !1,
            resource: "socket.io",
            transports: t.transports,
            "connect timeout": 1e4,
            "try multiple transports": !0,
            reconnect: !0,
            "reconnection delay": 500,
            "reconnection limit": Infinity,
            "reopen delay": 3e3,
            "max reconnection attempts": 10,
            "sync disconnect on unload": !0,
            "auto connect": !0,
            "flash policy port": 10843
        }, t.util.merge(this.options, e), this.connected = !1, this.open = !1, this.connecting = !1, this.reconnecting = !1, this.namespaces = {}, this.buffer = [], this.doBuffer = !1;
        if (this.options["sync disconnect on unload"] && (!this.isXDomain() || t.util.ua.hasCORS)) {
            var r = this;
            t.util.on(n, "beforeunload", function () {
                r.disconnectSync()
            }, !1)
        }
        this.options["auto connect"] && this.connect()
    }

    function i() {
    }

    e.Socket = r, t.util.mixin(r, t.EventEmitter), r.prototype.of = function (e) {
        return this.namespaces[e] || (this.namespaces[e] = new t.SocketNamespace(this, e), e !== "" && this.namespaces[e].packet({type: "connect"})), this.namespaces[e]
    }, r.prototype.publish = function () {
        this.emit.apply(this, arguments);
        var e;
        for (var t in this.namespaces)this.namespaces.hasOwnProperty(t) && (e = this.of(t), e.$emit.apply(e, arguments))
    }, r.prototype.handshake = function (e) {
        function s(t) {
            t instanceof Error ? n.onError(t.message) : e.apply(null, t.split(":"))
        }

        var n = this, r = this.options, o = ["http" + (r.secure ? "s" : "") + ":/", r.host + ":" + r.port, r.resource, t.protocol, t.util.query(this.options.query, "t=" + +(new Date))].join("/");
        if (this.isXDomain() && !t.util.ua.hasCORS) {
            var u = document.getElementsByTagName("script")[0], a = document.createElement("script");
            a.src = o + "&jsonp=" + t.j.length, u.parentNode.insertBefore(a, u), t.j.push(function (e) {
                s(e), a.parentNode.removeChild(a)
            })
        } else {
            var f = t.util.request();
            f.open("GET", o, !0), f.withCredentials = !0, f.onreadystatechange = function () {
                f.readyState == 4 && (f.onreadystatechange = i, f.status == 200 ? s(f.responseText) : !n.reconnecting && n.onError(f.responseText))
            }, f.send(null)
        }
    }, r.prototype.getTransport = function (e) {
        var n = e || this.transports, r;
        for (var i = 0, s; s = n[i]; i++)if (t.Transport[s] && t.Transport[s].check(this) && (!this.isXDomain() || t.Transport[s].xdomainCheck()))return new t.Transport[s](this, this.sessionid);
        return null
    }, r.prototype.connect = function (e) {
        if (this.connecting)return this;
        var n = this;
        return this.handshake(function (r, i, s, o) {
            function u(e) {
                n.transport && n.transport.clearTimeouts(), n.transport = n.getTransport(e);
                if (!n.transport)return n.publish("connect_failed");
                n.transport.ready(n, function () {
                    n.connecting = !0, n.publish("connecting", n.transport.name), n.transport.open(), n.options["connect timeout"] && (n.connectTimeoutTimer = setTimeout(function () {
                        if (!n.connected) {
                            n.connecting = !1;
                            if (n.options["try multiple transports"]) {
                                n.remainingTransports || (n.remainingTransports = n.transports.slice(0));
                                var e = n.remainingTransports;
                                while (e.length > 0 && e.splice(0, 1)[0] != n.transport.name);
                                e.length ? u(e) : n.publish("connect_failed")
                            }
                        }
                    }, n.options["connect timeout"]))
                })
            }

            n.sessionid = r, n.closeTimeout = s * 1e3, n.heartbeatTimeout = i * 1e3, n.transports = t.util.intersect(o.split(","), n.options.transports), u(), n.once("connect", function () {
                clearTimeout(n.connectTimeoutTimer), e && typeof e == "function" && e()
            })
        }), this
    }, r.prototype.packet = function (e) {
        return this.connected && !this.doBuffer ? this.transport.packet(e) : this.buffer.push(e), this
    }, r.prototype.setBuffer = function (e) {
        this.doBuffer = e, !e && this.connected && this.buffer.length && (this.transport.payload(this.buffer), this.buffer = [])
    }, r.prototype.disconnect = function () {
        return this.connected && (this.open && this.of("").packet({type: "disconnect"}), this.onDisconnect("booted")), this
    }, r.prototype.disconnectSync = function () {
        var e = t.util.request(), n = this.resource + "/" + t.protocol + "/" + this.sessionid;
        e.open("GET", n, !0), this.onDisconnect("booted")
    }, r.prototype.isXDomain = function () {
        var e = n.location.port || ("https:" == n.location.protocol ? 443 : 80);
        return this.options.host !== n.location.hostname || this.options.port != e
    }, r.prototype.onConnect = function () {
        this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), this.emit("connect"))
    }, r.prototype.onOpen = function () {
        this.open = !0
    }, r.prototype.onClose = function () {
        this.open = !1
    }, r.prototype.onPacket = function (e) {
        this.of(e.endpoint).onPacket(e)
    }, r.prototype.onError = function (e) {
        e && e.advice && this.options.reconnect && e.advice === "reconnect" && this.connected && (this.disconnect(), this.reconnect()), this.publish("error", e && e.reason ? e.reason : e)
    }, r.prototype.onDisconnect = function (e) {
        var t = this.connected;
        this.connected = !1, this.connecting = !1, this.open = !1, t && (this.transport.close(), this.transport.clearTimeouts(), this.publish("disconnect", e), "booted" != e && this.options.reconnect && !this.reconnecting && this.reconnect())
    }, r.prototype.reconnect = function () {
        function i() {
            if (e.connected) {
                for (var t in e.namespaces)e.namespaces.hasOwnProperty(t) && "" !== t && e.namespaces[t].packet({type: "connect"});
                e.publish("reconnect", e.transport.name, e.reconnectionAttempts)
            }
            clearTimeout(e.reconnectionTimer), e.removeListener("connect_failed", s), e.removeListener("connect", s), e.reconnecting = !1, delete e.reconnectionAttempts, delete e.reconnectionDelay, delete e.reconnectionTimer, delete e.redoTransports, e.options["try multiple transports"] = n
        }

        function s() {
            if (!e.reconnecting)return;
            if (e.connected)return i();
            if (e.connecting && e.reconnecting)return e.reconnectionTimer = setTimeout(s, 1e3);
            e.reconnectionAttempts++ >= t ? e.redoTransports ? (e.publish("reconnect_failed"), i()) : (e.on("connect_failed", s), e.options["try multiple transports"] = !0, e.transport = e.getTransport(), e.redoTransports = !0, e.connect()) : (e.reconnectionDelay < r && (e.reconnectionDelay *= 2), e.connect(), e.publish("reconnecting", e.reconnectionDelay, e.reconnectionAttempts), e.reconnectionTimer = setTimeout(s, e.reconnectionDelay))
        }

        this.reconnecting = !0, this.reconnectionAttempts = 0, this.reconnectionDelay = this.options["reconnection delay"];
        var e = this, t = this.options["max reconnection attempts"], n = this.options["try multiple transports"], r = this.options["reconnection limit"];
        this.options["try multiple transports"] = !1, this.reconnectionTimer = setTimeout(s, this.reconnectionDelay), this.on("connect", s)
    }
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function (e, t) {
    function n(e, t) {
        this.socket = e, this.name = t || "", this.flags = {}, this.json = new r(this, "json"), this.ackPackets = 0, this.acks = {}
    }

    function r(e, t) {
        this.namespace = e, this.name = t
    }

    e.SocketNamespace = n, t.util.mixin(n, t.EventEmitter), n.prototype.$emit = t.EventEmitter.prototype.emit, n.prototype.of = function () {
        return this.socket.of.apply(this.socket, arguments)
    }, n.prototype.packet = function (e) {
        return e.endpoint = this.name, this.socket.packet(e), this.flags = {}, this
    }, n.prototype.send = function (e, t) {
        var n = {type: this.flags.json ? "json" : "message", data: e};
        return "function" == typeof t && (n.id = ++this.ackPackets, n.ack = !0, this.acks[n.id] = t), this.packet(n)
    }, n.prototype.emit = function (e) {
        var t = Array.prototype.slice.call(arguments, 1), n = t[t.length - 1], r = {type: "event", name: e};
        return "function" == typeof n && (r.id = ++this.ackPackets, r.ack = "data", this.acks[r.id] = n, t = t.slice(0, t.length - 1)), r.args = t, this.packet(r)
    }, n.prototype.disconnect = function () {
        return this.name === "" ? this.socket.disconnect() : (this.packet({type: "disconnect"}), this.$emit("disconnect")), this
    }, n.prototype.onPacket = function (e) {
        function r() {
            n.packet({type: "ack", args: t.util.toArray(arguments), ackId: e.id})
        }

        var n = this;
        switch (e.type) {
            case"connect":
                this.$emit("connect");
                break;
            case"disconnect":
                this.name === "" ? this.socket.onDisconnect(e.reason || "booted") : this.$emit("disconnect", e.reason);
                break;
            case"message":
            case"json":
                var i = ["message", e.data];
                e.ack == "data" ? i.push(r) : e.ack && this.packet({
                    type: "ack",
                    ackId: e.id
                }), this.$emit.apply(this, i);
                break;
            case"event":
                var i = [e.name].concat(e.args);
                e.ack == "data" && i.push(r), this.$emit.apply(this, i);
                break;
            case"ack":
                this.acks[e.ackId] && (this.acks[e.ackId].apply(this, e.args), delete this.acks[e.ackId]);
                break;
            case"error":
                e.advice ? this.socket.onError(e) : e.reason == "unauthorized" ? this.$emit("connect_failed", e.reason) : this.$emit("error", e.reason)
        }
    }, r.prototype.send = function () {
        this.namespace.flags[this.name] = !0, this.namespace.send.apply(this.namespace, arguments)
    }, r.prototype.emit = function () {
        this.namespace.flags[this.name] = !0, this.namespace.emit.apply(this.namespace, arguments)
    }
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (e, t, n) {
    function r(e) {
        t.Transport.apply(this, arguments)
    }

    e.websocket = r, t.util.inherit(r, t.Transport), r.prototype.name = "websocket", r.prototype.open = function () {
        var e = t.util.query(this.socket.options.query), r = this, i;
        return i || (i = n.MozWebSocket || n.WebSocket), this.websocket = new i(this.prepareUrl() + e), this.websocket.onopen = function () {
            r.onOpen(), r.socket.setBuffer(!1)
        }, this.websocket.onmessage = function (e) {
            r.onData(e.data)
        }, this.websocket.onclose = function () {
            r.onClose(), r.socket.setBuffer(!0)
        }, this.websocket.onerror = function (e) {
            r.onError(e)
        }, this
    }, r.prototype.send = function (e) {
        return this.websocket.send(e), this
    }, r.prototype.payload = function (e) {
        for (var t = 0, n = e.length; t < n; t++)this.packet(e[t]);
        return this
    }, r.prototype.close = function () {
        return this.websocket.close(), this
    }, r.prototype.onError = function (e) {
        this.socket.onError(e)
    }, r.prototype.scheme = function () {
        return this.socket.options.secure ? "wss" : "ws"
    }, r.check = function () {
        return "WebSocket"in n && !("__addTask"in WebSocket) || "MozWebSocket"in n
    }, r.xdomainCheck = function () {
        return !0
    }, t.transports.push("websocket")
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function (e, t, n) {
    function r(e) {
        if (!e)return;
        t.Transport.apply(this, arguments), this.sendBuffer = []
    }

    function i() {
    }

    e.XHR = r, t.util.inherit(r, t.Transport), r.prototype.open = function () {
        return this.socket.setBuffer(!1), this.onOpen(), this.get(), this.setCloseTimeout(), this
    }, r.prototype.payload = function (e) {
        var n = [];
        for (var r = 0, i = e.length; r < i; r++)n.push(t.parser.encodePacket(e[r]));
        this.send(t.parser.encodePayload(n))
    }, r.prototype.send = function (e) {
        return this.post(e), this
    }, r.prototype.post = function (e) {
        function r() {
            this.readyState == 4 && (this.onreadystatechange = i, t.posting = !1, this.status == 200 ? t.socket.setBuffer(!1) : t.onClose())
        }

        function s() {
            this.onload = i, t.socket.setBuffer(!1)
        }

        var t = this;
        this.socket.setBuffer(!0), this.sendXHR = this.request("POST"), n.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = s : this.sendXHR.onreadystatechange = r, this.sendXHR.send(e)
    }, r.prototype.close = function () {
        return this.onClose(), this
    }, r.prototype.request = function (e) {
        var n = t.util.request(this.socket.isXDomain()), r = t.util.query(this.socket.options.query, "t=" + +(new Date));
        n.open(e || "GET", this.prepareUrl() + r, !0);
        if (e == "POST")try {
            n.setRequestHeader ? n.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : n.contentType = "text/plain"
        } catch (i) {
        }
        return n
    }, r.prototype.scheme = function () {
        return this.socket.options.secure ? "https" : "http"
    }, r.check = function (e, n) {
        try {
            if (t.util.request(n))return !0
        } catch (r) {
        }
        return !1
    }, r.xdomainCheck = function () {
        return r.check(null, !0)
    }
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function (e, t) {
    function n(e) {
        t.Transport.XHR.apply(this, arguments)
    }

    e.htmlfile = n, t.util.inherit(n, t.Transport.XHR), n.prototype.name = "htmlfile", n.prototype.get = function () {
        this.doc = new ActiveXObject("htmlfile"), this.doc.open(), this.doc.write("<html></html>"), this.doc.close(), this.doc.parentWindow.s = this;
        var e = this.doc.createElement("div");
        e.className = "socketio", this.doc.body.appendChild(e), this.iframe = this.doc.createElement("iframe"), e.appendChild(this.iframe);
        var n = this, r = t.util.query(this.socket.options.query, "t=" + +(new Date));
        this.iframe.src = this.prepareUrl() + r, t.util.on(window, "unload", function () {
            n.destroy()
        })
    }, n.prototype._ = function (e, t) {
        this.onData(e);
        try {
            var n = t.getElementsByTagName("script")[0];
            n.parentNode.removeChild(n)
        } catch (r) {
        }
    }, n.prototype.destroy = function () {
        if (this.iframe) {
            try {
                this.iframe.src = "about:blank"
            } catch (e) {
            }
            this.doc = null, this.iframe.parentNode.removeChild(this.iframe), this.iframe = null, CollectGarbage()
        }
    }, n.prototype.close = function () {
        return this.destroy(), t.Transport.XHR.prototype.close.call(this)
    }, n.check = function () {
        if (typeof window != "undefined" && "ActiveXObject"in window)try {
            var e = new ActiveXObject("htmlfile");
            return e && t.Transport.XHR.check()
        } catch (n) {
        }
        return !1
    }, n.xdomainCheck = function () {
        return !1
    }, t.transports.push("htmlfile")
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (e, t, n) {
    function r() {
        t.Transport.XHR.apply(this, arguments)
    }

    function i() {
    }

    e["xhr-polling"] = r, t.util.inherit(r, t.Transport.XHR), t.util.merge(r, t.Transport.XHR), r.prototype.name = "xhr-polling", r.prototype.open = function () {
        var e = this;
        return t.Transport.XHR.prototype.open.call(e), !1
    }, r.prototype.get = function () {
        function t() {
            this.readyState == 4 && (this.onreadystatechange = i, this.status == 200 ? (e.onData(this.responseText), e.get()) : e.onClose())
        }

        function r() {
            this.onload = i, this.onerror = i, e.onData(this.responseText), e.get()
        }

        function s() {
            e.onClose()
        }

        if (!this.open)return;
        var e = this;
        this.xhr = this.request(), n.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = r, this.xhr.onerror = s) : this.xhr.onreadystatechange = t, this.xhr.send(null)
    }, r.prototype.onClose = function () {
        t.Transport.XHR.prototype.onClose.call(this);
        if (this.xhr) {
            this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = i;
            try {
                this.xhr.abort()
            } catch (e) {
            }
            this.xhr = null
        }
    }, r.prototype.ready = function (e, n) {
        var r = this;
        t.util.defer(function () {
            n.call(r)
        })
    }, t.transports.push("xhr-polling")
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function (e, t, n) {
    function i(e) {
        t.Transport["xhr-polling"].apply(this, arguments), this.index = t.j.length;
        var n = this;
        t.j.push(function (e) {
            n._(e)
        })
    }

    var r = n.document && "MozAppearance"in n.document.documentElement.style;
    e["jsonp-polling"] = i, t.util.inherit(i, t.Transport["xhr-polling"]), i.prototype.name = "jsonp-polling", i.prototype.post = function (e) {
        function a() {
            f(), n.socket.setBuffer(!1)
        }

        function f() {
            n.iframe && n.form.removeChild(n.iframe);
            try {
                u = document.createElement('<iframe name="' + n.iframeId + '">')
            } catch (e) {
                u = document.createElement("iframe"), u.name = n.iframeId
            }
            u.id = n.iframeId, n.form.appendChild(u), n.iframe = u
        }

        var n = this, r = t.util.query(this.socket.options.query, "t=" + +(new Date) + "&i=" + this.index);
        if (!this.form) {
            var i = document.createElement("form"), s = document.createElement("textarea"), o = this.iframeId = "socketio_iframe_" + this.index, u;
            i.className = "socketio", i.style.position = "absolute", i.style.top = "-1000px", i.style.left = "-1000px", i.target = o, i.method = "POST", i.setAttribute("accept-charset", "utf-8"), s.name = "d", i.appendChild(s), document.body.appendChild(i), this.form = i, this.area = s
        }
        this.form.action = this.prepareUrl() + r, f(), this.area.value = t.JSON.stringify(e);
        try {
            this.form.submit()
        } catch (l) {
        }
        this.iframe.attachEvent ? u.onreadystatechange = function () {
            n.iframe.readyState == "complete" && a()
        } : this.iframe.onload = a, this.socket.setBuffer(!0)
    }, i.prototype.get = function () {
        var e = this, n = document.createElement("script"), i = t.util.query(this.socket.options.query, "t=" + +(new Date) + "&i=" + this.index);
        this.script && (this.script.parentNode.removeChild(this.script), this.script = null), n.async = !0, n.src = this.prepareUrl() + i, n.onerror = function () {
            e.onClose()
        };
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(n, s), this.script = n, r && setTimeout(function () {
            var e = document.createElement("iframe");
            document.body.appendChild(e), document.body.removeChild(e)
        }, 100)
    }, i.prototype._ = function (e) {
        return this.onData(e), this.open && this.get(), this
    }, i.prototype.ready = function (e, n) {
        var i = this;
        if (!r)return n.call(this);
        t.util.load(function () {
            n.call(i)
        })
    }, i.check = function () {
        return "document"in n
    }, i.xdomainCheck = function () {
        return !0
    }, t.transports.push("jsonp-polling")
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function (e) {
    String.prototype.trim === e && (String.prototype.trim = function () {
        return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }), Array.prototype.reduce === e && (Array.prototype.reduce = function (t) {
        if (this === void 0 || this === null)throw new TypeError;
        var n = Object(this), r = n.length >>> 0, i = 0, s;
        if (typeof t != "function")throw new TypeError;
        if (r == 0 && arguments.length == 1)throw new TypeError;
        if (arguments.length >= 2)s = arguments[1]; else do {
            if (i in n) {
                s = n[i++];
                break
            }
            if (++i >= r)throw new TypeError
        } while (!0);
        while (i < r)i in n && (s = t.call(e, s, n[i], i, n)), i++;
        return s
    })
}();
var Zepto = function () {
    function C(e) {
        return E.call(e) == "[object Function]"
    }

    function k(e) {
        return e instanceof Object
    }

    function L(t) {
        var n, r;
        if (E.call(t) !== "[object Object]")return !1;
        r = C(t.constructor) && t.constructor.prototype;
        if (!r || !hasOwnProperty.call(r, "isPrototypeOf"))return !1;
        for (n in t);
        return n === e || hasOwnProperty.call(t, n)
    }

    function A(e) {
        return e instanceof Array
    }

    function O(e) {
        return typeof e.length == "number"
    }

    function M(t) {
        return t.filter(function (t) {
            return t !== e && t !== null
        })
    }

    function _(e) {
        return e.length > 0 ? [].concat.apply([], e) : e
    }

    function D(e) {
        return e.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
    }

    function P(e) {
        return e in a ? a[e] : a[e] = new RegExp("(^|\\s)" + e + "(\\s|$)")
    }

    function H(e, t) {
        return typeof t == "number" && !l[D(e)] ? t + "px" : t
    }

    function B(e) {
        var t, n;
        return u[e] || (t = o.createElement(e), o.body.appendChild(t), n = f(t, "").getPropertyValue("display"), t.parentNode.removeChild(t), n == "none" && (n = "block"), u[e] = n), u[e]
    }

    function j(t, r) {
        return r === e ? n(t) : n(t).filter(r)
    }

    function F(e, t, n, r) {
        return C(t) ? t.call(e, n, r) : t
    }

    function I(e, t, r) {
        var i = e % 2 ? t : t.parentNode;
        i ? i.insertBefore(r, e ? e == 1 ? i.firstChild : e == 2 ? t : null : t.nextSibling) : n(r).remove()
    }

    function q(e, t) {
        t(e);
        for (var n in e.childNodes)q(e.childNodes[n], t)
    }

    var e, t, n, r, i = [], s = i.slice, o = window.document, u = {}, a = {}, f = o.defaultView.getComputedStyle, l = {
        "column-count": 1,
        columns: 1,
        "font-weight": 1,
        "line-height": 1,
        opacity: 1,
        "z-index": 1,
        zoom: 1
    }, c = /^\s*<(\w+|!)[^>]*>/, h = [1, 3, 8, 9, 11], p = ["after", "prepend", "before", "append"], d = o.createElement("table"), v = o.createElement("tr"), m = {
        tr: o.createElement("tbody"),
        tbody: d,
        thead: d,
        tfoot: d,
        td: v,
        th: v,
        "*": o.createElement("div")
    }, g = /complete|loaded|interactive/, y = /^\.([\w-]+)$/, b = /^#([\w-]+)$/, w = /^[\w-]+$/, E = {}.toString, S = {}, x, T, N = o.createElement("div");
    return S.matches = function (e, t) {
        if (!e || e.nodeType !== 1)return !1;
        var n = e.webkitMatchesSelector || e.mozMatchesSelector || e.oMatchesSelector || e.matchesSelector;
        if (n)return n.call(e, t);
        var r, i = e.parentNode, s = !i;
        return s && (i = N).appendChild(e), r = ~S.qsa(i, t).indexOf(e), s && N.removeChild(e), r
    }, x = function (e) {
        return e.replace(/-+(.)?/g, function (e, t) {
            return t ? t.toUpperCase() : ""
        })
    }, T = function (e) {
        return e.filter(function (t, n) {
            return e.indexOf(t) == n
        })
    }, S.fragment = function (t, r) {
        r === e && (r = c.test(t) && RegExp.$1), r in m || (r = "*");
        var i = m[r];
        return i.innerHTML = "" + t, n.each(s.call(i.childNodes), function () {
            i.removeChild(this)
        })
    }, S.Z = function (e, t) {
        return e = e || [], e.__proto__ = arguments.callee.prototype, e.selector = t || "", e
    }, S.isZ = function (e) {
        return e instanceof S.Z
    }, S.init = function (t, r) {
        if (!t)return S.Z();
        if (C(t))return n(o).ready(t);
        if (S.isZ(t))return t;
        var i;
        if (A(t))i = M(t); else if (L(t))i = [n.extend({}, t)], t = null; else if (h.indexOf(t.nodeType) >= 0 || t === window)i = [t], t = null; else if (c.test(t))i = S.fragment(t.trim(), RegExp.$1), t = null; else {
            if (r !== e)return n(r).find(t);
            i = S.qsa(o, t)
        }
        return S.Z(i, t)
    }, n = function (e, t) {
        return S.init(e, t)
    }, n.extend = function (n) {
        return s.call(arguments, 1).forEach(function (r) {
            for (t in r)r[t] !== e && (n[t] = r[t])
        }), n
    }, S.qsa = function (e, t) {
        var n;
        return e === o && b.test(t) ? (n = e.getElementById(RegExp.$1)) ? [n] : i : e.nodeType !== 1 && e.nodeType !== 9 ? i : s.call(y.test(t) ? e.getElementsByClassName(RegExp.$1) : w.test(t) ? e.getElementsByTagName(t) : e.querySelectorAll(t))
    }, n.isFunction = C, n.isObject = k, n.isArray = A, n.isPlainObject = L, n.inArray = function (e, t, n) {
        return i.indexOf.call(t, e, n)
    }, n.trim = function (e) {
        return e.trim()
    }, n.uuid = 0, n.map = function (e, t) {
        var n, r = [], i, s;
        if (O(e))for (i = 0; i < e.length; i++)n = t(e[i], i), n != null && r.push(n); else for (s in e)n = t(e[s], s), n != null && r.push(n);
        return _(r)
    }, n.each = function (e, t) {
        var n, r;
        if (O(e)) {
            for (n = 0; n < e.length; n++)if (t.call(e[n], n, e[n]) === !1)return e
        } else for (r in e)if (t.call(e[r], r, e[r]) === !1)return e;
        return e
    }, n.fn = {
        forEach: i.forEach,
        reduce: i.reduce,
        push: i.push,
        indexOf: i.indexOf,
        concat: i.concat,
        map: function (e) {
            return n.map(this, function (t, n) {
                return e.call(t, n, t)
            })
        },
        slice: function () {
            return n(s.apply(this, arguments))
        },
        ready: function (e) {
            return g.test(o.readyState) ? e(n) : o.addEventListener("DOMContentLoaded", function () {
                e(n)
            }, !1), this
        },
        get: function (t) {
            return t === e ? s.call(this) : this[t]
        },
        toArray: function () {
            return this.get()
        },
        size: function () {
            return this.length
        },
        remove: function () {
            return this.each(function () {
                this.parentNode != null && this.parentNode.removeChild(this)
            })
        },
        each: function (e) {
            return this.forEach(function (t, n) {
                e.call(t, n, t)
            }), this
        },
        filter: function (e) {
            return n([].filter.call(this, function (t) {
                return S.matches(t, e)
            }))
        },
        add: function (e, t) {
            return n(T(this.concat(n(e, t))))
        },
        is: function (e) {
            return this.length > 0 && S.matches(this[0], e)
        },
        not: function (t) {
            var r = [];
            if (C(t) && t.call !== e)this.each(function (e) {
                t.call(this, e) || r.push(this)
            }); else {
                var i = typeof t == "string" ? this.filter(t) : O(t) && C(t.item) ? s.call(t) : n(t);
                this.forEach(function (e) {
                    i.indexOf(e) < 0 && r.push(e)
                })
            }
            return n(r)
        },
        eq: function (e) {
            return e === -1 ? this.slice(e) : this.slice(e, +e + 1)
        },
        first: function () {
            var e = this[0];
            return e && !k(e) ? e : n(e)
        },
        last: function () {
            var e = this[this.length - 1];
            return e && !k(e) ? e : n(e)
        },
        find: function (e) {
            var t;
            return this.length == 1 ? t = S.qsa(this[0], e) : t = this.map(function () {
                return S.qsa(this, e)
            }), n(t)
        },
        closest: function (e, t) {
            var r = this[0];
            while (r && !S.matches(r, e))r = r !== t && r !== o && r.parentNode;
            return n(r)
        },
        parents: function (e) {
            var t = [], r = this;
            while (r.length > 0)r = n.map(r, function (e) {
                if ((e = e.parentNode) && e !== o && t.indexOf(e) < 0)return t.push(e), e
            });
            return j(t, e)
        },
        parent: function (e) {
            return j(T(this.pluck("parentNode")), e)
        },
        children: function (e) {
            return j(this.map(function () {
                return s.call(this.children)
            }), e)
        },
        siblings: function (e) {
            return j(this.map(function (e, t) {
                return s.call(t.parentNode.children).filter(function (e) {
                    return e !== t
                })
            }), e)
        },
        empty: function () {
            return this.each(function () {
                this.innerHTML = ""
            })
        },
        pluck: function (e) {
            return this.map(function () {
                return this[e]
            })
        },
        show: function () {
            return this.each(function () {
                this.style.display == "none" && (this.style.display = null), f(this, "").getPropertyValue("display") == "none" && (this.style.display = B(this.nodeName))
            })
        },
        replaceWith: function (e) {
            return this.before(e).remove()
        },
        wrap: function (e) {
            return this.each(function () {
                n(this).wrapAll(n(e)[0].cloneNode(!1))
            })
        },
        wrapAll: function (e) {
            return this[0] && (n(this[0]).before(e = n(e)), e.append(this)), this
        },
        unwrap: function () {
            return this.parent().each(function () {
                n(this).replaceWith(n(this).children())
            }), this
        },
        clone: function () {
            return n(this.map(function () {
                return this.cloneNode(!0)
            }))
        },
        hide: function () {
            return this.css("display", "none")
        },
        toggle: function (t) {
            return (t === e ? this.css("display") == "none" : t) ? this.show() : this.hide()
        },
        prev: function () {
            return n(this.pluck("previousElementSibling"))
        },
        next: function () {
            return n(this.pluck("nextElementSibling"))
        },
        html: function (t) {
            return t === e ? this.length > 0 ? this[0].innerHTML : null : this.each(function (e) {
                var r = this.innerHTML;
                n(this).empty().append(F(this, t, e, r))
            })
        },
        text: function (t) {
            return t === e ? this.length > 0 ? this[0].textContent : null : this.each(function () {
                this.textContent = t
            })
        },
        attr: function (n, r) {
            var i;
            return typeof n == "string" && r === e ? this.length == 0 || this[0].nodeType !== 1 ? e : n == "value" && this[0].nodeName == "INPUT" ? this.val() : !(i = this[0].getAttribute(n)) && n in this[0] ? this[0][n] : i : this.each(function (e) {
                if (this.nodeType !== 1)return;
                if (k(n))for (t in n)this.setAttribute(t, n[t]); else this.setAttribute(n, F(this, r, e, this.getAttribute(n)))
            })
        },
        removeAttr: function (e) {
            return this.each(function () {
                this.nodeType === 1 && this.removeAttribute(e)
            })
        },
        prop: function (t, n) {
            return n === e ? this[0] ? this[0][t] : e : this.each(function (e) {
                this[t] = F(this, n, e, this[t])
            })
        },
        data: function (t, n) {
            var r = this.attr("data-" + D(t), n);
            return r !== null ? r : e
        },
        val: function (t) {
            return t === e ? this.length > 0 ? this[0].value : e : this.each(function (e) {
                this.value = F(this, t, e, this.value)
            })
        },
        offset: function () {
            if (this.length == 0)return null;
            var e = this[0].getBoundingClientRect();
            return {
                left: e.left + window.pageXOffset,
                top: e.top + window.pageYOffset,
                width: e.width,
                height: e.height
            }
        },
        css: function (n, r) {
            if (r === e && typeof n == "string")return this.length == 0 ? e : this[0].style[x(n)] || f(this[0], "").getPropertyValue(n);
            var i = "";
            for (t in n)typeof n[t] == "string" && n[t] == "" ? this.each(function () {
                this.style.removeProperty(D(t))
            }) : i += D(t) + ":" + H(t, n[t]) + ";";
            return typeof n == "string" && (r == "" ? this.each(function () {
                this.style.removeProperty(D(n))
            }) : i = D(n) + ":" + H(n, r)), this.each(function () {
                this.style.cssText += ";" + i
            })
        },
        index: function (e) {
            return e ? this.indexOf(n(e)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function (e) {
            return this.length < 1 ? !1 : P(e).test(this[0].className)
        },
        addClass: function (e) {
            return this.each(function (t) {
                r = [];
                var i = this.className, s = F(this, e, t, i);
                s.split(/\s+/g).forEach(function (e) {
                    n(this).hasClass(e) || r.push(e)
                }, this), r.length && (this.className += (i ? " " : "") + r.join(" "))
            })
        },
        removeClass: function (t) {
            return this.each(function (n) {
                if (t === e)return this.className = "";
                r = this.className, F(this, t, n, r).split(/\s+/g).forEach(function (e) {
                    r = r.replace(P(e), " ")
                }), this.className = r.trim()
            })
        },
        toggleClass: function (t, r) {
            return this.each(function (i) {
                var s = F(this, t, i, this.className);
                (r === e ? !n(this).hasClass(s) : r) ? n(this).addClass(s) : n(this).removeClass(s)
            })
        }
    }, ["width", "height"].forEach(function (t) {
        n.fn[t] = function (r) {
            var i, s = t.replace(/./, function (e) {
                return e[0].toUpperCase()
            });
            return r === e ? this[0] == window ? window["inner" + s] : this[0] == o ? o.documentElement["offset" + s] : (i = this.offset()) && i[t] : this.each(function (e) {
                var i = n(this);
                i.css(t, F(this, r, e, i[t]()))
            })
        }
    }), p.forEach(function (e, t) {
        n.fn[e] = function () {
            var e = n.map(arguments, function (e) {
                return k(e) ? e : S.fragment(e)
            });
            if (e.length < 1)return this;
            var r = this.length, i = r > 1, s = t < 2;
            return this.each(function (n, o) {
                for (var u = 0; u < e.length; u++) {
                    var a = e[s ? e.length - u - 1 : u];
                    q(a, function (e) {
                        e.nodeName != null && e.nodeName.toUpperCase() === "SCRIPT" && (!e.type || e.type === "text/javascript") && window.eval.call(window, e.innerHTML)
                    }), i && n < r - 1 && (a = a.cloneNode(!0)), I(t, o, a)
                }
            })
        }, n.fn[t % 2 ? e + "To" : "insert" + (t ? "Before" : "After")] = function (t) {
            return n(t)[e](this), this
        }
    }), S.Z.prototype = n.fn, S.camelize = x, S.uniq = T, n.zepto = S, n
}();
window.Zepto = Zepto, "$"in window || (window.$ = Zepto), function (e) {
    function s(e) {
        return e._zid || (e._zid = r++)
    }

    function o(e, t, r, i) {
        t = u(t);
        if (t.ns)var o = a(t.ns);
        return (n[s(e)] || []).filter(function (e) {
            return e && (!t.e || e.e == t.e) && (!t.ns || o.test(e.ns)) && (!r || s(e.fn) === s(r)) && (!i || e.sel == i)
        })
    }

    function u(e) {
        var t = ("" + e).split(".");
        return {e: t[0], ns: t.slice(1).sort().join(" ")}
    }

    function a(e) {
        return new RegExp("(?:^| )" + e.replace(" ", " .* ?") + "(?: |$)")
    }

    function f(t, n, r) {
        e.isObject(t) ? e.each(t, r) : t.split(/\s/).forEach(function (e) {
            r(e, n)
        })
    }

    function l(t, r, i, o, a, l) {
        l = !!l;
        var c = s(t), h = n[c] || (n[c] = []);
        f(r, i, function (n, r) {
            var i = a && a(r, n), s = i || r, f = function (e) {
                var n = s.apply(t, [e].concat(e.data));
                return n === !1 && e.preventDefault(), n
            }, c = e.extend(u(n), {fn: r, proxy: f, sel: o, del: i, i: h.length});
            h.push(c), t.addEventListener(c.e, f, l)
        })
    }

    function c(e, t, r, i) {
        var u = s(e);
        f(t || "", r, function (t, r) {
            o(e, t, r, i).forEach(function (t) {
                delete n[u][t.i], e.removeEventListener(t.e, t.proxy, !1)
            })
        })
    }

    function v(t) {
        var n = e.extend({originalEvent: t}, t);
        return e.each(d, function (e, r) {
            n[e] = function () {
                return this[r] = h, t[e].apply(t, arguments)
            }, n[r] = p
        }), n
    }

    function m(e) {
        if (!("defaultPrevented"in e)) {
            e.defaultPrevented = !1;
            var t = e.preventDefault;
            e.preventDefault = function () {
                this.defaultPrevented = !0, t.call(this)
            }
        }
    }

    var t = e.zepto.qsa, n = {}, r = 1, i = {};
    i.click = i.mousedown = i.mouseup = i.mousemove = "MouseEvents", e.event = {
        add: l,
        remove: c
    }, e.proxy = function (t, n) {
        if (e.isFunction(t)) {
            var r = function () {
                return t.apply(n, arguments)
            };
            return r._zid = s(t), r
        }
        if (typeof n == "string")return e.proxy(t[n], t);
        throw new TypeError("expected function")
    }, e.fn.bind = function (e, t) {
        return this.each(function () {
            l(this, e, t)
        })
    }, e.fn.unbind = function (e, t) {
        return this.each(function () {
            c(this, e, t)
        })
    }, e.fn.one = function (e, t) {
        return this.each(function (n, r) {
            l(this, e, t, null, function (e, t) {
                return function () {
                    var n = e.apply(r, arguments);
                    return c(r, t, e), n
                }
            })
        })
    };
    var h = function () {
        return !0
    }, p = function () {
        return !1
    }, d = {
        preventDefault: "isDefaultPrevented",
        stopImmediatePropagation: "isImmediatePropagationStopped",
        stopPropagation: "isPropagationStopped"
    };
    e.fn.delegate = function (t, n, r) {
        var i = !1;
        if (n == "blur" || n == "focus")e.iswebkit ? n = n == "blur" ? "focusout" : n == "focus" ? "focusin" : n : i = !0;
        return this.each(function (s, o) {
            l(o, n, r, t, function (n) {
                return function (r) {
                    var i, s = e(r.target).closest(t, o).get(0);
                    if (s)return i = e.extend(v(r), {
                        currentTarget: s,
                        liveFired: o
                    }), n.apply(s, [i].concat([].slice.call(arguments, 1)))
                }
            }, i)
        })
    }, e.fn.undelegate = function (e, t, n) {
        return this.each(function () {
            c(this, t, n, e)
        })
    }, e.fn.live = function (t, n) {
        return e(document.body).delegate(this.selector, t, n), this
    }, e.fn.die = function (t, n) {
        return e(document.body).undelegate(this.selector, t, n), this
    }, e.fn.on = function (t, n, r) {
        return n == undefined || e.isFunction(n) ? this.bind(t, n) : this.delegate(n, t, r)
    }, e.fn.off = function (t, n, r) {
        return n == undefined || e.isFunction(n) ? this.unbind(t, n) : this.undelegate(n, t, r)
    }, e.fn.trigger = function (t, n) {
        return typeof t == "string" && (t = e.Event(t)), m(t), t.data = n, this.each(function () {
            "dispatchEvent"in this && this.dispatchEvent(t)
        })
    }, e.fn.triggerHandler = function (t, n) {
        var r, i;
        return this.each(function (s, u) {
            r = v(typeof t == "string" ? e.Event(t) : t), r.data = n, r.target = u, e.each(o(u, t.type || t), function (e, t) {
                i = t.proxy(r);
                if (r.isImmediatePropagationStopped())return !1
            })
        }), i
    }, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change select keydown keypress keyup error".split(" ").forEach(function (t) {
        e.fn[t] = function (e) {
            return this.bind(t, e)
        }
    }), ["focus", "blur"].forEach(function (t) {
        e.fn[t] = function (e) {
            if (e)this.bind(t, e); else if (this.length)try {
                this.get(0)[t]()
            } catch (n) {
            }
            return this
        }
    }), e.Event = function (e, t) {
        var n = document.createEvent(i[e] || "Events"), r = !0;
        if (t)for (var s in t)s == "bubbles" ? r = !!t[s] : n[s] = t[s];
        return n.initEvent(e, r, !0, null, null, null, null, null, null, null, null, null, null, null, null), n
    }
}(Zepto), function (e) {
    function t(e) {
        var t = this.os = {}, n = this.browser = {}, r = e.match(/WebKit\/([\d.]+)/), i = e.match(/(Android)\s+([\d.]+)/), s = e.match(/(iPad).*OS\s([\d_]+)/), o = !s && e.match(/(iPhone\sOS)\s([\d_]+)/), u = e.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), a = u && e.match(/TouchPad/), f = e.match(/Kindle\/([\d.]+)/), l = e.match(/Silk\/([\d._]+)/), c = e.match(/(BlackBerry).*Version\/([\d.]+)/);
        if (n.webkit = !!r)n.version = r[1];
        i && (t.android = !0, t.version = i[2]), o && (t.ios = t.iphone = !0, t.version = o[2].replace(/_/g, ".")), s && (t.ios = t.ipad = !0, t.version = s[2].replace(/_/g, ".")), u && (t.webos = !0, t.version = u[2]), a && (t.touchpad = !0), c && (t.blackberry = !0, t.version = c[2]), f && (t.kindle = !0, t.version = f[1]), l && (n.silk = !0, n.version = l[1]), !l && t.android && e.match(/Kindle Fire/) && (n.silk = !0)
    }

    t.call(e, navigator.userAgent), e.__detect = t
}(Zepto), function (e, t) {
    function c(e) {
        return e.toLowerCase()
    }

    function h(e) {
        return r ? r + e : c(e)
    }

    var n = "", r, i, s, o = {
        Webkit: "webkit",
        Moz: "",
        O: "o",
        ms: "MS"
    }, u = window.document, a = u.createElement("div"), f = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, l = {};
    e.each(o, function (e, i) {
        if (a.style[e + "TransitionProperty"] !== t)return n = "-" + c(e) + "-", r = i, !1
    }), l[n + "transition-property"] = l[n + "transition-duration"] = l[n + "transition-timing-function"] = l[n + "animation-name"] = l[n + "animation-duration"] = "", e.fx = {
        off: r === t && a.style.transitionProperty === t,
        cssPrefix: n,
        transitionEnd: h("TransitionEnd"),
        animationEnd: h("AnimationEnd")
    }, e.fn.animate = function (t, n, r, i) {
        return e.isObject(n) && (r = n.easing, i = n.complete, n = n.duration), n && (n /= 1e3), this.anim(t, n, r, i)
    }, e.fn.anim = function (r, i, s, o) {
        var u, a = {}, c, h = this, p, d = e.fx.transitionEnd;
        i === t && (i = .4), e.fx.off && (i = 0);
        if (typeof r == "string")a[n + "animation-name"] = r, a[n + "animation-duration"] = i + "s", d = e.fx.animationEnd; else {
            for (c in r)f.test(c) ? (u || (u = []), u.push(c + "(" + r[c] + ")")) : a[c] = r[c];
            u && (a[n + "transform"] = u.join(" ")), !e.fx.off && typeof r == "object" && (a[n + "transition-property"] = Object.keys(r).join(", "), a[n + "transition-duration"] = i + "s", a[n + "transition-timing-function"] = s || "linear")
        }
        return p = function (t) {
            if (typeof t != "undefined") {
                if (t.target !== t.currentTarget)return;
                e(t.target).unbind(d, arguments.callee)
            }
            e(this).css(l), o && o.call(this)
        }, i > 0 && this.bind(d, p), setTimeout(function () {
            h.css(a), i <= 0 && setTimeout(function () {
                h.each(function () {
                    p.call(this)
                })
            }, 0)
        }, 0), this
    }, a = null
}(Zepto), function ($) {
    function triggerAndReturn(e, t, n) {
        var r = $.Event(t);
        return $(e).trigger(r, n), !r.defaultPrevented
    }

    function triggerGlobal(e, t, n, r) {
        if (e.global)return triggerAndReturn(t || document, n, r)
    }

    function ajaxStart(e) {
        e.global && $.active++ === 0 && triggerGlobal(e, null, "ajaxStart")
    }

    function ajaxStop(e) {
        e.global && !--$.active && triggerGlobal(e, null, "ajaxStop")
    }

    function ajaxBeforeSend(e, t) {
        var n = t.context;
        if (t.beforeSend.call(n, e, t) === !1 || triggerGlobal(t, n, "ajaxBeforeSend", [e, t]) === !1)return !1;
        triggerGlobal(t, n, "ajaxSend", [e, t])
    }

    function ajaxSuccess(e, t, n) {
        var r = n.context, i = "success";
        n.success.call(r, e, i, t), triggerGlobal(n, r, "ajaxSuccess", [t, n, e]), ajaxComplete(i, t, n)
    }

    function ajaxError(e, t, n, r) {
        var i = r.context;
        r.error.call(i, n, t, e), triggerGlobal(r, i, "ajaxError", [n, r, e]), ajaxComplete(t, n, r)
    }

    function ajaxComplete(e, t, n) {
        var r = n.context;
        n.complete.call(r, t, e), triggerGlobal(n, r, "ajaxComplete", [t, n]), ajaxStop(n)
    }

    function empty() {
    }

    function mimeToDataType(e) {
        return e && (e == htmlType ? "html" : e == jsonType ? "json" : scriptTypeRE.test(e) ? "script" : xmlTypeRE.test(e) && "xml") || "text"
    }

    function appendQuery(e, t) {
        return (e + "&" + t).replace(/[&?]{1,2}/, "?")
    }

    function serializeData(e) {
        isObject(e.data) && (e.data = $.param(e.data)), e.data && (!e.type || e.type.toUpperCase() == "GET") && (e.url = appendQuery(e.url, e.data))
    }

    function serialize(e, t, n, r) {
        var i = $.isArray(t);
        $.each(t, function (t, s) {
            r && (t = n ? r : r + "[" + (i ? "" : t) + "]"), !r && i ? e.add(s.name, s.value) : (n ? $.isArray(s) : isObject(s)) ? serialize(e, s, n, t) : e.add(t, s)
        })
    }

    var jsonpID = 0, isObject = $.isObject, document = window.document, key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = "application/json", htmlType = "text/html", blankRE = /^\s*$/;
    $.active = 0, $.ajaxJSONP = function (e) {
        var t = "jsonp" + ++jsonpID, n = document.createElement("script"), r = function () {
            $(n).remove(), t in window && (window[t] = empty), ajaxComplete("abort", i, e)
        }, i = {abort: r}, s;
        return e.error && (n.onerror = function () {
            i.abort(), e.error()
        }), window[t] = function (r) {
            clearTimeout(s), $(n).remove(), delete window[t], ajaxSuccess(r, i, e)
        }, serializeData(e), n.src = e.url.replace(/=\?/, "=" + t), $("head").append(n), e.timeout > 0 && (s = setTimeout(function () {
            i.abort(), ajaxComplete("timeout", i, e)
        }, e.timeout)), i
    }, $.ajaxSettings = {
        type: "GET",
        beforeSend: empty,
        success: empty,
        error: empty,
        complete: empty,
        context: null,
        global: !0,
        xhr: function () {
            return new window.XMLHttpRequest
        },
        accepts: {
            script: "text/javascript, application/javascript",
            json: jsonType,
            xml: "application/xml, text/xml",
            html: htmlType,
            text: "text/plain"
        },
        crossDomain: !1,
        timeout: 0
    }, $.ajax = function (options) {
        var settings = $.extend({}, options || {});
        for (key in $.ajaxSettings)settings[key] === undefined && (settings[key] = $.ajaxSettings[key]);
        ajaxStart(settings), settings.crossDomain || (settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host);
        var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url);
        if (dataType == "jsonp" || hasPlaceholder)return hasPlaceholder || (settings.url = appendQuery(settings.url, "callback=?")), $.ajaxJSONP(settings);
        settings.url || (settings.url = window.location.toString()), serializeData(settings);
        var mime = settings.accepts[dataType], baseHeaders = {}, protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol, xhr = $.ajaxSettings.xhr(), abortTimeout;
        settings.crossDomain || (baseHeaders["X-Requested-With"] = "XMLHttpRequest"), mime && (baseHeaders.Accept = mime, mime.indexOf(",") > -1 && (mime = mime.split(",", 2)[0]), xhr.overrideMimeType && xhr.overrideMimeType(mime));
        if (settings.contentType || settings.data && settings.type.toUpperCase() != "GET")baseHeaders["Content-Type"] = settings.contentType || "application/x-www-form-urlencoded";
        settings.headers = $.extend(baseHeaders, settings.headers || {}), xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                clearTimeout(abortTimeout);
                var result, error = !1;
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == "file:") {
                    dataType = dataType || mimeToDataType(xhr.getResponseHeader("content-type")), result = xhr.responseText;
                    try {
                        dataType == "script" ? (1, eval)(result) : dataType == "xml" ? result = xhr.responseXML : dataType == "json" && (result = blankRE.test(result) ? null : JSON.parse(result))
                    } catch (e) {
                        error = e
                    }
                    error ? ajaxError(error, "parsererror", xhr, settings) : ajaxSuccess(result, xhr, settings)
                } else ajaxError(null, "error", xhr, settings)
            }
        };
        var async = "async"in settings ? settings.async : !0;
        xhr.open(settings.type, settings.url, async);
        for (name in settings.headers)xhr.setRequestHeader(name, settings.headers[name]);
        return ajaxBeforeSend(xhr, settings) === !1 ? (xhr.abort(), !1) : (settings.timeout > 0 && (abortTimeout = setTimeout(function () {
            xhr.onreadystatechange = empty, xhr.abort(), ajaxError(null, "timeout", xhr, settings)
        }, settings.timeout)), xhr.send(settings.data ? settings.data : null), xhr)
    }, $.get = function (e, t) {
        return $.ajax({url: e, success: t})
    }, $.post = function (e, t, n, r) {
        return $.isFunction(t) && (r = r || n, n = t, t = null), $.ajax({
            type: "POST",
            url: e,
            data: t,
            success: n,
            dataType: r
        })
    }, $.getJSON = function (e, t) {
        return $.ajax({url: e, success: t, dataType: "json"})
    }, $.fn.load = function (e, t) {
        if (!this.length)return this;
        var n = this, r = e.split(/\s/), i;
        return r.length > 1 && (e = r[0], i = r[1]), $.get(e, function (e) {
            n.html(i ? $(document.createElement("div")).html(e.replace(rscript, "")).find(i).html() : e), t && t.call(n)
        }), this
    };
    var escape = encodeURIComponent;
    $.param = function (e, t) {
        var n = [];
        return n.add = function (e, t) {
            this.push(escape(e) + "=" + escape(t))
        }, serialize(n, e, t), n.join("&").replace("%20", "+")
    }
}(Zepto), function (e) {
    e.fn.serializeArray = function () {
        var t = [], n;
        return e(Array.prototype.slice.call(this.get(0).elements)).each(function () {
            n = e(this);
            var r = n.attr("type");
            this.nodeName.toLowerCase() != "fieldset" && !this.disabled && r != "submit" && r != "reset" && r != "button" && (r != "radio" && r != "checkbox" || this.checked) && t.push({
                name: n.attr("name"),
                value: n.val()
            })
        }), t
    }, e.fn.serialize = function () {
        var e = [];
        return this.serializeArray().forEach(function (t) {
            e.push(encodeURIComponent(t.name) + "=" + encodeURIComponent(t.value))
        }), e.join("&")
    }, e.fn.submit = function (t) {
        if (t)this.bind("submit", t); else if (this.length) {
            var n = e.Event("submit");
            this.eq(0).trigger(n), n.defaultPrevented || this.get(0).submit()
        }
        return this
    }
}(Zepto), function (e) {
    function r(e) {
        return "tagName"in e ? e : e.parentNode
    }

    function i(e, t, n, r) {
        var i = Math.abs(e - t), s = Math.abs(n - r);
        return i >= s ? e - t > 0 ? "Left" : "Right" : n - r > 0 ? "Up" : "Down"
    }

    function u() {
        o = null, t.last && (t.el.trigger("longTap"), t = {})
    }

    function a() {
        o && clearTimeout(o), o = null
    }

    var t = {}, n, s = 750, o;
    e(document).ready(function () {
        var f, l;
        e(document.body).bind("touchstart", function (i) {
            f = Date.now(), l = f - (t.last || f), t.el = e(r(i.touches[0].target)), n && clearTimeout(n), t.x1 = i.touches[0].pageX, t.y1 = i.touches[0].pageY, l > 0 && l <= 250 && (t.isDoubleTap = !0), t.last = f, o = setTimeout(u, s)
        }).bind("touchmove", function (e) {
            a(), t.x2 = e.touches[0].pageX, t.y2 = e.touches[0].pageY
        }).bind("touchend", function (e) {
            a(), t.isDoubleTap ? (t.el.trigger("doubleTap"), t = {}) : t.x2 && Math.abs(t.x1 - t.x2) > 30 || t.y2 && Math.abs(t.y1 - t.y2) > 30 ? (t.el.trigger("swipe") && t.el.trigger("swipe" + i(t.x1, t.x2, t.y1, t.y2)), t = {}) : "last"in t && (t.el.trigger("tap"), n = setTimeout(function () {
                n = null, t.el.trigger("singleTap"), t = {}
            }, 250))
        }).bind("touchcancel", function () {
            n && clearTimeout(n), o && clearTimeout(o), o = n = null, t = {}
        })
    }), ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function (t) {
        e.fn[t] = function (e) {
            return this.bind(t, e)
        }
    })
}(Zepto), function () {
    window.visibly = {
        b: null,
        q: document,
        p: undefined,
        prefixes: ["webkit", "ms"],
        props: ["VisibilityState", "visibilitychange", "Hidden"],
        m: ["focus", "blur"],
        visibleCallbacks: [],
        hiddenCallbacks: [],
        _callbacks: [],
        onVisible: function (e) {
            this.visibleCallbacks.push(e)
        },
        onHidden: function (e) {
            this.hiddenCallbacks.push(e)
        },
        isSupported: function () {
            return this._supports(0) || this._supports(1)
        },
        _supports: function (e) {
            return this.prefixes[e] + this.props[2]in this.q
        },
        runCallbacks: function (e) {
            if (e) {
                this._callbacks = e == 1 ? this.visibleCallbacks : this.hiddenCallbacks;
                for (var t = 0; t < this._callbacks.length; t++)this._callbacks[t]()
            }
        },
        _visible: function () {
            window.visibly.runCallbacks(1)
        },
        _hidden: function () {
            window.visibly.runCallbacks(2)
        },
        _nativeSwitch: function () {
            this.q[this.b + this.props[2]] === !0 ? this._hidden() : this._visible()
        },
        listen: function () {
            try {
                this.isSupported() ? (this.b = this._supports(0) == this.p ? this.prefixes[1] : this.prefixes[0], this.q.addEventListener(this.b + this.props[1], function () {
                    window.visibly._nativeSwitch.apply(window.visibly, arguments)
                }, 1)) : document.addEventListener ? (window.addEventListener(this.m[0], this._visible, 1), window.addEventListener(this.m[1], this._hidden, 1)) : (this.q.attachEvent("onfocusin", this._visible), this.q.attachEvent("onfocusout", this._hidden))
            } catch (e) {
            }
        },
        init: function () {
            this.listen()
        }
    }, this.visibly.init()
}();
var remot = remot || {io: {}};
remot.io.profiles = [{
    name: "revealjs", detector: function () {
        return window.Reveal && window.Reveal.initialize
    }, config: {
        eventTarget: "document", eventType: "keyup", swipeUp: function () {
            Reveal.down()
        }, swipeDown: function () {
            Reveal.up()
        }, swipeLeft: function () {
            Reveal.right()
        }, swipeRight: function () {
            Reveal.left()
        }, tap: function () {
            Reveal.next()
        }, longTap: function () {
            Reveal.prev()
        }, pinch: function () {
            Reveal.toggleOverview(!0)
        }, zoom: function () {
            Reveal.toggleOverview(!1)
        }
    }
}, {
    name: "default",
    detector: function () {
        return !0
    },
    config: {
        eventTarget: document,
        eventType: "keyup",
        swipeUp: 38,
        swipeDown: 40,
        swipeLeft: 39,
        swipeRight: 37,
        tap: 39,
        longTap: 37,
        pinch: 27,
        zoom: 13
    }
}], remot.io.trigger = function (e, t, n) {
    "use strict";
    var r = document.createEvent("KeyboardEvent");
    try {
        Object.defineProperty(r, "keyCode", {
            get: function () {
                return this.keyCodeVal
            }
        }), Object.defineProperty(r, "which", {
            get: function () {
                return this.keyCodeVal
            }
        })
    } catch (i) {
    }
    r.initKeyboardEvent ? r.initKeyboardEvent(t, !0, !0, document.defaultView, !1, !1, !1, !1, n, n) : r.initKeyEvent(t, !0, !0, document.defaultView, !1, !1, !1, !1, n, n), r.keyCodeVal = n, e.dispatchEvent(r)
}, function () {
    "use strict";
    var e = {};
    if (!io)throw"socketio not found";
    location.host != "onembp.local" && (e.host = "remot.io"), remot.io.socket = io.connect("//" + location.host + "/receiver", e)
}(), function (e) {
    "use strict";
    function t() {
        remot.io.socket.on("connect", n)
    }

    function n(e) {
        r()
    }

    function r() {
        remot.io.socket.emit("uid", {uid: remot.io.uid})
    }

    t()
}(Zepto), function (e) {
    "use strict";
    function n() {
        for (var e = 0, n; n = remot.io.profiles[e]; e++)if (n.detector && n.detector()) {
            t = n.config, console.log("using " + n.name + " profile");
            break
        }
        r()
    }

    function r() {
        remot.io.socket.on("control", i)
    }

    function i(e) {
        o(e.type), s(e.type)
    }

    function s(e) {
        document.body.dataset.eventType = e
    }

    function o(e) {
        console.log(t, e, t[e]), typeof t[e] == "number" ? remot.io.trigger(t.eventTarget, t.eventType, t[e]) : typeof t[e] == "function" && t[e]()
    }

    var t;
    n()
}(Zepto);
var profiles = {}