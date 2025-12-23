package org.example.service;

import org.example.pojo.PageResult;
import org.example.pojo.Student;
import org.example.pojo.StudentQueryParam;

import java.util.List;

public interface StudentService {

    /*
     * 学员分页显示
     * */
    PageResult<Student> page(StudentQueryParam studentQueryParam);

    /*
    *根据ID查询
    * */
    Student getInfoById(Integer id);

    /*
    * 修改学员信息
    * */
    void update(Student student);

    /*
    * 添加
    * */
    void insert(Student student);

   /*
   * 批量删除
   * */
    void deleteBatch(List<Long> ids);

    /*
    * 违纪处理
    * */
    void updateViolation(Integer id, Integer score);
}
