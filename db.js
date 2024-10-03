import { config as configDotenv } from 'dotenv'; // Load environment variables
// For vercel/postgres
configDotenv();

const client=new Client({
    connectionString:process.env.POSTGRES_URL
});

client.connect()
    .then(() => console.log("Connected to Postgres..."))
    .catch(err => console.log("Error connecting to Postgres:", err.stack));

export default client;






// import pkg from "pg";
// const {Client} = pkg;


// const client=new Client({
//     host:'localhost',
//     port:5432,
//     user:'postgres',
//     password:'postgres123',
//     database:'Docmanager'
// });

// client.connect()
// .then(()=>console.log("Connected to Postgres.."))
// .catch(()=>console.log("Error connecting PostGres",err.stack));

// export default client;


// To check the connection of postgres and next.js
// client.query(`Select * from users`,(err,res)=>{
//     if(!err){
//         console.log(res.rows);
//     }
//     else{
//         console.log(err.message);
//     }
//     client.end();

// })