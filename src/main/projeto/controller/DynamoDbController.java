package main.projeto.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.util.Map;

@RestController
public class DynamoDbController {

    /***
     * ESSE É O DYNAMODB, AQUI EU FAÇO ESCRITA E LEITURA DO DYNAMO.
     */

    private final DynamoDbClient dynamoDbClient;
    private String TABELA = "pedidos";

    public DynamoDbController(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }

    @PostMapping("/dynamo/{id}")
    public String salvarDynamo(@PathVariable(name = "id") String id) {

        dynamoDbClient.putItem(
                PutItemRequest.builder()
                        .tableName(TABELA)
                        .item(Map.of(
                                "id", AttributeValue.builder().s(id).build(),
                                "nome", AttributeValue.builder().s("Produto teste").build()
                        ))
                        .build()
        );

        return "Item salvo no DynamoDB";
    }


    @GetMapping("/dynamo/{id}")
    public String buscarDynamo(@PathVariable(name = "id") String id) {

        var response = dynamoDbClient.getItem(
                GetItemRequest.builder()
                        .tableName(TABELA)
                        .key(Map.of(
                                "id", AttributeValue.builder().s(id).build()
                        ))
                        .build()
        );

        if (!response.hasItem()) {
            return "Item não encontrado";
        }

        return response.item().toString();
    }


}
