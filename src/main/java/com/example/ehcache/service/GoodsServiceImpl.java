package com.example.ehcache.service;

import com.example.ehcache.mapper.GoodsMapper;
import com.example.ehcache.entity.Goods;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import java.util.List;

/**
 * Created by Administrator on 2018/9/4.
 */
public class GoodsServiceImpl{

    @Autowired
    GoodsMapper goodsMapper;

    @Cacheable(value="goods")
    public List<Goods> getGoodsList(){
        return goodsMapper.getGoodsList();
    }

    @CacheEvict(value="goods")
    public int deleteGoods(String goodsId){
        return goodsMapper.deleteGoods(goodsId);
    }

    @CachePut(value="goods")
    public int updateGoods(String goodsId){
        return goodsMapper.updateGoods(goodsId);
    }

}
