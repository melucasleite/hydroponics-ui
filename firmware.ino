void setup() {
  Serial.begin(9600);
  for (int i = 0; i <= 15; i++) {
    pinMode(i, INPUT);
  }
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
      readings += "\n";
      Serial.print(readings);
    }
  }