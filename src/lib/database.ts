import { Db, MongoClient } from "mongodb";
import chalk from 'chalk';

class Database{
    db?: Db;
 
    async init(): Promise<Db | undefined> {
        console.log("================DATABASE================");
        try {
            const MONGODB = process.env.DATABASE || 'mongodb://localhost:27017/cine-world';
            const mongoClient = await MongoClient.connect(MONGODB);
 
            this.db = mongoClient.db();
            // Mensaje visual con el estado
            console.log(`STATUS: ${chalk.greenBright("ONLINE")}`);
            console.log(`DATABASE: ${chalk.greenBright(this.db.databaseName)}`);
        } catch(error) {
            console.log(`ERROR: ${error}`);
            console.log(`STATUS: ${chalk.redBright("OFFLINE")}`);
            console.log(`DATABASE: ${chalk.redBright(this.db?.databaseName)}`);
        }
        return this.db;
    }
    /*async init(){
        const MONGO_DB = process.env.DATABASE || 'mongodb://localhost:27017/cine-world';
        const client = await MongoClient.connect(
            MONGO_DB,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        const db = client.db();

        if(client.isConnected()){
            console.log('=====================DATABASE==============');
            console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
            console.log(`STATUS: ${chalk.greenBright(db.databaseName)}`);
        }
    }*/
}

export default Database;