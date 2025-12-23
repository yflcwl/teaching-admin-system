package org.example.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.example.mapper.OperateLogMapper;
import org.example.pojo.OperateLog;
import org.example.utils.CurrentHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Arrays;

@Slf4j
@Aspect
@Component
public class OperateLogAspect {

    @Autowired
    private OperateLogMapper operateLogMapper;

    /**
     * 定义切入点：拦截org.example.controller包下所有增删改方法
     */
    @Around("@annotation(org.example.anno.Log)")
    public Object recordOperateLog(ProceedingJoinPoint joinPoint) throws Throwable {
        // 获取方法签名信息
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = joinPoint.getTarget().getClass().getName();
        String methodName = signature.getName();
        
        // 获取请求参数
        String params = Arrays.toString(joinPoint.getArgs());
        
        // 获取操作用户ID（从请求头或session中获取）
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        Integer operateEmpId = getOperateEmpId(request);
        
        // 记录开始时间
        long startTime = System.currentTimeMillis();
        
        // 执行目标方法
        Object result = joinPoint.proceed();
        
        // 计算执行耗时
        long costTime = System.currentTimeMillis() - startTime;
        
        // 构建操作日志对象
        OperateLog operateLog = new OperateLog();
        operateLog.setOperateEmpId(operateEmpId);
        operateLog.setOperateTime(LocalDateTime.now());
        operateLog.setClassName(className);
        operateLog.setMethodName(methodName);
        operateLog.setMethodParams(params);
        operateLog.setReturnValue(result != null ? result.toString() : "null");
        operateLog.setCostTime(costTime);

        // 保存操作日志
        log.info("记录操作日志：{}", log);

        operateLogMapper.insert(operateLog);
        
        return result;
    }

    /**
     * 从请求中获取操作人ID
     * 实际项目中可根据具体认证方式调整
     */
    private Integer getOperateEmpId(HttpServletRequest request) {
        return CurrentHolder.getCurrentId();
    }
}