import { SniffedMessage } from "../interfaces";

export default (callback: (msg: SniffedMessage) => unknown): void => {
  browser.runtime.onConnect.addListener((port) => {
    if (port.name === "gdonkey-ws-sniffer") {
      port.onMessage.addListener((msg) => {
        if (!port.sender?.tab)
          throw new Error("Incorrectly set tabs permission");
        callback(<SniffedMessage>{ tabId: port.sender.tab.id, ...msg });
      });
    }
  });
};
