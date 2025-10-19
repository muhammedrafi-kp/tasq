import { IsEmail, IsNotEmpty, Matches, MinLength,IsString } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email format.' })
    @IsNotEmpty({ message: 'Email is required.' })
    email!: string;

    @IsNotEmpty({ message: 'Password is required.' })
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, {
        message:
            'Password must contain at least 1 letter, 1 number, and 1 special character.',
    })
    password!: string;
}


export class SignupDto {
    @IsNotEmpty({ message: 'Username is required.' })
    @Matches(/^(?!_+$)[a-zA-Z0-9_]{3,20}$/, {
        message: 'Username cannot be only underscores and must be 3–20 characters long with letters, numbers, or underscores.',
    })
    name!: string;

    @IsEmail({}, { message: 'Invalid email format.' })
    @IsNotEmpty({ message: 'Email is required.' })
    email!: string;

    @IsNotEmpty({ message: 'Password is required.' })
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, {
        message:
            'Password must contain at least 1 letter, 1 number, and 1 special character.',
    })
    password!: string;
}

export class GoogleAuthDto {
    @IsString({ message: "Credential must be a string" })
    @IsNotEmpty({ message: "Credential is required" })
    @Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
        message: "Credential must be a valid JWT format",
    })
    credential!: string;
}

