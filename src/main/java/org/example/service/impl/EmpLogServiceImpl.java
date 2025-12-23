package org.example.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.example.mapper.EmpLogMapper;
import org.example.mapper.OperateLogMapper;
import org.example.pojo.EmpLog;
import org.example.pojo.OperateLog;
import org.example.pojo.PageResult;
import org.example.service.EmpLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmpLogServiceImpl implements EmpLogService {

    @Autowired
    private EmpLogMapper empLogMapper;
    @Autowired
    private OperateLogMapper operateLogMapper;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public void insertLog(EmpLog empLog) {
        empLogMapper.insert(empLog);
    }

    /*
    * 分页查询日志
    * */
    @Override
    public PageResult<OperateLog> page(Integer page, Integer pageSize) {
        PageHelper.startPage(page, pageSize);
        List<OperateLog> operateLogList = operateLogMapper.list();
        Page<OperateLog> p = (Page<OperateLog>)operateLogList;
        return new PageResult<>(p.getTotal(), p.getResult());
    }
}
