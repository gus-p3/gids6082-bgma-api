import { IsDate, IsNotEmpty, IsString } from "class-validator";


export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    lastname!: string;

    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

}