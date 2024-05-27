import { getInfo, insertReading } from "./persistance";
import {
  getRelayConfig,
  initSerial,
  requestReadings,
  sendRelays,
} from "./arduinoComn";

const setup = async () => {
  initSerial({ onData: insertReading });
  setInterval(() => {
    requestReadings();
  }, 1000);
  setInterval(() => {
    getInfoAndSendRelays();
  }, 1000);
};

export const getInfoAndSendRelays = async () => {
  const info = await getInfo();
  const relayConfig = getRelayConfig(info);
  //   console.log("Relay config:", relayConfig);
  sendRelays(relayConfig);
};

await setup();
