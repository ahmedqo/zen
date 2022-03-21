var domReadyQueue = [];

/**
 * check if dom loaded then run fn else push to array
 * @param {Function} fn
 * @return Function|Array
 */
var handleDOMReady = function handleDOMReady(fn) {
    return document.readyState === 'complete' ? fn.call(document) : domReadyQueue.push(fn);
};

document.addEventListener('DOMContentLoaded', function onDOMReady() {
    document.removeEventListener('DOMContentLoaded', onDOMReady);

    while (domReadyQueue.length) {
        domReadyQueue.shift().call(document);
    }
});

/**
 * dom Constractor
 * @param {String|HTMLElement|NodeList} ele
 * @return dom
 */
function dom(ele) {
    if (ele instanceof dom) {
        return ele;
    }

    if (!(this instanceof dom)) {
        return new dom(ele);
    }

    if (typeof ele === 'function') {
        return handleDOMReady(ele);
    }

    this._nodes = [];

    if (ele instanceof HTMLCollection || ele instanceof HTMLElement || ele instanceof NodeList || ele instanceof Array || ele === document || ele === window) {
        this._nodes = ele.length > 0 ? [].slice.call(ele) : [ele];
    } else if (typeof ele === 'string') {
        if (ele[ele.length - 1] === '>' && ele[0] === '<') {
            this._nodes = [createNode(ele)];
        } else {
            this._nodes = [].slice.call(document.querySelectorAll(ele));
        }
    }

    if (this._nodes.length) {
        this.length = this._nodes.length;
        for (var i = 0; i < this._nodes.length; i++) {
            this[i] = this._nodes[i];
        }
    }
}

/**
 * create an html element
 * @param {String} htm
 * @return HTMLElement
 */
function createNode(htm) {
    var div = document.createElement('div');
    div.innerHTML = htm;
    return div.firstChild;
}

dom.fn = dom.prototype;

/**
 * execute fn to each node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.each = function(fn) {
    for (var i = 0; i < this.length; i++) {
        fn.call(this, this[i], i);
    }
    return this;
};

/**
 * if htm set html to each node list elements
 * get html of the first node list element
 * @param {String|Undefined|Array} htm
 * @return dom|String
 */
dom.fn.htm = function(htm) {
    if (htm == undefined) {
        return this[0] && this[0].innerHTML;
    }

    if (htm instanceof Array) {
        return this[0] && this[0].outerHTML;
    }

    this.each(function(e) {
        e.innerHTML = htm;
    });

    return this;
};

/**
 * set text to each node list elements
 * get text of the first node list element
 * @param {String} txt
 * @return dom|String
 */
dom.fn.txt = function(txt) {
    if (txt == undefined) {
        return this[0] && this[0].innerText;
    }

    this.each(function(e) {
        e.innerText = txt;
    });

    return this;
};

/**
 * set val to each node list elements if value in element
 * get value of the first node list element if value in element
 * @param {String} val
 * @return dom
 */
dom.fn.val = function(val) {
    var _this = this;

    if (val == undefined) {
        return this[0] && 'value' in this[0] && this[0].value;
    }

    this.each(function(e) {
        if ('value' in _this[0]) e.value = val;
    });

    return this;
};

dom.fn.file = function(n) {
    if (typeof n === 'number') return this[0].files[n];
    else return this[0].files;
};

/**
 * get value length of the first node list element
 * @return Number
 */
dom.fn.len = function() {
    return this[0] && 'value' in this[0] && this[0].value.trim().length;
};

/**
 * add html|node to each node list elements
 * @param {String|NodeList} htm
 * @return dom
 */
