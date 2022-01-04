require("dotenv").config()
const knex = require("knex")({
    client:"mysql",
    connection:{
        database:process.env.DATABASE,
        host:process.env.HOST,
        user:process.env.USER_DB,
        password:process.env.PASSWORD,
    }
})

knex.schema.createTable("students", t=>{
    t.increments("id")
    t.string("name")
    t.string("email")
    t.string("password")
}).then(data=>{
    console.log("students created")
}).catch(err=>{
    console.log(err.sqlMessage)
})

knex.schema.createTable("books", t=>{
    t.increments("id")
    t.string("book")

}).then(data=>{
    console.log("books created")
}).catch(err=>{
    console.log(err.sqlMessage)
})

knex.schema.createTable("issued", t=>{
    t.increments("id")
    t.string("user_id")
    t.string("book")
    t.timestamp('issued_at').defaultTo(knex.fn.now())
    t.string("return_uptil")
}).then(data=>{
    console.log("issued created")
}).catch(err=>{
    console.log(err.sqlMessage)
})

module.exports = knex;