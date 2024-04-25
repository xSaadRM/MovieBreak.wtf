import React from "react";

const SmashyCaptcha = () => {
  return (
    <div className="captcha" bis_skin_checked="1">
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
          bis_skin_checked="1"
        >
          <div style={{ width: "304px", height: "78px" }} bis_skin_checked="1">
            <div bis_skin_checked="1">
              <iframe
                title="reCAPTCHA"
                width="304"
                height="78"
                role="presentation"
                name="a-nsullqzfowl1"
                frameBorder="0"
                scrolling="no"
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation allow-modals allow-popups-to-escape-sandbox allow-storage-access-by-user-activation"
                src="https://www.google.com/recaptcha/api2/anchor?ar=1&amp;k=6LdZdrcpAAAAAD7nU4Lz9cV2Xb0vpMf1Ficv3YEn&amp;co=aHR0cHM6Ly9lbWJlZC5zbWFzaHlzdHJlYW0uY29tOjQ0Mw..&amp;hl=en&amp;v=QoukH5jSO3sKFzVEA7Vc8VgC&amp;size=normal&amp;cb=4ed3l75fbnqj"
                bis_size='{"x":204,"y":569,"w":243,"h":62,"abs_x":204,"abs_y":569}'
              ></iframe>
            </div>
            <textarea
              id="g-recaptcha-response"
              name="g-recaptcha-response"
              className="g-recaptcha-response"
              style={{
                width: "250px",
                height: "40px",
                border: "1px solid rgb(193, 193, 193)",
                margin: "10px 25px",
                padding: "0px",
                resize: "none",
                display: "none",
              }}
            ></textarea>
          </div>
          <iframe style={{ display: "none" }}></iframe>
        </div>
      </form>
      <script src="https://www.google.com/recaptcha/api.js"></script>
    </div>
  );
};

export default SmashyCaptcha;