dom.fn.attach = function() {
    for (var _len = arguments.length, htm = Array(_len), _key = 0; _key < _len; _key++) {
        htm[_key] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = htm[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            if (typeof n === 'string') this.each(function(e) {
                e.insertAdjacentHTML('beforeend', n);
            });
            if (n instanceof HTMLElement) this.each(function(e) {
                e.append(n);
            });
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return this;
};

/**
 * append each node list element to target
 * @param {HTMLElement|String} el
 * @return dom
 */
dom.fn.attachTo = function(el) {
    if (el instanceof HTMLElement) {
        this.each(function(e) {
            el.append(e);
        });
    }
    if (typeof el === 'string') {
        var _el = document.querySelector(el);
        this.each(function(e) {
            _el.append(e);
        });
    }

    return this;
};

/**
 * pre-add html|node to each node list elements
 * @param {String|NodeList} htm
 * @return dom
 */
dom.fn.pretach = function() {
    for (var _len2 = arguments.length, htm = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        htm[_key2] = arguments[_key2];
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = htm[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var n = _step2.value;

            if (typeof n === 'string') this.each(function(e) {
                e.insertAdjacentHTML('afterbegin', n);
            });
            if (n instanceof HTMLElement) this.each(function(e) {
                e.prepend(n);
            });
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return this;
};

/**
 * prepend each node list element to target
 * @param {HTMLElement|String} el
 * @return dom
 */
dom.fn.pretachTo = function(el) {
    if (el instanceof HTMLElement) {
        this.each(function(e) {
            el.prepend(e);
        });
    }
    if (typeof el === 'string') {
        var _el = document.querySelector(el);
        this.each(function(e) {
            _el.prepend(e);
        });
    }

    return this;
};

/**
 * wrap each node list element with htm
 * @param {String} htm
 * @return dom
 */
dom.fn.wrap = function(htm) {
    if (typeof htm === 'string') {
        this.each(function(e) {
            var w = createNode(htm);
            e.parentElement.insertBefore(w, e);
            w.append(e);
        });
    }
    return this;
};

/**
 * remove parent of each node list element
 * @return dom
 */
dom.fn.unwrap = function() {
    this.each(function(e) {
        var p = e.parentElement,
            g = p.parentElement;
        g.insertBefore(e, p);
        p.remove();
    });

    return this;
};

/**
 * get computed width of the first node list element if otr get bounding
 * @param {Boolean} otr
 * @return String
 */
dom.fn.width = function(otr) {
    return this[0] && otr ? this[0].getBoundingClientRect().width : getComputedStyle(this[0]).width;
};

/**
 * get computed height of the first node list element if otr get bounding
 * @param {Boolean} otr
 * @return String
 */
dom.fn.height = function(otr) {
    return this[0] && otr ? this[0].getBoundingClientRect().height : getComputedStyle(this[0]).height;
};

/**
 * add html|node after each node list elements
 * @param {String|NodeList} htm
 * @return dom
 */
dom.fn.after = function() {
    for (var _len3 = arguments.length, htm = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        htm[_key3] = arguments[_key3];
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = htm[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var n = _step3.value;

            if (typeof n === 'string') {
                this.each(function(e) {
                    e.insertAdjacentHTML('afterEnd', n);
                });
            }
            if (n instanceof HTMLElement) {
                this.each(function(e) {
                    e.insertAdjacentElement('afterEnd', n);
                });
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return this;
};

/**
 * add html|node before each node list elements
 * @param {String|NodeList} htm
 * @return dom
 */
dom.fn.before = function() {
    for (var _len4 = arguments.length, htm = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        htm[_key4] = arguments[_key4];
    }

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = htm[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var n = _step4.value;

            if (typeof n === 'string') this.each(function(e) {
                e.insertAdjacentHTML('beforeBegin', n);
            });
            if (n instanceof HTMLElement) this.each(function(e) {
                e.insertAdjacentElement('beforeBegin', n);
            });
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    return this;
};

/**
 * remove ele node list or node list elements
 * @param {String} ele
 * @return dom
 */
dom.fn.detach = function(ele) {
    if (ele) this.each(function(e) {
        var chd = [].slice.call(e.querySelectorAll(ele));
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = chd[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var c = _step5.value;
                c.remove();
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }
    });
    else this.each(function(e, i) {
        this._nodes = [];
        delete this[i];
        e.remove();
    });

    return this;
};

/**
 * find element in each node list elements
 * @param {String} ele
 * @return dom
 */
dom.fn.find = function(ele) {
    if (ele) {
        var els = [].slice.call(document.querySelectorAll(ele));
        for (var i = 0, e = els[i]; i < els.length; i++) {
            if (!this._nodes.includes(e.parentElement)) {
                els.splice(i, 1);
            }
        }
        return dom(els);
    }

    return this;
};

/**
 * get children of each node list elements
 * @return dom
 */
dom.fn.children = function() {
    var all = [];
    this.each(function(e) {
        all = [].concat.call(all, [].slice.call(e.children));
    });

    return new dom(all);
};

/**
 * get children of each node list elements
 * @return dom
 */
dom.fn.nodes = function() {
    var all = [];
    this.each(function(e) {
        all = [].concat.call(all, [].slice.call(e.childNodes));
    });

    return new dom(all);
};

/**
 * clone each node list elements
 * @return dom
 */
dom.fn.clone = function() {
    var all = [];
    this.each(function(e) {
        all.push(e.cloneNode());
    });

    return new dom(all);
};

/**
 * replce each node list elements with ele
 * @param {String|Node} ele
 * @return dom
 */
dom.fn.replace = function(ele) {
    if (ele) {
        var node = createNode(ele);
        this.each(function(el) {
            el.replaceWith(node);
        });
    }

    return this;
};

/**
 * add classes to each node list elements
 * @param  {...String} nms
 * @return dom
 */
dom.fn.addClass = function() {
    for (var _len5 = arguments.length, nms = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        nms[_key5] = arguments[_key5];
    }

    this.each(function(el) {
        var _el$classList;

        (_el$classList = el.classList).add.apply(_el$classList, nms);
    });

    return this;
};

/**
 * delete classes to each node list elements
 * @param  {...String} nms
 * @return dom
 */
dom.fn.delClass = function() {
    for (var _len6 = arguments.length, nms = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        nms[_key6] = arguments[_key6];
    }

    this.each(function(e) {
        var _e$classList;

        (_e$classList = e.classList).remove.apply(_e$classList, nms);
    });

    return this;
};

/**
 * toggle classes to each node list elements
 * @param  {...String} nms
 * @return dom
 */
dom.fn.togClass = function() {
    for (var _len7 = arguments.length, nms = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        nms[_key7] = arguments[_key7];
    }

    this.each(function(e) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = nms[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var c = _step6.value;

                e.classList.toggle(c);
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }
    });

    return this;
};

/**
 * weather the first node list element has class or not
 * @param {String} nms
 * @return Boolean
 */
dom.fn.hasClass = function(nms) {
    return this[0] && this[0].classList.contains(nms);
};

/**
 * replace old class name with new class name to each node list elements
 * @param {String} onm
 * @param {String} nnm
 * @return dom
 */
dom.fn.putClass = function(onm, nnm) {
    this.each(function(e) {
        e.classList.replace(onm, nnm);
    });

    return this;
};

/**
 * if nam{String} and val{String} set attribute to each node list elements
 * if nam{String} get attribute of the first node list element
 * if nam{Object} set attributes to each node list elements
 * @param {String|Object} nam
 * @param {String} val
 * @return dom|String
 */
dom.fn.attr = function(nam, val) {
    if (nam && val == undefined && typeof nam == 'string') {
        return this[0] && this[0].getAttribute(nam);
    }
    if (nam && val != undefined && typeof nam == 'string') {
        this.each(function(e) {
            e.setAttribute(nam, val);
        });
    }

    if (nam && val === 'object') {
        this.each(function(e) {
            for (var key in nam) {
                let dec = key.replace(/\p{Lu}/gu, (m) => '-' + m.toLowerCase());
                e.setAttribute(dec, nam[key]);
            }
        });
    }

    return this;
};

/**
 * delete attributes to each node list elements
 * @param  {...String} nms
 * @return dom
 */
dom.fn.delAttr = function() {
    for (var _len8 = arguments.length, nms = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        nms[_key8] = arguments[_key8];
    }

    this.each(function(e) {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = nms[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var c = _step7.value;

                e.removeAttribute(c);
            }
        } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                }
            } finally {
                if (_didIteratorError7) {
                    throw _iteratorError7;
                }
            }
        }
    });

    return this;
};

/**
 * toggle attributes to each node list elements
 * @param  {...String} nms
 * @return dom
 */
dom.fn.togAttr = function() {
    for (var _len9 = arguments.length, nms = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        nms[_key9] = arguments[_key9];
    }

    this.each(function(e) {
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
            for (var _iterator8 = nms[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var c = _step8.value;

                e.toggleAttribute(c);
            }
        } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                    _iterator8.return();
                }
            } finally {
                if (_didIteratorError8) {
                    throw _iteratorError8;
                }
            }
        }
    });

    return this;
};

