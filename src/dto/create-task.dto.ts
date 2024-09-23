import { IsNotEmpty, IsString, IsBoolean} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  task!: string;
  @IsNotEmpty()
  @IsBoolean()
  isCompleted!:boolean;
}