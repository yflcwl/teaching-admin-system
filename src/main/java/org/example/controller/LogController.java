package org.example.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.mapper.OperateLogMapper;
import org.example.pojo.OperateLog;
import org.example.pojo.PageResult;
import org.example.pojo.Result;
import org.example.service.EmpLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/log")
public class LogController {

    @Autowired
    private OperateLogMapper operateLogMapper;
    @Autowired
    private EmpLogService empLogService;

    @GetMapping("/page")
    public Result page(@RequestParam Integer page, @RequestParam Integer pageSize) {
        log.info("日志分页查询");
        PageResult<OperateLog> pageResult = empLogService.page(page, pageSize);
        return Result.success(pageResult);
    }
}