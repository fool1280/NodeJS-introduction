const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");

function loadData() {
    try {
        const buffer = fs.readFileSync("data.json"); //read file to buffer/binary data
        const data = buffer.toString(); //stringtify it
        const dataObj = JSON.parse(data); //convert json into js obj
        return dataObj;
    } catch (error) {
        return [];
    }
}

function listData(req) {
    const data = loadData();
    let temp = data;
    if (Object.keys(data).length === 0) {
        console.log(chalk.green.bold("Empty Todo list!"));
        return;
    }
    if (req) {
        temp = data.filter(({ todo, status }) => status === req);
    }
    console.log(chalk.cyanBright.bold("Todo List:"));
    temp.forEach(({ todo, status, id }) =>
        console.log(
            chalk.yellow.bold(
                `
${id}. ${todo}
   ${status}
`
            )
        )
    );
}

function saveData(data) {
    fs.writeFileSync("data.json", JSON.stringify(data));
}

function addTodo(todo, status) {
    const data = loadData();
    let id = Object.keys(data).length + 1;
    const newTodo = {
        todo: todo,
        status: status,
        id: id,
    }; //shortcut: const newTodo = {todo, status}
    data.push(newTodo);
    saveData(data);
}

/*
if (process.argv[2] === "list") {
    if (process.argv[3] === "incomplete") {
        listData("incomplete");
    } else if (process.argv[3] === "complete") {
        listData("complete");
    } else {
        listData(null);
    }
} else if (process.argv[2] === "add") {
    let todo = process.argv[3];
    let status = "incomplete";
    if (todo) {
        addTodo(todo, status);
    } else {
        console.log("Missing information!");
    }
} else if (process.argv[2] === "toggle") {
    const data = loadData();
    if (process.argv[3]) {
        let query = process.argv[3];
        let index = data.findIndex(
            ({ todo, status, id }) => id === parseInt(query)
        );
        if (index) {
            data[index].status =
                data[index].status === "incomplete" ? "complete" : "incomplete";
            saveData(data);
        } else {
            console.log("No action has this id!");
        }
    } else {
        console.log("Missing id of action!");
    }
} else if (process.argv[2] === "delete_all") {
    const data = [];
    saveData(data);
} else {
    console.log("Cannot understand");
}
*/

yargs.command({
    command: "list",
    describe: "Listing all todos",
    builder: {
        req: {
            describe: "Request all/incomplete/complete",
            demandOption: false,
            type: "string",
            alias: "r",
            default: null,
        },
    },
    handler: function (argv) {
        listData(argv.req);
    },
});

yargs.command({
    command: "add",
    describe: "Add a new todo",
    builder: {
        todo: {
            describe: "todo content",
            demandOption: true,
            type: "string",
            alias: "t",
        },
        status: {
            describe: "Status of your todo",
            demandOption: false,
            type: "string",
            alias: "s",
            default: "incomplete",
        },
    },
    handler: function (argv) {
        addTodo(argv.todo, argv.status);
    },
});

yargs.command({
    command: "add",
    describe: "Add a new todo",
    builder: {
        todo: {
            describe: "todo content",
            demandOption: true,
            type: "string",
            alias: "t",
        },
        status: {
            describe: "Status of your todo",
            demandOption: false,
            type: "string",
            alias: "s",
            default: "incomplete",
        },
    },
    handler: function (argv) {
        addTodo(argv.todo, argv.status);
    },
});

yargs.command({
    command: "toggle",
    describe: "Change status of task",
    builder: {
        id: {
            describe: "Id of task",
            demandOption: true,
            type: "number",
            alias: "i",
        },
    },
    handler: function (argv) {
        const data = loadData();
        let index = data.findIndex(({ todo, status, id }) => id === argv.id);
        if (index > -1) {
            data[index].status =
                data[index].status === "incomplete" ? "complete" : "incomplete";
            saveData(data);
        } else {
            console.log(chalk.red.bold("No action has this id!"));
        }
    },
});

yargs.command({
    command: "delete",
    describe: "Delete a task",
    builder: {
        id: {
            describe: "Id of task",
            demandOption: true,
            type: "number",
            alias: "i",
        },
    },
    handler: function (argv) {
        const data = loadData();
        let index = data.findIndex(({ todo, status, id }) => id === argv.id);
        if (index > -1) {
            data.splice(index, 1);
            saveData(data);
        } else {
            console.log(chalk.red.bold("No action has this id!"));
        }
    },
});

yargs.command({
    command: "delete_all",
    describe: "Delete all tasks",
    handler: function () {
        saveData([]);
    },
});

yargs.parse();
