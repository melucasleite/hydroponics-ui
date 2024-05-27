#include "inputs.h"
#include "relayControl.h"
#include "IOControl.h"

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