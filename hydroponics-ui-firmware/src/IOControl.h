#ifndef IOCONTROL_H
#define IOCONTROL_H

#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>

void initIOControl();
void IOControlLoop();

#endif
