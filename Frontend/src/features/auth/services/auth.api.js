import axios from 'axios';

// register api
export async function register({username, email, password}) {
    
    try{
        const response = await axios.post('http://localhost:3000/api/auth/register',{
        username, email, password
        },{
            withCredentials:true //isse backend k server ko access rehta hai ki vo cookie me data read kar sake or kuch bi date ko set kar sake
        });
        return response.data;
    }
    catch(err){
        console.log("Error Message : ", err.message);
        throw err;
    }
}

// login api
export async function login({email, password}){

    try{
        const response = await axios.post('http://localhost:3000/api/auth/login',{
            email, password
        },{
            withCredentials:true
        });
        return response.data;
    }
    catch(err){
        console.log("Error message : ", err.message);
        throw err;
    }
}

//logout api 
export async function logout(){
    try{
        const response = await axios.get('http://localhost:3000/api/auth/logout',{
            withCredentials:true
        });
        return response.data;
    }
    catch(err){
        console.log("Error Message: ",err.message);
    }
}

// get-me api
export async function getMe(){
    try{
        const response = await axios.get('http://localhost:3000/api/auth/get-me',{
            withCredentials:true
        });
        return response.data;
    }
    catch(err){
        console.log('Error Message: ',err.message);
    }
}