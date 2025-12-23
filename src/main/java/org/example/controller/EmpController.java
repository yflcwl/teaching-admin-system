package org.example.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.anno.Log;
import org.example.anno.Permission;
import org.example.mapper.EmpExprMapper;
import org.example.pojo.*;
import org.example.service.EmpService;
import org.example.utils.CurrentHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Set;

/*
* 员工管理Controller
* */
@Slf4j
@RequestMapping("/emps")
@RestController
public class EmpController {

    @Autowired
    private EmpService empService;
    @Autowired
    private EmpExprMapper empExprMapper;

    // 获取当前用户权限的接口
    @GetMapping("/permissions")
    public Result getCurrentUserPermissions(HttpServletRequest request) {
        // 从请求上下文中获取当前用户ID
        Integer empId = CurrentHolder.getCurrentId();
        if (empId == null) {
            return Result.error("用户未登录");
        }
        
        // 获取当前用户的角色
        Emp emp = empService.getInfo(empId);
        if (emp == null) {
            return Result.error("用户信息不存在");
        }
        
        // 根据用户角色获取权限集合
        Set<String> permissions = getPermissionsByJob(emp.getJob());
        return Result.success(permissions);
    }
    
    // 根据职位获取权限集合的方法（从PermissionAspect复制）
    private Set<String> getPermissionsByJob(Integer job) {
        // 所有角色都具有基本的查看权限
        Set<String> basePermissions = Set.of("student.view", "student.list", "report.view", "log.view");
        
        // 根据员工职位确定额外权限集合
        switch (job) {
            case 1: // 班主任
                // 班主任具有基本权限加上编辑和创建学生信息的权限
                return Set.of("student.view", "student.edit", "student.list", "student.create", 
                             "report.view", "log.view");
            case 2: // 讲师
                // 讲师具有基本权限
                return basePermissions;
            case 3: // 学工主管
                // 学工主管具有所有权限
                return Set.of("emp.view", "emp.edit", "emp.list", "emp.create", "emp.delete", 
                             "student.view", "student.edit", "student.list", "student.create", "student.delete",
                             "dept.view", "dept.list", "dept.create", "dept.edit", "dept.delete",
                             "report.view", "log.view","clazz.create","clazz.edit", "clazz.view", "clazz.list","clazz.delete");
            case 4: // 教研主管
                // 教研主管具有基本权限加上课程管理权限
                return Set.of("course.view", "course.edit", "report.view", "log.view");
            case 5: // 咨询师
                // 咨询师具有基本权限加上编辑和创建学生信息的权限
                return Set.of("student.view", "student.edit", "student.list", "student.create", 
                             "report.view", "log.view");
            default:
                // 普通用户具有基本权限
                return basePermissions;
        }
    }

    @GetMapping
    @Permission("emp.list")
    public Result page(EmpQueryParam empQueryParam){
        log.info("员工分页查询：{}", empQueryParam);
        PageResult<Emp> pageResult = empService.page(empQueryParam);
        return Result.success(pageResult);
    }

    /*
    * 新增保存员工信息
    * */
    @Log
    @PostMapping
    @Permission("emp.create")
    public Result save(@RequestBody Emp emp){
        //员工信息
        log.info("新增员工{}",emp);
        empService.save(emp);

        //新增员工工作经历表
        List<EmpExpr> exprList = emp.getExprList();
        if (!CollectionUtils.isEmpty(exprList))
            empExprMapper.insertBatch(exprList);

        return Result.success();
    }

    /*
    * 删除员工
    * */
    @Log
    @DeleteMapping
    @Permission("emp.delete")
    public Result delete(@RequestParam List<Integer> ids){
        log.info("删除员工:{}", ids);
        empService.delete(ids);
        return Result.success();
    }

    /*
    * 根据id查询员工信息
    * */
    @GetMapping("/{id}")
    @Permission("emp.view")
    public Result getInfo(@PathVariable Integer id){
        log.info("根据id查询员工信息：{}", id);
        Emp emp = empService.getInfo(id);
        return Result.success(emp);
    }

    /*
    * 修改员工信息
    * */
    @Log
    @PutMapping
    @Permission("emp.edit")
    public Result update(@RequestBody Emp emp){
        log.info("修改员工信息：{}", emp);
        empService.update(emp);
        return Result.success();
    }

    /*
     * 获取老师名称
     * */
    @GetMapping("/list")
    @Permission("emp.list")
    public Result getEmps(){
        List<Emp> emps = empService.getEmps();

        return Result.success(emps);
    }
}