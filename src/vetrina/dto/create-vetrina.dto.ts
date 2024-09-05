import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateVetrinaDto {
    @ApiProperty({example: 'Javohir'})
    @IsNotEmpty()
    @IsString()
    oluvchi: string;

    @ApiProperty({example: 'QWERT'})
    @IsNotEmpty()
    @IsString()
    balon: string;

    @ApiProperty({example: 1})
    @IsNotEmpty()
    @IsInt()
    soni: number;
}
