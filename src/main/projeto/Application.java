package main.projeto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class Application {

    /***
     * ESSA É A CLASSE PRINCIPAL PARA SUBIR O PROJETO.
     */

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
