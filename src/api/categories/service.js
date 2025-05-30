import categoryModel from "../../model/categories.js";

export const categoryExist = async (name) => {
  try {
    const categoryData = await categoryModel.findOne({ name: name }).lean();

    if (categoryData) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
};
