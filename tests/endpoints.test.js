const app = require('../app/index')
const supertest = require('supertest')
const request = supertest(app)
const {
    MongoClient
} = require("mongodb")

// Can be changed to test environments for better coding
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
    retryWrites: true,
    useUnifiedTopology: true,
});

beforeAll(async () => {
    await client.connect();
    collection = client
        .db(process.env.MONGO_DB)
        .collection(process.env.MONGO_COLLECTION);
})

afterAll(async () => {
    await client.close()
})

describe("Test restricted endpoints", () => {
    it('should not pass get request', async done => {
        const res = await request.get('/')
        expect(res.status).toBe(404)
        done()
    })

    it('should not pass post request', async done => {
        const res = await request.post('/test/')
        expect(res.status).toBe(404)
        expect(res.body).toEqual({
            code: 2,
            msg: 'Invalid endpoint'
        })
        done()
    })
})

describe("Test post endpoint", () => {
    it("should return result with success", async done => {
        const res = await request.post("/").send({
            startDate: "2017-01-28",
            endDate: "2017-01-30",
            minCount: 100,
            maxCount: 150
        })
        expextedResult = {
            "code": 0,
            "msg": "Success",
            "results": [{
                "key": "TAKwGc6Jr4i8Z487",
                "createdAt": "2017-01-28T01:22:14.398Z",
                "totalCount": 120
            }]
        }
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expextedResult)

        done()
    })

    it("should return error if the parameter is invalid", async done => {
        const res = await request.post("/").send({
            startDate: "20170128",
            endDate: "2017-01-30",
            minCount: 100,
            maxCount: 150
        })
        expextedResult = {
            "code": 1,
            "msg": "Invalid parameter(s)"
        }
        expect(res.status).toBe(400)
        expect(res.body).toEqual(expextedResult)

        done()
    })
})