#include "inputs.h"

#define ONE_WIRE_BUS A5
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

float tempF = 0;

void initInputs() {
    sensors.begin();
}

void sensorLoop() {
    sensors.requestTemperatures();
    float temperatureReading = sensors.getTempFByIndex(0);
    if (temperatureReading != DEVICE_DISCONNECTED_F) {
        tempF = temperatureReading;
    }
}

String getInputs() {
    String readings = "";
    for (int i = 0; i <= 15; i++) {
        int reading = analogRead(i);
        readings += "A" + String(i) + "V" + String(reading);
        if (i != 15) {
            readings += "-";
        }
    }
    readings += "-T1V" + String(int(tempF * 10)) + "\n";
    return readings;
}