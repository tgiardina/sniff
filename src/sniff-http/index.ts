import { SniffedMessage } from "../interfaces";

export function sniffHttp(callback: (msg: SniffedMessage) => unknown): void {
  browser.webRequest.onBeforeRequest.addListener(
    (details) => {
      const filter = browser.webRequest.filterResponseData(details.requestId);
      const decoder = new TextDecoder("utf-8");
      const encoder = new TextEncoder();
      const data: string[] = [];
      filter.ondata = (event) => {
        data.push(decoder.decode(event.data, { stream: true }));
      };
      filter.onstop = () => {
        try {
          data.push(decoder.decode());
          const json = data.join("");
          callback({
            data: json,
            srcUrl: details.originUrl,
            targetUrl: details.url,
            tabId: details.tabId,
          });
          filter.write(encoder.encode(json));
          filter.close();
        } catch (err) {
          console.log(`sniffHttp threw ${err}`);
        }
      };
    },
    { urls: ["<all_urls>"], types: ["xmlhttprequest"] },
    ["blocking"]
  );
}
