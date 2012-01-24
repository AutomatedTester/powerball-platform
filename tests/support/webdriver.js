(function(){var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for(var b = a;b = b.substring(0, b.lastIndexOf("."));) {
      if(goog.getObjectByName(b)) {
        break
      }
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
if(!COMPILED) {
  goog.isProvided_ = function(a) {
    return!goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
  }, goog.implicitNamespaces_ = {}
}
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
  }
};
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(!COMPILED) {
    for(var d, a = a.replace(/\\/g, "/"), e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if(!COMPILED && !goog.isProvided_(a)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if(b) {
        goog.included_[b] = !0;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    return a.instance_ || (a.instance_ = new a)
  }
};
if(!COMPILED && goog.ENABLE_DEBUG_LOADER) {
  goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
    var a = goog.global.document;
    return typeof a != "undefined" && "write" in a
  }, goog.findBasePath_ = function() {
    if(goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH
    }else {
      if(goog.inHtmlDocument_()) {
        for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;b >= 0;--b) {
          var c = a[b].src, d = c.lastIndexOf("?"), d = d == -1 ? c.length : d;
          if(c.substr(d - 7, 7) == "base.js") {
            goog.basePath = c.substr(0, d - 7);
            break
          }
        }
      }
    }
  }, goog.importScript_ = function(a) {
    var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
  }, goog.writeScriptTag_ = function(a) {
    return goog.inHtmlDocument_() ? (goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>'), !0) : !1
  }, goog.writeScripts_ = function() {
    function a(e) {
      if(!(e in d.written)) {
        if(!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
          for(var g in d.requires[e]) {
            if(!goog.isProvided_(g)) {
              if(g in d.nameToPath) {
                a(d.nameToPath[g])
              }else {
                throw Error("Undefined nameToPath for " + g);
              }
            }
          }
        }
        e in c || (c[e] = !0, b.push(e))
      }
    }
    var b = [], c = {}, d = goog.dependencies_, e;
    for(e in goog.included_) {
      d.written[e] || a(e)
    }
    for(e = 0;e < b.length;e++) {
      if(b[e]) {
        goog.importScript_(goog.basePath + b[e])
      }else {
        throw Error("Undefined script input");
      }
    }
  }, goog.getPathFromDeps_ = function(a) {
    return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
  }, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js")
}
goog.typeOf = function(a) {
  var b = typeof a;
  if(b == "object") {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }else {
        if(a instanceof Object) {
          return b
        }
      }
      var c = Object.prototype.toString.call(a);
      if(c == "[object Window]") {
        return"object"
      }
      if(c == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(c == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(b == "function" && typeof a.call == "undefined") {
      return"object"
    }
  }
  return b
};
goog.propertyIsEnumerableCustom_ = function(a, b) {
  if(b in a) {
    for(var c in a) {
      if(c == b && Object.prototype.hasOwnProperty.call(a, b)) {
        return!0
      }
    }
  }
  return!1
};
goog.propertyIsEnumerable_ = function(a, b) {
  return a instanceof Object ? Object.prototype.propertyIsEnumerable.call(a, b) : goog.propertyIsEnumerableCustom_(a, b)
};
goog.isDef = function(a) {
  return a !== void 0
};
goog.isNull = function(a) {
  return a === null
};
goog.isDefAndNotNull = function(a) {
  return a != null
};
goog.isArray = function(a) {
  return goog.typeOf(a) == "array"
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return b == "array" || b == "object" && typeof a.length == "number"
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && typeof a.getFullYear == "function"
};
goog.isString = function(a) {
  return typeof a == "string"
};
goog.isBoolean = function(a) {
  return typeof a == "boolean"
};
goog.isNumber = function(a) {
  return typeof a == "number"
};
goog.isFunction = function(a) {
  return goog.typeOf(a) == "function"
};
goog.isObject = function(a) {
  a = goog.typeOf(a);
  return a == "object" || a == "array" || a == "function"
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if(b == "object" || b == "array") {
    if(a.clone) {
      return a.clone()
    }
    var b = b == "array" ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b) {
  if(!a) {
    throw Error();
  }
  if(arguments.length > 2) {
    var c = Array.prototype.slice.call(arguments, 2);
    return function() {
      var d = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(d, c);
      return a.apply(b, d)
    }
  }else {
    return function() {
      return a.apply(b, arguments)
    }
  }
};
goog.bind = function() {
  goog.bind = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a) {
  var b = Array.prototype.slice.call(arguments, 1);
  return function() {
    var c = Array.prototype.slice.call(arguments);
    c.unshift.apply(c, b);
    return a.apply(this, c)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;"), typeof goog.global._et_ != "undefined" ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d;
  d = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? c : function(a) {
    for(var a = a.split("-"), b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  } : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
if(!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING
}
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$"), a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b) {
  var c = arguments.callee.caller;
  if(c.superClass_) {
    return c.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var d = Array.prototype.slice.call(arguments, 2), e = !1, f = a.constructor;f;f = f.superClass_ && f.superClass_.constructor) {
    if(f.prototype[b] === c) {
      e = !0
    }else {
      if(e) {
        return f.prototype[b].apply(a, d)
      }
    }
  }
  if(a[b] === c) {
    return a.constructor.prototype[b].apply(a, d)
  }else {
    throw Error("goog.base called from a method of one name to a method of a different name");
  }
};
goog.scope = function(a) {
  a.call(goog.global)
};
goog.json = {};
goog.json.isValid_ = function(a) {
  if(/^\s*$/.test(a)) {
    return!1
  }
  return/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))
};
goog.json.parse = function(a) {
  a = String(a);
  if(goog.json.isValid_(a)) {
    try {
      return eval("(" + a + ")")
    }catch(b) {
    }
  }
  throw Error("Invalid JSON string: " + a);
};
goog.json.unsafeParse = function(a) {
  return eval("(" + a + ")")
};
goog.json.serialize = function(a, b) {
  return(new goog.json.Serializer(b)).serialize(a)
};
goog.json.Serializer = function(a) {
  this.replacer_ = a
};
goog.json.Serializer.prototype.serialize = function(a) {
  var b = [];
  this.serialize_(a, b);
  return b.join("")
};
goog.json.Serializer.prototype.serialize_ = function(a, b) {
  switch(typeof a) {
    case "string":
      this.serializeString_(a, b);
      break;
    case "number":
      this.serializeNumber_(a, b);
      break;
    case "boolean":
      b.push(a);
      break;
    case "undefined":
      b.push("null");
      break;
    case "object":
      if(a == null) {
        b.push("null");
        break
      }
      if(goog.isArray(a)) {
        this.serializeArray_(a, b);
        break
      }
      this.serializeObject_(a, b);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof a);
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(a, b) {
  b.push('"', a.replace(goog.json.Serializer.charsToReplace_, function(a) {
    if(a in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[a]
    }
    var b = a.charCodeAt(0), e = "\\u";
    b < 16 ? e += "000" : b < 256 ? e += "00" : b < 4096 && (e += "0");
    return goog.json.Serializer.charToJsonCharCache_[a] = e + b.toString(16)
  }), '"')
};
goog.json.Serializer.prototype.serializeNumber_ = function(a, b) {
  b.push(isFinite(a) && !isNaN(a) ? a : "null")
};
goog.json.Serializer.prototype.serializeArray_ = function(a, b) {
  var c = a.length;
  b.push("[");
  for(var d = "", e = 0;e < c;e++) {
    b.push(d), d = a[e], this.serialize_(this.replacer_ ? this.replacer_.call(a, String(e), d) : d, b), d = ","
  }
  b.push("]")
};
goog.json.Serializer.prototype.serializeObject_ = function(a, b) {
  b.push("{");
  var c = "", d;
  for(d in a) {
    if(Object.prototype.hasOwnProperty.call(a, d)) {
      var e = a[d];
      typeof e != "function" && (b.push(c), this.serializeString_(d, b), b.push(":"), this.serialize_(this.replacer_ ? this.replacer_.call(a, d, e) : e, b), c = ",")
    }
  }
  b.push("}")
};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return a.lastIndexOf(b, 0) == 0
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return c >= 0 && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return goog.string.caseInsensitiveCompare(b, a.substr(0, b.length)) == 0
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length)) == 0
};
goog.string.subs = function(a) {
  for(var b = 1;b < arguments.length;b++) {
    var c = String(arguments[b]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, c)
  }
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return a == " "
};
goog.string.isUnicodeChar = function(a) {
  return a.length == 1 && a >= " " && a <= "~" || a >= "\u0080" && a <= "\ufffd"
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      c = parseInt(g, 10);
      if(!isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d)) {
        return c - d
      }
      return g < h ? -1 : 1
    }
  }
  if(c.length != d.length) {
    return c.length - d.length
  }
  return a < b ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(a) {
  a = String(a);
  if(!goog.string.encodeUriRegExp_.test(a)) {
    return encodeURIComponent(a)
  }
  return a
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }else {
    if(!goog.string.allRe_.test(a)) {
      return a
    }
    a.indexOf("&") != -1 && (a = a.replace(goog.string.amperRe_, "&amp;"));
    a.indexOf("<") != -1 && (a = a.replace(goog.string.ltRe_, "&lt;"));
    a.indexOf(">") != -1 && (a = a.replace(goog.string.gtRe_, "&gt;"));
    a.indexOf('"') != -1 && (a = a.replace(goog.string.quotRe_, "&quot;"));
    return a
  }
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  if(goog.string.contains(a, "&")) {
    return"document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a)
  }
  return a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, c = document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, e) {
    var f = b[a];
    if(f) {
      return f
    }
    if(e.charAt(0) == "#") {
      var g = Number("0" + e.substr(1));
      isNaN(g) || (f = String.fromCharCode(g))
    }
    if(!f) {
      c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1)
    }
    return b[a] = f
  })
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if(c.charAt(0) == "#") {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = c == 1 ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d, a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, d += b % 2, a = a.substring(0, d) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\0":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }else {
    for(var b = ['"'], c = 0;c < a.length;c++) {
      var d = a.charAt(c), e = d.charCodeAt(0);
      b[c + 1] = goog.string.specialEscapeChars_[d] || (e > 31 && e < 127 ? d : goog.string.escapeChar(d))
    }
    b.push('"');
    return b.join("")
  }
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(c > 31 && c < 127) {
    b = a
  }else {
    if(c < 256) {
      if(b = "\\x", c < 16 || c > 256) {
        b += "0"
      }
    }else {
      b = "\\u", c < 4096 && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return a.indexOf(b) != -1
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  b >= 0 && b < a.length && c > 0 && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  if(c == -1) {
    c = a.length
  }
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return a == null ? "" : String(a)
};
goog.string.buildString = function() {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;c == 0 && g < f;g++) {
    var h = d[g] || "", j = e[g] || "", k = RegExp("(\\d*)(\\D*)", "g"), i = RegExp("(\\d*)(\\D*)", "g");
    do {
      var l = k.exec(h) || ["", "", ""], m = i.exec(j) || ["", "", ""];
      if(l[0].length == 0 && m[0].length == 0) {
        break
      }
      var c = l[1].length == 0 ? 0 : parseInt(l[1], 10), n = m[1].length == 0 ? 0 : parseInt(m[1], 10), c = goog.string.compareElements_(c, n) || goog.string.compareElements_(l[2].length == 0, m[2].length == 0) || goog.string.compareElements_(l[2], m[2])
    }while(c == 0)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  if(a < b) {
    return-1
  }else {
    if(a > b) {
      return 1
    }
  }
  return 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  if(b == 0 && goog.string.isEmpty(a)) {
    return NaN
  }
  return b
};
goog.string.toCamelCaseCache_ = {};
goog.string.toCamelCase = function(a) {
  return goog.string.toCamelCaseCache_[a] || (goog.string.toCamelCaseCache_[a] = String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  }))
};
goog.string.toSelectorCaseCache_ = {};
goog.string.toSelectorCase = function(a) {
  return goog.string.toSelectorCaseCache_[a] || (goog.string.toSelectorCaseCache_[a] = String(a).replace(/([A-Z])/g, "-$1").toLowerCase())
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = !1;
  goog.userAgent.detectedIe_ = !1;
  goog.userAgent.detectedWebkit_ = !1;
  goog.userAgent.detectedMobile_ = !1;
  goog.userAgent.detectedGecko_ = !1;
  var a;
  if(!goog.userAgent.BROWSER_KNOWN_ && (a = goog.userAgent.getUserAgentString())) {
    var b = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = a.indexOf("Opera") == 0;
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && a.indexOf("MSIE") != -1;
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && a.indexOf("WebKit") != -1;
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && a.indexOf("Mobile") != -1;
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && b.product == "Gecko"
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function() {
  var a = "", b;
  goog.userAgent.OPERA && goog.global.opera ? (a = goog.global.opera.version, a = typeof a == "function" ? a() : a) : (goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /MSIE\s+([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/), b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : ""));
  if(goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a))) {
    return String(b)
  }
  return a
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(a) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionCache_[a] || (goog.userAgent.isVersionCache_[a] = goog.string.compareVersions(goog.userAgent.VERSION, a) >= 0)
};
goog.userAgent.isDocumentModeCache_ = {};
goog.userAgent.isDocumentMode = function(a) {
  return goog.userAgent.isDocumentModeCache_[a] || (goog.userAgent.isDocumentModeCache_[a] = goog.userAgent.IE && document.documentMode && document.documentMode >= a)
};
goog.userAgent.product = {};
goog.userAgent.product.ASSUME_FIREFOX = !1;
goog.userAgent.product.ASSUME_CAMINO = !1;
goog.userAgent.product.ASSUME_IPHONE = !1;
goog.userAgent.product.ASSUME_IPAD = !1;
goog.userAgent.product.ASSUME_ANDROID = !1;
goog.userAgent.product.ASSUME_CHROME = !1;
goog.userAgent.product.ASSUME_SAFARI = !1;
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_CAMINO || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI;
goog.userAgent.product.init_ = function() {
  goog.userAgent.product.detectedFirefox_ = !1;
  goog.userAgent.product.detectedCamino_ = !1;
  goog.userAgent.product.detectedIphone_ = !1;
  goog.userAgent.product.detectedIpad_ = !1;
  goog.userAgent.product.detectedAndroid_ = !1;
  goog.userAgent.product.detectedChrome_ = !1;
  goog.userAgent.product.detectedSafari_ = !1;
  var a = goog.userAgent.getUserAgentString();
  if(a) {
    if(a.indexOf("Firefox") != -1) {
      goog.userAgent.product.detectedFirefox_ = !0
    }else {
      if(a.indexOf("Camino") != -1) {
        goog.userAgent.product.detectedCamino_ = !0
      }else {
        if(a.indexOf("iPhone") != -1 || a.indexOf("iPod") != -1) {
          goog.userAgent.product.detectedIphone_ = !0
        }else {
          if(a.indexOf("iPad") != -1) {
            goog.userAgent.product.detectedIpad_ = !0
          }else {
            if(a.indexOf("Android") != -1) {
              goog.userAgent.product.detectedAndroid_ = !0
            }else {
              if(a.indexOf("Chrome") != -1) {
                goog.userAgent.product.detectedChrome_ = !0
              }else {
                if(a.indexOf("Safari") != -1) {
                  goog.userAgent.product.detectedSafari_ = !0
                }
              }
            }
          }
        }
      }
    }
  }
};
goog.userAgent.product.PRODUCT_KNOWN_ || goog.userAgent.product.init_();
goog.userAgent.product.OPERA = goog.userAgent.OPERA;
goog.userAgent.product.IE = goog.userAgent.IE;
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.userAgent.product.detectedFirefox_;
goog.userAgent.product.CAMINO = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CAMINO : goog.userAgent.product.detectedCamino_;
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.detectedIphone_;
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.userAgent.product.detectedIpad_;
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.userAgent.product.detectedAndroid_;
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.userAgent.product.detectedChrome_;
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.detectedSafari_;
var webdriver = {CommandResponse:{}, Command:function(a) {
  this.name_ = a;
  this.parameters_ = {}
}};
webdriver.Command.prototype.getName = function() {
  return this.name_
};
webdriver.Command.prototype.setParameter = function(a, b) {
  this.parameters_[a] = b;
  return this
};
webdriver.Command.prototype.setParameters = function(a) {
  this.parameters_ = a;
  return this
};
webdriver.Command.prototype.getParameter = function(a) {
  return this.parameters_[a]
};
webdriver.Command.prototype.getParameters = function() {
  return this.parameters_
};
webdriver.CommandName = {GET_SERVER_STATUS:"status", NEW_SESSION:"newSession", GET_SESSIONS:"getSessions", DESCRIBE_SESSION:"getSessionCapabilities", CLOSE:"close", QUIT:"quit", GET_CURRENT_URL:"getCurrentUrl", GET:"get", GO_BACK:"goBack", GO_FORWARD:"goForward", REFRESH:"refresh", ADD_COOKIE:"addCookie", GET_COOKIE:"getCookie", GET_ALL_COOKIES:"getCookies", DELETE_COOKIE:"deleteCookie", DELETE_ALL_COOKIES:"deleteAllCookies", GET_ACTIVE_ELEMENT:"getActiveElement", FIND_ELEMENT:"findElement", FIND_ELEMENTS:"findElements", 
FIND_CHILD_ELEMENT:"findChildElement", FIND_CHILD_ELEMENTS:"findChildElements", CLEAR_ELEMENT:"clearElement", CLICK_ELEMENT:"clickElement", SEND_KEYS_TO_ELEMENT:"sendKeysToElement", SUBMIT_ELEMENT:"submitElement", TOGGLE_ELEMENT:"toggleElement", GET_CURRENT_WINDOW_HANDLE:"getCurrentWindowHandle", GET_WINDOW_HANDLES:"getWindowHandles", SWITCH_TO_WINDOW:"switchToWindow", SWITCH_TO_FRAME:"switchToFrame", GET_PAGE_SOURCE:"getPageSource", GET_TITLE:"getTitle", EXECUTE_SCRIPT:"executeScript", EXECUTE_ASYNC_SCRIPT:"executeAsyncScript", 
GET_ELEMENT_TEXT:"getElementText", GET_ELEMENT_TAG_NAME:"getElementTagName", IS_ELEMENT_SELECTED:"isElementSelected", IS_ELEMENT_ENABLED:"isElementEnabled", IS_ELEMENT_DISPLAYED:"isElementDisplayed", GET_ELEMENT_LOCATION:"getElementLocation", GET_ELEMENT_SIZE:"getElementSize", GET_ELEMENT_ATTRIBUTE:"getElementAttribute", GET_ELEMENT_VALUE_OF_CSS_PROPERTY:"getElementValueOfCssProperty", ELEMENT_EQUALS:"elementEquals", SCREENSHOT:"screenshot", DIMISS_ALERT:"dimissAlert", IMPLICITLY_WAIT:"implicitlyWait", 
SET_SCRIPT_TIMEOUT:"setScriptTimeout", GET_ALERT:"getAlert", ACCEPT_ALERT:"acceptAlert", DISMISS_ALERT:"dismissAlert", GET_ALERT_TEXT:"getAlertText", SET_ALERT_VALUE:"setAlertValue"};
webdriver.CommandExecutor = function() {
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length;c++) {
    if(a = a[d[c]], !goog.isDef(a)) {
      break
    }
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  if(b in a) {
    return a[b]
  }
  return c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if(b == "object" || b == "array") {
    if(a.clone) {
      return a.clone()
    }
    var b = b == "array" ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(a) {
  for(var b, c, d = 1;d < arguments.length;d++) {
    c = arguments[d];
    for(b in c) {
      a[b] = c[b]
    }
    for(var e = 0;e < goog.object.PROTOTYPE_FIELDS_.length;e++) {
      b = goog.object.PROTOTYPE_FIELDS_[e], Object.prototype.hasOwnProperty.call(c, b) && (a[b] = c[b])
    }
  }
};
goog.object.create = function() {
  var a = arguments.length;
  if(a == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(a % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var b = {}, c = 0;c < a;c += 2) {
    b[arguments[c]] = arguments[c + 1]
  }
  return b
};
goog.object.createSet = function() {
  var a = arguments.length;
  if(a == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var b = {}, c = 0;c < a;c++) {
    b[arguments[c]] = !0
  }
  return b
};
var bot = {ErrorCode:{SUCCESS:0, NO_SUCH_ELEMENT:7, NO_SUCH_FRAME:8, UNKNOWN_COMMAND:9, UNSUPPORTED_OPERATION:9, STALE_ELEMENT_REFERENCE:10, ELEMENT_NOT_VISIBLE:11, INVALID_ELEMENT_STATE:12, UNKNOWN_ERROR:13, ELEMENT_NOT_SELECTABLE:15, JAVASCRIPT_ERROR:17, XPATH_LOOKUP_ERROR:19, TIMEOUT:21, NO_SUCH_WINDOW:23, INVALID_COOKIE_DOMAIN:24, UNABLE_TO_SET_COOKIE:25, MODAL_DIALOG_OPENED:26, NO_MODAL_DIALOG_OPEN:27, SCRIPT_TIMEOUT:28, INVALID_ELEMENT_COORDINATES:29, INVALID_SELECTOR_ERROR:32, SQL_DATABASE_ERROR:33, 
MOVE_TARGET_OUT_OF_BOUNDS:34, IME_ENGINE_ACTIVATION_FAILED:35, IME_NOT_AVAILABLE:36}};
bot.Error = function(a, b) {
  this.code = a;
  this.message = b || "";
  this.name = bot.Error.NAMES_[a] || bot.Error.NAMES_[bot.ErrorCode.UNKNOWN_ERROR];
  var c = Error(this.message);
  c.name = this.name;
  this.stack = c.stack || ""
};
goog.inherits(bot.Error, Error);
bot.Error.NAMES_ = goog.object.create(bot.ErrorCode.NO_SUCH_ELEMENT, "NoSuchElementError", bot.ErrorCode.NO_SUCH_FRAME, "NoSuchFrameError", bot.ErrorCode.UNKNOWN_COMMAND, "UnknownCommandError", bot.ErrorCode.STALE_ELEMENT_REFERENCE, "StaleElementReferenceError", bot.ErrorCode.ELEMENT_NOT_VISIBLE, "ElementNotVisibleError", bot.ErrorCode.INVALID_ELEMENT_STATE, "InvalidElementStateError", bot.ErrorCode.UNKNOWN_ERROR, "UnknownError", bot.ErrorCode.ELEMENT_NOT_SELECTABLE, "ElementNotSelectableError", 
bot.ErrorCode.XPATH_LOOKUP_ERROR, "XPathLookupError", bot.ErrorCode.NO_SUCH_WINDOW, "NoSuchWindowError", bot.ErrorCode.INVALID_COOKIE_DOMAIN, "InvalidCookieDomainError", bot.ErrorCode.UNABLE_TO_SET_COOKIE, "UnableToSetCookieError", bot.ErrorCode.MODAL_DIALOG_OPENED, "ModalDialogOpenedError", bot.ErrorCode.NO_MODAL_DIALOG_OPEN, "NoModalDialogOpenError", bot.ErrorCode.SCRIPT_TIMEOUT, "ScriptTimeoutError", bot.ErrorCode.INVALID_SELECTOR_ERROR, "InvalidSelectorError", bot.ErrorCode.SQL_DATABASE_ERROR, 
"SqlDatabaseError", bot.ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS, "MoveTargetOutOfBoundsError");
bot.Error.prototype.isAutomationError = !0;
if(goog.DEBUG) {
  bot.Error.prototype.toString = function() {
    return"[" + this.name + "] " + this.message
  }
}
;webdriver.error = {};
webdriver.error.createResponse = function(a) {
  return{status:a && a.code || bot.ErrorCode.UNKNOWN_ERROR, value:{message:a && a.message || a + ""}}
};
webdriver.error.checkResponse = function(a) {
  var b = a.status;
  if(b == bot.ErrorCode.SUCCESS) {
    return a
  }
  b = b || bot.ErrorCode.UNKNOWN_ERROR;
  a = a.value;
  if(!a || !goog.isObject(a)) {
    throw new bot.Error(b, a + "");
  }
  throw new bot.Error(b, a.message + "");
};
webdriver.FirefoxDomExecutor = function() {
  if(!webdriver.FirefoxDomExecutor.isAvailable()) {
    throw Error("The current environment does not support the FirefoxDomExecutor");
  }
  this.doc_ = document;
  this.docElement_ = document.documentElement;
  this.docElement_.addEventListener(webdriver.FirefoxDomExecutor.EventType_.RESPONSE, goog.bind(this.onResponse_, this), !1)
};
webdriver.FirefoxDomExecutor.isAvailable = function() {
  return goog.userAgent.product.FIREFOX && typeof document !== "undefined" && document.documentElement && goog.isFunction(document.documentElement.hasAttribute) && document.documentElement.hasAttribute("webdriver")
};
webdriver.FirefoxDomExecutor.Attribute_ = {COMMAND:"command", RESPONSE:"response"};
webdriver.FirefoxDomExecutor.EventType_ = {COMMAND:"webdriverCommand", RESPONSE:"webdriverResponse"};
webdriver.FirefoxDomExecutor.prototype.pendingCommand_ = null;
webdriver.FirefoxDomExecutor.prototype.execute = function(a, b) {
  if(this.pendingCommand_) {
    throw Error("Currently awaiting a command response!");
  }
  this.pendingCommand_ = {name:a.getName(), callback:b};
  var c = a.getParameters();
  c.id && c.id.ELEMENT && (c.id = c.id.ELEMENT);
  c = goog.json.serialize({name:a.getName(), sessionId:{value:c.sessionId}, parameters:c});
  this.docElement_.setAttribute(webdriver.FirefoxDomExecutor.Attribute_.COMMAND, c);
  c = this.doc_.createEvent("Event");
  c.initEvent(webdriver.FirefoxDomExecutor.EventType_.COMMAND, !0, !0);
  this.docElement_.dispatchEvent(c)
};
webdriver.FirefoxDomExecutor.prototype.onResponse_ = function() {
  if(this.pendingCommand_) {
    var a = this.pendingCommand_;
    this.pendingCommand_ = null;
    var b = this.docElement_.getAttribute(webdriver.FirefoxDomExecutor.Attribute_.RESPONSE);
    if(b) {
      this.docElement_.removeAttribute(webdriver.FirefoxDomExecutor.Attribute_.COMMAND);
      this.docElement_.removeAttribute(webdriver.FirefoxDomExecutor.Attribute_.RESPONSE);
      try {
        var c = webdriver.error.checkResponse(goog.json.parse(b))
      }catch(d) {
        a.callback(d);
        return
      }
      a.name == webdriver.CommandName.NEW_SESSION ? this.execute((new webdriver.Command(webdriver.CommandName.DESCRIBE_SESSION)).setParameter("sessionId", c.value), a.callback) : a.callback(null, c)
    }else {
      a.callback(Error("Empty command response!"))
    }
  }
};
goog.debug = {};
goog.debug.Error = function(a) {
  this.stack = Error().stack || "";
  if(a) {
    this.message = String(a)
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    e += ": " + c;
    var f = d
  }else {
    a && (e += ": " + a, f = b)
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3))
};
goog.array = {};
goog.array.ArrayLike = {};
goog.NATIVE_ARRAY_PROTOTYPES = !0;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = c == null ? 0 : c < 0 ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    if(!goog.isString(b) || b.length != 1) {
      return-1
    }
    return a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, c == null ? a.length - 1 : c)
} : function(a, b, c) {
  c = c == null ? a.length - 1 : c;
  c < 0 && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    if(!goog.isString(b) || b.length != 1) {
      return-1
    }
    return a.lastIndexOf(b, c)
  }
  for(;c >= 0;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for(d -= 1;d >= 0;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var j = g[h];
      b.call(c, j, h, a) && (e[f++] = j)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return b < 0 ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return b < 0 ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for(d -= 1;d >= 0;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return goog.array.indexOf(a, b) >= 0
};
goog.array.isEmpty = function(a) {
  return a.length == 0
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;b >= 0;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  arguments.length == 2 || (d = goog.array.indexOf(a, c)) < 0 ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = c >= 0) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length == 1
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  if(b >= 0) {
    return goog.array.removeAt(a, b), !0
  }
  return!1
};
goog.array.concat = function() {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(a) {
  if(goog.isArray(a)) {
    return goog.array.concat(a)
  }else {
    for(var b = [], c = 0, d = a.length;c < d;c++) {
      b[c] = a[c]
    }
    return b
  }
};
goog.array.toArray = function(a) {
  if(goog.isArray(a)) {
    return goog.array.concat(a)
  }
  return goog.array.clone(a)
};
goog.array.extend = function(a) {
  for(var b = 1;b < arguments.length;b++) {
    var c = arguments[b], d;
    if(goog.isArray(c) || (d = goog.isArrayLike(c)) && c.hasOwnProperty("callee")) {
      a.push.apply(a, c)
    }else {
      if(d) {
        for(var e = a.length, f = c.length, g = 0;g < f;g++) {
          a[e + g] = c[g]
        }
      }else {
        a.push(c)
      }
    }
  }
};
goog.array.splice = function(a) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return arguments.length <= 2 ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  for(var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var j = f + g >> 1, k;
    k = c ? b.call(e, a[j], j, a) : b(d, a[j]);
    k > 0 ? f = j + 1 : (g = j, h = !k)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(a.length != null);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  for(var b = b || goog.array.defaultCompare, d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(e > 0 || e == 0 && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  for(var d = a.length, c = c || goog.array.defaultCompareEquality, e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.compare3 = function(a, b, c) {
  for(var c = c || goog.array.defaultCompare, d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if(f != 0) {
      return f
    }
  }
  return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  if(c < 0) {
    return goog.array.insertAt(a, b, -(c + 1)), !0
  }
  return!1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return b >= 0 ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b) {
  for(var c = {}, d = 0;d < a.length;d++) {
    var e = a[d], f = b(e, d, a);
    goog.isDef(f) && (c[f] || (c[f] = [])).push(e)
  }
  return c
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function() {
  for(var a = [], b = 0;b < arguments.length;b++) {
    var c = arguments[b];
    goog.isArray(c) ? a.push.apply(a, goog.array.flatten.apply(null, c)) : a.push(c)
  }
  return a
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(a.length != null);
  a.length && (b %= a.length, b > 0 ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : b < 0 && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.zip = function() {
  if(!arguments.length) {
    return[]
  }
  for(var a = [], b = 0;;b++) {
    for(var c = [], d = 0;d < arguments.length;d++) {
      var e = arguments[d];
      if(b >= e.length) {
        return a
      }
      c.push(e[b])
    }
    a.push(c)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;d > 0;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
webdriver.Locator = function(a, b) {
  this.using = a;
  this.value = b
};
webdriver.Locator.factory_ = function(a) {
  return function(b) {
    return new webdriver.Locator(a, b)
  }
};
webdriver.Locator.Strategy = {className:webdriver.Locator.factory_("class name"), "class name":webdriver.Locator.factory_("class name"), css:webdriver.Locator.factory_("css selector"), id:webdriver.Locator.factory_("id"), js:webdriver.Locator.factory_("js"), linkText:webdriver.Locator.factory_("link text"), "link text":webdriver.Locator.factory_("link text"), name:webdriver.Locator.factory_("name"), partialLinkText:webdriver.Locator.factory_("partial link text"), "partial link text":webdriver.Locator.factory_("partial link text"), 
tagName:webdriver.Locator.factory_("tag name"), "tag name":webdriver.Locator.factory_("tag name"), xpath:webdriver.Locator.factory_("xpath")};
goog.exportSymbol("By", webdriver.Locator.Strategy);
webdriver.Locator.createFromObj = function(a) {
  var b = goog.object.getAnyKey(a);
  if(b) {
    if(b in webdriver.Locator.Strategy) {
      return webdriver.Locator.Strategy[b](a[b])
    }
  }else {
    throw Error("No keys found in locator hash object");
  }
  throw Error("Unsupported locator strategy: " + b);
};
webdriver.Locator.checkLocator = function(a) {
  if(!a.using || !a.value) {
    a = webdriver.Locator.createFromObj(a)
  }
  return a
};
webdriver.Locator.prototype.toString = function() {
  return"By " + this.using + " (" + this.value + ")"
};
webdriver.Session = function(a, b) {
  this.id = a;
  this.capabilities = b
};
goog.exportSymbol("webdriver.Session", webdriver.Session);
webdriver.Session.prototype.getId = function() {
  return this.id
};
goog.exportProperty(webdriver.Session.prototype, "getId", webdriver.Session.prototype.getId);
webdriver.Session.prototype.getCapabilities = function() {
  return this.capabilities
};
goog.exportProperty(webdriver.Session.prototype, "getCapabilities", webdriver.Session.prototype.getCapabilities);
webdriver.Session.prototype.getCapability = function(a) {
  return this.capabilities[a]
};
webdriver.Session.prototype.toJSON = function() {
  return this.id
};
webdriver.EventEmitter = function() {
  this.events_ = {}
};
goog.exportSymbol("webdriver.EventEmitter", webdriver.EventEmitter);
webdriver.EventEmitter.prototype.emit = function(a) {
  var b = Array.prototype.slice.call(arguments, 1), c = this.events_[a];
  if(c) {
    for(var d = 0;d < c.length;) {
      c[d].fn.apply(null, b), c[d].oneshot ? c.splice(d, 1) : d += 1
    }
  }
};
goog.exportProperty(webdriver.EventEmitter.prototype, "emit", webdriver.EventEmitter.prototype.emit);
webdriver.EventEmitter.prototype.listeners = function(a) {
  var b = this.events_[a];
  b || (b = this.events_[a] = []);
  return b
};
webdriver.EventEmitter.prototype.addListener = function(a, b, c) {
  for(var a = this.listeners(a), d = a.length, e = 0;e < d;++e) {
    if(a[e] == b) {
      return this
    }
  }
  a.push({fn:b, oneshot:!!c});
  return this
};
goog.exportProperty(webdriver.EventEmitter.prototype, "addListener", webdriver.EventEmitter.prototype.addListener);
webdriver.EventEmitter.prototype.once = function(a, b) {
  return this.addListener(a, b, !0)
};
goog.exportProperty(webdriver.EventEmitter.prototype, "once", webdriver.EventEmitter.prototype.once);
webdriver.EventEmitter.prototype.on = webdriver.EventEmitter.prototype.addListener;
goog.exportProperty(webdriver.EventEmitter.prototype, "on", webdriver.EventEmitter.prototype.on);
webdriver.EventEmitter.prototype.removeListener = function(a, b) {
  var c = this.events_[a];
  if(c) {
    for(var d = c.length, e = 0;e < d;++e) {
      if(c[e].fn == b) {
        c.splice(e, 1);
        break
      }
    }
  }
  return this
};
goog.exportProperty(webdriver.EventEmitter.prototype, "removeListener", webdriver.EventEmitter.prototype.removeListener);
webdriver.EventEmitter.prototype.removeAllListeners = function(a) {
  goog.isDef(a) ? delete this.events_[a] : this.events_ = {};
  return this
};
goog.exportProperty(webdriver.EventEmitter.prototype, "removeAllListeners", webdriver.EventEmitter.prototype.removeAllListeners);
/*
 Portions of this code are from the Dojo toolkit, received under the
 BSD License:
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.
 Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 Neither the name of the Dojo Foundation nor the names of its contributors
 may be used to endorse or promote products derived from this software
 without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
*/
webdriver.promise = {};
webdriver.promise.Promise = function() {
};
goog.exportSymbol("webdriver.promise.Promise", webdriver.promise.Promise);
webdriver.promise.Promise.prototype.cancel = function() {
  throw new TypeError('Unimplemented function: "cancel"');
};
goog.exportProperty(webdriver.promise.Promise.prototype, "cancel", webdriver.promise.Promise.prototype.cancel);
webdriver.promise.Promise.prototype.isPending = function() {
  throw new TypeError('Unimplemented function: "isPending"');
};
webdriver.promise.Promise.prototype.then = function() {
  throw new TypeError('Unimplemented function: "then"');
};
goog.exportProperty(webdriver.promise.Promise.prototype, "then", webdriver.promise.Promise.prototype.then);
webdriver.promise.Promise.prototype.addCallback = function(a, b) {
  return this.then(goog.bind(a, b))
};
goog.exportProperty(webdriver.promise.Promise.prototype, "addCallback", webdriver.promise.Promise.prototype.addCallback);
webdriver.promise.Promise.prototype.addErrback = function(a, b) {
  return this.then(null, goog.bind(a, b))
};
goog.exportProperty(webdriver.promise.Promise.prototype, "addErrback", webdriver.promise.Promise.prototype.addErrback);
webdriver.promise.Promise.prototype.addBoth = function(a, b) {
  a = goog.bind(a, b);
  return this.then(a, a)
};
goog.exportProperty(webdriver.promise.Promise.prototype, "addBoth", webdriver.promise.Promise.prototype.addBoth);
webdriver.promise.Promise.prototype.addCallbacks = function(a, b, c) {
  return this.then(goog.bind(a, c), goog.bind(b, c))
};
goog.exportProperty(webdriver.promise.Promise.prototype, "addCallbacks", webdriver.promise.Promise.prototype.addCallbacks);
webdriver.promise.Deferred = function(a) {
  function b() {
    return k == webdriver.promise.Deferred.State.PENDING
  }
  function c(a, c) {
    if(!b()) {
      throw Error("This Deferred has already been resolved.");
    }
    k = a;
    for(i = c;h.length;) {
      d(h.shift())
    }
    if(!j && k == webdriver.promise.Deferred.State.REJECTED) {
      var e = webdriver.promise.Application.getInstance();
      e.pendingRejections_ += 1;
      setTimeout(function() {
        e.pendingRejections_ -= 1;
        j || e.abortCurrentFrame_(i)
      }, 0)
    }
  }
  function d(a) {
    var b = k == webdriver.promise.Deferred.State.RESOLVED ? a.callback : a.errback;
    b ? (b = webdriver.promise.Application.getInstance().executeAsap_(goog.partial(b, i)), webdriver.promise.asap(b, a.deferred.resolve, a.deferred.reject)) : k == webdriver.promise.Deferred.State.REJECTED ? a.deferred.reject(i) : a.deferred.resolve(i)
  }
  function e(a) {
    webdriver.promise.isPromise(a) && a !== l ? a instanceof webdriver.promise.Deferred ? a.then(goog.partial(c, webdriver.promise.Deferred.State.RESOLVED), goog.partial(c, webdriver.promise.Deferred.State.REJECTED)) : webdriver.promise.when(a, e, f) : c(webdriver.promise.Deferred.State.RESOLVED, a)
  }
  function f(a) {
    webdriver.promise.isPromise(a) && i !== l ? i instanceof webdriver.promise.Deferred ? i.then(goog.partial(c, webdriver.promise.Deferred.State.REJECTED), goog.partial(c, webdriver.promise.Deferred.State.REJECTED)) : webdriver.promise.when(a, f, f) : c(webdriver.promise.Deferred.State.REJECTED, a)
  }
  function g(c) {
    if(!b()) {
      throw Error("This Deferred has already been resolved.");
    }
    a && (c = a(c) || c);
    b() && f(c)
  }
  webdriver.promise.Promise.call(this);
  var h = [], j = !1, k = webdriver.promise.Deferred.State.PENDING, i;
  this.then = function(a, b) {
    j = !0;
    var c = {callback:a, errback:b, deferred:new webdriver.promise.Deferred(g)};
    k == webdriver.promise.Deferred.State.PENDING ? h.push(c) : d(c);
    return c.deferred.promise
  };
  var l = this;
  this.promise = new webdriver.promise.Promise;
  this.promise.then = this.then;
  this.promise.cancel = this.cancel = g;
  this.promise.isPending = this.isPending = b;
  this.resolve = this.callback = e;
  this.reject = this.errback = f
};
goog.inherits(webdriver.promise.Deferred, webdriver.promise.Promise);
goog.exportSymbol("webdriver.promise.Deferred", webdriver.promise.Deferred);
webdriver.promise.Deferred.State = {REJECTED:-1, PENDING:0, RESOLVED:1};
webdriver.promise.isPromise = function(a) {
  return!!a && goog.isObject(a) && goog.isFunction(a.then)
};
goog.exportSymbol("webdriver.promise.isPromise", webdriver.promise.isPromise);
webdriver.promise.delayed = function(a) {
  var b, c = new webdriver.promise.Deferred(function() {
    clearTimeout(b)
  });
  b = setTimeout(c.resolve, a);
  return c.promise
};
goog.exportSymbol("webdriver.promise.delayed", webdriver.promise.delayed);
webdriver.promise.resolved = function(a) {
  var b = new webdriver.promise.Deferred;
  b.resolve(a);
  return b.promise
};
goog.exportSymbol("webdriver.promise.resolved", webdriver.promise.resolved);
webdriver.promise.rejected = function(a) {
  var b = new webdriver.promise.Deferred;
  b.reject(a);
  return b.promise
};
goog.exportSymbol("webdriver.promise.rejected", webdriver.promise.rejected);
webdriver.promise.checkedNodeCall = function(a) {
  var b = new webdriver.promise.Deferred(function() {
    throw Error("This Deferred may not be cancelled");
  }), c = !1;
  try {
    a(function(a, d) {
      c || (c = !0, a ? b.reject(a) : b.resolve(d))
    })
  }catch(d) {
    c || (c = !0, b.reject(d))
  }
  return b.promise
};
goog.exportSymbol("webdriver.promise.checkedNodeCall", webdriver.promise.checkedNodeCall);
webdriver.promise.when = function(a, b, c) {
  if(a instanceof webdriver.promise.Promise) {
    return a.then(b, c)
  }
  var d = new webdriver.promise.Deferred(function() {
    throw Error("This Deferred may not be cancelled");
  });
  webdriver.promise.asap(a, d.resolve, d.reject);
  return d.then(b, c)
};
goog.exportSymbol("webdriver.promise.when", webdriver.promise.when);
webdriver.promise.asap = function(a, b, c) {
  webdriver.promise.isPromise(a) ? a.then(b, c) : a && goog.isObject(a) && goog.isFunction(a.addCallbacks) ? a.addCallbacks(b, c) : b && b(a)
};
goog.exportSymbol("webdriver.promise.asap", webdriver.promise.asap);
webdriver.promise.fullyResolved = function(a) {
  if(webdriver.promise.isPromise(a)) {
    return webdriver.promise.when(a, webdriver.promise.fullyResolveValue_)
  }
  return webdriver.promise.fullyResolveValue_(a)
};
goog.exportSymbol("webdriver.promise.fullyResolved", webdriver.promise.fullyResolved);
webdriver.promise.fullyResolveValue_ = function(a) {
  switch(goog.typeOf(a)) {
    case "array":
      return webdriver.promise.fullyResolveKeys_(a, a.length, function(a, c, d) {
        for(var e = a.length, f = 0;f < e;++f) {
          c.call(d, a[f], f, a)
        }
      });
    case "object":
      if(webdriver.promise.isPromise(a)) {
        return a
      }
      if(goog.isNumber(a.nodeType)) {
        return webdriver.promise.resolved(a)
      }
      return webdriver.promise.fullyResolveKeys_(a, goog.object.getKeys(a).length, goog.object.forEach);
    default:
      return webdriver.promise.resolved(a)
  }
};
webdriver.promise.fullyResolveKeys_ = function(a, b, c) {
  if(!b) {
    return webdriver.promise.resolved(a)
  }
  var d = 0, e = !1, f = !1, g = new webdriver.promise.Deferred(function() {
    f = !0
  });
  c(a, function(c, j) {
    function k() {
      ++d == b && !f && g.resolve(a)
    }
    if(!f) {
      var i = goog.typeOf(c);
      if(i != "array" && i != "object") {
        return k()
      }
      webdriver.promise.fullyResolved(c).then(function(b) {
        a[j] = b;
        k()
      }, function(a) {
        !e && !f && (e = !0, g.reject(a))
      })
    }
  });
  return g.promise
};
webdriver.promise.Application = function() {
  webdriver.EventEmitter.call(this);
  this.frames_ = [];
  this.history_ = []
};
goog.inherits(webdriver.promise.Application, webdriver.EventEmitter);
goog.exportSymbol("webdriver.promise.Application", webdriver.promise.Application);
goog.addSingletonGetter(webdriver.promise.Application);
webdriver.promise.Application.EventType = {IDLE:"idle", SCHEDULE_TASK:"scheduleTask", UNCAUGHT_EXCEPTION:"uncaughtException"};
webdriver.promise.Application.EVENT_LOOP_FREQUENCY = 10;
webdriver.promise.Application.prototype.shutdownId_ = null;
webdriver.promise.Application.prototype.eventLoopId_ = null;
webdriver.promise.Application.prototype.pendingRejections_ = 0;
webdriver.promise.Application.prototype.reset = function() {
  this.frames_ = [];
  this.clearHistory();
  this.removeAllListeners();
  this.cancelShutdown_();
  this.cancelEventLoop_()
};
webdriver.promise.Application.prototype.getHistory = function() {
  return this.history_.join("\n")
};
webdriver.promise.Application.prototype.clearHistory = function() {
  this.history_ = []
};
webdriver.promise.Application.prototype.getSchedule = function() {
  var a = [];
  goog.array.forEach(this.frames_, function(b) {
    a.push(["[", goog.array.map(b.queue, function(a) {
      return a.description
    }).join(", "), "]"].join(""))
  });
  return a.join("")
};
webdriver.promise.Application.prototype.schedule = function(a, b) {
  this.cancelShutdown_();
  var c = goog.array.peek(this.frames_);
  c || (c = new webdriver.promise.Application.Frame_, c.then(goog.bind(this.commenceShutdown_, this), goog.bind(this.abortNow_, this)), this.frames_.push(c));
  var d = new webdriver.promise.Application.Task_(b, a);
  c.queue.push(d);
  this.emit(webdriver.promise.Application.EventType.SCHEDULE_TASK);
  this.scheduleEventLoopStart_();
  return d.promise
};
goog.exportProperty(webdriver.promise.Application.prototype, "schedule", webdriver.promise.Application.prototype.schedule);
webdriver.promise.Application.prototype.scheduleAndWaitForIdle = function(a, b) {
  function c() {
    g = setTimeout(function() {
      f.removeListener(webdriver.promise.Application.EventType.SCHEDULE_TASK, d);
      f.removeListener(webdriver.promise.Application.EventType.UNCAUGHT_EXCEPTION, e);
      f.waitingForIdle_ = null;
      h.resolve()
    }, 0);
    f.once(webdriver.promise.Application.EventType.SCHEDULE_TASK, d)
  }
  function d() {
    clearTimeout(g);
    f.once(webdriver.promise.Application.EventType.IDLE, c)
  }
  function e(a) {
    clearTimeout(g);
    f.removeListener(webdriver.promise.Application.EventType.IDLE, c);
    f.removeListener(webdriver.promise.Application.EventType.SCHEDULE_TASK, d);
    setTimeout(function() {
      f.waitingForIdle_ = null;
      h.reject(a)
    }, 0)
  }
  if(this.waitingForIdle_) {
    throw Error("Whoops! It looks like another task is already waiting this application to go idle: " + this.waitingForIdle_);
  }
  this.waitingForIdle_ = a;
  var f = this, g, h = new webdriver.promise.Deferred(function() {
    f.waitingForIdle_ = null;
    clearTimeout(g);
    f.removeListener(webdriver.promise.Application.EventType.IDLE, c);
    f.removeListener(webdriver.promise.Application.EventType.SCHEDULE_TASK, d);
    f.removeListener(webdriver.promise.Application.EventType.UNCAUGHT_EXCEPTION, e)
  });
  f.schedule(a, b);
  f.once(webdriver.promise.Application.EventType.IDLE, c);
  f.once(webdriver.promise.Application.EventType.UNCAUGHT_EXCEPTION, e);
  return h.promise
};
goog.exportProperty(webdriver.promise.Application.prototype, "scheduleAndWaitForIdle", webdriver.promise.Application.prototype.scheduleAndWaitForIdle);
webdriver.promise.Application.prototype.scheduleTimeout = function(a, b) {
  return this.schedule(a, function() {
    return webdriver.promise.delayed(b)
  })
};
goog.exportProperty(webdriver.promise.Application.prototype, "scheduleTimeout", webdriver.promise.Application.prototype.scheduleTimeout);
webdriver.promise.Application.prototype.scheduleWait = function(a, b, c, d, e) {
  var f = Math.min(c, 100), g = !!e, h = this;
  return this.schedule(a, function() {
    function a() {
      var m = h.executeAsap_(b);
      return webdriver.promise.when(m, function(b) {
        var h = goog.now() - e;
        g != !!b ? (l.isWaiting = !1, i.resolve()) : h >= c ? i.reject(Error((d ? d + "\n" : "") + "Wait timed out after " + h + "ms")) : setTimeout(a, f)
      }, i.reject)
    }
    var e = goog.now(), i = new webdriver.promise.Deferred, l = goog.array.peek(h.frames_);
    l.isWaiting = !0;
    a();
    return i.promise
  })
};
goog.exportProperty(webdriver.promise.Application.prototype, "scheduleWait", webdriver.promise.Application.prototype.scheduleWait);
webdriver.promise.Application.prototype.scheduleEventLoopStart_ = function() {
  if(!this.eventLoopId_) {
    this.eventLoopId_ = setInterval(goog.bind(this.runEventLoop_, this), webdriver.promise.Application.EVENT_LOOP_FREQUENCY)
  }
};
webdriver.promise.Application.prototype.cancelEventLoop_ = function() {
  if(this.eventLoopId_) {
    clearInterval(this.eventLoopId_), this.eventLoopId_ = null
  }
};
webdriver.promise.Application.prototype.runEventLoop_ = function() {
  if(!this.pendingRejections_) {
    var a = goog.array.peek(this.frames_);
    if(a) {
      if(!a.pendingTask) {
        var b = a.queue.shift();
        if(b) {
          this.history_.push(Array(this.frames_.length).join("..") + b.description);
          a.isActive = !0;
          a.pendingTask = b;
          var c = this.executeAsap_(b.execute);
          webdriver.promise.asap(c, function(c) {
            a.pendingTask = null;
            b.resolve(c)
          }, function(c) {
            a.pendingTask = null;
            b.reject(c)
          })
        }else {
          a.isWaiting ? a.isActive = !1 : (this.frames_.pop(), a.resolve())
        }
      }
    }else {
      this.commenceShutdown_()
    }
  }
};
webdriver.promise.Application.prototype.executeAsap_ = function(a) {
  var b;
  try {
    var c = goog.array.peek(this.frames_);
    if(!c || c.isActive) {
      b = new webdriver.promise.Application.Frame_, this.frames_.push(b)
    }
    var d = a();
    if(!b) {
      return d
    }
    if(!b.queue.length) {
      return this.frames_.pop(), d
    }
    return b.then(function() {
      return d
    }, function(a) {
      if(d instanceof webdriver.promise.Promise && d.isPending()) {
        return d.cancel(a), d
      }
      throw a;
    })
  }catch(e) {
    return b && this.frames_.pop(), webdriver.promise.rejected(e)
  }
};
webdriver.promise.Application.prototype.commenceShutdown_ = function() {
  if(!this.shutdownId_) {
    this.cancelEventLoop_();
    var a = this;
    a.shutdownId_ = setTimeout(function() {
      a.shutdownId_ = null;
      a.emit(webdriver.promise.Application.EventType.IDLE)
    }, 0)
  }
};
webdriver.promise.Application.prototype.cancelShutdown_ = function() {
  if(this.shutdownId_) {
    clearTimeout(this.shutdownId_), this.shutdownId_ = null
  }
};
webdriver.promise.Application.prototype.abortNow_ = function(a) {
  this.frames_ = [];
  this.cancelShutdown_();
  this.cancelEventLoop_();
  this.listeners(webdriver.promise.Application.EventType.UNCAUGHT_EXCEPTION).length ? this.emit(webdriver.promise.Application.EventType.UNCAUGHT_EXCEPTION, a) : setTimeout(function() {
    throw a;
  }, 0)
};
webdriver.promise.Application.prototype.abortCurrentFrame_ = function(a) {
  var b = this.frames_.pop();
  if(b) {
    try {
      b.reject(a)
    }catch(c) {
      throw c;
    }
  }else {
    this.abortNow_(a)
  }
};
webdriver.promise.Application.Frame_ = function() {
  webdriver.promise.Deferred.call(this);
  this.queue = []
};
goog.inherits(webdriver.promise.Application.Frame_, webdriver.promise.Deferred);
webdriver.promise.Application.Frame_.prototype.pendingTask = null;
webdriver.promise.Application.Frame_.prototype.isWaiting = !1;
webdriver.promise.Application.Frame_.prototype.isActive = !1;
webdriver.promise.Application.Task_ = function(a, b) {
  webdriver.promise.Deferred.call(this);
  this.execute = a;
  this.description = b || "(anonymous task)"
};
goog.inherits(webdriver.promise.Application.Task_, webdriver.promise.Deferred);
webdriver.WebDriver = function(a, b) {
  this.session_ = a;
  this.executor_ = b
};
goog.exportSymbol("webdriver.WebDriver", webdriver.WebDriver);
webdriver.WebDriver.attachToSession = function(a, b) {
  return webdriver.WebDriver.acquireSession_(a, (new webdriver.Command(webdriver.CommandName.DESCRIBE_SESSION)).setParameter("sessionId", b))
};
goog.exportProperty(webdriver.WebDriver, "attachToSession", webdriver.WebDriver.attachToSession);
webdriver.WebDriver.createSession = function(a, b) {
  return webdriver.WebDriver.acquireSession_(a, (new webdriver.Command(webdriver.CommandName.NEW_SESSION)).setParameter("desiredCapabilities", b))
};
goog.exportProperty(webdriver.WebDriver, "createSession", webdriver.WebDriver.createSession);
webdriver.WebDriver.acquireSession_ = function(a, b) {
  var c = goog.bind(a.execute, a, b), c = webdriver.promise.checkedNodeCall(c).then(function(a) {
    webdriver.error.checkResponse(a);
    return new webdriver.Session(a.sessionId, a.value)
  });
  return new webdriver.WebDriver(c, a)
};
webdriver.WebDriver.toWireValue_ = function(a) {
  switch(goog.typeOf(a)) {
    case "array":
      return webdriver.promise.fullyResolved(goog.array.map(a, webdriver.WebDriver.toWireValue_));
    case "object":
      if(goog.isFunction(a.toWireValue)) {
        return webdriver.promise.fullyResolved(a.toWireValue())
      }
      if(goog.isFunction(a.toJSON)) {
        return webdriver.promise.resolved(a.toJSON())
      }
      if(goog.isNumber(a.nodeType) && goog.isString(a.nodeName)) {
        throw Error(["Invalid argument type: ", a.nodeName, "(", a.nodeType, ")"].join(""));
      }
      return webdriver.promise.fullyResolved(goog.object.map(a, webdriver.WebDriver.toWireValue_));
    case "function":
      return webdriver.promise.resolved("" + a);
    case "undefined":
      return webdriver.promise.resolved(null);
    default:
      return webdriver.promise.resolved(a)
  }
};
webdriver.WebDriver.fromWireValue_ = function(a, b) {
  goog.isArray(b) ? b = goog.array.map(b, goog.partial(webdriver.WebDriver.fromWireValue_, a)) : b && goog.isObject(b) && (b = webdriver.WebElement.ELEMENT_KEY in b ? new webdriver.WebElement(a, b[webdriver.WebElement.ELEMENT_KEY]) : goog.object.map(b, goog.partial(webdriver.WebDriver.fromWireValue_, a)));
  return b
};
webdriver.WebDriver.prototype.schedule = function(a, b) {
  function c() {
    if(!d.session_) {
      throw Error("This driver instance does not have a valid session ID (did you call WebDriver.quit()?) and may no longer be used.");
    }
  }
  var d = this;
  c();
  a.setParameter("sessionId", this.session_);
  return webdriver.promise.Application.getInstance().schedule(b, function() {
    c();
    return webdriver.promise.fullyResolved(a.getParameters()).then(webdriver.WebDriver.toWireValue_).then(function(b) {
      a.setParameters(b);
      return webdriver.promise.checkedNodeCall(goog.bind(d.executor_.execute, d.executor_, a))
    })
  }).then(function(a) {
    webdriver.error.checkResponse(a);
    return webdriver.WebDriver.fromWireValue_(d, a.value)
  })
};
webdriver.WebDriver.prototype.getSession = function() {
  return webdriver.promise.when(this.session_)
};
goog.exportProperty(webdriver.WebDriver.prototype, "getSession", webdriver.WebDriver.prototype.getSession);
webdriver.WebDriver.prototype.getCapability = function(a) {
  return webdriver.promise.when(this.session_, function(b) {
    return b.capabilities[a]
  })
};
goog.exportProperty(webdriver.WebDriver.prototype, "getCapability", webdriver.WebDriver.prototype.getCapability);
webdriver.WebDriver.prototype.quit = function() {
  this.schedule(new webdriver.Command(webdriver.CommandName.QUIT), "WebDriver.quit()").addBoth(function() {
    delete this.session_
  }, this)
};
goog.exportProperty(webdriver.WebDriver.prototype, "quit", webdriver.WebDriver.prototype.quit);
webdriver.WebDriver.prototype.executeScript = function(a) {
  goog.isFunction(a) && (a = "return (" + a + ").apply(null, arguments);");
  return this.schedule((new webdriver.Command(webdriver.CommandName.EXECUTE_SCRIPT)).setParameter("script", a).setParameter("args", goog.array.slice(arguments, 1)), "WebDriver.executeScript()")
};
goog.exportProperty(webdriver.WebDriver.prototype, "executeScript", webdriver.WebDriver.prototype.executeScript);
webdriver.WebDriver.prototype.executeAsyncScript = function(a) {
  goog.isFunction(a) && (a = "return (" + a + ").apply(null, arguments);");
  return this.schedule((new webdriver.Command(webdriver.CommandName.EXECUTE_ASYNC_SCRIPT)).setParameter("script", a).setParameter("args", goog.array.slice(arguments, 1)), "WebDriver.executeScript()")
};
goog.exportProperty(webdriver.WebDriver.prototype, "executeAsyncScript", webdriver.WebDriver.prototype.executeAsyncScript);
webdriver.WebDriver.prototype.call = function(a, b) {
  var c = goog.array.slice(arguments, 2);
  return webdriver.promise.Application.getInstance().schedule("WebDriver.call(" + (a.name || "function") + ")", function() {
    return webdriver.promise.fullyResolved(c).then(function(c) {
      return a.apply(b, c)
    })
  })
};
goog.exportProperty(webdriver.WebDriver.prototype, "call", webdriver.WebDriver.prototype.call);
webdriver.WebDriver.prototype.wait = function(a, b, c, d, e) {
  var f = a.name || "<anonymous function>", g = d ? " (" + d + ")" : "";
  return webdriver.promise.Application.getInstance().scheduleWait("WebDriver.wait(" + f + ")" + g, goog.bind(a, c), b, d, e)
};
goog.exportProperty(webdriver.WebDriver.prototype, "wait", webdriver.WebDriver.prototype.wait);
webdriver.WebDriver.prototype.waitNot = function(a, b, c, d) {
  return this.wait(a, b, c, d, !0)
};
goog.exportProperty(webdriver.WebDriver.prototype, "waitNot", webdriver.WebDriver.prototype.waitNot);
webdriver.WebDriver.prototype.sleep = function(a) {
  return webdriver.promise.Application.getInstance().scheduleTimeout("WebDriver.sleep(" + a + ")", a)
};
goog.exportProperty(webdriver.WebDriver.prototype, "sleep", webdriver.WebDriver.prototype.sleep);
webdriver.WebDriver.prototype.getWindowHandle = function() {
  return this.schedule(new webdriver.Command(webdriver.CommandName.GET_CURRENT_WINDOW_HANDLE), "WebDriver.getWindowHandle()")
};
goog.exportProperty(webdriver.WebDriver.prototype, "getWindowHandle", webdriver.WebDriver.prototype.getWindowHandle);
webdriver.WebDriver.prototype.getAllWindowHandles = function() {
  return this.schedule(new webdriver.Command(webdriver.CommandName.GET_WINDOW_HANDLES), "WebDriver.getAllWindowHandles()")
};
goog.exportProperty(webdriver.WebDriver.prototype, "getAllWindowHandles", webdriver.WebDriver.prototype.getAllWindowHandles);
webdriver.WebDriver.prototype.getPageSource = function() {
  return this.schedule(new webdriver.Command(webdriver.CommandName.GET_PAGE_SOURCE), "WebDriver.getAllWindowHandles()")
};
goog.exportProperty(webdriver.WebDriver.prototype, "getPageSource", webdriver.WebDriver.prototype.getPageSource);
webdriver.WebDriver.prototype.close = function() {
  return this.schedule(new webdriver.Command(webdriver.CommandName.CLOSE), "WebDriver.close()")
};
goog.exportProperty(webdriver.WebDriver.prototype, "close", webdriver.WebDriver.prototype.close);
webdriver.WebDriver.prototype.get = function(a) {
  return this.navigate().to(a)
};
goog.exportProperty(webdriver.WebDriver.prototype, "get", webdriver.WebDriver.prototype.get);
webdriver.WebDriver.prototype.getCurrentUrl = function() {
  return this.schedule(new webdriver.Command(webdriver.CommandName.GET_CURRENT_URL), "WebDriver.getCurrentUrl()")
};
goog.exportProperty(webdriver.WebDriver.prototype, "getCurrentUrl", webdriver.WebDriver.prototype.getCurrentUrl);
webdriver.WebDriver.prototype.getTitle = function() {
  return this.schedule(new webdriver.Command(webdriver.CommandName.GET_TITLE), "WebDriver.getTitle()")
};
goog.exportProperty(webdriver.WebDriver.prototype, "getTitle", webdriver.WebDriver.prototype.getTitle);
webdriver.WebDriver.prototype.findElement = function(a) {
  var b;
  if(a.nodeType === 1 && a.ownerDocument) {
    b = this.findDomElement_(a).then(function(a) {
      if(!a.length) {
        throw new bot.Error(bot.ErrorCode.NO_SUCH_ELEMENT, "Unable to locate element. Is WebDriver focused on its ownerDocument's frame?");
      }
      return a[0]
    })
  }else {
    if(b = webdriver.Locator.checkLocator(a), b.using == "js") {
      var c = goog.array.slice(arguments, 1);
      goog.array.splice(c, 0, 0, b.value);
      b = this.executeScript.apply(this, c).then(function(a) {
        if(!(a instanceof webdriver.WebElement)) {
          throw Error("JS locator script result was not a WebElement");
        }
        return a
      })
    }else {
      b = this.schedule((new webdriver.Command(webdriver.CommandName.FIND_ELEMENT)).setParameter("using", b.using).setParameter("value", b.value), "WebDriver.findElement(" + b + ")")
    }
  }
  return new webdriver.WebElement(this, b)
};
goog.exportProperty(webdriver.WebDriver.prototype, "findElement", webdriver.WebDriver.prototype.findElement);
webdriver.WebDriver.prototype.findDomElement_ = function(a) {
  function b() {
    delete d[e]
  }
  var c = a.ownerDocument, d = c.$webdriver$ = c.$webdriver$ || {}, e = Math.floor(Math.random() * goog.now()).toString(36);
  d[e] = a;
  a[e] = e;
  return this.executeScript(function(a) {
    var b = document.$webdriver$;
    if(!b) {
      return null
    }
    b = b[a];
    if(!b || b[a] !== a) {
      return[]
    }
    return[b]
  }, e).then(function(a) {
    b();
    if(a.length && !(a[0] instanceof webdriver.WebElement)) {
      throw Error("JS locator script result was not a WebElement");
    }
    return a
  }, b)
};
webdriver.WebDriver.prototype.isElementPresent = function(a) {
  return(a.nodeType === 1 && a.ownerDocument ? this.findDomElement_(a) : this.findElements.apply(this, arguments)).then(function(a) {
    return!!a.length
  })
};
goog.exportProperty(webdriver.WebDriver.prototype, "isElementPresent", webdriver.WebDriver.prototype.isElementPresent);
webdriver.WebDriver.prototype.findElements = function(a) {
  a = webdriver.Locator.checkLocator(a);
  if(a.using == "js") {
    var b = goog.array.slice(arguments, 1);
    goog.array.splice(b, 0, 0, a.value);
    return this.executeScript.apply(this, b).then(function(a) {
      if(a instanceof webdriver.WebElement) {
        return[a]
      }else {
        if(!goog.isArray(a)) {
          return[]
        }
      }
      return goog.array.filter(a, function(a) {
        return a instanceof webdriver.WebElement
      })
    })
  }else {
    return this.schedule((new webdriver.Command(webdriver.CommandName.FIND_ELEMENTS)).setParameter("using", a.using).setParameter("value", a.value), "WebDriver.findElements(" + a + ")")
  }
};
goog.exportProperty(webdriver.WebDriver.prototype, "findElements", webdriver.WebDriver.prototype.findElements);
webdriver.WebDriver.prototype.takeScreenshot = function() {
  return this.schedule(new webdriver.Command(webdriver.CommandName.SCREENSHOT), "WebDriver.takeScreenshot()")
};
goog.exportProperty(webdriver.WebDriver.prototype, "takeScreenshot", webdriver.WebDriver.prototype.takeScreenshot);
webdriver.WebDriver.prototype.manage = function() {
  return new webdriver.WebDriver.Options(this)
};
goog.exportProperty(webdriver.WebDriver.prototype, "manage", webdriver.WebDriver.prototype.manage);
webdriver.WebDriver.prototype.navigate = function() {
  return new webdriver.WebDriver.Navigation(this)
};
goog.exportProperty(webdriver.WebDriver.prototype, "navigate", webdriver.WebDriver.prototype.navigate);
webdriver.WebDriver.prototype.switchTo = function() {
  return new webdriver.WebDriver.TargetLocator(this)
};
goog.exportProperty(webdriver.WebDriver.prototype, "switchTo", webdriver.WebDriver.prototype.switchTo);
webdriver.WebDriver.Navigation = function(a) {
  this.driver_ = a
};
webdriver.WebDriver.Navigation.prototype.to = function(a) {
  return this.driver_.schedule((new webdriver.Command(webdriver.CommandName.GET)).setParameter("url", a), "WebDriver.navigate().to(" + a + ")")
};
goog.exportSymbol("webdriver.WebDriver.Navigation.prototype.to", webdriver.WebDriver.Navigation.prototype.to);
webdriver.WebDriver.Navigation.prototype.back = function() {
  return this.driver_.schedule(new webdriver.Command(webdriver.CommandName.GO_BACK), "WebDriver.navigate().back()")
};
goog.exportSymbol("webdriver.WebDriver.Navigation.prototype.back", webdriver.WebDriver.Navigation.prototype.back);
webdriver.WebDriver.Navigation.prototype.forward = function() {
  return this.driver_.schedule(new webdriver.Command(webdriver.CommandName.GO_FORWARD), "WebDriver.navigate().forward()")
};
goog.exportSymbol("webdriver.WebDriver.Navigation.prototype.forward", webdriver.WebDriver.Navigation.prototype.forward);
webdriver.WebDriver.Navigation.prototype.refresh = function() {
  return this.driver_.schedule(new webdriver.Command(webdriver.CommandName.REFRESH), "WebDriver.navigate().refresh()")
};
goog.exportSymbol("webdriver.WebDriver.Navigation.prototype.refresh", webdriver.WebDriver.Navigation.prototype.refresh);
webdriver.WebDriver.Options = function(a) {
  this.driver_ = a
};
webdriver.WebDriver.Options.prototype.addCookie = function(a, b, c, d, e) {
  if(/[;=]/.test(a)) {
    throw Error('Invalid cookie name "' + a + '"');
  }
  if(/;/.test(b)) {
    throw Error('Invalid cookie value "' + b + '"');
  }
  var f = a + "=" + b + (d ? ";domain=" + d : "") + (c ? ";path=" + c : "") + (e ? ";secure" : "");
  return this.driver_.schedule((new webdriver.Command(webdriver.CommandName.ADD_COOKIE)).setParameter("name", a).setParameter("value", b).setParameter("path", c).setParameter("domain", d).setParameter("secure", !!e), "WebDriver.manage().addCookie(" + f + ")")
};
goog.exportSymbol("webdriver.WebDriver.Options.prototype.addCookie", webdriver.WebDriver.Options.prototype.addCookie);
webdriver.WebDriver.Options.prototype.deleteAllCookies = function() {
  return this.driver_.schedule(new webdriver.Command(webdriver.CommandName.ADD_COOKIE), "WebDriver.manage().deleteAllCookies()")
};
goog.exportSymbol("webdriver.WebDriver.Options.prototype.deleteAllCookies", webdriver.WebDriver.Options.prototype.deleteAllCookies);
webdriver.WebDriver.Options.prototype.deleteCookie = function(a) {
  return this.driver_.schedule(new webdriver.Command(webdriver.CommandName.DELETE_COOKIE), "WebDriver.manage().deleteCookie(" + a + ")")
};
goog.exportSymbol("webdriver.WebDriver.Options.prototype.deleteCookie", webdriver.WebDriver.Options.prototype.deleteCookie);
webdriver.WebDriver.Options.prototype.getCookies = function() {
  return this.driver_.schedule(new webdriver.Command(webdriver.CommandName.GET_ALL_COOKIES), "WebDriver.manage().getCookies()")
};
goog.exportSymbol("webdriver.WebDriver.Options.prototype.getCookies", webdriver.WebDriver.Options.prototype.getCookies);
webdriver.WebDriver.Options.prototype.getCookie = function(a) {
  return this.getCookies().addCallback(function(b) {
    return goog.array.find(b, function(b) {
      return b && b.name == a
    })
  })
};
goog.exportSymbol("webdriver.WebDriver.Options.prototype.getCookie", webdriver.WebDriver.Options.prototype.getCookie);
webdriver.WebDriver.Options.prototype.timeouts = function() {
  return new webdriver.WebDriver.Timeouts(this.driver_)
};
goog.exportSymbol("webdriver.WebDriver.Options.prototype.timeouts", webdriver.WebDriver.Options.prototype.timeouts);
webdriver.WebDriver.Timeouts = function(a) {
  this.driver_ = a
};
webdriver.WebDriver.Timeouts.prototype.implicitlyWait = function(a) {
  return this.driver_.schedule((new webdriver.Command(webdriver.CommandName.IMPLICITLY_WAIT)).setParameter("ms", a < 0 ? 0 : a), "WebDriver.manage().timeouts().implicitlyWait(" + a + ")")
};
goog.exportSymbol("webdriver.WebDriver.Timeouts.prototype.implicitlyWait", webdriver.WebDriver.Timeouts.prototype.implicitlyWait);
webdriver.WebDriver.Timeouts.prototype.setScriptTimeout = function(a) {
  return this.driver_.schedule((new webdriver.Command(webdriver.CommandName.SET_SCRIPT_TIMEOUT)).setParameter("ms", a < 0 ? 0 : a), "WebDriver.manage().timeouts().setScriptTimeout(" + a + ")")
};
goog.exportSymbol("webdriver.WebDriver.Timeouts.prototype.setScriptTimeout", webdriver.WebDriver.Timeouts.prototype.setScriptTimeout);
webdriver.WebDriver.TargetLocator = function(a) {
  this.driver_ = a
};
webdriver.WebDriver.TargetLocator.prototype.activeElement = function() {
  var a = this.driver_.schedule(new webdriver.Command(webdriver.CommandName.GET_ACTIVE_ELEMENT), "WebDriver.switchTo().activeElement()");
  return new webdriver.WebElement(this.driver_, a)
};
goog.exportSymbol("webdriver.WebDriver.TargetLocator.prototype.activeElement", webdriver.WebDriver.TargetLocator.prototype.activeElement);
webdriver.WebDriver.TargetLocator.prototype.defaultContent = function() {
  return this.driver_.schedule((new webdriver.Command(webdriver.CommandName.SWITCH_TO_FRAME)).setParameter("id", null), "WebDriver.switchTo().defaultContent()")
};
goog.exportSymbol("webdriver.WebDriver.TargetLocator.prototype.defaultContent", webdriver.WebDriver.TargetLocator.prototype.defaultContent);
webdriver.WebDriver.TargetLocator.prototype.frame = function(a) {
  return this.driver_.schedule((new webdriver.Command(webdriver.CommandName.SWITCH_TO_FRAME)).setParameter("id", a), "WebDriver.switchTo().frame(" + a + ")")
};
goog.exportSymbol("webdriver.WebDriver.TargetLocator.prototype.frame", webdriver.WebDriver.TargetLocator.prototype.frame);
webdriver.WebDriver.TargetLocator.prototype.window = function(a) {
  return this.driver_.schedule((new webdriver.Command(webdriver.CommandName.SWITCH_TO_WINDOW)).setParameter("name", a), "WebDriver.switchTo().frame(" + a + ")")
};
goog.exportSymbol("webdriver.WebDriver.TargetLocator.prototype.window", webdriver.WebDriver.TargetLocator.prototype.window);
webdriver.Key = {NULL:"\ue000", CANCEL:"\ue001", HELP:"\ue002", BACK_SPACE:"\ue003", TAB:"\ue004", CLEAR:"\ue005", RETURN:"\ue006", ENTER:"\ue007", SHIFT:"\ue008", CONTROL:"\ue009", ALT:"\ue00a", PAUSE:"\ue00b", ESCAPE:"\ue00c", SPACE:"\ue00d", PAGE_UP:"\ue00e", PAGE_DOWN:"\ue00f", END:"\ue010", HOME:"\ue011", ARROW_LEFT:"\ue012", LEFT:"\ue012", ARROW_UP:"\ue013", UP:"\ue013", ARROW_RIGHT:"\ue014", RIGHT:"\ue014", ARROW_DOWN:"\ue015", DOWN:"\ue015", INSERT:"\ue016", DELETE:"\ue017", SEMICOLON:"\ue018", 
EQUALS:"\ue019", NUMPAD0:"\ue01a", NUMPAD1:"\ue01b", NUMPAD2:"\ue01c", NUMPAD3:"\ue01d", NUMPAD4:"\ue01e", NUMPAD5:"\ue01f", NUMPAD6:"\ue020", NUMPAD7:"\ue021", NUMPAD8:"\ue022", NUMPAD9:"\ue023", MULTIPLY:"\ue024", ADD:"\ue025", SEPARATOR:"\ue026", SUBTRACT:"\ue027", DECIMAL:"\ue028", DIVIDE:"\ue029", F1:"\ue031", F2:"\ue032", F3:"\ue033", F4:"\ue034", F5:"\ue035", F6:"\ue036", F7:"\ue037", F8:"\ue038", F9:"\ue039", F10:"\ue03a", F11:"\ue03b", F12:"\ue03c", COMMAND:"\ue03d", META:"\ue03d"};
goog.exportSymbol("webdriver.Key", webdriver.Key);
webdriver.Key.chord = function() {
  var a = goog.array.reduce(goog.array.slice(arguments, 0), function(a, c) {
    return a + c
  }, "");
  a += webdriver.Key.NULL;
  return a
};
goog.exportProperty(webdriver.Key, "chord", webdriver.Key.chord);
webdriver.WebElement = function(a, b) {
  webdriver.promise.Deferred.call(this);
  this.driver_ = a;
  var c = this, d = this.resolve, e = this.reject;
  delete this.promise;
  delete this.resolve;
  delete this.reject;
  this.id_ = webdriver.promise.when(b, function(a) {
    d(c);
    if(a instanceof webdriver.WebElement) {
      return a.id_
    }else {
      if(goog.isDef(a[webdriver.WebElement.ELEMENT_KEY])) {
        return a
      }
    }
    var b = {};
    b[webdriver.WebElement.ELEMENT_KEY] = a;
    return b
  }, e)
};
goog.inherits(webdriver.WebElement, webdriver.promise.Deferred);
webdriver.WebElement.ELEMENT_KEY = "ELEMENT";
goog.exportSymbol("webdriver.WebElement.ELEMENT_KEY", webdriver.WebElement.ELEMENT_KEY);
webdriver.WebElement.equals = function(a, b) {
  if(a == b) {
    return webdriver.promise.resolved(!0)
  }
  return webdriver.promise.fullyResolved([a.id_, b.id_]).then(function(c) {
    if(c[0][webdriver.WebElement.ELEMENT_KEY] == c[1][webdriver.WebElement.ELEMENT_KEY]) {
      return!0
    }
    c = new webdriver.Command(webdriver.CommandName.ELEMENT_EQUALS);
    c.setParameter("other", b);
    return a.schedule_(c, "webdriver.WebElement.equals()")
  })
};
webdriver.WebElement.prototype.getDriver = function() {
  return this.driver_
};
goog.exportSymbol("webdriver.WebElement.prototype.getDriver", webdriver.WebElement.prototype.getDriver);
webdriver.WebElement.prototype.toWireValue = function() {
  return this.id_
};
webdriver.WebElement.prototype.schedule_ = function(a, b) {
  a.setParameter("id", this.id_);
  return this.driver_.schedule(a, b)
};
webdriver.WebElement.prototype.findElement = function(a) {
  a = webdriver.Locator.checkLocator(a);
  if(a.using == "js") {
    return this.driver_.findElement.apply(this.driver_, arguments)
  }
  var b = this.schedule_((new webdriver.Command(webdriver.CommandName.FIND_CHILD_ELEMENT)).setParameter("using", a.using).setParameter("value", a.value), "WebElement.findElement(" + a + ")");
  return new webdriver.WebElement(this.driver_, b)
};
goog.exportSymbol("webdriver.WebElement.prototype.findElement", webdriver.WebElement.prototype.findElement);
webdriver.WebElement.prototype.isElementPresent = function(a) {
  a = webdriver.Locator.checkLocator(a);
  if(a.using == "js") {
    return this.driver_.isElementPresent.apply(this.driver_, arguments)
  }
  return this.findElements.apply(this, arguments).then(function(a) {
    return!!a.length
  })
};
goog.exportSymbol("webdriver.WebElement.prototype.isElementPresent", webdriver.WebElement.prototype.isElementPresent);
webdriver.WebElement.prototype.findElements = function(a) {
  a = webdriver.Locator.checkLocator(a);
  if(a.using == "js") {
    return this.driver_.findElements.apply(this.driver_, arguments)
  }
  return this.schedule_((new webdriver.Command(webdriver.CommandName.FIND_CHILD_ELEMENTS)).setParameter("using", a.using).setParameter("value", a.value), "WebElement.findElements(" + a + ")")
};
goog.exportSymbol("webdriver.WebElement.prototype.findElements", webdriver.WebElement.prototype.findElements);
webdriver.WebElement.prototype.click = function() {
  return this.schedule_(new webdriver.Command(webdriver.CommandName.CLICK_ELEMENT), "WebElement.click()")
};
goog.exportSymbol("webdriver.WebElement.prototype.click", webdriver.WebElement.prototype.click);
webdriver.WebElement.prototype.sendKeys = function() {
  var a = webdriver.promise.fullyResolved(goog.array.slice(arguments, 0)).then(function(a) {
    return goog.array.map(goog.array.slice(a, 0), function(a) {
      return a + ""
    })
  });
  return this.schedule_((new webdriver.Command(webdriver.CommandName.SEND_KEYS_TO_ELEMENT)).setParameter("value", a), "WebElement.sendKeys(" + a + ")")
};
goog.exportSymbol("webdriver.WebElement.prototype.sendKeys", webdriver.WebElement.prototype.sendKeys);
webdriver.WebElement.prototype.getTagName = function() {
  return this.schedule_(new webdriver.Command(webdriver.CommandName.GET_ELEMENT_TAG_NAME), "WebElement.getTagName()")
};
goog.exportSymbol("webdriver.WebElement.prototype.getTagName", webdriver.WebElement.prototype.getTagName);
webdriver.WebElement.prototype.getCssValue = function(a) {
  return this.schedule_((new webdriver.Command(webdriver.CommandName.GET_ELEMENT_VALUE_OF_CSS_PROPERTY)).setParameter("propertyName", a), "WebElement.getCssValue(" + a + ")")
};
goog.exportSymbol("webdriver.WebElement.prototype.getCssValue", webdriver.WebElement.prototype.getCssValue);
webdriver.WebElement.prototype.getAttribute = function(a) {
  return this.schedule_((new webdriver.Command(webdriver.CommandName.GET_ELEMENT_ATTRIBUTE)).setParameter("name", a), "WebElement.getAttribute(" + a + ")")
};
goog.exportSymbol("webdriver.WebElement.prototype.getAttribute", webdriver.WebElement.prototype.getAttribute);
webdriver.WebElement.prototype.getText = function() {
  return this.schedule_(new webdriver.Command(webdriver.CommandName.GET_ELEMENT_TEXT), "WebElement.getText()")
};
goog.exportSymbol("webdriver.WebElement.prototype.getText", webdriver.WebElement.prototype.getText);
webdriver.WebElement.prototype.getSize = function() {
  return this.schedule_(new webdriver.Command(webdriver.CommandName.GET_ELEMENT_SIZE), "WebElement.getSize()")
};
goog.exportSymbol("webdriver.WebElement.prototype.getSize", webdriver.WebElement.prototype.getSize);
webdriver.WebElement.prototype.getLocation = function() {
  return this.schedule_(new webdriver.Command(webdriver.CommandName.GET_ELEMENT_LOCATION), "WebElement.getLocation()")
};
goog.exportSymbol("webdriver.WebElement.prototype.getLocation", webdriver.WebElement.prototype.getLocation);
webdriver.WebElement.prototype.isEnabled = function() {
  return this.schedule_(new webdriver.Command(webdriver.CommandName.IS_ELEMENT_ENABLED), "WebElement.isEnabled()")
};
goog.exportSymbol("webdriver.WebElement.prototype.isEnabled", webdriver.WebElement.prototype.isEnabled);
webdriver.WebElement.prototype.isSelected = function() {
  return this.schedule_(new webdriver.Command(webdriver.CommandName.IS_ELEMENT_SELECTED), "WebElement.isSelected()")
};
goog.exportSymbol("webdriver.WebElement.prototype.isSelected", webdriver.WebElement.prototype.isSelected);
webdriver.WebElement.prototype.submit = function() {
  return this.schedule_(new webdriver.Command(webdriver.CommandName.SUBMIT_ELEMENT), "WebElement.submit()")
};
goog.exportSymbol("webdriver.WebElement.prototype.submit", webdriver.WebElement.prototype.submit);
webdriver.WebElement.prototype.clear = function() {
  return this.schedule_(new webdriver.Command(webdriver.CommandName.CLEAR_ELEMENT), "WebElement.clear()")
};
goog.exportSymbol("webdriver.WebElement.prototype.clear", webdriver.WebElement.prototype.clear);
webdriver.WebElement.prototype.isDisplayed = function() {
  return this.schedule_(new webdriver.Command(webdriver.CommandName.IS_ELEMENT_DISPLAYED), "WebElement.isDisplayed()")
};
goog.exportSymbol("webdriver.WebElement.prototype.isDisplayed", webdriver.WebElement.prototype.isDisplayed);
webdriver.WebElement.prototype.getOuterHtml = function() {
  return this.driver_.executeScript(function(a) {
    if("outerHTML" in a) {
      return a.outerHTML
    }else {
      var b = a.ownerDocument.createElement("div");
      b.appendChild(a.cloneNode(!0));
      return b.innerHTML
    }
  }, this)
};
goog.exportSymbol("webdriver.WebElement.prototype.getOuterHtml", webdriver.WebElement.prototype.getOuterHtml);
webdriver.WebElement.prototype.getInnerHtml = function() {
  return this.driver_.executeScript("return arguments[0].innerHTML", this)
};
goog.exportSymbol("webdriver.WebElement.prototype.getInnerHtml", webdriver.WebElement.prototype.getInnerHtml);
webdriver.http = {};
webdriver.http.Client = function() {
};
webdriver.http.Client.prototype.send = function() {
};
webdriver.http.Executor = function(a) {
  this.client_ = a
};
goog.exportSymbol("webdriver.http.Executor", webdriver.http.Executor);
webdriver.http.Executor.prototype.execute = function(a, b) {
  var c = webdriver.http.Executor.COMMAND_MAP_[a.getName()];
  if(!c) {
    throw Error("Unrecognized command: " + a.getName());
  }
  var d = a.getParameters(), e = webdriver.http.Executor.buildPath_(c.path, d);
  this.client_.send(new webdriver.http.Request(c.method, e, d), function(a, c) {
    var d;
    if(!a) {
      try {
        d = webdriver.http.Executor.parseHttpResponse_(c)
      }catch(e) {
        a = e
      }
    }
    b(a, d)
  })
};
webdriver.http.Executor.buildPath_ = function(a, b) {
  var c = a.match(/\/:(\w+)\b/g);
  if(c) {
    for(var d = 0;d < c.length;++d) {
      var e = c[d].substring(2);
      if(e in b) {
        var f = b[e];
        f && f.ELEMENT && (f = f.ELEMENT);
        a = a.replace(c[d], "/" + f);
        delete b[e]
      }else {
        throw Error("Missing required parameter: " + e);
      }
    }
  }
  return a
};
webdriver.http.Executor.parseHttpResponse_ = function(a) {
  try {
    return goog.json.parse(a.body)
  }catch(b) {
  }
  var c = {status:bot.ErrorCode.SUCCESS, value:a.body.replace(/\r\n/g, "\n")};
  a.status > 199 && a.status < 300 || (c.status = a.status == 404 ? bot.ErrorCode.UNKNOWN_COMMAND : bot.ErrorCode.UNKNOWN_ERROR);
  return c
};
webdriver.http.Executor.COMMAND_MAP_ = function() {
  function a(a) {
    return c("POST", a)
  }
  function b(a) {
    return c("GET", a)
  }
  function c(a, b) {
    return{method:a, path:b}
  }
  return(new function() {
    var a = {};
    this.put = function(b, c) {
      a[b] = c;
      return this
    };
    this.build = function() {
      return a
    }
  }).put(webdriver.CommandName.GET_SERVER_STATUS, b("/status")).put(webdriver.CommandName.NEW_SESSION, a("/session")).put(webdriver.CommandName.GET_SESSIONS, b("/sessions")).put(webdriver.CommandName.DESCRIBE_SESSION, b("/session/:sessionId")).put(webdriver.CommandName.QUIT, c("DELETE", "/session/:sessionId")).put(webdriver.CommandName.CLOSE, c("DELETE", "/session/:sessionId/window")).put(webdriver.CommandName.GET_CURRENT_WINDOW_HANDLE, b("/session/:sessionId/window_handle")).put(webdriver.CommandName.GET_WINDOW_HANDLES, 
  b("/session/:sessionId/window_handles")).put(webdriver.CommandName.GET_CURRENT_URL, b("/session/:sessionId/url")).put(webdriver.CommandName.GET, a("/session/:sessionId/url")).put(webdriver.CommandName.GO_BACK, a("/session/:sessionId/back")).put(webdriver.CommandName.GO_FORWARD, a("/session/:sessionId/forward")).put(webdriver.CommandName.REFRESH, a("/session/:sessionId/refresh")).put(webdriver.CommandName.ADD_COOKIE, a("/session/:sessionId/cookie")).put(webdriver.CommandName.GET_ALL_COOKIES, b("/session/:sessionId/cookie")).put(webdriver.CommandName.DELETE_ALL_COOKIES, 
  c("DELETE", "/session/:sessionId/cookie")).put(webdriver.CommandName.DELETE_COOKIE, c("DELETE", "/session/:sessionId/cookie/:name")).put(webdriver.CommandName.FIND_ELEMENT, a("/session/:sessionId/element")).put(webdriver.CommandName.FIND_ELEMENTS, a("/session/:sessionId/elements")).put(webdriver.CommandName.GET_ACTIVE_ELEMENT, a("/session/:sessionId/element/active")).put(webdriver.CommandName.FIND_CHILD_ELEMENT, a("/session/:sessionId/element/:id/element")).put(webdriver.CommandName.FIND_CHILD_ELEMENTS, 
  a("/session/:sessionId/element/:id/elements")).put(webdriver.CommandName.CLEAR_ELEMENT, a("/session/:sessionId/element/:id/clear")).put(webdriver.CommandName.CLICK_ELEMENT, a("/session/:sessionId/element/:id/click")).put(webdriver.CommandName.SEND_KEYS_TO_ELEMENT, a("/session/:sessionId/element/:id/value")).put(webdriver.CommandName.SUBMIT_ELEMENT, a("/session/:sessionId/element/:id/submit")).put(webdriver.CommandName.GET_ELEMENT_TEXT, b("/session/:sessionId/element/:id/text")).put(webdriver.CommandName.GET_ELEMENT_TAG_NAME, 
  b("/session/:sessionId/element/:id/name")).put(webdriver.CommandName.IS_ELEMENT_SELECTED, b("/session/:sessionId/element/:id/selected")).put(webdriver.CommandName.IS_ELEMENT_ENABLED, b("/session/:sessionId/element/:id/enabled")).put(webdriver.CommandName.IS_ELEMENT_DISPLAYED, b("/session/:sessionId/element/:id/displayed")).put(webdriver.CommandName.GET_ELEMENT_LOCATION, b("/session/:sessionId/element/:id/location")).put(webdriver.CommandName.GET_ELEMENT_SIZE, b("/session/:sessionId/element/:id/size")).put(webdriver.CommandName.GET_ELEMENT_ATTRIBUTE, 
  b("/session/:sessionId/element/:id/attribute/:name")).put(webdriver.CommandName.GET_ELEMENT_VALUE_OF_CSS_PROPERTY, b("/session/:sessionId/element/:id/css/:propertyName")).put(webdriver.CommandName.ELEMENT_EQUALS, b("/session/:sessionId/element/:id/equals/:other")).put(webdriver.CommandName.SWITCH_TO_WINDOW, a("/session/:sessionId/window")).put(webdriver.CommandName.SWITCH_TO_FRAME, a("/session/:sessionId/frame")).put(webdriver.CommandName.GET_PAGE_SOURCE, b("/session/:sessionId/source")).put(webdriver.CommandName.GET_TITLE, 
  b("/session/:sessionId/title")).put(webdriver.CommandName.EXECUTE_SCRIPT, a("/session/:sessionId/execute")).put(webdriver.CommandName.EXECUTE_ASYNC_SCRIPT, a("/session/:sessionId/execute_async")).put(webdriver.CommandName.SCREENSHOT, b("/session/:sessionId/screenshot")).put(webdriver.CommandName.SET_SCRIPT_TIMEOUT, a("/session/:sessionId/timeouts/async_script")).put(webdriver.CommandName.IMPLICITLY_WAIT, a("/session/:sessionId/timeouts/implicit_wait")).build()
}();
webdriver.http.headersToString_ = function(a) {
  var b = [], c;
  for(c in a) {
    b.push(c + ": " + a[c])
  }
  return b.join("\n")
};
webdriver.http.Request = function(a, b, c) {
  this.method = a;
  this.path = b;
  this.data = c || {};
  this.headers = {Accept:"application/json; charset=utf-8"}
};
webdriver.http.Request.prototype.toString = function() {
  return[this.method + " " + this.path + " HTTP/1.1", webdriver.http.headersToString_(this.headers), "", goog.json.serialize(this.data)].join("\n")
};
webdriver.http.Response = function(a, b, c) {
  this.status = a;
  this.body = c;
  this.headers = {};
  for(var d in b) {
    this.headers[d.toLowerCase()] = b[d]
  }
};
webdriver.http.Response.fromXmlHttpRequest = function(a) {
  var b = {};
  if(a.getAllResponseHeaders) {
    var c = a.getAllResponseHeaders();
    c && (c = c.replace(/\r\n/g, "\n").split("\n"), goog.array.forEach(c, function(a) {
      a = a.split(/\s*:\s*/, 2);
      a[0] && (b[a[0]] = a[1] || "")
    }))
  }
  return new webdriver.http.Response(a.status, b, a.responseText.replace(/\0/g, ""))
};
webdriver.http.Response.prototype.toString = function() {
  var a = webdriver.http.headersToString_(this.headers), b = ["HTTP/1.1 " + this.status, a];
  a && b.push("");
  this.body && b.push(this.body);
  return b.join("\n")
};
webdriver.http.CorsClient = function(a) {
  if(!webdriver.http.CorsClient.isAvailable()) {
    throw Error("The current environment does not support cross-origin resource sharing");
  }
  this.url_ = a + webdriver.http.CorsClient.XDRPC_ENDPOINT
};
goog.exportSymbol("webdriver.http.CorsClient", webdriver.http.CorsClient);
webdriver.http.CorsClient.XDRPC_ENDPOINT = "/xdrpc";
webdriver.http.CorsClient.isAvailable = function() {
  return typeof XDomainRequest !== "undefined" || typeof XMLHttpRequest !== "undefined" && goog.isBoolean((new XMLHttpRequest).withCredentials)
};
webdriver.http.CorsClient.prototype.send = function(a, b) {
  try {
    var c = new (typeof XDomainRequest !== "undefined" ? XDomainRequest : XMLHttpRequest);
    c.open("POST", this.url_, !0);
    c.onload = function() {
      b(null, webdriver.http.Response.fromXmlHttpRequest(c))
    };
    var d = this.url_;
    c.onerror = function() {
      b(Error(["Unable to send request: POST ", d, "\nPerhaps the server did not respond to the preflight request with valid access control headers?"].join("")))
    };
    c.send(goog.json.serialize({method:a.method, path:a.path, data:a.data}))
  }catch(e) {
    b(e)
  }
};
goog.structs = {};
goog.structs.getCount = function(a) {
  if(typeof a.getCount == "function") {
    return a.getCount()
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return a.length
  }
  return goog.object.getCount(a)
};
goog.structs.getValues = function(a) {
  if(typeof a.getValues == "function") {
    return a.getValues()
  }
  if(goog.isString(a)) {
    return a.split("")
  }
  if(goog.isArrayLike(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return goog.object.getValues(a)
};
goog.structs.getKeys = function(a) {
  if(typeof a.getKeys == "function") {
    return a.getKeys()
  }
  if(typeof a.getValues != "function") {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      for(var b = [], a = a.length, c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return goog.object.getKeys(a)
  }
};
goog.structs.contains = function(a, b) {
  if(typeof a.contains == "function") {
    return a.contains(b)
  }
  if(typeof a.containsValue == "function") {
    return a.containsValue(b)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.contains(a, b)
  }
  return goog.object.containsValue(a, b)
};
goog.structs.isEmpty = function(a) {
  if(typeof a.isEmpty == "function") {
    return a.isEmpty()
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.isEmpty(a)
  }
  return goog.object.isEmpty(a)
};
goog.structs.clear = function(a) {
  typeof a.clear == "function" ? a.clear() : goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a)
};
goog.structs.forEach = function(a, b, c) {
  if(typeof a.forEach == "function") {
    a.forEach(b, c)
  }else {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      goog.array.forEach(a, b, c)
    }else {
      for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
        b.call(c, e[g], d && d[g], a)
      }
    }
  }
};
goog.structs.filter = function(a, b, c) {
  if(typeof a.filter == "function") {
    return a.filter(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.filter(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      b.call(c, f[h], e[h], a) && (d[e[h]] = f[h])
    }
  }else {
    d = [];
    for(h = 0;h < g;h++) {
      b.call(c, f[h], void 0, a) && d.push(f[h])
    }
  }
  return d
};
goog.structs.map = function(a, b, c) {
  if(typeof a.map == "function") {
    return a.map(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.map(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      d[e[h]] = b.call(c, f[h], e[h], a)
    }
  }else {
    d = [];
    for(h = 0;h < g;h++) {
      d[h] = b.call(c, f[h], void 0, a)
    }
  }
  return d
};
goog.structs.some = function(a, b, c) {
  if(typeof a.some == "function") {
    return a.some(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.some(a, b, c)
  }
  for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if(b.call(c, e[g], d && d[g], a)) {
      return!0
    }
  }
  return!1
};
goog.structs.every = function(a, b, c) {
  if(typeof a.every == "function") {
    return a.every(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.every(a, b, c)
  }
  for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if(!b.call(c, e[g], d && d[g], a)) {
      return!1
    }
  }
  return!0
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function() {
  return this
};
goog.iter.toIterator = function(a) {
  if(a instanceof goog.iter.Iterator) {
    return a
  }
  if(typeof a.__iterator__ == "function") {
    return a.__iterator__(!1)
  }
  if(goog.isArrayLike(a)) {
    var b = 0, c = new goog.iter.Iterator;
    c.next = function() {
      for(;;) {
        if(b >= a.length) {
          throw goog.iter.StopIteration;
        }
        if(b in a) {
          return a[b++]
        }else {
          b++
        }
      }
    };
    return c
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(a, b, c) {
  if(goog.isArrayLike(a)) {
    try {
      goog.array.forEach(a, b, c)
    }catch(d) {
      if(d !== goog.iter.StopIteration) {
        throw d;
      }
    }
  }else {
    a = goog.iter.toIterator(a);
    try {
      for(;;) {
        b.call(c, a.next(), void 0, a)
      }
    }catch(e) {
      if(e !== goog.iter.StopIteration) {
        throw e;
      }
    }
  }
};
goog.iter.filter = function(a, b, c) {
  var a = goog.iter.toIterator(a), d = new goog.iter.Iterator;
  d.next = function() {
    for(;;) {
      var d = a.next();
      if(b.call(c, d, void 0, a)) {
        return d
      }
    }
  };
  return d
};
goog.iter.range = function(a, b, c) {
  var d = 0, e = a, f = c || 1;
  arguments.length > 1 && (d = a, e = b);
  if(f == 0) {
    throw Error("Range step argument must not be zero");
  }
  var g = new goog.iter.Iterator;
  g.next = function() {
    if(f > 0 && d >= e || f < 0 && d <= e) {
      throw goog.iter.StopIteration;
    }
    var a = d;
    d += f;
    return a
  };
  return g
};
goog.iter.join = function(a, b) {
  return goog.iter.toArray(a).join(b)
};
goog.iter.map = function(a, b, c) {
  var a = goog.iter.toIterator(a), d = new goog.iter.Iterator;
  d.next = function() {
    for(;;) {
      var d = a.next();
      return b.call(c, d, void 0, a)
    }
  };
  return d
};
goog.iter.reduce = function(a, b, c, d) {
  var e = c;
  goog.iter.forEach(a, function(a) {
    e = b.call(d, e, a)
  });
  return e
};
goog.iter.some = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(b.call(c, a.next(), void 0, a)) {
        return!0
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!1
};
goog.iter.every = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(!b.call(c, a.next(), void 0, a)) {
        return!1
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!0
};
goog.iter.chain = function() {
  var a = arguments, b = a.length, c = 0, d = new goog.iter.Iterator;
  d.next = function() {
    try {
      if(c >= b) {
        throw goog.iter.StopIteration;
      }
      return goog.iter.toIterator(a[c]).next()
    }catch(d) {
      if(d !== goog.iter.StopIteration || c >= b) {
        throw d;
      }else {
        return c++, this.next()
      }
    }
  };
  return d
};
goog.iter.dropWhile = function(a, b, c) {
  var a = goog.iter.toIterator(a), d = new goog.iter.Iterator, e = !0;
  d.next = function() {
    for(;;) {
      var d = a.next();
      if(!e || !b.call(c, d, void 0, a)) {
        return e = !1, d
      }
    }
  };
  return d
};
goog.iter.takeWhile = function(a, b, c) {
  var a = goog.iter.toIterator(a), d = new goog.iter.Iterator, e = !0;
  d.next = function() {
    for(;;) {
      if(e) {
        var d = a.next();
        if(b.call(c, d, void 0, a)) {
          return d
        }else {
          e = !1
        }
      }else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return d
};
goog.iter.toArray = function(a) {
  if(goog.isArrayLike(a)) {
    return goog.array.toArray(a)
  }
  var a = goog.iter.toIterator(a), b = [];
  goog.iter.forEach(a, function(a) {
    b.push(a)
  });
  return b
};
goog.iter.equals = function(a, b) {
  var a = goog.iter.toIterator(a), b = goog.iter.toIterator(b), c, d;
  try {
    for(;;) {
      c = d = !1;
      var e = a.next();
      c = !0;
      var f = b.next();
      d = !0;
      if(e != f) {
        break
      }
    }
  }catch(g) {
    if(g !== goog.iter.StopIteration) {
      throw g;
    }else {
      if(c && !d) {
        return!1
      }
      if(!d) {
        try {
          b.next()
        }catch(h) {
          if(h !== goog.iter.StopIteration) {
            throw h;
          }
          return!0
        }
      }
    }
  }
  return!1
};
goog.iter.nextOrValue = function(a, b) {
  try {
    return goog.iter.toIterator(a).next()
  }catch(c) {
    if(c != goog.iter.StopIteration) {
      throw c;
    }
    return b
  }
};
goog.iter.product = function() {
  if(goog.array.some(arguments, function(a) {
    return!a.length
  }) || !arguments.length) {
    return new goog.iter.Iterator
  }
  var a = new goog.iter.Iterator, b = arguments, c = goog.array.repeat(0, b.length);
  a.next = function() {
    if(c) {
      for(var a = goog.array.map(c, function(a, c) {
        return b[c][a]
      }), e = c.length - 1;e >= 0;e--) {
        goog.asserts.assert(c);
        if(c[e] < b[e].length - 1) {
          c[e]++;
          break
        }
        if(e == 0) {
          c = null;
          break
        }
        c[e] = 0
      }
      return a
    }
    throw goog.iter.StopIteration;
  };
  return a
};
goog.iter.cycle = function(a) {
  var b = goog.iter.toIterator(a), c = [], d = 0, a = new goog.iter.Iterator, e = !1;
  a.next = function() {
    var a = null;
    if(!e) {
      try {
        return a = b.next(), c.push(a), a
      }catch(g) {
        if(g != goog.iter.StopIteration || goog.array.isEmpty(c)) {
          throw g;
        }
        e = !0
      }
    }
    a = c[d];
    d = (d + 1) % c.length;
    return a
  };
  return a
};
goog.structs.Map = function(a) {
  this.map_ = {};
  if(goog.structs.Map.PRESERVE_NON_STRING_KEYS) {
    this.numericKeyMap_ = {}
  }
  var b = arguments.length;
  if(b > 1) {
    if(b % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var c = 0;c < b;c += 2) {
      this.set(arguments[c], arguments[c + 1])
    }
  }else {
    a && this.addAll(a)
  }
};
goog.structs.Map.PRESERVE_NON_STRING_KEYS = !0;
goog.structs.Map.KEY_PREFIX = ":";
goog.structs.Map.prototype.count_ = 0;
goog.structs.Map.prototype.version_ = 0;
goog.structs.Map.prototype.getCount = function() {
  return this.count_
};
goog.structs.Map.prototype.getValues = function() {
  var a = [], b;
  for(b in this.map_) {
    goog.structs.Map.isKey_(b) && a.push(this.map_[b])
  }
  return a
};
goog.structs.Map.prototype.getKeys = function() {
  var a = [], b;
  for(b in this.map_) {
    goog.structs.Map.isKey_(b) && a.push(this.getKey_(b))
  }
  return a
};
goog.structs.Map.prototype.containsKey = function(a) {
  return goog.structs.Map.makeKey_(a) in this.map_
};
goog.structs.Map.prototype.containsValue = function(a) {
  for(var b in this.map_) {
    if(goog.structs.Map.isKey_(b) && this.map_[b] == a) {
      return!0
    }
  }
  return!1
};
goog.structs.Map.prototype.equals = function(a, b) {
  if(this === a) {
    return!0
  }
  if(this.count_ != a.getCount()) {
    return!1
  }
  var c = b || goog.structs.Map.defaultEquals, d;
  for(d in this.map_) {
    if(d = this.getKey_(d), !c(this.get(d), a.get(d))) {
      return!1
    }
  }
  return!0
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
  return this.count_ == 0
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = 0;
  if(goog.structs.Map.PRESERVE_NON_STRING_KEYS) {
    this.numericKeyMap_ = {}
  }
};
goog.structs.Map.prototype.remove = function(a) {
  a = goog.structs.Map.makeKey_(a);
  if(goog.object.remove(this.map_, a)) {
    return goog.structs.Map.PRESERVE_NON_STRING_KEYS && delete this.numericKeyMap_[a], this.count_--, this.version_++, !0
  }
  return!1
};
goog.structs.Map.prototype.get = function(a, b) {
  var c = goog.structs.Map.makeKey_(a);
  if(c in this.map_) {
    return this.map_[c]
  }
  return b
};
goog.structs.Map.prototype.set = function(a, b) {
  var c = goog.structs.Map.makeKey_(a);
  c in this.map_ || (this.version_++, this.count_++, goog.structs.Map.PRESERVE_NON_STRING_KEYS && goog.isNumber(a) && (this.numericKeyMap_[c] = !0));
  this.map_[c] = b
};
goog.structs.Map.prototype.addAll = function(a) {
  var b;
  a instanceof goog.structs.Map ? (b = a.getKeys(), a = a.getValues()) : (b = goog.object.getKeys(a), a = goog.object.getValues(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
  var a = new goog.structs.Map, b;
  for(b in this.map_) {
    a.set(this.map_[b], this.getKey_(b))
  }
  return a
};
goog.structs.Map.prototype.toObject = function() {
  var a = {}, b;
  for(b in this.map_) {
    goog.structs.Map.isKey_(b) && (a[this.getKey_(b)] = this.map_[b])
  }
  return a
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0)
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(!1)
};
goog.structs.Map.prototype.__iterator__ = function(a) {
  var b = 0, c = this.getKeys(), d = this.map_, e = this.version_, f = this, g = new goog.iter.Iterator;
  g.next = function() {
    for(;;) {
      if(e != f.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if(b >= c.length) {
        throw goog.iter.StopIteration;
      }
      var g = c[b++];
      return a ? g : d[goog.structs.Map.makeKey_(g)]
    }
  };
  return g
};
goog.structs.Map.prototype.getKey_ = function(a) {
  var b = a.substring(1);
  return goog.structs.Map.PRESERVE_NON_STRING_KEYS ? this.numericKeyMap_[a] ? Number(b) : b : b
};
goog.structs.Map.isKey_ = function(a) {
  return a.charAt(0) == goog.structs.Map.KEY_PREFIX
};
goog.structs.Map.makeKey_ = function(a) {
  return goog.structs.Map.KEY_PREFIX + a
};
goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.QueryArray = {};
goog.uri.utils.QueryValue = {};
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(a, b, c, d, e, f, g) {
  var h = [];
  a && h.push(a, ":");
  c && (h.push("//"), b && h.push(b, "@"), h.push(c), d && h.push(":", d));
  e && h.push(e);
  f && h.push("?", f);
  g && h.push("#", g);
  return h.join("")
};
goog.uri.utils.splitRe_ = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(a) {
  return a.match(goog.uri.utils.splitRe_)
};
goog.uri.utils.decodeIfPossible_ = function(a) {
  return a && decodeURIComponent(a)
};
goog.uri.utils.getComponentByIndex_ = function(a, b) {
  return goog.uri.utils.split(b)[a] || null
};
goog.uri.utils.getScheme = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, a)
};
goog.uri.utils.getUserInfoEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, a)
};
goog.uri.utils.getUserInfo = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(a))
};
goog.uri.utils.getDomainEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, a)
};
goog.uri.utils.getDomain = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(a))
};
goog.uri.utils.getPort = function(a) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, a)) || null
};
goog.uri.utils.getPathEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, a)
};
goog.uri.utils.getPath = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(a))
};
goog.uri.utils.getQueryData = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, a)
};
goog.uri.utils.getFragmentEncoded = function(a) {
  var b = a.indexOf("#");
  return b < 0 ? null : a.substr(b + 1)
};
goog.uri.utils.setFragmentEncoded = function(a, b) {
  return goog.uri.utils.removeFragment(a) + (b ? "#" + b : "")
};
goog.uri.utils.getFragment = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(a))
};
goog.uri.utils.getHost = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(a[goog.uri.utils.ComponentIndex.SCHEME], a[goog.uri.utils.ComponentIndex.USER_INFO], a[goog.uri.utils.ComponentIndex.DOMAIN], a[goog.uri.utils.ComponentIndex.PORT])
};
goog.uri.utils.getPathAndAfter = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, a[goog.uri.utils.ComponentIndex.PATH], a[goog.uri.utils.ComponentIndex.QUERY_DATA], a[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.removeFragment = function(a) {
  var b = a.indexOf("#");
  return b < 0 ? a : a.substr(0, b)
};
goog.uri.utils.haveSameDomain = function(a, b) {
  var c = goog.uri.utils.split(a), d = goog.uri.utils.split(b);
  return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.SCHEME] == d[goog.uri.utils.ComponentIndex.SCHEME] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(a) {
  if(goog.DEBUG && (a.indexOf("#") >= 0 || a.indexOf("?") >= 0)) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not supported: [" + a + "]");
  }
};
goog.uri.utils.appendQueryData_ = function(a) {
  if(a[1]) {
    var b = a[0], c = b.indexOf("#");
    c >= 0 && (a.push(b.substr(c)), a[0] = b = b.substr(0, c));
    c = b.indexOf("?");
    c < 0 ? a[1] = "?" : c == b.length - 1 && (a[1] = void 0)
  }
  return a.join("")
};
goog.uri.utils.appendKeyValuePairs_ = function(a, b, c) {
  if(goog.isArray(b)) {
    for(var d = 0;d < b.length;d++) {
      c.push("&", a), b[d] !== "" && c.push("=", goog.string.urlEncode(b[d]))
    }
  }else {
    b != null && (c.push("&", a), b !== "" && c.push("=", goog.string.urlEncode(b)))
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(a, b, c) {
  goog.asserts.assert(Math.max(b.length - (c || 0), 0) % 2 == 0, "goog.uri.utils: Key/value lists must be even in length.");
  for(c = c || 0;c < b.length;c += 2) {
    goog.uri.utils.appendKeyValuePairs_(b[c], b[c + 1], a)
  }
  return a
};
goog.uri.utils.buildQueryData = function(a, b) {
  var c = goog.uri.utils.buildQueryDataBuffer_([], a, b);
  c[0] = "";
  return c.join("")
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(a, b) {
  for(var c in b) {
    goog.uri.utils.appendKeyValuePairs_(c, b[c], a)
  }
  return a
};
goog.uri.utils.buildQueryDataFromMap = function(a) {
  a = goog.uri.utils.buildQueryDataBufferFromMap_([], a);
  a[0] = "";
  return a.join("")
};
goog.uri.utils.appendParams = function(a) {
  return goog.uri.utils.appendQueryData_(arguments.length == 2 ? goog.uri.utils.buildQueryDataBuffer_([a], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([a], arguments, 1))
};
goog.uri.utils.appendParamsFromMap = function(a, b) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([a], b))
};
goog.uri.utils.appendParam = function(a, b, c) {
  return goog.uri.utils.appendQueryData_([a, "&", b, "=", goog.string.urlEncode(c)])
};
goog.uri.utils.findParam_ = function(a, b, c, d) {
  for(var e = c.length;(b = a.indexOf(c, b)) >= 0 && b < d;) {
    var f = a.charCodeAt(b - 1);
    if(f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.QUESTION) {
      if(f = a.charCodeAt(b + e), !f || f == goog.uri.utils.CharCode_.EQUAL || f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.HASH) {
        return b
      }
    }
    b += e + 1
  }
  return-1
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(a, b) {
  return goog.uri.utils.findParam_(a, 0, b, a.search(goog.uri.utils.hashOrEndRe_)) >= 0
};
goog.uri.utils.getParamValue = function(a, b) {
  var c = a.search(goog.uri.utils.hashOrEndRe_), d = goog.uri.utils.findParam_(a, 0, b, c);
  if(d < 0) {
    return null
  }else {
    var e = a.indexOf("&", d);
    if(e < 0 || e > c) {
      e = c
    }
    d += b.length + 1;
    return goog.string.urlDecode(a.substr(d, e - d))
  }
};
goog.uri.utils.getParamValues = function(a, b) {
  for(var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = [];(e = goog.uri.utils.findParam_(a, d, b, c)) >= 0;) {
    d = a.indexOf("&", e);
    if(d < 0 || d > c) {
      d = c
    }
    e += b.length + 1;
    f.push(goog.string.urlDecode(a.substr(e, d - e)))
  }
  return f
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(a, b) {
  for(var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = [];(e = goog.uri.utils.findParam_(a, d, b, c)) >= 0;) {
    f.push(a.substring(d, e)), d = Math.min(a.indexOf("&", e) + 1 || c, c)
  }
  f.push(a.substr(d));
  return f.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1")
};
goog.uri.utils.setParam = function(a, b, c) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(a, b), b, c)
};
goog.uri.utils.appendPath = function(a, b) {
  goog.uri.utils.assertNoFragmentsOrQueries_(a);
  goog.string.endsWith(a, "/") && (a = a.substr(0, a.length - 1));
  goog.string.startsWith(b, "/") && (b = b.substr(1));
  return goog.string.buildString(a, "/", b)
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(a) {
  return goog.uri.utils.setParam(a, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString())
};
goog.Uri = function(a, b) {
  var c;
  a instanceof goog.Uri ? (this.setIgnoreCase(b == null ? a.getIgnoreCase() : b), this.setScheme(a.getScheme()), this.setUserInfo(a.getUserInfo()), this.setDomain(a.getDomain()), this.setPort(a.getPort()), this.setPath(a.getPath()), this.setQueryData(a.getQueryData().clone()), this.setFragment(a.getFragment())) : a && (c = goog.uri.utils.split(String(a))) ? (this.setIgnoreCase(!!b), this.setScheme(c[goog.uri.utils.ComponentIndex.SCHEME] || "", !0), this.setUserInfo(c[goog.uri.utils.ComponentIndex.USER_INFO] || 
  "", !0), this.setDomain(c[goog.uri.utils.ComponentIndex.DOMAIN] || "", !0), this.setPort(c[goog.uri.utils.ComponentIndex.PORT]), this.setPath(c[goog.uri.utils.ComponentIndex.PATH] || "", !0), this.setQuery(c[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", !0), this.setFragment(c[goog.uri.utils.ComponentIndex.FRAGMENT] || "", !0)) : (this.setIgnoreCase(!!b), this.queryData_ = new goog.Uri.QueryData(null, this, this.ignoreCase_))
};
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.scheme_ = "";
goog.Uri.prototype.userInfo_ = "";
goog.Uri.prototype.domain_ = "";
goog.Uri.prototype.port_ = null;
goog.Uri.prototype.path_ = "";
goog.Uri.prototype.fragment_ = "";
goog.Uri.prototype.isReadOnly_ = !1;
goog.Uri.prototype.ignoreCase_ = !1;
goog.Uri.prototype.toString = function() {
  if(this.cachedToString_) {
    return this.cachedToString_
  }
  var a = [];
  this.scheme_ && a.push(goog.Uri.encodeSpecialChars_(this.scheme_, goog.Uri.reDisallowedInSchemeOrUserInfo_), ":");
  this.domain_ && (a.push("//"), this.userInfo_ && a.push(goog.Uri.encodeSpecialChars_(this.userInfo_, goog.Uri.reDisallowedInSchemeOrUserInfo_), "@"), a.push(goog.Uri.encodeString_(this.domain_)), this.port_ != null && a.push(":", String(this.getPort())));
  this.path_ && (this.hasDomain() && this.path_.charAt(0) != "/" && a.push("/"), a.push(goog.Uri.encodeSpecialChars_(this.path_, this.path_.charAt(0) == "/" ? goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_)));
  var b = String(this.queryData_);
  b && a.push("?", b);
  this.fragment_ && a.push("#", goog.Uri.encodeSpecialChars_(this.fragment_, goog.Uri.reDisallowedInFragment_));
  return this.cachedToString_ = a.join("")
};
goog.Uri.prototype.resolve = function(a) {
  var b = this.clone(), c = a.hasScheme();
  c ? b.setScheme(a.getScheme()) : c = a.hasUserInfo();
  c ? b.setUserInfo(a.getUserInfo()) : c = a.hasDomain();
  c ? b.setDomain(a.getDomain()) : c = a.hasPort();
  var d = a.getPath();
  if(c) {
    b.setPort(a.getPort())
  }else {
    if(c = a.hasPath()) {
      if(d.charAt(0) != "/") {
        if(this.hasDomain() && !this.hasPath()) {
          d = "/" + d
        }else {
          var e = b.getPath().lastIndexOf("/");
          e != -1 && (d = b.getPath().substr(0, e + 1) + d)
        }
      }
      d = goog.Uri.removeDotSegments(d)
    }
  }
  c ? b.setPath(d) : c = a.hasQuery();
  c ? b.setQuery(a.getDecodedQuery()) : c = a.hasFragment();
  c && b.setFragment(a.getFragment());
  return b
};
goog.Uri.prototype.clone = function() {
  return goog.Uri.create(this.scheme_, this.userInfo_, this.domain_, this.port_, this.path_, this.queryData_.clone(), this.fragment_, this.ignoreCase_)
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_
};
goog.Uri.prototype.setScheme = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  if(this.scheme_ = b ? goog.Uri.decodeOrEmpty_(a) : a) {
    this.scheme_ = this.scheme_.replace(/:$/, "")
  }
  return this
};
goog.Uri.prototype.hasScheme = function() {
  return!!this.scheme_
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_
};
goog.Uri.prototype.setUserInfo = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.userInfo_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasUserInfo = function() {
  return!!this.userInfo_
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_
};
goog.Uri.prototype.setDomain = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.domain_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasDomain = function() {
  return!!this.domain_
};
goog.Uri.prototype.getPort = function() {
  return this.port_
};
goog.Uri.prototype.setPort = function(a) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  if(a) {
    a = Number(a);
    if(isNaN(a) || a < 0) {
      throw Error("Bad port number " + a);
    }
    this.port_ = a
  }else {
    this.port_ = null
  }
  return this
};
goog.Uri.prototype.hasPort = function() {
  return this.port_ != null
};
goog.Uri.prototype.getPath = function() {
  return this.path_
};
goog.Uri.prototype.setPath = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.path_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasPath = function() {
  return!!this.path_
};
goog.Uri.prototype.hasQuery = function() {
  return this.queryData_.toString() !== ""
};
goog.Uri.prototype.setQueryData = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  a instanceof goog.Uri.QueryData ? (this.queryData_ = a, this.queryData_.uri_ = this, this.queryData_.setIgnoreCase(this.ignoreCase_)) : (b || (a = goog.Uri.encodeSpecialChars_(a, goog.Uri.reDisallowedInQuery_)), this.queryData_ = new goog.Uri.QueryData(a, this, this.ignoreCase_));
  return this
};
goog.Uri.prototype.setQuery = function(a, b) {
  return this.setQueryData(a, b)
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString()
};
goog.Uri.prototype.getDecodedQuery = function() {
  return this.queryData_.toDecodedString()
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_
};
goog.Uri.prototype.getQuery = function() {
  return this.getEncodedQuery()
};
goog.Uri.prototype.setParameterValue = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.queryData_.set(a, b);
  return this
};
goog.Uri.prototype.setParameterValues = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  goog.isArray(b) || (b = [String(b)]);
  this.queryData_.setValues(a, b);
  return this
};
goog.Uri.prototype.getParameterValues = function(a) {
  return this.queryData_.getValues(a)
};
goog.Uri.prototype.getParameterValue = function(a) {
  return this.queryData_.get(a)
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_
};
goog.Uri.prototype.setFragment = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.fragment_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasFragment = function() {
  return!!this.fragment_
};
goog.Uri.prototype.hasSameDomainAs = function(a) {
  return(!this.hasDomain() && !a.hasDomain() || this.getDomain() == a.getDomain()) && (!this.hasPort() && !a.hasPort() || this.getPort() == a.getPort())
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this
};
goog.Uri.prototype.removeParameter = function(a) {
  this.enforceReadOnly();
  this.queryData_.remove(a);
  return this
};
goog.Uri.prototype.setReadOnly = function(a) {
  this.isReadOnly_ = a;
  return this
};
goog.Uri.prototype.isReadOnly = function() {
  return this.isReadOnly_
};
goog.Uri.prototype.enforceReadOnly = function() {
  if(this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.setIgnoreCase = function(a) {
  this.ignoreCase_ = a;
  this.queryData_ && this.queryData_.setIgnoreCase(a);
  return this
};
goog.Uri.prototype.getIgnoreCase = function() {
  return this.ignoreCase_
};
goog.Uri.parse = function(a, b) {
  return a instanceof goog.Uri ? a.clone() : new goog.Uri(a, b)
};
goog.Uri.create = function(a, b, c, d, e, f, g, h) {
  h = new goog.Uri(null, h);
  a && h.setScheme(a);
  b && h.setUserInfo(b);
  c && h.setDomain(c);
  d && h.setPort(d);
  e && h.setPath(e);
  f && h.setQueryData(f);
  g && h.setFragment(g);
  return h
};
goog.Uri.resolve = function(a, b) {
  a instanceof goog.Uri || (a = goog.Uri.parse(a));
  b instanceof goog.Uri || (b = goog.Uri.parse(b));
  return a.resolve(b)
};
goog.Uri.removeDotSegments = function(a) {
  if(a == ".." || a == ".") {
    return""
  }else {
    if(!goog.string.contains(a, "./") && !goog.string.contains(a, "/.")) {
      return a
    }else {
      for(var b = goog.string.startsWith(a, "/"), a = a.split("/"), c = [], d = 0;d < a.length;) {
        var e = a[d++];
        e == "." ? b && d == a.length && c.push("") : e == ".." ? ((c.length > 1 || c.length == 1 && c[0] != "") && c.pop(), b && d == a.length && c.push("")) : (c.push(e), b = !0)
      }
      return c.join("/")
    }
  }
};
goog.Uri.decodeOrEmpty_ = function(a) {
  return a ? decodeURIComponent(a) : ""
};
goog.Uri.encodeString_ = function(a) {
  if(goog.isString(a)) {
    return encodeURIComponent(a)
  }
  return null
};
goog.Uri.encodeSpecialRegExp_ = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
goog.Uri.encodeSpecialChars_ = function(a, b) {
  var c = null;
  goog.isString(a) && (c = a, goog.Uri.encodeSpecialRegExp_.test(c) || (c = encodeURI(a)), c.search(b) >= 0 && (c = c.replace(b, goog.Uri.encodeChar_)));
  return c
};
goog.Uri.encodeChar_ = function(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(a, b) {
  var c = goog.uri.utils.split(a), d = goog.uri.utils.split(b);
  return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.Uri.QueryData = function(a, b, c) {
  this.encodedQuery_ = a || null;
  this.uri_ = b || null;
  this.ignoreCase_ = !!c
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if(!this.keyMap_ && (this.keyMap_ = new goog.structs.Map, this.count_ = 0, this.encodedQuery_)) {
    for(var a = this.encodedQuery_.split("&"), b = 0;b < a.length;b++) {
      var c = a[b].indexOf("="), d = null, e = null;
      c >= 0 ? (d = a[b].substring(0, c), e = a[b].substring(c + 1)) : d = a[b];
      d = goog.string.urlDecode(d);
      d = this.getKeyName_(d);
      this.add(d, e ? goog.string.urlDecode(e) : "")
    }
  }
};
goog.Uri.QueryData.createFromMap = function(a, b, c) {
  var d = goog.structs.getKeys(a);
  if(typeof d == "undefined") {
    throw Error("Keys are undefined");
  }
  return goog.Uri.QueryData.createFromKeysValues(d, goog.structs.getValues(a), b, c)
};
goog.Uri.QueryData.createFromKeysValues = function(a, b, c, d) {
  if(a.length != b.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  c = new goog.Uri.QueryData(null, c, d);
  for(d = 0;d < a.length;d++) {
    c.add(a[d], b[d])
  }
  return c
};
goog.Uri.QueryData.prototype.keyMap_ = null;
goog.Uri.QueryData.prototype.count_ = null;
goog.Uri.QueryData.decodedQuery_ = null;
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_
};
goog.Uri.QueryData.prototype.add = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  a = this.getKeyName_(a);
  if(this.containsKey(a)) {
    var c = this.keyMap_.get(a);
    goog.isArray(c) ? c.push(b) : this.keyMap_.set(a, [c, b])
  }else {
    this.keyMap_.set(a, b)
  }
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.remove = function(a) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  if(this.keyMap_.containsKey(a)) {
    this.invalidateCache_();
    var b = this.keyMap_.get(a);
    goog.isArray(b) ? this.count_ -= b.length : this.count_--;
    return this.keyMap_.remove(a)
  }
  return!1
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_ && this.keyMap_.clear();
  this.count_ = 0
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return this.count_ == 0
};
goog.Uri.QueryData.prototype.containsKey = function(a) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  return this.keyMap_.containsKey(a)
};
goog.Uri.QueryData.prototype.containsValue = function(a) {
  var b = this.getValues();
  return goog.array.contains(b, a)
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  for(var a = this.keyMap_.getValues(), b = this.keyMap_.getKeys(), c = [], d = 0;d < b.length;d++) {
    var e = a[d];
    if(goog.isArray(e)) {
      for(var f = 0;f < e.length;f++) {
        c.push(b[d])
      }
    }else {
      c.push(b[d])
    }
  }
  return c
};
goog.Uri.QueryData.prototype.getValues = function(a) {
  this.ensureKeyMapInitialized_();
  if(a) {
    if(a = this.getKeyName_(a), this.containsKey(a)) {
      var b = this.keyMap_.get(a);
      if(goog.isArray(b)) {
        return b
      }else {
        a = [], a.push(b)
      }
    }else {
      a = []
    }
  }else {
    for(var b = this.keyMap_.getValues(), a = [], c = 0;c < b.length;c++) {
      var d = b[c];
      goog.isArray(d) ? goog.array.extend(a, d) : a.push(d)
    }
  }
  return a
};
goog.Uri.QueryData.prototype.set = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  a = this.getKeyName_(a);
  if(this.containsKey(a)) {
    var c = this.keyMap_.get(a);
    goog.isArray(c) ? this.count_ -= c.length : this.count_--
  }
  this.keyMap_.set(a, b);
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.get = function(a, b) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  if(this.containsKey(a)) {
    var c = this.keyMap_.get(a);
    return goog.isArray(c) ? c[0] : c
  }else {
    return b
  }
};
goog.Uri.QueryData.prototype.setValues = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  a = this.getKeyName_(a);
  if(this.containsKey(a)) {
    var c = this.keyMap_.get(a);
    goog.isArray(c) ? this.count_ -= c.length : this.count_--
  }
  b.length > 0 && (this.keyMap_.set(a, b), this.count_ += b.length)
};
goog.Uri.QueryData.prototype.toString = function() {
  if(this.encodedQuery_) {
    return this.encodedQuery_
  }
  if(!this.keyMap_) {
    return""
  }
  for(var a = [], b = 0, c = this.keyMap_.getKeys(), d = 0;d < c.length;d++) {
    var e = c[d], f = goog.string.urlEncode(e), e = this.keyMap_.get(e);
    if(goog.isArray(e)) {
      for(var g = 0;g < e.length;g++) {
        b > 0 && a.push("&"), a.push(f), e[g] !== "" && a.push("=", goog.string.urlEncode(e[g])), b++
      }
    }else {
      b > 0 && a.push("&"), a.push(f), e !== "" && a.push("=", goog.string.urlEncode(e)), b++
    }
  }
  return this.encodedQuery_ = a.join("")
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
  if(!this.decodedQuery_) {
    this.decodedQuery_ = goog.Uri.decodeOrEmpty_(this.toString())
  }
  return this.decodedQuery_
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  delete this.decodedQuery_;
  delete this.encodedQuery_;
  this.uri_ && delete this.uri_.cachedToString_
};
goog.Uri.QueryData.prototype.filterKeys = function(a) {
  this.ensureKeyMapInitialized_();
  goog.structs.forEach(this.keyMap_, function(b, c) {
    goog.array.contains(a, c) || this.remove(c)
  }, this);
  return this
};
goog.Uri.QueryData.prototype.clone = function() {
  var a = new goog.Uri.QueryData;
  if(this.decodedQuery_) {
    a.decodedQuery_ = this.decodedQuery_
  }
  if(this.encodedQuery_) {
    a.encodedQuery_ = this.encodedQuery_
  }
  if(this.keyMap_) {
    a.keyMap_ = this.keyMap_.clone()
  }
  return a
};
goog.Uri.QueryData.prototype.getKeyName_ = function(a) {
  a = String(a);
  this.ignoreCase_ && (a = a.toLowerCase());
  return a
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(a) {
  a && !this.ignoreCase_ && (this.ensureKeyMapInitialized_(), this.invalidateCache_(), goog.structs.forEach(this.keyMap_, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.add(d, a))
  }, this));
  this.ignoreCase_ = a
};
goog.Uri.QueryData.prototype.extend = function() {
  for(var a = 0;a < arguments.length;a++) {
    goog.structs.forEach(arguments[a], function(a, c) {
      this.add(c, a)
    }, this)
  }
};
webdriver.process = {};
webdriver.process.isNative = function() {
  return webdriver.process.IS_NATIVE_PROCESS_
};
goog.exportSymbol("webdriver.process.isNative", webdriver.process.isNative);
webdriver.process.getEnv = function(a, b) {
  var c = webdriver.process.PROCESS_.env[a];
  return goog.isDefAndNotNull(c) ? c : b
};
goog.exportSymbol("webdriver.process.getEnv", webdriver.process.getEnv);
webdriver.process.setEnv = function(a, b) {
  webdriver.process.PROCESS_.env[a] = goog.isDefAndNotNull(b) ? b + "" : null
};
goog.exportSymbol("webdriver.process.setEnv", webdriver.process.setEnv);
webdriver.process.IS_NATIVE_PROCESS_ = typeof process !== "undefined";
webdriver.process.initBrowserProcess_ = function(a) {
  var b = {env:{}};
  !a && typeof window != "undefined" && (a = window);
  if(a && a.location) {
    var c = (new goog.Uri(a.location)).getQueryData();
    goog.array.forEach(c.getKeys(), function(a) {
      var e = c.getValues(a);
      b.env[a] = e.length == 0 ? "" : e.length == 1 ? e[0] : goog.json.serialize(e)
    })
  }
  return b
};
webdriver.process.PROCESS_ = webdriver.process.IS_NATIVE_PROCESS_ ? process : webdriver.process.initBrowserProcess_();
webdriver.node = {};
webdriver.node.toSource = function() {
  return function(a) {
    webdriver.node.checkIsNative_();
    webdriver.node.source_ ? a(null, webdriver.node.source_) : require("fs").readFile(__filename, "utf-8", function(b, c) {
      a(b, webdriver.node.source_ = c)
    })
  }
}();
goog.exportSymbol("webdriver.node.toSource", webdriver.node.toSource);
webdriver.node.parseUrl_ = function(a) {
  return require("url").parse(a)
};
webdriver.node.checkIsNative_ = function() {
  if(!webdriver.process.isNative()) {
    throw Error("This operation/object may not be used in a non-native environment");
  }
};
webdriver.node.HttpClient = function(a) {
  webdriver.node.checkIsNative_();
  a = webdriver.node.parseUrl_(a);
  if(!a.hostname) {
    throw Error("Invalid server URL: " + a);
  }
  this.options_ = {host:a.hostname, path:a.pathname || "/", port:a.port}
};
goog.exportSymbol("webdriver.node.HttpClient", webdriver.node.HttpClient);
webdriver.node.HttpClient.prototype.send = function(a, b) {
  var c;
  a.headers["Content-Length"] = 0;
  if(a.method == "POST" || a.method == "PUT") {
    c = JSON.stringify(a.data), a.headers["Content-Length"] = c.length
  }
  webdriver.node.HttpClient.sendRequest_({method:a.method, host:this.options_.host, port:this.options_.port, path:this.options_.path + a.path, headers:a.headers}, b, c)
};
webdriver.node.HttpClient.sendRequest_ = function(a, b, c) {
  var d = require("http").request(a, function(c) {
    if(c.statusCode == 302 || c.statusCode == 303) {
      var f = webdriver.node.parseUrl_(c.headers.location);
      if(!f.hostname) {
        f.hostname = a.host, f.port = a.port
      }
      d.abort();
      webdriver.node.HttpClient.sendRequest_({method:"GET", host:f.hostname, path:f.pathname + (f.search || ""), port:f.port, headers:{Accept:"application/json"}}, b)
    }else {
      var g = [];
      c.on("data", g.push.bind(g));
      c.on("end", function() {
        var a = new webdriver.http.Response(c.statusCode, c.headers, g.join("").replace(/\0/g, ""));
        b(null, a)
      })
    }
  });
  d.on("error", function(a) {
    b(Error("Unable to send request: " + a.message))
  });
  c && d.write(c);
  d.end()
};
webdriver.Builder = function() {
  this.serverUrl_ = webdriver.process.getEnv(webdriver.Builder.SERVER_URL_ENV);
  this.sessionId_ = webdriver.process.getEnv(webdriver.Builder.SESSION_ID_ENV);
  this.capabilities_ = {}
};
goog.exportSymbol("webdriver.Builder", webdriver.Builder);
webdriver.Builder.SESSION_ID_ENV = "wdsid";
goog.exportProperty(webdriver.Builder, "SESSION_ID_ENV", webdriver.Builder.SESSION_ID_ENV);
webdriver.Builder.SERVER_URL_ENV = "wdurl";
goog.exportProperty(webdriver.Builder, "SERVER_URL_ENV", webdriver.Builder.SERVER_URL_ENV);
webdriver.Builder.prototype.usingServer = function(a) {
  this.serverUrl_ = a;
  return this
};
goog.exportProperty(webdriver.Builder.prototype, "usingServer", webdriver.Builder.prototype.usingServer);
webdriver.Builder.prototype.usingSession = function(a) {
  this.sessionId_ = a;
  return this
};
goog.exportProperty(webdriver.Builder.prototype, "usingSession", webdriver.Builder.prototype.usingSession);
webdriver.Builder.prototype.withCapabilities = function(a) {
  this.capabilities_ = a;
  return this
};
goog.exportProperty(webdriver.Builder.prototype, "withCapabilities", webdriver.Builder.prototype.withCapabilities);
webdriver.Builder.prototype.build = function() {
  var a;
  if(webdriver.FirefoxDomExecutor.isAvailable()) {
    return a = new webdriver.FirefoxDomExecutor, webdriver.WebDriver.createSession(a, this.capabilities_)
  }else {
    if(!this.serverUrl_) {
      throw Error("The remote WebDriver server URL has not been specified.");
    }
    a = new (webdriver.process.isNative() ? webdriver.node.HttpClient : webdriver.http.CorsClient)(this.serverUrl_);
    a = new webdriver.http.Executor(a);
    if(this.sessionId_) {
      return webdriver.WebDriver.attachToSession(a, this.sessionId_)
    }else {
      if(webdriver.process.isNative()) {
        return webdriver.WebDriver.createSession(a, this.capabilities_)
      }else {
        throw Error("Unable to create a new client for this browser. The WebDriver session ID has not been defined.");
      }
    }
  }
};
goog.exportProperty(webdriver.Builder.prototype, "build", webdriver.Builder.prototype.build);
goog.net = {};
goog.net.XmlHttpFactory = function() {
};
goog.net.XmlHttpFactory.prototype.cachedOptions_ = null;
goog.net.XmlHttpFactory.prototype.getOptions = function() {
  return this.cachedOptions_ || (this.cachedOptions_ = this.internalGetOptions())
};
goog.net.WrapperXmlHttpFactory = function(a, b) {
  goog.net.XmlHttpFactory.call(this);
  this.xhrFactory_ = a;
  this.optionsFactory_ = b
};
goog.inherits(goog.net.WrapperXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.WrapperXmlHttpFactory.prototype.createInstance = function() {
  return this.xhrFactory_()
};
goog.net.WrapperXmlHttpFactory.prototype.getOptions = function() {
  return this.optionsFactory_()
};
goog.net.XmlHttp = function() {
  return goog.net.XmlHttp.factory_.createInstance()
};
goog.net.XmlHttp.getOptions = function() {
  return goog.net.XmlHttp.factory_.getOptions()
};
goog.net.XmlHttp.OptionType = {USE_NULL_FUNCTION:0, LOCAL_REQUEST_ERROR:1};
goog.net.XmlHttp.ReadyState = {UNINITIALIZED:0, LOADING:1, LOADED:2, INTERACTIVE:3, COMPLETE:4};
goog.net.XmlHttp.setFactory = function(a, b) {
  goog.net.XmlHttp.setGlobalFactory(new goog.net.WrapperXmlHttpFactory(a, b))
};
goog.net.XmlHttp.setGlobalFactory = function(a) {
  goog.net.XmlHttp.factory_ = a
};
goog.net.DefaultXmlHttpFactory = function() {
  goog.net.XmlHttpFactory.call(this)
};
goog.inherits(goog.net.DefaultXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function() {
  var a = this.getProgId_();
  return a ? new ActiveXObject(a) : new XMLHttpRequest
};
goog.net.DefaultXmlHttpFactory.prototype.internalGetOptions = function() {
  var a = {};
  this.getProgId_() && (a[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = !0, a[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = !0);
  return a
};
goog.net.DefaultXmlHttpFactory.prototype.ieProgId_ = null;
goog.net.DefaultXmlHttpFactory.prototype.getProgId_ = function() {
  if(!this.ieProgId_ && typeof XMLHttpRequest == "undefined" && typeof ActiveXObject != "undefined") {
    for(var a = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], b = 0;b < a.length;b++) {
      var c = a[b];
      try {
        return new ActiveXObject(c), this.ieProgId_ = c
      }catch(d) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return this.ieProgId_
};
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory);
webdriver.http.XhrClient = function(a) {
  this.url_ = a
};
webdriver.http.XhrClient.prototype.send = function(a, b) {
  try {
    var c = new goog.net.XmlHttp, d = this.url_ + a.path;
    c.open(a.method, d, !0);
    c.onload = function() {
      b(null, webdriver.http.Response.fromXmlHttpRequest(c))
    };
    c.onerror = function() {
      b(Error(["Unable to send request: ", a.method, " ", d, "\nOriginal request:\n", a].join("")))
    };
    for(var e in a.headers) {
      c.setRequestHeader(e, a.headers[e])
    }
    c.send(goog.json.serialize(a.data))
  }catch(f) {
    b(f)
  }
};
;for (var key in this.webdriver) this[key] = this.webdriver[key]; delete this.webdriver;}).call(typeof exports !== 'undefined' && exports == this ? exports : this.webdriver = this.webdriver || {})
