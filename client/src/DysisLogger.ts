export class DysisLogger {
  static TURN_LOG_ON = false;

  static log(text: string): void {
    if (this.TURN_LOG_ON) {
      console.log(text);
    }
  }
}