import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();
export async function put(tableName, data) {
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

export async function get(tableName, key) {
  console.log("DynamoGateway | get");
  console.log("DyanamoGateway | get |key", key);
  try {
    const result = await dynamodb
      .get({ TableName: tableName, Key: { id: key } })
      .promise();
    return result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export async function scan(tableName) {
  console.log("DynamoGateway | scan");
  try {
    const result = await dynamodb.scan({ TableName: tableName }).promise();
    return result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}
export async function update(tableName, key, fieldName, fieldValue) {
  console.log("DynamoGateway | update");
  const params = {
    TableName: tableName,
    Key: { key },
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
export async function query(params) {
  console.log("DynamoGateway | query");
  try {
    const result = await dynamodb.query(params).promise();
    return result.Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}
