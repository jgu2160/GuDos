var todo = {};

todo.Todo = function(data) {
    this.description = m.prop(data.description);
    this.done = m.prop(false);
};

todo.TodoList = Array;

todo.vm = (function() {
    var vm = {};
    vm.init = function() {
        //a running list of todos
        vm.list = new todo.TodoList();

        //a slot to store the name of a new todo before it is created
        vm.description = m.prop("");

        //adds a todo to the list, and clears the description field for user convenience
        vm.add = function() {
            if (vm.description()) {
                vm.list.push(new todo.Todo({description: vm.description()}));
                vm.description("");
            }
        };
    };
    return vm;
}());

todo.controller = function() {
    todo.vm.init();
};

todo.view = function() {
    var materialize_css = "link[href='./css/materialize.css'][rel=stylesheet]";
    var styles_css = "link[href='./css/styles.css'][rel=stylesheet]";
    return m("html", [
        m("head", [
            m("title", "GuDos"),
            m(materialize_css),
            m(styles_css),
        ]),
        m("body", [
            m("h1", "GuDos"),
            m("input", {onchange: m.withAttr("value", todo.vm.description), value: todo.vm.description()}),
            m("button", {onclick: todo.vm.add}, "Add"),
            m("table", [
                todo.vm.list.map(function(task, index) {
                    return m("tr", [
                        m("td", [
                            m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done()})
                        ]),
                        m("td", {style: {textDecoration: task.done() ? "line-through" : "none"}}, task.description()),
                    ]);
                })
            ])
        ])
    ]);
};

m.mount(document, {controller: todo.controller, view: todo.view});
