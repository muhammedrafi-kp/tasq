import { IsString, IsNotEmpty, Matches } from "class-validator";

export class GoogleAuthDto {
    @IsString({ message: "Credential must be a string" })
    @IsNotEmpty({ message: "Credential is required" })
    @Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
        message: "Credential must be a valid JWT format",
    })
    credential!: string;
}
