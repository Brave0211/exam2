import { errorHandler } from "../errors/errorHandler.js";
import { read, write } from "../utils/FS.js";
import { proPost, proPut } from "../validate/validate.js";

export const PRODUCTSGET = async (req, res, next) => {
   const products = await read("products.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
 
   const category = await read("categories.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
 
   const subCategory = await read("subCategories.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
 
   const newProducts = products.filter((e) => {
     e.productId = e.product_id;
     e.productName = e.product_name;
     delete e.product_id;
     delete e.product_name;
     return e;
   });
   const { categoryId, subCategoryId, model } = req.query;
 
   const subCategoryFilter = subCategory.filter(
     (e) => e.category_id == categoryId
   );

   if (categoryId) {
    const query = [];
    subCategoryFilter.filter((e) => {
      newProducts.map((f) => {
        if (e.sub_category_id == f.sub_category_id) {
          query.push(f);
        }
      });
    });

    return res.send(query);
  }
 
   const subCategoriesFilter = newProducts.filter((e) => {
       const newSubCategoryId = subCategoryId
         ? e.sub_category_id == subCategoryId
         : true;
       const categoryName = model
         ? e.model.toLowerCase().includes(model.toLowerCase())
         : true;
         return categoryName && newSubCategoryId;
   });
 
   res.send(subCategoriesFilter);
};

export const PROGET = async (req, res, next) => {
   const { error, value } = proPut.validate(req.params);
 
   if (error) {
     return next(new errorHandler(error.message, 400));
   }
   const { id } = value;
 
   const products = await read("products.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
 
   const newProduct = products.find((e) => e.product_id == id);
   if (!newProduct) {
     return next(new errorHandler("Product is not found", 500));
   }
 
   const newProductsFilter = [newProduct].filter((e) => {
     e.productId = e.product_id;
     e.productName = e.product_name;
     delete e.product_id;
     delete e.sub_category_id;
     delete e.product_name;
     return e;
   });
 
   res.send(newProductsFilter);
};

export const PROPOST = async (req, res, next) => {
   const { error, value } = proPost.validate(req.body);
 
   if (error) {
     return next(new errorHandler(error, 400));
   }
   const { sub_category_id, model, product_name, color, price } = value;
 
   const products = await read("products.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
 
   products.push({
     product_id: products.at(-1)?.product_id + 1 || 1,
     sub_category_id,
     model,
     product_name,
     color,
     price,
   });
 
   const newProducts = await write("products.model.json", products).catch(
     (error) => next(new errorHandler(error, 500))
   );
 
   if (newProducts) {
     return res.status(200).json({
       message: "Create product",
       status: 200,
     });
   }
};

export const PROPUT = async (req, res, next) => {
   const { error, value } = proPut.validate(req.params);
 
   if (error) {
     return next(new errorHandler(error, 400));
   }
   const { id } = value;
 
   const { error: errors, value: values } = proPost.validate(req.body);
 
   if (errors) {
     return next(new errorHandler(errors.message, 400));
   }
 
   const { sub_category_id, model, product_name, color, price } = values;
 
   const products = await read("products.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
 
   const productsFound = products.find((e) => e.product_id == id);
 
   if (!productsFound) {
     return next(new errorHandler("Id is not found", 500));
   }
   productsFound.sub_category_id = sub_category_id || productsFound.sub_category_id;
   productsFound.model = model || productsFound.model;
   productsFound.product_name = product_name || productsFound.product_name;
   productsFound.color = color || productsFound.color;
   productsFound.price = price || productsFound.price;
 
   const newProducts = await write("products.model.json", products).catch(
     (error) => next(new errorHandler(error, 500))
   );
 
   if (newProducts) {
     return res.status(200).json({
       message: "Update product",
     });
   }
};

export const PRODELETE = async (req, res, next) => {
   const { error, value } = proPut.validate(req.params);
 
   if (error) {
     return next(new errorHandler(error, 400));
   }
   const { id } = value;
 
   const products = await read("products.model.json").catch((error) =>
     next(new errorHandler(error, 500))
   );
 
   const newProductsFind = products.find((e) => e.product_id == id);
 
   if (!newProductsFind) {
     return next(new errorHandler("Product is not found", 500));
   }
 
   const productsFind = products.findIndex((e) => e.product_id == id);
 
   products.splice(productsFind, 1);
 
   const newProducts = await write("products.model.json", products).catch(
     (error) => next(new errorHandler(error, 500))
   );
 
   if (newProducts) {
     return res.status(200).json({
       message: "Delete product",
     });
   }
};