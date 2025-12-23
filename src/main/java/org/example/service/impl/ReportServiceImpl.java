package org.example.service.impl;

import org.example.mapper.ClazzMapper;
import org.example.mapper.EmpMapper;
import org.example.mapper.StudentMapper;
import org.example.pojo.ClazzOption;
import org.example.pojo.JobOption;
import org.example.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private EmpMapper empMapper;
    @Autowired
    private ClazzMapper clazzMapper;
    @Autowired
    private StudentMapper studentMapper;

    @Override
    public JobOption getEmpJobData() {

        //1.调用mapper接口，获取统计数据
        List<Map<String, Object>> list = empMapper.countEmpJobData();

        //2.组装结果，并返回
        List<Object> jobList = list.stream()
                .map(dataMap -> dataMap.get("pos"))
                .toList();

        List<Object> dataList = list.stream()
                .map(dataMap -> dataMap.get("num"))
                .toList();
        return new JobOption(jobList, dataList);
    }

    @Override
    public List<Map<String, Object>> getEmpGenderData() {
        return empMapper.countEmpGenderData();
    }

    /*
    * 班级人数统计
    * */
    @Override
    public ClazzOption studentCountData() {
        List<Map<String, Object>> maps = clazzMapper.studentCountData();

        List<Object> clazzList = maps.stream().map(map -> map.get("name")).toList();
        List<Object> dataList = maps.stream().map(map -> map.get("value")).toList();

        return new ClazzOption(clazzList, dataList);
    }

    @Override
    public List<Map<String, Object>> studentDegreeData() {
        return studentMapper.studentDegreeData();
    }
}
