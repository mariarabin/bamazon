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
                console.log("\n\n\n-------------------Exiting-------------------\n\n\n")
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
            var query = `SELECT product_name, department_name, price, stock_quantity FROM products
        where ?
            `;
            connection.query(query, { item_id: answer.id }, function (err, res) {
                if (err) throw err;
                res.forEach(row => console.log(`\n\nYour order is ${row.product_name} for ${answer.qty} quantity/ies\n`));
                if (res[0].stock_quantity > answer.qty) {
                    var itemQuantity = res[0].stock_quantity - answer.qty;
                    connection.query("UPDATE products SET ? WHERE ?", [
                        {
                            stock_quantity: itemQuantity
                        }, {
                            item_id: answer.id
                        }],
                        function (err, res) {
                        });
                    var cost = res[0].price * answer.qty;
                    console.log('\nOrder is successful! Total cost is $' + cost.toFixed(2) + '\n\n\n--------------------Thank you!--------------------\n\n\n');
                    start();
                } else {
                    console.log("Sorry. Insufficient Supply! Pls. try again with a lower quantity order or a different product.)");
                    connection.end();
                };
            });
        });

};