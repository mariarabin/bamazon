var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var dispTableView = require('./dispList.js');


var connection = mysql.createConnection({
    host: "localhost",
    port: 8890,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err, res) {
    if (err) {
        console.log("DB Connection Error ⛔\n");
        throw err;
    };
    console.log("\n\n\n------------------Connected as ID: " + connection.threadId + "🔗🔗🔗------------------\n");
    displayProducts();
    //connection.end();
});

var displayProducts = function () {
    var display = new dispTableView();
    console.log("\n\n----------------All Available Items for SALE 🥚🧀🍞🍎 ----------------\n");
    connection.query('SELECT * FROM products', function (err, res) {
        display.dispList(res);
        start();
    });
}

/*function displayProducts() {
    console.log("----------All Available Items for SALE----------\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(row => console.log(`${row.item_id}: ${row.product_name}: ${row.department_name}: ${row.price}: ${row.stock_quantity}`));
        start();
    });
};*/


function start() {
    inquirer
        .prompt({
            name: "buyOrnot",
            type: "list",
            message: "Would you like to buy an item?",
            choices: ["Buy an Item", "Exit System"]
        })
        .then(function (answer) {
            if (answer.buyOrnot === "Buy an Item") {
                buyItem();
            }
            else if (answer.buyOrnot === "Exit System") {
                console.log("\n\n\n--------------------Goodbye ⏎⏎⏎--------------------\n\n\n")
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
                res.forEach(row => console.log(`\n\n*****Your order is ${row.product_name} for ${answer.qty} quantity/ies*****\n`));
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
                    console.log('\n  👜   Order is successful! Total cost is $' + cost.toFixed(2) + '\n\n\n--------------------Thank you 🙂  -------------------\n\n\n');
                    start();
                } else {
                    console.log("Sorry. Insufficient Supply! Pls. try again with a lower quantity order or a different product.)");
                    connection.end();
                };
            });
        });

};