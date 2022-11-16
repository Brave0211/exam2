import { read, write } from "../utils/FS.js";
import { errorHandler } from "../errors/errorHandler.js";
import { catPost, catPut } from "../validate/validate.js";

export const CATEGORIEGET = async (req, res, next) => {
  const { error, value } = catPut.validate(req.params);

  if (error) {
    return next(new errorHandler(error.message, 400));
  }

  const { id } = value;
  const category = await read("categories.model.json").catch((error) =>
    next(new errorHandler(error, 500))
  );

  const subCategory = await read("subCategories.model.json").catch((error) =>
    next(new errorHandler(error, 500))
  );

  const categories = category.find((e) => e.category_id == id);

  if (!categories) {
    return next(new errorHandler("Id is not found", 500));
  }

  const data = [categories].map((e) => {
    e.categoryId = e.category_id;
    e.categoryName = e.category_name;
    e.subCategory = e.subCategory;
    e.subCategory = [];
    delete e.category_id;
    delete e.category_name;
    subCategory.filter((f) => {
      f.subCategoryId = f.sub_category_id;
      f.subCategoryName = f.sub_category_name;
      delete f.sub_category_id;
      delete f.sub_category_name;
      if (f.category_id == e.categoryId && delete f.category_id) {
        e.subCategory.push(f);
      }
    });
    return e;
  });

  res.send(data);
};

export const CATGET = async (req, res, next) => {
  const category = await read("categories.model.json").catch((error) =>
    next(new errorHandler(error, 500))
  );
  const subCategory = await read("subCategories.model.json").catch((error) =>
    next(new errorHandler(error, 500))
  );
  const data = category.map((e) => {
    e.categoryId = e.category_id;
    e.categoryName = e.category_name;
    e.subCategories = e.subCategories;
    e.subCategories = [];
    delete e.category_id;
    delete e.category_name;

    subCategory.map((f) => {
      if (f.category_id == e.categoryId && delete f.category_id) {
        f.subCategoryId = f.sub_category_id;
        f.subCategoryName = f.sub_category_name;
        delete f.sub_category_id;
        delete f.sub_category_name;
        e.subCategories.push(f);
      }
    });
    return e;
  });

  const { categoryId, categoryName } = req.query;

  const dataFounder = data.filter((e) => {
    const category_id = categoryId ? e.categoryId == categoryId : true;
    const category_name = categoryName
      ? e.categoryName.toLowerCase().includes(categoryName.toLowerCase())
      : true;

    return category_id && category_name;
  });

  res.send(dataFounder);
};

export const CATPOST = async (req, res, next) => {
  const { error, value } = catPost.validate(req.body);
  

  if (error) {
    return next(new errorHandler(error.message, 400));
  }
  const { category_name } = value;

  const category = await read("categories.model.json").catch((error) =>
    next(new errorHandler(error, 500))
  );

  category.push({
    category_id: category.at(-1)?.category_id + 1 || 1,
    category_name,
  });

  const newCategory = await write("categories.model.json", category).catch(
    (error) => next(new errorHandler(error, 500))
  );

  if (newCategory) {
    return res.status(200).json({
      message: "Create category",
      status: 200,
    });
  }
};

export const CATPUT = async (req, res, next) => {
  const { error, value } = catPut.validate(req.params);

  if (error) {
    return next(new errorHandler(error.message, 400));
  }
  const { id } = value;

  const { error: errors, value: values } = catPost.validate(req.body);

  if (errors) {
    return next(new errorHandler(errors.message, 400));
  }
  const { category_name } = values;

  const category = await read("categories.model.json").catch((error) =>
    next(new errorHandler(error, 500))
  );

  const categoryFound = category.find((e) => e.category_id == id);

  if (!categoryFound) {
    return next(new errorHandler("Category is not found", 500));
  }

  categoryFound.category_name = category_name || categoryFound.category_name;
  const newCategory = await write("categories.model.json", category).catch(
    (error) => next(new errorHandler(error, 500))
  );

  if (newCategory) {
    return res.status(200).json({
      message: "Update success",
    });
  }
};

export const CATDELETE = async (req, res, next) => {
  const { error, value } = catPut.validate(req.params);

  if (error) {
    return next(new errorHandler(error.message, 400));
  }
  const { id } = value;

  const category = await read("categories.model.json").catch((error) =>
    next(new errorHandler(error, 500))
  );
  const categorieFind = category.find((e) => e.category_id == id);

  if (!categorieFind) {
    return next(new errorHandler("Category is not found", 500));
  }

  const categoryFind = category.findIndex((e) => e.category_id == id);

  category.splice(categoryFind, 1);

  const newCategory = await write("categories.model.json", category).catch(
    (error) => next(new errorHandler(error, 500))
  );

  if (newCategory) {
    return res.status(200).json({
      message: "Delete category",
    });
  }
};
