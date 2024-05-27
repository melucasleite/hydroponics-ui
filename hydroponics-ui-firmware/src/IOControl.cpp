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
            Serial.println(getInputs());
        }
        else if (command.startsWith("R")) {
            // it gets a command on the format R1U2D3U4D5 and then turns on or off the relays accordingly
            // Relay pins is always 2 digits
            // example R01U02D03U04D05
            for (int i = 1; i < command.length(); i += 2) {
                int relayPin = command.substring(i, i + 2).toInt();
                if (command[i + 2] == 'U') {
                    turnRelayOn(relayPin);
                }
                else if (command[i + 2] == 'D') {
                    turnRelayOff(relayPin);
                }
            }
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