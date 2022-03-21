function uuid() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function typeOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

function html(parts, ...args) {
    const template = parts.reduce((acc, part, i) => {
        if (!acc.string) {
            return {
                events: acc.events,
                string: part
            };
        }

        const arg = args[i - 1];

        if (arg === null || arg === false) {
            return {
                events: acc.events,
                string: acc.string + part
            };
        }

        if (typeOf(arg) === "function") {
            const id = uuid();
            return {
                events: {...acc.events,
                    [id]: arg
                },
                string: acc.string + id + part
            };
        }

        if (typeOf(arg) === "array") {
            const allEvents = arg.reduce((acc, a) => {
                return {...acc,
                    ...a.events
                };
            }, {});
            const string = arg.reduce((acc, a) => acc + a.string, "");
            return {
                events: {...acc.events,
                    ...allEvents
                },
                string: acc.string + string + part
            };
        }

        if (typeOf(arg) === "object") {
            return {
                events: {...acc.events,
                    ...arg.events
                },
                string: acc.string + arg.string + part
            };
        }

        if (typeOf(arg) === "generator") {
            var obj = { events: {}, string: '' },
                cur = arg.next();
            while (!cur.done) {
                obj = {
                    events: {...obj.events,
                        ...cur.value.events
                    },
                    string: obj.string + cur.value.string
                }
                cur = arg.next();
            }
            return {
                events: {...acc.events,
                    ...obj.events
                },
                string: acc.string + obj.string + part
            };
        }

        return {
            events: {...acc.events
            },
            string: acc.string + args[i - 1] + part
        };
    }, {
        events: {},
        string: null
    });
    template.string = template.string.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
    return template;
}

module.exports = html;