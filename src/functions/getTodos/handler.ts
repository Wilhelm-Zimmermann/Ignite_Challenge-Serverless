import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda"
import { document } from "src/utils/dynamodbClients";


const getTodo: ValidatedEventAPIGatewayProxyEvent<string> = async (event) => {
    const { user_id } = event.pathParameters;
    const todos = await document.query({
        TableName: "todo_list",
        IndexName: "user",
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id":user_id
        }
    }).promise()

    return  formatJSONResponse({
        message: "list",
        user_id,
        todos
    });
}

export const main = middyfy(getTodo);