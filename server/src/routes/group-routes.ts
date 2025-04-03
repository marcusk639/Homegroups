import express from "express";
import * as groupController from "../controllers/group-controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validation";
import { groupCreationSchema } from "../middleware/validation";

const router = express.Router();

// Apply authentication middleware to all group routes
router.use(authenticate);

// Group routes
router
  .route("/")
  .get(groupController.getUserGroups)
  .post(validate(groupCreationSchema), groupController.createGroup);

router
  .route("/:id")
  .get(groupController.getGroupById)
  .put(groupController.updateGroup)
  .delete(groupController.deleteGroup);

// Group member routes
router.route("/:id/members").get(groupController.getGroupMembers);

router
  .route("/:id/members/:memberId")
  .put(groupController.updateMemberRole)
  .delete(groupController.removeMember);

// Group announcement routes
router
  .route("/:id/announcements")
  .get(groupController.getGroupAnnouncements)
  .post(groupController.createAnnouncement);

router
  .route("/:id/announcements/:announcementId")
  .put(groupController.updateAnnouncement)
  .delete(groupController.deleteAnnouncement);

// Group event routes
router
  .route("/:id/events")
  .get(groupController.getGroupEvents)
  .post(groupController.createEvent);

// Group celebration routes
router.route("/:id/celebrations").get(groupController.getGroupCelebrations);

export default router;
