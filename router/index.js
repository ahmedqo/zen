const { render } = require('../component');

function Router() {
    var _loader, _header, _footer, _root, _state, _change, _hash = false,
        _contain = document.createElement('div'),
        _routes = [],
        _log = {};

    function Router(root) {
        _root = (root instanceof HTMLElement) ?
            root : document.querySelector(root);
        return Router;
    }

    Router.header = function(header) {
        _header = header;
        return this;
    }
    Router.footer = function(footer) {
        _footer = footer;
        return this;
    }
    Router.loader = function(loader) {
        _loader = loader;
        return this;
    }
    Router.change = function(change) {
        _change = change;
        return this;
    }
    Router.state = function(state) {
        _state = state;
        return this;
    }
    Router.load = function(load) {
        if (typeof load === 'function')
            document.addEventListener('DOMContentLoaded', load);
        return this
    }
    Router.hash = function(hash) {
        _hash = hash ? hash : true;
        return this;
    }

    Router.init = function() {
        var self = this;
        if (_hash && !location.hash) location.hash = '#/';
        if (_header) {
            _append(_header, _root);
        }
        _root.appendChild(_contain);
        if (_footer) {
            _append(_footer, _root);
        }
        window.addEventListener('popstate', function() {
            if (typeof state === 'function') state();
        });
        (_hash && window.addEventListener('hashchange', function() {
            self.goto(location.hash.slice(1));
        }));
        if (_hash) self.goto(location.hash.slice(1));
        else self.goto(location.pathname);
        return self;
    }
    Router.add = function(path, view, name) {
        if (typeof path === 'string' && (['string', 'function'].includes(typeof view) || view instanceof HTMLElement || view instanceof Promise)) {
            path = !path || path == '*' ? '/404' : path;
            path = path.endsWith('/') && path.length > 1 ? path.substr(0, path.length - 1) : path;
            _routes.push({ path: path, view: view, name: name });
        }
        return this;
    };
    Router.scope = function(path, fn, name) {
        var router = {
            routes: [],
            prepath: [path],
            prename: [name],
            add: function(path, view, name) {
                if (typeof path === 'string' && (['string', 'function'].includes(typeof view) || view instanceof HTMLElement || view instanceof Promise)) {
                    path = !path || path == '*' ? '/404' : path;
                    path = path.startsWith('/') ? path : '/' + path;
                    path = path.endsWith('/') ? path.substr(0, path.length - 2) : path;
                    this.routes.push({
                        view: view,
                        path: this.prepath.join('') + path,
                        name: this.prename.join('-') + '-' + name,
                    });
                }
                return this;
            },
            scope: function(path, fn, name) {
                this.prepath.push(path);
                this.prename.push(name);
                fn.call(this);
                return this;
            }
        }
        fn.call(router);
        _routes = [..._routes, ...router.routes];
        return this;
    }
    Router.goto = function(url) {
        if (!history.state || (history.state.path !== url)) {
            history.pushState({
                    path: url,
                },
                document.title,
                (_hash ? '#' : '') + url
            );
        }
        _run();
        return this;
    }
    Router.url = function(name) {
        for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            data[_key - 1] = arguments[_key];
        }
        var route = _routes.find(function(r) {
            return r.name === name;
        });
        if (route) {
            var path = route.path.replace(/{\w+:\w+}/g, '(.+)');
            if (data.length) {
                var i = -1;
                path = path.replaceAll('(.+)', function() {
                    i++;
                    return data[i];
                });
            }
            var url = '/' + (path.startsWith('/') ? path.slice(1) : path);
            return url;
        }
        return undefined;
    }
    Router.param = function(name) {
        if (_log.current && _log.current.params && _log.current.params[name]) return _log.current.params[name];
        return undefined;
    }
    Router.query = function(name) {
        if (_log.current && _log.current.queries && _log.current.queries[name]) return _log.current.queries[name];
        return undefined;
    }
    Router.clean = function() {
        Router.routes = _routes = [];
        _header = undefined;
        _footer = undefined;
        delete Router.components.header;
        delete Router.components.footer;
        return this;
    }

    function _path(path) {
        return new RegExp('^' + path.replace(/\//g, '\\/').replace(/{\w+:\w+}/g, '(.+)') + '$');
    }

    function _match() {
        var url = (_hash ? location.hash.slice(1) : location.pathname) || '/';
        if (!_hash && !url.startsWith('/')) url = '/' + url;
        var potentialMatches = _routes.map(function(route) {
            return {
                route: route,
                result: url.match(_path(route.path)),
            };
        });

        var match = potentialMatches.find(function(potentialMatch) {
            return potentialMatch.result !== null;
        });

        if (!match) {
            match = {
                route: _routes.find(function(x) {
                    return x.path === '/404';
                }),
                result: [url],
            };
        }
        return match;
    }

    function _params(match) {
        var values = match.result.slice(1);
        var keys = Array.from(match.route.path.matchAll(/{(\w+):/g)).map(function(result) {
            return result[1];
        });
        var types = Array.from(match.route.path.matchAll(/:(\w+)}/g)).map(function(result) {
            return result[1];
        });
        return Object.fromEntries(
            keys.map(function(key, i) {
                var val = void 0;
                switch (types[i].toLowerCase()) {
                    case 's':
                    case 'str':
                    case 'string':
                        val = String(values[i]);
                        break;
                    case 'i':
                    case 'int':
                    case 'intiger':
                        val = parseInt(values[i]);
                        break;
                    case 'n':
                    case 'd':
                    case 'nbr':
                    case 'num':
                    case 'number':
                    case 'decimal':
                        val = Number(values[i]);
                        break;
                    case 'r':
                    case 'f':
                    case 'real':
                    case 'flaot':
                        val = parseFloat(values[i]);
                        break;
                    case 'b':
                    case 'bool':
                    case 'boolean':
                        val = Boolean(values[i]);
                        break;
                    case 'm':
                    case 'mixed':
                    default:
                        val = values[i];
                        break;
                }
                return [key, val];
            })
        );
    }

    function _queries() {
        var params = new URLSearchParams(location.search);
        var obj = {};
        new Set([...params.keys()])
            .forEach(key => {
                obj[key] = params.getAll(key).length > 1 ?
                    params.getAll(key) :
                    params.get(key);
            });
        return obj;
    }

    function _logger(match, params, queries) {
        Router.log = {
            previous: _log.current || {},
            current: {
                path: match.route.path,
                input: match.result[0],
                params: params,
                queries: queries,
            },
        };
    }

    function _append(element, anchor, opts = {}) {
        var el = null;
        if (opts.clearAnchor) {
            anchor.innerHTML = '';
        }
        if (typeof element === 'string') {
            const _new = document.createElement('div');
            _new.innerHTML = element;
            anchor.appendChild(render(_new));
        } else if (typeof element === 'function') {
            const generated = element({ params: opts.params, queries: opts.queries });
            _append(generated, anchor, opts);
        } else if (element instanceof Promise) {
            _append(_loader, anchor, opts);
            element.then(res => {
                _append(res, anchor, opts);
            });
        } else {
            anchor.appendChild(render(element));
        }
    }

    function _run() {
        var match = _match();
        var params = _params(match);
        var queries = _queries();
        _append(match.route.view, _contain, {
            clearAnchor: true,
            params,
            queries
        });
        _logger(match, params, queries);
        if (typeof _change === 'function') _change(match.result[0], params, queries);
    }

    Router.components = {};
    Router.routes = _routes;
    return Router;
}

module.exports = Router();