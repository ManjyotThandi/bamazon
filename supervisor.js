var mysql = require('mysql');
var inquirer = require('inquirer');
var cTable = require('console.table');
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

    supervisorUI();

});


var supervisorUI = () =>{
    inquirer.prompt([
        {
            type: 'list',
            name: 'supOptions',
            choices: ["View Product Sales by Department", "Create New Department"]

        }
    ]).then(answers =>{
        if(answers.supOptions === "View Product Sales by Department"){
            connection.query(`SELECT d.department_id,d.department_name,d.over_head_costs,SUM(p.product_sales) AS Sales,
            (SUM(p.product_sales) - d.over_head_costs) AS Total_Profit
            FROM products p
            INNER JOIN departments d
            ON d.department_id=p.department_id
            GROUP BY (d.department_id);`, (err , res) =>{
                if(err) throw err;
                console.table(res);
            })
            connection.end()
        }
        else if(answers.supOptions === "Create New Department"){
            inquirer.prompt([
                {
                    type:'input',
                    name: 'newDeptName',
                    message: 'What is the name of the new department?'
                },
                {
                    type: 'input',
                    name: 'newDeptCost',
                    message: 'What is the overhead cost associated with this department?'
                }
            ]).then(answers => {
                let newDeptName = answers.newDeptName;
                let newDeptCost = answers.newDeptCost;
                connection.query(`INSERT INTO departments(department_name,over_head_costs) VALUES((?),(?))`,[newDeptName,newDeptCost],(err,res)=>{
                    if(err) throw err;
                    console.log('New Department added.')
                })
                connection.end();

            })
        }
    })
}