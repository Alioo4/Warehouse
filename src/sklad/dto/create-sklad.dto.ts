import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateSkladDto {
    @ApiProperty({example: 'QWERT'})
    @IsNotEmpty()
    @IsString()
    balon: string;

    @ApiProperty({example: 5})
    @IsNotEmpty()
    @IsInt()
    soni: number;

    @ApiProperty({example: 9})
    @IsNotEmpty()
    @IsInt()
    onePrice: number;
}
