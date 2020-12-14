"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = exports.use = exports.SUBS_REG_EX = exports.lang = exports.resources = exports.defaultNS = void 0;
exports.defaultNS = "";
exports.resources = {};
exports.lang = "";
exports.SUBS_REG_EX = new RegExp(/\{{([^{]+)}}/g);
var use = function (l, dns, data) {
    exports.lang = l;
    exports.defaultNS = dns;
    exports.resources = data;
};
exports.use = use;
var t = function (str, subs, trans) {
    var strSplit, key, ns, val;
    if (str.length > 0) {
        strSplit = str.split(":"); // Split string into array
        key = strSplit.length > 1 ? strSplit[1] : strSplit[0];
        ns = strSplit.length > 1 && strSplit[0].length > 0 ? strSplit[0] : exports.defaultNS;
        val = exports.resources && exports.resources[ns][key];
    }
    else {
        throw new Error("Key string is empty.");
    }
    // Check for namespace
    if (!exports.resources[ns]) {
        throw new Error("Namespace not found: " + ns);
    }
    // Check string exists
    if (!val) {
        throw new Error("No string found! " + ns + "." + key);
    }
    // Skip interpolation for Trans component
    if (trans) {
        return val;
    }
    var strSubs = val.match(exports.SUBS_REG_EX);
    if (!strSubs)
        return val;
    var passedSubsCount = subs ? Object.keys(subs).length : 0;
    if (passedSubsCount !== strSubs.length) {
        throw new Error("Mismatch between string variables(" + strSubs.length + ") and passed substitutions(" + passedSubsCount + ") for " + ns + "." + key);
    }
    return val.replace(exports.SUBS_REG_EX, function (_, subsKey) {
        if (subs) {
            if (!subs[subsKey]) {
                throw new Error("Missing substitution variable from {{" + key + "}} in " + ns + "." + key);
            }
            return subs[subsKey] && subs[subsKey];
        }
    });
};
exports.t = t;