/**
 * weather the first node list element has attribute or not
 * @param {String} nms
 * @return Boolean
 */
dom.fn.hasAttr = function(nms) {
    return this[0] && this[0].hasAttribute(nms);
};

/**
 * replace old attribute name with new attribute name to each node list elements
 * @param {String} onm
 * @param {String} nnm
 * @return dom
 */
dom.fn.putAttr = function(onm, nnm, val) {
    if (typeof onm === 'string' && typeof nnm === 'string') {
        this.setAttr(nnm, val);
        this.delAttr(onm);
    }

    return this;
};

/**
 * if nam{String} and val{String} set property to each node list elements
 * if nam{String} get property of the first node list element
 * if nam{Object} set properties to each node list elements
 * @param {String|Object} nam
 * @param {String} val
 * @return dom|String
 */
dom.fn.prop = function(nam, val) {
    if (nam && val === undefined && typeof nam == 'string') {
        return this[0] && this[0][nam];
    }

    if (nam && val !== undefined && typeof nam == 'string') {
        this.each(function(e) {
            e[nam] = val;
        });
    }

    if (nam && val === 'object') {
        this.each(function(e) {
            for (var key in nam) {
                e[key] = nam[key];
            }
        });
    }

    return this;
};

/**
 * delete properties to each node list elements
 * @param  {...String} nms
 * @return dom
 */
