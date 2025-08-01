const { Notice } = require("../models");

const createNotice = async (req, res) => {
  try {
    const { title, content, writer, is_notice } = req.body;

    const newNotice = await Notice.create({
      title: title,
      content: content,
      writer: writer,
      is_notice: is_notice,
    });

    res.status(201).json(newNotice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateNotice = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const { title, content } = req.body;

    // 공지 조회
    const notice = await Notice.findOne({
      where: { id: noticeId },
    });
    if (!notice) {
      return res.status(404).json({
        message: "공지사항을 찾을 수 없습니다.",
      });
    }

    // view count 증가
    const newViewCount = notice.view_count + 1;
    const updateData = { view_count: newViewCount };

    // title, content 값 비교
    if (title !== notice.title) {
      updateData.title = title;
    }
    if (content !== notice.content) {
      updateData.content = content;
    }

    // update 실행
    const [updated] = await Notice.update(updateData, {
      where: { id: noticeId },
    });

    if (updated === 0) {
      return res.status(400).json({ message: "업데이트 실패" });
    }

    // 업데이트 후 새 데이터 조회
    const updatedNotice = await Notice.findOne({
      where: { id: noticeId },
    });

    res.json(updatedNotice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
};

const getNoticeList = async (req, res) => {
  try {
    const notices = await Notice.findAll();
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    } else {
      return res.json(notice);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const deletedNotice = await Notice.destroy({
      where: { id: req.params.id },
    });
    if (!deletedNotice) {
      return res.status(404).json({ message: "Notice not found" });
    } else {
      res.json({ message: "Notice deleted" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNotice,
  updateNotice,
  getNoticeList,
  getNoticeById,
  deleteNotice,
};
