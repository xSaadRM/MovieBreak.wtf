import React, { useEffect } from "react";

const SmashyCaptcha = () => {

  useEffect(() => {
    (function () {
      if (!document.body) return;
      var js =
        "window['__CF$cv$params']={r:'87a26fa7aba737cc',t:'MTcxNDA5MTEzMi4zODUwMDA='};_cpo=document.createElement('script');_cpo.nonce='',_cpo.src='https://embed.smashystream.com/cdn-cgi/challenge-platform/scripts/jsd/main.js',document.getElementsByTagName('head')[0].appendChild(_cpo);";
      var _0xh = document.createElement("iframe");
      _0xh.height = 1;
      _0xh.width = 1;
      _0xh.style.position = "absolute";
      _0xh.style.top = 0;
      _0xh.style.left = 0;
      _0xh.style.border = "none";
      _0xh.style.visibility = "hidden";
      document.body.appendChild(_0xh);
      function handler() {
        var _0xi = _0xh.contentDocument || _0xh.contentWindow.document;
        if (_0xi) {
          var _0xj = _0xi.createElement("script");
          _0xj.innerHTML = js;
          _0xi.getElementsByTagName("head")[0].appendChild(_0xj);
        }
      }
      if (document.readyState !== "loading") {
        handler();
      } else if (window.addEventListener) {
        document.addEventListener("DOMContentLoaded", handler);
      } else {
        var prev = document.onreadystatechange || function () {};
        document.onreadystatechange = function (e) {
          prev(e);
          if (document.readyState !== "loading") {
            document.onreadystatechange = prev;
            handler();
          }
        };
      }
    })();
  }, []);

  return (
    <div className="captcha">
      Captcha here
      <form
        method="POST"
        id="recaptcha-form"
        action="https://embed.smashystream.com/getplayer.php"
      >
        <div
          className="g-recaptcha"
          data-sitekey="6LdZdrcpAAAAAD7nU4Lz9cV2Xb0vpMf1Ficv3YEn"
          data-callback="captchaPassed"
        ></div>
      </form>
    </div>
  );
};

export default SmashyCaptcha;
