function _Response(rt, re) {
    return new(class Response {
        get data() {
            return rt;
        }

        get headers() {
            return re.headers;
        }

        get ok() {
            return re.ok;
        }

        get status() {
            return re.status;
        }

        get statusText() {
            return re.statusText;
        }

        get url() {
            return re.url;
        }

        get type() {
            return re.type;
        }
    })
};

function _Request() {
    var URL,
        DATA,
        ALLOW = false;

    /**
     * set the Vars
     * @param {String} url
     * @param {Object} opts
     */
    function Request() {
        var url = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (url instanceof Request) return url;

        if (!(this instanceof Request)) return new Request(url, opts);

        this.url = url;
        this.auth = opts.auth;
        this.headers = new Headers(opts.headers) || new Headers();
        this.method = opts.method ? opts.method.toLowerCase() : "get";
        this.body = opts.json || opts.form || opts.query || {};
        this.mode = opts.mode || 'cors';

        _method(this, opts);
        _auth(this);
    }

    Request.fn = Request.prototype;

    /**
     * add new header to headres
     * @param {String} name
     * @param {String} type
     * @return Request
     */
    Request.fn.addHeader = function(name, type) {
        if (name && type) {
            this.headers.append(name, type);
        }
        return this;
    };

    /**
     * set mode
     * @param {String} o
     * @return Request
     */
    Request.fn.setMode = function(mode) {
        if (mode) this.mode = mode;
        else this.mode = "cors";
        return this;
    };

    /**
     * set auth Header
     * @param {Object} o
     * @return Request
     */
    Request.fn.setAuth = function(auth) {
        if (_test.isObject(auth)) {
            this.auth = auth;
            _auth(this);
        }
        return this;
    };

    /**
     * set data and convert it to Query String
     * @param {Object|Fromdata} o
     * @return Request
     */
    Request.fn.setQuery = function(obj) {
        this.body = obj;
        DATA = _toQuery(obj);
        return this;
    };

    /**
     * set data and convert it to Json String
     * @param {Object|Fromdata} o
     * @return Request
     */
    Request.fn.setJson = function(obj) {
        this.body = obj;
        DATA = _toJson(obj);
        return this;
    };

    /**
     * set data and convert it to Formdata
     * @param {Object|Fromdata} o
     * @return Request
     */
    Request.fn.setForm = function(obj) {
        this.body = obj;
        DATA = _toForm(obj);
        return this;
    };

    /**
     * execute fetch as arrayBuffer
     * @return Object
     */
    Request.fn.buffer = async function() {
        return this.get("arraybuffer");
    };

    /**
     * execute fetch as Clone
     * @return Object
     */
    Request.fn.clone = async function() {
        return this.get("clone");
    };

    /**
     * execute fetch as Text
     * @return Object
     */
    Request.fn.text = async function() {
        return this.get("text");
    };

    /**
     * execute fetch as Json
     * @return Object
     */
    Request.fn.json = async function() {
        return this.get("json");
    };

    /**
     * execute fetch as Blob
     * @return Object
     */
    Request.fn.blob = async function() {
        return this.get("blob");
    };

    /**
     * execute fetch as Formdata
     * @return Object
     */
    Request.fn.form = async function() {
        return this.get("formdata");
    };

    /**
     * test the type and execute fetch as type entred
     * @param {String} type
     * @return XOFetcj
     */
    Request.fn.get = async function(type) {
        var types = {
            arraybuffer: "arrayBuffer",
            blob: "blob",
            clone: "clone",
            formdata: "formData",
            json: "json",
            text: "text",
        };
        if (Object.keys(types).includes(type.toLowerCase())) {
            var obj = _getObj(this),
                re = await fetch(URL, obj),
                rt = await re[type.toLowerCase()]();
            _clean(this);
            return _getRes(re, rt);
        } else {
            return new Promise.reject(
                new Response({
                    type: "error",
                    message: "type is not recognized",
                })
            );
        }
    };

    /**
     * test if the Element type
     * @param {Element} obj
     * @return Boolean
     */
    var _test = {
        isBoolean: function isBoolean(obj) {
            return obj !== undefined && obj !== null && obj.constructor == Boolean;
        },
        isNumber: function isNumber(obj) {
            return obj !== undefined && obj !== null && obj.constructor == Number;
        },
        isString: function isString(obj) {
            return obj !== undefined && obj !== null && obj.constructor == String;
        },
        isArray: function isArray(obj) {
            return obj !== undefined && obj !== null && obj.constructor == Array;
        },
        isObject: function isObject(obj) {
            return obj !== undefined && obj !== null && obj.constructor == Object;
        },
        isFunction: function isFunction(obj) {
            return obj !== undefined && obj !== null && obj.constructor == Function;
        },
        isFormData: function isFormData(obj) {
            return obj !== undefined && obj !== null && obj.constructor == FormData;
        },
    };

    /**
     * set vars in object
     * @param {Request} req
     * @param {Response} res
     * @return Object
     */
    function _getRes(re, rt) {
        return _Response(rt, re);
    }

    /**
     * convert Object|Formdata to Json String
     * @param {Object|Formdata} d
     * @return Json String
     */
    function _toJson(d) {
        if (_test.isFormData(d)) {
            var o = {};
            d.forEach(function(value, key) {
                if (!Reflect.has(o, key)) {
                    o[key] = value;
                    return;
                }
                if (!Array.isArray(o[key])) {
                    o[key] = [o[key]];
                }
                o[key].push(value);
            });
            return JSON.stringify(o)

        }
        return null;
    }

    /**
     * convert Object|Formdata to Formdata
     * @param {Object|FormData} d
     * @return Formdata
     */
    function _toForm(d) {
        if (_test.isObject(d)) {
            var f = new FormData();
            Object.keys(d).forEach(function(k) {
                f.append(k, d[k]);
            });
            return f;
        }
        return null;
    }

    /**
     * convert Object|Formdata to Query String
     * @param {Object|FormData} d
     * @return Query String
     */
    function _toQuery(d) {
        if (_test.isFormData(d)) d = new Function("return " + _toJson(d))();
        return (
            Object.keys(d)
            .reduce(function(a, i) {
                return [...a, i + "=" + encodeURIComponent(d[i]).replace("%20", "+")];
            }, [])
            .join("&")
        );
    }

    /**
     * set data depend on the method type
     * @param {Request} self
     * @param {Object} obj
     */
    function _method(self, obj) {
        if (self.method === "post") {
            ALLOW = true;
            if (obj.form) {
                self.addHeader('Content-Type', 'multipart/form-data');
                DATA = _toForm(obj.form);
                return;
            }
            if (obj.json) {
                self.addHeader('Content-Type', 'application/json');
                DATA = _toJson(obj.json);
                return;
            }
            if (obj.query) {
                self.addHeader('Content-Type', 'text/plain');
                DATA = _toQuery(obj.query);
                return;
            }
        }

        if (self.method === "put") {
            ALLOW = true;
            if (obj.form) {
                self.addHeader('Content-Type', 'multipart/form-data');
                DATA = _toForm(obj.form);
                return;
            }
            if (obj.json) {
                self.addHeader('Content-Type', 'application/json');
                DATA = _toJson(obj.json);
                return;
            }
            if (obj.query) {
                self.addHeader('Content-Type', 'text/plain');
                DATA = _toQuery(obj.query);
                return;
            }
        }

        if (self.method === "get") {
            ALLOW = false;
            if (obj.query) {
                self.addHeader('Content-Type', 'text/plain');
                DATA = _toQuery(obj.query);
                return;
            }
        }

        if (self.method === "delete") {
            ALLOW = false;
            if (obj.query) {
                self.addHeader('Content-Type', 'text/plain');
                DATA = _toQuery(obj.query);
                return;
            }
        }
    }

    /**
     * set auth headers
     * @param {Request} self
     */
    function _auth(self) {
        if (self.auth && _test.isObject(self.auth)) {
            var auth;
            if (self.auth.username && self.auth.password) auth = "Basic " + _encode(self.auth.username + ":" + self.auth.password);
            if (self.auth.bearer) auth = "Bearer " + self.auth.bearer;
            if (auth) self.headers.append("Authorization", auth);
        }
    }

    /**
     * set fetch obj and url
     * @param {Request} s
     * @return Object
     */
    function _getObj(self) {
        var obj = { headers: self.headers, method: self.method, mode: self.mode };
        if (self.auth) obj.credentials = "include";
        if (ALLOW) {
            if (DATA) obj.body = DATA;
            URL = self.url;
        } else {
            URL = self.url;
            if (DATA) URL += "?" + DATA;
        }
        return obj;
    }

    /**
     * clean the Request props
     * @param {Request} self
     */
    function _clean(self) {
        self.url = undefined;
        self.auth = undefined;
        self.body = undefined;
        self.method = undefined;
        self.headers = undefined;
        DATA = undefined;
        URL = undefined;
        ALLOW = false;
    }

    /**
     * encode string
     * @param {string} input
     * @return string
     */
    function _encode(input) {
        var TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        input = String(input);
        if (/[^\0-\xFF]/.test(input)) {
            // Note: no need to special-case astral symbols here, as surrogates are
            // matched, and the input is supposed to only contain ASCII anyway.
            throw new Error("The string to be encoded contains characters outside of the " + "Latin1 range.");
        }
        var padding = input.length % 3,
            length = input.length - padding,
            position = -1,
            output = "",
            buffer = void 0,
            a = void 0,
            b = void 0,
            c = void 0;
        while (++position < length) {
            // Read three bytes, i.e. 24 bits.
            a = input.charCodeAt(position) << 16;
            b = input.charCodeAt(++position) << 8;
            c = input.charCodeAt(++position);
            buffer = a + b + c;
            // Turn the 24 bits into four chunks of 6 bits each, and append the
            // matching character for each of them to the output.
            output +=
                TABLE.charAt((buffer >> 18) & 0x3f) +
                TABLE.charAt((buffer >> 12) & 0x3f) +
                TABLE.charAt((buffer >> 6) & 0x3f) +
                TABLE.charAt(buffer & 0x3f);
        }
        if (padding == 2) {
            a = input.charCodeAt(position) << 8;
            b = input.charCodeAt(++position);
            buffer = a + b;
            output += TABLE.charAt(buffer >> 10) + TABLE.charAt((buffer >> 4) & 0x3f) + TABLE.charAt((buffer << 2) & 0x3f) + "=";
        } else if (padding == 1) {
            buffer = input.charCodeAt(position);
            output += TABLE.charAt(buffer >> 2) + TABLE.charAt((buffer << 4) & 0x3f) + "==";
        }
        return output;
    }

    /**
     * set Request as Global
     * @return Request
     */
    ["get", "put", "post", "delete"].forEach(function(m) {
        Request[m] = function(url, opts = {}) {
            return new Request(url, Object.assign(opts, { method: m }));
        };
    });

    return Request;
};

module.exports = _Request();