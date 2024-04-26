import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

const SmashyCaptcha = () => {
  const captchaPassed = (token) => {
    document.querySelector("#recaptcha-form").submit();
  };

  return (
    <div className="captcha">
      Captcha here
      <form
        method="POST"
        id="recaptcha-form"
        action="https://embed.smashystream.com/getplayer.php"
      >
        <ReCAPTCHA
          sitekey="6LfNg8cpAAAAAMCkaImQhsMWN2UzJr-Q-DSoZ_FF"
          onChange={captchaPassed}
        />
      </form>
    </div>
  );
};

export default SmashyCaptcha;
