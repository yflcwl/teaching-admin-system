package org.example.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.example.anno.Permission;
import org.example.exception.AccessDeniedException;
import org.example.mapper.EmpMapper;
import org.example.utils.CurrentHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;

@Slf4j
@Aspect
@Component
public class PermissionAspect {
    
    @Autowired
    private EmpMapper empMapper;

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

    @Before("@annotation(permission)")
    public void checkPermission(Permission permission) {
        // 获取当前用户ID
        Integer empId = CurrentHolder.getCurrentId();
        if (empId == null) {
            throw new AccessDeniedException("用户未登录");
        }

        // 获取当前用户角色/权限（简化实现，实际应从数据库查询）
        // 这里我们假设可以通过某种方式获取到当前用户的职位
        //HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        Integer job = getCurrentUserJob(empId); // 简化实现
        
        Set<String> permissions = getPermissionsByJob(job);
        
        // 检查是否有对应权限
        if (!permissions.contains(permission.value())) {
            log.warn("用户 {} 尝试执行无权限的操作: {}", empId, permission.value());
            throw new AccessDeniedException("您没有执行此操作的权限: " + permission.value());
        }
        
        log.info("用户 {} 执行操作: {}", empId, permission.value());
    }
    
    // 从数据库查询用户职位
    private Integer getCurrentUserJob(Integer empId) {
        // 从数据库查询用户职位
        return empMapper.selectJobById(empId);
    }
}