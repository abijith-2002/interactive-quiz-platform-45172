const Joi = require('joi');

const optionSchema = Joi.object({
  text: Joi.string()
    .required()
    .messages({
      'any.required': 'Option text is required'
    }),
  isCorrect: Joi.boolean()
    .required()
    .messages({
      'any.required': 'isCorrect flag is required for each option'
    })
});

const questionSchema = Joi.object({
  text: Joi.string()
    .required()
    .messages({
      'any.required': 'Question text is required'
    }),
  options: Joi.array()
    .items(optionSchema)
    .min(2)
    .required()
    .messages({
      'array.min': 'At least 2 options are required for each question',
      'any.required': 'Options are required for each question'
    }),
  points: Joi.number()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Points must be at least 1'
    })
});

const createQuizSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .required()
    .min(10)
    .max(500)
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 500 characters',
      'any.required': 'Description is required'
    }),
  timeLimit: Joi.number()
    .required()
    .min(1)
    .max(180)
    .messages({
      'number.min': 'Time limit must be at least 1 minute',
      'number.max': 'Time limit cannot exceed 180 minutes',
      'any.required': 'Time limit is required'
    }),
  questions: Joi.array()
    .items(questionSchema)
    .min(1)
    .required()
    .messages({
      'array.min': 'At least 1 question is required',
      'any.required': 'Questions are required'
    }),
  isPublished: Joi.boolean()
    .default(false)
});

const updateQuizSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters'
    }),
  description: Joi.string()
    .min(10)
    .max(500)
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 500 characters'
    }),
  timeLimit: Joi.number()
    .min(1)
    .max(180)
    .messages({
      'number.min': 'Time limit must be at least 1 minute',
      'number.max': 'Time limit cannot exceed 180 minutes'
    }),
  questions: Joi.array()
    .items(questionSchema)
    .min(1)
    .messages({
      'array.min': 'At least 1 question is required'
    }),
  isPublished: Joi.boolean()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const submitQuizSchema = Joi.object({
  answers: Joi.array()
    .items(Joi.object({
      question: Joi.string()
        .required()
        .messages({
          'any.required': 'Question ID is required for each answer'
        }),
      selectedOption: Joi.string()
        .required()
        .messages({
          'any.required': 'Selected option ID is required for each answer'
        })
    }))
    .required()
    .messages({
      'any.required': 'Answers are required'
    }),
  timeSpent: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.min': 'Time spent cannot be negative',
      'any.required': 'Time spent is required'
    })
});

module.exports = {
  createQuizSchema,
  updateQuizSchema,
  submitQuizSchema
};
