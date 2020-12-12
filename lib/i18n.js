"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18n = void 0;
exports.i18n = (function () {
    var m = {
        defaultNS: "",
        resources: {},
        lang: "",
        subsRegEx: new RegExp(/\{{([^{]+)}}/g)
    };
    function createI18nResources(d) {
        var i18nStatic = d.i18nStatic, i18nPage = d.i18nPage, i18nAdditions = d.i18nAdditions;
        var r = {};
        if (i18nStatic) {
            i18nStatic.nodes.forEach(function (n) {
                if (n.lang !== m.lang)
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
    }
    m.use = function (lang, dns, data, isNodeData) {
        m.lang = lang;
        m.defaultNS = dns;
        m.resources = isNodeData ? createI18nResources(data) : data;
    };
    m.t = function (str, subs, trans) {
        var strSplit, key, ns, val;
        if (typeof str === "string") {
            if (str.length > 0) {
                strSplit = str.split(":"); // Split string into array
                key = strSplit.length > 1 ? strSplit[1] : strSplit[0];
                ns =
                    strSplit.length > 1 && strSplit[0].length > 0
                        ? strSplit[0]
                        : m.defaultNS;
                val = m.resources && m.resources[ns][key];
            }
            else {
                throw new Error("Key string is empty.");
            }
        }
        else {
            throw new Error("Expected a string for key. Got " + typeof str + ".");
        }
        // Skip interpolation for Trans component
        if (trans) {
            return val;
        }
        // Check for namespace
        if (!m.resources[ns]) {
            throw new Error("Namespace not found: " + ns);
        }
        // Check string exists
        if (!val) {
            throw new Error("No string found! " + ns + "." + key);
        }
        var strSubs = val.match(m.subsRegEx);
        if (!strSubs)
            return val;
        var passedSubsCount = subs ? Object.keys(subs).length : 0;
        if (passedSubsCount !== strSubs.length) {
            throw new Error("Mismatch between string(" + strSubs.length + ") and passed substitutions (" + passedSubsCount + ") in " + ns + "." + key);
        }
        return val.replace(m.subsRegEx, function (_, subsKey) {
            if (!subs[subsKey]) {
                throw new Error("Missing substitution variable {{" + key + "}} in " + ns + "." + key);
            }
            return subs[subsKey] && subs[subsKey];
        });
    };
    return m;
})();
// export const Trans = ({ i18nKey, ...rest }) => (
//   <Fragment>
//     {i18n
//       .t(i18nKey, "", true)
//       .split(i18n.subsRegEx)
//       .reduce((prev, current, i) => {
//         if (!i) return [current]
//         return prev.concat(
//           Object.keys(rest).includes(current) ? rest[current] : current
//         )
//       }, [])}
//   </Fragment>
// )
