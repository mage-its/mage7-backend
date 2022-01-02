const express = require('express');
const form = require('multer')().none();
const validate = require('../../middlewares/validate');
const gameDevValidation = require('../../validations/gameDev.validation');
const gameDevController = require('../../controllers/gameDev.controller');
const auth = require('../../middlewares/auth');
const readForm = require('../../middlewares/readForm');
const removeEmpty = require('../../middlewares/removeEmpty');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');
const registerBarrier = require('../../middlewares/registerBarrier');
const proposalBarrier = require('../../middlewares/proposalBarrier');

const router = express.Router();

// User route

router.post(
  '/daftar-gamedev',
  registerBarrier('devcom'),
  auth(),
  readForm('gamedev'),
  validate(gameDevValidation.daftarGameDev),
  removeEmpty,
  gameDevController.daftarGameDev,
  cancelFileUpload()
);

router.patch(
  '/update-profile',
  auth(),
  form,
  validate(gameDevValidation.updateProfile),
  removeEmpty,
  gameDevController.updateProfile
);

router.post('/upload-proposal', proposalBarrier(), auth(), readForm('gamedevProposal'), gameDevController.uploadProposal);

// Admin route

router.get('/', auth('getUsers'), validate(gameDevValidation.getGameDevs), gameDevController.getGameDevs);

router.post(
  '/:userId',
  auth('manageUsers'),
  readForm('gamedev'),
  validate(gameDevValidation.createGameDev),
  removeEmpty,
  gameDevController.createGameDev,
  cancelFileUpload()
);

router
  .route('/:gameDevId')
  .get(auth('getUsers'), validate(gameDevValidation.getGameDev), gameDevController.getGameDev)
  .patch(auth('manageUsers'), form, validate(gameDevValidation.updateGameDev), removeEmpty, gameDevController.updateGameDev)
  .delete(auth('manageUsers'), validate(gameDevValidation.deleteGameDev), gameDevController.deleteGameDev);

router.post(
  '/toggle-verif/:gameDevId',
  auth('manageUsers'),
  validate(gameDevValidation.toggleVerif),
  gameDevController.toggleVerif
);

router.post('/inc-tahap/:gameDevId', auth('manageUsers'), validate(gameDevValidation.incTahap), gameDevController.incTahap);

router.post('/dec-tahap/:gameDevId', auth('manageUsers'), validate(gameDevValidation.decTahap), gameDevController.decTahap);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /appdev/daftar-gamedev:
 *   post:
 *     summary: Daftar Game Development
 *     tags: [GameDev]
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
 *                 gameDev:
 *                   $ref: '#/components/schemas/Game'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /gamedev/:
 *   get:
 *     summary: Get the gameDevs
 *     description: GET gameDevs.
 *     tags: [GameDev]
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
 *                     $ref: '#/components/schemas/GameDev'
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
