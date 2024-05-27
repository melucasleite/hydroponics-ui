#ifndef RELAY_CONTROL_H
#define RELAY_CONTROL_H

#include <Arduino.h>

extern unsigned long lastUpTime[53];
extern bool debug;

void initRelayControl();
void turnRelayOn(int relayPin);
void turnRelayOff(int relayPin);
void relayControlLoop();

#endif
