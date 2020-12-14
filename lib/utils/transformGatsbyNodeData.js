"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformGatsbyNodeData = void 0;
var i18n_1 = require("../i18n");
var transformGatsbyNodeData = function (d) {
    var i18nStatic = d.i18nStatic, i18nPage = d.i18nPage, i18nAdditions = d.i18nAdditions;
    var r = {};
    if (i18nStatic) {
        i18nStatic.nodes.forEach(function (n) {
            if (n.lang !== i18n_1.lang)
                return;
            r[n.namespace] = JSON.parse(n.allTranslations);
        });
    }
    if (i18nPage) {
        i18nPage.nodes.forEach(function (n) {
            r[n.namespace] = JSON.parse(n.allTranslations);
        });
    }
    if (i18nAdditions) {
        i18nAdditions.nodes.forEach(function (n) {
            r[n.namespace] = n.singleTranslations;
        });
    }
    return r;
};
exports.transformGatsbyNodeData = transformGatsbyNodeData;
