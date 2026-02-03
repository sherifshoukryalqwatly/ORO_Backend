//--------------------------PRODUCT FILTERS, SORTING AND PAGINATION UTILITIES--------------------------//
export const productFilters = (query)=>{
    const filters = {}

    if(query.search) {
        const searchRegx = new RegExp(query.search,'i');

        filters.$or = [
            { title: { $regex: searchRegx } },
            { description: { $regex: searchRegx } },
            { category: { $regex: searchRegx } },
            { brand: { $regex: searchRegx } },
            { price: { $regex: searchRegx } },
            { material: { $regex: searchRegx } },
            { gender: { $regex: searchRegx } },
            { sportType: { $regex: searchRegx } },
        ]
    }

    if(query.price){
        filters.price = query.price;
    }

    if(query.category){
        filters.category = query.category;
    }

    if(query.brand){
        filters.brand = query.brand;
    }

    if(query.material){
        filters.material = query.material;
    }

    if(query.gender){
        filters.gender = query.gender;
    }

    if(query.sportType){
        filters.sportType = query.sportType;
    }

    return filters
}

export const productSort = (query)=>{
    let sort = {createdAt:-1};
    if(query.sortBy){
        const [filed,order] = query.sort.split(':')
        sort = { [filed]: order === "asc" ? 1 : -1 };
    }
    return sort;
}

export const productPagination = (query)=>{
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    return {page, limit, skip};
}

//--------------------------USER FILTERS, SORTING AND PAGINATION UTILITIES--------------------------//

export const userFilters = (query)=>{
    const filters = {}

    if(query.search) {
        const searchRegx = new RegExp(query.search,'i');

        filters.$or = [
            { name: { $regex: searchRegx } },
            { email: { $regex: searchRegx } },
            { phonenumber: { $regex: searchRegx } },
            { googleid: { $regex: searchRegx } },
            { faceBookid: { $regex: searchRegx } },
            { twitterid: { $regex: searchRegx } },
        ]
    }

    if(query.role){
        filters.role = query.role;
    }

    if(query.isVerified){
        filters.isVerified = query.isVerified;
    }

    if(query.isDeleted){
        filters.isDeleted = query.isDeleted;
    }

    if(query.startDate || query.endDate){
        filters.createdAt = {}
        if(query.startDate) filters.createdAt.$gte = new Date(query.startDate);
        if(query.endDate) filters.createdAt.$lte = new Date(query.endDate);
    }

    return filters
}

export const userSort = (query)=>{
    let sort = {createdAt:-1};
    if(query.sortBy){
        const [filed,order] = query.sort.split(':')
        sort = { [filed]: order === "asc" ? 1 : -1 };
    }
    return sort;
}

export const userPagination = (query)=>{
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    return {page, limit, skip};
}