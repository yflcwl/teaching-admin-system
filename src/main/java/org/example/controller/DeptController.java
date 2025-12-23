package org.example.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.anno.Log;
import org.example.anno.Permission;
import org.example.pojo.Dept;
import org.example.pojo.Result;
import org.example.service.DeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequestMapping("/depts")
@RestController
public class DeptController {

    @Autowired
    private DeptService deptService;

//    @RequestMapping(value = "/depts", method = RequestMethod.GET)
    @GetMapping
    @Permission("dept.list")
    public Result list(){
        System.out.println("查询全部部门数据");
        List<Dept> deptList = deptService.findAll();
        return Result.success(deptList);
    }

    /*
    * 根据id删除部门
    * */
    @Log
    @DeleteMapping
    @Permission("dept.delete")
    //RequestParam中参数是前端传递过来的参数名id
    //再把id绑定给depId
    public Result delete(Integer id){
        deptService.deleteById(id);
        System.out.println("根据id删除部门：" + id);
        return Result.success();
    }

    /*
    * 新增部门
    * */
    @Log
    @PostMapping
    @Permission("dept.create")
    public Result insert(@RequestBody Dept dept){
        deptService.insert(dept);
        System.out.println("插入部门id: " + dept);
        return Result.success();
    }

    /*
    * 根据id查询部门
    * */
    @GetMapping("/{id}")
    @Permission("dept.view")
    public Result getInfo(@PathVariable Integer id){
        Dept dept = deptService.getById(id);
        System.out.println("根据id查询的数据：" + dept);
        return Result.success(dept);
    }

    /*
    * 修改部门
    * */
    @Log
    @PutMapping
    @Permission("dept.edit")
    public Result update(@RequestBody Dept dept){
        log.info("修改部门：" + dept);
        deptService.update(dept);
        return Result.success(dept);
    }
}