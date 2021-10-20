import { handlerPath } from "@libs/handlerResolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "post",
                path: "create-todo/{user_id}",
                request: {
                    schema: {
                        "application/json":{
                            type: "object",
                            properties: {
                                title: {type: "string"},
                                done: {type: "boolean"},
                            }
                        }
                    }
                }
            }
        }
    ]
}