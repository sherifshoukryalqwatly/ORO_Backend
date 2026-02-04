import Joi from 'joi';

// Helper to create localized string validation
const localizedStringSchema = (min = 2, max = 500, required = true) => {
  const schema = Joi.object({
    ar: Joi.string()
      .trim()
      .min(min)
      .max(max)
      .messages({
        'string.empty': 'النص العربي مطلوب',
        'string.min': `النص العربي يجب أن لا يقل عن ${min} أحرف`,
        'string.max': `النص العربي يجب أن لا يزيد عن ${max} أحرف`,
        'any.required': 'النص العربي مطلوب'
      }),
    en: Joi.string()
      .trim()
      .min(min)
      .max(max)
      .messages({
        'string.empty': 'English text is required',
        'string.min': `Text must be at least ${min} characters long`,
        'string.max': `Text must not exceed ${max} characters`,
        'any.required': 'English text is required'
      })
  });

  return required ? schema.required() : schema.optional();
};

// Main admin validation schema for CREATE
export const baseValidationRules = {
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(20)
    .required(),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(20)
    .required(),

  role: Joi.string()
    .valid("user", "admin")
    .default('user')
    .messages({
      'any.only': 'Role must be either admin or user / يجب أن يكون الدور إما admin أو user',
    }),

  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.empty': 'Password is required / كلمة المرور مطلوبة',
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password is too long',
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number, and special character',
      'any.required': 'Admin Password is required',
    }),
  confirmPassword: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.empty': 'Admin Password is required / كلمة المرور مطلوبة',
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password is too long',
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number, and special character',
      'any.required': 'Admin Password is required',
    }),
  phonenumber: Joi.string()
    .pattern(/^\+?[0-9]\d{11,11}$/)
    .message({
            'string.pattern.base': 'Please provide a valid phone number /يرجى تقديم رقم هاتف صالح',
            'any.required': 'Phone number is required /رقم الهاتف مطلوب'
        }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),

  isDeleted: Joi.boolean(),

  isVerify: Joi.boolean(),

  deletedAt: Joi.date().allow(null),

  deletedBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      'string.pattern.base': 'Invalid ObjectId format',
    }),

  faceBookid: Joi.string().allow(null, ''),

  googleId: Joi.string().allow(null, ''),

  loginMethods: Joi.array()
    .items(Joi.string().valid('local', 'google', 'facebook'))
    .default(['local'])
    .messages({
      'array.includes':
        'Login method must be one of: local, google, facebook',
    }),
};


//create
export const createUserSchema = Joi.object({
  firstName: baseValidationRules.firstName.required(),
  lastName: baseValidationRules.lastName.required(),
  email: baseValidationRules.email.required(),
  password: baseValidationRules.password.required(),
  confirmPassword: baseValidationRules.confirmPassword.required(),
//   phonenumber: baseValidationRules.phonenumber.required(),
  role: baseValidationRules.role.default('user'),
  isVerify: baseValidationRules.isVerify.default(false),
  googleId: baseValidationRules.googleId,
  loginMethods: baseValidationRules.loginMethods
}).options({
  stripUnknown: true,
  abortEarly: false,
});


//update
export const updateUserSchema = Joi.object({
    firstName: baseValidationRules.firstName.optional(),
    lastName: baseValidationRules.lastName.optional(),
    email: baseValidationRules.email.optional(),
    password: baseValidationRules.password.optional(),
    phonenumber: baseValidationRules.phonenumber.optional(),
    role: baseValidationRules.role.optional(),
    isDeleted: baseValidationRules.isDeleted.optional(),
    deletedAt: baseValidationRules.deletedAt.optional(),
    deletedBy: baseValidationRules.deletedBy.optional(),
    isVerify: baseValidationRules.isVerify.optional(),
    faceBookid: baseValidationRules.faceBookid.optional(),
    googleId: baseValidationRules.googleId.optional(),
    loginMethods: baseValidationRules.loginMethods.optional()
})
.min(1) // ensure at least one field is updated
.options({
    stripUnknown: true,
    abortEarly: false
})
.messages({
    'object.min': 'At least one field must be provided for update / يجب تقديم حقل واحد على الأقل للتحديث'
});


// Social Login Validation Schema (for OAuth registration)
export const socialLoginSchema = Joi.object({
    firstName: baseValidationRules.firstName.optional(),
    lastName: baseValidationRules.lastName.optional(),
    email: baseValidationRules.email.required(),
    googleId: baseValidationRules.googleId.optional(),
    loginMethods: baseValidationRules.loginMethods.required()
}).options({
    stripUnknown: true,
    abortEarly: false
});

// Password Change Validation Schema
export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required /كلمة المرور الحالية مطلوبة'
    }),
    newPassword: baseValidationRules.password.required().messages({
        'any.required': 'New password is required /كلمة المرور الجديدة مطلوبة'
    }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Passwords do not match /كلمات المرور غير متطابقة',
            'any.required': 'Password confirmation is required /تأكيد كلمة المرور مطلوب'
        })
}).options({
    stripUnknown: true,
    abortEarly: false
});

// User ID Validation (for params)
export const userIdSchema = Joi.object({
    id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid user ID format /تنسيق معرف المستخدم غير صالح',
            'any.required': 'User ID is required /معرف المستخدم مطلوب'
        })
});

// Query Parameters Validation (for listing users with filters)
export const getUsersQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    role: Joi.string().valid('user', 'admin').optional(),
    isDeleted: Joi.boolean().optional(),
    isVerify: Joi.boolean().optional(),
    search: Joi.string().max(100).optional(), // For searching by username, email, or name
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'firstName', 'email').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
}).options({
    stripUnknown: true
});

// Helper function to validate data
export const validateUser = {
    create: (data) => createUserSchema.validate(data),
    update: (data) => updateUserSchema.validate(data),
    socialLogin: (data) => socialLoginSchema.validate(data),
    changePassword: (data) => changePasswordSchema.validate(data),
    userId: (data) => userIdSchema.validate(data),
    query: (data) => getUsersQuerySchema.validate(data)
};