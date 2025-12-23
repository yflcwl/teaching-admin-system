package org.example.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.example.pojo.Clazz;
import org.example.pojo.ClazzQueryParam;

import java.util.List;
import java.util.Map;

@Mapper
public interface ClazzMapper {

    /*
    * 查询班级总记录数
    * */
    public List<Clazz> list(ClazzQueryParam clazzQueryParam);

    /*
    * 新增班级信息
    * */
    @Select("INSERT INTO clazz (name, room, begin_date, end_date, master_id, subject, create_time, update_time) \n" +
            "VALUES (#{name}, #{room}, #{beginDate}, #{endDate}, #{masterId}, #{subject}, NOW(), NOW())")
    public void insertClazz(Clazz clazz);

    /*
    * 根据id查询班级信息
    * */
    @Select("select * from clazz where id = #{id};")
    public Clazz getInfoById(Integer id);

    /*
    * 修改班级信息
    * */
    public void updateClazz(Clazz clazz);

    /*
    * 删除班级信息
    * */
    @Delete("DELETE FROM clazz WHERE id = #{id}")
    public void deleteClazz(Integer id);


    /*
    * 查询所有班级
    * */
    @Select("SELECT * from clazz")
    List<Clazz> clazzList();

    /*
    * 统计班级人数
    * */
    @MapKey("name")
    List<Map<String, Object>> studentCountData();
}
