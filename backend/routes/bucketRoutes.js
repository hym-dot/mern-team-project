const express = require("express")
const router = express.Router()
const bucketController = require("../controllers/bucketController")

router.post("/", bucketController.createBucket)
router.get("/", bucketController.getBuckets)
router.get("/:id", bucketController.getBucket)
router.put("/:id", bucketController.updateBucket)
router.delete("/:id", bucketController.deleteBucket)
router.patch("/:id/check", bucketController.updateCheck)

module.exports = router
