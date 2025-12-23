package org.example.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.anno.Log;
import org.example.anno.Permission;
import org.example.pojo.Clazz;
import org.example.pojo.ClazzQueryParam;
import org.example.pojo.PageResult;
import org.example.pojo.Result;
import org.example.service.ClazzService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/clazzs")
public class ClazzController {

    @Autowired
    private ClazzService clazzService;

    /*
    * 班级分页查询
    * */
    @GetMapping
    @Permission("clazz.list")
    public Result getClazzPage(ClazzQueryParam clazzQueryParam){
        log.info("班级分页查询：{}",clazzQueryParam);
        PageResult<Clazz> pageResult = clazzService.getClazzPage(clazzQueryParam);

        return Result.success(pageResult);
    }

    /*
    * 新增班级信息
    * */
    @Log
    @PostMapping
    @Permission("clazz.create")
    public Result saveClazz(@RequestBody Clazz clazz){
        log.info("新增班级信息:#{}",clazz);
        clazzService.saveClazz(clazz);
        return Result.success();
    }

    /*
    * 根据id查询班级信息
    * */
    @GetMapping("/{id}")
    @Permission("clazz.view")
    public Result getInfoById(@PathVariable Integer id){
        log.info("根据id为#{}的班级信息",id);
        Clazz clazz = clazzService.getInfoById(id);
        return Result.success(clazz);
    }

    /*
    * 修改班级信息
    * */
    @Log
    @PutMapping
    @Permission("clazz.edit")
    public Result updateClazz(@RequestBody Clazz clazz){
        log.info("修改班级信息:#{}",clazz);
        clazzService.updateClazz(clazz);
        return Result.success();
    }

    /*
    * 删除班级信息
    * */
    @Log
    @DeleteMapping("/{id}")
    @Permission("clazz.delete")
    public Result deleteClazz(@PathVariable Integer id){
        clazzService.deleteClazz(id);
        log.info("删除成功id为#{}的课程",id);
        return Result.success();
    }

    /*
    * 查询所有班级
    * */
    @GetMapping("/list")
    public Result clazzList(){
        List<Clazz> clazzList = clazzService.clazzList();
        return Result.success(clazzList);
    }

}
