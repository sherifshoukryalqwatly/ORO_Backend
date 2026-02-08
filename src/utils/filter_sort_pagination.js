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

//--------------------------Address FILTERS, SORTING AND PAGINATION UTILITIES--------------------------//

export const addressFilters = (query)=>{
    const filters = {}

    if(query.search) {
        const searchRegx = new RegExp(query.search,'i');

        filters.$or = [
            { label: { $regex: searchRegx } },
            { country: { $regex: searchRegx } },
            { city: { $regex: searchRegx } },
            { area: { $regex: searchRegx } },
            { street: { $regex: searchRegx } },
            { building: { $regex: searchRegx } },
            { phone: { $regex: searchRegx } },
        ]
    }

    return filters
}

export const addressSort = (query)=>{
    let sort = {createdAt:-1};
    if(query.sortBy){
        const [filed,order] = query.sort.split(':')
        sort = { [filed]: order === "asc" ? 1 : -1 };
    }
    return sort;
}

export const addressPagination = (query)=>{
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    return {page, limit, skip};
}

//--------------------------Banner FILTERS, SORTING AND PAGINATION UTILITIES--------------------------//

export const bannerFilters = (query) => {
  const filters = {};

  // search in localized title & subtitle
  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');

    filters.$or = [
      { 'title.en': { $regex: searchRegex } },
      { 'title.ar': { $regex: searchRegex } },
      { 'subtitle.en': { $regex: searchRegex } },
      { 'subtitle.ar': { $regex: searchRegex } },
    ];
  }

  // filter by active status
  if (query.isActive !== undefined) {
    filters.isActive = query.isActive === 'true';
  }

  return filters;
};

// =========================
// SORT
// =========================
export const bannerSort = (query) => {
  // default: homepage order
  let sort = { displayOrder: 1, createdAt: -1 };

  if (query.sort) {
    const [field, order] = query.sort.split(':');
    sort = { [field]: order === 'asc' ? 1 : -1 };
  }

  return sort;
};

// =========================
// PAGINATION
// =========================
export const bannerPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};