import SniffedMessage from "./SniffedMessage";

type Sniffer = (callback: (msg: SniffedMessage) => unknown) => void;

export default Sniffer;
