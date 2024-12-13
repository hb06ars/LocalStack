# LOCALSTACK

### Documentação
Para praticar e estudar uma simples aplicação que utlizar o LocalStack com Docker.
Para utilizar alguns serviços como: S3, SQS, SNS, DynamoDB...

- Para iniciar primeiro precisamos subir o docker-compose.yml


## Instalando o AWS CLI LOCAL

- Instalando
> pip install awscli-local

- Colocar nas variáveis de ambiente do Sistema:
> C:\Users\hb06a\AppData\Roaming\Python\Python312\Scripts

- Listar Buckets:
> awslocal s3 ls

- Se não houver buckets, você pode criar um:
> awslocal s3 mb s3://teste-jose1212
> awslocal s3 ls

- Listar Filas (SQS):
> awslocal sqs list-queues

- Criar uma fila de exemplo:
> awslocal sqs create-queue --queue-name minha-fila
> awslocal sqs list-queues

- Listar Tabelas (DynamoDB):
> awslocal dynamodb list-tables

- Criar uma tabela de exemplo:
> awslocal dynamodb create-table --table-name minha-tabela --attribute-definitions AttributeName=Id,AttributeType=S --key-schema AttributeName=Id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

- Verificar SNS:
> awslocal sns create-topic --name meu-topico
> awslocal sns list-topics


# INSERCAO
- Deve ser inserido os Buckets, FIlas, etc
- Deve existir um arquivo chamado texto_teste.txt no direório e deve existir o bucket:
> awslocal s3 mb s3://teste
- topicArn deve existir, comando:
> awslocal sns create-topic --name MyTopic
- A fila deve existir, comando:
> awslocal sqs create-queue --queue-name minha-fila

## LAMBDA:

- Crie um arquivo python:
>  def lambda_handler(event, context):
return {
'statusCode': 200,
'body': 'Hello from Lambda!'
}

- Faça um zip dele:
> lambda_function.py

- Execute:
> awslocal lambda create-function --function-name myLambdaFunction --zip-file fileb://function.zip --handler lambda_function.lambda_handler --runtime python3.8 --role arn:aws:iam::000000000000:role/role_name

