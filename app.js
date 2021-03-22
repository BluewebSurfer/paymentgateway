let express= require("express");
const dotenv = require ("dotenv");
const cors = require ("cors");
const bodyparser = require ("body-parser");
const crypto= require ("crypto");
const  Razorpay = require ("razorpay");
dotenv.config();
let app = express();
const instance= new Razorpay({
    key_id : process.env.key,
    key_secret : process.env.secret
});

//middlewares
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.set("view engine","ejs");

app.get("/payments",function(req,res){
    res.render("home",{key:process.env.key});
})
app.post("/api/payment/order",(req,res)=>{
    params=req.body;
    instance.orders 
    .create(params)
    .then((data)=>{
        res.send({sub:data,status:"success"});
        console.log('success');
    })
    .catch((error) =>{
        res.send({sub:error,status:"failed"});
    });
});
app.post("/api/payment/verify",(req,res)=>{
    body=req.body.Razorpay_order_id +"|"+req.body.razorpay_payment_id;

    var expectedsignature=crypto
    .createHmac("sha256",process.env.key)
    .update(body.toString())
    .digest("hex");
    console.log("sig"+req.body.razorpay_signature);
    console.log("sig"+expectedSignature);
    var response = {status:"failure"};
    if(expectedsignature === req.body.razorpay_signature)
    response ={status:"success"};
    res.send(response)
});


let port = process.env.PORT;
    if (port == null || port == "") {
      port = 8000;
    }
    app.listen(port,function(req,res){
        console.log("server started on port 8000");
    });