dom.fn.delProp = function() {
    for (var _len10 = arguments.length, nms = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        nms[_key10] = arguments[_key10];
    }

    this.each(function(e) {
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
            for (var _iterator9 = nms[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var c = _step9.value;

                delete e[c];
            }
        } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                    _iterator9.return();
                }
            } finally {
                if (_didIteratorError9) {
                    throw _iteratorError9;
                }
            }
        }
    });

    return this;
};

/**
 * weather the first node list element has property or not
 * @param {String} nms
 * @return Boolean
 */
dom.fn.hasProp = function(nm) {
    return this[0] && nm in this[0];
};

/**
 * get next node of the first node list element
 * @return dom
 */
dom.fn.next = function() {
    return this[0] && new dom(this[0].nextElementSibling);
};

/**
 * get previous node of the first node list element
 * @return dom
 */
dom.fn.prev = function() {
    return this[0] && new dom(this[0].previousElementSibling);
};

/**
 * get parent node of the first node list element
 * @return dom
 */
dom.fn.parent = function() {
    return this[0] && new dom(this[0].parentElement);
};

/**
 * get length of node list
 * @return Number
 */
dom.fn.size = function() {
    return this._nodes.length;
};

/**
 * if nam{String} and val{String} set style to each node list elements
 * if nam{String} get style of the first node list element
 * if nam{Object} set styles to each node list elements
 * @param {String|Object} nam
 * @param {String} val
 * @return dom|String
 */
dom.fn.css = function(nam, val) {
    if (nam && val === undefined && typeof nam == 'string') {
        return this[0] && getComputedStyle(this[0])[nam];
    }

    if (nam && val !== undefined && typeof nam == 'string') {
        if (val.startsWith(':')) {
            return this[0] && getComputedStyle(this[0], val)[nam];
        }
        this.each(function(e) {
            e.style.setProperty(nam, val);
        });
    }

    if (nam && val === 'object') {
        this.each(function(e) {
            for (var key in nam) {
                let dec = key.replace(/\p{Lu}/gu, (m) => '-' + m.toLowerCase());
                e.style.setProperty(dec, nam[key]);
            }
        });
    }

    return this;
};

/**
 * if nam{String} and val{String} set dataset val to each node list elements
 * if nam{String} get dataset val of the first node list element
 * if nam{Object} set dataset vals to each node list elements
 * @param {String|Object} nam
 * @param {String} val
 * @return dom|String
 */
dom.fn.data = function(nam, val) {
    if (nam && val === undefined && typeof nam == 'string') {
        return this[0] && this[0].dataset[nam];
    }

    if (nam && val !== undefined && typeof nam == 'string') {
        this.each(function(e) {
            e.dataset[nam] = val;
        });
    }

    if (nam && val === 'object') {
        this.each(function(e) {
            for (var key in nam) {
                e.dataset[key] = nam[key];
            }
        });
    }

    return this;
};

/**
 * get node list element at pos n -1 last one as dom
 * @param {Number} n
 * @return dom
 */
dom.fn.get = function(n) {
    if (typeof n === 'number') {
        var el = void 0;
        if (n === -1) el = this._nodes[this._nodes.length - 1];
        else el = this._nodes[n];
        if (el) return el;
    }
    return this._nodes;
};

/**
 * validate value of the first node list element
 * @param  {...String} nms
 * @return Boolean
 */
dom.fn.validate = function() {
    var regex = {
            email: /[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}/g,
            zipCode: /[0-9]{4,10}/g,
            upperCase: /[A-Z]/g,
            lowerCase: /[a-z]/g,
            numeric: /[0-9]/g,
            special: /\W/g
        },
        keys = Object.keys(regex),
        arr = [];
    if (!this[0] && !('value' in this[0])) return null;

    for (var _len11 = arguments.length, nms = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        nms[_key11] = arguments[_key11];
    }

    var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {
        for (var _iterator10 = nms[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            var n = _step10.value;

            if (keys.indedomf(n) !== -1) {
                arr.push(regex[n].test(this[0].value.trim()));
            }
        }
    } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion10 && _iterator10.return) {
                _iterator10.return();
            }
        } finally {
            if (_didIteratorError10) {
                throw _iteratorError10;
            }
        }
    }

    return arr.includes(false) ? false : true;
};

