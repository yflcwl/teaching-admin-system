package org.example.service;

import org.example.pojo.EmpLog;
import org.example.pojo.OperateLog;
import org.example.pojo.PageResult;

public interface EmpLogService {

    public void insertLog(EmpLog empLog);
    /*
    * 分页查询日志
    * */
    PageResult<OperateLog> page(Integer page, Integer pageSize);
}
