var todo = {};

todo.Todo = function(data) {
    this.description = m.prop(data.description);
    this.done = m.prop(false);
};

todo.save = function(todos) {
    localStorage["gudos.todos"] = JSON.stringify(todos);
};
todo.load = function() {
    return JSON.parse(localStorage["gudos.todos"] || "[]");
};

todo.TodoList = todo.load();

todo.vm = (function() {
    var vm = {};
    vm.init = function() {
        vm.list = todo.TodoList;
        vm.description = m.prop("");
        vm.add = function() {
            vm.list = todo.TodoList;
            if (vm.description()) {
                vm.list.push(new todo.Todo({description: vm.description()}));
                vm.description("");
                todo.save(vm.list);
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
            m("div", {id: "form", class: "container z-depth-3"}, [
                m("div", {class: "input-field"}, [
                    m("input", {onchange: m.withAttr("value", todo.vm.description), type: "text", id: "todo-input", value: todo.vm.description()}),
                    m("label", {for: "todo-input"}, "Enter GuDo"),
                ]),
            m("button", {onclick: todo.vm.add, class: "waves-effect waves-light btn"}, "Add"),
            ]),
            m("div", {class: "container"}, [
                m("ul", {class: "collection"}, [
                    todo.vm.list.map(function(task, index) {
                        return m("li", {class: "collection-item"}, [
                            m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done(), class:"filled-in", id: task.description()}),
                            m("label", {for: task.description(), style: {textDecoration: task.done() ? "line-through" : "none"}}, task.description()),
                        ]);
                    })
                ]),
            ]),
        ])
    ]);
};

m.mount(document, {controller: todo.controller, view: todo.view});
