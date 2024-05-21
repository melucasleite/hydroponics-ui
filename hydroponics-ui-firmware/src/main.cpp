#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS A5
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(115200);
  for (int i = 0; i <= 15; i++) {
    pinMode(i, INPUT);
  }
  sensors.begin();
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    if (command == "analog") {
      String readings = "";
      for (int i = 0; i <= 15; i++) {
        int reading = analogRead(i);
        readings += "A" + String(i) + "V" + String(reading);
        if (i != 15) {
          readings += "-";
        }
      }
      sensors.requestTemperatures();
      float tempC = sensors.getTempCByIndex(0);
      readings += "-T1V" + String(int(tempC*10)) + "\n";
      Serial.print(readings);
    }
  }
}