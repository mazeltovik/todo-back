import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskBody } from '../entities/create-task.entity';
import { UpdateTaskBody } from '../entities/update-task.entity';
import { DeleteTaskBody } from '../entities/delete-task.entity';
class Client {
  mongoClient: MongoClient;
  constructor(private readonly dbName: string) {
    this.mongoClient = new MongoClient('mongodb://localhost:27017/images');
  }
  async connect() {
    try {
      console.log('Connecting to MongoDB Atlas cluster...');
      await this.mongoClient.connect();
      console.log('Successfully connected to MongoDB Atlas!');

      return this.mongoClient;
    } catch (error) {
      console.error('Connection to MongoDB Atlas failed!', error);
      process.exit();
    }
  }
  async getAll() {
    const mongoClient = await this.connect();
    try {
      const db = mongoClient.db(this.dbName);
      const activeCollection = db.collection('active');
      const doneCollection = db.collection('done');
      const activeTask = await activeCollection.find().toArray();
      const doneTask = await doneCollection.find().toArray();
      return { activeTask, doneTask };
    } catch (err) {
      console.log(err);
      throw new Error("Can't get all tasks");
    } finally {
      await mongoClient.close();
    }
  }
  async createTask(task: CreateTaskBody) {
    const id = uuidv4();
    const mongoClient = await this.connect();
    const activeTasks = { id, ...task };
    try {
      const db = mongoClient.db(this.dbName);
      const collection = db.collection('active');
      const { insertedId } = await collection.insertOne(activeTasks);
      const createdTask = await collection.findOne(insertedId, {
        projection: { _id: 0 },
      });
      return createdTask;
    } catch (err) {
      console.log(err);
      throw new Error("Can't create active tasks");
    } finally {
      await mongoClient.close();
    }
  }
  async putTask(task: UpdateTaskBody) {
    const { id } = task;
    const mongoClient = await this.connect();
    try {
      const db = mongoClient.db(this.dbName);
      const activeTasks = await db.collection('active');
      const activeTask = await activeTasks.findOne(
        { id },
        { projection: { _id: 0 } }
      );
      if (activeTask) {
        const doneTasks = await db.collection('done');
        await doneTasks.insertOne(activeTask);
        await activeTasks.deleteOne({ id });
        return activeTask;
      }
    } catch (err) {
      console.log(err);
      throw new Error("Can't update tasks");
    } finally {
      await mongoClient.close();
    }
  }
  async deleteTask(task: DeleteTaskBody) {
    const { id, type } = task;
    const mongoClient = await this.connect();
    try {
      const db = mongoClient.db(this.dbName);
      const collection =
        type == 'active' ? db.collection('active') : db.collection('done');
      const result = await collection.deleteOne({ id });
      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.');
        return { id };
      }
    } catch (err) {
      console.log(err);
      if (type == 'active') {
        throw new Error("Can't delete active tasks");
      } else {
        throw new Error("Can't delete done tasks");
      }
    } finally {
      await mongoClient.close();
    }
  }
}

export default Client;
