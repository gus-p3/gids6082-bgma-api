import { IsNotEmpty } from "class-validator";

export class CreateTaskDto {

    id?: number;
    @IsNotEmpty()
    name: string | undefined;

    @IsNotEmpty()
    description: string | undefined;

    @IsNotEmpty()
    priority: number | undefined;
}