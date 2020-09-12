function getQuery(payload) {
    // Quick Date parse
    const minDate = new Date(`${payload.startDate}T00:00:00.000+00:00`);
    const maxDate = new Date(`${payload.endDate}T23:59:59.999+00:00`);

    const query = [
        // https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/
        {
            $addFields: {
                totalCount: {
                    $sum: "$counts"
                },
            },
        },
        // https://docs.mongodb.com/manual/reference/operator/aggregation/project/
        {
            $project: {
                _id: 0,
                counts: 0,
                value: 0,
            },
        },
        // https://docs.mongodb.com/manual/reference/operator/aggregation/match/
        {
            $match: {
                totalCount: {
                    $gte: payload.minCount,
                    $lte: payload.maxCount
                },
                createdAt: {
                    $gte: minDate,
                    $lte: maxDate
                },
            },
        },
    ];

    return query;
}

function getResponse(type, msg, elements = []) {
    const response = {
        code: type,
        msg: msg,
    }

    if (type == 0) {
        response["results"] = elements
    }
    return response
}

module.exports = {
    getQuery,
    getResponse
}