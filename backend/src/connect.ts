import mongoose from 'mongoose';
import { logger } from './logger';

type TInput = {
  db: string;
}
export default ({db}: TInput) => {
  
  const connect = () => {
    mongoose
      .connect(
        db,
        { useNewUrlParser: true,  useUnifiedTopology: true }
      )
      .then(() => {
        return logger.info(`Successfully connected to ${db}`);
      })
      .catch(error => {
        logger.error('Error connecting to database: ', error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};