package org.example.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.example.exception.BusinessException;
import org.example.mapper.ClazzMapper;
import org.example.mapper.StudentMapper;
import org.example.pojo.Clazz;
import org.example.pojo.ClazzQueryParam;
import org.example.pojo.PageResult;
import org.example.service.ClazzService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class ClazzServiceImpl implements ClazzService {

    @Autowired
    private ClazzMapper clazzMapper;
    @Autowired
    private StudentMapper studentMapper;

    /*
    * 分页查询所有班级信息
    * */
    @Override
    public PageResult<Clazz> getClazzPage(ClazzQueryParam clazzQueryParam) {
        PageHelper.startPage(clazzQueryParam.getPage(), clazzQueryParam.getPageSize());

        List<Clazz> ClassList = clazzMapper.list(clazzQueryParam);
        Page<Clazz> p = (Page<Clazz>)ClassList;

        return new PageResult<Clazz>(p.getTotal(),p.getResult());
    }

    /*
    * 新增班级信息
    * */
    @Override
    public void saveClazz(Clazz clazz) {
        clazzMapper.insertClazz(clazz);
    }

    /*
    * 根据id查询班级信息
    * */
    @Override
    public Clazz getInfoById(Integer id) {
        Clazz clazz = clazzMapper.getInfoById(id);
        return clazz;
    }

    /*
    * 修改班级信息
    * */
    @Override
    public void updateClazz(Clazz clazz) {
        clazzMapper.updateClazz(clazz);
    }

    /*
    * 删除班级信息
    * */
    @Override
    public void deleteClazz(Integer id) {
        if (studentMapper.selectById(id) > 0){
            throw new BusinessException("对不起，该班级下有学生，不能直接删除");
        }

        clazzMapper.deleteClazz(id);

    }

    /*
    * 查询所有班级
    * */
    @Override
    public List<Clazz> clazzList() {
        return clazzMapper.clazzList();
    }
}
