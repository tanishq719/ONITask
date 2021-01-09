const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")
const bcrypt = require("bcrypt")
const { static, response } = require("express")
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function(req, file, cb){
        console.log("inside filename");
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})

// middleware
app.use(express.static('frontend'))
app.use('/static',express.static('frontend'))
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// routes

// index(
app.get("/",(req,res)=>{
    res.sendFile('./frontend/index.html',{root:__dirname});
})

// accessing images
app.get("/uploads/:id",(req,res)=>{
    res.sendFile('./uploads/'+req.params.id,{root:__dirname})
})

// signup 
app.post("/signup",async (req,res)=>{
    if(req.body.password !== req.body.confirm_password)
        req.sendStatus(403).json({message:"confirm password doesnt match"})
    else{
        try{
            const {first_name,last_name,email_id,password,confirm_password} = req.body;
            var hashPassword = await bcrypt.hash(password,10);
            pool.query("INSERT INTO nuser VALUES($1,$2,$3,$4)",[first_name,last_name,email_id,hashPassword])
            .then(()=>{
                const user = {first_name,last_name,email_id};
                jwt.sign({user},"secretkey",(err,token)=>{
                    res.status(201).json({
                        token:token
                    });
                })
            })
            .catch(err=>console.log(err))
        }catch(err){
            console.log(err)
            response.sendStatus(400);
        }
    }
})

// login
app.post('/login',async (req,res)=>{
    pool.query("SELECT * FROM nuser WHERE email_id = $1",[req.body.email_id],(err,result)=>{
        if(err)
            res.status(403).json({msg:"wrong password"})
        else if(result.rows.length > 0){
            var user = result.rows[0];
            bcrypt.compare(req.body.password,user.password,(err,isMatch)=>{
                if(err || !isMatch)
                    res.status(403).json({msg:"wrong password"});
                else if(isMatch){
                    var first_name = user.first_name;
                    var last_name = user.last_name;
                    var email_id = user.email_id;
                    var nuser = {first_name,last_name,email_id};
                    jwt.sign({nuser},"secretkey",(err,token)=>{
                        res.status(201).json({
                            token:token
                        });
                    })
                }
            });
        }
        else{
            res.status(403).json({msg:"user doesnt exist, kindly signup"});
        }
    })
});

//create post
app.post("/createpost",verifyToken, upload.fields([{name:'images',maxCount:10},{name:'vedios',maxCount:10}]),(req,res)=>{
    jwt.verify(req.token, "secretkey",(err,authData)=>{
        if(err){
            console.log("inside jwt verify")
            res.sendStatus(403);
        }
        else{   
            console.log(req)
            console.log(req.files);
            console.log(authData)
            var imageFileNames = [];
            var vedioFileNames = [];
            if(req.files['images'].length !== undefined)
            {
                for(var filemetadata of req.files['images']){
                    imageFileNames.push(filemetadata['filename'])
                }
            }
            if(req.files['vedios'] !== undefined)
            {
                for(var filemetadata of req.files['vedios']){
                    vedioFileNames.push(filemetadata['filename'])
                }
            }
            console.log(imageFileNames)
            console.log(vedioFileNames)

            pool.query("INSERT INTO post(post_body,post_images,post_vedios,email_id) VALUES($1,$2,$3,$4)",[req.body.post_body,imageFileNames,vedioFileNames,authData.nuser.email_id])
            .then(()=>{
                res.sendStatus(201);
            })
            .catch(err=>{
                console.log(err);
                res.sendStatus(400);
            })
        }
    })
});

// delete post

//fetch post
app.get("/fetchposts",verifyToken,(req,res)=>{
    jwt.verify(req.token, "secretkey",(err,authData)=>{
        if(err){
            console.log("inside jwt verify")
            res.sendStatus(403);
        }
        else{ 
            pool.query("SELECT * FROM post ORDER BY post_id DESC LIMIT 10",(err,result)=>{
                if(err){
                    console.log(err);
                    res.sendStatus(400);
                }
                else if(result.rows.length > 0){
                    res.status(201).json({posts:result.rows});
                }
            })
        }})
});

//view post
app.get("/viewpost",verifyToken, (req,res)=>{
    jwt.verify(req.token, "secretkey",(err,authData)=>{
        if(err){
            console.log("inside jwt verify")
            res.sendStatus(403);
        }
        else{
            res.sendFile('./frontend/feed.html',{root:__dirname})    
        }
    })
})

function verifyToken(req,res,next){
    // console.log(req.headers);
    const bearerHeader = req.headers['authorization'];
    // console.log(bearerHeader)
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{
        console.log("inside verifyToken")
        res.sendStatus(403);
    }
}

//search post
app.get("/searchposts/tag=:tag",verifyToken,(req,res)=>{
    jwt.verify(req.token, "secretkey",(err,authData)=>{
        if(err){
            console.log("inside jwt verify")
            res.sendStatus(403);
        }
        else{ 
            console.log(req.params.tag)
            pool.query("SELECT * FROM post WHERE post_body LIKE '%"+req.params.tag+"%' ORDER BY post_id DESC LIMIT 10;",(err,result)=>{
                if(err){
                    console.log(err);
                    res.sendStatus(400);
                }
                else if(result.rows.length > 0){
                    console.log("inside resultset")
                    res.status(201).json({posts:result.rows});
                }
            })
        }})
});

app.listen(5000, ()=>{
    console.log("app is listening on port 5000...")
});