const { render, define, create, choose, exist, when, range, join, map } = require('./component');
const Component = require('./component');
const { keyframes } = require('./css');
const { ref } = require('./html');
const html = require('./html');
const css = require('./css');

function _ref() {
    return new ref();
}

const NM = module.exports = Component;

NM.keyframes = keyframes;
NM.html = html;
NM.css = css;
NM.ref = _ref;

NM.render = render;
NM.define = define;
NM.create = create;

NM.choose = choose;
NM.exist = exist;
NM.when = when;

NM.range = range;
NM.join = join;
NM.map = map;