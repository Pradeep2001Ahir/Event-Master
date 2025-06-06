//NPM
import { validationResult } from "express-validator";
//Model
import categoryModel from "../../model/categories.js";
//Funtion
import { getMessage } from "../../helper/common/helper.js";
import { categoryExist } from "./service.js";
import categoryResponse from "../../response/categoryResponse.js";


export const createCategory = async (req, res) => {
  try {
    const { language = "en", name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({
        status: false,
        message: await getMessage(language, errors.error[0]["msg"]),
      });
    }

    const checkCategory = await categoryExist(name);

    if (checkCategory) {
      return res.send({
        status: false,
        message: await getMessage(language, "Categorie_Already_Exist"),
      });
    }

    const categoryObj = new categoryModel({
      name: name,
    });

    const categorySave = await categoryObj.save();

    if (categorySave) {
      return res.status(200).send({
        status: true,
        message: await getMessage(language, "Categorie_Create_Succes"),
      });
    }

    return res.send({
      status: false,
      message: await getMessage(language, "Feild_To_Create_Categorie"),
    });
  } catch (error) {
    return res.send({
      status: false,
      message: error.message,
    });
  }
};




export const updateCategory = async (req, res) => {
  try {
    const { name, language="en" } = req.body;
    const {id} =  req.params; 

   const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({
        status: false,
        message: await getMessage(language, errors.error[0]["msg"]),
      });
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { $set: { name } },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: false,
        message: await getMessage(language, "Category_Not_Update")
      });
    }

    return res.status(200).json({
      status: true,
      message: await getMessage(language, "Category_Update_Success"),
      data: new categoryResponse(updatedCategory),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


//get all category list 

export const getCategoryList = async (req, res) => {
  try {
    const method = req.method;
    const source = method === "GET" ? req.query : req.body;

    const {
      language,
      search,
      page = 1,
      perPage = 10
    } = source;

    const pageNo = (page - 1) * perPage;
    let filter = {};

    if (search) {
      filter.name = { $regex: ".*" + search + ".*", $options: "i" };
    }

    const getAllCategory = await categoryModel.find(filter)
      .sort({ _id: -1 })
      .skip(pageNo)
      .limit(perPage);

    if (getAllCategory.length) {
      const madeCategoryResponse = await Promise.all(
        getAllCategory.map(category => new categoryResponse(category))
      );

      return res.status(200).send({
        status: true,
        message: await getMessage(language, "Category_List_Fetched_Success"),
        data: madeCategoryResponse,
      });
    } else {
      return res.status(200).send({
        status: false,
        message: await getMessage(language, "Feild_To_Fetched_List"),
        data: [],
      });
    }
  } catch (error) {
    return res.send({
      status: false,
      message: error.message,
    });
  }
};
