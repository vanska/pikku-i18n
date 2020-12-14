"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trans = void 0;
var react_1 = __importDefault(require("react"));
var i18n_1 = require("./i18n");
var Trans = function (_a) {
    var i18nKey = _a.i18nKey, rest = __rest(_a, ["i18nKey"]);
    return (react_1.default.createElement(react_1.default.Fragment, null, i18n_1.t(i18nKey, "", true)
        .split(i18n_1.SUBS_REG_EX)
        .reduce(function (prev, current, i) {
        if (!i)
            return [current];
        return prev.concat(Object.keys(rest).includes(current) ? rest[current] : current);
    }, [])));
};
exports.Trans = Trans;