// Evenets

/**
 * add event to node list elements
 * @param {String} nam
 * @param {Function} fn
 * @return dom
 */
dom.fn.on = function(nam, fn) {
    this.each(function(e) {
        e.addEventListener(nam, fn, false);
        if (!('eventList' in e)) e.eventList = {};
        if (!(nam in e.eventList)) e.eventList[nam] = [];
        e.eventList[nam].push(fn);
    });

    return this;
};

/**
 * del event to node list elements
 * @param {String} nam
 * @param {Function} fn
 * @return dom
 */
dom.fn.off = function(nam, fn) {
    this.each(function(e) {
        e.removeEventListener(nam, fn);
        if (!('eventList' in e)) e.eventList = {};
        if (!(nam in e.eventList)) e.eventList[nam] = [];
        if (e.eventList[nam].indedomf(fn) !== -1) e.eventList[nam].splice(e.eventList[nam].indedomf(fn), 1);
    });

    return this;
};

/**
 * run over on mouseover and run out on mouseout to each node list elements
 * @param {Function} over
 * @param {Function} out
 * @return dom
 */
dom.fn.hover = function(over, out) {
    if (typeof over === 'function' && typeof out === 'function') {
        this.each(function(e) {
            e.onmouseover = over;
            if (!('eventList' in e)) e.eventList = {};
            if (!('mouseover' in e.eventList)) e.eventList.mouseover = [];
            e.eventList.mouseover.push(fn);
            e.onmouseout = out;
            if (!('eventList' in e)) e.eventList = {};
            if (!('mouseout' in e.eventList)) e.eventList.mouseout = [];
            e.eventList.mouseout.push(fn);
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.afterprint = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('afterprint' in e.eventList)) e.eventList.afterprint = [];
            e.eventList.afterprint.push(fn);
            e.onafterprint = fn;
        });
    } else {
        this.each(function(e) {
            if ('afterprint' in e) e.afterprint();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.beforeprint = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('beforeprint' in e.eventList)) e.eventList.beforeprint = [];
            e.eventList.beforeprint.push(fn);
            e.onbeforeprint = fn;
        });
    } else {
        this.each(function(e) {
            if ('beforeprint' in e) e.beforeprint();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.beforeunload = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('beforeunload' in e.eventList)) e.eventList.beforeunload = [];
            e.eventList.beforeunload.push(fn);
            e.onbeforeunload = fn;
        });
    } else {
        this.each(function(e) {
            if ('beforeunload' in e) e.beforeunload();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.error = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('error' in e.eventList)) e.eventList.error = [];
            e.eventList.error.push(fn);
            e.onerror = fn;
        });
    } else {
        this.each(function(e) {
            if ('error' in e) e.error();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.hashchange = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('hashchange' in e.eventList)) e.eventList.hashchange = [];
            e.eventList.hashchange.push(fn);
            e.onhashchange = fn;
        });
    } else {
        this.each(function(e) {
            if ('hashchange' in e) e.hashchange();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.load = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('load' in e.eventList)) e.eventList.load = [];
            e.eventList.load.push(fn);
            e.onload = fn;
        });
    } else {
        this.each(function(e) {
            if ('load' in e) e.load();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.offline = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('offline' in e.eventList)) e.eventList.offline = [];
            e.eventList.offline.push(fn);
            e.onoffline = fn;
        });
    } else {
        this.each(function(e) {
            if ('offline' in e) e.offline();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.online = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('online' in e.eventList)) e.eventList.online = [];
            e.eventList.online.push(fn);
            e.ononline = fn;
        });
    } else {
        this.each(function(e) {
            if ('online' in e) e.online();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.pageshow = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('pageshow' in e.eventList)) e.eventList.pageshow = [];
            e.eventList.pageshow.push(fn);
            e.onpageshow = fn;
        });
    } else {
        this.each(function(e) {
            if ('pageshow' in e) e.pageshow();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.resize = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('resize' in e.eventList)) e.eventList.resize = [];
            e.eventList.resize.push(fn);
            e.onresize = fn;
        });
    } else {
        this.each(function(e) {
            if ('resize' in e) e.resize();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.unload = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('unload' in e.eventList)) e.eventList.unload = [];
            e.eventList.unload.push(fn);
            e.onunload = fn;
        });
    } else {
        this.each(function(e) {
            if ('unload' in e) e.unload();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.blur = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('blur' in e.eventList)) e.eventList.blur = [];
            e.eventList.blur.push(fn);
            e.onblur = fn;
        });
    } else {
        this.each(function(e) {
            if ('blur' in e) e.blur();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.change = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('change' in e.eventList)) e.eventList.change = [];
            e.eventList.change.push(fn);
            e.onchange = fn;
        });
    } else {
        this.each(function(e) {
            if ('change' in e) e.change();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.contextmenu = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('contextmenu' in e.eventList)) e.eventList.contextmenu = [];
            e.eventList.contextmenu.push(fn);
            e.oncontextmenu = fn;
        });
    } else {
        this.each(function(e) {
            if ('contextmenu' in e) e.contextmenu();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.focus = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('focus' in e.eventList)) e.eventList.focus = [];
            e.eventList.focus.push(fn);
            e.onfocus = fn;
        });
    } else {
        this.each(function(e) {
            if ('focus' in e) e.focus();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.input = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('input' in e.eventList)) e.eventList.input = [];
            e.eventList.input.push(fn);
            e.oninput = fn;
        });
    } else {
        this.each(function(e) {
            if ('input' in e) e.input();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.invalid = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('invalid' in e.eventList)) e.eventList.invalid = [];
            e.eventList.invalid.push(fn);
            e.oninvalid = fn;
        });
    } else {
        this.each(function(e) {
            if ('invalid' in e) e.invalid();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.reset = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('reset' in e.eventList)) e.eventList.reset = [];
            e.eventList.reset.push(fn);
            e.onreset = fn;
        });
    } else {
        this.each(function(e) {
            if ('reset' in e) e.reset();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.search = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('search' in e.eventList)) e.eventList.search = [];
            e.eventList.search.push(fn);
            e.onsearch = fn;
        });
    } else {
        this.each(function(e) {
            if ('search' in e) e.search();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.select = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('select' in e.eventList)) e.eventList.select = [];
            e.eventList.select.push(fn);
            e.onselect = fn;
        });
    } else {
        this.each(function(e) {
            if ('select' in e) e.select();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.submit = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('submit' in e.eventList)) e.eventList.submit = [];
            e.eventList.submit.push(fn);
            e.onsubmit = fn;
        });
    } else {
        this.each(function(e) {
            if ('submit' in e) e.submit();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.keydown = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('keydown' in e.eventList)) e.eventList.keydown = [];
            e.eventList.keydown.push(fn);
            e.onkeydown = fn;
        });
    } else {
        this.each(function(e) {
            if ('keydown' in e) e.keydown();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.keypress = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('keypress' in e.eventList)) e.eventList.keypress = [];
            e.eventList.keypress.push(fn);
            e.onkeypress = fn;
        });
    } else {
        this.each(function(e) {
            if ('keypress' in e) e.keypress();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.keyup = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('keyup' in e.eventList)) e.eventList.keyup = [];
            e.eventList.keyup.push(fn);
            e.onkeyup = fn;
        });
    } else {
        this.each(function(e) {
            if ('keyup' in e) e.keyup();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.click = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('click' in e.eventList)) e.eventList.click = [];
            e.eventList.click.push(fn);
            e.onclick = fn;
        });
    } else {
        this.each(function(e) {
            if ('click' in e) e.click();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.dblclick = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('dblclick' in e.eventList)) e.eventList.dblclick = [];
            e.eventList.dblclick.push(fn);
            e.ondblclick = fn;
        });
    } else {
        this.each(function(e) {
            if ('dblclick' in e) e.dblclick();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.mousedown = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('mousedown' in e.eventList)) e.eventList.mousedown = [];
            e.eventList.mousedown.push(fn);
            e.onmousedown = fn;
        });
    } else {
        this.each(function(e) {
            if ('mousedown' in e) e.mousedown();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.mousemove = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('mousemove' in e.eventList)) e.eventList.mousemove = [];
            e.eventList.mousemove.push(fn);
            e.onmousemove = fn;
        });
    } else {
        this.each(function(e) {
            if ('mousemove' in e) e.mousemove();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.mouseout = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('mouseout' in e.eventList)) e.eventList.mouseout = [];
            e.eventList.mouseout.push(fn);
            e.onmouseout = fn;
        });
    } else {
        this.each(function(e) {
            if ('mouseout' in e) e.mouseout();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.mouseover = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('mouseover' in e.eventList)) e.eventList.mouseover = [];
            e.eventList.mouseover.push(fn);
            e.onmouseover = fn;
        });
    } else {
        this.each(function(e) {
            if ('mouseover' in e) e.mouseover();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.mouseup = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('mouseup' in e.eventList)) e.eventList.mouseup = [];
            e.eventList.mouseup.push(fn);
            e.onmouseup = fn;
        });
    } else {
        this.each(function(e) {
            if ('mouseup' in e) e.mouseup();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.wheel = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('wheel' in e.eventList)) e.eventList.wheel = [];
            e.eventList.wheel.push(fn);
            e.onwheel = fn;
        });
    } else {
        this.each(function(e) {
            if ('wheel' in e) e.wheel();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.wheel = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('wheel' in e.eventList)) e.eventList.wheel = [];
            e.eventList.wheel.push(fn);
            e.onwheel = fn;
        });
    } else {
        this.each(function(e) {
            if ('wheel' in e) e.wheel();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.drag = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('drag' in e.eventList)) e.eventList.drag = [];
            e.eventList.drag.push(fn);
            e.ondrag = fn;
        });
    } else {
        this.each(function(e) {
            if ('drag' in e) e.drag();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.dragend = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('dragend' in e.eventList)) e.eventList.dragend = [];
            e.eventList.dragend.push(fn);
            e.ondragend = fn;
        });
    } else {
        this.each(function(e) {
            if ('dragend' in e) e.dragend();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.dragenter = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('dragenter' in e.eventList)) e.eventList.dragenter = [];
            e.eventList.dragenter.push(fn);
            e.ondragenter = fn;
        });
    } else {
        this.each(function(e) {
            if ('dragenter' in e) e.dragenter();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.dragleave = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('dragleave' in e.eventList)) e.eventList.dragleave = [];
            e.eventList.dragleave.push(fn);
            e.ondragleave = fn;
        });
    } else {
        this.each(function(e) {
            if ('dragleave' in e) e.dragleave();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.dragover = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('dragover' in e.eventList)) e.eventList.dragover = [];
            e.eventList.dragover.push(fn);
            e.ondragover = fn;
        });
    } else {
        this.each(function(e) {
            if ('dragover' in e) e.dragover();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.dragstart = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('dragstart' in e.eventList)) e.eventList.dragstart = [];
            e.eventList.dragstart.push(fn);
            e.ondragstart = fn;
        });
    } else {
        this.each(function(e) {
            if ('dragstart' in e) e.dragstart();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.drop = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('drop' in e.eventList)) e.eventList.drop = [];
            e.eventList.drop.push(fn);
            e.ondrop = fn;
        });
    } else {
        this.each(function(e) {
            if ('drop' in e) e.drop();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.scroll = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('scroll' in e.eventList)) e.eventList.scroll = [];
            e.eventList.scroll.push(fn);
            e.onscroll = fn;
        });
    } else {
        this.each(function(e) {
            if ('scroll' in e) e.scroll();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.copy = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('copy' in e.eventList)) e.eventList.copy = [];
            e.eventList.copy.push(fn);
            e.oncopy = fn;
        });
    } else {
        this.each(function(e) {
            if ('copy' in e) e.copy();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.cut = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('cut' in e.eventList)) e.eventList.cut = [];
            e.eventList.cut.push(fn);
            e.oncut = fn;
        });
    } else {
        this.each(function(e) {
            if ('cut' in e) e.cut();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.paste = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('paste' in e.eventList)) e.eventList.paste = [];
            e.eventList.paste.push(fn);
            e.onpaste = fn;
        });
    } else {
        this.each(function(e) {
            if ('paste' in e) e.paste();
            else fn();
        });
    }

    return this;
};

