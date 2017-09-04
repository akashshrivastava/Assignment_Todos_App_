var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var todo_db  = require("./seed.js");
app.use("/",bodyParser.urlencoded({ extended: false }));
app.use("/",express.static(__dirname+"/public"));

/**
 * get all todos
 */
app.get("/api/todos",function (req,res) {
    res.json(todo_db.todos);
})

/**
 * add a new todos
 */
app.post("/api/todos",function (req,res) {
    var todo_title = req.body.todo_title;
    if(!todo_title || todo_title == "" || todo_title.trim()==""){
        res.status(400).json({error:"Todo title cannot be blank"});
    }
    else{
        var new_todo_obj = {
            title : todo_title,
            status : todo_db.StatusEnum.ACTIVE
        }
        todo_db.todos[todo_db.next_todo_id] = new_todo_obj;
        todo_db.next_todo_id++;
        res.json(todo_db.todos);
    }
})


/**
 * delete a new todo
 */
app.delete("/api/todos/:id",function (req,res){
    var del_id = req.params.id;
    var del_todos = todo_db.todos[del_id];
    if(!del_todos){
        res.status(400).json({error:"Given id does not exist"});
    }
    else{
        del_todos.status = todo_db.StatusEnum.DELETED;
        todo_db.todos[del_id] =del_todos;
        res.json(todo_db.todos);
    }
})

/**
 * update a todo
 */
app.put("/api/todos/:id",function (req,res) {
    var mod_id = req.params.id;
    var mod_todos = todo_db.todos[mod_id];
    if(!mod_todos){
        res.status(400).json({error: "Requested id doe not exist"});
    }
    else{
        var given_todo_title = req.body.todo_title;
        if(given_todo_title && given_todo_title !="" && given_todo_title.trim() != ""){
            mod_todos.title = given_todo_title;
        }
        var given_todo_status = req.body.todo_status;
        if(given_todo_status && given_todo_status== todo_db.StatusEnum.ACTIVE ||given_todo_status == todo_db.StatusEnum.COMPLETE){
            mod_todos.status = given_todo_status;
        }
        res.json(todo_db.todos);
    }
});

app.listen(3000);