import joi from "joi"

export const loginPost = joi.object({
   username: joi.string().required().max(20).min(3),
   password: joi.string().required().max(20)
})

export const catPost = joi.object({
   category_name: joi.string().required().max(20).min(3),
})

export const catPut = joi.object({
   id: joi.number().required().min(1)
})

export const proPost = joi.object({
   sub_category_id: joi.number().required(),
   model: joi.string().required(),
   product_name: joi.string().required(),
   color: joi.string().required(),
   price: joi.string().required(),
})

export const proPut = joi.object({
   id: joi.number().required().min(1)
})

export const subPost = joi.object({
   category_id: joi.number().required(),
   sub_category_name: joi.string().required()
}) 

export const subId = joi.object({
   id: joi.number().required()
})