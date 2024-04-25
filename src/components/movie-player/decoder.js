const SmashyStreamDecoder = (url) => {
  const v_enc2 = "2";
  if (url.indexOf("#" + v_enc2) === 0) {
    try {
      return yTeRfThR(url); // Return the result of yTeRfThR function
    } catch (error) {
      console.error("Error decoding URL:", error);
      return null; // Return null if an error occurs
    }
  } else {
    console.warn("URL is not encoded");
    return url;
  }
};

// Rest of the code...

const yTeRfThR = function (x) {
  try {
    var a;
    a = x.substr(2);
    for (var i = 4; i > -1; i--) {
      if (exist(v["bk" + i])) {
        if (v["bk" + i] != "") {
          a = a.replace(v.file3_separator + b1(v["bk" + i]), "");
        }
      }
    }
    try {
      a = b2(a);
    } catch (e) {
      a = "";
    }
    function b1(str) {
      return btoa(
        encodeURIComponent(str).replace(
          /%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode("0x" + p1);
          }
        )
      );
    }
    function b2(str) {
      return decodeURIComponent(
        atob(str)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    }
    return a; // Return the plain string
  } catch (error) {
    console.error("Error in yTeRfThR:", error.message);
    return null; // Return null or handle the error accordingly
  }
};
var v = {
  file_separator: ",",
  file2_separator: ";",
  file3_separator: "//",
  bk0: "SFL/dU7B/Dlx",
  bk1: "0ca/BVoI/NS9",
  bk2: "box/2SI/ZSFc",
  bk3: "Hbt/WFjB/7GW",
  bk4: "xNv/T08/z7F3",
};
var decode = function (x) {
  try {
    if (x.substr(0, 2) === "#1") {
      return salt_d(pepper(x.substr(2), -1));
    } else if (x.substr(0, 2) === "#0") {
      return salt_d(x.substr(2));
    } else {
      return x;
    }
  } catch (error) {
    console.error("Error in decode:", error);
    throw error;
  }
};
const _keyStr = abc + "0123456789+/=";
var abc = String.fromCharCode(
  65,
  66,
  67,
  68,
  69,
  70,
  71,
  72,
  73,
  74,
  75,
  76,
  77,
  97,
  98,
  99,
  100,
  101,
  102,
  103,
  104,
  105,
  106,
  107,
  108,
  109,
  78,
  79,
  80,
  81,
  82,
  83,
  84,
  85,
  86,
  87,
  88,
  89,
  90,
  110,
  111,
  112,
  113,
  114,
  115,
  116,
  117,
  118,
  119,
  120,
  121,
  122
);
const salt_ud = function (e) {
  var t = "";
  var n = 0;
  var r = 0;
  var c1 = 0;
  var c2 = 0;
  let c3;
  while (n < e.length) {
    r = e.charCodeAt(n);
    if (r < 128) {
      t += dechar(r);
      n++;
    } else if (r > 191 && r < 224) {
      c2 = e.charCodeAt(n + 1);
      t += dechar(((r & 31) << 6) | (c2 & 63));
      n += 2;
    } else {
      c2 = e.charCodeAt(n + 1);
      c3 = e.charCodeAt(n + 2);
      t += dechar(((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      n += 3;
    }
  }
  return t;
};
const salt_d = function (e) {
  var t = "";
  var n, r, i;
  var s, o, u, a;
  var f = 0;
  e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  while (f < e.length) {
    s = _keyStr.indexOf(e.charAt(f++));
    o = _keyStr.indexOf(e.charAt(f++));
    u = _keyStr.indexOf(e.charAt(f++));
    a = _keyStr.indexOf(e.charAt(f++));
    n = (s << 2) | (o >> 4);
    r = ((o & 15) << 4) | (u >> 2);
    i = ((u & 3) << 6) | a;
    t = t + dechar(n);
    if (u != 64) {
      t = t + dechar(r);
    }
    if (a != 64) {
      t = t + dechar(i);
    }
  }
  t = salt_ud(t);
  return t;
};
var dechar = function (x) {
  return String.fromCharCode(x);
};
var pepper = function (s, n) {
  s = s.replace(/\+/g, "#");
  s = s.replace(/#/g, "+");
  var a = sugar(o_y) * n;
  if (n < 0) a += abc.length / 2;
  var r = abc.substr(a * 2) + abc.substr(0, a * 2);
  return s.replace(/[A-Za-z]/g, function (c) {
    return r.charAt(abc.indexOf(c));
  });
};
var sugar = function (x) {
  x = x.split(dechar(61));
  var result = "";
  var c1 = dechar(120);
  var chr;
  for (var i in x) {
    if (x.hasOwnProperty(i)) {
      var encoded = "";
      for (var j in x[i]) {
        if (x[i].hasOwnProperty(j)) {
          encoded += x[i][j] == c1 ? dechar(49) : dechar(48);
        }
      }
      chr = parseInt(encoded, 2);
      result += dechar(chr.toString(10));
    }
  }
  return result.substr(0, result.length - 1);
};
const o_y = "xx??x?=xx????=";

var exist = function (x) {
  return x != null && typeof x != "undefined" && x != "undefined";
};

export default SmashyStreamDecoder;