/**
 * add event to node list elements
 * @param {Function} fn
 * @return dom
 */
dom.fn.toggle = function(fn) {
    if (typeof fn === 'function') {
        this.each(function(e) {
            if (!('eventList' in e)) e.eventList = {};
            if (!('toggle' in e.eventList)) e.eventList.toggle = [];
            e.eventList.toggle.push(fn);
            e.ontoggle = fn;
        });
    } else {
        this.each(function(e) {
            if ('toggle' in e) e.toggle();
            else fn();
        });
    }

    return this;
};

/**
 * local storage handler
 */
dom.storage = {
    /**
     * set local storage item if jsn as json
     * @param {String} nam
     * @param {String|Object|Array} val
     * @param {Boolean} jsn
     */
    set: function set(nam, val, jsn) {
        if (nam && val !== undefined && typeof nam === 'string') {
            val = jsn ? JSON.stringify(val) : val;
            localStorage.setItem(nam, val);
        }
    },


    /**
     * delete local storage items
     * @param  {...String} nms
     */
    del: function del() {
        for (var _len12 = arguments.length, nms = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
            nms[_key12] = arguments[_key12];
        }

        for (var nm in nms) {
            localStorage.removeItem(nm);
        }
    },


    /**
     * get local storage item if exist if jsn as json
     * @param {String} nam
     * @param {Boolean} jsn
     * @return String|Object
     */
    get: function get(nam, jsn) {
        if (nam && this.has(nam)) {
            var val = localStorage.getItem(nam);
            return jsn ? JSON.parse(val) : val;
        }
    },


    /**
     * get true if local storage item exist else fals
     * @param {String} nam
     * @return Boolean
     */
    has: function has(nam) {
        return typeof nam === 'string' && localStorage.getItem(nam) ? true : false;
    },


    /**
     * delete all local storage items
     */
    rid: function rid() {
        localStorage.clear();
    }
};

