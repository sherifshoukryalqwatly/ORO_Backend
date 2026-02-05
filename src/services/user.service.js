import * as userRepo from '../repos/user.repo.js';
import ApiError from '../utils/ApiError.js';
import { encryptRSA } from '../utils/bcrypt.js';
import { globalRegex } from '../utils/constants.js';
import {userSort,userPagination, userFilters} from '../utils/filter_sort_pagination.js';

//create
export const create = async (data) => {
    // 1) Check unique email
    if (data.email) {
        const emailExists = await userRepo.findByEmail(data.email);
        if (emailExists) {
            throw ApiError.badRequest(
                "Email already exists / البريد الإلكتروني موجود بالفعل"
            );
        }
    }

    const user = await userRepo.create(data);
    return user;
};
//find
export const findById = async (id) => {
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        throw ApiError.badRequest('Invalid User Id / Id خطأ')
    }
    const user = await userRepo.findById(id);
    if(!user) throw  ApiError.notFound('User not Found / المستخدم غير موجود');

    return user;
}

export const findByEmail = async (email)=> {
    if(!email) throw ApiError.badRequest('User Email is Required / البريد الالكترونى للمستخدم مطلوب');
    if(!globalRegex.emailRegex.test(email)) throw ApiError.badRequest('Invalid Email Format / البريد الالكترونى خطأ');
    const user = await userRepo.findByEmail(email);
    if(!user) throw ApiError.notFound('User not Found')
    return user
}

export const findByPhone = async (phone)=> {
    if(!phone) throw ApiError.badRequest('User Phone is Required / رقم الهاتف للمستخدم مطلوب');
    if(!globalRegex.phoneRegex.test(phone)) throw ApiError.badRequest('Invalid Phone Format / رقم الهاتف خطأ');
    const user = await userRepo.findByPhone(phone);
    if(!user) throw ApiError.notFound('User not Found')
    return user
}
//findAll
export const findAll = async (query = {})=>{
    const filters = userFilters(query);
    const sort = userSort(query);
    const pagination = userPagination(query)

    const {users,total} = await userRepo.findAll(filters,sort,pagination);
    const pages = Math.ceil(total / (pagination.limit || total));
    return {users,total,pages}
}
//update
export const update = async (id, newData) => {
    if(!id.match(/^[0-9a-fA-F]{24}$/)) 
        throw ApiError.badRequest('Invalid User Id / Id المستخدم خطأ');

    if(newData.email && !globalRegex.emailRegex.test(newData.email)) 
        throw ApiError.badRequest('Invalid Email Format / البريد الالكترونى خطأ');

    if(newData.phonenumber && !globalRegex.phoneRegex.test(newData.phonenumber)) 
        throw ApiError.badRequest('Invalid Phone Format / رقم الهاتف خطأ');

    console.log(newData.phonenumber);
    
    if (newData.phonenumber) {
        console.log("Phone to encrypt:", newData.phonenumber);
        newData.phonenumber = encryptRSA(newData.phonenumber);
    }
    
    const user = await userRepo.findById(id);
    if(!user) throw ApiError.notFound('User not Found / المستخدم غير موجود');

    if(newData.email && newData.email !== user.email) {
        const existUser = await userRepo.findByEmail(newData.email)
        if(existUser) throw ApiError.conflict('Email already in use / البريد الالكترونى مستخدم مسبقا');
    }

    return await userRepo.update(id, newData);
}


//hard delete 
export const hRemove = async (id)=>{
    const user = await userRepo.findById(id);
    if(!user) throw ApiError.notFound('User not Found / المستخدم غير موجود');
    await userRepo.hRemove(id);
    return {message: "User deleted Successfully / تم حذف المستخدم بنجاح"}
}
//soft delete
export const remove = async (id)=>{
    const user = await userRepo.findById(id);
    if(!user) throw ApiError.notFound('User not Found / المستخدم غير موجود');
    await userRepo.remove(id);
    return {message: "User Deleted Successfully / تم حذف المستخدم بنجاح"}
}
//hard delete all
export const hRemoveAll = async (ids)=>{
    if(!Array.isArray(ids)|| ids.length === 0) throw ApiError.badRequest('IDs Array is Required / مصفوفه من Ids مطلوبه');
    const objIds = ids.filter((id)=> id.match(/^[0-9a-fA-F]{24}$/))
    const result = await userRepo.hRemoveAll(objIds);
    return {message: `${result.deletedCount} Users Deleted Successfully / تم حذف المستخدمين بنجاح`} 
}
//soft delete all
export const removeAll = async (ids)=>{
    if(!Array.isArray(ids)|| ids.length === 0) throw ApiError.badRequest('IDs Array is Required / مصفوفه من Ids مطلوبه');
    const objIds = ids.filter((id)=> id.match(/^[0-9a-fA-F]{24}$/))
    const result = await userRepo.removeAll(objIds);
    return {message: `${result.deletedCount} Users Deleted Successfully / تم حذف المستخدمين بنجاح`} 
}

//Get Me
export const getMe = async (id)=>{
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        throw ApiError.badRequest('Invalid User Id / Id خطأ')
    }
    const user = await userRepo.getMe(id);
    if(!user) throw  ApiError.notFound('User not Found / المستخدم غير موجود');

    return await userRepo.getMe(id);
}