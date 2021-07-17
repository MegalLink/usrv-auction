import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();
export async function dynamoPut(tableName, data) {
  console.log("DynamoGateway | put ");
  try {
    await dynamodb
      .put({
        TableName: tableName,
        Item: data,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }
}

export async function dynamoGet(tableName, id) {
  console.log("DynamoGateway | get");

  try {
    const result = await dynamodb
      .get({ TableName: tableName, Key: { id } })
      .promise();
    return result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export async function dynamoScan(tableName) {
  console.log("DynamoGateway | scan");
  try {
    const result = await dynamodb.scan({ TableName: tableName }).promise();
    return result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}
export async function dynamoUpdate(tableName, id, fieldName, fieldValue) {
  console.log("DynamoGateway | update");
  const params = {
    TableName: tableName,
    Key: { id },
    UpdateExpression: `set ${fieldName} = :value`,
    ExpressionAttributeValues: {
      ":value": fieldValue,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    await dynamodb.update(params).promise();
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}
export async function dynamoQuery(params) {
  console.log("DynamoGateway | query");
  try {
    const result = await dynamodb.query(params).promise();
    return result.Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}
