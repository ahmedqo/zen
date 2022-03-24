const html = require("../html");
const css = require("../css");

const invalidChars = /[^a-zA-Z0-9:]+/g;
const obj = {
    attrs(elem) {
        if (!elem.attributes) return {};
        const attrs = {};

        for (let i = 0; i < elem.attributes.length; i++) {
            const attr = elem.attributes[i];
            attrs[attr.name] = attr.value;
        }

        return attrs;
    },

    nodesByKey(parent, makeKey) {
        const map = {};

        for (let j = 0; j < parent.childNodes.length; j++) {
            const key = makeKey(parent.childNodes[j]);
            if (key) map[key] = parent.childNodes[j];
        }

        return map;
    },

    addEvent(el, attr, eventFunction) {
        const ev = attr.split("|");
        const eventName = ev[0].slice(1);
        el.__handlers = el.__handlers || {};
        var isSameFunction = false;
        if (el.__handlers[ev[0]]) {
            for (const _ev of el.__handlers[ev[0]]) {
                if (_ev.toString() === eventFunction.toString()) {
                    isSameFunction = true;
                    return;
                }
            }
        }
        if (!isSameFunction) {
            el.__handlers[ev[0]] = [eventFunction];
            el.addEventListener(eventName, function(e) {
                event(ev, e);
                eventFunction(e);
            });
        }

        el.removeAttribute(attr);
    },

    walkAndAddProps(node, events) {
        const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);

        while (treeWalker.nextNode()) {
            const currentNode = treeWalker.currentNode;
            const currentAttrs = this.attrs(currentNode);

            for (const attr in currentAttrs) {
                if (attr === "ref") {
                    events[currentAttrs[attr]].current = currentNode;
                    currentNode.removeAttribute("ref");
                }
                const isEvent = attr.startsWith("@");
                if (isEvent) {
                    this.addEvent(currentNode, attr, events[currentAttrs[attr]]);
                    currentNode.removeAttribute(attr);
                }
            }
        }
    },

    merge(base, modified, opts, events) {
        opts = opts || {};
        opts.key = opts.key || ((node) => node.id);

        if (!base.childNodes.length && typeof modified === "string") {
            const html = modified;
            base.innerHTML = html;
            this.walkAndAddProps(base, events);
            return;
        }

        if (typeof modified === "string") {
            const html = modified;
            modified = document.createElement("div");
            modified.innerHTML = html;
        }

        const nodesByKey = {
            old: this.nodesByKey(base, opts.key),
            new: this.nodesByKey(modified, opts.key),
        };
        let idx;

        for (idx = 0; modified.firstChild; idx++) {
            const newNode = modified.removeChild(modified.firstChild);

            if (idx >= base.childNodes.length) {
                this.walkAndAddProps(newNode, events);
                base.appendChild(newNode);
                continue;
            }

            let baseNode = base.childNodes[idx];

            const newKey = opts.key(newNode);

            if (opts.key(baseNode) || newKey) {
                const match = newKey && newKey in nodesByKey.old ? nodesByKey.old[newKey] : newNode;

                if (match !== baseNode) {
                    baseNode = base.insertBefore(match, baseNode);
                }
            }

            if (baseNode.nodeType !== newNode.nodeType || baseNode.tagName !== newNode.tagName) {
                this.walkAndAddProps(newNode, events);
                base.replaceChild(newNode, baseNode);
            } else if ([Node.TEXT_NODE, Node.COMMENT_NODE].indexOf(baseNode.nodeType) >= 0) {
                if (baseNode.textContent === newNode.textContent) continue;

                baseNode.textContent = newNode.textContent;
            } else if (baseNode !== newNode) {
                const attrs = {
                    base: this.attrs(baseNode),
                    new: this.attrs(newNode),
                };
                for (const attr in attrs.base) {
                    if (attr in attrs.new) continue;
                    baseNode.removeAttribute(attr);
                }

                for (const attr in attrs.new) {
                    const hasProperty = attr in baseNode;

                    if (attr in attrs.base && attrs.base[attr] === attrs.new[attr] && !hasProperty) {
                        continue;
                    }

                    const isEvent = attr.startsWith("@");

                    if (isEvent) {
                        this.addEvent(baseNode, attr, events[attrs.new[attr]]);
                    }

                    if (hasProperty && !isEvent) {
                        baseNode.removeAttribute(attr);
                        baseNode[attr] = attrs.new[attr];
                    }

                    if (!hasProperty && !isEvent) {
                        baseNode.setAttribute(attr, attrs.new[attr]);
                    }
                }

                this.merge(baseNode, newNode, {}, events);
            }
        }

        while (base.childNodes.length > idx) {
            base.removeChild(base.lastChild);
        }
    },
};

function typeOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

