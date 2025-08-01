const { Category } = require("../models");

const createCategory = async (req, res) => {
  try {
    const { grp_cd, grp_nm, category_cd, category_nm } = req.body;

    const newCategory = await Category.create({
      grp_cd: grp_cd,
      grp_nm: grp_nm,
      category_cd: category_cd,
      category_nm: category_nm,
    });

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { category_nm } = req.body;

    // 카테고리 조회
    const category = await Category.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      return res.status(404).json({
        message: "카테고리를 찾을 수 없습니다.",
      });
    }

    const updateData = {};

    // category_nm 값 비교
    if (category_nm !== category.category_nm) {
      updateData.category_nm = category_nm;
    }

    // update 실행
    const [updated] = await Category.update(updateData, {
      where: { id: categoryId },
    });

    if (updated === 0) {
      return res.status(400).json({ message: "업데이트 실패" });
    }

    // 업데이트 후 새 데이터 조회
    const updatedCategory = await Category.findOne({
      where: { id: categoryId },
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
};

const getCategoryList = async (req, res) => {
  try {
    const { grp_cd } = req.query;

    const whereClause = {};
    if (grp_cd) {
      whereClause.grp_cd = grp_cd;
    }
    whereClause.is_active = true;

    const categories = await Category.findAll({
      where: whereClause,
      order: [["category_cd", "ASC"]],
    });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "카테고리를 찾을 수 없습니다." });
    } else {
      return res.json(category);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.destroy({
      where: { id: req.params.id },
    });
    if (!deletedCategory) {
      return res.status(404).json({ message: "카테고리를 찾을 수 없습니다." });
    } else {
      res.json({ message: "삭제 완료되었습니다." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getCategoryList,
  getCategoryById,
  deleteCategory,
};
