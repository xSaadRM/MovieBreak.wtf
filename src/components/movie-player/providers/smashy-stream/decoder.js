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

const yTeRfThR = function (x) {
  try {
    var a;
    a = x.substr(2);
    for (var i = 4; i > -1; i--) {
      if (exist(v["bk" + i])) {
        if (v["bk" + i] !== "") {
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
    return a;
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

var exist = function (x) {
  return x !== null && typeof x !== "undefined" && x !== "undefined";
};

export default SmashyStreamDecoder;