function applyAttr(el, attr, propValue) {
    if (propValue === false) {
        el.removeAttribute(attr);
    } else if (propValue === true) {
        el.setAttribute(attr, "");
    } else if (propValue === "") {
        el.removeAttribute(attr);
    } else {
        el.setAttribute(attr, propValue);
    }
}

function kebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, (match) => match[0] + "-" + match[1])
        .replace(invalidChars, "-")
        .toLowerCase();
}

function camelCase(str) {
    return str
        .replace(/_/g, (_, index) => (index === 0 ? _ : "-"))
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => (index === 0 ? letter.toLowerCase() : letter.toUpperCase()))
        .replace(invalidChars, "");
}

function typeCast(value, type) {
    if (type === "boolean") {
        if (value === "true" || value === "" || value === true) {
            return true;
        } else {
            return false;
        }
    }

    if (type === "number") {
        return parseInt(value);
    }

    if (type === "string") {
        return String(value);
    }

    return value;
}

function onChange(object, onChange) {
    const handler = {
        get(target, property, receiver) {
            const desc = Object.getOwnPropertyDescriptor(target, property);

            if (desc && !desc.writable && !desc.configurable) {
                return Reflect.get(target, property, receiver);
            }

            try {
                return new Proxy(target[property], handler);
            } catch (err) {
                return Reflect.get(target, property, receiver);
            }
        },

        defineProperty(target, property, descriptor) {
            onChange(descriptor);
            return Reflect.defineProperty(target, property, descriptor);
        },

        deleteProperty(target, property) {
            onChange();
            return Reflect.deleteProperty(target, property);
        },
    };
    return new Proxy(object, handler);
}

function event(ev, e) {
    ev.forEach(function(_e) {
        switch (_e) {
            case "prev":
                e.preventDefault();
            case "stop":
                e.stopPropagation();
            case "prop":
                e.stopImmediatePropagation();
        }
    });
}

function refs(s) {
    s.refs = {};
    var ix = [];
    Array.from(s._shadowRoot.querySelectorAll("*"))
        .filter(function(e) {
            if (e.hasAttribute("ref")) return e;
        })
        .forEach(function(e) {
            var ref = e.getAttribute("ref");
            e.setAttribute("part", "--" + ref);
            ix.push(ref);
            ix = [...new Set(ix)];
        });
    ix.forEach(function(e) {
        var i = Array.from(s._shadowRoot.querySelectorAll("[ref='" + e + "']"));
        if (i.length > 1) s.refs[e] = i;
        else s.refs[e] = i[0];
        i.forEach((e) => e.removeAttribute("ref"));
    });
}

