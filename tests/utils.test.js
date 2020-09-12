const {
    getQuery,
    getResponse
} = require("../app/utils")

describe('Test getQuery function', () => {
    it('should test if returned query object is correct', () => {
        const exampleData = {
            startDate: "2017-10-10",
            endDate: "2017-10-12",
            minCount: 100,
            maxCount: 200,
        }

        expectedQuery = [{
                $addFields: {
                    totalCount: {
                        $sum: "$counts"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    counts: 0,
                    value: 0,
                }
            },
            {
                $match: {
                    totalCount: {
                        $gte: 100,
                        $lte: 200,
                    },
                    createdAt: {
                        $gte: new Date("2017-10-10T00:00:00.000+00:00"),
                        $lte: new Date("2017-10-12T23:59:59.999+00:00")
                    }
                },

            }
        ]

        const returnedQuery = getQuery(exampleData)

        expect(returnedQuery).toEqual(expectedQuery)
    })
})

describe('Test getResponse function', () => {
    it("should test if the response is correct when type is zero", () => {
        const expectedResponse = {
            code: 0,
            msg: "Success",
            results: [1, 2, 3]
        }
        const returnedResponse = getResponse(0, "Success", [1, 2, 3])

        expect(returnedResponse).toEqual(expectedResponse)
    })

    it("should test if the response is correct when type is not zero", () => {
        const expectedResponse = {
            code: 1,
            msg: "Error",
        }
        const returnedResponse = getResponse(1, "Error", [1, 2, 3])

        expect(returnedResponse).toEqual(expectedResponse)
    })

    it("should test if the response is correct when type is not zero and no results passed", () => {
        const expectedResponse = {
            code: 1,
            msg: "Error",
        }
        const returnedResponse = getResponse(1, "Error")

        expect(returnedResponse).toEqual(expectedResponse)
    })
})