package main.projeto.consumer;

import io.awspring.cloud.sqs.annotation.SqsListener;
import org.springframework.stereotype.Component;

@Component
public class SqsConsumer {

    /***
     * ESSE É O CONSUMER, ELE FAZ A LEITURA DE UMA MENSAGEM ENVIADA PARA O SQS.
     */

    @SqsListener("fila-pedidos")
    public void receberMensagem(String mensagem) {

        System.out.println("Mensagem recebida:");
        System.out.println(mensagem);

        // Processamento
    }
}