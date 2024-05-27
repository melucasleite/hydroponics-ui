#include <Arduino.h>
#include "inputs.h"
#include "relayControl.h"

void initIOControl() {
    Serial.begin(115200);
}

void IOControlLoop() {
    if (Serial.available() > 0) {
        String command = Serial.readStringUntil('\n');
        command.trim();
        if (command == "analog") {
            Serial.print(getInputs());
        }
        else if (command.startsWith("U")) {
            int relayPin = command.substring(1).toInt();
            turnRelayOn(relayPin);
        }
        else if (command.startsWith("D")) {
            int relayPin = command.substring(1).toInt();
            turnRelayOff(relayPin);
        }
    }
}