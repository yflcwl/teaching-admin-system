package org.example.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.example.pojo.OperateLog;

import java.util.List;

@Mapper
public interface OperateLogMapper {

    //插入日志数据
    @Insert("insert into operate_log (operate_emp_id, operate_time, class_name, method_name, method_params, return_value, cost_time) " +
            "values (#{operateEmpId}, #{operateTime}, #{className}, #{methodName}, #{methodParams}, #{returnValue}, #{costTime});")
    public void insert(OperateLog log);

    //查询日志数据
//    @Select("SELECT * FROM operate_log ORDER BY operate_time DESC")
    @Select("SELECT o.*,e.name as operate_emp_name FROM operate_log o LEFT JOIN emp e on o.operate_emp_id=e.id ORDER BY o.operate_time DESC")
    public List<OperateLog> list();
}