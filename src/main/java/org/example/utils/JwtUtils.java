package org.example.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT工具类
 */
public class JwtUtils {

    // 签名密钥（与测试类一致）
    private static final String SECRET_KEY = "eWZsY2Nj";
    
    // 过期时间
    private static final long EXPIRATION_TIME = 122 * 60 * 60 * 1000;

    /**
     * 生成JWT令牌
     * @param claims 自定义信息
     * @return JWT令牌
     */
    public static String generateToken(Map<String, Object> claims) {
        return Jwts.builder()
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // 指定加密算法和密钥
                .addClaims(claims) // 添加自定义信息
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 设置过期时间
                .compact(); // 生成令牌
    }

    /**
     * 解析JWT令牌
     * @param token JWT令牌
     * @return 解析后的Claims对象（包含payload信息）
     */
    public static Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY) // 设置签名密钥
                .parseClaimsJws(token) // 解析签名后的令牌
                .getBody(); // 获取payload
    }

    // 测试方法（可选）
    public static void main(String[] args) {
        // 测试生成令牌
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", 1);
        claims.put("username", "admin");
        String token = generateToken(claims);
        System.out.println("生成的Token: " + token);

        // 测试解析令牌
        Claims parsedClaims = parseToken(token);
        System.out.println("解析的Claims: " + parsedClaims);
    }
}