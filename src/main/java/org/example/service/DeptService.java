package org.example.service;

import org.example.pojo.Dept;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DeptService {
    /*
     * 查询所有部门数据
     * */
    List<Dept> findAll();

    /*
     * 根据ID删除部门
     * */
    void deleteById(Integer id);

    /*
     *  新增部门
     * */
    void insert(Dept dept);

    /*
     * 根据ID查询数据
     * */
    Dept getById(Integer id);

    /*
     * 根据id，姓名查询数据
     * */
    void update(Dept dept);
}
