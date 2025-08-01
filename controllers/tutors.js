const fs = require("fs");
const { Tutor, TutorCategory, TutorRegion, TutorFile } = require("../models");

const createTutor = async (req, res) => {
  try {
    const {
      member_id,
      school,
      major,
      is_graduate,
      career_years,
      introduction,
      certification,
    } = req.body;

    // tutor 사진 경로
    const photo_path = req.file ? req.file.path : null;

    const newTutor = await Tutor.create({
      member_id: member_id,
      school: school,
      major: major,
      is_graduate: is_graduate,
      career_years: career_years,
      introduction: introduction,
      certification: certification,
      photo_path: photo_path,
    });

    res.status(201).json(newTutor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTutor = async (req, res) => {
  try {
    // 파라미터값 세팅
    const tutorId = req.params.id;

    const tutor = await Tutor.findByPk(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: "튜터를 찾을 수 없습니다." });
    }

    // 변경 가능값 지정
    const {
      school,
      major,
      is_graduate,
      career_years,
      introduction,
      certification,
    } = req.body;

    // 이미지 업로드시 파일 삭제
    let photo_path = tutor.photo_path;
    if (req.file) {
      if (photo_path && fs.existsSync(photo_path)) {
        fs.unlinkSync(photo_path);
      }
      photo_path = req.file.path;
    }

    // UPDATE 항목 검사
    const updateData = {};
    if (school && school !== tutor.school) updateData.school = school;
    if (major && major !== tutor.major) updateData.major = major;
    if (is_graduate !== undefined && is_graduate !== tutor.is_graduate)
      updateData.is_graduate = is_graduate;
    if (career_years !== undefined && career_years !== tutor.career_years)
      updateData.career_years = career_years;
    if (introduction && introduction !== tutor.introduction)
      updateData.introduction = introduction;
    if (certification && certification !== tutor.certification)
      updateData.certification = certification;

    updateData.photo_path = photo_path;

    // TABLE UPDATE
    await Tutor.update(updateData, {
      where: { id: tutorId },
    });

    // UPDATE 후 재조회
    const updatedTutor = await Tutor.findByPk(tutorId);
    res.json(updatedTutor);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const addTutorCategory = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const categories = req.body.categories;

    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: "카테고리 배열이 필요합니다." });
    }

    const result = [];
    for (const categoryId of categories) {
      const category = await TutorCategory.findOne({
        where: {
          tutor_id: tutorId,
          category_id: categoryId,
        },
      });

      if (!category) {
        const newCategory = await TutorCategory.create({
          tutor_id: tutorId,
          category_id: categoryId,
        });
        result.push(newCategory);
      }
    }

    res
      .status(200)
      .json({ message: "튜터에 대한 카테고리 추가 완료", added: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTutorCategory = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;

    const deletedCount = await TutorCategory.destroy({
      where: { tutor_id: tutorId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "삭제할 카테고리가 없습니다." });
    }

    return res.status(200).json({
      message: "카테고리 삭제 완료",
      count: deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addTutorRegion = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const regions = req.body.regions;

    if (!Array.isArray(regions)) {
      return res.status(400).json({ message: "지역 배열이 필요합니다." });
    }

    const result = [];
    for (const regionItem of regions) {
      const { city_name, district_name } = regionItem;
      const exists = await TutorRegion.findOne({
        where: {
          tutor_id: tutorId,
          city_name,
          district_name,
        },
      });

      if (!exists) {
        const newRegion = await TutorRegion.create({
          tutor_id: tutorId,
          city_name,
          district_name,
        });
        result.push(newRegion);
      }
    }

    res
      .status(200)
      .json({ message: "튜터에 대한 지역 추가 완료", added: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTutorRegion = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;

    const deletedCount = await TutorRegion.destroy({
      where: { tutor_id: tutorId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "삭제할 지역이 없습니다." });
    }

    return res.status(200).json({
      message: "지역 삭제 완료",
      count: deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addTutorFile = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "파일이 첨부되지 않았습니다." });
    }

    const addFiles = await Promise.all(
      req.files.map((file, index) => {
        return TutorFile.create({
          tutor_id: tutorId,
          file_doc_type: Array.isArray(req.body.file_doc_type)
            ? req.body.file_doc_type[index]
            : req.body.file_doc_type || "portfolio", // 1. idcard, 2. health, 3. license, 4. portfolio, 5. account
          file_title: file.originalname,
          file_name: file.filename,
          file_path: file.path,
          file_type: file.mimetype,
        });
      })
    );

    res.status(201).json({ message: "파일 첨부 완료", added: addFiles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTutorFile = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;

    const deletedCount = await TutorFile.destroy({
      where: { tutor_id: tutorId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "삭제할 첨부 파일이 없습니다." });
    }

    return res.status(200).json({
      message: "첨부파일 삭제 완료",
      count: deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTutor,
  updateTutor,
  addTutorCategory,
  deleteTutorCategory,
  addTutorRegion,
  deleteTutorRegion,
  addTutorFile,
  deleteTutorFile,
};
