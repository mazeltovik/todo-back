import { IsNotEmpty, IsUUID, IsBoolean} from 'class-validator';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;
  @IsNotEmpty()
  @IsBoolean()
  isCompleted!:boolean;
}