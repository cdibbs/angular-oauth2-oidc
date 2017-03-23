export class ConfigValidationResult {
    constructor(
        public message: string = "",
        public property: string = "N/A",
        public valid: boolean = false) {}

    toString(): string {
        return `${this.valid ? "" : "Error:"} ${this.message} (Property: ${this.property}).`;
    }
}