/**
 * session storage handler
 */
dom.session = {
    /**
     * set session storage item if jsn as json
     * @param {String} nam
     * @param {String|Object|Array} val
     * @param {Boolean} jsn
     */
    set: function set(nam, val, jsn) {
        if (nam && val !== undefined && typeof nam === 'string') {
            val = jsn ? JSON.stringify(val) : val;
            sessionStorage.setItem(nam, val);
        }
    },


    /**
     * delete session storage items
     * @param  {...String} nms
     */
    del: function del() {
        for (var _len13 = arguments.length, nms = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
            nms[_key13] = arguments[_key13];
        }

        for (var nm in nms) {
            sessionStorage.removeItem(nm);
        }
    },


    /**
     * get session storage item if exist if jsn as json
     * @param {String} nam
     * @param {Boolean} jsn
     * @return String|Object
     */
    get: function get(nam, jsn) {
        if (nam && this.has(nam)) {
            var val = sessionStorage.getItem(nam);
            return jsn ? JSON.parse(val) : val;
        }
    },


    /**
     * get true if session storage item exist else fals
     * @param {String} nam
     * @return Boolean
     */
    has: function has(nam) {
        return typeof nam === 'string' && sessionStorage.getItem(nam) ? true : false;
    },


    /**
     * delete all session storage items
     */
    rid: function rid() {
        sessionStorage.clear();
    }
};

