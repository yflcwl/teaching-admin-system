package org.example.mapper;

import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.example.pojo.Emp;
import org.example.pojo.EmpQueryParam;

import java.util.List;
import java.util.Map;

/*
* 员工信息
* */
@Mapper
public interface EmpMapper {

    /*
     * 查询总记录数
     * */
    /*@Select("SELECT count(*) from emp e left join dept d on e.dept_id = d.id")
    public Long count();
    @Select("select e.* , d.name deptName from emp e left join dept d on e.dept_id = d.id order by e.update_time desc limit #{start},#{pageSize}")
    public List<Emp> list(Integer start, Integer pageSize);*/

    public List<Emp> list(EmpQueryParam empQueryParam);

    /*
    * 新增员工信息
    * */
    //获取到生成的主键
    public void insert(Emp emp);

    /*
    * 根据ID删除员工的基本信息
    * */
    void deleteByIds(List<Integer> ids);

    /*
    * 根据id查询员工信息及工作经历信息
    * */
    Emp getById(Integer id);

    /*
    * 根据id更新员工基本信息
    * */
    void updateById(Emp emp);

    /*
    * 统计员工职位人数
    * */
    @MapKey("pos")
    List<Map<String, Object>> countEmpJobData();

    /*
    * 统计员工性别
    * */
    @MapKey("name")
    List<Map<String, Object>> countEmpGenderData();

    /*
     * 查询所有班主任
     * */
    @Select("SELECT * from emp")
    List<Emp> getEmps();

    /*
     * 根据用户名和密码查询员工信息
     * */
    @Select("SELECT * from emp where username = #{username} and password = #{password}")
    Emp selectByUsernameAndPassword(String username, String password);
    
    /*
     * 根据ID查询员工职位
     * */
    @Select("SELECT job FROM emp WHERE id = #{id}")
    Integer selectJobById(Integer id);
}