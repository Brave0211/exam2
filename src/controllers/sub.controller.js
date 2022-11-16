import { errorHandler } from "../errors/errorHandler.js";
import { read, write } from "../utils/FS.js";
import { subId, subPost } from "../validate/validate.js";

export const SUBGET = async (req, res, next) => {
   const { error, value } = subId.validate(req.params);
 
   if (error) {
     return next(new errorHandler(error.message, 400));
   }
   const { id } = value;
 
   const subCategory = await read("subCategories.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
   const products = await read("products.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
 
   const newSubCategory = subCategory.find((e) => e.sub_category_id == id);
 
   if (!newSubCategory) {
     return next(new errorHandler("Sub-category is not found", 500));
   }
   const data = [newSubCategory].map((e) => {
     e.subCategoryId = e.sub_category_id;
     e.subCategoryName = e.sub_category_name;
     e.products = [];
     delete e.category_id;
     delete e.sub_category_id;
     delete e.sub_category_name;
     products.filter((f) => {
       f.productName = f.product_name;
       if (f.sub_category_id == e.subCategoryId) {
         delete f.product_name;
         delete f.sub_category_id;
         e.products.push(f);
       }
     });
     return e;
   });
 
   res.send(data);
};

export const SUBCATEGORYSGET = async (req, res, next) => {

   const subCategory = await read("subCategories.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
   const products = await read("products.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
   const data = subCategory.map((e) => {
     e.subCategoryId = e.sub_category_id;
     e.subCategoryName = e.sub_category_name;
     e.products = [];
     delete e.category_id
     delete e.sub_category_id;
     delete e.sub_category_name;
 
     products.map((f) => {
       if (f.sub_category_id == e.subCategoryId && delete f.sub_category_id) {
         f.productName = f.product_name
         delete f.product_name;
         e.products.push(f);
       }
     });
     return e;
   });
 
   const { subCategoryId, subCategoryName } = req.query;
 
   const dataFilter = data.filter((e) => {
     const categoryId = subCategoryId ? e.subCategoryId == subCategoryId : true;
     const categoryName = subCategoryName
       ? e.subCategoryName.toLowerCase().includes(subCategoryName.toLowerCase())
       : true;
 
     return categoryId && categoryName;
   });
 
   res.send(dataFilter);
};

export const SUBPOST = async (req, res, next) => {
   const { error, value } = subPost.validate(req.body);
 
   if (error) {
     return next(new errorHandler(error.message, 400));
   }
   const { category_id, sub_category_name } = value;
 
   const subCategory = await read("subCategories.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
 
   subCategory.push({
     sub_category_id: subCategory.at(-1)?.sub_category_id + 1 || 1,
     category_id,
     sub_category_name,
   });
 
   const newSubCategory = await write(
     "subCategories.model.json",
     subCategory
   ).catch((error) => next(new errorHandler(error, 500)));
 
   if (newSubCategory) {
     return res.status(200).json({
       message: "Create subCategory",
       status: 200,
     });
   }
};

export const SUBPUT = async (req, res, next) => {
   const { error, value } = subId.validate(req.params);
 
   if (error) {
     return next(new errorHandler(error.message, 400));
   }
   const { id } = value;
 
   const { error: errors, value: values } = subPost.validate(req.body);
 
   if (errors) {
     return next(new errorHandler(errors.message, 400));
   }
   const { category_id, sub_category_name } = values;
 
   const subCategory = await read("subCategories.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
 
   const subCategoryFind = subCategory.find((e) => e.sub_category_id == id);
 
   if (!subCategoryFind) {
     return next(new errorHandler("Sub-category is not found", 500));
   }
 
   subCategoryFind.category_id = category_id || subCategoryFind.category_id;
   subCategoryFind.sub_category_name = sub_category_name || subCategoryFind.sub_category_name;
 
   const newSubCategory = await write(
     "subCategories.model.json",
     subCategory
   ).catch((error) => next(new errorHandler(error, 500)));
 
   if (newSubCategory) {
     return res.status(200).json({
       message: "Update sub-category",
     });
   }
};

export const SUBDELETE = async (req, res, next) => {
   const { error, value } = subId.validate(req.params);
 
   if (error) {
     return next(new errorHandler(error.message, 400));
   }
   const { id } = value;
 
   const subCategory = await read("subCategories.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
   const newSubCategoryFind = subCategory.find(
     (e) => e.sub_category_id == id
   );
 
   if (!newSubCategoryFind) {
     return next(new errorHandler("Sub-category is not found", 500));
   }
 
   const subCategoryFind = subCategory.findIndex(
     (e) => e.sub_category_id == id
   );
 
   subCategory.splice(subCategoryFind, 1);
 
   const newSubCategory = await write(
     "subCategories.model.json",
     subCategory
   ).catch((error) => next(new errorHandler(error, 500)));
 
   if (newSubCategory) {
     return res.status(200).json({
       message: "Delete sub-category",
     });
   }
};