package com.example.ehcache.mapper;

import com.example.ehcache.entity.Goods;
import java.util.List;

/**
 * Created by Administrator on 2018/9/4.
 */
public interface GoodsMapper {

    List<Goods> getGoodsList();

    int deleteGoods(String goodsId);

    int updateGoods(String goodsId);
}
