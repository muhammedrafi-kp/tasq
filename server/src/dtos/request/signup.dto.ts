import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

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