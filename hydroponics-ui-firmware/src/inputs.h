#ifndef INPUTS_H
#define INPUTS_H

#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>

extern float tempF;

void initInputs();
void sensorLoop();
String getInputs();

#endif
