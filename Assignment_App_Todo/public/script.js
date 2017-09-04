const  RESPONSE_DONE = 4;
const STATUS_OK = 200;
const TODOS_LIST_ID_ACTIVE = "todo_list_div_active";
const TODOS_LIST_ID_COMPLETE = "todo_list_div_complete";
const TODOS_LIST_ID_DELETE = "todo_list_div_delete";
const NEW_TODO_INPUT_ID = "new_todo_input";

window.onload = getTodosAjax();

/**
 *
 * @param source_id
 * change visibility
 */
function changeVisibility(source_id) {
    var source_div =''; var src_label ='';
    if(source_id == 'hide_completed_todos'){
        source_div = 'todo_list_div_complete';
        src_label = 'hide_completed_todos'
    }
    else if(source_id == "hide_deleted_todos"){
        source_div= 'todo_list_div_delete';
        src_label = 'hide_deleted_todos';
    }

    var visibility = document.getElementById(source_div).style.display;

    if(visibility!='none'){
        document.getElementById(source_div).style.display = 'none';
        console.log("none");
        document.getElementById(src_label).innerHTML = 'Show Todos';
    }
    else {
        document.getElementById(source_div).style.display = 'block';
        console.log("block");
        document.getElementById(src_label).innerHTML = 'Hide Todos';
    }
}

/**
 *
 * @param id
 * @param todos_data_json
 * adding a new todo
 */
function add_todo(id, todos_data_json) {
    var todos = JSON.parse(todos_data_json);

    var parentActive = document.getElementById(TODOS_LIST_ID_ACTIVE);
    var parentComplete = document.getElementById(TODOS_LIST_ID_COMPLETE);
    var parentDelete = document.getElementById(TODOS_LIST_ID_DELETE);
    //parentActive.innerText = todos_data_json;
    parentActive.innerHTML = "";
    parentComplete.innerHTML = "";
    parentDelete.innerHTML = "";
    if(parentActive || parentComplete ||parentDelete){
        // { id  : {todo object}, id : {todo:object}... }
        Object.keys(todos).forEach(
            function (key) {
                var todo_element = createTodoElement(key,todos[key]);
                if(todos[key].status == "ACTIVE"){
                    parentActive.appendChild(todo_element);
                }
                if(todos[key].status == "COMPLETE"){
                    parentComplete.appendChild(todo_element);
                }
                if(todos[key].status == "DELETED"){
                    parentDelete.appendChild(todo_element);
                }
            }
        )
    }
}

/**
 *
 * @param id
 * @param todo_object
 * creating a new todo
 * @returns {Element}
 */
function createTodoElement(id,todo_object){
    var todo_element = document.createElement("div");
    todo_element.innerText = todo_object.title;
    todo_element.setAttribute("data-id",id);
    todo_element.setAttribute("class","todoStatus"+todo_object.status+" "+"breadthVertical");

    if(todo_object.status == "ACTIVE"){
        var complete_button = document.createElement("input");
        complete_button.type = "checkbox";
        complete_button.style.float = "left";
        complete_button.setAttribute("class","breadthHorizontal");
        complete_button.setAttribute("onclick", "completeTodoAJAX("+id+")");
        todo_element.appendChild(complete_button);
        var delete_button = document.createElement("label");
        delete_button.innerHTML = "X";  // mark as deleted
        delete_button.setAttribute("class","deleteLabelClass");
        //delete_button.setAttribute("class","breadthHorizontal");
        delete_button.setAttribute("onclick", "deleteTodoAJAX("+id+")");
        todo_element.appendChild(delete_button);
    }

    if(todo_object.status == "COMPLETE"){
        var active_button = document.createElement("input");
        active_button.type = "checkbox";
        active_button.style.float = "left";
        active_button.setAttribute("class","breadthHorizontal");
        active_button.setAttribute("onclick", "activeTodoAJAX("+id+")");
        var delete_button = document.createElement("label");
        delete_button.innerHTML = "X";  // mark as deleted
        delete_button.setAttribute("class","deleteLabelClass");
        //delete_button.setAttribute("class","breadthHorizontal");
        delete_button.setAttribute("onclick", "deleteTodoAJAX("+id+")");

        todo_element.appendChild(delete_button);
        todo_element.appendChild(active_button);
    }

    if(todo_object.status == "DELETED"){
        var lb = document.createElement("label");
        todo_element.appendChild(lb);
    }

    return todo_element;
}


/**
 * @param id
 * active a todo
 */
function activeTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT","/api/todos/"+id, true);// here true is for asynchronous
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var body_data = "todo_status=ACTIVE";
    xhr.onreadystatechange = function () {

        if(xhr.readyState == RESPONSE_DONE){//if response is ready ie 4
            if(xhr.status == STATUS_OK){
                // refresh the todo list
                add_todo(TODOS_LIST_ID_COMPLETE, xhr.responseText);
            }
            else{
                console.log(xhr.responseText);
            }
        }

    }
    xhr.send(body_data);
}

/**
 *
 * @param id
 * complete a todo
 */
function completeTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT","/api/todos/"+id, true);// here true is for asynchronous
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var body_data = "todo_status=COMPLETE";
    xhr.onreadystatechange = function () {

        if(xhr.readyState == RESPONSE_DONE){//if response is ready ie 4
            if(xhr.status == STATUS_OK){
                // refresh the todo list
                add_todo(TODOS_LIST_ID_COMPLETE, xhr.responseText);
            }
            else{
                console.log(xhr.responseText);
            }
        }

    }
    xhr.send(body_data);
}

/**
 *
 * @param id
 * delete a todo
 */
function deleteTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE","/api/todos/"+id, true);// here true is for asynchronous
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var body_data = "todo_status=DELETED";
    xhr.onreadystatechange = function () {

        if(xhr.readyState == RESPONSE_DONE){//if response is ready ie 4
            if(xhr.status == STATUS_OK){
                // refresh the todo list
                add_todo(TODOS_LIST_ID_DELETE, xhr.responseText);
            }
            else{
                console.log(xhr.responseText);
            }
        }

    }
    xhr.send(body_data);
}

/**
 * get request on "/api/todos"
 */
function getTodosAjax(){
    var xhr = new XMLHttpRequest();


    xhr.open("GET", "/api/todos",true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){//if response is ready ie 4
            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                add_todo(TODOS_LIST_ID_ACTIVE,xhr.responseText);
            }
        }
    }
    xhr.send(data=null);
}


/**
 * this function is called from button
 * add a new todo
 */
function addTodoAJAX() {
    var title = document.getElementById(NEW_TODO_INPUT_ID).value;
    var body_data = "";
    var xhr = new XMLHttpRequest();
    xhr.open("POST","/api/todos",true);//this true is for asynchronous
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var body_data = "todo_title=" + encodeURI(title);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){//if response is ready ie 4
            if(xhr.status == STATUS_OK){
                // refresh the todo list
                add_todo(TODOS_LIST_ID_ACTIVE, xhr.responseText);
            }
            else{
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(body_data);
}