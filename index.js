const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
let alert = require('alert');

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));



const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root', /* MySQL User */
  password: '', /* MySQL Password */
  database: 'ecommerce' /* MySQL Database */
});



conn.connect((err) => {
  if (err) throw err;
  console.log('Mysql Connected with App...');
});
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


function generateUniqueId(username) {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  const uniqueId = `${username}${timestamp}${randomString}`;
  return uniqueId;
}


app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("signup");
});


app.post('/auth', function (req, res) {
  let username = req.body.uname;
  let password = req.body.passwd;
  if (username && password) {
    conn.query('SELECT * FROM users WHERE username = ? AND passwd = ?', [username, password], function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        results.forEach((result) => {
          req.session.usrtyp = result.type;
        });
        if (req.session.usrtyp == 1) {
          res.redirect("/dashboard")
        }
        else {
          res.redirect("/dashboard");
        }
      } else {
        res.send('Incorrect Username and/or Password!');
      }
      res.end();
    });
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});
// app.post("/register", function (req, res) {
//   let username = req.body.uname;
//   let password = req.body.passwd;
//   let email = req.body.email;
//   if (username && password) {
//     conn.query(
//       "INSERT INTO users VALUES (null,?,?,?,?,nullB)",
//       [email, username, password, 0],
//       function (error, results, fields) {
//         if (error) throw error;
//         else {
//           res.send("Regustered Successfully!");
//         }
//         res.end();
//       }
//     );

//   } else {
//     res.send("Please enter Username and Password!");
//     res.end();
//   }
// });

app.post("/register", (req, res)=>{
  let username=req.body.uname;
  let password=req.body.passwd;
  let email = req.body.email;
  let usertype=req.body.usertype;


  // console.log(username);
  // console.log(password);
  let cpassword=req.body.cpasswd;
  if(cpassword!=password){
    res.send("Password does not match");
  }

  if(username && password){
    conn.query(
      "INSERT INTO users(email, username, passwd, type) VALUES(?,?,?,?)",
      [email,username,password, usertype],
      function(error, results, fields){
        console.log(results);
        if(error){
         throw error;


        }
        else{
          // res.send("Registered Successfully");
          res.render("login");
        }
        res.end();
      } 
    );
  }
  else{
    res.send("Please enter username and password");
    res.send();
  }
})

app.get("/dashboard", function (req, res) {
  if (req.session.loggedin) {
    res.render("dashboard");
  }
  else {

    // res.send("home")
    res.render("/register");
  }

});
app.get("/addp", function (req, res) {
  let sqlQuery = "SELECT * FROM catergories";


  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    // console.log(results)
    res.render("add_pro", { results });
  });
});
app.post("/addp", function (req, res) {

  let data = { prod_name: req.body.name, description: req.body.des, price: req.body.price, saleprice: req.body.saleprice, category: req.body.category, image_path: 'not config' }
  let sqlQuery = "INSERT INTO products SET ?";

  let query = conn.query(sqlQuery, data, (err, results) => {
    if (err) throw err;
    else {
      res.redirect("/product");
    }
  });
  console.log(data);
});

app.get("/", function (req, res) {

  // let sqlQuery = "SELECT categories.category,products.id,products.prod_name,products.image_path,products.description,products.price,products.saleprice FROM `categories` INNER JOIN products ON products.category = categories.id";
  //   let query = conn.query(sqlQuery,(err, results) => {
  //     if(err) throw err;
  //     else {
  //       res.render("home",{results});
  //     }
  //   });
  res.render("landing");
});
// app.get("/signup", function (req, res) {

//   // let sqlQuery = "SELECT categories.category,products.id,products.prod_name,products.image_path,products.description,products.price,products.saleprice FROM `catergories` INNER JOIN products ON products.category = catergories.id";
//   //   let query = conn.query(sqlQuery,(err, results) => {
//   //     if(err) throw err;
//   //     else {
//   //       res.render("home",{results});
//   //     }
//   //   });
//   res.render("signup")
// });

app.get("/product", function (req, res) {

  let sqlQuery = "SELECT catergories.category,products.id,products.prod_name,products.image_path,products.description,products.price,products.saleprice FROM `catergories` INNER JOIN products ON products.category = catergories.id";
  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    else {
      res.render("home", { results });
    }
  });


});

