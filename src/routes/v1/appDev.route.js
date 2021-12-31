const express = require('express');
const form = require('multer')().none();
const validate = require('../../middlewares/validate');
const appDevValidation = require('../../validations/appDev.validation');
const appDevController = require('../../controllers/appDev.controller');
const auth = require('../../middlewares/auth');
const readForm = require('../../middlewares/readForm');
const removeEmpty = require('../../middlewares/removeEmpty');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');
const registerBarrier = require('../../middlewares/registerBarrier');
const proposalBarrier = require('../../middlewares/proposalBarrier');

const router = express.Router();

// User route

router.post(
  '/daftar-appdev',
  registerBarrier('devcom'),
  auth(),
  readForm('appdev'),
  validate(appDevValidation.daftarAppDev),
  removeEmpty,
  appDevController.daftarAppDev,
  cancelFileUpload()
);

router.patch(
  '/update-profile',
  auth(),
  form,
  validate(appDevValidation.updateProfile),
  removeEmpty,
  appDevController.updateProfile
);

router.post('/upload-proposal', proposalBarrier(), auth(), readForm('appdevProposal'), appDevController.uploadProposal);

// Admin route

router.get('/', auth('getUsers'), validate(appDevValidation.getAppDevs), appDevController.getAppDevs);

router.post(
  '/:userId',
  auth('manageUsers'),
  readForm('appdev'),
  validate(appDevValidation.createAppDev),
  removeEmpty,
  appDevController.createAppDev,
  cancelFileUpload()
);

router
  .route('/:appDevId')
  .get(auth('getUsers'), validate(appDevValidation.getAppDev), appDevController.getAppDev)
  .patch(auth('manageUsers'), form, validate(appDevValidation.updateAppDev), removeEmpty, appDevController.updateAppDev)
  .delete(auth('manageUsers'), validate(appDevValidation.deleteAppDev), appDevController.deleteAppDev);

router.post(
  '/toggle-verif/:appDevId',
  auth('manageUsers'),
  validate(appDevValidation.toggleVerif),
  appDevController.toggleVerif
);

router.post('/inc-tahap/:appDevId', auth('manageUsers'), validate(appDevValidation.incTahap), appDevController.incTahap);

router.post('/dec-tahap/:appDevId', auth('manageUsers'), validate(appDevValidation.decTahap), appDevController.decTahap);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /appdev/daftar-appdev:
 *   post:
 *     summary: Daftar Application Development
 *     tags: [AppDev]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - kategori
 *               - namaTim
 *               - namaKetua
 *               - waKetua
 *               - lineKetua
 *               - hpKetua
 *               - asalInstansi
 *               - alamatInstansi
 *               - asalInfo
 *               - asalKota
 *               - identitasKetua
 *               - buktiUploadTwibbon
 *               - buktiFollowMage
 *               - buktiRepostStory
 *             properties:
 *               kategori:
 *                 type: string
 *                 description: Siswa atau Mahasiswa
 *               namaTim:
 *                 type: string
 *               namaKetua:
 *                 type: string
 *               waKetua:
 *                 type: string
 *                 description: valid indonesian phone number
 *               lineKetua:
 *                 type: string
 *                 description: id line
 *               hpKetua:
 *                 type: string
 *                 description: valid indonesian phone number
 *               namaAnggota1:
 *                 type: string
 *               namaAnggota2:
 *                 type: string
 *               namaPembimbing:
 *                 type: string
 *               waPembimbing:
 *                 type: string
 *                 description: valid indonesian phone number
 *               hpPembimbing:
 *                 type: string
 *                 description: valid indonesian phone number
 *               asalInstansi:
 *                 type: string
 *               alamatInstansi:
 *                 type: string
 *               asalInfo:
 *                 type: string
 *               asalKota:
 *                 type: string
 *               identitasKetua:
 *                 type: file
 *               identitasAnggota1:
 *                 type: file
 *               identitasAnggota2:
 *                 type: file
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appDev:
 *                   $ref: '#/components/schemas/AppDev'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /appdev/:
 *   get:
 *     summary: Get the appDevs
 *     description: GET appDevs.
 *     tags: [AppDev]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AppDev'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
