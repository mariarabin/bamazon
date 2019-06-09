var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8890,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err, res) {
    if (err) throw err;
    console.log("---------------Connected as ID: " + connection.threadId + "---------------\n");
    displayProducts();
    //connection.end();
});


function displayProducts() {
    console.log("----------All Available Items for SALE----------\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(row => console.log(`${row.item_id}: ${row.product_name}: ${row.department_name}: ${row.price}: ${row.stock_quantity}`));
        start();
    });
};


function start() {
    inquirer
        .prompt({
            name: "buyOrnot",
            type: "list",
            message: "Would you like to buy an item?",
            choices: ["Buy", "Exit"]
        })
        .then(function (answer) {
            if (answer.buyOrnot === "Buy") {
                buyItem();
            }
            else if (answer.buyOrnot === "Exit") {
                connection.end();
            }
        });
}


function buyItem() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the product id of the item that you want to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "qty",
                type: "input",
                message: "How many items do you want to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT * FROM products";
            connection.query(query, function (err, res) {
                console.log("----------Checking supplies...----------");
                checkSupplies();
            });
        });

};
