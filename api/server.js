// BUILD YOUR SERVER HERE
const express = require("express");
const User = require("./users/model");


const server = express();
server.use(express.json());


// POST REQUEST
server.post("/api/users", async (req, res) => {
    const user = req.body;
    if (!user.name || !user.bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user"
        })
    } else {
        User.insert(user)
            .then(createdUser => {
                res.status(201).json(createdUser)
            }).catch(err => {
                res.status(500).json({
                    message: "error creating user",
                    err: err.message,
                    stack: err.stack
                })
            })
    }
})

// GET REQUEST
server.get("/api/users", (req, res) => {
    User.find()
        .then(allUsers => {
            res.status(200).json(allUsers)
        }
        )
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
})

server.get("/api/users/:id", async (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            } else {
                res.status(200).json(user);
            }
        }).catch(err => {
            res.status(500).json({ message: err.message });
        })
})

server.delete("/api/users/:id", async (req, res) => {
    const check = await User.findById(req.params.id);
    if (!check) {
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    } else {
        await User.remove(req.params.id)
            .then(user => {
                res.status(200).json(user)
            }).catch(err => {
                res.status(500).json({
                    message: err.message
                })
            })
    }
})

server.put("/api/users/:id", async (req, res) => {
    const check = await User.findById(req.params.id);
    if (!check) {
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    } else if(!req.body.name || !req.body.bio){
        res.status(400).json({
            message: "Please provide name and bio for the user"
        })
    } else {
        User.update(req.params.id, req.body)
        .then(user => {
            res.status(200).json(user)
        }).catch(err => {
            res.status(500).json({
                message: "The user information could not be modified"
            })
        })
    }
})


module.exports = server; // EXPORT YOUR SERVER instead of {}