function Component({
        mode = "closed",
        props = {},
        state = {},
        logic = {},
        created = function() {},
        mounted = function() {},
        updated = function() {},
        changed = function() {},
        adopted = function() {},
        removed = function() {},
        render = () => html ``,
        styles = () => css ``,
    },
    Class = null
) {
    class Component extends(Class || HTMLElement) {
        constructor() {
            super();

            this._sass = "";
            this.props = {...props };
            this._propTypes = {};
            this._initProps = this._initProps.bind(this);
            this.changed = changed.bind(this);
            this._initProps();

            this.state = {...state };
            this._initState = this._initState.bind(this);
            this._initState();

            this._styles = styles.bind(this);

            this.logic = {...logic };
            this._initLogic = this._initLogic.bind(this);
            this._initLogic();

            this._shadowRoot = this.attachShadow({
                mode,
            });
            this._template = render.bind(this);
            this.render = this.render.bind(this);

            this.created = created.bind(this);
            this.mounted = mounted.bind(this);
            this.updated = updated.bind(this);
            this.adopted = adopted.bind(this);
            this.removed = removed.bind(this);

            this.render();
            this.created();
        }

        _initProps() {
            Object.keys(this.props).map((p) => {
                const type = typeOf(this.props[p]);
                this._propTypes[p] = type;

                const value = this.getAttribute(p) || this.hasAttribute(p) || this.props[p];
                this.props[p] = typeCast(value, type);
            });
        }

        _initState() {
            this.state = onChange(this.state, () => {
                setTimeout(() => {
                    this.render();
                }, 0);
            });
        }

        _initLogic() {
            Object.keys(this.logic).map((a) => {
                const boundAction = logic[a].bind(this);

                function actionWithData(params) {
                    if (!params) return boundAction();
                    else return boundAction(params);
                }

                this.logic[a] = actionWithData;
            });
        }

        _upradeProperty(prop) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }

        static get observedAttributes() {
            Object.keys(props).forEach((prop) => {
                Object.defineProperty(this.prototype, prop, {
                    configurable: true,

                    get() {
                        return this.props[prop];
                    },

                    set(val) {
                        const attr = kebabCase(prop);
                        const oldVal = this.props[prop];
                        const propType = this._propTypes[prop];
                        const newVal = typeCast(val || this.hasAttribute(attr), propType);

                        if (newVal !== oldVal) {
                            this.props[prop] = newVal;
                            this.render();
                            this.changed(prop, oldVal, newVal);
                        }
                    },
                });
            });
            return ["sass", ...Object.keys(props)].map((propName) => {
                return kebabCase(propName);
            });
        }

        connectedCallback() {
            Object.keys(this.props).forEach((prop) => {
                this._upradeProperty(prop);
            });
            this.mounted();
            if (this._mounted) {
                new Function(this._mounted).apply(this, {...window });
                delete this._mounted;
            }
        }

        adoptedCallback() {
            this.adopted();
        }

        disconnectedCallback() {
            this.removed();
        }

        attributeChangedCallback(attr, oldVal, updatedVal) {
            if (attr === "sass") {
                if (updatedVal !== null) {
                    this._sass += updatedVal;
                    this.render();
                }
                this.removeAttribute("sass");
            } else {
                const propName = camelCase(attr);
                const hasProp = this.props[propName] ? true : false;
                const oldPropValue = this.props[propName];
                const propType = this._propTypes[propName] || null;
                if (hasProp) {
                    const newPropValue = typeCast(updatedVal || this.hasAttribute(attr), propType);
                    if (oldPropValue !== newPropValue) {
                        this[propName] = newPropValue;
                    }
                } else {
                    if (oldVal !== updatedVal) {
                        applyAttr(this, attr, updatedVal);
                    }
                }
            }
        }

        makeEvent(n, d, fn) {
            const e = new CustomEvent(n, {
                bubbles: true,
                cancelable: true,
                composed: true,
                isTrusted: true,
                detail: d,
            });
            this.dispatchEvent(e);
            if (!e.defaultPrevented && fn) {
                fn.bind(this)(e);
            }
        }

        async render() {
            var style =
                this._styles() +
                css `
					${this._sass}
				`;
            style = style.length > 0 ? `<style>${style}</style>` : "";
            const template = await this._template();
            const text = style + template.string;
            const event = template.events;
            obj.merge(this._shadowRoot, text, {}, event);
            //refs(this);
            this.updated();
        }
    }

    return Component;
}

function create(t, { props, attrs, logic } = {}, ...c) {
    var e = typeof t === "string" ? document.createElement(t) : new t();
    if (props) {
        for (var n in props) {
            e[n] = props[n];
        }
    }
    if (attrs) {
        for (var n in attrs) {
            e.setAttribute(n, attrs[n]);
        }
    }
    if (logic) {
        for (var n in logic) {
            e.addEventListener(n, logic[n]);
        }
    }
    for (var n of c) {
        e.appendChild(n);
    }
    return e;
}

function render(c) {
    var d = document.createElement("div");
    var f = document.createDocumentFragment();
    obj.merge(d, c.string, {}, c.events);
    Array.from(d.childNodes).forEach(function(c) {
        f.append(c);
    });
    return f;
}

function define(t, e) {
    if (!customElements.get(t)) customElements.define(t, e);
    return e;
}

function choose(value, cases, def) {
    for (const c in cases) {
        if (c === value) {
            const fn = cases[c];
            return fn();
        }
    }
    return def && def();
}

function exist(value) {
    return !(!value && typeof value !== "number") ||
        !(typeof value === "string" && value.trim().length === 0) ||
        !(typeof value === "object" && Object.keys(value).length === 0) ||
        !(Array.isArray(value) && value.length === 0) ?
        value :
        null;
}

function when(condition, trueCase, falseCase) {
    return condition ? (typeof trueCase === "function" ? trueCase() : trueCase) : typeof falseCase === "function" ? falseCase() : falseCase || null;
}

function* join(items, joiner) {
    const isFunction = typeof joiner === "function";
    if (items !== undefined) {
        let i = -1;
        for (const value of items) {
            if (i > -1) {
                yield isFunction ? joiner(i) : joiner;
            }
            i++;
            yield value;
        }
    }
}

function* map(items, f) {
    if (items !== undefined) {
        let i = 0;
        for (const value of items) {
            yield f(value, i++);
        }
    }
}

function* range(startOrEnd, end, step = 1) {
    const start = end === undefined ? 0 : startOrEnd;
    end = end || startOrEnd;
    for (let i = start; step > 0 ? i < end : end < i; i += step) {
        yield i;
    }
}

const NM = (module.exports = Component);

NM.render = render;
NM.define = define;
NM.create = create;

NM.choose = choose;
NM.exist = exist;
NM.when = when;

NM.range = range;
NM.join = join;
NM.map = map;