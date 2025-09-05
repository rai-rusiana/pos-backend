import * as categoryService from '../services/category.service.js'


export const createCategory = async (req, res) => {
     const {name} = req.body
     if (!name ) {
          return res.status(400).json({
               error: "Missing required fields: name",
          })
     }
     try {
          const newCategory = await categoryService.createCategory(name)
          res.stats(201).json({
               newCategory
          })
     } catch(error) {

     }
}