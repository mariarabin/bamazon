var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

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
    connection.end();
});


function displayProducts() {
    console.log("----------All Available Items for SALE----------\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(row => console.log(`${row.product_name}: ${row.department_name}: ${row.price}: ${row.stock_quantity}`));
    });
};
