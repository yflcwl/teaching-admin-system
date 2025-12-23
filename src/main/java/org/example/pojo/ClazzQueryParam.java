package org.example.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClazzQueryParam {
    private Integer page = 1;
    private Integer pageSize = 10;
    private String name;
    //开课时间
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate begin;
    //结课时间
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate end;
}
