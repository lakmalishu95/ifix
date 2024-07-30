import mongoose, { ConnectOptions } from 'mongoose';

export const dbConnect = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    
    console.log('Mongo connected successfully'); // Fixed typo in the log message
  } catch (err) {
    throw new Error('Error connecting to MongoDB');
  }
};
