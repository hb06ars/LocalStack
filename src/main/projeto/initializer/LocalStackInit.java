package main.projeto.initializer;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeDefinition;
import software.amazon.awssdk.services.dynamodb.model.CreateTableRequest;
import software.amazon.awssdk.services.dynamodb.model.KeySchemaElement;
import software.amazon.awssdk.services.dynamodb.model.KeyType;
import software.amazon.awssdk.services.dynamodb.model.ProvisionedThroughput;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.CreateQueueRequest;

@Configuration
public class LocalStackInit {

    /***
     * AQUI É UMA INICIALIZAÇÃO DO LOCALSTACK POIS NAO TEMOS MASSA DE DADOS.
     */

    @Bean
    public String criarRecursos(
            SqsClient sqsClient,
            S3Client s3Client,
            DynamoDbClient dynamoDbClient) {

        criarFila(sqsClient);
        criarBucket(s3Client);
        criarTabela(dynamoDbClient);

        return "Recursos do LocalStack verificados";
    }

    private void criarFila(SqsClient sqsClient) {

        String nomeFila = "fila-pedidos";

        try {
            sqsClient.getQueueUrl(
                    request -> request.queueName(nomeFila)
            );

            System.out.println("SQS: " + nomeFila + " já existe");

        } catch (Exception e) {

            sqsClient.createQueue(
                    CreateQueueRequest.builder()
                            .queueName(nomeFila)
                            .build()
            );

            System.out.println("SQS: " + nomeFila + " criada");
        }
    }

    private void criarBucket(S3Client s3Client) {

        String nomeBucket = "meu-bucket";

        try {
            s3Client.headBucket(
                    request -> request.bucket(nomeBucket)
            );

            System.out.println("S3: " + nomeBucket + " já existe");

        } catch (Exception e) {

            s3Client.createBucket(
                    CreateBucketRequest.builder()
                            .bucket(nomeBucket)
                            .build()
            );

            System.out.println("S3: " + nomeBucket + " criado");
        }
    }

    private void criarTabela(DynamoDbClient dynamoDbClient) {

        String nomeTabela = "pedidos";

        try {

            dynamoDbClient.describeTable(
                    request -> request.tableName(nomeTabela)
            );

            System.out.println("DynamoDB: " + nomeTabela + " já existe");

        } catch (Exception e) {

            dynamoDbClient.createTable(
                    CreateTableRequest.builder()
                            .tableName(nomeTabela)

                            .attributeDefinitions(
                                    AttributeDefinition.builder()
                                            .attributeName("id")
                                            .attributeType("S")
                                            .build()
                            )

                            .keySchema(
                                    KeySchemaElement.builder()
                                            .attributeName("id")
                                            .keyType(KeyType.HASH)
                                            .build()
                            )

                            .provisionedThroughput(
                                    ProvisionedThroughput.builder()
                                            .readCapacityUnits(5L)
                                            .writeCapacityUnits(5L)
                                            .build()
                            )

                            .build()
            );

            System.out.println("DynamoDB: " + nomeTabela + " criada");
        }
    }
}