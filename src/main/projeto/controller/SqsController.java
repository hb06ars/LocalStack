package main.projeto.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

@RestController
public class SqsController {

    /***
     * ESSE É O PRODUTOR, ELE FAZ O PRODUCER DA MENSAGEM PARA O SQS
     */

    private final SqsClient sqsClient;

    public SqsController(SqsClient sqsClient) {
        this.sqsClient = sqsClient;
    }

    @PostMapping("/sqs")
    public String enviarSqs() {

        sqsClient.sendMessage(
                SendMessageRequest.builder()
                        .queueUrl("http://localhost:4566/000000000000/fila-pedidos")
                        .messageBody("Teste")
                        .build()
        );

        return "Mensagem enviada para SQS";
    }


}
