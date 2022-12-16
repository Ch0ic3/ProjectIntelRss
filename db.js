const fs = require("fs")
const sqlite = require("sqlite3")


function createConnection(){
    if(fs.existsSync("rss-ids.db")){
        return new sqlite.Database("rss-ids.db")
    } else {
        const db = new sqlite.Database("rss-ids.db", (err) => {
            if (err){
                return console.error(err.message)
            }
            createTable(db)
        })
    console.log("Connection made with sqlite Database")
    return db
    }
}


function createTable(db){
    db.exec(`
    create table data
    (
        ID integer primary key autoincrement,
        name varchar(255) not null
    )
    `)
}

module.exports = createConnection()