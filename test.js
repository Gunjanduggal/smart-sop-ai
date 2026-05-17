require('dotenv').config();

if(process.env.OPENAI_API_KEY){
    console.log("API Key Loaded Successfully");
}else{
    console.log("API Key Missing");
}