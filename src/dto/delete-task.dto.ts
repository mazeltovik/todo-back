import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteTaskDto {
  @IsNotEmpty()
  @IsString()
  type!: 'active' | 'done';
  @IsNotEmpty()
  @IsString()
  id!: string;
}
