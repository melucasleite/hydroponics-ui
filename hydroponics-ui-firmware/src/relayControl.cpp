#include "relayControl.h"

unsigned long lastUpTime[53]; // Array to store the last time a "U" command was received for each pin
bool debug = true; // Debug variable

unsigned int delayTime = 5000;

void initRelayControl() {
    for (int i = 0; i <= 52; i++)
    {
        lastUpTime[i] = 0;
    }
}

void turnRelayOn(int relayPin) {
    pinMode(relayPin, OUTPUT);
    digitalWrite(relayPin, LOW);
    lastUpTime[relayPin] = millis(); // Update the last "U" time for this pin
    if (debug) {
        Serial.print("Relay " + String(relayPin) + " is ON" + "\n");
    }
}

void turnRelayOff(int relayPin) {
    pinMode(relayPin, OUTPUT);
    digitalWrite(relayPin, HIGH);
    if (debug) {
        Serial.print("Relay " + String(relayPin) + " is OFF" + "\n");
    }
}

void relayControlLoop() {
    for (int i = 0; i <= 52; i++) {
        if (millis() - lastUpTime[i] > delayTime) {
            turnRelayOff(i);
        }
    }
}