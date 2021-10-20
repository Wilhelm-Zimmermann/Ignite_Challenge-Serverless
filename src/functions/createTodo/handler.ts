import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { document } from 'src/utils/dynamodbClients';
import { v4 as uuidv4 } from "uuid";

interface ICreateTodo{
    user_id: string;
    title: string;
    done: boolean;
}

const createTodo: ValidatedEventAPIGatewayProxyEvent<string> = async (event, context) => {
    const {user_id} = event.pathParameters;
    console.log(context)
    const { title, done } = event.body as ICreateTodo; 
    await document.put({
        TableName: "todo_list",
        Item: {
            id: uuidv4(),
            user_id,
            title,
            done,
            deadline: new Date().toUTCString()
        }
    }).promise();
    return formatJSONResponse({
        message: "OK",
    });
}

export const main = middyfy(createTodo);