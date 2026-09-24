package main.projeto.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
public class S3Controller {

    /***
     * ESSE É O BUCKET S3, AQUI EU FAÇO ESCRITA E LEITURA DO BUCKET.
     */

    private final S3Client s3Client;
    private static String BUCKET_S3 = "meu-bucket";

    public S3Controller(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @PostMapping("/s3/{nome}")
    public String salvarS3(@PathVariable(name = "nome") String nome) {

        String conteudo = "Conteúdo salvo no S3";

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(BUCKET_S3)
                        .key(nome)
                        .build(),
                RequestBody.fromBytes(
                        conteudo.getBytes(StandardCharsets.UTF_8)
                )
        );

        return "Arquivo salvo no S3";
    }


    @GetMapping("/s3/{nome}")
    public String buscarS3(@PathVariable(name = "nome") String nome) throws IOException {

        var response = s3Client.getObject(
                GetObjectRequest.builder()
                        .bucket(BUCKET_S3)
                        .key(nome)
                        .build()
        );

        return new String(
                response.readAllBytes(),
                StandardCharsets.UTF_8
        );
    }


}
