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

   displayProducts().then(start);

});

// productsList is no longer in use. Created a promise instead to have the query display and then inquirer start
    
//   function productsList(){
      
//           connection.query("SELECT * FROM products;", (err,res)=>{
//             if(err) throw err;
           
//             for (var i in res){
//                 console.log(`Item Id: ${res[i].item_id} is in the ${res[i].department_name} department, has a price of $ ${res[i].price} and there are ${res[i].stock_quantity} left in stock`)
//             }
//             start();
//            })
           
//    };

   // displayProducts is the new function which uses promises to start inquire after displaying all of the products

   function displayProducts(){
       return new Promise((resolve,reject)=>{
        connection.query("SELECT * FROM products;", (err,res)=>{
            if(err) throw err;
           
            for (var i in res){
                console.log(`Item Id: ${res[i].item_id} is in the ${res[i].department_name} department, has a price of $ ${res[i].price} and there are ${res[i].stock_quantity} left in stock`)
            }
            resolve();
           })
       })
   }


// function for the prompt
var start = () =>{
    inquirer.prompt([
    {
        type: 'list',
        name: 'consent',
        message:'Would you like to buy anything?',
        choices: ["YES", "NO"],
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is the id of the item you would like to buy?',
        when: (answers) =>{
            if(answers.consent === "YES"){
                return true;
            }
        }
    },
    {
        type: 'input',
        name: 'amount',
        message: 'How many units would you like to buy?',
        when: (answers) => {
            if(answers.consent === "YES"){
                return true;
            }
        }
    }
]).then(answers =>{
    if(answers.consent === "YES"){
    // stores the id in a variable
    var itemToBuy = answers.id

    // stores number in stock in stock variable. checks if enough left then updates db accordingly
    connection.query("SELECT * FROM products WHERE item_id = (?);",[itemToBuy],function(err,res){
        if(err) throw err;
        var stock = res[0].stock_quantity;
        var price = res[0].price;
        var total = res[0].product_sales;
        console.log(total);
        if(answers.amount > stock){
            console.log("Insufficent Stock. Please come at a later time, or reduce your order amount")
            connection.end();
        }
        else{
            connection.query(`UPDATE products SET stock_quantity =${stock - answers.amount} WHERE item_id = ${answers.id}; `,function(err,res){
                if(err) throw err;
                console.log(`Your total cost was ${price * answers.amount}`)
                console.log('Done placing order. Enjoy :)')
                connection.end();
            })
            
            connection.query(`UPDATE products SET product_sales =${(parseFloat(price)*parseFloat(answers.amount)) + parseFloat(total)} WHERE item_id=${answers.id}`, (err,res)=>{
                if(err) throw error;
            });
        }
    })
}
else{
    console.log('Have a great day!')
    connection.end();
}  
})
}
