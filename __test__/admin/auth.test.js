/**
 * auth.test.js
 * @description :: contains test cases of APIs for authentication module.
 */

const dotenv = require('dotenv');
dotenv.config();
process.env.NODE_ENV = 'test';
const db = require('mongoose');
const request = require('supertest');
const { MongoClient } = require('mongodb');
const app = require('../../app');
const authConstant = require('../../constants/authConstant');
const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

let insertedUser = {};
let insertedWallet = {};

/**
 * @description : model dependencies resolver
 */
beforeAll(async function (){
  try {
    await client.connect();
    const dbInstance = client.db('EcomDb_test');

    const user = dbInstance.collection('users');
    insertedUser = await user.insertOne({
      walletAddress: 'Street',
      userType: 362,
      id: '660a7931de603400b5711aca'
    });
    const wallet = dbInstance.collection('wallets');
    insertedWallet = await wallet.insertOne({
      userId: '660a7931de603400b5711ad2',
      walletAddress: 'sticky',
      walletAmount: 710,
      userType: 583,
      email: 'Rod.Toy82@yahoo.com',
      mobileNo: '(964) 982-5354',
      password: 'M3kfK2fBAotwiQS',
      loginOTP: {},
      resetPasswordLink: {},
      loginRetryLimit: 398,
      loginReactiveTime: '2024-12-24T10:06:47.804Z',
      id: '660a7931de603400b5711ad3'
    });
  }
  catch (error) {
    console.error(`we encountered ${error}`);
  }
  finally {
    client.close();
  }
});

// test cases

describe('POST /register -> if email and username is given', () => {
  test('should register a wallet', async () => {
    let registeredUser = await request(app)
      .post('/admin/auth/register')
      .send({
        'userId':insertedUser.insertedId,
        'walletAddress':'state',
        'walletAmount':858,
        'userType':authConstant.USER_TYPES.User,
        'email':'Donald_Carroll@yahoo.com',
        'mobileNo':'(694) 695-5493',
        'password':'8dNZ4NaqQ1KzGjT',
        'addedBy':insertedWallet.insertedId,
        'updatedBy':insertedWallet.insertedId
      });
    expect(registeredUser.statusCode).toBe(200);
    expect(registeredUser.body.status).toBe('SUCCESS');
    expect(registeredUser.body.data).toMatchObject({ id: expect.any(String) });
  });
});

describe('POST /forgot-password -> if email has not passed from request body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    let wallet = await request(app)
      .post('/admin/auth/forgot-password')
      .send({ email: '' });

    expect(wallet.statusCode).toBe(400);
    expect(wallet.body.status).toBe('BAD_REQUEST');
  });
});

describe('POST /forgot-password -> if email passed from request body is not available in database ', () => {
  test('should return record not found status', async () => {
    let wallet = await request(app)
      .post('/admin/auth/forgot-password')
      .send({ 'email': 'unavailable.email@hotmail.com', });

    expect(wallet.statusCode).toBe(404);
    expect(wallet.body.status).toBe('RECORD_NOT_FOUND');
  });
});

describe('POST /forgot-password -> if email passed from request body is valid and OTP sent successfully', () => {
  test('should return success message', async () => {
    let wallet = await request(app)
      .post('/admin/auth/forgot-password')
      .send({ 'email':'Donald_Carroll@yahoo.com', });

    expect(wallet.statusCode).toBe(200);
    expect(wallet.body.status).toBe('SUCCESS');
  });
});

describe('POST /validate-otp -> OTP is sent in request body and OTP is correct', () => {
  test('should return success', () => {
    return request(app)
      .post('/admin/auth/login')
      .send(
        {
          username: 'state',
          password: '8dNZ4NaqQ1KzGjT'
        }).then(login => () => {
        return request(app)
          .get(`/admin/wallet/${login.body.data.id}`)
          .set({
            Accept: 'application/json',
            Authorization: `Bearer ${login.body.data.token}`
          }).then(foundUser => {
            return request(app)
              .post('/admin/auth/validate-otp')
              .send({ 'otp': foundUser.body.data.resetPasswordLink.code, }).then(wallet => {
                expect(wallet.statusCode).toBe(200);
                expect(wallet.body.status).toBe('SUCCESS');
              });
          });
      });
  });
});

describe('POST /validate-otp -> if OTP is incorrect or OTP has expired', () => {
  test('should return invalid OTP', async () => {
    let wallet = await request(app)
      .post('/admin/auth/validate-otp')
      .send({ 'otp': '12334' });
    
    expect(wallet.statusCode).toBe(200);
    expect(wallet.body.status).toBe('FAILURE');
    
  });
});

describe('POST /validate-otp -> if request body is empty or OTP has not been sent in body', () => {
  test('should return insufficient parameter', async () => {
    let wallet = await request(app)
      .post('/admin/auth/validate-otp')
      .send({});

    expect(wallet.statusCode).toBe(400);
    expect(wallet.body.status).toBe('BAD_REQUEST');
  });
});

describe('PUT /reset-password -> code is sent in request body and code is correct', () => {
  test('should return success', () => {
    return request(app)
      .post('/admin/auth/login')
      .send(
        {
          username: 'state',
          password: '8dNZ4NaqQ1KzGjT'
        }).then(login => () => {
        return request(app)
          .get(`/admin/wallet/${login.body.data.id}`)
          .set({
            Accept: 'application/json',
            Authorization: `Bearer ${login.body.data.token}`
          }).then(foundUser => {
            return request(app)
              .put('/admin/auth/validate-otp')
              .send({
                'code': foundUser.body.data.resetPasswordLink.code,
                'newPassword':'newPassword'
              }).then(wallet => {
                expect(wallet.statusCode).toBe(200);
                expect(wallet.body.status).toBe('SUCCESS');
              });
          });
      });
  });
});

describe('PUT /reset-password -> if request body is empty or code/newPassword is not given', () => {
  test('should return insufficient parameter', async () => {
    let wallet = await request(app)
      .put('/admin/auth/reset-password')
      .send({});
    
    expect(wallet.statusCode).toBe(400);
    expect(wallet.body.status).toBe('BAD_REQUEST');
  });
});

describe('PUT /reset-password -> if code is invalid', () => {
  test('should return invalid code', async () => {
    let wallet = await request(app)
      .put('/admin/auth/reset-password')
      .send({
        'code': '123',
        'newPassword': 'testPassword'
      });

    expect(wallet.statusCode).toBe(200);
    expect(wallet.body.status).toBe('FAILURE');

  });
});

afterAll(function (done) {
  db.connection.db.dropDatabase(function () {
    db.connection.close(function () {
      done();
    });
  });
});
