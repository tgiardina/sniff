/**
 * https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
 */

// @ts-nocheck
export default (): void => {
  const sniffer = `(${() => {
    const OgWebSocket = window.WebSocket;
    const callWebSocket = OgWebSocket.apply.bind(OgWebSocket);
    let wsAddListener = OgWebSocket.prototype.addEventListener;
    wsAddListener = wsAddListener.call.bind(wsAddListener);
    window.WebSocket = function WebSocket(url, protocols, ...args) {
      let ws;
      if (!(this instanceof WebSocket)) {
        ws = callWebSocket(this, args);
      } else if (arguments.length === 1) {
        ws = new OgWebSocket(url);
      } else if (arguments.length >= 2) {
        ws = new OgWebSocket(url, protocols);
      } else {
        ws = new OgWebSocket();
      }
      wsAddListener(ws, "message", function (event) {
        window.postMessage({
          id: "gdonkey-injected-ws-sniffer",
          json: event.data,
          targetUrl: url,
        });
      });
      return ws;
    }.bind();
    window.WebSocket.prototype = OgWebSocket.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;

    let wsSend = OgWebSocket.prototype.send;
    wsSend = wsSend.apply.bind(wsSend);
    OgWebSocket.prototype.send = function (...args) {
      return wsSend(this, args);
    };
  }})()`;

  const port = browser.runtime.connect({ name: "gdonkey-ws-sniffer" });
  window.addEventListener("message", (event) => {
    if (event.data.id === "gdonkey-injected-ws-sniffer") {
      port.postMessage({
        data: event.data.json,
        srcUrl: window.location.href,
        targetUrl: event.data.targetUrl,
      });
    }
  });

  const script = document.createElement("script");
  script.textContent = sniffer;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
};
