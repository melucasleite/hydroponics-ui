import * as Repo from "./persistance";
import * as ArduinoController from "./arduinoComn";

const setup = async () => {
  await ArduinoController.initSerial({
    onData: (reading) => {
      Repo.insertReading(reading);
      Repo.updateCurrentState(reading);
    },
  });
  setInterval(() => {
    ArduinoController.requestReadings();
  }, 1000);
  setInterval(() => {
    getRelaysAndSend();
  }, 1000);
};

export const getRelaysAndSend = async () => {
  const relays = await Repo.getRelays();
  const relayConfig = ArduinoController.getRelayConfig(relays);
  console.log("Relay config:", relayConfig);
  ArduinoController.sendRelays(relayConfig);
};

await setup();
