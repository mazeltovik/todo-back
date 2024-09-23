import express from 'express';
import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskBody } from './entities/create-task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskBody } from './entities/update-task.entity';
import isBodyEmpty from './helpers/isBodyEmpty';

const app = express();
app.use(express.json())
const port = 8080;

app.get('/', (req, res) => {
  res.send('Todo backend');
});

app.get('/tasks', (req:Request, res:Response) => {
  res.send('Todo backend');
});

app.post('/tasks', (req:Request<{}, {}, CreateTaskBody>, res:Response) => {
  if (isBodyEmpty(req.body)) {
    return res.status(400).send({ message: 'Missing request body!' });
  }
  const task = new CreateTaskDto();
  task.task = req.body.task;
  task.isCompleted = req.body.isCompleted;
  validate(task).then(errors => {
    if (errors.length > 0) {
      const message = Object.values(errors[0].constraints as unknown as Array<String>)[0];
      return res.status(400).send({ message });
    } else {
      return res.send('validation succeed');

    }
});
});

app.put('/tasks', (req:Request<{}, {}, UpdateTaskBody>, res:Response) => {
  if (isBodyEmpty(req.body)) {
    return res.status(400).send({ message: 'Missing request body!' });
  }
  const task = new UpdateTaskDto
  task.id = req.body.id;
  task.isCompleted = req.body.isCompleted;
  validate(task).then(errors => {
    if (errors.length > 0) {
      const message = Object.values(errors[0].constraints as unknown as Array<String>)[0];
      return res.status(400).send({ message });
    } else {
      return res.send('validation succeed');
    }
});
});

app.delete('/tasks', (req:Request, res:Response) => {
  res.send('Todo backend');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
