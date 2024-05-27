#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS A5
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

unsigned long lastUpTime[53]; // Array to store the last time a "U" command was received for each pin
int delayTime = 5000;
bool debug = true; // Debug variable

void setup()
{
  Serial.begin(115200);
  for (int i = 0; i <= 52; i++)
  {
    lastUpTime[i] = 0; // Initialize the last "U" time to 0 for each pin
  }
  sensors.begin();
}

void loop()
{
  sensors.requestTemperatures();
  if (Serial.available() > 0)
  {
    String command = Serial.readStringUntil('\n');
    command.trim();
    if (command == "analog")
    {
      String readings = "";
      for (int i = 0; i <= 15; i++)
      {
        int reading = analogRead(i);
        readings += "A" + String(i) + "V" + String(reading);
        if (i != 15)
        {
          readings += "-";
        }
      }
      sensors.requestTemperatures();
      float tempF = sensors.getTempFByIndex(0);
      if (tempF == DEVICE_DISCONNECTED_F)
      {
        for (int retry = 0; retry < 5; retry++)
        {
          delay(10);
          sensors.requestTemperatures();
          tempF = sensors.getTempFByIndex(0);
          if (tempF != DEVICE_DISCONNECTED_F)
            break;
          tempF = 0;
        }
      }
      readings += "-T1V" + String(int(tempF * 10)) + "\n";
    }
    else if (command.startsWith("U"))
    {
      int relayPin = command.substring(1).toInt();
      pinMode(relayPin, OUTPUT);
      digitalWrite(relayPin, LOW);
      lastUpTime[relayPin] = millis(); // Update the last "U" time for this pin
      if (debug)
      {
        Serial.print("Relay " + String(relayPin) + " is ON" + "\n");
      }
    }
    else if (command.startsWith("D"))
    {
      int relayPin = command.substring(1).toInt();
      pinMode(relayPin, OUTPUT);
      digitalWrite(relayPin, HIGH);
      if (debug)
      {
        Serial.print("Relay " + String(relayPin) + " is OFF" + "\n");
      }
    }
  }

  for (int i = 0; i <= 52; i++)
  {
    if (millis() - lastUpTime[i] > delayTime)
    {
      pinMode(i, OUTPUT);
      digitalWrite(i, HIGH);
      if (debug)
      {
        Serial.print("Relay " + String(i) + " is OFF" + "\n");
      }
    }
  }
}