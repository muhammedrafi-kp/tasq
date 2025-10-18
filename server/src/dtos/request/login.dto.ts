import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

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

