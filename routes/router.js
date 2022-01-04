const express = require("express")
const router = express.Router();
const knex = require("../config/db")
const bcrypt = require("bcrypt")
const { createToken, verifyToken } = require("../auth/jwt_auth");

router.get("/", async(req, res) => {
    const allBooks = await knex("books")
    const booklist = []
    allBooks.forEach(book=>{
        booklist.push(book.book)
    })
    res.send(booklist)
})

router.post("/register", (req, res) => {
    knex("students").where({ email: req.body.email }).then(data => {
        if (data.length > 0) {
            res.send("email is already present")
        } else {
            const pass = bcrypt.hashSync(req.body.password, 10)
            knex("students").insert({ name: req.body.name, email: req.body.email, password: pass }).then(() => {
                res.send({ status: "inserted" })
            }).catch(err => {
                console.log("error while inserting")
                res.send(err.message)
            })
        }
    }).catch(err => {
        console.log("error while register")
        res.send(err.message)
    })
})

router.delete("/delete/:id", verifyToken, (req, res) => {
    knex("students").where({ id: req.params.id }).del().then(data => {
        res.send({ status: "deleted" })
    }).catch(err => {
        console.log(err.message)
        res.send("error while deleting")
    })
})

router.post("/login", (req, res) => {
    if (req.body.email === undefined || req.body.password === undefined) {
        res.send("Email and password is required")
    } else {
        knex("students").where({ email: req.body.email }).then(data => {
            const matched = bcrypt.compareSync(req.body.password, data[0].password)
            if (matched) {
                const token = createToken({ id: data[0].id, name: data[0].name, email: data[0].email, password: data[0].password })
                res.cookie("token", token).send("login successful")
            } else {
                console.log("invalid email or password")
                res.send("invalid input")
            }
        }).catch(err => {
            console.log(err.message)
            res.send("error while logging in")
        })
    }
})

router.post("/issuebook/:id", verifyToken, (req, res) => {
    knex("books").where({ id: req.params.id }).then(data => {
        const issuedBook = {
            book: data[0].book,
            user_id: req.all.email,
            return_uptil: req.body.return_uptil
        }
        knex("issued").insert(issuedBook).then(() => {
            console.log("book issued")
            res.send("issued")
        }).catch(err => {
            console.log(err.message)
            res.send("error while issuing")
        })
    }).catch(err => {
        console.log(err.message)
        res.send("error while opening books table")
    })
})

router.post("/returnbook", verifyToken, (req, res) => {
    knex("issued")
        .where({ book: req.body.book, user_id: req.body.user_id })
        .then(data => {
            if (data.length > 0) {
                knex("issued").where({ book: req.body.book, user_id: req.body.user_id }).del().then((data) => {
                    res.send(`${data} returned`)
                }).catch(err => {
                    console.log(err.message)
                    res.send("error while returning")
                })
            } else {
                res.send("You have not issued any book yet")
            }
        }).catch(err => {
            console.log(err.message)
            res.send("error while finding book in issued table")
        })
})

router.post("/addbooks", async (req, res) => {
    try {
        const books = await req.body;
        books.forEach(book => {
            knex("books").insert(book).then(() => {
                console.log(`${book.book} inserted`)
            }).catch(err => {
                console.log(err.message)
            })
        });
        res.send("book(s) added")
    } catch (err) {
        console.log(err.message)
        res.send("error while adding books")
    }
})


module.exports = router