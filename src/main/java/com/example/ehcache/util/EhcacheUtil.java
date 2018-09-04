package com.example.ehcache.util;

import net.sf.ehcache.CacheManager;
import net.sf.ehcache.CacheException;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by lmb on 2018/5/23.
 * 基于Ehcache框架的Ehcache操作工具类
 */
public class EhcacheUtil {

    /**
     * CacheManage是Ehcache框架的核心接口和类，负责管理一个或多个Cache对象
     */
    private static final CacheManager CACHE_MANAGER = createCacheManager();

    /**
     * 描  述: 根据ehcache.xml，创建CacheManager生产器
     * 参  数:
     * 返回值: net.sf.ehcache.CacheManager
     * 创建时间: 2018/5/23
     */
    private static CacheManager createCacheManager() {
        CacheManager cacheManager;
        InputStream input = EhcacheUtil.class.getResourceAsStream("/ehcache.xml");

        if (input != null) {
            try {
                cacheManager = CacheManager.create(input);
            } catch (Throwable t) {
                cacheManager = CacheManager.create();
            } finally {
                try {
                    input.close();
                } catch (IOException e) {
                }
            }
        } else {
            cacheManager = CacheManager.create();
        }

        return cacheManager;
    }

    /**
     * The cache id.
     */
    private final String id;

    /**
     * 创建EhCache
     */
    public EhcacheUtil(){
        this.id = this.getClass().getName();
        if (!CACHE_MANAGER.cacheExists(this.id)) {
            CACHE_MANAGER.addCache(this.id);
        }
    }

    /**
     * 得到当前缓存
     * @return
     */
    private Ehcache getCache() {
        return CACHE_MANAGER.getCache(this.id);
    }

    /**
     * 写入EhCache，当前实例对象T,同时转成Json格式
     * @param key
     * @param value
     * @param <T>
     */
    public <T> void set(String key, T value){
        setObject(key, JSON.toJSONString(value));
    }

    /**
     * 写入EhCache，字符串对象
     * @param key
     * @param value
     */
    public void set(String key, String value){
        setObject(key,value);
    }

    /**
     * 写入EhCache，当前实例对象T, 同时转成Json格式，并设置失效时间
     * @param key
     * @param value
     * @param time
     * @param <T>
     */
    public <T> void setex(String key, T value, int time){
        setexObject(key,JSON.toJSONString(value),time);
    }

    /**
     * 写入EhCache，字符串对象，并设置失效时间
     * @param key
     * @param value
     * @param time
     */
    public void setex(String key, String value, int time){
        setexObject(key,value,time);
    }

    /**
     * 存入EhCache缓存
     * @param key
     * @param value
     */
    public void setObject(String key, Object value) {
        try {
            this.getCache().put(new Element(key, value));
        } catch (Throwable t) {
            throw new CacheException(t.getMessage(),t);
        }
    }

    /**
     * 存入EhCache缓存，并设置失效时间
     * @param key
     * @param value
     * @param time
     */
    public void setexObject(String key, Object value, int time) {
        Element element = new Element(key, value);
        element.setTimeToLive(time);
        try {
            this.getCache().put(element);
        } catch (Throwable t) {
            throw new CacheException(t.getMessage(),t);
        }
    }

    /**
     * 获取EhCache对象，字符串对象
     * @param key
     * @return
     */
    public String get(String key){
        Object value = getObject(key);
        return value == null ? "" : value.toString();
    }

    /**
     * 获取EhCache对象，当前实例对象T
     * @param key
     * @param clazz
     * @param <T>
     * @return
     */
    public <T> T get(String key, Class<T> clazz){
        Object obj = getObject(key);
        if(obj == null){
            return null;
        }
        return JSON.parseObject(getObject(key).toString(),clazz);
    }

    /**
     * 根据Key获取缓存对象
     * @param key
     * @return
     */
    public Object getObject(String key) {
        try {
            Element cachedElement = this.getCache().get(key);
            if (cachedElement == null) {
                return null;
            }
            return cachedElement.getObjectValue();
        } catch (Exception t) {
            throw new CacheException(t.getMessage(),t);
        }
    }

    /**
     * 删除当前Cache的key
     * @param key
     */
    public void remove(String key) {
        try {
            this.getCache().remove(key);
        } catch (Throwable t) {
            throw new CacheException(t.getMessage(),t);
        }
    }

    /**
     * 获取当前Cache的数目
     * @return
     */
    public Long dbSize() {
        try {
            return Long.valueOf(this.getCache().getSize());
        } catch (Throwable t) {
            throw new CacheException(t.getMessage(),t);
        }
    }

    /**
     * 清空当前Cache的所有缓存
     */
    public void flushDB() {
        this.getCache().removeAll();
    }


    /**
     * 重写hashCode
     * @return
     */
    @Override
    public int hashCode() {
        return this.id.hashCode();
    }

    /**
     * 重写toString
     * @return
     */
    @Override
    public String toString() {
        return "EHCache {" + this.id + "}";
    }
}
