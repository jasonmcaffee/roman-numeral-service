import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../env/.env') });

const appConfig = {
  getPort(): number {
    const portStr = process.env.PORT;
    const port = portStr ? parseInt(portStr, 10) : 3000;
    if (isNaN(port)) {
      throw new Error('PORT in .env is not a valid number');
    }
    return port;
  },
};

export default appConfig;