// app.get("/details/:id",function(req,res){
//   var id=req.params.id;
//   let sqlQuery = "SELECT * from products where id="+id;
//     let query = conn.query(sqlQuery,(err, results) => {
//       if(err) throw err;
//       else {
//         res.render("product",{results});
//       }
//     });
// });
app.get("/checkout/:id", function (req, res) {
  var id = req.params.id;
  console.log(id);
  res.render("checkout", { id })
});
app.post("/buy", function (req, res) {


  if (req.session.loggedin) {
    
    console.log(req.session.username);
    let sqlQuery1 = "SELECT * from addtocart where username=?";

    let query2 = conn.query(sqlQuery1, req.session.username, (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        for (let index = 0; index < results.length; index++) {
          const uniqueId = generateUniqueId(req.session.username);
          let data = { p_id: results[index].p_id, usr_buy: req.session.username, o_id: uniqueId, addr: req.body.addr, tracking: 0, tracking_id: "Not Available", mode: req.body.mode };

         //Adding all items of cart in orders
          let sqlQuery = "INSERT INTO orders SET ?";

          let query = conn.query(sqlQuery, data, (err, results1) => {
            if (err) throw err;
          });

          //deleting every product from cart
          let sqlQuery3 = "DELETE FROM addtocart where id = " + results[index].id;
          let query3 = conn.query(sqlQuery3, (err, results) => {
            if (err) throw err;
          });

        }

      }
    });

    res.send("<H1>orderd</H1>")
  }
  else {
    res.redirect("/login")
  }
});
app.get("/addcart/:id", (req, res) => {
  if (req.session.loggedin) {
    var pid = req.params.id;
    let data = { p_id: pid, username: req.session.username };
    let sqlQuery = "INSERT INTO addtocart SET ?";
    let query = conn.query(sqlQuery, data, (err, results) => {
      if (err) throw err;
      else {
        // res.redirect("/login");
        // res.render("addcart", results);
        res.redirect("/viewcart");
      }
    });
  } else {
    // res.send({ message: "Please login" });
    res.redirect("/login");
    // res.redirect("/viewcart")
  }
});
app.get("/api/deletecartProduct/:id", (req, res) => {
  let sqlQuery = "DELETE FROM addtocart where id = " + req.params.id;
  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    else res.redirect("/viewcart");
  });
});
app.get("/api/increaseQuantity/:id", (req, res) => {
  let sqlQuery =
    "UPDATE addtocart SET quantity = quantity + 1 WHERE id = " + req.params.id;
  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    else res.redirect("/viewcart");
  });
});
app.get("/api/decreaseQuantity/:id", (req, res) => {
  let sqlQuery =
    "UPDATE addtocart SET quantity = quantity - 1 WHERE id = " + req.params.id;
  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    else res.redirect("/viewcart");
  });
});
app.post("/api/updatecartProduct/:id", (req, res) => {
  const productId = req.params.id;
  const newQuantity = req.body.quantity;
  if(newQuantity>5)
  {
    // res.send("Product out of stock")
    alert("Product out of stock")
    res.redirect("/viewcart")
    return ;
  }
  else if(newQuantity<1)
  {
   
    alert("You can not buy less than 1 product")
    res.redirect("/viewcart")
    return ;
  }

  let sqlQuery = `UPDATE addtocart SET quantity = ${newQuantity} WHERE id = ${productId}`;
  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    else res.redirect("/viewcart");
  });
});


app.get("/viewcart", (req, res) => {
  if (req.session.loggedin) {
    let sqlQuery =
      "SELECT addtocart.quantity,addtocart.id,addtocart.p_id,addtocart.username,addtocart.time,products.prod_name ,products.price FROM addtocart INNER JOIN products ON products.id = addtocart.p_id WHERE addtocart.username='" +
      req.session.username +
      "'";

    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.render("addcart", { results });
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/buy", function (req, res) {
  if (req.session.loggedin) {
    const uniqueId = generateUniqueId(req.session.username);
    let data = { p_id: req.body.p_id, user_buy: req.session.username, o_id: req.body.o_id };
    console.log(data);

    let sqlOuery = "INSERT INTO orders SET ?";

    let query = conn.query(sqlQuery, data, (err, results) => {
      if (err) throw err;
    });
    res.send("<H1> Successfully ordered</H1>");

  }
  else {
    res.redirect("/login");
  }
});

app.get("/details/:id", function (req, res) {
  var id = req.params.id;
  let sqlQuery = "SELECT * from products where id=" + id;
  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    else {
      res.render("product", { results });
    }
  });
});


app.get("/view_order", function (req, res) {

  if (req.session.loggedin) {
    let sqlQuery = "SELECT orders.id,orders.p_id,orders.usr_buy,orders.o_id,orders.addr,orders.tracking ,orders.tracking_id,prod_name,orders.mode FROM orders INNER JOIN products ON products.id = orders.p_id WHERE orders.usr_buy='" + req.session.username + "'";

    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.render("view_orders_user", { results });

    });


  }
  else {
    res.redirect("/login");
  }
});

app.get("/view_order_admin", function (req, res) {

  if (req.session.loggedin && req.session.usrtyp) {
    let sqlQuery = "SELECT orders.id,orders.p_id,orders.usr_buy,orders.o_id,orders.addr,orders.tracking ,orders.tracking_id,products.name,orders.mode FROM orders INNER JOIN products ON products.id = orders.p_id";

    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.render("view_orders_admin", { results })
    });
  }
  else {
    res.redirect("/login");
  }
});

app.get("/changestaAccept/:id", function (req, res) {
  var id = req.params.id;
  let sqlQuery = "UPDATE orders SET tracking=1 WHERE id=" + id;

  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.redirect("/view_order_admin");
  });

});
app.get("/changestaDecline/:id", function (req, res) {
  var id = req.params.id;
  let sqlQuery = "UPDATE orders SET tracking=4 WHERE id=" + id;

  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.redirect("/view_order_admin");
  });

});
app.get("/changestaDelivered/:id", function (req, res) {
  var id = req.params.id;
  let sqlQuery = "UPDATE orders SET tracking=3 WHERE id=" + id;

  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.redirect("/view_order_admin");
  });

});
app.post("/addT_id", function (req, res) {
  var id = req.body.oid;
  let sqlQuery = "UPDATE orders SET tracking=2,tracking_id='" + req.body.tid + "' WHERE id=" + id;

  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.redirect("/view_order_admin");
  });

});

app.get("/addtocart/:id", (req, res) => {
  if (req.session.loggedin) {
    var pid = req.params.id;
    let data = { p_id: pid, user: req.session.username };
    let sqlQuery = "INSERT INTO cart SET ?";
    let query = conn.query(sqlQuery, data, (err, results) => {
      if (err) throw err;
      else {
        // res.redirect("/login");
        // res.render("addtocart", results);
        res.redirect("/viewcart");
      }
    })
  } else {
    // res.send({ message: "Please login" });
    res.redirect("/login");
  }
})

app.listen(4000, () => {
  console.log('Server started on port 4000...');
});
