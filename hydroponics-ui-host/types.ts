interface Reading {
  port: string;
  value: number;
}

type ArduinoReading = {
  temperature: number;
  ph: number;
  ec: number;
  waterLevel: "LOW" | "NORMAL" | "HIGH";
};

type ArduinoPortReading = {
  port: string;
  value: number;
};
