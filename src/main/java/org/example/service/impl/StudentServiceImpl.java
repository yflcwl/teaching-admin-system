package org.example.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.example.mapper.StudentMapper;
import org.example.pojo.PageResult;
import org.example.pojo.Student;
import org.example.pojo.StudentQueryParam;
import org.example.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentMapper studentMapper;

    /*
     * 学员分页显示
     * */
    @Override
    public PageResult<Student> page(StudentQueryParam studentQueryParam) {
        PageHelper.startPage(studentQueryParam.getPage(), studentQueryParam.getPageSize());
        List<Student> studentList = studentMapper.page(studentQueryParam);
        Page<Student> p = (Page<Student>)studentList;
        return new PageResult<Student>(p.getTotal(), p.getResult());
    }

    /*
    * 根据ID查询
    * */
    @Override
    public Student getInfoById(Integer id) {
        return studentMapper.getInfoById(id);
    }

    /*
    * 修改学员信息
    * */
    @Override
    public void update(Student student) {
        studentMapper.update(student);
    }

    /*
    * 添加
    * */
    @Override
    public void insert(Student student) {
        studentMapper.insert(student);
    }

    /*
    * 批量删除
    * */
    @Override
    public void deleteBatch(List<Long> ids) {
        studentMapper.deleteBatch(ids);
    }

    /*
     * 违纪处理
     * */
    @Override
    public void updateViolation(Integer id, Integer score) {

        studentMapper.updateViolation(id, score);
    }
}
