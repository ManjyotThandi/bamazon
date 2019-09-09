var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon",
});

// makes the actual connection
connection.connect((err)=>{
    if(err) throw err;

    console.log(`Connection successful. Connected on ${connection.threadId}`);

        options();

});

var options = () =>{
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        }
]).then(answers =>{
    if(answers.options === "View Products for Sale"){
        connection.query("SELECT * FROM Products;",(err, res)=>{
            if(err) throw err;
            for (var i in res){
                console.log(`Item Id: ${res[i].item_id} is in the ${res[i].department_name} department, has a price of $ ${res[i].price} and there are ${res[i].stock_quantity} left in stock`)
            }
            connection.end();
        })
    }
    else if(answers.options === "View Low Inventory"){
        connection.query("SELECT * FROM products WHERE stock_quantity < 5;", (err,res)=>{
            for (var i in res){
                console.log(`Item Id: ${res[i].item_id} is in the ${res[i].department_name} department, has a price of $ ${res[i].price} and there are ${res[i].stock_quantity} left in stock`)
            }
            connection.end();
        })
    }
    else if(answers.options === "Add to Inventory"){
        inquirer.prompt([
            {
                type: 'input',
                name: 'addInventory',
                message: 'Which item would you like to restock on?'
            },
            {
                type: 'input',
                name: 'addInvAmt',
                message: 'How much would you like to add?'
            }
        ]).then(answers =>{
            let itemName = answers.addInventory;
            let itemAmt = answers.addInvAmt;
            connection.query(`SELECT stock_quantity FROM products where product_name = (?)`, [itemName],(err,res)=>{
                if(err) throw err;
                var currentAmt = res[0].stock_quantity;
                connection.query(`UPDATE products SET stock_quantity =${parseFloat(itemAmt) + parseFloat(currentAmt)} WHERE product_name = (?)`, [itemName],(err,res)=>{
                    if(err) throw err;
                    console.log('Added. Database has been updated as well.')
                    connection.end()
                })

            })

        })
    }
    else if(answers.options === "Add New Product"){
        inquirer.prompt([
            {
                type: 'input',
                name: 'newProd',
                message: 'What is the new product you would like to add?'
            },
            {
                type: 'input',
                name: 'priceNew',
                message: 'What is the price of one unit?'
            },
            {
                type: 'input',
                name: 'stockNew',
                message: 'How many units do you want to add?'
            },
            {
                type: 'input',
                name: 'newProdDept',
                message: 'What department does this new product belong in?'
            }
        ]).then(answers => {
            let newProd = answers.newProd;
            let newPrice = answers.priceNew;
            let newQuant = answers.stockNew;
            let newProdDept = answers.newProdDept;

            connection.query(`INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("${newProd}", "${newProdDept}",${newPrice},${newQuant});`,(err,res) =>{
                if(err) throw err;
                console.log('New product has been added into the database')
                connection.end()
            })
        })
    }
})
}