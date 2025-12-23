package org.example.service;

import org.example.pojo.Emp;
import org.example.pojo.EmpQueryParam;
import org.example.pojo.LoginInfo;
import org.example.pojo.PageResult;

import java.util.List;

public interface EmpService {
    /*
    * 分页查询
    * @Param page 页码
    * @Param pageSize 每页记录数
    * */
    PageResult<Emp> page(EmpQueryParam empQueryParam);

    /*
    * 保存员工信息
    * */
    void save(Emp emp);

    /*
    *批量删除员工信息
    * */
    void delete(List<Integer> ids);

    /*
    * 根据id查询员工信息
    * */
    Emp getInfo(Integer id);

    /*
    * 修改员工基本信息
    * */
    void update(Emp emp);

    /*
     * 获取老师全部信息
     * */
    List<Emp> getEmps();

    /*
     * 员工登录
     * */
    LoginInfo login(Emp emp);
}
