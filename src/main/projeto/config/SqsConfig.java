package main.projeto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;

import java.net.URI;

import static main.projeto.globals.Globals.LOCALSTACK_URL;

@Configuration
public class SqsConfig {

    /***
     * AQUI ESTÁ A CONFIGURAÇÃO DA FILA SQS
     */

    @Bean
    public SqsClient sqsClient() {

        return SqsClient.builder()
                .endpointOverride(URI.create(LOCALSTACK_URL))
                .region(Region.SA_EAST_1)
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create("test", "test")
                        )
                )
                .build();
    }
}
