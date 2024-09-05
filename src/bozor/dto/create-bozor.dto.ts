import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateBozorDto {
    @ApiProperty({example: 'Javohir'})
    @IsNotEmpty()
    @IsString()
    oluvchi: string;

    @ApiProperty({example: 'QWERT'})
    @IsNotEmpty()
    @IsString()
    balon: string;

    @ApiProperty({example: 2})
    @IsNotEmpty()
    @IsInt()
    soni: number;
}
