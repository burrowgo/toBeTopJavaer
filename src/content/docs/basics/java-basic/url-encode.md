---
title: "Url Encode"
---

The network standard RFC 1738 makes a rigid rule: only letters and numbers [0-9a-zA-Z], some special symbols "$-_.+!*'()," [not including double quotes], and certain reserved words can be used directly in a URL without encoding.

Other characters cannot be displayed in a URL, so when encountering such characters, such as Chinese characters, they need to be encoded.

Therefore, the process of converting a URL with special characters into a displayable URL is called URL encoding.

Conversely, it is called decoding.

URL encoding can use different methods, such as escape, URLEncode, or encodeURIComponent.