const MongoClient = require('mongodb').MongoClient;
const Confirm = require('prompt-confirm');
const prompt = new Confirm('Delete all messages?');

const url = 'mongodb://localhost:27017/DBClientsPPK';

(() => {
    MongoClient.connect(url, async (err, db) => {
        if(err) {            
            console.log('No connection to Database! Please start MongoDB service on default port 27017!\n');       
            
            console.log(err);
            await sleep(10000);
        } else {
            console.log('Connected to database successfully!');

            countMessages(db, () => {
                setTimeout(() => {
                    prompt.ask((answer) => {                       
                        if(answer){
                            deleteMessages(db);
                        } else {
                            db.close();
                            return null;
                        }               
                    });                    
                  }, 1000);                 
            });                             
        };      
    });
})();

const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);        
    });
};

const deleteMessages = (db) => {
    db.collection('Ping', async (err, collection) => {
        if(err) {
            console.log(err);
            db.close();
            await sleep(10000);
        };
        collection.remove({}, async (err, result) => {
            if(err) {
                console.log(err);
                db.close();
                await sleep(10000);
            };

            console.log(`All Ping messages were deleted! Result: ${result}`);
            db.close();

            await sleep(5000);
        });
    });
};

const countMessages = (db, callback) => {
    setTimeout(() => {
        db.collection('Ping', async (err, collection) => {
            if(err) {
                console.log(err);
                db.close();
                await sleep(10000);
            };
    
            const messagesCount = await collection.count();
    
            console.log(`Ping messages detected: ${messagesCount}\n`);
        });
        
        callback();
      }, 1000);    
};