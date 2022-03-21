const { render, define, create, choose, exist, when, range, join, map } = require('./component');
const Component = require('./component');
const { keyframes } = require('./css');
const html = require('./html');
const css = require('./css');

const NM = module.exports = Component;

NM.keyframes = keyframes;
NM.html = html;
NM.css = css;

NM.render = render;
NM.define = define;
NM.create = create;

NM.choose = choose;
NM.exist = exist;
NM.when = when;

NM.range = range;
NM.join = join;
NM.map = map;