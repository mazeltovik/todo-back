import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskBody } from './entities/create-task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskBody } from './entities/update-task.entity';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { DeleteTaskBody } from './entities/delete-task.entity';
import isBodyEmpty from './helpers/isBodyEmpty';
import Client from './mongo/mongoClient';

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

const dbClient = new Client('tasks');

app.get('/', (req, res) => {
  res.send('Todo backend');
});

app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const tasks = await dbClient.getAll();
    res.send(tasks);
  } catch (err) {
    res.status(400).send({ err });
  }
});

app.post(
  '/tasks',
  async (req: Request<{}, {}, CreateTaskBody>, res: Response) => {
    if (isBodyEmpty(req.body)) {
      return res.status(400).send({ err: 'Missing request body!' });
    }
    const task = new CreateTaskDto();
    task.task = req.body.task;
    task.isCompleted = req.body.isCompleted;
    const errors = await validate(task);
    if (errors.length > 0) {
      const err = Object.values(
        errors[0].constraints as unknown as Array<String>
      )[0];
      return res.status(400).send({ err });
    } else {
      try {
        const createdTask = await dbClient.createTask(req.body);
        res.status(201).send(createdTask);
      } catch (err) {
        res.status(400).send({ err });
      }
    }
  }
);

app.put(
  '/tasks',
  async (req: Request<{}, {}, UpdateTaskBody>, res: Response) => {
    if (isBodyEmpty(req.body)) {
      return res.status(400).send({ err: 'Missing request body!' });
    }
    const task = new UpdateTaskDto();
    task.id = req.body.id;
    const errors = await validate(task);
    if (errors.length > 0) {
      const err = Object.values(
        errors[0].constraints as unknown as Array<String>
      )[0];
      return res.status(400).send({ err });
    } else {
      try {
        const updatedTask = await dbClient.putTask(req.body);
        res.status(201).send(updatedTask);
      } catch (err) {
        res.status(400).send({ err });
      }
    }
  }
);

app.delete(
  '/tasks',
  async (req: Request<{}, {}, DeleteTaskBody>, res: Response) => {
    if (isBodyEmpty(req.body)) {
      return res.status(400).send({ err: 'Missing request body!' });
    }
    const deleteTask = new DeleteTaskDto();
    deleteTask.id = req.body.id;
    deleteTask.type = req.body.type;
    const errors = await validate(deleteTask);
    if (errors.length > 0) {
      const err = Object.values(
        errors[0].constraints as unknown as Array<String>
      )[0];
      return res.status(400).send({ err });
    } else {
      try {
        const result = await dbClient.deleteTask(deleteTask);
        if (result) {
          return res.status(200).send({ id: result.id });
        }
      } catch (err) {
        res.status(400).send({ err });
      }
    }
  }
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
