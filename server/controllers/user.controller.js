import { response } from 'express';
import {User} from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';
export const register = async (req, res) => {
    try{
        const{name,email,password} = req.body;
        if(!name || !email || !password) return res.status(400).json({
            success:false,
            message: "All fields are required"
        });
        const user = await User.findOne({email});
        if(user) return res.status(400).json({
            success:false,
            message: "User already exists with this email."
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,email,password:hashedPassword
        });
    return res.status(201).json({
        success:true,
        message: "User registered successfully"
    });
    } 
    catch (error) {
        console.log(error);
        return response.status(500).json({
            success:false,
            message: "Failed to register user"
        });
    }
}

export const login = async (req, res) => {
    try{
        const{email,password} = req.body;
        if(!email || !password) return res.status(400).json({
            success:false,
            message: "All fields are required"
        });
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({
            success:false,
            message: "User not found with this email."
        });
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) return res.status(400).json({
            success:false,
            message: "User not found with this password"
        });
        generateToken(res,user,'Welcome back! ${user.name}');
        return res.status(200).json({
            success:true,
            message: "User logged in successfully"
        });
    } 
    catch (error) {
        console.log(error);
        return response.status(500).json({
            success:false,
            message: "Failed to login user"
        });
    }
}