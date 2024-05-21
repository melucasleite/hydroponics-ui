#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS A5
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

unsigned long lastUTime[53]; // Array to store the last time a "U" command was received for each pin
int delayTime = 5000;

void setup()
{
  Serial.begin(115200);
  for (int i = 0; i <= 52; i++)
  {
    lastUTime[i] = 0; // Initialize the last "U" time to 0 for each pin
  }
  sensors.begin();
}

void loop()
{
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
      float tempC = sensors.getTempCByIndex(0);
      readings += "-T1V" + String(int(tempC * 10)) + "\n";
      Serial.print(readings);
    }
    else if (command.startsWith("U"))
    {
      int relayPin = command.substring(1).toInt();
      pinMode(relayPin, OUTPUT);
      digitalWrite(relayPin, HIGH);
      lastUTime[relayPin] = millis(); // Update the last "U" time for this pin
      Serial.print("Relay " + String(relayPin) + " is ON" + "\n");
    }
    else if (command.startsWith("D"))
    {
      int relayPin = command.substring(1).toInt();
      pinMode(relayPin, OUTPUT);
      digitalWrite(relayPin, LOW);
      Serial.print("Relay " + String(relayPin) + " is ON" + "\n");
    }
  }

  for (int i = 0; i <= 52; i++)
  {
    if (millis() - lastUTime[i] > delayTime)
    {
      pinMode(i, OUTPUT);
      digitalWrite(i, LOW);
    }
  }
}