export class TokenValidationResult {
    constructor(message?: string) { this.Message = message; this.Valid = !message; }
    public Valid: boolean = true;
    public Message: string = "No error.";

    public static Ok: TokenValidationResult = new TokenValidationResult();
}