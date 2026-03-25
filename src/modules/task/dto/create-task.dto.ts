import { ApiProperty } from "@nestjs/swagger";
import {
    IsBoolean,
    IsDate,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Comprar pan' })
    name!: string; 

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Ir a la panadería' })
    description!: string;

    @IsBoolean()
    priority!: boolean;

    // @IsNumber()
    // @IsInt()
    // user_id: number;

}