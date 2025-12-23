package org.example.mapper;

import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.example.pojo.Student;
import org.example.pojo.StudentQueryParam;

import java.util.List;
import java.util.Map;

@Mapper
public interface StudentMapper {

    /*
     * 查询班级下学生人数
     * */
    @Select("SELECT COUNT(*) FROM student WHERE clazz_id = #{id};")
    public Integer selectById(Integer id);

    /*
    * 分页查询学员
    * */
    List<Student> page(StudentQueryParam param);

    /*
    * 根据id查询学员
    * */
    @Select("SELECT * FROM student where id = #{id}")
    Student getInfoById(Integer id);

    /*
    *修改学员信息
    * */
    void update(Student student);

    /*
    * 新增
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

    @MapKey("name")
    List<Map<String, Object>> studentDegreeData();

}
