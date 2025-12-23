package org.example.service;

import org.example.pojo.ClazzOption;
import org.example.pojo.JobOption;

import java.util.List;
import java.util.Map;

public interface ReportService {

    /*
    * 统计员工职位人数
    * */
    JobOption getEmpJobData();

    /*
    * 统计员工性别数量
    * */
    List<Map<String, Object>> getEmpGenderData();

    /*
    * 班级人数统计
    * */
    ClazzOption studentCountData();

    /*
    * 学历人数统计
    * */
    List<Map<String, Object>> studentDegreeData();
}
