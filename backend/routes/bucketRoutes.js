const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Bucket = require("../models/Bucket")

const ensureObjectId = (id, res) => {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: '유효하지 않은 ID형식입니다.' })
        return false
    }
    return true
}

// ➤ 버킷 추가
router.post("/", async (req, res) => {
    try {
        const newBucket = new Bucket(req.body)
        const saveBucket = await newBucket.save()
        res.status(201).json(saveBucket)
    } catch (error) {
        res.status(400).json({ error: "버킷을 저장하지 못했습니다." })
    }
})

// ➤ 전체 조회
router.get("/", async (req, res) => {
    try {
        const buckets = await Bucket.find().sort({ createdAt: -1 })
        res.status(200).json(buckets)
    } catch (error) {
        res.status(400).json({ error: "데이터를 불러오지 못했습니다." })
    }
})

// ➤ 단일 조회
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        if (!ensureObjectId(id, res)) return

        const bucket = await Bucket.findById(id)
        if (!bucket) {
            return res.status(404).json({ message: '해당 Id의 bucket이 없습니다.' })
        }
        res.status(200).json(bucket)
    } catch (error) {
        res.status(400).json({ error: "데이터를 불러오지 못했습니다." })
    }
})

// ➤ 수정
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        if (!ensureObjectId(id, res)) return

        const updated = await Bucket.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        if (!updated) {
            return res.status(404).json({ message: '해당 Id의 bucket이 없습니다.' })
        }
        res.status(200).json(updated)
    } catch (error) {
        res.status(400).json({ error: "데이터를 수정하지 못했습니다." })
    }
})

// ➤ 삭제
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        if (!ensureObjectId(id, res)) return

        const deleted = await Bucket.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: '해당 Id의 bucket이 없습니다.' })
        }

        const remaining = await Bucket.find().sort({ createdAt: -1 })

        res.status(200).json({
            message: "1개 삭제하기 성공",
            deleted: deleted._id,
            buckets: remaining
        })
    } catch (error) {
        res.status(400).json({ error: "데이터를 삭제하지 못했습니다." })
    }
})

// ➤ 체크 상태 수정
router.patch("/:id/check", async (req, res) => {
    try {
        const { id } = req.params
        if (!ensureObjectId(id, res)) return
        const { isCompleted } = req.body

        if (typeof isCompleted !== 'boolean') {
            return res.status(400).json({ message: "isCompleted는 반드시 boolean이어야 합니다." })
        }

        const updated = await Bucket.findByIdAndUpdate(
            id,
            { isCompleted },
            { new: true, runValidators: true, context: 'query' }
        )
        if (!updated) {
            return res.status(404).json({ message: '해당 Id의 bucket이 없습니다.' })
        }
        res.status(200).json(updated)
    } catch (error) {
        res.status(400).json({ error: "체크 상태를 수정하지 못했습니다." })
    }
})

module.exports = router
