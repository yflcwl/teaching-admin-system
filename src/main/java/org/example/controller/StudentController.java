package org.example.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.anno.Log;
import org.example.anno.Permission;
import org.example.pojo.PageResult;
import org.example.pojo.Result;
import org.example.pojo.Student;
import org.example.pojo.StudentQueryParam;
import org.example.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    StudentService studentService;

    /*
    * 学员分页显示
    * */
    @GetMapping
    @Permission("student.list")
    public Result page(StudentQueryParam studentQueryParam){
        log.info("学员分页查询#{}",studentQueryParam);
        PageResult<Student> pageResult = studentService.page(studentQueryParam);
        return Result.success(pageResult);
    }

    /*
    * 根据ID查询
    * */
    @GetMapping("/{id}")
    @Permission("student.view")
    public Result getInfoById(@PathVariable Integer id){
        log.info("根据id查询学员id为：{}",id);
        Student student = studentService.getInfoById(id);
        return Result.success(student);
    }

    /*
    * 修改
    * */
    @Log
    @PutMapping
    @Permission("student.edit")
    public Result update(@RequestBody Student student){
        studentService.update(student);
        return Result.success();
    }

    /*
    * 添加
    * */
    @Log
    @PostMapping
    @Permission("student.create")
    public Result insert(@RequestBody Student student){
        studentService.insert(student);
        return Result.success();
    }

    /*
    * 批量删除
    * */
    @DeleteMapping("/{ids}")
    @Permission("student.delete")
    public Result deleteBatch(@PathVariable List<Long> ids){
        studentService.deleteBatch(ids);
        return Result.success();
    }

    /*
    * 违纪处理
    * */
    @PutMapping("/violation/{id}/{score}")
    @Permission("student.violation")
    public Result updateViolation(@PathVariable Integer id, @PathVariable Integer score){
        studentService.updateViolation(id, score);
        return Result.success();
    }
}