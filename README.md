# sniff

A simple HTTP and WebSocket sniffer for WebExtensions.

## Documentation

### HTTP

Import `sniffHttp` in your background script and provide it with a callback:

```
import { sniffHttp } from 'sniff';

sniffHttp((msg) => {
  if(msg.targetUrl === ""http://www.example.com/dwarfs") {
    console.log("Found dwarfs!");
  } else {
    console.log("No dwarfs here.");
  }
})
```

Read more about the callback's `msg` [here](#sniffed-message).

### WebSocket

Import and call `initWsSniffer` in your content script:

```
import { initWsSniffer } from 'sniff';

initWsSniffer();
```

Import `sniffHttp` in your background script and provide it with a callback:

```
import { sniffWs } from 'sniff';

sniffWs((msg) => {
  if(msg.targetUrl === ""http://www.example.com/dwarfs") {
    console.log("Found dwarfs!");
  } else {
    console.log("No dwarfs here.");
  }
})
```

Read more about the callback's `msg` [here](#sniffed-message).

### Sniffed Message

All sniffed messages have geometry

```
interface SniffedMessage<T> {
  data: T;
  srcUrl: string;
  targetUrl: string;
  tabId: number;
}
```

where

- `data` is the body of HTTP response or WebSocket message.
- `srcUrl` is the location of the request.
- `targetUrl` is the target of the request.
- `tabId` is the tab the request was sent from.

E.g., if you open a new browser and navigate to `http://www.example.com` , which makes a call to `http://www.example.com/dwarfs`, you would get a response of:

```
{
  data: "[\"Sleepy\",\"Dopey\",\"Bashful\",\"Grumpy\",\"Happy\",\"Sneezy\",\"Doc\"]",
  srcUrl: "http://www.example.com";
  targetUrl: "http://www.example.com/dwarfs";
  tabId: 0;
}
```
