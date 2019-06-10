Table = require('cli-table');
var dispTableView = function () {

    this.table = new Table({
        head: ['Item ID', 'Product Name', 'Price', 'Stock Quantity'],
    });

    this.dispList = function (res) {
        this.res = res;
        for (var i = 0; i < this.res.length; i++) {
            this.table.push(
                [this.res[i].item_id, this.res[i].product_name, '$' + this.res[i].price, this.res[i].stock_quantity]);
        }
        console.log('\n' + this.table.toString());
    };
}
module.exports = dispTableView;