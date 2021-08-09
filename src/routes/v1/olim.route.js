const express = require('express');
const form = require('multer')().none();
const validate = require('../../middlewares/validate');
const olimValidation = require('../../validations/olim.validation');
const olimController = require('../../controllers/olim.controller');
const auth = require('../../middlewares/auth');
const readForm = require('../../middlewares/readForm');
const removeEmpty = require('../../middlewares/removeEmpty');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');

const router = express.Router();

// User route

router.post(
  '/daftar-olim',
  auth(),
  readForm('olim'),
  validate(olimValidation.daftarOlim),
  removeEmpty,
  olimController.daftarOlim,
  cancelFileUpload()
);

router.patch(
  '/update-profile',
  auth(),
  form,
  validate(olimValidation.updateProfile),
  removeEmpty,
  olimController.updateProfile
);

// Admin route

router.get('/', auth('getUsers'), validate(olimValidation.getOlims), olimController.getOlims);

router.post(
  '/:userId',
  auth('manageUsers'),
  readForm('olim'),
  validate(olimValidation.createOlim),
  removeEmpty,
  olimController.createOlim,
  cancelFileUpload()
);

router
  .route('/:olimId')
  .get(auth('getUsers'), validate(olimValidation.getOlim), olimController.getOlim)
  .patch(auth('manageUsers'), form, validate(olimValidation.updateOlim), removeEmpty, olimController.updateOlim)
  .delete(auth('manageUsers'), validate(olimValidation.deleteOlim), olimController.deleteOlim);

router.post('/toggle-verif/:olimId', auth('manageUsers'), validate(olimValidation.toggleVerif), olimController.toggleVerif);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Olim
 *   description: API Olimpiade
 */

/**
 * @swagger
 * /olim/daftar-olim:
 *   post:
 *     summary: Daftar olimpiade
 *     tags: [Olim]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - namaTim
 *               - namaKetua
 *               - waKetua
 *               - lineKetua
 *               - hpKetua
 *               - namaAnggota1
 *               - namaAnggota2
 *               - asalInstansi
 *               - asalInfo
 *               - identitasKetua
 *               - identitasAnggota1
 *               - identitasAnggota2
 *               - suratKeteranganSiswa
 *             properties:
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
 *               asalInstansi:
 *                 type: string
 *               asalInfo:
 *                 type: string
 *               identitasKetua:
 *                 type: file
 *               identitasAnggota1:
 *                 type: file
 *               identitasAnggota2:
 *                 type: file
 *               suratKeteranganSiswa:
 *                 type: file
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 olim:
 *                   $ref: '#/components/schemas/Olim'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
