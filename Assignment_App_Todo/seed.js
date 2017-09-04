var StatusEnum = {
    ACTIVE:"ACTIVE",
    COMPLETE:"COMPLETE",
    DELETED:"DELETED"
}

var todos = {
    1 : {title: "Learn JavaScript", status: StatusEnum.ACTIVE},
    2 : {title: "Learn Nodejs", status: StatusEnum.ACTIVE},
    3 : {title: "Learn Reactjs", status: StatusEnum.ACTIVE},
    4 : {title: "Learn Java", status: StatusEnum.COMPLETE},
    5 : {title: "Learn HTML", status: StatusEnum.COMPLETE},
    6 : {title: "Learn CSS", status: StatusEnum.DELETED}
}

var next_todo_id = 7;
module.exports = {
    StatusEnum : StatusEnum,
    todos : todos,
    next_todo_id : next_todo_id
}