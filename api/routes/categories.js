const router = require("express").Router();
const Category = require("../models/Category");

// create category
router.post("/", async (req, res) => {
    const allCats = await Category.find();
    const newCat = new Category(req.body); 
        
    if (!allCats.some(cat => cat.name == newCat.name)) {             
        try {
            const savedCat = await newCat.save();
            res.status(200).json(savedCat);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(200).json("This is already in category.");
    }
});

// delete category
router.delete("/:id", async (req, res) => {
    try {   
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json("Category has been deleted.");
    } catch (err) {
        res.status(500).json(err);
    }     
});

// get all categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;