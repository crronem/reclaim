
const mongoose = require('mongoose');
const onem = require('onem');

const APIKEY = 'o4857349ytvo5438543987498u34q9843';

var Todo = mongoose.model('todos', TodoSchema);

var todoVerbs = [
    { name: 'menu', route: '/todo' }
];
var todo = new onem.service(APIKEY, "TODO", todoVerbs);

var renderLandingMenu = function(user) {
    var landingMenuData = {
        doneCount: 0,
        todoCount: 0,
        todos: [{ id: "1", taskDescription: "Blah", dueDate: "12/3" }, { id: "2", taskDescription: "Blob", dueDate: "15/3" }]
    }
    var landingMenu = new todo.renderMenu('/templates/todoLanding', landingMenuData);
    landingMenu.header("TODO MENU");
    return landingMenu;
}

/*
 * Middleware to grab user
 */
function getUser(req, res, next) {
    if (!req.header('Authorization')) {
        debug("missing header");
        return res.status(401).send({ message: 'Unauthorized request' });
    }
    var token = req.header('Authorization').split(' ')[1];

    var payload = common.decodeJWT(token);
    debug("decoded payload");
    debug(payload);
    if (!payload) {
        return res.status(401).send({ message: 'Unauthorized Request' });
    }
    req.user = payload.sub;
    next();
}

/*
 * Routes
 */

// Landing menu
api.get('/todo', getUser, function (req, res) {
    var landingMenu = renderLandingMenu(req.user);
    res.json({ data: landingMenu.json });
});

// Todo view menu
api.get('/todo/view/:id', getUser, function (req, res) {
    todo.find({ _id: req.params.id }).then(function (todo) {
        var viewMenu = new todo.renderMenu('/templates/todoView', todo);
        viewMenu.header("TODO VIEW");
        res.json({ data: viewMenu.json });
    });
})

api.get('/todo/form/desc', getUser, function (req, res) {
    var fields = [
        { name: 'taskDescription', type: 'string' }
    ];
    // third parameter is any optional data to be provided to the template
    var desc = new todo.renderForm('/templates/todoDescriptionForm', fields, {});
    desc.header("TODO TASK DESCRIPTION");
    res.json({ data: desc.json });
});

api.put('/todoSetDuedate/:id', getUser, function (req, res) {
    todo.find({ _id: req.params.id }).then(function (todo) {
        todo.dueDate = req.body.dueDate;
        return todo.save;
    }).then(function(todo) {
        var landingMenu = renderLandingMenu(req.user);
        landingMenu.preBody("New task added");
        res.json({ data: landingMenu.json });
    });
});

api.post('/todoAddDesc', getUser, function (req, res) {
    var todo = new Todo();
    todo.taskDescription = req.body.taskDescription;
    //todo.dueDate = req.body.dueDate;
    todo.save(function (err, todo) {
        var fields = [
            { name: 'dueDate', type: 'string' }
        ];
        // third parameter is any optional data to be provided to the template
        var dueDate = new todo.renderForm('/templates/todoDuedateForm', fields, todo);
        dueDate.header("TODO TASK DUE DATE");
        res.json({ data: dueDate.json });
    });
});

onem.getUser({onemName: 'chris.h.poc'}, function(user) {


};

onem.getUser({msisdn: '447725419721'}, function(user) {


};

onem.notify(to, text);

onem.sendMsg(from, to, text);

onem.serviceInfo({name: 'market', function: 'getListing', params: [id: '1234']});

onem.location({});