/**
 * larray handler
 */
dom.array = {
    /**
     * convert list of arrays of length 2 to object
     * @param  {...Array} arr
     * @return Object
     */
    object: function object() {
        var all = {};

        for (var _len14 = arguments.length, arr = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
            arr[_key14] = arguments[_key14];
        }

        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
            for (var _iterator11 = arr[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var a = _step11.value;

                if (a.length === 2) all[a[0]] = a[1];
            }
        } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                    _iterator11.return();
                }
            } finally {
                if (_didIteratorError11) {
                    throw _iteratorError11;
                }
            }
        }

        return all;
    }
};

/**
 * number handler
 */
dom.number = {
    /**
     * check if fn bigger then ln if eq inlude =
     * @param {Number} fn
     * @param {Number} ln
     * @param {Boolean} eq
     * @return Boolean
     */
    bigger: function bigger(fn, ln, eq) {
        if ((Number(fn) || Number(fn) == 0) && (Number(ln) || Number(ln) == 0)) return eq ? Number(fn) >= Number(ln) : Number(fn) > Number(ln);
    },


    /**
     * check if fn smaller then ln if eq inlude =
     * @param {Number} fn
     * @param {Number} ln
     * @param {Boolean} eq
     * @return Boolean
     */
    lesser: function lesser(fn, ln, eq) {
        if ((Number(fn) || Number(fn) == 0) && (Number(ln) || Number(ln) == 0)) return eq ? Number(fn) <= Number(ln) : Number(fn) < Number(ln);
    },


    /**
     * check if fn equals to ln
     * @param {Number} fn
     * @param {Number} ln
     * @param {Boolean} eq
     * @return Boolean
     */
    equals: function equals(fn, ln) {
        if ((Number(fn) || Number(fn) == 0) && (Number(ln) || Number(ln) == 0)) return Number(fn) == Number(ln);
    },


    /**
     * check if num betweem min and max if eq inlude =
     * @param {Number} num
     * @param {Number} min
     * @param {Number} max
     * @param {Boolean} eql
     * @return Boolean
     */
    middle: function middle(num, min, max, eql) {
        if ((Number(num) || Number(num) == 0) && (Number(min) || Number(min) == 0) && (Number(max) || Number(max) == 0)) return this.bigger(num, min, eql) && this.lesser(num, max, eql);
    }
};

module.exprots = dom;