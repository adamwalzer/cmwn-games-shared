import effects from './effects';

let makeEffect = function (effectName, node, opts = {}) {
    return _.invoke(effects, effectName, node, opts);
};

if (!window.CMWN) window.CMWN = {};
if (!window.CMWN.makeEffect) window.CMWN.makeEffect = makeEffect;
