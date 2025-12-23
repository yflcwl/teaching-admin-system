package org;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@EnableAspectJAutoProxy
@SpringBootApplication
@ServletComponentScan//开启了SpringBoot的Servlet组件扫描功能
public class WebAiProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebAiProjectApplication.class, args);
    }

}
