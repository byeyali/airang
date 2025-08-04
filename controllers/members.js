const bcrypt = require("bcryptjs");
const { error } = require("console");

const { Member } = require("../models");

const createMember = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    if (!password) {
      return res.json(400).json({ message: "패스워드를 입력해야 합니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = await Member.create({
      ...rest,
      password: hashedPassword,
    });

    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const [updated] = await Member.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated)
      return res
        .status(404)
        .json({ message: "회원을 찾을수 없거나 변경된 정보가 없습니다." });
    const updatedMember = await Member.findByPk(req.params.id);
    res.json(updatedMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMemberList = async (req, res) => {
  try {
    const members = await Member.findAll();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "회원을 찾을수 없습니다." });
    } else {
      return res.json(member);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.destroy({
      where: { id: req.params.id },
    });
    if (!deletedMember) {
      return res.status(404).json({ message: "회원을 찾을수 없습니다." });
    } else {
      res.json({ message: "회원이 삭제되었습니다." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createMember,
  updateMember,
  getMemberList,
  getMemberById,
  deleteMember,
};
