import { describe, expect, it } from "vitest";
import { esWebview, navegadorInterno } from "./webview";

const UA = {
  tiktokAndroid:
    "Mozilla/5.0 (Linux; Android 13; SM-A536E Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.163 Mobile Safari/537.36 trill_320304 JsSdk/1.0 NetType/WIFI Channel/googleplay AppName/musical_ly app_version/32.3.4 ByteLocale/es ByteFullLocale/es Region/PE BytedanceWebview/d8a21c6",
  tiktokIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_32.5.0 JsSdk/2.0 NetType/4G Channel/App Store ByteLocale/es Region/PE isDarkMode/0 WKWebView/1 BytedanceWebview/d8a21c6",
  instagram:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 307.0.2.21.110 (iPhone14,7; iOS 17_0; es_PE; es; scale=3.00; 1170x2532; 532094658)",
  facebook:
    "Mozilla/5.0 (Linux; Android 12; moto g(60) Build/S2RIS32.32-20-7; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.5993.111 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/439.0.0.44.117;]",
  chrome:
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  safari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
};

describe("navegadorInterno", () => {
  it("detecta TikTok en Android y iPhone", () => {
    expect(navegadorInterno(UA.tiktokAndroid)).toBe("tiktok");
    expect(navegadorInterno(UA.tiktokIphone)).toBe("tiktok");
  });
  it("detecta Instagram y Facebook", () => {
    expect(navegadorInterno(UA.instagram)).toBe("instagram");
    expect(navegadorInterno(UA.facebook)).toBe("facebook");
  });
  it("Chrome y Safari no son webview", () => {
    expect(esWebview(UA.chrome)).toBe(false);
    expect(esWebview(UA.safari)).toBe(false);
  });
});
