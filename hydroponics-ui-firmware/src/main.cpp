#include "inputs.h"
#include "relayControl.h"
#include "ioControl.h"

void setup() {
  initRelayControl();
  initInputs();
  initIOControl();
}

void loop() {
  sensorLoop();
  relayControlLoop();
  IOControlLoop();
}