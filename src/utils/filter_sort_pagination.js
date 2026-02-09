//--------------------------PRODUCT FILTERS, SORTING AND PAGINATION UTILITIES--------------------------//

export const productFilters = (query = {}) => {
  const filters = {};

  // ----- Full-text search using MongoDB text index ----- //
  if (query.search) {
    filters.$text = { $search: query.search };
  }

  // ----- Price range filter ----- //
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
  }

  // ----- Exact match filters ----- //
  const exactFields = ["category", "brand", "material", "gender", "sportType", "isActive"];
  exactFields.forEach((field) => {
    if (query[field] !== undefined) filters[field] = query[field];
  });

  return filters;
};

export const productSort = (query = {}) => {
  let sort = { createdAt: -1 }; // default: newest first

  if (query.sort) {
    // format: "field:asc" or "field:desc"
    const [field, order] = query.sort.split(":");
    if (field) sort = { [field]: order === "asc" ? 1 : -1 };
  }

  return sort;
};

export const productPagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

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

export const bannerSort = (query) => {
  // default: homepage order
  let sort = { displayOrder: 1, createdAt: -1 };

  if (query.sort) {
    const [field, order] = query.sort.split(':');
    sort = { [field]: order === 'asc' ? 1 : -1 };
  }

  return sort;
};

export const bannerPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
//--------------------------Notification FILTERS, SORTING AND PAGINATION UTILITIES--------------------------//

export const notificationFilters = (query = {}) => {
    const filters = {};
    if (query.type) filters.type = query.type.toUpperCase();
    return filters;
};

export const notificationSort = (query = {}) => {
    if (query.sortBy) {
        return { [query.sortBy]: query.order === "asc" ? 1 : -1 };
    }
    return { createdAt: -1 };
};

export const notificationPagination = (query = {}) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
//--------------------------Order FILTERS, SORTING AND PAGINATION UTILITIES--------------------------//

export const orderFilters = (query = {}) => {
  const filters = {};

  if (query.status) {
    filters.orderStatus = query.status.toLowerCase();
  }

  if (query.paymentStatus) {
    filters.paymentStatus = query.paymentStatus.toLowerCase();
  }

  if (query.userId) {
    filters.user = query.userId;
  }

  if (query.startDate || query.endDate) {
    filters.createdAt = {};
    if (query.startDate) filters.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filters.createdAt.$lte = new Date(query.endDate);
  }

  return filters;
};

export const orderSort = (query = {}) => {
  if (!query.sortBy) return { createdAt: -1 };
  const [field, order] = query.sortBy.split(":");
  return { [field]: order === "asc" ? 1 : -1 };
};

export const orderPagination = (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

//--------------------------Payment FILTERS, SORTING AND PAGINATION UTILITIES--------------------------//

export const paymentFilters = (query = {}) => {
  const filters = {};

  // ----- Filter by user ----- //
  if (query.user) filters.user = query.user;

  // ----- Filter by order ----- //
  if (query.order) filters.order = query.order;

  // ----- Filter by paymentMethod ----- //
  if (query.paymentMethod) filters.paymentMethod = query.paymentMethod;

  // ----- Filter by status ----- //
  if (query.status) filters.status = query.status.toLowerCase();

  // ----- Filter by currency ----- //
  if (query.currency) filters.currency = query.currency;

  // ----- Filter by amount range ----- //
  if (query.minAmount || query.maxAmount) {
    filters.amount = {};
    if (query.minAmount) filters.amount.$gte = Number(query.minAmount);
    if (query.maxAmount) filters.amount.$lte = Number(query.maxAmount);
  }

  return filters;
};

export const paymentSort = (query = {}) => {
  let sort = { createdAt: -1 }; // default: newest first

  if (query.sort) {
    // format: "field:asc" or "field:desc"
    const [field, order] = query.sort.split(":");
    if (field) sort = { [field]: order === "asc" ? 1 : -1 };
  }

  return sort;
};

export const paymentPagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

//--------------------------Refund FILTERS, SORTING AND PAGINATION UTILITIES--------------------------//

export const refundFilters = (query = {}) => {
  const filters = {};

  // ----- Filter by user ----- //
  if (query.user) filters.user = query.user;

  // ----- Filter by order ----- //
  if (query.order) filters.order = query.order;

  // ----- Filter by payment ----- //
  if (query.payment) filters.payment = query.payment;

  // ----- Filter by status ----- //
  if (query.status) filters.status = query.status.toLowerCase();

  // ----- Filter by amount range ----- //
  if (query.minAmount || query.maxAmount) {
    filters.amount = {};
    if (query.minAmount) filters.amount.$gte = Number(query.minAmount);
    if (query.maxAmount) filters.amount.$lte = Number(query.maxAmount);
  }

  return filters;
};

export const refundSort = (query = {}) => {
  let sort = { createdAt: -1 }; // default: newest first

  if (query.sort) {
    // format: "field:asc" or "field:desc"
    const [field, order] = query.sort.split(":");
    if (field) sort = { [field]: order === "asc" ? 1 : -1 };
  }

  return sort;
};

export const refundPagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

//--------------------------Shipping FILTERS, SORTING AND PAGINATION UTILITIES--------------------------//

export const shippingFilters = (query = {}) => {
  const filters = {};

  // ----- Filter by order ----- //
  if (query.order) filters.order = query.order;

  // ----- Filter by carrier ----- //
  if (query.carrier) filters.carrier = query.carrier;

  // ----- Filter by status ----- //
  if (query.status) filters.status = query.status.toLowerCase();

  // ----- Filter by estimated delivery range ----- //
  if (query.startDate || query.endDate) {
    filters.estimatedDelivery = {};
    if (query.startDate) filters.estimatedDelivery.$gte = new Date(query.startDate);
    if (query.endDate) filters.estimatedDelivery.$lte = new Date(query.endDate);
  }

  return filters;
};

export const shippingSort = (query = {}) => {
  let sort = { createdAt: -1 }; // default: newest first

  if (query.sort) {
    // format: "field:asc" or "field:desc"
    const [field, order] = query.sort.split(":");
    if (field) sort = { [field]: order === "asc" ? 1 : -1 };
  }

  return sort;
};

export const shippingPagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

//--------------------------Review FILTERS, SORTING AND PAGINATION UTILITIES--------------------------//

export const reviewFilters = (query = {}) => {
  const filters = {};

  // ----- Filter by user ----- //
  if (query.user) filters.user = query.user;

  // ----- Filter by product ----- //
  if (query.product) filters.product = query.product;

  // ----- Filter by rating range ----- //
  if (query.minRating || query.maxRating) {
    filters.rating = {};
    if (query.minRating) filters.rating.$gte = Number(query.minRating);
    if (query.maxRating) filters.rating.$lte = Number(query.maxRating);
  }

  // ----- Filter by verified purchase ----- //
  if (query.isVerifiedPurchase !== undefined) {
    filters.isVerifiedPurchase = query.isVerifiedPurchase === 'true' || query.isVerifiedPurchase === true;
  }

  return filters;
};

export const reviewSort = (query = {}) => {
  let sort = { createdAt: -1 }; // default: newest first

  if (query.sort) {
    // format: "field:asc" or "field:desc"
    const [field, order] = query.sort.split(":");
    if (field) sort = { [field]: order === "asc" ? 1 : -1 };
  }

  return sort;
};

export const reviewPagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
