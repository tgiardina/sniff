import { SniffedMessage } from "../interfaces";

export default (callback: (msg: SniffedMessage) => unknown): void => {
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "gdonkey-ws-sniffer") {
      port.onMessage.addListener((msg, meta) => {
        meta.sender = <chrome.runtime.MessageSender>meta.sender;
        if (!meta.sender.tab)
          throw new Error("Incorrectly set tabs permission");
        callback(<SniffedMessage>{ tabId: meta.sender.tab.id, ...msg });
      });
    }
  });
};
