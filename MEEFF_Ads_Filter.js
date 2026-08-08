/**
 * MEEFF 广告过滤脚本（Shadowrocket http-response）
 * 适用：api.meeff.com 返回 JSON 的接口
 * 作用：删除响应中明显标记为广告的节点/字段，尽力保留正常数据。
 * 注意：属“尽力而为”的启发式过滤，随 MEEFF 版本变化可能需要调整。
 */

// 需要整段删除的“广告字段名”（仅精确匹配）
var AD_KEYS = /^(ad|ads|adlist|adslist|advert|adverts|advertisement|advertisements|advertising|banner|banners|interstitial|interstitials|splash|sponsor|sponsored|promotion|promoted|nativead|nativeads|native_ad|native_ads|adunit|ad_unit|adinfo|ad_info|aditems?|ad_items?|addata|ad_data)$/i;

// 对象里出现这些标记时，视为广告对象
var AD_MARKER_KEYS = ['isAd', 'is_ad', 'adType', 'ad_type', 'advertiser', 'advertiserName', 'adId', 'ad_id', 'adUnit', 'ad_unit', 'creativeId', 'creative_id', 'campaignId', 'campaign_id'];

function looksLikeAd(obj) {
  if (obj === true) return true;
  if (typeof obj === 'string') {
    return /^(ad|ads|advertisement|advertising|sponsored|promoted)$/i.test(obj);
  }
  if (obj && typeof obj === 'object') {
    for (var i = 0; i < AD_MARKER_KEYS.length; i++) {
      if (AD_MARKER_KEYS[i] in obj) return true;
    }
    var type = obj.type || obj.adType || obj.ad_type || obj.adUnit || obj.ad_unit;
    if (typeof type === 'string' && /^(ad|ads|advertisement|advertising|sponsored|promoted|nativead|native_ad)$/i.test(type)) return true;
    if (obj.isAd === true || obj.is_ad === true || obj.sponsored === true || obj.promoted === true) return true;
  }
  return false;
}

function walk(node) {
  if (Array.isArray(node)) {
    var kept = [];
    for (var i = 0; i < node.length; i++) {
      var item = node[i];
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        if (looksLikeAd(item)) continue; // 丢弃明显的广告对象
      }
      kept.push(walk(item));
    }
    return kept;
  }
  if (node && typeof node === 'object') {
    Object.keys(node).forEach(function (k) {
      if (AD_KEYS.test(k)) {
        delete node[k]; // 删除整段广告字段
        return;
      }
      node[k] = walk(node[k]);
    });
    return node;
  }
  return node;
}

try {
  var body = $response.body;
  var json = JSON.parse(body);
  $response.body = JSON.stringify(walk(json));
  if ($response.headers) {
    delete $response.headers['Content-Length'];
    delete $response.headers['content-length'];
  }
} catch (e) {
  // 非 JSON 或解析失败时原样返回
}

$done({ response: $response });
