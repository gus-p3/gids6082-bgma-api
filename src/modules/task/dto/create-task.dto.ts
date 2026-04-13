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
    @IsString({ message: "El nombre debe ser un texto" })
    @IsOptional()
    @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
    @MaxLength(50, { message: "El nombre no debe exceder los 50 caracteres" })
    name!: string; 

    @IsString({ message: "La descripción debe ser un texto" })
    @IsOptional()
    @MinLength(3, { message: "La descripción debe tener al menos 3 caracteres" })
    @MaxLength(250, { message: "La descripción no debe exceder los 250 caracteres" })
    description!: string;

    @IsBoolean()
    priority!: boolean;

    // @IsNumber()
    // @IsInt()
    // user_id: number;

}