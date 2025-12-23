package org.example.service;

import org.example.pojo.Clazz;
import org.example.pojo.ClazzQueryParam;
import org.example.pojo.PageResult;

import java.util.List;

public interface ClazzService {

    /*
    * 查询所有班级信息
    * */
    PageResult<Clazz> getClazzPage(ClazzQueryParam clazzQueryParam);

    /*
    * 新增班级信息
    * */
    void saveClazz(Clazz clazz);

    /*
    * 根据id查询班级信息
    * */
    Clazz getInfoById(Integer id);

    /*
    * 修改班级信息
    * */
    void updateClazz(Clazz clazz);

    /*
    * 删除班级信息
    * */
    void deleteClazz(Integer id);

    /*
    * 查询所有班级
    * */
    List<Clazz> clazzList();
}
