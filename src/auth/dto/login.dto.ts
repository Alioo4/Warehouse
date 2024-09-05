import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'jony07'})
    username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: '99999'})
    password: string;
}