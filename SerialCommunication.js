import { log } from "./utils.js";

export class SerialCommunication {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 115200 });
      log("Connected to Serial Port!", "success");
      this.isConnected = true;

      const textDecoder = new TextDecoderStream();
      this.port.readable.pipeTo(textDecoder.writable);
      this.reader = textDecoder.readable.getReader();
      this.writer = this.port.writable.getWriter();
      return true;
    } catch (error) {
      log(`Error connecting: ${error}`, "error");
      this.isConnected = false;
      return false;
    } finally {
      this.isConnected = false;
    }
  }

  async read() {
    let receivedBuffer = "";
    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) {
          return null;
        }
        if (value) {
          receivedBuffer += value;
          const lines = receivedBuffer.split("\n");
          while (lines.length > 1) {
            const line = lines.shift().trim();
            if (line) {
              return line;
            }
          }
          receivedBuffer = lines[0];
        }
      }
    } catch (error) {
      log(`Read error: ${error}`, "error");
    }
  }

  async sendCommand(command) {
    if (!this.writer) {
      return;
    }

    const commandWithNewline = command.trim() + "\n";
    const encoder = new TextEncoder();
    const data = encoder.encode(commandWithNewline);
    await this.writer.write(data);
    return command;
  }

  async disconnect() {
    if (this.reader) {
      this.reader.releaseLock();
    }
    if (this.writer) {
      this.writer.releaseLock();
    }
    if (this.port) {
      await this.port.close();
    }
  }
}
